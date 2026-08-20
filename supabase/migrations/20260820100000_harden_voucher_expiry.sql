-- Batch 11 follow-up: enforce voucher expiry in the canonical atomic redemption transaction.
create or replace function public.reject_expired_voucher_redemption()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if exists (
    select 1 from public.voucher_codes
    where id = new.voucher_id
      and status = 'available'
      and expires_at is not null
      and expires_at < (timezone('utc', now()))::date
  ) then
    raise exception 'voucher expired';
  end if;
  return new;
end;
$$;

alter function public.reject_expired_voucher_redemption() owner to postgres;
revoke all on function public.reject_expired_voucher_redemption() from public, anon, authenticated;

create trigger voucher_redemptions_reject_expired
before insert on public.voucher_redemptions
for each row execute function public.reject_expired_voucher_redemption();
