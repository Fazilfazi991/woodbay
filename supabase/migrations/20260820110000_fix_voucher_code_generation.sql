-- Batch 11: pgcrypto is installed in the extensions schema on the production project.
-- Keep the existing secure generator and security-definer contract intact; qualify it.
create or replace function public.generate_voucher_batch(
  p_actor_id uuid, p_reference text, p_quantity integer, p_value_benefit text,
  p_expires_at date, p_admin_note text, p_idempotency_key uuid
) returns table(batch_id uuid, created_count integer, batch_reference text)
language plpgsql security definer set search_path = public, pg_catalog as $$
declare v_batch public.voucher_batches%rowtype; v_code text; v_index integer;
begin
  if p_quantity not between 1 and 500 or btrim(p_reference) !~ '^.{2,120}$' then raise exception 'invalid voucher batch request'; end if;
  select * into v_batch from public.voucher_batches where idempotency_key = p_idempotency_key for update;
  if found then return query select v_batch.id, v_batch.quantity_generated, v_batch.reference; return; end if;
  insert into public.voucher_batches(reference, quantity_requested, value_benefit, expires_at, admin_note, created_by, idempotency_key)
  values (btrim(p_reference), p_quantity, nullif(btrim(p_value_benefit), ''), p_expires_at, nullif(btrim(p_admin_note), ''), p_actor_id, p_idempotency_key) returning * into v_batch;
  for v_index in 1..p_quantity loop
    loop
      v_code := 'WB-' || upper(encode(extensions.gen_random_bytes(10), 'hex'));
      begin
        insert into public.voucher_codes(code, batch_reference, serial_number, batch_id, value_benefit, expires_at, admin_note, created_by)
        values (v_code, v_batch.reference, v_batch.reference || '-' || lpad(v_index::text, 4, '0'), v_batch.id, v_batch.value_benefit, v_batch.expires_at, v_batch.admin_note, p_actor_id);
        exit;
      exception when unique_violation then end;
    end loop;
  end loop;
  update public.voucher_batches set quantity_generated = p_quantity where id = v_batch.id;
  insert into public.voucher_admin_audit_events(actor_id, action, batch_id, metadata) values (p_actor_id, 'batch_generated', v_batch.id, jsonb_build_object('requested', p_quantity, 'generated', p_quantity));
  return query select v_batch.id, p_quantity, v_batch.reference;
end; $$;

alter function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid) owner to postgres;
revoke all on function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid) from public, anon, authenticated;
grant execute on function public.generate_voucher_batch(uuid, text, integer, text, date, text, uuid) to service_role;
