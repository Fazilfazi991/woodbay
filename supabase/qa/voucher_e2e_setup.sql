-- Local-only synthetic Batch 4.1 browser fixtures.
insert into public.product_categories(id,name,slug,is_active) values('90000000-0000-4000-8000-000000000001','WoodBay Voucher QA','woodbay-voucher-qa',true) on conflict(id) do nothing;
insert into public.products(id,category_id,name,slug,status) values
('90000000-0000-4000-8000-000000000011','90000000-0000-4000-8000-000000000001','WoodBay QA Product A','woodbay-qa-product-a','published'),
('90000000-0000-4000-8000-000000000012','90000000-0000-4000-8000-000000000001','WoodBay QA Product B','woodbay-qa-product-b','published') on conflict(id) do nothing;
insert into public.dealers(id,business_name,slug,phone,state,district,area,address,status,is_visible) values
('91000000-0000-4000-8000-000000000001','WoodBay QA Dealer Kochi','woodbay-qa-dealer-kochi','+919000000101','Kerala','Ernakulam','Kochi','Synthetic QA address','active',true),
('91000000-0000-4000-8000-000000000002','WoodBay QA Dealer Kottayam','woodbay-qa-dealer-kottayam','+919000000102','Kerala','Kottayam','Kottayam','Synthetic QA address','active',true) on conflict(id) do nothing;
insert into public.voucher_codes(id,code,status,product_id,dealer_id,expires_at,batch_reference,admin_note) values
('92000000-0000-4000-8000-000000000001','WB-QA41-VALID','available',null,null,current_date+30,'QA-BATCH-4.1','Synthetic local QA fixture'),
('92000000-0000-4000-8000-000000000002','WB-QA41-DUPLICATE','available','90000000-0000-4000-8000-000000000011','91000000-0000-4000-8000-000000000001',current_date+30,'QA-BATCH-4.1','Synthetic local QA fixture'),
('92000000-0000-4000-8000-000000000003','WB-QA41-DISABLED','disabled',null,null,current_date+30,'QA-BATCH-4.1','Synthetic local QA fixture'),
('92000000-0000-4000-8000-000000000004','WB-QA41-EXPIRED','available',null,null,current_date-1,'QA-BATCH-4.1','Synthetic local QA fixture'),
('92000000-0000-4000-8000-000000000005','WB-QA41-DEALER','available',null,'91000000-0000-4000-8000-000000000001',current_date+30,'QA-BATCH-4.1','Synthetic local QA fixture'),
('92000000-0000-4000-8000-000000000006','WB-QA41-PRODUCT','available','90000000-0000-4000-8000-000000000011',null,current_date+30,'QA-BATCH-4.1','Synthetic local QA fixture'),
('92000000-0000-4000-8000-000000000007','WB-QA41-MISMATCH','available','90000000-0000-4000-8000-000000000011','91000000-0000-4000-8000-000000000001',current_date+30,'QA-BATCH-4.1','Synthetic local QA fixture') on conflict(id) do nothing;
insert into public.voucher_redemptions(voucher_id,product_id,dealer_id,customer_name,phone,location,district,dealer_name,redeemed_at)
select v.id,v.product_id,v.dealer_id,'Synthetic Existing Customer','+919000000199','Synthetic QA location','Ernakulam','WoodBay QA Dealer Kochi',timezone('utc',now()) from public.voucher_codes v where v.id='92000000-0000-4000-8000-000000000002' on conflict(voucher_id) do nothing;
update public.voucher_codes set status='redeemed',redeemed_at=coalesce(redeemed_at,timezone('utc',now())) where id='92000000-0000-4000-8000-000000000002';
