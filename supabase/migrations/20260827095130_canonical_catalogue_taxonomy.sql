-- Canonical catalogue taxonomy and source-traceability fields.
-- Product, variant and image IDs are preserved; no voucher objects are touched.

alter table public.products
  add column if not exists catalogue_page_number text,
  add column if not exists catalogue_source_reference text,
  add column if not exists raw_catalogue_data jsonb not null default '{}'::jsonb,
  add column if not exists whatsapp_enabled boolean not null default true;

alter table public.product_variants
  add column if not exists size text,
  add column if not exists colour text,
  add column if not exists material text,
  add column if not exists packing_information text,
  add column if not exists raw_catalogue_data jsonb not null default '{}'::jsonb;

alter table public.product_categories
  add column if not exists catalogue_group text,
  add column if not exists landing_content jsonb not null default '{}'::jsonb;

alter table public.product_images
  add column if not exists image_role text not null default 'gallery',
  add column if not exists raw_catalogue_reference text,
  add constraint product_images_image_role_check
  check (image_role in ('primary', 'gallery', 'installed_lifestyle'));

update public.product_images set image_role = 'primary' where is_primary;

alter table public.products
  add constraint products_raw_catalogue_data_object
  check (jsonb_typeof(raw_catalogue_data) = 'object');
alter table public.product_variants
  add constraint product_variants_raw_catalogue_data_object
  check (jsonb_typeof(raw_catalogue_data) = 'object');

-- Free the canonical Smart Furniture slug currently used by a legacy child.
update public.product_categories
set slug = 'smart-furniture-legacy', is_active = false
where slug = 'smart-furniture' and parent_id is not null;

-- Promote/rename the four existing roots where possible to preserve IDs.
update public.product_categories
set name = 'Kitchen & Wardrobe Accessories', slug = 'kitchen-wardrobe-accessories', sort_order = 10, is_active = true
where slug = 'kitchen-accessories' and parent_id is null;

update public.product_categories
set name = 'Home Decor', slug = 'home-decor', sort_order = 30, is_active = true
where slug in ('decor', 'decor-products') and parent_id is null;

update public.product_categories
set name = 'Smart Furniture', slug = 'smart-furniture', sort_order = 40, is_active = true
where slug = 'smart-products' and parent_id is null;

-- Hardware already exists as a child. Promote that row to retain stable IDs.
update public.product_categories
set name = 'Hardware Fittings & Aluminium Profiles', parent_id = null, sort_order = 20, is_active = true
where slug = 'hardware-fittings';

-- Insert any canonical root missing from a partially seeded environment.
insert into public.product_categories (name, slug, parent_id, sort_order, is_active) values
  ('Kitchen & Wardrobe Accessories', 'kitchen-wardrobe-accessories', null, 10, true),
  ('Hardware Fittings & Aluminium Profiles', 'hardware-fittings', null, 20, true),
  ('Home Decor', 'home-decor', null, 30, true),
  ('Smart Furniture', 'smart-furniture', null, 40, true)
on conflict (slug) do update set name = excluded.name, parent_id = null, sort_order = excluded.sort_order, is_active = true;

