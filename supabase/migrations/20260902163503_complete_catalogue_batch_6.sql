-- Batch 6 catalogue completion. Additive, rerunnable, and ID-preserving.
-- Catalogue-backed draft rows are promoted in place; voucher/dealer data is untouched.

update public.product_categories
set name = 'Smart Kitchen & Wardrobe Solutions'
where slug = 'kitchen-wardrobe-accessories';

-- Consolidate the two verified PU panel types under one public family. These
-- categories were never public, so no published route is displaced.
update public.product_categories
set name = 'PU Panels', slug = 'pu-panels', sort_order = 20, is_active = true,
    description = 'PU decorative panel collections for feature walls and interior surface treatments.'
where slug = 'pu-stone-panels';

update public.products
set category_id = (select id from public.product_categories where slug = 'pu-panels')
where slug in ('pu-stone-panels', 'pu-feather-panels');

update public.product_categories
set is_active = false
where slug = 'pu-feather-panels';

-- Mattresses is the family; Pocket Spring Mattress is the verified product.
update public.product_categories
set name = 'Mattresses', slug = 'mattresses', sort_order = 110, is_active = true,
    description = 'WoodBay mattress collections for bedroom furniture and sleep spaces.'
where slug = 'pocket-spring-mattresses';

update public.products
set name = 'Pocket Spring Mattress',
    category_id = (select id from public.product_categories where slug = 'mattresses')
where slug = 'pocket-spring-mattresses';

-- Preserve established product slugs while cleaning public terminology.
update public.product_categories
set name = 'Crystal Acrylic Prints',
    description = 'Decorative crystal acrylic print collections for interior walls.'
where slug = 'crystal-acrylic-paintings';

update public.products
set name = 'Crystal Acrylic Prints'
where slug = 'crystal-acrylic-paintings';

update public.product_categories
set name = 'Vertical Gardens',
    description = 'Artificial vertical garden panels for decorative indoor wall applications.'
where slug = 'artificial-vertical-gardens';

update public.products
set name = 'Vertical Garden'
where slug = 'artificial-vertical-gardens';

-- These two approved products predate the catalogue import and therefore may
-- be absent on a truly empty replay. Upsert by slug preserves production IDs.
with required(category_slug, name, slug, product_code, source_reference, sort_order) as (values
  ('pantry-solutions', 'Glass Pantry With Bidding', 'glass-pantry-with-bidding', 'OEM-IM4506L', 'Woodbay.pdf, page 3', 10),
  ('pullout-solutions', 'Glass BPO With Bidding', 'bottle-pullout', 'OEM-GLB-BM20', 'Woodbay.pdf, page 3', 10)
)
insert into public.products (
  category_id, name, slug, product_code, status, sort_order,
  catalogue_source_reference, raw_catalogue_data
)
select c.id, r.name, r.slug, r.product_code, 'published'::public.content_status,
       r.sort_order, r.source_reference,
       jsonb_build_object('product_name', r.name, 'primary_product_code', r.product_code)
from required r
join public.product_categories c on c.slug = r.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  product_code = coalesce(public.products.product_code, excluded.product_code),
  catalogue_source_reference = coalesce(public.products.catalogue_source_reference, excluded.catalogue_source_reference),
  raw_catalogue_data = public.products.raw_catalogue_data || excluded.raw_catalogue_data;

with images(product_slug, path, alt_text) as (values
  ('glass-pantry-with-bidding', '/images/products/glass-pantry-with-bidding.webp', 'Glass Pantry With Bidding'),
  ('bottle-pullout', '/images/products/glass-bpo-with-bidding.webp', 'Glass BPO With Bidding')
)
insert into public.product_images (
  product_id, storage_key, alt_text, sort_order, is_primary, image_role,
  raw_catalogue_reference
)
select p.id, i.path, i.alt_text, 0, true, 'primary', 'Woodbay.pdf, page 3'
from images i join public.products p on p.slug = i.product_slug
where not exists (
  select 1 from public.product_images existing
  where existing.product_id = p.id and existing.storage_key = i.path
);

