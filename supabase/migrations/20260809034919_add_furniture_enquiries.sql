create table public.furniture_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  location text not null,
  district text,
  furniture_type text not null,
  requirement_type text,
  front_colour_id uuid references public.colours(id) on delete set null,
  body_colour_id uuid references public.colours(id) on delete set null,
  front_colour_name text,
  body_colour_name text,
  finish_preference text,
  width numeric(8,2) check (width > 0 and width <= 100000),
  height numeric(8,2) check (height > 0 and height <= 100000),
  depth numeric(8,2) check (depth > 0 and depth <= 100000),
  dimensions_note text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','consultation_scheduled','quoted','won','lost','closed')),
  admin_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create trigger furniture_enquiries_updated_at before update on public.furniture_enquiries for each row execute function public.set_updated_at();
alter table public.furniture_enquiries enable row level security;
create policy "active admins manage furniture enquiries" on public.furniture_enquiries for all to authenticated using ((select private.is_active_admin())) with check ((select private.is_active_admin()));
create policy "public submits furniture enquiries" on public.furniture_enquiries for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
create policy "public submits factory visit requests" on public.factory_visit_requests for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
create policy "public submits furniture outlet enquiries" on public.furniture_outlet_enquiries for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
grant insert on public.furniture_enquiries, public.factory_visit_requests, public.furniture_outlet_enquiries to anon, authenticated;