-- Canonical child categories. Slugs are stable website identifiers; names are display text.
with canonical(name, slug, parent_slug, sort_order) as (values
  ('Pantry Solutions','pantry-solutions','kitchen-wardrobe-accessories',10),
  ('Pullout Solutions','pullout-solutions','kitchen-wardrobe-accessories',20),
  ('Corner Solutions','corner-solutions','kitchen-wardrobe-accessories',30),
  ('Tandem Attachments','tandem-attachments','kitchen-wardrobe-accessories',40),
  ('Wicker Baskets','wicker-baskets','kitchen-wardrobe-accessories',50),
  ('Rolling Shutters','rolling-shutters','kitchen-wardrobe-accessories',60),
  ('Pulldown Solutions','pulldown-solutions','kitchen-wardrobe-accessories',70),
  ('Dish Racks','dish-racks','kitchen-wardrobe-accessories',80),
  ('Wardrobe Series','wardrobe-series','kitchen-wardrobe-accessories',90),
  ('Waterfall Sinks','smart-kitchen-waterfall-sinks','kitchen-wardrobe-accessories',100),
  ('Lift-Up Solutions','lift-up-solutions','hardware-fittings',10),
  ('General Hardware Fittings','general-hardware-fittings','hardware-fittings',20),
  ('Cabinet Hinges','cabinet-hinges','hardware-fittings',30),
  ('Tandem Box','tandem-box','hardware-fittings',40),
  ('Bins / Waste Management','bins-waste-management','hardware-fittings',50),
  ('Aluminium Profiles','aluminium-profiles','hardware-fittings',60),
  ('Furniture Legs','furniture-legs','hardware-fittings',70),
  ('Rolling Wheels','rolling-wheels','hardware-fittings',80),
  ('Shelf Brackets','shelf-brackets','hardware-fittings',90),
  ('Cabinet Hanging Hardware','cabinet-hanging-hardware','hardware-fittings',100),
  ('Aluminium Frame Accessories','aluminium-frame-accessories','hardware-fittings',110),
  ('GOLA Profiles','gola-profiles','hardware-fittings',120),
  ('Handles','handles','hardware-fittings',130),
  ('Glass Frame Profiles','glass-frame-profiles','hardware-fittings',140),
  ('Wallpaper','wallpaper','home-decor',10),
  ('PU Stone Panels','pu-stone-panels','home-decor',20),
  ('Glass Mosaic Tiles','glass-mosaic-tiles','home-decor',30),
  ('3D PVC Panels','3d-pvc-panels','home-decor',40),
  ('PU Feather Panels','pu-feather-panels','home-decor',50),
  ('Charcoal Louvers','charcoal-louvers','home-decor',60),
  ('Metallic Sheets & Louvers','metallic-sheets-louvers','home-decor',70),
  ('Metallic Sheets','metallic-sheets','home-decor',80),
  ('UV Marble Sheets','uv-marble-sheets','home-decor',90),
  ('Crystal Acrylic Paintings','crystal-acrylic-paintings','home-decor',100),
  ('Pocket Spring Mattresses','pocket-spring-mattresses','home-decor',110),
  ('Blinds','blinds','home-decor',120),
  ('Artificial / Vertical Gardens','artificial-vertical-gardens','home-decor',130),
  ('Water Fountains','water-fountains','home-decor',140),
  ('Ceiling Lights','ceiling-lights','home-decor',150),
  ('Decorative Lighting','decorative-lighting','home-decor',160)
)
insert into public.product_categories (name, slug, parent_id, sort_order, is_active)
select c.name, c.slug, p.id, c.sort_order, true from canonical c
join public.product_categories p on p.slug = c.parent_slug
on conflict (slug) do update set name = excluded.name, parent_id = excluded.parent_id, sort_order = excluded.sort_order, is_active = true;

update public.product_categories set catalogue_group = 'Smart Kitchen Solutions'
where slug in ('pantry-solutions','pullout-solutions','corner-solutions','tandem-attachments','wicker-baskets','rolling-shutters','pulldown-solutions','dish-racks','smart-kitchen-waterfall-sinks');
update public.product_categories set catalogue_group = 'Wardrobe Solutions'
where slug = 'wardrobe-series';
update public.product_categories set catalogue_group = 'Hardware & Profiles'
where parent_id = (select id from public.product_categories where slug = 'hardware-fittings');
update public.product_categories set catalogue_group = 'Home Decor'
where parent_id = (select id from public.product_categories where slug = 'home-decor');

update public.product_categories
set landing_content = jsonb_build_object(
  'sections', jsonb_build_array(
    'Wallpaper Collections','Living Room Wallpapers','Bedroom Wallpapers',
    'Office / Commercial Wallpapers','Modern / Premium Designs',
    'Textured Wallpapers','Wall Decor Solutions','Installation / Enquiry',
    'FAQs','Service / Location Content'
  ),
  'content_status', 'structure_only',
  'location_focus', 'Kollam'
)
where slug = 'wallpaper';

-- Re-parent compatible legacy children, then consolidate legacy wardrobe groups.
update public.product_categories set parent_id = (select id from public.product_categories where slug = 'kitchen-wardrobe-accessories')
where slug in ('pantry-solutions','pullout-solutions','corner-solutions','wicker-baskets','rolling-shutters','dish-racks','smart-kitchen-waterfall-sinks');
update public.product_categories set parent_id = (select id from public.product_categories where slug = 'hardware-fittings')
where slug in ('cabinet-hinges','tandem-box','aluminium-profiles');

update public.products set category_id = (select id from public.product_categories where slug = 'wardrobe-series')
where category_id in (select id from public.product_categories where slug in ('trouser-racks','shoe-racks','wardrobe-lifters','wardrobe-baskets','hangers'));
update public.products set category_id = (select id from public.product_categories where slug = 'wardrobe-series')
where category_id = (select id from public.product_categories where slug = 'wardrobe-accessories');
update public.product_categories set is_active = false
where slug in ('trouser-racks','shoe-racks','wardrobe-lifters','wardrobe-baskets','hangers','wardrobe-accessories');

