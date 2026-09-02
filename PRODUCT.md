# WoodBay

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

WoodBay serves homeowners, interior customers, dealers, and prospective dealers in and around Kollam, Kerala. The administrative interface has one daily operational user, identified in the product simply as **Admin**.

## Product Purpose

WoodBay presents a verified catalogue of kitchen and wardrobe accessories, hardware fittings, smart furniture, and home decor. It supports product enquiries, furniture and showroom requests, dealer applications and records, and one-time voucher registration and administration. Success means customers can discover the right products and the WoodBay administrator can maintain the catalogue and process operational work accurately.

## Positioning

WoodBay brings catalogue discovery, local dealer context, operational enquiries, and product-linked voucher registration into one system for its Kollam-based decor and interiors business.

## Operating Context

The public website supports catalogue browsing, enquiries, dealer discovery, dealer applications, and voucher registration. The protected admin area is used regularly to manage products, project entries, furniture enquiries, factory-visit and outlet requests, dealer applications and dealer records, voucher inventory, voucher registrations, QR output, exports, and historical verification requests.

## Capabilities and Constraints

- Preserve the existing Next.js and Supabase architecture, authentication, authorization, RLS, and established database workflows.
- Preserve current product, dealer, enquiry, project, voucher, QR, export, audit-history, and redemption semantics.
- Administrative metrics and status indicators must use real stored data and existing state definitions; never fabricate growth or unread behavior.
- Historical or legacy workflows may be removed from primary navigation when redundant, but their routes and data must not be destroyed without explicit approval.
- Administrative UI must remain lightweight and usable on desktop, tablet, and mobile without squeezing wide tables into phone layouts.

## Brand Commitments

- Product name: WoodBay Decor & Interiors.
- Public identity: near-black, warm ivory, restrained WoodBay gold, subtle borders, and clear typography.
- The admin product should belong to the same identity while remaining an efficient operations interface rather than a marketing surface.
- Administrative account identity is displayed as “Admin.”

## Evidence on Hand

- Existing production application and operational Supabase-backed workflows in this repository.
- Existing WoodBay logo, catalogue imagery, product taxonomy, dealer records, voucher audit records, and production route structure.
- No fabricated commercial metrics, testimonials, growth data, or customer claims may be introduced.

## Product Principles

- Preserve working business behavior while improving clarity and speed.
- Make pending operational work immediately understandable.
- Prefer real counts, concise summaries, and scannable records over decorative dashboards.
- Keep customer, dealer, voucher, and administrative data protected.
- Use one consistent interaction and status language across every admin workflow.

## Accessibility & Inclusion

The web interface must support keyboard navigation, visible focus, explicit labels, sufficient contrast, semantic table and dialog structure, and responsive operation at common desktop, tablet, and phone widths.