with variants(product_slug, name, sku, dimension, sort_order) as (values
  ('glass-pantry-with-bidding', '450mm × 6 Layer', 'OEM-IM4506L', '450mm × 6 Layer', 10),
  ('glass-pantry-with-bidding', '600mm × 6 Layer', 'OEM-IM6006L', '600mm × 6 Layer', 20),
  ('bottle-pullout', '200mm', 'OEM-GLB-BM20', '200mm', 10),
  ('bottle-pullout', '250mm', 'OEM-GLB-BM25', '250mm', 20)
)
insert into public.product_variants (
  product_id, name, sku, dimension, raw_catalogue_data, sort_order
)
select p.id, v.name, v.sku, v.dimension,
       jsonb_build_object('variant_code', v.sku, 'dimensions', v.dimension),
       v.sort_order
from variants v join public.products p on p.slug = v.product_slug
where not exists (
  select 1 from public.product_variants existing
  where existing.product_id = p.id and existing.name = v.name
);

-- Client-confirmed product. No image or technical specification is attached
-- because the supplied catalogue assets do not contain an identifiable source.
insert into public.product_categories (
  name, slug, parent_id, description, catalogue_group, sort_order, is_active
)
select 'Artificial Grass', 'artificial-grass', root.id,
       'Artificial grass collections for decorative residential and commercial applications.',
       'Home Decor', 135, true
from public.product_categories root
where root.slug = 'home-decor'
on conflict (slug) do update set
  name = excluded.name,
  parent_id = excluded.parent_id,
  description = excluded.description,
  catalogue_group = excluded.catalogue_group,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.products (
  category_id, name, slug, short_description, description, status,
  is_featured, sort_order, catalogue_source_reference, raw_catalogue_data
)
select c.id, 'Artificial Grass', 'artificial-grass',
       'Decorative artificial grass for interior and exterior surface applications.',
       'Artificial grass provides a planted-look surface where a maintained natural lawn is not required. Contact WoodBay to confirm the available type, size, pile height and intended application before selection.',
       'published'::public.content_status, false, 10,
       'Client-confirmed for Batch 6; no matching Woodbay.pdf image entry',
       jsonb_build_object('product_name', 'Artificial Grass', 'source_status', 'client_confirmed', 'image_status', 'unavailable')
from public.product_categories c
where c.slug = 'artificial-grass'
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = coalesce(nullif(public.products.short_description, ''), excluded.short_description),
  description = coalesce(nullif(public.products.description, ''), excluded.description),
  status = 'published'::public.content_status,
  catalogue_source_reference = coalesce(public.products.catalogue_source_reference, excluded.catalogue_source_reference),
  raw_catalogue_data = public.products.raw_catalogue_data || excluded.raw_catalogue_data;

