-- Product 02 only: create the missing canonical Satin Pantry record from the
-- catalogue's exact page-3 values, then associate its dedicated website image.
-- Additive and rerunnable; no existing product, variant, or image is replaced.
insert into public.products (
  category_id,
  name,
  slug,
  catalogue_page_number,
  catalogue_source_reference,
  raw_catalogue_data,
  status,
  is_featured,
  sort_order
)
select
  c.id,
  'Satin Pantry',
  'satin-pantry',
  '3',
  'Woodbay.pdf, page 3, Pantry Solutions',
  jsonb_build_object(
    'product_name', 'Satin Pantry',
    'dimensions', jsonb_build_array('450mm', '650mm'),
    'catalogue_page', 3
  ),
  'published'::public.content_status,
  false,
  coalesce((select max(existing.sort_order) + 10 from public.products existing where existing.category_id = c.id), 10)
from public.product_categories c
where c.slug = 'pantry-solutions'
on conflict (slug) do nothing;

insert into public.product_variants (
  product_id,
  name,
  sku,
  dimension,
  raw_catalogue_data,
  sort_order
)
select
  p.id,
  source.name,
  null,
  source.dimension,
  jsonb_build_object('dimension', source.dimension),
  source.sort_order
from public.products p
cross join (values
  ('450mm', '450mm', 10),
  ('650mm', '650mm', 20)
) as source(name, dimension, sort_order)
where p.slug = 'satin-pantry'
  and not exists (
    select 1
    from public.product_variants existing
    where existing.product_id = p.id
      and existing.name = source.name
  );

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
  '/images/products/satin-pantry.webp',
  'Satin Pantry installed in a tall kitchen cabinet',
  coalesce((select max(existing.sort_order) + 1 from public.product_images existing where existing.product_id = p.id), 0),
  not exists (select 1 from public.product_images existing where existing.product_id = p.id),
  'primary',
  jsonb_build_object(
    'source', 'Woodbay.pdf',
    'catalogue_page', 3,
    'product_name', 'Satin Pantry',
    'reference_usage', 'product identity and mechanism'
  )::text
from public.products p
where p.slug = 'satin-pantry'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.storage_key = '/images/products/satin-pantry.webp'
  );
