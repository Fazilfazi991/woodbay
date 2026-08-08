# Database

The Batch 0 migration creates CMS tables for categories, products, variants, images, colours, projects, dealers, downloads, posts, SEO pages, settings, and administrative users. It also creates three deliberately distinct enquiry workflows: `dealer_applications` (accessories), `furniture_outlet_enquiries`, and `factory_visit_requests`, plus `contact_enquiries`.

Voucher integrity is enforced by `voucher_codes.code unique` and `voucher_redemptions.voucher_id unique`. The latter makes a second valid redemption impossible at the database level. `voucher_codes`, `voucher_redemptions`, and `voucher_verification_logs` have no anon/authenticated public-read policy; future verification must use a narrowly scoped server-side action or RPC.

RLS is enabled for every public table. Anonymous users can read only active/published public content. Active admins are authorized through a hardened, non-public `private.is_active_admin()` function; this avoids granting normal signed-in users CMS access. All public writes are withheld in Batch 0 and should be introduced through validated server endpoints in later batches.
