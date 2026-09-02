-- Batch 9: attach the client-approved representative image to the existing
-- Artificial Grass record. The image is generated catalogue photography, not
-- a manufacturer source, so its provenance is recorded explicitly.

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
  '/images/products/artificial-grass.webp',
  'Artificial grass product sample from WoodBay',
  0,
  true,
  'primary',
  'Batch 9 representative image generated from client-confirmed product identity'
from public.products p
where p.slug = 'artificial-grass'
  and p.status = 'published'
  and not exists (
    select 1
    from public.product_images existing
    where existing.product_id = p.id
      and existing.storage_key = '/images/products/artificial-grass.webp'
  );

update public.products
set raw_catalogue_data = raw_catalogue_data || jsonb_build_object(
  'image_status', 'generated_representative',
  'image_provenance', 'Batch 9 AI-generated catalogue image; no technical specifications implied'
)
where slug = 'artificial-grass';

do $$
begin
  if not exists (
    select 1
    from public.product_images i
    join public.products p on p.id = i.product_id
    where p.slug = 'artificial-grass'
      and i.storage_key = '/images/products/artificial-grass.webp'
      and i.is_primary
  ) then
    raise exception 'Artificial Grass primary image was not attached';
  end if;
end;
$$;
