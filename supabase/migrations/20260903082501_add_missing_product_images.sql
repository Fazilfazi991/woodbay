-- Attach representative catalogue images to the two published legacy records
-- that have no trustworthy manufacturer image. The product records remain
-- unchanged and provenance explicitly avoids technical/model claims.

insert into public.product_images (
  product_id, storage_key, alt_text, sort_order, is_primary,
  image_role, raw_catalogue_reference
)
select
  p.id,
  source.storage_key,
  source.alt_text,
  0,
  true,
  'primary',
  source.provenance
from public.products p
join (values
  ('tall-pantry', '/images/products/tall-pantry.webp', 'Tall pantry storage system in modern kitchen cabinetry', 'AI-generated representative catalogue image; generic full-height pantry storage system, no model specifications implied'),
  ('aluminium-profile', '/images/products/aluminium-profile.webp', 'Aluminium profiles for furniture and interior detailing', 'AI-generated representative catalogue image; generic furniture and interior extrusion profiles, no profile family or specifications implied')
) as source(slug, storage_key, alt_text, provenance) on source.slug = p.slug
where p.status = 'published'
  and not exists (
    select 1 from public.product_images existing
    where existing.product_id = p.id
      and existing.storage_key = source.storage_key
  );

update public.products p
set raw_catalogue_data = coalesce(p.raw_catalogue_data, '{}'::jsonb) || jsonb_build_object(
  'image_status', 'generated_representative',
  'image_provenance', source.provenance
)
from (values
  ('tall-pantry', 'AI-generated representative catalogue image; generic full-height pantry storage system, no model specifications implied'),
  ('aluminium-profile', 'AI-generated representative catalogue image; generic furniture and interior extrusion profiles, no profile family or specifications implied')
) as source(slug, provenance)
where p.slug = source.slug;

do $$
begin
  if (
    select count(*) from public.product_images i
    join public.products p on p.id = i.product_id
    where p.slug in ('tall-pantry', 'aluminium-profile')
      and i.is_primary
      and i.storage_key in (
        '/images/products/tall-pantry.webp',
        '/images/products/aluminium-profile.webp'
      )
  ) <> 2 then
    raise exception 'Missing-product primary images were not attached';
  end if;
end;
$$;
