-- Keep the published URL (/products/decor) aligned with the live category slug.
update public.product_categories
set slug = 'decor'
where slug = 'decor-products';
