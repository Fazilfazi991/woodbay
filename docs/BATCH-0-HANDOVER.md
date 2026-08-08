# Batch 0 handover

Implemented: strict TypeScript Next.js foundation, Tailwind token layer, reusable accessible form primitives, Supabase browser/server/admin client boundaries, protected admin login/placeholder, Zod validation, storage abstraction, metadata/robots/sitemap placeholders, tests, migration, seed categories, and project documentation.

Not implemented by design: final public pages, catalogue/furniture/dealer/voucher UIs, full CMS, media upload screens, blog/gallery UI, SEO landing pages, and live voucher verification/redemption endpoints.

Migration: `20260808000100_batch_0_foundation.sql`. Apply it and the development-only seed as described in `SETUP.md`. No Supabase project was linked in this workspace, so no remote migration was applied.

Next recommended batch: build secure server-side enquiry and voucher verification endpoints, then implement the agreed public information architecture without expanding admin scope prematurely.
