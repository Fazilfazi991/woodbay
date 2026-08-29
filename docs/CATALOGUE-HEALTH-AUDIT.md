# WoodBay catalogue health audit

Audit date: 2026-08-29

Sources checked: live Supabase tables (`products`, `product_categories`, `product_images`), `product-images-manifest.json`, explicit local fallback mappings, and files under `public/images/products`.

## Summary

| Measure | Count |
| --- | ---: |
| Total database products | 17 |
| Published products | 16 |
| Unpublished / archived products | 1 |
| Published products with a verified real image | 14 |
| Published products with no trustworthy image | 2 |
| Broken database image references | 0 |
| Database product image rows | 0 |
| Generic placeholder images after this pass | 0 |
| Suspicious duplicate manifest images by file hash | 0 |
| Empty leaf categories still shown in public division navigation | 0 |
| Source-manifest products without an exact database record | 61 |

All 16 published products currently rely on explicit local fallback logic because `product_images` contains no rows. Fourteen fallbacks point to existing, loadable assets. The remaining two now render an honest **Image coming soon** state.

## Image status

### Missing image

- Tall Pantry (`tall-pantry`) — no database image and no unambiguous local asset mapping.
- Aluminium Profile (`aluminium-profile`) — several profile assets exist, but none can be safely selected as the generic record's image.

### Valid local fallback

- Magic Corner (`magic-corner`)
- Soft Close Hinge (`soft-close-hinge`)
- Tandem Box (`tandem-box-system`)
- Wardrobe Shoe Rack (`wardrobe-shoe-rack`)
- Wardrobe Lift (`wardrobe-lift`)
- Wallpaper (`wallpaper`)
- Charcoal Louvers (`charcoal-louvers`)
- Glass Mosaic Tiles (`glass-mosaic-tiles`)
- Bottle Pullout (`bottle-pullout`)
- Corner Basket (`corner-basket`)
- Wardrobe Trouser Rack (`wardrobe-trouser-rack`)
- Smart Furniture (`smart-furniture`)
- Waterfall Sink (`waterfall-sink`)
- Glass Pantry (`glass-pantry`)

### Broken / placeholder / suspicious duplicate

- Broken database references: none; there are no `product_images` rows to validate.
- Generic WoodBay placeholders: removed from product cards and product detail galleries.
- Suspicious duplicate image files: none among the 73 manifest entries by SHA-256 hash.

## Published-product matrix

| Division | Category / subcategory | Published |
| --- | --- | ---: |
| Kitchen & Wardrobe Accessories | Pantry Solutions | 2 |
| Kitchen & Wardrobe Accessories | Pullout Solutions | 1 |
| Kitchen & Wardrobe Accessories | Corner Solutions | 2 |
| Kitchen & Wardrobe Accessories | Wicker Baskets | 0 |
| Kitchen & Wardrobe Accessories | Rolling Shutters | 0 |
| Kitchen & Wardrobe Accessories | Dish Racks | 0 |
| Kitchen & Wardrobe Accessories | Trouser Racks | 1 |
| Kitchen & Wardrobe Accessories | Shoe Racks | 1 |
| Kitchen & Wardrobe Accessories | Wardrobe Lifters | 1 |
| Kitchen & Wardrobe Accessories | Wardrobe Baskets | 0 |
| Kitchen & Wardrobe Accessories | Hangers | 0 |
| Kitchen & Wardrobe Accessories | Smart Kitchen / Waterfall Sinks | 1 |
| Hardware Fittings & Aluminium Profiles | Lift Up Solutions | 0 |
| Hardware Fittings & Aluminium Profiles | Cabinet Hinges | 1 |
| Hardware Fittings & Aluminium Profiles | Tandem Box | 1 |
| Hardware Fittings & Aluminium Profiles | Bins | 0 |
| Hardware Fittings & Aluminium Profiles | Aluminium Profiles | 1 |
| Hardware Fittings & Aluminium Profiles | Hardware Fittings | 0 |
| Smart Furniture | Smart Furniture | 1 |
| Home Decor | Decor Products | 3 |

Empty leaf categories remain in the approved database hierarchy but are filtered out of public division navigation until they contain a published product. No category was deleted. `shoe-racks` was added to the Kitchen & Wardrobe division mapping, restoring Wardrobe Shoe Rack to public reachability.

## Records not publicly reachable

- Before this pass: Wardrobe Shoe Rack (`wardrobe-shoe-rack`) was published but excluded by the division allow-list.
- After this pass: no published database product is excluded from its intended public division.
- Woodbay QA Catalogue 2026 (`woodbay-qa-catalogue-2026`) is archived and correctly remains private.

## Source catalogue content not yet represented in the database

The image manifest contains 61 exact product slugs with verified assets but no matching database product record. These assets are not enough to safely invent product records, specifications, status, or relationships, so no rows were created.

3D PVC Panels; 3D Zero Profile Soft Close Hinge; Aluminium Frame Beading Type; Aluminium Frame Corner Clip; Anti Slip Matt; Artificial / Vertical Gardens; Bed Fitting Without Gas Spring; Bin Auto Lid; Blinds; C GOLA; Cabinet Hanging Bracket; Ceiling Lights; Chrome Dish Rack; Coffee Table Lift Up Mechanism; Crystal Acrylic Paintings; Decoration Shelf; Decorative Lighting; Top Mounted Double Liner Trouser Hanger; Extendable Study Table / Box Desk; Folding Shelf Bracket; Full SS 3D 304 Hydraulic Hinge; Glass Frame Profile 22Mm; Glass Frame Profile 45Mm; Glass Handle 22Mm; Glass Handle 65Mm; Glass Pantry With Bidding; Glass Pulldown With Bidding; Glass Rolling Shutters; I Handle; Imported Pure Wooden Wicker Basket; J GOLA; J Handle; Leather Basket; Lift Up Coffee Table; Metallic Sheets & Louvers; Metallic Sheets; Pan Hanger Rack; Pocket Spring Mattresses; PU Feather Panels; PU Stone Panels; Top Mounted Pullout Coat Hanger Holder 8 Beads; PVC Leg Heavy; PVC Rolling Shutters; PVC Wicker Basket; Rolling Wheel; S Corner Dark-Grey; Satin Pantry; Side Mounted Pullout Trouser Hanger; Sliding Waste Bin; Smart WiFi Side Table; Sofa Leg; Soft Close Gas Spring; SS 2D Hydraulic Hinge Heavy; SS 3D Short Arm Hinge; SS Short Arm 90 Hydraulic Hinge; Standard Bill Lift Up; Tandem Attachment PVC Grip; Top Mounted Pullout Trouser Hanger; Un Breakable Cutlery; UV Marble Sheets; Water Fountains.

## Data changes

No database records, statuses, relationships, or storage objects were changed. The only relationship correction is the application taxonomy allow-list for `shoe-racks`. Database population from the 61 source entries requires an approved import/migration containing product copy and specifications.
