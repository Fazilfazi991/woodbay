-- Additive customer review queue. Existing voucher master, redemption RPC,
-- verification logs, statuses and historical rows are intentionally unchanged.
create table public.voucher_verification_requests (
  id uuid primary key default gen_random_uuid(),
  product_name text not null check (char_length(product_name) between 2 and 160),
  product_code text,
  dealer_name text not null check (char_length(dealer_name) between 2 and 160),
  customer_name text not null check (char_length(customer_name) between 2 and 160),
  contact_number text not null check (char_length(contact_number) between 7 and 32),
  address text not null check (char_length(address) between 5 and 500),
  voucher_or_invoice_number text not null check (char_length(voucher_or_invoice_number) between 3 and 120),
  purchase_date date,
  additional_information text check (char_length(additional_information) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  admin_notes text check (char_length(admin_notes) <= 2000),
  reviewed_by uuid references public.admin_profiles(user_id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check ((status = 'pending' and reviewed_at is null) or (status <> 'pending' and reviewed_at is not null))
);

create index voucher_verification_requests_status_created_idx
  on public.voucher_verification_requests(status, created_at desc);
create trigger voucher_verification_requests_updated_at
  before update on public.voucher_verification_requests
  for each row execute function public.set_updated_at();

alter table public.voucher_verification_requests enable row level security;
create policy "active admins manage voucher verification requests"
  on public.voucher_verification_requests for all to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));
revoke all on public.voucher_verification_requests from public, anon, authenticated;
grant all on public.voucher_verification_requests to service_role;
