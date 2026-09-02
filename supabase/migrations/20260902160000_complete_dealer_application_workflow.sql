-- Batch 5: dealer lead qualification, deliberate conversion, audit history and duplicate safety.
alter type public.enquiry_status add value if not exists 'qualified' after 'contacted';

alter table public.dealer_applications
  add column if not exists whatsapp text,
  add column if not exists business_type text,
  add column if not exists years_in_business integer,
  add column if not exists has_showroom boolean,
  add column if not exists areas_served text,
  add column if not exists product_interests text[],
  add column if not exists consent boolean not null default false,
  add column if not exists submission_token uuid not null default gen_random_uuid();

alter table public.dealer_applications
  add constraint dealer_applications_years_check check (years_in_business is null or years_in_business between 0 and 150),
  add constraint dealer_applications_business_type_check check (business_type is null or business_type = any (array['Furniture Store','Interior Design Company','Hardware Store','Kitchen / Wardrobe Dealer','Architect / Contractor','Home Decor Store','Distributor','Other'])),
  add constraint dealer_applications_product_interests_check check (product_interests is null or product_interests <@ array['Smart Kitchen & Wardrobe Solutions','Hardware Fittings & Aluminium Profiles','Smart Furniture','Home Decor']::text[]);

create unique index if not exists dealer_applications_submission_token_idx on public.dealer_applications(submission_token);
create index if not exists dealer_applications_business_type_idx on public.dealer_applications(business_type);
create index if not exists dealer_applications_location_idx on public.dealer_applications(state, district, location);
create index if not exists dealer_applications_product_interests_idx on public.dealer_applications using gin(product_interests);

drop policy if exists "public submits dealer applications" on public.dealer_applications;
create policy "public submits dealer applications"
on public.dealer_applications for insert to anon, authenticated
with check (
  status = 'new'
  and admin_notes is null
  and dealer_id is null
  and business_type is not null
  and has_showroom is not null
  and nullif(btrim(areas_served), '') is not null
  and cardinality(product_interests) > 0
  and consent = true
);

create table if not exists public.dealer_application_audit_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.dealer_applications(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('application_submitted','status_changed','dealer_created','dealer_updated')),
  from_status public.enquiry_status,
  to_status public.enquiry_status,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists dealer_application_audit_target_idx on public.dealer_application_audit_events(application_id, created_at desc);
alter table public.dealer_application_audit_events enable row level security;
create policy "active admins read dealer application audit events" on public.dealer_application_audit_events for select to authenticated using ((select private.is_active_admin()));
revoke all on public.dealer_application_audit_events from public, anon, authenticated;
grant all on public.dealer_application_audit_events to service_role;

create or replace function public.audit_dealer_application_submission()
returns trigger language plpgsql security definer set search_path = public, pg_catalog as $$
begin
  insert into public.dealer_application_audit_events(application_id, action, to_status)
  values (new.id, 'application_submitted', new.status);
  return new;
end; $$;
drop trigger if exists dealer_application_submitted_audit on public.dealer_applications;
create trigger dealer_application_submitted_audit after insert on public.dealer_applications
for each row execute function public.audit_dealer_application_submission();
revoke all on function public.audit_dealer_application_submission() from public, anon, authenticated;

revoke execute on function public.review_dealer_application(uuid, text, text) from service_role;

create or replace function public.set_dealer_application_status(
  p_application_id uuid,
  p_status text,
  p_actor_user_id uuid
) returns void
language plpgsql security definer set search_path = public, pg_catalog as $$
declare
  v_previous public.enquiry_status;
  v_next public.enquiry_status;
begin
  if p_status not in ('new', 'contacted', 'qualified', 'approved', 'rejected') then
    raise exception 'invalid dealer application status';
  end if;
  v_next := p_status::public.enquiry_status;
  select status into v_previous from public.dealer_applications where id = p_application_id for update;
  if not found then raise exception 'dealer application not found'; end if;
  if v_previous = v_next then return; end if;
  update public.dealer_applications set status = v_next where id = p_application_id;
  insert into public.dealer_application_audit_events(application_id, actor_user_id, action, from_status, to_status)
  values (p_application_id, p_actor_user_id, 'status_changed', v_previous, v_next);
end; $$;
alter function public.set_dealer_application_status(uuid, text, uuid) owner to postgres;
revoke all on function public.set_dealer_application_status(uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.set_dealer_application_status(uuid, text, uuid) to service_role;

create or replace function public.create_dealer_from_application(
  p_application_id uuid,
  p_actor_user_id uuid
) returns uuid
language plpgsql security definer set search_path = public, pg_catalog as $$
declare
  v_application public.dealer_applications%rowtype;
  v_dealer_id uuid;
  v_base_slug text;
  v_slug text;
  v_suffix integer := 2;
begin
  select * into v_application from public.dealer_applications where id = p_application_id for update;
  if not found then raise exception 'dealer application not found'; end if;
  if v_application.status <> 'approved' then raise exception 'application must be approved before dealer creation'; end if;
  if v_application.dealer_id is not null then return v_application.dealer_id; end if;

  v_base_slug := trim(both '-' from regexp_replace(lower(btrim(v_application.business_name)), '[^a-z0-9]+', '-', 'g'));
  if v_base_slug = '' then v_base_slug := 'woodbay-dealer'; end if;
  v_slug := v_base_slug;
  while exists (select 1 from public.dealers where slug = v_slug) loop
    v_slug := v_base_slug || '-' || v_suffix;
    v_suffix := v_suffix + 1;
  end loop;

  insert into public.dealers (business_name, slug, contact_person, phone, email, state, district, area, address, status, is_visible)
  values (v_application.business_name, v_slug, v_application.contact_person, v_application.phone, v_application.email,
    v_application.state, v_application.district, v_application.location,
    coalesce(nullif(btrim(coalesce(v_application.address, '')), ''), v_application.location), 'pending', false)
  returning id into v_dealer_id;

  update public.dealer_applications set dealer_id = v_dealer_id where id = v_application.id;
  insert into public.dealer_application_audit_events(application_id, actor_user_id, action, metadata)
  values (v_application.id, p_actor_user_id, 'dealer_created', jsonb_build_object('dealer_id', v_dealer_id));
  return v_dealer_id;
end; $$;
alter function public.create_dealer_from_application(uuid, uuid) owner to postgres;
revoke all on function public.create_dealer_from_application(uuid, uuid) from public, anon, authenticated;
grant execute on function public.create_dealer_from_application(uuid, uuid) to service_role;
