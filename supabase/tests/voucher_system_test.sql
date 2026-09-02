begin;
create extension if not exists pgtap with schema extensions;
select plan(26);

insert into public.product_categories (id, name, slug, is_active)
values ('10000000-0000-0000-0000-000000000001', 'Voucher QA', 'voucher-qa', true);
insert into public.products (id, category_id, name, slug, status)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'QA Product A', 'qa-product-a', 'published'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'QA Product B', 'qa-product-b', 'published');
insert into public.dealers (id, business_name, slug, phone, state, district, address, status, is_visible)
values
  ('30000000-0000-0000-0000-000000000001', 'QA Dealer A', 'qa-dealer-a', '+919000000001', 'Kerala', 'Ernakulam', 'QA Address A', 'active', true),
  ('30000000-0000-0000-0000-000000000002', 'QA Dealer B', 'qa-dealer-b', '+919000000002', 'Kerala', 'Kottayam', 'QA Address B', 'active', true);
insert into public.voucher_codes (id, code, status, product_id, dealer_id, expires_at)
values
  ('40000000-0000-0000-0000-000000000001', 'WB-QA-VALID', 'available', null, null, current_date + 7),
  ('40000000-0000-0000-0000-000000000002', 'WB-QA-DISABLED', 'disabled', null, null, current_date + 7),
  ('40000000-0000-0000-0000-000000000003', 'WB-QA-EXPIRED', 'available', null, null, current_date - 1),
  ('40000000-0000-0000-0000-000000000004', 'WB-QA-ASSIGNED', 'available', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', current_date + 7);

select throws_ok(
  $$insert into public.voucher_codes (code) values ('WB-QA-VALID')$$,
  '23505', null, 'voucher codes are unique'
);

select is(
  (select result from public.redeem_voucher(' WB-QA-VALID ', 'QA Customer', '+91 90000 00000', 'QA Customer Address', 'qa-dealer-a', 'qa-product-a', repeat('a', 64))),
  'success', 'valid unused voucher succeeds'
);
select is((select count(*)::integer from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000001'), 1, 'valid voucher creates exactly one registration');
select is((select product_id from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000001'), '20000000-0000-0000-0000-000000000001'::uuid, 'registration stores product relation');
select is((select dealer_id from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000001'), '30000000-0000-0000-0000-000000000001'::uuid, 'registration stores dealer relation');
select is((select status::text from public.voucher_codes where id = '40000000-0000-0000-0000-000000000001'), 'redeemed', 'successful voucher becomes redeemed');
select is((select count(*)::integer from public.voucher_admin_audit_events where voucher_id = '40000000-0000-0000-0000-000000000001' and action = 'voucher_registered'), 1, 'successful registration creates audit event');
select is(
  (select result from public.redeem_voucher('WB-QA-VALID', 'Other Customer', '+91 90000 00003', 'Other Address', 'qa-dealer-a', 'qa-product-a', repeat('b', 64))),
  'already_redeemed', 'duplicate registration returns safe status'
);
select is((select count(*)::integer from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000001'), 1, 'duplicate registration creates no second row');
select is((select result from public.redeem_voucher('WB-QA-DISABLED', 'QA Customer', '+91 90000 00000', 'QA Address', 'qa-dealer-a', 'qa-product-a', repeat('c', 64))), 'disabled', 'disabled voucher is rejected');
select is((select count(*)::integer from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000002'), 0, 'disabled voucher creates no registration');
select is((select result from public.redeem_voucher('WB-QA-EXPIRED', 'QA Customer', '+91 90000 00000', 'QA Address', 'qa-dealer-a', 'qa-product-a', repeat('d', 64))), 'expired', 'expired voucher is rejected');
select is((select count(*)::integer from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000003'), 0, 'expired voucher creates no registration');
select is((select result from public.redeem_voucher('WB-QA-ASSIGNED', 'QA Customer', '+91 90000 00000', 'QA Address', 'qa-dealer-b', 'qa-product-b', repeat('e', 64))), 'details_mismatch', 'assignment mismatch is rejected without disclosure');
select is((select count(*)::integer from public.voucher_redemptions where voucher_id = '40000000-0000-0000-0000-000000000004'), 0, 'assignment mismatch creates no registration');
select throws_ok(
  $$insert into public.voucher_redemptions (voucher_id, customer_name, phone, location, district, dealer_name) values ('40000000-0000-0000-0000-000000000001', 'Duplicate', '+919000000009', 'QA', 'QA', 'QA')$$,
  '23505', null, 'one registration per voucher is enforced'
);
select ok(not has_table_privilege('anon', 'public.voucher_codes', 'select'), 'anonymous role cannot enumerate vouchers');
select ok(not has_table_privilege('anon', 'public.voucher_redemptions', 'select'), 'anonymous role cannot read registrations');
select ok(not has_function_privilege('anon', 'public.redeem_voucher(text,text,text,text,text,text,text)', 'execute'), 'anonymous role cannot call redemption RPC directly');
select ok(not has_function_privilege('authenticated', 'public.redeem_voucher(text,text,text,text,text,text,text)', 'execute'), 'authenticated role cannot call redemption RPC directly');
select ok(has_function_privilege('service_role', 'public.redeem_voucher(text,text,text,text,text,text,text)', 'execute'), 'service role can call redemption RPC');
select ok(not has_function_privilege('anon', 'public.generate_voucher_batch(uuid,text,integer,text,date,text,uuid,uuid,uuid)', 'execute'), 'anonymous role cannot generate vouchers');
select is((select count(*)::integer from public.voucher_redemptions r left join public.voucher_codes v on v.id = r.voucher_id where v.id is null), 0, 'no orphan voucher registrations');
select is((select count(*)::integer from public.voucher_redemptions r left join public.products p on p.id = r.product_id where r.product_id is not null and p.id is null), 0, 'all product relationships are valid');
select is((select count(*)::integer from public.voucher_redemptions r left join public.dealers d on d.id = r.dealer_id where r.dealer_id is not null and d.id is null), 0, 'all dealer relationships are valid');

select is(
  (select attempt.result from generate_series(1, 13) as n(i)
    cross join lateral public.redeem_voucher('WB-QA-NOT-REAL-' || n.i, 'QA Customer', '+91 90000 00000', 'QA Address', 'qa-dealer-a', 'qa-product-a', repeat('f', 64)) as attempt
    order by n.i desc limit 1),
  'rate_limited', 'rate limiter returns a safe result'
);

select * from finish();
rollback;
