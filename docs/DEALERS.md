# Accessories dealer applications

`/dealers/become-a-dealer` is for businesses that wish to represent Woodbay accessories and product collections. It writes only to `dealer_applications`, with the default `new` status; it neither approves an applicant nor creates a `dealers` record. Apply `20260819000000_add_dealer_application_submission_policy.sql` before enabling live applications.

Furniture Outlet enquiries remain a separate business workflow at `/furniture/outlets` and write only to `furniture_outlet_enquiries`.

The public form validates business, contact and location fields on the server, uses a honeypot plus minimum-submit-time check, and is covered by an insert-only public RLS policy. Public users cannot read, update, delete or access `admin_notes` on applications.

A future admin workflow should list, search and filter applications, add internal notes, update the lifecycle (`new`, `contacted`, `approved`, `rejected`), and only then create an approved dealer record. Dealer Locator and Dealer Mini Pages remain later work. No dedicated dealer/showroom image is used until approved material is supplied.
