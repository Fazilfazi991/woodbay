-- Complete WoodBay catalogue image pass. Additive and idempotent.
-- New catalogue records remain draft until the reviewed migration is explicitly applied.
-- Existing records retain status, codes, descriptions, and historical data.
with catalogue(slug, name, category_slug, catalogue_page, source_reference, image_path, sort_order) as (values
  ('3d-pvc-panels', '3D PVC Panels', '3d-pvc-panels', '', 'Woodbay.pdf, page 11', '/images/products/3d-pvc-panels.webp', 10),
  ('3d-zero-profile-soft-close-hinge', '3D Zero Profile Soft Close Hinge', 'cabinet-hinges', '', 'Woodbay.pdf, page 7', '/images/products/3d-zero-profile-soft-close-hinge.webp', 20),
  ('aluminium-frame-beading', 'Aluminium Frame Beading Type', 'aluminium-frame-accessories', '', 'Woodbay.pdf, page 6', '/images/products/aluminium-frame-beading.webp', 30),
  ('aluminium-frame-corner-clip', 'Aluminium Frame Corner Clip', 'aluminium-frame-accessories', '', 'Woodbay.pdf, page 6', '/images/products/aluminium-frame-corner-clip.webp', 40),
  ('anti-slip-matt', 'Anti Slip Matt', 'tandem-attachments', '', 'Woodbay.pdf, page 3', '/images/products/anti-slip-matt.webp', 50),
  ('artificial-vertical-gardens', 'Artificial / Vertical Gardens', 'artificial-vertical-gardens', '', 'Woodbay.pdf, page 11', '/images/products/artificial-vertical-gardens.webp', 60),
  ('bed-fitting-without-gas-spring', 'Bed Fitting Without Gas Spring', 'general-hardware-fittings', '', 'Woodbay.pdf, page 5', '/images/products/bed-fitting-without-gas-spring.webp', 70),
  ('bin-auto-lid', 'Bin Auto Lid', 'bins-waste-management', '', 'Woodbay.pdf, page 7', '/images/products/bin-auto-lid.webp', 80),
  ('blinds', 'Blinds', 'blinds', '', 'Woodbay.pdf, page 11', '/images/products/blinds.webp', 90),
  ('c-gola', 'C GOLA', 'gola-profiles', '', 'Woodbay.pdf, page 8', '/images/products/c-gola.webp', 100),
  ('cabinet-hanging-bracket', 'Cabinet Hanging Bracket', 'cabinet-hanging-hardware', '', 'Woodbay.pdf, page 7', '/images/products/cabinet-hanging-bracket.webp', 110),
  ('ceiling-lights', 'Ceiling Lights', 'ceiling-lights', '', 'Woodbay.pdf, page 11', '/images/products/ceiling-lights.webp', 120),
  ('charcoal-louvers', 'Charcoal Louvers', 'charcoal-louvers', '', 'Woodbay.pdf, page 11', '/images/products/charcoal-louvers.webp', 130),
  ('chrome-dish-rack', 'Chrome Dish Rack', 'dish-racks', '', 'Woodbay.pdf, page 5', '/images/products/chrome-dish-rack.webp', 140),
  ('coffee-table-lift-up-mechanism', 'Coffee Table Lift Up Mechanism', 'lift-up-solutions', '', 'Woodbay.pdf, page 5', '/images/products/coffee-table-lift-up-mechanism.webp', 150),
  ('crystal-acrylic-paintings', 'Crystal Acrylic Paintings', 'crystal-acrylic-paintings', '', 'Woodbay.pdf, page 11', '/images/products/crystal-acrylic-paintings.webp', 160),
  ('decoration-shelf', 'Decoration Shelf', 'wardrobe-series', '', 'Woodbay.pdf, page 5', '/images/products/decoration-shelf.webp', 170),
  ('decorative-lighting', 'Decorative Lighting', 'decorative-lighting', '', 'Woodbay.pdf, page 11', '/images/products/decorative-lighting.webp', 180),
  ('double-liner-trouser-hanger', 'Top Mounted Double Liner Trouser Hanger', 'wardrobe-series', '', 'Woodbay.pdf, page 6', '/images/products/double-liner-trouser-hanger.webp', 190),
  ('extendable-study-table-box-desk', 'Extendable Study Table / Box Desk', 'smart-furniture', '', 'Woodbay.pdf, page 9', '/images/products/extendable-study-table-box-desk.webp', 200),
  ('soft-close-hinge', 'Five Hole SS 3D Hydraulic Hinge Premium', 'cabinet-hinges', '', 'Woodbay.pdf, page 7', '/images/products/five-hole-ss-3d-hydraulic-hinge-premium.webp', 210),
  ('folding-shelf-bracket', 'Folding Shelf Bracket', 'shelf-brackets', '', 'Woodbay.pdf, page 4', '/images/products/folding-shelf-bracket.webp', 220),
  ('full-ss-3d-304-hydraulic-hinge', 'Full SS 3D 304 Hydraulic Hinge', 'cabinet-hinges', '', 'Woodbay.pdf, page 7', '/images/products/full-ss-3d-304-hydraulic-hinge.webp', 230),
  ('glass-frame-profile-22mm', 'Glass Frame Profile 22Mm', 'glass-frame-profiles', '', 'Woodbay.pdf, page 8', '/images/products/glass-frame-profile-22mm.webp', 240),
  ('glass-frame-profile-45mm', 'Glass Frame Profile 45Mm', 'glass-frame-profiles', '', 'Woodbay.pdf, page 8', '/images/products/glass-frame-profile-45mm.webp', 250),
  ('glass-handle-22mm', 'Glass Handle 22Mm', 'handles', '', 'Woodbay.pdf, page 8', '/images/products/glass-handle-22mm.webp', 260),
  ('glass-handle-65mm', 'Glass Handle 65Mm', 'handles', '', 'Woodbay.pdf, page 8', '/images/products/glass-handle-65mm.webp', 270),
  ('glass-mosaic-tiles', 'Glass Mosaic Tiles', 'glass-mosaic-tiles', '', 'Woodbay.pdf, page 11', '/images/products/glass-mosaic-tiles.webp', 280),
  ('glass-pulldown-with-bidding', 'Glass Pulldown With Bidding', 'pulldown-solutions', '', 'Woodbay.pdf, page 5', '/images/products/glass-pulldown-with-bidding.webp', 290),
  ('glass-rolling-shutters', 'Glass Rolling Shutters', 'rolling-shutters', '', 'Woodbay.pdf, page 4', '/images/products/glass-rolling-shutters.webp', 300),
  ('i-handle', 'I Handle', 'handles', '', 'Woodbay.pdf, page 8', '/images/products/i-handle.webp', 310),
  ('imported-pure-wooden-wicker-basket', 'Imported Pure Wooden Wicker Basket', 'wicker-baskets', '', 'Woodbay.pdf, page 4', '/images/products/imported-pure-wooden-wicker-basket.webp', 320),
  ('j-gola', 'J GOLA', 'gola-profiles', '', 'Woodbay.pdf, page 8', '/images/products/j-gola.webp', 330),
  ('j-handle', 'J Handle', 'handles', '', 'Woodbay.pdf, page 8', '/images/products/j-handle.webp', 340),
  ('leather-basket', 'Leather Basket', 'wardrobe-series', '', 'Woodbay.pdf, page 6', '/images/products/leather-basket.webp', 350),
  ('lift-up-coffee-table', 'Lift Up Coffee Table', 'smart-furniture', '', 'Woodbay.pdf, page 9', '/images/products/lift-up-coffee-table.webp', 360),
  ('metallic-sheets-louvers', 'Metallic Sheets & Louvers', 'metallic-sheets-louvers', '', 'Woodbay.pdf, page 11', '/images/products/metallic-sheets-louvers.webp', 370),
  ('metallic-sheets', 'Metallic Sheets', 'metallic-sheets', '', 'Woodbay.pdf, page 11', '/images/products/metallic-sheets.webp', 380),
  ('pan-hanger-rack', 'Pan Hanger Rack', 'pullout-solutions', '', 'Woodbay.pdf, page 5', '/images/products/pan-hanger-rack.webp', 390),
  ('pocket-spring-mattresses', 'Pocket Spring Mattresses', 'pocket-spring-mattresses', '', 'Woodbay.pdf, page 11', '/images/products/pocket-spring-mattresses.webp', 400),
  ('pu-feather-panels', 'PU Feather Panels', 'pu-feather-panels', '', 'Woodbay.pdf, page 11', '/images/products/pu-feather-panels.webp', 410),
  ('pu-stone-panels', 'PU Stone Panels', 'pu-stone-panels', '', 'Woodbay.pdf, page 11', '/images/products/pu-stone-panels.webp', 420),
  ('pullout-hanger-holder', 'Top Mounted Pullout Coat Hanger Holder 8 Beads', 'wardrobe-series', '', 'Woodbay.pdf, page 6', '/images/products/pullout-hanger-holder.webp', 430),
  ('pvc-leg-heavy', 'PVC Leg Heavy', 'furniture-legs', '', 'Woodbay.pdf, page 4', '/images/products/pvc-leg-heavy.webp', 440),
  ('pvc-rolling-shutters', 'PVC Rolling Shutters', 'rolling-shutters', '', 'Woodbay.pdf, page 4', '/images/products/pvc-rolling-shutters.webp', 450),
  ('pvc-wicker-basket', 'PVC Wicker Basket', 'wicker-baskets', '', 'Woodbay.pdf, page 4', '/images/products/pvc-wicker-basket.webp', 460),
  ('rolling-wheel', 'Rolling Wheel', 'rolling-wheels', '', 'Woodbay.pdf, page 6', '/images/products/rolling-wheel.webp', 470),
  ('s-corner-dark-grey', 'S Corner Dark-Grey', 'corner-solutions', '', 'Woodbay.pdf, page 3', '/images/products/s-corner-dark-grey.webp', 480),
  ('corner-basket', 'S Corner White', 'corner-solutions', '', 'Woodbay.pdf, page 3', '/images/products/s-corner-white.webp', 490),
  ('wardrobe-shoe-rack', 'Shoe Rack', 'wardrobe-series', '', 'Woodbay.pdf, page 5', '/images/products/shoe-rack.webp', 500),
  ('side-mounted-pullout-trouser-hanger', 'Side Mounted Pullout Trouser Hanger', 'wardrobe-series', '', 'Woodbay.pdf, page 6', '/images/products/side-mounted-pullout-trouser-hanger.webp', 510),
  ('sliding-waste-bin', 'Sliding Waste Bin', 'bins-waste-management', '', 'Woodbay.pdf, page 7', '/images/products/sliding-waste-bin.webp', 520),
  ('tandem-box-system', 'Slim Box Dark Grey', 'tandem-box', '', 'Woodbay.pdf, page 7', '/images/products/slim-box-dark-grey.webp', 530),
  ('smart-wifi-side-table', 'Smart WiFi Side Table', 'smart-furniture', '', 'Woodbay.pdf, page 9', '/images/products/smart-wifi-side-table.webp', 540),
  ('sofa-leg', 'Sofa Leg', 'furniture-legs', '', 'Woodbay.pdf, page 6', '/images/products/sofa-leg.webp', 550),
  ('soft-close-gas-spring', 'Soft Close Gas Spring', 'lift-up-solutions', '', 'Woodbay.pdf, page 5', '/images/products/soft-close-gas-spring.webp', 560),
  ('ss-2d-hydraulic-hinge-heavy', 'SS 2D Hydraulic Hinge Heavy', 'cabinet-hinges', '', 'Woodbay.pdf, page 7', '/images/products/ss-2d-hydraulic-hinge-heavy.webp', 570),
  ('ss-3d-short-arm-hinge', 'SS 3D Short Arm Hinge', 'cabinet-hinges', '', 'Woodbay.pdf, page 7', '/images/products/ss-3d-short-arm-hinge.webp', 580),
  ('ss-short-arm-90-hydraulic-hinge', 'SS Short Arm 90 Hydraulic Hinge', 'cabinet-hinges', '', 'Woodbay.pdf, page 7', '/images/products/ss-short-arm-90-hydraulic-hinge.webp', 590),
  ('standard-bill-lift-up', 'Standard Bill Lift Up', 'lift-up-solutions', '', 'Woodbay.pdf, page 4', '/images/products/standard-bill-lift-up.webp', 600),
  ('tandem-attachment-pvc-grip', 'Tandem Attachment PVC Grip', 'tandem-attachments', '', 'Woodbay.pdf, page 3', '/images/products/tandem-attachment-pvc-grip.webp', 610),
  ('top-mounted-pullout-trouser-hanger', 'Top Mounted Pullout Trouser Hanger', 'wardrobe-series', '', 'Woodbay.pdf, page 6', '/images/products/top-mounted-pullout-trouser-hanger.webp', 620),
  ('wardrobe-trouser-rack', 'Trouser Rack', 'wardrobe-series', '', 'Woodbay.pdf, page 5', '/images/products/trouser-rack.webp', 630),
  ('unbreakable-cutlery', 'Un Breakable Cutlery', 'tandem-attachments', '', 'Woodbay.pdf, page 3', '/images/products/unbreakable-cutlery.webp', 640),
  ('magic-corner', 'Universal Magic Corner - Glass', 'corner-solutions', '', 'Woodbay.pdf, page 3', '/images/products/universal-magic-corner-glass.webp', 650),
  ('uv-marble-sheets', 'UV Marble Sheets', 'uv-marble-sheets', '', 'Woodbay.pdf, page 11', '/images/products/uv-marble-sheets.webp', 660),
  ('wallpaper', 'Wallpaper', 'wallpaper', '', 'Woodbay.pdf, page 11', '/images/products/wallpaper.webp', 670),
  ('wardrobe-lift', 'Wardrobe Lifter', 'wardrobe-series', '', 'Woodbay.pdf, page 6', '/images/products/wardrobe-lifter.webp', 680),
  ('water-fountains', 'Water Fountains', 'water-fountains', '', 'Woodbay.pdf, page 11', '/images/products/water-fountains.webp', 690),
  ('waterfall-sink', 'Waterfall Sink', 'smart-kitchen-waterfall-sinks', '', 'Woodbay.pdf, page 10', '/images/products/waterfall-sink.webp', 700)
)
insert into public.products (
  category_id, name, slug, status, sort_order,
  catalogue_page_number, catalogue_source_reference, raw_catalogue_data
)
select c.id, x.name, x.slug, 'draft'::public.content_status, x.sort_order,
       x.catalogue_page, x.source_reference,
       jsonb_build_object('product_name', x.name, 'catalogue_page', x.catalogue_page)
