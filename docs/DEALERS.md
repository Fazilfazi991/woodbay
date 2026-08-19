# Accessories dealer applications

`/dealers/become-a-dealer` is for businesses that wish to represent Woodbay accessories and product collections. It writes only to `dealer_applications`, with the default `new` status; it neither approves an applicant nor creates a `dealers` record. Apply `20260819000000_add_dealer_application_submission_policy.sql` before enabling live applications.

Furniture Outlet enquiries remain a separate business workflow at `/furniture/outlets` and write only to `furniture_outlet_enquiries`.

## Dealer Locator (Batch 8)

`/dealers` is the public locator for approved Accessories Dealers only. It reads from the narrow `public_dealers` view, not from `dealer_applications` or the full `dealers` table. The view contains only active, visible dealers and only locator-safe fields; payment QR data and internal application data are excluded. Apply `20260819010000_add_public_dealer_locator_view.sql` before release.

Locator filters are URL driven: `state`, `district`, `area`, and optional `q`. State, district, and area options are derived from visible dealer data, and changing State or District clears incompatible dependent filters.

`supabase/seed-dealers.sql` provides idempotent, clearly labelled QA-only dealers for local/staging filter testing, including an inactive hidden record that must never appear in the locator. Never apply those records to production as genuine dealer information.

## Dealer Mini Pages (Batch 9)

`/dealers/[dealerSlug]` reads from the separate `public_dealer_details` view, created by `20260819020000_add_public_dealer_detail_view.sql`. This preserves the locator's narrow field exposure while deliberately allowing active/visible dealer pages to render admin-configured shop imagery, location data and payment QR images. Applications, admin notes, private email and internal history remain unavailable.

The page conditionally renders Call, Directions, an iframe map only for valid coordinates, shop image, and the payment QR. QR is a display-only dealer payment instruction: it does not create, verify or process transactions. QR/shop assets should be managed as server-side storage keys or approved public URLs; missing assets hide the relevant section or use the Woodbay visual fallback.

Clearly labelled QA dealers use `noindex, nofollow` and suppress LocalBusiness JSON-LD. Real dealers receive canonical metadata and structured data only from populated dealer fields. Future Woodbay admin work must manage dealer phone, address, map URL/coordinates, shop image, QR, status and visibility; dealer accounts and payment processing remain out of scope.

The public form validates business, contact and location fields on the server, uses a honeypot plus minimum-submit-time check, and is covered by an insert-only public RLS policy. Public users cannot read, update, delete or access `admin_notes` on applications.

A future admin workflow should list, search and filter applications, add internal notes, update the lifecycle (`new`, `contacted`, `approved`, `rejected`), and only then create an approved dealer record. Dealer Locator and Dealer Mini Pages remain later work. No dedicated dealer/showroom image is used until approved material is supplied.
