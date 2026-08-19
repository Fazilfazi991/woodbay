-- Batch 10: atomic voucher redemption is callable only by the server's service role.
-- Fail closed rather than silently making two case variants resolve to one code.
do $$
begin
  if exists (
    select 1 from public.voucher_codes
    group by upper(btrim(code))
    having count(*) > 1
  ) then
    raise exception 'voucher code normalization found duplicate case variants';
  end if;
end;
$$;

update public.voucher_codes set code = upper(btrim(code)) where code <> upper(btrim(code));
alter table public.voucher_codes add constraint voucher_codes_code_canonical check (code = upper(btrim(code)));
create unique index voucher_codes_normalized_code_key on public.voucher_codes (upper(code));

create table public.voucher_redemption_rate_limits (
  rate_limit_key text primary key check (rate_limit_key ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null default timezone('utc', now()),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.voucher_redemption_rate_limits enable row level security;
revoke all on table public.voucher_redemption_rate_limits from public, anon, authenticated;
grant all on table public.voucher_redemption_rate_limits to service_role;

create or replace function public.redeem_voucher(
  p_code text,
  p_customer_name text,
  p_phone text,
  p_location text,
  p_district text,
  p_dealer_name text,
  p_distributor_name text,
  p_rate_limit_key text
)
returns table(result text, product_name text, product_slug text)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_now timestamptz := timezone('utc', now());
  v_code text := upper(btrim(p_code));
  v_attempt_count integer;
  v_voucher public.voucher_codes%rowtype;
begin
  if p_rate_limit_key !~ '^[a-f0-9]{64}$' then
    return query select 'error'::text, null::text, null::text;
    return;
  end if;

  insert into public.voucher_redemption_rate_limits as limits (rate_limit_key, window_started_at, attempt_count, updated_at)
  values (p_rate_limit_key, v_now, 1, v_now)
  on conflict (rate_limit_key) do update set
    window_started_at = case when limits.window_started_at <= v_now - interval '1 hour' then v_now else limits.window_started_at end,
    attempt_count = case when limits.window_started_at <= v_now - interval '1 hour' then 1 else limits.attempt_count + 1 end,
    updated_at = v_now
  returning attempt_count into v_attempt_count;

  if v_attempt_count > 12 then
    return query select 'rate_limited'::text, null::text, null::text;
    return;
  end if;

  if v_code !~ '^[A-Z0-9-]{4,32}$'
    or btrim(p_customer_name) !~ '^.{2,120}$'
    or btrim(p_phone) !~ '^[+0-9() -]{7,20}$'
    or btrim(p_location) !~ '^.{2,160}$'
    or btrim(p_district) !~ '^.{2,120}$'
    or btrim(p_dealer_name) !~ '^.{2,160}$'
    or coalesce(btrim(p_distributor_name), '') !~ '^.{0,160}$' then
    return query select 'error'::text, null::text, null::text;
    return;
  end if;

  select * into v_voucher from public.voucher_codes where code = v_code for update;
  if not found then
    insert into public.voucher_verification_logs (entered_code, result) values (v_code, 'invalid');
    return query select 'invalid'::text, null::text, null::text;
    return;
  end if;

  if v_voucher.status = 'disabled' then
    insert into public.voucher_verification_logs (entered_code, voucher_id, result) values (v_code, v_voucher.id, 'disabled');
    return query select 'disabled'::text, null::text, null::text;
    return;
  end if;

  if v_voucher.status = 'redeemed' then
    insert into public.voucher_verification_logs (entered_code, voucher_id, result) values (v_code, v_voucher.id, 'already_redeemed');
    return query select 'already_redeemed'::text, null::text, null::text;
    return;
  end if;

  insert into public.voucher_redemptions (voucher_id, customer_name, phone, location, district, dealer_name, distributor_name, redeemed_at)
  values (v_voucher.id, btrim(p_customer_name), regexp_replace(btrim(p_phone), '\\s+', ' ', 'g'), btrim(p_location), btrim(p_district), btrim(p_dealer_name), nullif(btrim(p_distributor_name), ''), v_now);
  update public.voucher_codes set status = 'redeemed', redeemed_at = v_now where id = v_voucher.id;
  insert into public.voucher_verification_logs (entered_code, voucher_id, result) values (v_code, v_voucher.id, 'valid');

  return query
    select 'success'::text, p.name, p.slug
    from public.products p
    where p.id = v_voucher.product_id and p.status = 'published';
  if not found then
    return query select 'success'::text, null::text, null::text;
  end if;
end;
$$;

alter function public.redeem_voucher(text, text, text, text, text, text, text, text) owner to postgres;
revoke all on function public.redeem_voucher(text, text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.redeem_voucher(text, text, text, text, text, text, text, text) to service_role;
