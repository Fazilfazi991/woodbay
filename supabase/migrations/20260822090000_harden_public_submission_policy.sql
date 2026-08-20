-- Public applicants must not be able to attach their submission to an
-- existing internal dealer record. That association is created only by the
-- service-role review workflow.
drop policy if exists "public submits dealer applications" on public.dealer_applications;
create policy "public submits dealer applications"
on public.dealer_applications for insert to anon, authenticated
with check (
  status = 'new'
  and admin_notes is null
  and dealer_id is null
);