-- The manifest-backed set is stated explicitly so the migration never promotes
-- unrelated QA or legacy records.
with catalogue_slugs(slug) as (values
  ('3d-pvc-panels'),('3d-zero-profile-soft-close-hinge'),('aluminium-frame-beading'),('aluminium-frame-corner-clip'),('anti-slip-matt'),('artificial-vertical-gardens'),('bed-fitting-without-gas-spring'),('bin-auto-lid'),('blinds'),('c-gola'),('cabinet-hanging-bracket'),('ceiling-lights'),('charcoal-louvers'),('chrome-dish-rack'),('coffee-table-lift-up-mechanism'),('crystal-acrylic-paintings'),('decoration-shelf'),('decorative-lighting'),('double-liner-trouser-hanger'),('extendable-study-table-box-desk'),('soft-close-hinge'),('folding-shelf-bracket'),('full-ss-3d-304-hydraulic-hinge'),('bottle-pullout'),('glass-frame-profile-22mm'),('glass-frame-profile-45mm'),('glass-handle-22mm'),('glass-handle-65mm'),('glass-mosaic-tiles'),('glass-pantry-with-bidding'),('glass-pulldown-with-bidding'),('glass-rolling-shutters'),('i-handle'),('imported-pure-wooden-wicker-basket'),('j-gola'),('j-handle'),('leather-basket'),('lift-up-coffee-table'),('metallic-sheets-louvers'),('metallic-sheets'),('pan-hanger-rack'),('pocket-spring-mattresses'),('pu-feather-panels'),('pu-stone-panels'),('pullout-hanger-holder'),('pvc-leg-heavy'),('pvc-rolling-shutters'),('pvc-wicker-basket'),('rolling-wheel'),('s-corner-dark-grey'),('corner-basket'),('satin-pantry'),('wardrobe-shoe-rack'),('side-mounted-pullout-trouser-hanger'),('sliding-waste-bin'),('tandem-box-system'),('smart-wifi-side-table'),('sofa-leg'),('soft-close-gas-spring'),('ss-2d-hydraulic-hinge-heavy'),('ss-3d-short-arm-hinge'),('ss-short-arm-90-hydraulic-hinge'),('standard-bill-lift-up'),('tandem-attachment-pvc-grip'),('top-mounted-pullout-trouser-hanger'),('wardrobe-trouser-rack'),('unbreakable-cutlery'),('magic-corner'),('uv-marble-sheets'),('wallpaper'),('wardrobe-lift'),('water-fountains'),('waterfall-sink')
), copy(category_slug, short_template, description_template) as (values
  ('pantry-solutions','%s pantry storage system.','%s is a fitted pantry storage solution for organising provisions inside kitchen cabinetry. Confirm the available configuration and dimensions with WoodBay for the intended cabinet.'),
  ('pullout-solutions','%s pullout kitchen storage fitting.','%s is a pullout fitting for accessible organisation inside kitchen cabinetry. Select the appropriate model and cabinet fit from the documented options.'),
  ('corner-solutions','%s corner-cabinet storage solution.','%s uses otherwise difficult-to-reach corner cabinet space for organised kitchen storage. Choose the documented left/right option or cabinet size where a variant is listed.'),
  ('tandem-attachments','%s accessory for tandem drawer organisation.','%s is a tandem drawer accessory used to organise and protect kitchen storage. Available dimensions are shown only where they are documented in the catalogue.'),
  ('wicker-baskets','%s cabinet storage basket.','%s is a fitted basket for organised kitchen or wardrobe storage. Contact WoodBay to match the basket to the intended cabinet configuration.'),
  ('rolling-shutters','%s cabinet shutter system.','%s is a rolling shutter solution for closing and accessing cabinet storage. Confirm the suitable cabinet opening and configuration before ordering.'),
  ('pulldown-solutions','%s overhead cabinet access fitting.','%s is a pull-down storage fitting designed to bring overhead cabinet contents within easier reach. Cabinet compatibility should be confirmed before selection.'),
  ('dish-racks','%s fitted dish-storage rack.','%s provides organised storage for dishes within a kitchen cabinet. Confirm cabinet dimensions and the required arrangement with WoodBay.'),
  ('wardrobe-series','%s wardrobe organisation fitting.','%s is a fitted wardrobe accessory for organised clothing or personal storage. Select the model that suits the wardrobe layout and available internal space.'),
  ('smart-kitchen-waterfall-sinks','%s smart kitchen sink solution.','%s is a kitchen sink system with integrated functions documented for the selected model. Confirm the model, included fittings and installation requirements with WoodBay.'),
  ('lift-up-solutions','%s lift-up furniture mechanism.','%s is a lift-up mechanism for furniture panels or table surfaces. Suitability depends on the furniture design and installation arrangement.'),
  ('general-hardware-fittings','%s furniture hardware fitting.','%s is a functional furniture fitting for the application identified in the WoodBay catalogue. Confirm installation compatibility before selection.'),
  ('cabinet-hinges','%s cabinet hinge.','%s is a cabinet hinge for controlled door movement and alignment. Choose the documented model according to the door and cabinet construction.'),
  ('tandem-box','%s drawer-box system.','%s is a drawer-box system for fitted kitchen or furniture storage. Confirm the required size and cabinet compatibility with WoodBay.'),
  ('bins-waste-management','%s fitted waste-management solution.','%s is a cabinet-integrated waste-management fitting designed to keep bins contained and accessible. Confirm cabinet size and opening arrangement before selection.'),
  ('aluminium-profiles','%s for furniture and interior applications.','%s is an aluminium profile solution for furniture or interior detailing. The correct profile should be selected for the intended construction and finish.'),
  ('furniture-legs','%s furniture support fitting.','%s is a furniture leg or support fitting for cabinet and furniture construction. Confirm dimensions and load requirements for the intended installation.'),
  ('rolling-wheels','%s furniture movement fitting.','%s is a rolling wheel fitting for movable furniture applications. Confirm mounting and suitability for the intended furniture piece.'),
  ('shelf-brackets','%s shelf support fitting.','%s is a folding support bracket for shelf or work-surface applications. Confirm dimensions and mounting conditions before installation.'),
  ('cabinet-hanging-hardware','%s cabinet mounting fitting.','%s is a hanging and alignment fitting used when mounting cabinetry. Installation should be matched to the cabinet and supporting surface.'),
  ('aluminium-frame-accessories','%s aluminium-frame accessory.','%s is a component used when assembling or finishing aluminium-framed furniture elements. Match it to the corresponding frame profile and construction.'),
  ('gola-profiles','%s handleless cabinet profile.','%s is a GOLA profile used to create an integrated grip detail on handleless cabinetry. Select the profile according to the cabinet layout and finish.'),
  ('handles','%s furniture handle profile.','%s is a handle solution for cabinet or framed furniture doors. Confirm the profile size and fit for the intended panel construction.'),
  ('glass-frame-profiles','%s glass-frame profile.','%s is an aluminium profile for framed glass cabinet or furniture elements. Select the documented size to suit the glass-frame construction.'),
  ('smart-furniture','%s adaptable furniture solution.','%s combines furniture utility with the integrated or adaptable function shown in the WoodBay catalogue. Contact WoodBay to confirm the available model and configuration.'),
  ('wallpaper','%s decorative wall covering.','%s is a decorative wall-covering collection for residential and commercial interiors. Pattern, colour and installation requirements vary by selected design.'),
  ('pu-panels','%s decorative PU wall panel.','%s is a polyurethane decorative panel for creating dimensional interior wall treatments. Select the surface style and layout to suit the project.'),
  ('glass-mosaic-tiles','%s decorative mosaic surface.','%s is a glass mosaic tile collection for decorative interior surface applications. Confirm the selected design and installation substrate before use.'),
  ('3d-pvc-panels','%s dimensional wall panel.','%s is a PVC decorative wall panel with a three-dimensional surface for feature walls and interior treatments. Confirm the selected pattern and installation conditions.'),
  ('charcoal-louvers','%s decorative louver panel.','%s is a decorative louver product for linear wall and furniture treatments. Choose the profile and finish that suit the intended interior application.'),
  ('metallic-sheets-louvers','%s decorative surface collection.','%s is a coordinated collection of metallic sheets and louver treatments for interior feature surfaces. Confirm the selected format and finish before installation.'),
  ('metallic-sheets','%s decorative metallic sheet.','%s is a metallic decorative sheet for interior surface and furniture detailing. Select the finish and application method for the project.'),
  ('uv-marble-sheets','%s marble-look decorative sheet.','%s is a UV-finished decorative sheet with a marble-look surface for interior wall and furniture applications. Confirm the design and installation substrate before selection.'),
  ('crystal-acrylic-paintings','%s decorative wall artwork.','%s is a crystal acrylic print for framed or feature-wall display in interior spaces. Artwork selection and format depend on the available collection.'),
  ('mattresses','%s for bedroom furniture.','%s is a pocket-spring mattress for bedroom and bed-frame applications. Available sizes, thicknesses and comfort options must be confirmed with WoodBay because they are not specified in the supplied source.'),
  ('blinds','%s interior window covering.','%s is a window-blind collection for privacy, light control and interior finishing. Confirm the opening measurements, operation and selected material before ordering.'),
  ('artificial-vertical-gardens','%s decorative greenery panel.','%s is an artificial greenery treatment for creating planted-look vertical feature surfaces. Confirm panel coverage and intended placement before installation.'),
  ('water-fountains','%s decorative water feature.','%s is a decorative water-fountain collection for interior or sheltered feature settings. Confirm the selected model and installation requirements with WoodBay.'),
  ('ceiling-lights','%s interior lighting collection.','%s is a ceiling-mounted decorative lighting collection for interior spaces. Confirm the fixture, electrical requirements and intended room application before selection.'),
  ('decorative-lighting','%s feature-lighting collection.','%s is a decorative lighting collection for ambient and feature applications in interior spaces. Confirm fixture specifications and installation requirements for the selected design.')
)
update public.products p
set short_description = coalesce(nullif(p.short_description, ''), format(copy.short_template, p.name)),
    description = coalesce(nullif(p.description, ''), format(copy.description_template, p.name)),
    status = 'published'::public.content_status,
    seo_title = coalesce(nullif(p.seo_title, ''), p.name || ' | WoodBay'),
    seo_description = coalesce(nullif(p.seo_description, ''), format(copy.short_template, p.name))
