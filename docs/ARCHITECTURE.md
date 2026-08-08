# Woodbay architecture

The Next.js App Router app uses Server Components by default. `src/app` contains only routes and route-local actions; reusable UI is in `src/components`; business domains belong in `src/features` as they are implemented in later batches; shared infrastructure is in `src/lib`.

Public pages and `/admin` are intentionally separate. Admin access requires Supabase Auth *and* an active `admin_profiles` row. The service-role client is server-only and reserved for privileged workflows.

`lib/storage` exposes a provider interface so product and CMS features depend on `upload`, `delete`, and `getUrl`, not Supabase Storage. The initial provider is Supabase; an R2 provider can be added behind `getStorageProvider()` without changing feature code.
