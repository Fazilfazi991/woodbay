# Accessories dealer applications

`/dealers/become-a-dealer` is for businesses that wish to represent Woodbay accessories and product collections. It writes only to `dealer_applications`, with the default `new` status; it neither approves an applicant nor creates a `dealers` record. Apply `20260819000000_add_dealer_application_submission_policy.sql` before enabling live applications.

Furniture Outlet enquiries remain a separate business workflow at `/furniture/outlets` and write only to `furniture_outlet_enquiries`.

## Dealer Locator (Batch 8)

`/dealers` is the public locator for approved Accessories Dealers only. It reads from the narrow `public_dealers` view, not from `dealer_applications` or the full `dealers` table. The view contains only active, visible dealers and only locator-safe fields; payment QR data and internal application data are excluded. Apply `20260819010000_add_public_dealer_locator_view.sql` before release.

Locator filters are URL driven: `state`, `district`, `area`, and optional `q`. State, district, and area options are derived from visible dealer data, and changing State or District clears incompatible dependent filters. Future detail routing is prepared at `/dealers/[dealerSlug]`; the complete Dealer Mini Page remains Batch 9 work.

`supabase/seed-dealers.sql` provides idempotent, clearly labelled QA-only dealers for local/staging filter testing, including an inactive hidden record that must never appear in the locator. Never apply those records to production as genuine dealer information.

The public form validates business, contact and location fields on the server, uses a honeypot plus minimum-submit-time check, and is covered by an insert-only public RLS policy. Public users cannot read, update, delete or access `admin_notes` on applications.

A future admin workflow should list, search and filter applications, add internal notes, update the lifecycle (`new`, `contacted`, `approved`, `rejected`), and only then create an approved dealer record. Dealer Locator and Dealer Mini Pages remain later work. No dedicated dealer/showroom image is used until approved material is supplied.
