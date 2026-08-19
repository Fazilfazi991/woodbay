create or replace view public.public_dealer_details
with (security_invoker = false) as
select
  id,
  business_name,
  slug,
  phone,
  state,
  district,
  area,
  address,
  google_maps_url,
  latitude,
  longitude,
  payment_qr_image,
  shop_image
from public.dealers
where status = 'active' and is_visible = true;

grant select on public.public_dealer_details to anon, authenticated;
