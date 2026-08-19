-- Development/staging-only QA data. Do not treat these as real Woodbay dealers.
insert into public.dealers (business_name, slug, phone, state, district, area, address, status, is_visible)
values
  ('Woodbay Dealer QA – Kochi', 'woodbay-dealer-qa-kochi', '+91 90000 01001', 'Kerala', 'Ernakulam', 'Kakkanad', 'QA Dealer Address, Kakkanad', 'active', true),
  ('Woodbay Dealer QA – Aluva', 'woodbay-dealer-qa-aluva', '+91 90000 01002', 'Kerala', 'Ernakulam', 'Aluva', 'QA Dealer Address, Aluva', 'active', true),
  ('Woodbay Dealer QA – Kollam', 'woodbay-dealer-qa-kollam', '+91 90000 01003', 'Kerala', 'Kollam', 'Kollam', 'QA Dealer Address, Kollam', 'active', true),
  ('Woodbay Dealer QA – Kozhikode', 'woodbay-dealer-qa-kozhikode', '+91 90000 01004', 'Kerala', 'Kozhikode', 'Kozhikode', 'QA Dealer Address, Kozhikode', 'active', true),
  ('Woodbay Dealer QA – Chennai', 'woodbay-dealer-qa-chennai', '+91 90000 01005', 'Tamil Nadu', 'Chennai', 'Velachery', 'QA Dealer Address, Velachery', 'active', true),
  ('Woodbay Dealer QA – Coimbatore', 'woodbay-dealer-qa-coimbatore', '+91 90000 01006', 'Tamil Nadu', 'Coimbatore', 'Peelamedu', 'QA Dealer Address, Peelamedu', 'active', true),
  ('Woodbay Dealer QA – Hidden', 'woodbay-dealer-qa-hidden', '+91 90000 01007', 'Kerala', 'Ernakulam', 'Hidden Area', 'Hidden QA Address', 'inactive', false)
on conflict (slug) do update set
  business_name = excluded.business_name,
  phone = excluded.phone,
  state = excluded.state,
  district = excluded.district,
  area = excluded.area,
  address = excluded.address,
  status = excluded.status,
  is_visible = excluded.is_visible;
