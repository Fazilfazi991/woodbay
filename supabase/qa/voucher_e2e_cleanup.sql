delete from public.voucher_admin_audit_events where voucher_id in(select id from public.voucher_codes where batch_reference='QA-BATCH-4.1');
delete from public.voucher_verification_logs where voucher_id in(select id from public.voucher_codes where batch_reference='QA-BATCH-4.1');
delete from public.voucher_redemptions where voucher_id in(select id from public.voucher_codes where batch_reference='QA-BATCH-4.1');
delete from public.voucher_codes where batch_reference='QA-BATCH-4.1';
delete from public.dealers where id in('91000000-0000-4000-8000-000000000001','91000000-0000-4000-8000-000000000002');
delete from public.products where id in('90000000-0000-4000-8000-000000000011','90000000-0000-4000-8000-000000000012');
delete from public.product_categories where id='90000000-0000-4000-8000-000000000001';
