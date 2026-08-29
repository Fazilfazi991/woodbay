-- Product 01 image association only. The file is served from the public website assets.
-- Rerunnable and additive: no existing image or historical record is replaced.
insert into public.product_images (
  product_id,
  storage_key,
  alt_text,
  sort_order,
  is_primary,
  image_role,
  raw_catalogue_reference
)
select
  p.id,
  '/images/products/glass-pantry-with-bidding.webp',
  'Glass Pantry With Bidding installed in a tall kitchen cabinet',
  coalesce((select max(existing.sort_order) + 1 from public.product_images existing where existing.product_id = p.id), 0),
  not exists (select 1 from public.product_images existing where existing.product_id = p.id),
  'primary',
  jsonb_build_object(
    'source', 'Woodbay.pdf',
    'catalogue_page', 3,
    'product_name', 'Glass Pantry With Bidding',
    'reference_usage', 'product identity and mechanism'
  )::text
from public.products p
where p.slug = 'glass-pantry-with-bidding'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.storage_key = '/images/products/glass-pantry-with-bidding.webp'
  );
