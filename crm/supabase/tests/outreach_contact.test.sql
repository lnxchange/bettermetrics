begin;

select plan(32);

-- Avatar lookup calls the http extension. These tests cover the record,
-- not the network fetch.
alter table public.contacts disable trigger "20_contact_saved";

create temp table outreach_results (
  label text primary key,
  result jsonb
);

insert into outreach_results (label, result)
values (
  'first',
  public.upsert_outreach_contact($json${
    "external_id": "aim-outreach:test-a",
    "first_name": "Partha",
    "last_name": "Dasgupta",
    "email": "partha.dasgupta@econ.cam.ac.uk",
    "email_holder": "self",
    "company": "AIM Test University",
    "company_sector": "university",
    "title": "Frank Ramsey Professor Emeritus of Economics",
    "tags": ["reviewer"],
    "list": "primary",
    "ask_policy": "may-ask-to-validate",
    "source": "treatise-list",
    "background": "Who they are.",
    "outreach_status": "sent",
    "first_contacted_at": "2026-11-10",
    "last_contacted_at": "2026-11-10",
    "history": [
      {"date": "2026-11-10", "kind": "email-sent", "subject": "Invitation", "text": "full email"}
    ],
    "deal": {"category": "validation", "name": "Dasgupta: evaluation of AIM"}
  }$json$::jsonb)
);

insert into outreach_results (label, result)
values (
  'second',
  public.upsert_outreach_contact($json${
    "external_id": "aim-outreach:test-a",
    "first_name": "Partha",
    "last_name": "Dasgupta",
    "email": "partha.dasgupta@econ.cam.ac.uk",
    "email_holder": "self",
    "company": "AIM Test University",
    "company_sector": "university",
    "title": "Frank Ramsey Professor Emeritus of Economics",
    "tags": ["reviewer"],
    "list": "primary",
    "ask_policy": "may-ask-to-validate",
    "source": "treatise-list",
    "background": "Who they are.",
    "outreach_status": "sent",
    "first_contacted_at": "2026-11-10",
    "last_contacted_at": "2026-11-10",
    "history": [
      {"date": "2026-11-10", "kind": "email-sent", "subject": "Invitation", "text": "full email"}
    ],
    "deal": {"category": "validation", "name": "Dasgupta: evaluation of AIM"}
  }$json$::jsonb)
);

select is(
  (select (result->>'created')::boolean from outreach_results where label = 'first'),
  true,
  'the first payload creates the contact'
);

select is(
  (select (result->>'created')::boolean from outreach_results where label = 'second'),
  false,
  'the same payload again does not create a contact'
);

select is(
  (select result->>'contact_id' from outreach_results where label = 'second'),
  (select result->>'contact_id' from outreach_results where label = 'first'),
  'the same payload keeps the same contact'
);

select is(
  (select result->>'deal_id' from outreach_results where label = 'second'),
  (select result->>'deal_id' from outreach_results where label = 'first'),
  'the same payload keeps the same deal'
);

select is(
  (
    select count(*)::int
    from public.contact_notes
    where contact_id = (select (result->>'contact_id')::bigint from outreach_results where label = 'first')
  ),
  1,
  'sending the same history twice inserts one note'
);

select is(
  (
    select stage
    from public.deals
    where id = (select (result->>'deal_id')::bigint from outreach_results where label = 'first')
  ),
  'invited',
  'a sent contact opens the deal at invited'
);

select is(
  (
    select synced_stage
    from public.deals
    where id = (select (result->>'deal_id')::bigint from outreach_results where label = 'first')
  ),
  'invited',
  'the sync records the stage it wrote'
);

select is(
  (select sector from public.companies where name = 'AIM Test University'),
  'university',
  'a new company takes the sector from the payload'
);

select is(
  (
    select first_contacted_at = '2026-11-10'::timestamptz
      and last_contacted_at = '2026-11-10'::timestamptz
    from public.contacts
    where external_id = 'aim-outreach:test-a'
  ),
  true,
  'contact dates are stored from the payload'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "outreach_status": "sent",
  "first_contacted_at": "2026-11-12",
  "last_contacted_at": "2026-11-01"
}$json$::jsonb);

select is(
  (select first_contacted_at from public.contacts where external_id = 'aim-outreach:test-a'),
  '2026-11-10'::timestamptz,
  'first_contacted_at does not move later'
);

