revoke select on public.dealers from anon, authenticated;

create or replace view public.public_dealers
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
  shop_image
from public.dealers
where status = 'active' and is_visible = true;

grant select on public.public_dealers to anon, authenticated;