from catalogue x
join public.product_categories c on c.slug = x.category_slug
on conflict (slug) do update
set name = excluded.name,
    category_id = excluded.category_id,
    catalogue_page_number = coalesce(public.products.catalogue_page_number, excluded.catalogue_page_number),
    catalogue_source_reference = coalesce(public.products.catalogue_source_reference, excluded.catalogue_source_reference),
    raw_catalogue_data = coalesce(public.products.raw_catalogue_data, '{}'::jsonb) || excluded.raw_catalogue_data;

with catalogue(slug, name, image_path, catalogue_page) as (values
  ('3d-pvc-panels', '3D PVC Panels', '/images/products/3d-pvc-panels.webp', ''),
  ('3d-zero-profile-soft-close-hinge', '3D Zero Profile Soft Close Hinge', '/images/products/3d-zero-profile-soft-close-hinge.webp', ''),
  ('aluminium-frame-beading', 'Aluminium Frame Beading Type', '/images/products/aluminium-frame-beading.webp', ''),
  ('aluminium-frame-corner-clip', 'Aluminium Frame Corner Clip', '/images/products/aluminium-frame-corner-clip.webp', ''),
  ('anti-slip-matt', 'Anti Slip Matt', '/images/products/anti-slip-matt.webp', ''),
  ('artificial-vertical-gardens', 'Artificial / Vertical Gardens', '/images/products/artificial-vertical-gardens.webp', ''),
  ('bed-fitting-without-gas-spring', 'Bed Fitting Without Gas Spring', '/images/products/bed-fitting-without-gas-spring.webp', ''),
  ('bin-auto-lid', 'Bin Auto Lid', '/images/products/bin-auto-lid.webp', ''),
  ('blinds', 'Blinds', '/images/products/blinds.webp', ''),
  ('c-gola', 'C GOLA', '/images/products/c-gola.webp', ''),
  ('cabinet-hanging-bracket', 'Cabinet Hanging Bracket', '/images/products/cabinet-hanging-bracket.webp', ''),
  ('ceiling-lights', 'Ceiling Lights', '/images/products/ceiling-lights.webp', ''),
  ('charcoal-louvers', 'Charcoal Louvers', '/images/products/charcoal-louvers.webp', ''),
  ('chrome-dish-rack', 'Chrome Dish Rack', '/images/products/chrome-dish-rack.webp', ''),
  ('coffee-table-lift-up-mechanism', 'Coffee Table Lift Up Mechanism', '/images/products/coffee-table-lift-up-mechanism.webp', ''),
  ('crystal-acrylic-paintings', 'Crystal Acrylic Paintings', '/images/products/crystal-acrylic-paintings.webp', ''),
  ('decoration-shelf', 'Decoration Shelf', '/images/products/decoration-shelf.webp', ''),
  ('decorative-lighting', 'Decorative Lighting', '/images/products/decorative-lighting.webp', ''),
  ('double-liner-trouser-hanger', 'Top Mounted Double Liner Trouser Hanger', '/images/products/double-liner-trouser-hanger.webp', ''),
  ('extendable-study-table-box-desk', 'Extendable Study Table / Box Desk', '/images/products/extendable-study-table-box-desk.webp', ''),
  ('soft-close-hinge', 'Five Hole SS 3D Hydraulic Hinge Premium', '/images/products/five-hole-ss-3d-hydraulic-hinge-premium.webp', ''),
  ('folding-shelf-bracket', 'Folding Shelf Bracket', '/images/products/folding-shelf-bracket.webp', ''),
  ('full-ss-3d-304-hydraulic-hinge', 'Full SS 3D 304 Hydraulic Hinge', '/images/products/full-ss-3d-304-hydraulic-hinge.webp', ''),
  ('glass-frame-profile-22mm', 'Glass Frame Profile 22Mm', '/images/products/glass-frame-profile-22mm.webp', ''),
  ('glass-frame-profile-45mm', 'Glass Frame Profile 45Mm', '/images/products/glass-frame-profile-45mm.webp', ''),
  ('glass-handle-22mm', 'Glass Handle 22Mm', '/images/products/glass-handle-22mm.webp', ''),
  ('glass-handle-65mm', 'Glass Handle 65Mm', '/images/products/glass-handle-65mm.webp', ''),
  ('glass-mosaic-tiles', 'Glass Mosaic Tiles', '/images/products/glass-mosaic-tiles.webp', ''),
  ('glass-pulldown-with-bidding', 'Glass Pulldown With Bidding', '/images/products/glass-pulldown-with-bidding.webp', ''),
  ('glass-rolling-shutters', 'Glass Rolling Shutters', '/images/products/glass-rolling-shutters.webp', ''),
  ('i-handle', 'I Handle', '/images/products/i-handle.webp', ''),
  ('imported-pure-wooden-wicker-basket', 'Imported Pure Wooden Wicker Basket', '/images/products/imported-pure-wooden-wicker-basket.webp', ''),
  ('j-gola', 'J GOLA', '/images/products/j-gola.webp', ''),
  ('j-handle', 'J Handle', '/images/products/j-handle.webp', ''),
  ('leather-basket', 'Leather Basket', '/images/products/leather-basket.webp', ''),
  ('lift-up-coffee-table', 'Lift Up Coffee Table', '/images/products/lift-up-coffee-table.webp', ''),
  ('metallic-sheets-louvers', 'Metallic Sheets & Louvers', '/images/products/metallic-sheets-louvers.webp', ''),
  ('metallic-sheets', 'Metallic Sheets', '/images/products/metallic-sheets.webp', ''),
  ('pan-hanger-rack', 'Pan Hanger Rack', '/images/products/pan-hanger-rack.webp', ''),
  ('pocket-spring-mattresses', 'Pocket Spring Mattresses', '/images/products/pocket-spring-mattresses.webp', ''),
  ('pu-feather-panels', 'PU Feather Panels', '/images/products/pu-feather-panels.webp', ''),
  ('pu-stone-panels', 'PU Stone Panels', '/images/products/pu-stone-panels.webp', ''),
  ('pullout-hanger-holder', 'Top Mounted Pullout Coat Hanger Holder 8 Beads', '/images/products/pullout-hanger-holder.webp', ''),
  ('pvc-leg-heavy', 'PVC Leg Heavy', '/images/products/pvc-leg-heavy.webp', ''),
  ('pvc-rolling-shutters', 'PVC Rolling Shutters', '/images/products/pvc-rolling-shutters.webp', ''),
  ('pvc-wicker-basket', 'PVC Wicker Basket', '/images/products/pvc-wicker-basket.webp', ''),
  ('rolling-wheel', 'Rolling Wheel', '/images/products/rolling-wheel.webp', ''),
  ('s-corner-dark-grey', 'S Corner Dark-Grey', '/images/products/s-corner-dark-grey.webp', ''),
  ('corner-basket', 'S Corner White', '/images/products/s-corner-white.webp', ''),
  ('wardrobe-shoe-rack', 'Shoe Rack', '/images/products/shoe-rack.webp', ''),
  ('side-mounted-pullout-trouser-hanger', 'Side Mounted Pullout Trouser Hanger', '/images/products/side-mounted-pullout-trouser-hanger.webp', ''),
  ('sliding-waste-bin', 'Sliding Waste Bin', '/images/products/sliding-waste-bin.webp', ''),
  ('tandem-box-system', 'Slim Box Dark Grey', '/images/products/slim-box-dark-grey.webp', ''),
  ('smart-wifi-side-table', 'Smart WiFi Side Table', '/images/products/smart-wifi-side-table.webp', ''),
  ('sofa-leg', 'Sofa Leg', '/images/products/sofa-leg.webp', ''),
  ('soft-close-gas-spring', 'Soft Close Gas Spring', '/images/products/soft-close-gas-spring.webp', ''),
  ('ss-2d-hydraulic-hinge-heavy', 'SS 2D Hydraulic Hinge Heavy', '/images/products/ss-2d-hydraulic-hinge-heavy.webp', ''),
  ('ss-3d-short-arm-hinge', 'SS 3D Short Arm Hinge', '/images/products/ss-3d-short-arm-hinge.webp', ''),
  ('ss-short-arm-90-hydraulic-hinge', 'SS Short Arm 90 Hydraulic Hinge', '/images/products/ss-short-arm-90-hydraulic-hinge.webp', ''),
  ('standard-bill-lift-up', 'Standard Bill Lift Up', '/images/products/standard-bill-lift-up.webp', ''),
  ('tandem-attachment-pvc-grip', 'Tandem Attachment PVC Grip', '/images/products/tandem-attachment-pvc-grip.webp', ''),
  ('top-mounted-pullout-trouser-hanger', 'Top Mounted Pullout Trouser Hanger', '/images/products/top-mounted-pullout-trouser-hanger.webp', ''),
  ('wardrobe-trouser-rack', 'Trouser Rack', '/images/products/trouser-rack.webp', ''),
  ('unbreakable-cutlery', 'Un Breakable Cutlery', '/images/products/unbreakable-cutlery.webp', ''),
  ('magic-corner', 'Universal Magic Corner - Glass', '/images/products/universal-magic-corner-glass.webp', ''),
  ('uv-marble-sheets', 'UV Marble Sheets', '/images/products/uv-marble-sheets.webp', ''),
  ('wallpaper', 'Wallpaper', '/images/products/wallpaper.webp', ''),
  ('wardrobe-lift', 'Wardrobe Lifter', '/images/products/wardrobe-lifter.webp', ''),
  ('water-fountains', 'Water Fountains', '/images/products/water-fountains.webp', ''),
  ('waterfall-sink', 'Waterfall Sink', '/images/products/waterfall-sink.webp', '')
)
insert into public.product_images (
  product_id, storage_key, alt_text, sort_order, is_primary,
  image_role, raw_catalogue_reference
)
select p.id, x.image_path, x.name,
       coalesce((select max(i.sort_order) + 1 from public.product_images i where i.product_id = p.id), 0),
       not exists (select 1 from public.product_images i where i.product_id = p.id),
       'primary',
       jsonb_build_object('source', 'Woodbay.pdf', 'catalogue_page', x.catalogue_page, 'product_name', x.name)::text
