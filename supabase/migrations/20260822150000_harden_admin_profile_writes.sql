-- Prevent active admins from changing the authorization source of truth directly.
-- Profile provisioning and role/lifecycle changes remain server/service-role only.
drop policy if exists "active admins manage admin_profiles" on public.admin_profiles;
revoke insert, update, delete, truncate, references, trigger
  on public.admin_profiles from anon, authenticated;
grant select on public.admin_profiles to authenticated;
