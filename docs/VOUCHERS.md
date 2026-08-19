# Voucher verification and redemption

`/redeem` is the customer-facing Woodbay voucher page. A physical QR label should contain `https://<production-domain>/redeem?code=<voucher-code>`. The query value is only a code prefill; it never verifies or redeems a voucher, and it must never contain customer information. Codes are normalized as trimmed uppercase alphanumeric/hyphen strings (4–32 characters). QR code URLs can appear in browser history, so a voucher code must not be treated as a high-secrecy credential.

## Secure lifecycle

The lifecycle is `available → redeemed`; an administrator may separately set a code to `disabled`. The public browser sends its form to a Next.js server action. That action validates Zod input, requires the honeypot to be empty, enforces a minimum 800 ms completion time, derives a hashed request-address rate-limit key, and calls `public.redeem_voucher` with the server-only `SUPABASE_SERVICE_ROLE_KEY`.

The Batch 10 migration adds the `redeem_voucher` security-definer function and permits execution only for `service_role`, never `anon` or `authenticated`. It locks the voucher row, checks its state, inserts exactly one redemption, marks the voucher redeemed with `redeemed_at`, writes an audit log, and returns only a safe result state plus the name/slug of a linked _published_ product. The existing `voucher_redemptions.voucher_id unique` remains the final database-level double-redemption safeguard. It does not expose voucher IDs, master-table rows, logs, or previous customer data.

`voucher_codes`, `voucher_redemptions`, `voucher_verification_logs`, and the rate-limit table remain RLS-protected with no public read/write grants. The rate-limit table stores only a SHA-256 key derived server-side from the forwarded request address, not raw customer identity. It permits 12 attempts per key per rolling hour; the thirteenth response is a generic throttle. This is database-backed and therefore consistent across server instances.

## Data and QA

Successful redemptions store only the required customer name, phone, location, district, dealer name, and optional distributor name in `voucher_redemptions`. Verification logs capture the normalized code, optional voucher reference, outcome, and timestamp without customer PII.

`supabase/seed-vouchers.sql` supplies clearly labelled non-production QA data: `WBQA0001` available, `WBQA0002` available and linked to the first published product when one exists, `WBQA0003` already redeemed with fake QA customer details, and `WBQA0004` disabled. Remove or disable QA codes before production. Production voucher generation, bulk import, product/batch assignment, review/export, reversals, and QR-image generation remain future admin workflows.

Dealer mini-page payment QR images are unrelated: they are payment assets on `/dealers/[dealerSlug]`. Voucher QR labels only deep-link to `/redeem?code=...`.