from catalogue x
join public.products p on p.slug = x.slug
where not exists (
  select 1 from public.product_images i
  where i.product_id = p.id and i.storage_key = x.image_path
);

-- Exact page-3 variants that are legible in the catalogue. No values are inferred.
with variants(product_slug, name, sku, dimension, colour, sort_order) as (values
  ('corner-basket','900mm L/R Option','OEM-CW212, CW213','900mm L/R Option','White',10),
  ('s-corner-dark-grey','900mm L/R Option','OEM-CG216, CG217','900mm L/R Option','Dark-Grey',10),
  ('magic-corner','900mm','OEM-GLR90','900mm',null,10),
  ('anti-slip-matt','500mm x 20 metre','OEM-ASM-502','500mm x 20 metre',null,10),
  ('anti-slip-matt','550mm x 20 metre','OEM-ASM-552','550mm x 20 metre',null,20),
  ('anti-slip-matt','500mm x 5 metre','OEM-ASM-555','500mm x 5 metre',null,30),
  ('unbreakable-cutlery','600mm','OEM-UBC-060','600mm',null,10),
  ('unbreakable-cutlery','700mm','OEM-UBC-070','700mm',null,20),
  ('unbreakable-cutlery','800mm','OEM-UBC-080','800mm',null,30),
  ('unbreakable-cutlery','900mm','OEM-UBC-090','900mm',null,40)
)
insert into public.product_variants (
  product_id, name, sku, dimension, colour, raw_catalogue_data, sort_order
)
select p.id, v.name, v.sku, v.dimension, v.colour,
       jsonb_build_object('variant_code', v.sku, 'dimension', v.dimension, 'colour', v.colour),
       v.sort_order
from variants v
join public.products p on p.slug = v.product_slug
where not exists (
  select 1 from public.product_variants existing
  where existing.product_id = p.id
    and existing.name = v.name
    and existing.sku is not distinct from v.sku
);
