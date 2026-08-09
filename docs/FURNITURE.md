# Furniture division

Furniture is a custom consultation workflow, not an accessory SKU catalogue. `/furniture/design` writes to `furniture_enquiries`; `/furniture/factory-visit` writes to `factory_visit_requests`; and `/furniture/outlets` writes to `furniture_outlet_enquiries`. These are separate from Accessories Dealer applications.

The finish selector is a lightweight two-colour wardrobe preview, intentionally not AR, 3D, or a manufacturing configurator. Its sample finishes are centralized in `src/config/furniture.ts` and must be replaced by approved material data.

Public users have tightly scoped insert-only policies and cannot read, update, delete, or access admin notes. A future admin area should manage the three enquiry types independently.

Before publishing the enquiry flows, apply `supabase/migrations/20260809034919_add_furniture_enquiries.sql` to the linked Supabase project. The migration creates the custom-furniture table, enables RLS, and adds the insert-only policies required by all three furniture forms. Existing Factory Visit and Furniture Outlet tables are left intact.
