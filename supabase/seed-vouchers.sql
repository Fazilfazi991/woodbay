-- Batch 10 QA-only vouchers. Apply only to a non-production validation environment.
-- Disable or remove these codes before production use; they are not customer vouchers.
insert into public.voucher_codes (code, batch_reference, serial_number, status, redeemed_at)
values
  ('WBQA0001', 'QA-BATCH-10', 'QA-0001', 'available', null),
  ('WBQA0003', 'QA-BATCH-10', 'QA-0003', 'redeemed', timezone('utc', now())),
  ('WBQA0004', 'QA-BATCH-10', 'QA-0004', 'disabled', null)
on conflict (code) do nothing;

insert into public.voucher_codes (code, product_id, batch_reference, serial_number, status, redeemed_at)
select 'WBQA0002', id, 'QA-BATCH-10', 'QA-0002', 'available', null
from public.products where status = 'published' order by created_at limit 1
on conflict (code) do nothing;

insert into public.voucher_redemptions (voucher_id, customer_name, phone, location, district, dealer_name, distributor_name)
select id, 'QA Redeemed Customer', '+91 90000 00000', 'QA Location', 'QA District', 'QA Dealer', 'QA Distributor'
from public.voucher_codes where code = 'WBQA0003'
on conflict (voucher_id) do nothing;