select is(
  (select last_contacted_at from public.contacts where external_id = 'aim-outreach:test-a'),
  '2026-11-10'::timestamptz,
  'last_contacted_at does not move earlier'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "outreach_status": "sent",
  "last_contacted_at": "2026-11-20"
}$json$::jsonb);

select is(
  (select last_contacted_at from public.contacts where external_id = 'aim-outreach:test-a'),
  '2026-11-20'::timestamptz,
  'last_contacted_at moves later'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "outreach_status": "sent",
  "first_contacted_at": null,
  "last_contacted_at": null
}$json$::jsonb);

select is(
  (
    select first_contacted_at = '2026-11-10'::timestamptz
      and last_contacted_at = '2026-11-20'::timestamptz
    from public.contacts
    where external_id = 'aim-outreach:test-a'
  ),
  true,
  'null dates do not clear either contact date'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "history": [
    {"date": "2026-11-14", "kind": "reply", "subject": "Re: Invitation", "text": "yes"}
  ]
}$json$::jsonb);

select is(
  (
    select count(*)::int
    from public.contact_notes
    where contact_id = (select (result->>'contact_id')::bigint from outreach_results where label = 'first')
  ),
  2,
  'a different subject is a new note'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-lock",
  "first_name": "Locked",
  "last_name": "Title",
  "email": "locked-title@example.com",
  "email_holder": "self",
  "title": "Original title",
  "background": "Original background"
}$json$::jsonb);

update public.contacts
set locked_fields = array['title']
where external_id = 'aim-outreach:test-lock';

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-lock",
  "email_holder": "self",
  "title": "Replacement title",
  "background": "Replacement background"
}$json$::jsonb);

select is(
  (select title from public.contacts where external_id = 'aim-outreach:test-lock'),
  'Original title',
  'a locked title is left alone'
);

select is(
  (select background from public.contacts where external_id = 'aim-outreach:test-lock'),
  'Replacement background',
  'an unlocked field still updates'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-assistant",
  "first_name": "Office",
  "last_name": "Assistant",
  "email": "office@example.com",
  "email_holder": "assistant"
}$json$::jsonb);

select is(
  (
    select email_jsonb->0->>'type'
    from public.contacts
    where external_id = 'aim-outreach:test-assistant'
  ),
  'Assistant',
  'an assistant address is stored with that holder'
);

select is(
  (
    select count(*)::int
    from public.contacts
    where external_id = 'aim-outreach:test-assistant'
      and exists (
        select 1
        from jsonb_array_elements(email_jsonb) entry
        where lower(entry->>'email') = 'office@example.com'
          and coalesce(entry->>'type', 'Work') in ('Work', 'Home', 'Other')
      )
  ),
  0,
  'an assistant address is not filed as the person''s own email'
);

insert into outreach_results (label, result)
values (
  'assistant-self',
  public.upsert_outreach_contact($json${
    "external_id": "aim-outreach:test-assistant-self",
    "first_name": "Someone",
    "last_name": "Else",
    "email": "office@example.com",
    "email_holder": "self"
  }$json$::jsonb)
);

select is(
  (select (result->>'created')::boolean from outreach_results where label = 'assistant-self'),
  true,
  'the same address with holder self creates a different contact'
);

select isnt(
  (select result->>'contact_id' from outreach_results where label = 'assistant-self'),
  (
    select id::text
    from public.contacts
    where external_id = 'aim-outreach:test-assistant'
  ),
  'the self contact is not the assistant contact'
);

select is(
  (
    select email_jsonb->0->>'type'
    from public.contacts
    where external_id = 'aim-outreach:test-assistant-self'
  ),
  'Work',
  'a self address is stored as the person''s own email'
);

select isnt(
  public.upsert_synced_contact(
    'office@example.com',
    'Signup',
    'Person',
    null,
    'website-signup',
    null,
    array['site-user'],
    null,
    'may-ask-to-validate',
    null,
    null,
    null
  )::text,
  (select id::text from public.contacts where external_id = 'aim-outreach:test-assistant'),
  'website signup does not match an assistant address'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "outreach_status": "replied",
  "deal": {"category": "validation", "name": "Dasgupta: evaluation of AIM"}
}$json$::jsonb);