update public.products set name = 'Trouser Rack', raw_catalogue_data = raw_catalogue_data || jsonb_build_object('product_name','Trouser Rack') where slug = 'wardrobe-trouser-rack';
update public.products set name = 'Shoe Rack', raw_catalogue_data = raw_catalogue_data || jsonb_build_object('product_name','Shoe Rack') where slug = 'wardrobe-shoe-rack';
update public.products set name = 'Wardrobe Lifter', raw_catalogue_data = raw_catalogue_data || jsonb_build_object('product_name','Wardrobe Lifter') where slug = 'wardrobe-lift';

insert into public.products (category_id, name, slug, status, sort_order, raw_catalogue_data)
select c.id, p.name, p.slug, 'draft'::public.content_status, p.sort_order, jsonb_build_object('product_name', p.name)
from (values
  ('Decoration Shelf','decoration-shelf',20),
  ('Leather Basket','leather-basket',40),
  ('Double Liner Trouser Hanger','double-liner-trouser-hanger',50),
  ('Pullout Hanger Holder','pullout-hanger-holder',60),
  ('Side Mounted Pullout Trouser Hanger','side-mounted-pullout-trouser-hanger',70),
  ('Top Mounted Pullout Trouser Hanger','top-mounted-pullout-trouser-hanger',80)
) as p(name, slug, sort_order)
cross join public.product_categories c where c.slug = 'wardrobe-series'
on conflict (slug) do nothing;

-- Move products from old/mismatched groups into their canonical category.
update public.products set category_id = (select id from public.product_categories where slug = 'lift-up-solutions')
where category_id = (select id from public.product_categories where slug = 'lift-up-solutions' limit 1);
update public.products set category_id = (select id from public.product_categories where slug = 'bins-waste-management')
where category_id in (select id from public.product_categories where slug = 'bins');
update public.product_categories set is_active = false where slug = 'bins';

update public.products p set category_id = c.id
from public.product_categories c
where (p.slug, c.slug) in (('wallpaper','wallpaper'),('glass-mosaic-tiles','glass-mosaic-tiles'),('charcoal-louvers','charcoal-louvers'));

-- The brief explicitly confirms this catalogue name and its two variants.
update public.products
set name = 'Glass Pantry With Bidding',
    slug = 'glass-pantry-with-bidding',
    raw_catalogue_data = raw_catalogue_data || jsonb_build_object(
      'product_name', 'Glass Pantry With Bidding',
      'primary_product_code', product_code
    )
where slug = 'glass-pantry';

update public.product_variants v
set raw_catalogue_data = v.raw_catalogue_data || jsonb_build_object(
  'variant_name', v.name,
  'variant_code', v.sku,
  'dimensions', v.dimension,
  'finish', v.finish
)
where v.product_id = (select id from public.products where slug = 'glass-pantry-with-bidding');

-- The legacy generic Smart Furniture card conflicts with the canonical SKU-level model.
-- Archive it without deleting it; exact catalogue products are seeded separately.
update public.products set category_id = (select id from public.product_categories where slug = 'smart-furniture')
where category_id = (select id from public.product_categories where slug = 'smart-furniture-legacy');
update public.products set status = 'archived'
where slug = 'smart-furniture' and name = 'Smart Furniture';

insert into public.products (category_id, name, slug, status, sort_order, raw_catalogue_data)
select c.id, p.name, p.slug, 'draft'::public.content_status, p.sort_order, jsonb_build_object('product_name', p.name)
from (values
  ('Smart WiFi Side Table','smart-wifi-side-table',10),
  ('Extendable Study Table / Box Desk','extendable-study-table-box-desk',20),
  ('Lift-Up Coffee Table','lift-up-coffee-table',30)
) as p(name, slug, sort_order)
cross join public.product_categories c
where c.slug = 'smart-furniture'
on conflict (slug) do nothing;

-- Exactly four active public roots after migration. Legacy rows remain traceable but inactive.
update public.product_categories set is_active = false
where parent_id is null and slug not in ('kitchen-wardrobe-accessories','hardware-fittings','home-decor','smart-furniture');

do $$
begin
  if (select count(*) from public.product_categories where parent_id is null and is_active) <> 4 then
    raise exception 'canonical catalogue must expose exactly four active root categories';
  end if;
  if exists (
    select 1 from public.products p
    join public.product_categories c on c.id = p.category_id
    where p.status = 'published' and not c.is_active
  ) then
    raise exception 'published product remains assigned to an inactive category';
  end if;
end;
$$;
