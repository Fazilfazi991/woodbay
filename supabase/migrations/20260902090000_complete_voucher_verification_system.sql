-- Batch 4: relational voucher assignment, atomic redemption, and explicit API grants.
alter table public.voucher_codes
  add column if not exists dealer_id uuid references public.dealers(id) on delete set null;

alter table public.voucher_redemptions
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists dealer_id uuid references public.dealers(id) on delete set null;

create index if not exists voucher_codes_product_idx on public.voucher_codes(product_id);
create index if not exists voucher_codes_dealer_idx on public.voucher_codes(dealer_id);
create index if not exists voucher_redemptions_product_idx on public.voucher_redemptions(product_id);
create index if not exists voucher_redemptions_dealer_idx on public.voucher_redemptions(dealer_id);

alter table public.voucher_admin_audit_events alter column actor_id drop not null;
alter table public.voucher_admin_audit_events drop constraint if exists voucher_admin_audit_events_action_check;
alter table public.voucher_admin_audit_events add constraint voucher_admin_audit_events_action_check
  check (action in ('voucher_created', 'batch_generated', 'voucher_disabled', 'voucher_registered'));

-- The legacy signature is no longer used by the application.
drop function if exists public.redeem_voucher(text, text, text, text, text, text, text, text);

create function public.redeem_voucher(
  p_code text,
  p_customer_name text,
  p_phone text,
  p_address text,
  p_dealer_slug text,
  p_product_slug text,
  p_rate_limit_key text
)
returns table(result text, product_name text, product_slug text, dealer_name text, dealer_slug text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := timezone('utc', now());
  v_code text := upper(btrim(p_code));
  v_attempt_count integer;
  v_voucher public.voucher_codes%rowtype;
  v_product public.products%rowtype;
  v_dealer public.dealers%rowtype;
begin
  if p_rate_limit_key !~ '^[a-f0-9]{64}$' then
    return query select 'error'::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  insert into public.voucher_redemption_rate_limits as limits
    (rate_limit_key, window_started_at, attempt_count, updated_at)
  values (p_rate_limit_key, v_now, 1, v_now)
  on conflict (rate_limit_key) do update set
    window_started_at = case when limits.window_started_at <= v_now - interval '1 hour' then v_now else limits.window_started_at end,
    attempt_count = case when limits.window_started_at <= v_now - interval '1 hour' then 1 else limits.attempt_count + 1 end,
    updated_at = v_now
  returning attempt_count into v_attempt_count;

  if v_attempt_count > 12 then
    return query select 'rate_limited'::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  if v_code !~ '^[A-Z0-9-]{4,32}$'
    or char_length(btrim(p_customer_name)) not between 2 and 120
    or btrim(p_phone) !~ '^[+0-9() -]{7,20}$'
    or char_length(btrim(p_address)) not between 2 and 240
    or p_dealer_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    or p_product_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    return query select 'error'::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  select * into v_product from public.products
    where slug = p_product_slug and status = 'published';
  select * into v_dealer from public.dealers
    where slug = p_dealer_slug and status = 'active' and is_visible = true;
  if v_product.id is null or v_dealer.id is null then
    return query select 'selection_unavailable'::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  select * into v_voucher from public.voucher_codes where code = v_code for update;
  if not found then
    insert into public.voucher_verification_logs (entered_code, result) values (v_code, 'invalid');
    return query select 'invalid'::text, null::text, null::text, null::text, null::text;
    return;
  end if;
  if v_voucher.status = 'disabled' then
    insert into public.voucher_verification_logs (entered_code, voucher_id, result) values (v_code, v_voucher.id, 'disabled');
    return query select 'disabled'::text, null::text, null::text, null::text, null::text;
    return;
  end if;
  if v_voucher.status = 'redeemed' then
    insert into public.voucher_verification_logs (entered_code, voucher_id, result) values (v_code, v_voucher.id, 'already_redeemed');
    return query select 'already_redeemed'::text, null::text, null::text, null::text, null::text;
    return;
  end if;
  if v_voucher.expires_at is not null and v_voucher.expires_at < v_now::date then
    return query select 'expired'::text, null::text, null::text, null::text, null::text;
    return;
  end if;
  if (v_voucher.product_id is not null and v_voucher.product_id <> v_product.id)
    or (v_voucher.dealer_id is not null and v_voucher.dealer_id <> v_dealer.id) then
    return query select 'details_mismatch'::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  insert into public.voucher_redemptions
    (voucher_id, product_id, dealer_id, customer_name, phone, location, district, dealer_name, redeemed_at)
  values
    (v_voucher.id, v_product.id, v_dealer.id, btrim(p_customer_name),
     regexp_replace(btrim(p_phone), '\\s+', ' ', 'g'), btrim(p_address),
     v_dealer.district, v_dealer.business_name, v_now);

  update public.voucher_codes set
    status = 'redeemed', redeemed_at = v_now,
    product_id = coalesce(product_id, v_product.id),
    dealer_id = coalesce(dealer_id, v_dealer.id)
  where id = v_voucher.id;
  insert into public.voucher_verification_logs (entered_code, voucher_id, result)
    values (v_code, v_voucher.id, 'valid');
  insert into public.voucher_admin_audit_events (actor_id, action, voucher_id, metadata)
    values (null, 'voucher_registered', v_voucher.id, jsonb_build_object('product_id', v_product.id, 'dealer_id', v_dealer.id));

  return query select 'success'::text, v_product.name, v_product.slug, v_dealer.business_name, v_dealer.slug;
end;
$$;

alter function public.redeem_voucher(text, text, text, text, text, text, text) owner to postgres;
revoke all on function public.redeem_voucher(text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.redeem_voucher(text, text, text, text, text, text, text) to service_role;

-- Extend generation without exposing IDs to the public redemption page.
drop function if exists public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid);
create function public.generate_voucher_batch(
  p_actor_id uuid, p_reference text, p_quantity integer, p_value_benefit text,
  p_expires_at date, p_admin_note text, p_idempotency_key uuid,
  p_product_id uuid default null, p_dealer_id uuid default null
) returns table(batch_id uuid, created_count integer, batch_reference text)
language plpgsql security definer set search_path = '' as $$
declare v_batch public.voucher_batches%rowtype; v_code text; v_index integer;
begin
  if p_quantity not between 1 and 500 or char_length(btrim(p_reference)) not between 2 and 120 then raise exception 'invalid voucher batch request'; end if;
  if p_product_id is not null and not exists (select 1 from public.products where id = p_product_id and status = 'published') then raise exception 'invalid product assignment'; end if;
  if p_dealer_id is not null and not exists (select 1 from public.dealers where id = p_dealer_id and status = 'active') then raise exception 'invalid dealer assignment'; end if;
  select * into v_batch from public.voucher_batches where idempotency_key = p_idempotency_key for update;
  if found then return query select v_batch.id, v_batch.quantity_generated, v_batch.reference; return; end if;
  insert into public.voucher_batches(reference, quantity_requested, value_benefit, expires_at, admin_note, created_by, idempotency_key)
  values (btrim(p_reference), p_quantity, nullif(btrim(p_value_benefit), ''), p_expires_at, nullif(btrim(p_admin_note), ''), p_actor_id, p_idempotency_key) returning * into v_batch;
  for v_index in 1..p_quantity loop
    loop
      v_code := 'WB-' || upper(encode(extensions.gen_random_bytes(10), 'hex'));
      begin
        insert into public.voucher_codes(code, product_id, dealer_id, batch_reference, serial_number, batch_id, value_benefit, expires_at, admin_note, created_by)
        values (v_code, p_product_id, p_dealer_id, v_batch.reference, v_batch.reference || '-' || lpad(v_index::text, 4, '0'), v_batch.id, v_batch.value_benefit, v_batch.expires_at, v_batch.admin_note, p_actor_id);
        exit;
      exception when unique_violation then end;
    end loop;
  end loop;
  update public.voucher_batches set quantity_generated = p_quantity where id = v_batch.id;
  insert into public.voucher_admin_audit_events(actor_id, action, batch_id, metadata)
    values (p_actor_id, 'batch_generated', v_batch.id, jsonb_build_object('requested', p_quantity, 'generated', p_quantity, 'product_id', p_product_id, 'dealer_id', p_dealer_id));
  return query select v_batch.id, p_quantity, v_batch.reference;
end; $$;
alter function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid, uuid, uuid) owner to postgres;
revoke all on function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid, uuid, uuid) to service_role;

-- Table access remains server-only; public selection uses the existing safe catalogue/dealer policies.
revoke all on public.voucher_codes, public.voucher_redemptions from anon, authenticated;
grant all on public.voucher_codes, public.voucher_redemptions to service_role;
