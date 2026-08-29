-- Product 03 only: reuse the existing legacy `bottle-pullout` product, whose
-- catalogue codes and description identify it as Glass BPO With Bidding.
-- Preserve its slug so existing public links remain valid. No duplicate row is created.
update public.products
set name = 'Glass BPO With Bidding',
    catalogue_page_number = coalesce(catalogue_page_number, '3'),
    catalogue_source_reference = coalesce(
      catalogue_source_reference,
      'Woodbay.pdf, page 3, Pullout Solutions'
    ),
    raw_catalogue_data = coalesce(raw_catalogue_data, '{}'::jsonb) || jsonb_build_object(
      'product_name', 'Glass BPO With Bidding',
      'catalogue_description', 'Glass BPO With Bidding (Base Mounted)',
      'primary_product_code', 'OEM-GLB-BM20',
      'catalogue_page', 3
    )
where slug = 'bottle-pullout'
  and (
    product_code in ('OEM-GLB-BM20', 'OEM-GLB-BM25')
    or description ilike 'Glass BPO With Bidding%'
  );

update public.product_variants v
set raw_catalogue_data = coalesce(v.raw_catalogue_data, '{}'::jsonb) || jsonb_build_object(
  'variant_name', v.name,
  'variant_code', v.sku,
  'dimension', v.dimension
)
where v.product_id = (
    select p.id
    from public.products p
    where p.slug = 'bottle-pullout'
      and p.name = 'Glass BPO With Bidding'
  )
  and (v.sku, v.dimension) in (
    ('OEM-GLB-BM20', '200mm'),
    ('OEM-GLB-BM25', '250mm')
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
  '/images/products/glass-bpo-with-bidding.webp',
  'Glass BPO With Bidding extended from a lower kitchen cabinet',
  coalesce((select max(existing.sort_order) + 1 from public.product_images existing where existing.product_id = p.id), 0),
  not exists (select 1 from public.product_images existing where existing.product_id = p.id),
  'primary',
  jsonb_build_object(
    'source', 'Woodbay.pdf',
    'catalogue_page', 3,
    'product_name', 'Glass BPO With Bidding',
    'reference_usage', 'product identity and mechanism'
  )::text
from public.products p
where p.slug = 'bottle-pullout'
  and p.name = 'Glass BPO With Bidding'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.storage_key = '/images/products/glass-bpo-with-bidding.webp'
  );
