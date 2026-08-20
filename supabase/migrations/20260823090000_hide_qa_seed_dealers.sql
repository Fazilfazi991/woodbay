-- Preserve the development seed records for internal testing while preventing
-- them from appearing through the canonical public_dealers visibility model.
update public.dealers
set is_visible = false,
    status = 'inactive'
where business_name ilike '%qa%'
   or address ilike '%qa dealer address%';
