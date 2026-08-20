-- Batch 11: additive voucher administration metadata and secure generation.
create table public.voucher_batches (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (char_length(btrim(reference)) between 2 and 120),
  quantity_requested integer not null check (quantity_requested between 1 and 500),
  quantity_generated integer not null default 0 check (quantity_generated >= 0),
  value_benefit text,
  expires_at date,
  admin_note text,
  created_by uuid not null references public.admin_profiles(user_id) on delete restrict,
  idempotency_key uuid not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.voucher_codes
  add column batch_id uuid references public.voucher_batches(id) on delete restrict,
  add column value_benefit text,
  add column expires_at date,
  add column admin_note text,
  add column created_by uuid references public.admin_profiles(user_id) on delete restrict;

create table public.voucher_admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.admin_profiles(user_id) on delete restrict,
  action text not null check (action in ('voucher_created', 'batch_generated', 'voucher_disabled')),
  voucher_id uuid references public.voucher_codes(id) on delete restrict,
  batch_id uuid references public.voucher_batches(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  check (voucher_id is not null or batch_id is not null)
);

create index voucher_codes_batch_created_idx on public.voucher_codes(batch_id, created_at desc);
create index voucher_codes_expiry_idx on public.voucher_codes(expires_at) where expires_at is not null;
create index voucher_admin_audit_target_idx on public.voucher_admin_audit_events(voucher_id, created_at desc);

alter table public.voucher_batches enable row level security;
alter table public.voucher_admin_audit_events enable row level security;
create policy "active admins manage voucher batches" on public.voucher_batches for all to authenticated using ((select private.is_active_admin())) with check ((select private.is_active_admin()));
create policy "active admins manage voucher audit events" on public.voucher_admin_audit_events for select to authenticated using ((select private.is_active_admin()));
revoke all on public.voucher_batches, public.voucher_admin_audit_events from public, anon, authenticated;
grant all on public.voucher_batches, public.voucher_admin_audit_events to service_role;

create or replace function public.generate_voucher_batch(
  p_actor_id uuid, p_reference text, p_quantity integer, p_value_benefit text,
  p_expires_at date, p_admin_note text, p_idempotency_key uuid
) returns table(batch_id uuid, created_count integer, batch_reference text)
language plpgsql security definer set search_path = public, pg_catalog as $$
declare v_batch public.voucher_batches%rowtype; v_code text; v_index integer;
begin
  if p_quantity not between 1 and 500 or btrim(p_reference) !~ '^.{2,120}$' then raise exception 'invalid voucher batch request'; end if;
  select * into v_batch from public.voucher_batches where idempotency_key = p_idempotency_key for update;
  if found then return query select v_batch.id, v_batch.quantity_generated, v_batch.reference; return; end if;
  insert into public.voucher_batches(reference, quantity_requested, value_benefit, expires_at, admin_note, created_by, idempotency_key)
  values (btrim(p_reference), p_quantity, nullif(btrim(p_value_benefit), ''), p_expires_at, nullif(btrim(p_admin_note), ''), p_actor_id, p_idempotency_key) returning * into v_batch;
  for v_index in 1..p_quantity loop
    loop
      v_code := 'WB-' || upper(encode(gen_random_bytes(10), 'hex'));
      begin
        insert into public.voucher_codes(code, batch_reference, serial_number, batch_id, value_benefit, expires_at, admin_note, created_by)
        values (v_code, v_batch.reference, v_batch.reference || '-' || lpad(v_index::text, 4, '0'), v_batch.id, v_batch.value_benefit, v_batch.expires_at, v_batch.admin_note, p_actor_id);
        exit;
      exception when unique_violation then end;
    end loop;
  end loop;
  update public.voucher_batches set quantity_generated = p_quantity where id = v_batch.id;
  insert into public.voucher_admin_audit_events(actor_id, action, batch_id, metadata) values (p_actor_id, 'batch_generated', v_batch.id, jsonb_build_object('requested', p_quantity, 'generated', p_quantity));
  return query select v_batch.id, p_quantity, v_batch.reference;
end; $$;
alter function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid) owner to postgres;
revoke all on function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid) from public, anon, authenticated;
grant execute on function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid) to service_role;
