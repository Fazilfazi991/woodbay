-- Canonical public catalogue taxonomy. Exactly four active top-level divisions.
insert into public.product_categories (name, slug, parent_id, sort_order, is_active) values
  ('Kitchen & Wardrobe Accessories', 'kitchen-wardrobe-accessories', null, 10, true),
  ('Hardware Fittings & Aluminium Profiles', 'hardware-fittings', null, 20, true),
  ('Home Decor', 'home-decor', null, 30, true),
  ('Smart Furniture', 'smart-furniture', null, 40, true)
on conflict (slug) do update set name = excluded.name, parent_id = null, sort_order = excluded.sort_order, is_active = true;

with canonical(name, slug, parent_slug, group_name, sort_order) as (values
  ('Pantry Solutions','pantry-solutions','kitchen-wardrobe-accessories','Smart Kitchen Solutions',10),('Pullout Solutions','pullout-solutions','kitchen-wardrobe-accessories','Smart Kitchen Solutions',20),('Corner Solutions','corner-solutions','kitchen-wardrobe-accessories','Smart Kitchen Solutions',30),('Tandem Attachments','tandem-attachments','kitchen-wardrobe-accessories','Smart Kitchen Solutions',40),('Wicker Baskets','wicker-baskets','kitchen-wardrobe-accessories','Smart Kitchen Solutions',50),('Rolling Shutters','rolling-shutters','kitchen-wardrobe-accessories','Smart Kitchen Solutions',60),('Pulldown Solutions','pulldown-solutions','kitchen-wardrobe-accessories','Smart Kitchen Solutions',70),('Dish Racks','dish-racks','kitchen-wardrobe-accessories','Smart Kitchen Solutions',80),('Wardrobe Series','wardrobe-series','kitchen-wardrobe-accessories','Wardrobe Solutions',90),('Waterfall Sinks','smart-kitchen-waterfall-sinks','kitchen-wardrobe-accessories','Smart Kitchen Solutions',100),
  ('Lift-Up Solutions','lift-up-solutions','hardware-fittings','Hardware & Profiles',10),('General Hardware Fittings','general-hardware-fittings','hardware-fittings','Hardware & Profiles',20),('Cabinet Hinges','cabinet-hinges','hardware-fittings','Hardware & Profiles',30),('Tandem Box','tandem-box','hardware-fittings','Hardware & Profiles',40),('Bins / Waste Management','bins-waste-management','hardware-fittings','Hardware & Profiles',50),('Aluminium Profiles','aluminium-profiles','hardware-fittings','Hardware & Profiles',60),('Furniture Legs','furniture-legs','hardware-fittings','Hardware & Profiles',70),('Rolling Wheels','rolling-wheels','hardware-fittings','Hardware & Profiles',80),('Shelf Brackets','shelf-brackets','hardware-fittings','Hardware & Profiles',90),('Cabinet Hanging Hardware','cabinet-hanging-hardware','hardware-fittings','Hardware & Profiles',100),('Aluminium Frame Accessories','aluminium-frame-accessories','hardware-fittings','Hardware & Profiles',110),('GOLA Profiles','gola-profiles','hardware-fittings','Hardware & Profiles',120),('Handles','handles','hardware-fittings','Hardware & Profiles',130),('Glass Frame Profiles','glass-frame-profiles','hardware-fittings','Hardware & Profiles',140),
  ('Wallpaper','wallpaper','home-decor','Home Decor',10),('PU Stone Panels','pu-stone-panels','home-decor','Home Decor',20),('Glass Mosaic Tiles','glass-mosaic-tiles','home-decor','Home Decor',30),('3D PVC Panels','3d-pvc-panels','home-decor','Home Decor',40),('PU Feather Panels','pu-feather-panels','home-decor','Home Decor',50),('Charcoal Louvers','charcoal-louvers','home-decor','Home Decor',60),('Metallic Sheets & Louvers','metallic-sheets-louvers','home-decor','Home Decor',70),('Metallic Sheets','metallic-sheets','home-decor','Home Decor',80),('UV Marble Sheets','uv-marble-sheets','home-decor','Home Decor',90),('Crystal Acrylic Paintings','crystal-acrylic-paintings','home-decor','Home Decor',100),('Pocket Spring Mattresses','pocket-spring-mattresses','home-decor','Home Decor',110),('Blinds','blinds','home-decor','Home Decor',120),('Artificial / Vertical Gardens','artificial-vertical-gardens','home-decor','Home Decor',130),('Water Fountains','water-fountains','home-decor','Home Decor',140),('Ceiling Lights','ceiling-lights','home-decor','Home Decor',150),('Decorative Lighting','decorative-lighting','home-decor','Home Decor',160)
)
insert into public.product_categories (name, slug, parent_id, catalogue_group, sort_order, is_active)
select c.name, c.slug, p.id, c.group_name, c.sort_order, true from canonical c
join public.product_categories p on p.slug = c.parent_slug
on conflict (slug) do update set name = excluded.name, parent_id = excluded.parent_id, catalogue_group = excluded.catalogue_group, sort_order = excluded.sort_order, is_active = true;

-- Smart Furniture entries supplied by the client. Specifications remain blank
-- until exact catalogue values are entered.
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
