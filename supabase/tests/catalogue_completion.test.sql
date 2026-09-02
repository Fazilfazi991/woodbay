begin;
create extension if not exists pgtap with schema extensions;
select plan(16);

select extensions.is(
  (select count(*)::integer from public.product_categories where parent_id is null and is_active),
  4,
  'exactly four public divisions remain active'
);
select extensions.is(
  (select name from public.product_categories where slug = 'kitchen-wardrobe-accessories'),
  'Smart Kitchen & Wardrobe Solutions',
  'approved kitchen and wardrobe division name is used'
);
select extensions.is(
  (select count(*)::integer from public.products where status = 'published'),
  74,
  'all 73 manifest products and client-confirmed artificial grass are published'
);
select extensions.is(
  (select count(*)::integer from public.products where status = 'published' and nullif(trim(description), '') is null),
  0,
  'every published product has a baseline description'
);
select extensions.is(
  (select count(*)::integer from public.products where slug in ('crystal-acrylic-paintings','3d-pvc-panels','pocket-spring-mattresses','artificial-vertical-gardens','artificial-grass') and status = 'published'),
  5,
  'client-confirmed products are published'
);
select extensions.is(
  (select count(*)::integer from public.products p join public.product_categories c on c.id = p.category_id where p.slug in ('pu-stone-panels','pu-feather-panels') and c.slug = 'pu-panels'),
  2,
  'both verified PU products share the PU Panels family'
);
select extensions.is(
  (select count(*)::integer from public.products p join public.product_categories c on c.id = p.category_id where p.slug = 'pocket-spring-mattresses' and c.slug = 'mattresses'),
  1,
  'Pocket Spring Mattress belongs to Mattresses'
);
select extensions.is(
  (select count(*)::integer from (select slug from public.products group by slug having count(*) > 1) duplicates),
  0,
  'product slugs are unique'
);
select extensions.is(
  (select count(*)::integer from (select slug from public.product_categories group by slug having count(*) > 1) duplicates),
  0,
  'category slugs are unique'
);
select extensions.is(
  (select count(*)::integer from (select product_id, name, coalesce(sku, '') from public.product_variants where is_active group by product_id, name, coalesce(sku, '') having count(*) > 1) duplicates),
  0,
  'active variants contain no duplicates'
);
select extensions.is(
  (select count(*)::integer from public.products p left join public.product_categories c on c.id = p.category_id where p.status = 'published' and (c.id is null or not c.is_active)),
  0,
  'published products have valid active categories'
);
select extensions.is(
  (select count(*)::integer from public.product_images i left join public.products p on p.id = i.product_id where p.id is null),
  0,
  'product images are not orphaned'
);
select extensions.is(
  (select count(*)::integer from public.product_variants v left join public.products p on p.id = v.product_id where p.id is null),
  0,
  'product variants are not orphaned'
);
select extensions.is(
  (select count(*)::integer from public.voucher_codes v left join public.products p on p.id = v.product_id where v.product_id is not null and p.id is null),
  0,
  'voucher product relationships remain valid'
);
select extensions.is(
  (select count(*)::integer from public.product_images i join public.products p on p.id = i.product_id where p.slug = 'artificial-grass'),
  0,
  'artificial grass has no unverified image attached'
);
select extensions.is(
  (select count(*)::integer from public.product_categories where slug in ('pu-stone-panels','pu-feather-panels','pocket-spring-mattresses') and is_active),
  0,
  'superseded draft-only category paths remain inactive'
);

select * from extensions.finish();
rollback;
