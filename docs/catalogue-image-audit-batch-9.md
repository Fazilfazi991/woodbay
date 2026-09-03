# WoodBay catalogue image audit — Batch 9

Audit date: 2026-09-02

Scope: all 76 published products in the linked production catalogue, all 73 verified catalogue assets, the Batch 9 Artificial Grass asset, and the two intentionally image-less records. The review combined the verified manifest, live product/image relationships, file metadata and hashes, and a three-sheet visual contact review.

## Decision gate

| Product | Source audit | Decision | Final status |
| --- | --- | --- | --- |
| Tall Pantry | No matching manifest entry, media file, migration reference, product code, or admin image row. Adjacent `Glass Pantry With Bidding` and `Satin Pantry` are distinct named products and cannot identify this record. | C — identity too ambiguous | Keep `Image coming soon`. Client must confirm the mechanism or provide a product photograph. |
| Aluminium Profile | No image is associated with the generic record. Existing assets identify specific GOLA, glass-frame, handle, beading, and corner-clip profiles; choosing one would misrepresent the record. | C — identity too ambiguous | Keep `Image coming soon`. Client must identify the exact profile family or provide a product photograph. |
| Artificial Grass | Client-confirmed product with no supplied source image. General identity is sufficiently clear for a non-specification representative image. | B — generation safe | One generated representative primary image added. |

## Classification totals

| Classification | Products |
| --- | ---: |
| PASS | 74 |
| LOW QUALITY | 0 |
| BAD CROP | 0 |
| EXCESSIVE EMPTY SPACE | 0 |
| WRONG PRODUCT | 0 |
| DUPLICATE IMAGE | 0 |
| COLLAGE | 0 |
| TEXT-HEAVY | 0 |
| WATERMARK | 0 |
| MISSING | 2 |

The two MISSING records are Tall Pantry and Aluminium Profile. Duplicate checking found no identical image bytes across the 74 audited files. All 73 existing manifest files are 1200×1200 WebP assets with explicit `passed` QA status, and the contact review confirmed recognizable subjects, sensible square crops, no visible watermarks or text boards, and no unrelated image reuse.

## Per-product classification

PASS: 3D PVC Panels; 3D Zero Profile Soft Close Hinge; Aluminium Frame Beading Type; Aluminium Frame Corner Clip; Anti Slip Matt; Artificial / Vertical Gardens; Artificial Grass; Bed Fitting Without Gas Spring; Bin Auto Lid; Blinds; C GOLA; Cabinet Hanging Bracket; Ceiling Lights; Charcoal Louvers; Chrome Dish Rack; Coffee Table Lift Up Mechanism; Crystal Acrylic Prints; Decoration Shelf; Decorative Lighting; Top Mounted Double Liner Trouser Hanger; Extendable Study Table / Box Desk; Five Hole SS 3D Hydraulic Hinge Premium; Folding Shelf Bracket; Full SS 3D 304 Hydraulic Hinge; Glass BPO With Bidding; Glass Frame Profile 22Mm; Glass Frame Profile 45Mm; Glass Handle 22Mm; Glass Handle 65Mm; Glass Mosaic Tiles; Glass Pantry With Bidding; Glass Pulldown With Bidding; Glass Rolling Shutters; I Handle; Imported Pure Wooden Wicker Basket; J GOLA; J Handle; Leather Basket; Lift Up Coffee Table; Metallic Sheets & Louvers; Metallic Sheets; Pan Hanger Rack; Pocket Spring Mattress; PU Feather Panels; PU Stone Panels; Top Mounted Pullout Coat Hanger Holder 8 Beads; PVC Leg Heavy; PVC Rolling Shutters; PVC Wicker Basket; Rolling Wheel; S Corner Dark-Grey; S Corner White; Satin Pantry; Shoe Rack; Side Mounted Pullout Trouser Hanger; Sliding Waste Bin; Slim Box Dark Grey; Smart WiFi Side Table; Sofa Leg; Soft Close Gas Spring; SS 2D Hydraulic Hinge Heavy; SS 3D Short Arm Hinge; SS Short Arm 90 Hydraulic Hinge; Standard Bill Lift Up; Tandem Attachment PVC Grip; Top Mounted Pullout Trouser Hanger; Trouser Rack; Un Breakable Cutlery; Universal Magic Corner - Glass; UV Marble Sheets; Wallpaper; Wardrobe Lifter; Water Fountains; Waterfall Sink.

MISSING: Tall Pantry; Aluminium Profile.

## Changed image evidence

| Product | Previous status | Provenance | File | Dimensions | Format | Bytes | Public route |
| --- | --- | --- | --- | ---: | --- | ---: | --- |
| Artificial Grass | Missing | AI-generated representative catalogue photograph from client-confirmed product identity; no manufacturer or technical-specification claim | `public/images/products/artificial-grass.webp` | 1200×1200 | WebP | 308,566 | `/images/products/artificial-grass.webp` |

Generation used the built-in image-generation workflow. The final prompt requested one unbranded artificial-grass roll and sample on a warm-neutral studio background, product-led square framing, realistic material, and explicitly prohibited text, logos, watermarks, packaging, landscaping, people, sports markings, and technical claims.

## Final generated-asset resolution (2026-09-03)

The client authorized representative generated imagery after the source audit confirmed no genuine asset existed. Tall Pantry now uses a photorealistic, generic full-height pull-out pantry mechanism in cabinetry. Aluminium Profile now uses a technically neutral arrangement of furniture/interior aluminium extrusions and deliberately makes no GOLA, handle, glass-frame, or proprietary-family claim. Both are 1200×1200 WebP assets; their generated provenance is recorded in the product metadata and image migration.

Resolved paths:

- Tall Pantry — `/images/products/tall-pantry.webp`
- Aluminium Profile — `/images/products/aluminium-profile.webp`

## Original client input request

- Tall Pantry — provide one clear front-view catalogue/product photograph, or confirm whether this record means a tall pantry pull-out basket system and identify its configuration.
- Aluminium Profile — provide one clear profile photograph/cross-section, or confirm whether it is a cabinet, glass-frame, GOLA, handle, wardrobe, or other extrusion profile.
