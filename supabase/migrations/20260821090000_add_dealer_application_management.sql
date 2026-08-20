-- Batch 12: preserve applications while atomically linking approved ones to dealers.
alter table public.dealer_applications
  add column dealer_id uuid unique references public.dealers(id) on delete restrict;

create or replace function public.review_dealer_application(
  p_application_id uuid,
  p_decision text,
  p_admin_notes text default null
) returns uuid
language plpgsql security definer set search_path = public, pg_catalog as $$
declare
  v_application public.dealer_applications%rowtype;
  v_dealer_id uuid;
  v_base_slug text;
  v_slug text;
  v_suffix integer := 2;
begin
  if p_decision not in ('approved', 'rejected') then
    raise exception 'invalid dealer application decision';
  end if;

  select * into v_application from public.dealer_applications where id = p_application_id for update;
  if not found then raise exception 'dealer application not found'; end if;

  if p_decision = 'rejected' then
    update public.dealer_applications
      set status = 'rejected', admin_notes = nullif(btrim(coalesce(p_admin_notes, '')), '')
      where id = v_application.id;
    return v_application.dealer_id;
  end if;

  if v_application.status = 'rejected' then
    raise exception 'rejected dealer application cannot be approved';
  end if;
  if v_application.dealer_id is not null then
    update public.dealer_applications
      set status = 'approved', admin_notes = nullif(btrim(coalesce(p_admin_notes, '')), '')
      where id = v_application.id;
    return v_application.dealer_id;
  end if;

  v_base_slug := trim(both '-' from regexp_replace(lower(btrim(v_application.business_name)), '[^a-z0-9]+', '-', 'g'));
  if v_base_slug = '' then v_base_slug := 'woodbay-dealer'; end if;
  v_slug := v_base_slug;
  while exists (select 1 from public.dealers where slug = v_slug) loop
    v_slug := v_base_slug || '-' || v_suffix;
    v_suffix := v_suffix + 1;
  end loop;

  insert into public.dealers (
    business_name, slug, contact_person, phone, email, state, district, area, address, status, is_visible
  ) values (
    v_application.business_name, v_slug, v_application.contact_person, v_application.phone, v_application.email,
    v_application.state, v_application.district, v_application.location,
    coalesce(nullif(btrim(coalesce(v_application.address, '')), ''), v_application.location),
    'pending', false
  ) returning id into v_dealer_id;

  update public.dealer_applications
    set status = 'approved', dealer_id = v_dealer_id,
        admin_notes = nullif(btrim(coalesce(p_admin_notes, '')), '')
    where id = v_application.id;
  return v_dealer_id;
end; $$;

alter function public.review_dealer_application(uuid, text, text) owner to postgres;
revoke all on function public.review_dealer_application(uuid, text, text) from public, anon, authenticated;
grant execute on function public.review_dealer_application(uuid, text, text) to service_role;