from public.product_categories c, catalogue_slugs source, copy
where p.slug = source.slug
  and c.id = p.category_id
  and copy.category_slug = c.slug;

-- Improve the two published legacy records that are not represented by a
-- trustworthy catalogue image without inventing visual or technical facts.
update public.products set
  description = coalesce(nullif(description, ''), 'Tall Pantry is a fitted vertical storage solution for organising provisions inside kitchen cabinetry. Confirm the available configuration and dimensions with WoodBay for the intended cabinet.'),
  seo_title = coalesce(nullif(seo_title, ''), 'Tall Pantry | WoodBay')
where slug = 'tall-pantry';

update public.products set
  description = coalesce(nullif(description, ''), 'Aluminium Profile is a furniture and interior detailing solution. Select the exact profile, size and finish for the intended cabinet or framed construction.'),
  seo_title = coalesce(nullif(seo_title, ''), 'Aluminium Profile | WoodBay')
where slug = 'aluminium-profile';

-- Keep image labels aligned with cleaned public names.
update public.product_images i
set alt_text = p.name
from public.products p
where p.id = i.product_id and (i.alt_text is null or i.alt_text <> p.name);

do $$
begin
  if (select count(*) from public.product_categories where parent_id is null and is_active) <> 4 then
    raise exception 'Batch 6 must retain exactly four active root divisions';
  end if;
  if exists (
    select 1 from public.products p
    left join public.product_categories c on c.id = p.category_id
    where p.status = 'published' and (c.id is null or not c.is_active)
  ) then
    raise exception 'Batch 6 left a published product in an inactive or missing category';
  end if;
  if exists (
    select slug from public.products group by slug having count(*) > 1
  ) then
    raise exception 'Batch 6 created duplicate product slugs';
  end if;
  if exists (
    select product_id, name, coalesce(sku, '') from public.product_variants
    where is_active group by product_id, name, coalesce(sku, '') having count(*) > 1
  ) then
    raise exception 'Batch 6 found duplicate active variants';
  end if;
end;
$$;