select is(
  (
    select stage
    from public.deals
    where id = (select (result->>'deal_id')::bigint from outreach_results where label = 'first')
  ),
  'responded',
  'a reply advances the deal to responded'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "outreach_status": "sent",
  "deal": {"category": "validation", "name": "Dasgupta: evaluation of AIM"}
}$json$::jsonb);

select is(
  (
    select stage
    from public.deals
    where id = (select (result->>'deal_id')::bigint from outreach_results where label = 'first')
  ),
  'responded',
  'a later sent status does not move the deal backwards'
);

update public.deals
set stage = 'reading'
where id = (select (result->>'deal_id')::bigint from outreach_results where label = 'first');

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-a",
  "email_holder": "self",
  "outreach_status": "engaged",
  "deal": {"category": "validation", "name": "Dasgupta: evaluation of AIM"}
}$json$::jsonb);

select is(
  (
    select stage
    from public.deals
    where id = (select (result->>'deal_id')::bigint from outreach_results where label = 'first')
  ),
  'reading',
  'a stage changed after the last sync survives the next sync'
);

select public.upsert_outreach_contact($json${
  "external_id": "aim-outreach:test-log",
  "first_name": "Log",
  "last_name": "Target",
  "email_holder": "self",
  "last_contacted_at": "2026-11-10"
}$json$::jsonb);

select public.log_contact_event($json${
  "external_id": "aim-outreach:test-log",
  "date": "2026-11-12",
  "kind": "email-sent",
  "subject": "Follow up",
  "text": "second note"
}$json$::jsonb);

select is(
  (
    select count(*)::int
    from public.contact_notes n
    join public.contacts c on c.id = n.contact_id
    where c.external_id = 'aim-outreach:test-log'
  ),
  1,
  'log_contact_event adds one note'
);

select is(
  (select last_contacted_at from public.contacts where external_id = 'aim-outreach:test-log'),
  '2026-11-12'::timestamptz,
  'an email-sent event moves last_contacted_at later'
);

select public.log_contact_event($json${
  "external_id": "aim-outreach:test-log",
  "date": "2026-11-01",
  "kind": "email-sent",
  "subject": "Earlier",
  "text": "older"
}$json$::jsonb);

select is(
  (select last_contacted_at from public.contacts where external_id = 'aim-outreach:test-log'),
  '2026-11-12'::timestamptz,
  'an older email-sent event does not move last_contacted_at backwards'
);

select public.log_contact_event($json${
  "external_id": "aim-outreach:test-log",
  "date": "2026-11-12",
  "kind": "email-sent",
  "subject": "Follow up",
  "text": "second note"
}$json$::jsonb);

select is(
  (
    select count(*)::int
    from public.contact_notes n
    join public.contacts c on c.id = n.contact_id
    where c.external_id = 'aim-outreach:test-log'
  ),
  2,
  'logging the same event again does not add a note'
);

select is(
  public.upsert_synced_contact(
    'sync-match@example.com',
    'Ada',
    'Lovelace',
    'AIM Test Lab',
    'website-signup',
    null,
    array['site-user'],
    null,
    'may-ask-to-validate',
    null,
    'Original title',
    null
  ),
  public.upsert_synced_contact(
    'sync-match@example.com',
    'Ada',
    'Byron',
    'AIM Test Lab',
    'website-signup',
    'site-user:sync-match',
    array['site-user'],
    null,
    'may-ask-to-validate',
    null,
    'Original title',
    null
  ),
  'upsert_synced_contact still matches on the person''s own email'
);

update public.contacts
set locked_fields = array['title']
where external_id = 'site-user:sync-match';

select public.upsert_synced_contact(
  'sync-match@example.com',
  'Augusta',
  'Byron',
  'AIM Test Lab',
  'website-signup',
  'site-user:sync-match',
  null,
  null,
  null,
  null,
  'Changed title',
  null
);

select is(
  (select title from public.contacts where external_id = 'site-user:sync-match'),
  'Original title',
  'upsert_synced_contact still leaves a locked title alone'
);

select is(
  (select first_name from public.contacts where external_id = 'site-user:sync-match'),
  'Augusta',
  'upsert_synced_contact still updates an unlocked name'
);

select * from finish();

rollback;
