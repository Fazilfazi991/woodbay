# Batch 0 handover

Implemented: strict TypeScript Next.js foundation, Tailwind token layer, reusable accessible form primitives, Supabase browser/server/admin client boundaries, protected admin login/placeholder, Zod validation, storage abstraction, metadata/robots/sitemap placeholders, tests, migration, seed categories, and project documentation.

Not implemented by design: final public pages, catalogue/furniture/dealer/voucher UIs, full CMS, media upload screens, blog/gallery UI, SEO landing pages, and live voucher verification/redemption endpoints.

Migration: `20260808000100_batch_0_foundation.sql` and the development seed have been applied successfully to the connected Supabase project. Local `.env.local` is configured but intentionally gitignored. No service-role key is configured because Batch 0 has no privileged server-side workflow requiring it.

The remaining admin-auth setup step is to create an Auth user and matching active `admin_profiles` row. Next recommended batch: build the approved global shell and design system; keep voucher verification as a future secure server-side endpoint.
