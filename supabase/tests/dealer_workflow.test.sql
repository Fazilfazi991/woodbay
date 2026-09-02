begin;
create extension if not exists pgtap with schema extensions;
select plan(24);

select extensions.has_column('public', 'dealer_applications', 'whatsapp', 'applications store WhatsApp');
select extensions.has_column('public', 'dealer_applications', 'business_type', 'applications store business type');
select extensions.has_column('public', 'dealer_applications', 'years_in_business', 'applications store business age');
select extensions.has_column('public', 'dealer_applications', 'has_showroom', 'applications store showroom availability');
select extensions.has_column('public', 'dealer_applications', 'areas_served', 'applications store service areas');
select extensions.has_column('public', 'dealer_applications', 'product_interests', 'applications store product interests');
select extensions.has_column('public', 'dealer_applications', 'consent', 'applications store contact consent');
select extensions.has_column('public', 'dealer_applications', 'submission_token', 'applications store duplicate token');
select extensions.has_table('public', 'dealer_application_audit_events', 'dealer workflow has audit table');
select extensions.has_function('public', 'create_dealer_from_application', array['uuid', 'uuid'], 'dealer conversion RPC exists');
select extensions.has_function('public', 'set_dealer_application_status', array['uuid', 'text', 'uuid'], 'status workflow RPC exists');
select extensions.has_index('public', 'dealer_applications', 'dealer_applications_submission_token_idx', 'duplicate token is indexed uniquely');
select extensions.has_index('public', 'dealer_applications', 'dealer_applications_product_interests_idx', 'product interests support admin filtering');
select extensions.ok((select relrowsecurity from pg_class where oid = 'public.dealer_application_audit_events'::regclass), 'dealer application audit events use RLS');

select extensions.lives_ok($$
  insert into public.dealer_applications (
    id, business_name, contact_person, phone, state, district, location,
    business_type, has_showroom, areas_served, product_interests, consent, submission_token
  ) values (
    '51000000-0000-0000-0000-000000000001', 'Batch 5 Test Hardware', 'QA Applicant', '+919000000010',
    'Kerala', 'Ernakulam', 'Kochi', 'Hardware Store', true, 'Kochi',
    array['Hardware Fittings & Aluminium Profiles'], true, '52000000-0000-0000-0000-000000000001'
  )
$$, 'a complete dealer application persists');
select extensions.is((select count(*)::integer from public.dealer_application_audit_events where application_id = '51000000-0000-0000-0000-000000000001' and action = 'application_submitted'), 1, 'submission creates one audit event');
select extensions.ok(not has_table_privilege('anon', 'public.dealer_applications', 'select'), 'anonymous applicants cannot list applications');
select extensions.ok(not has_function_privilege('anon', 'public.set_dealer_application_status(uuid,text,uuid)', 'execute'), 'anonymous applicants cannot update status');
select extensions.ok(not has_function_privilege('anon', 'public.create_dealer_from_application(uuid,uuid)', 'execute'), 'anonymous applicants cannot create dealers');
select extensions.throws_ok($$select public.create_dealer_from_application('51000000-0000-0000-0000-000000000001', null)$$, 'P0001', 'application must be approved before dealer creation', 'conversion requires approval');
select extensions.lives_ok($$select public.set_dealer_application_status('51000000-0000-0000-0000-000000000001', 'approved', null)$$, 'admin workflow can approve an application');
select extensions.is((select count(*)::integer from public.dealer_application_audit_events where application_id = '51000000-0000-0000-0000-000000000001' and action = 'status_changed' and to_status = 'approved'), 1, 'status change is audited');
select extensions.ok(public.create_dealer_from_application('51000000-0000-0000-0000-000000000001', null) is not null, 'approved application converts to a dealer');
select extensions.is((select status::text || ':' || is_visible::text from public.dealers where id = (select dealer_id from public.dealer_applications where id = '51000000-0000-0000-0000-000000000001')), 'pending:false', 'converted dealer stays private pending admin publication');

select * from extensions.finish();
rollback;
