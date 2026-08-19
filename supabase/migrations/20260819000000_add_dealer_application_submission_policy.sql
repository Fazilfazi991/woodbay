create policy "public submits dealer applications" on public.dealer_applications for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
grant insert on public.dealer_applications to anon, authenticated;
