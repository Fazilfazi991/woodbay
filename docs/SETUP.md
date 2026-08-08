# Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and provide the required public Supabase values.
3. Create or link a Supabase project, then apply `supabase/migrations/20260808000100_batch_0_foundation.sql` with the Supabase CLI or SQL editor. Apply `supabase/seed.sql` only to development/staging. `supabase/seed-products.sql` is an optional repeatable development/staging catalogue seed and is not applied automatically.
4. Create an Auth user, then insert its `auth.users.id` into `public.admin_profiles` with `is_active = true`.
5. Run `npm run dev`.

Validation commands: `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.

Required public runtime values: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is optional and server-only until a privileged workflow is added. Storage defaults to Supabase; set `STORAGE_PROVIDER` and `SUPABASE_STORAGE_BUCKET` as needed. R2 variables are reserved for the future provider.
