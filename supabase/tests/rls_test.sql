-- Prüft die Zugriffsregeln. Bricht beim ersten Fehler ab (ON_ERROR_STOP).
-- Personen: Anna + Ben teilen einen Raum, Cleo ist fremd, Dana ist Dritte.
\set ON_ERROR_STOP on
\set anna '11111111-1111-1111-1111-111111111111'
\set ben  '22222222-2222-2222-2222-222222222222'
\set cleo '33333333-3333-3333-3333-333333333333'
\set dana '44444444-4444-4444-4444-444444444444'
\set e1   'aaaaaaaa-0000-0000-0000-000000000001'
\set e2   'aaaaaaaa-0000-0000-0000-000000000002'
\set sit  'bbbbbbbb-0000-0000-0000-000000000001'

create schema vo_test;

insert into auth.users (id) values (:'anna'), (:'ben'), (:'cleo'), (:'dana');

create function vo_test.expect_error(p_sql text, p_label text) returns void language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    raise notice 'PASS %  (abgelehnt: %)', p_label, sqlerrm;
    return;
  end;
  raise exception 'FAIL %: Anweisung wurde nicht abgelehnt', p_label;
end $$;
create function vo_test.expect(p_ok boolean, p_label text) returns void language plpgsql as $$
begin
  if p_ok then raise notice 'PASS %', p_label; else raise exception 'FAIL %', p_label; end if;
end $$;
grant usage on schema vo_test to authenticated, anon;

-- Nicht angemeldet: nichts geht
set role anon;
select vo_test.expect_error('select * from public.vier_ohren_entries', 'anon darf Einträge nicht lesen');
select vo_test.expect_error($$select public.create_space('x')$$, 'anon darf keinen Raum anlegen');
reset role;

-- Anna legt Raum an
set role authenticated;
select set_config('request.jwt.claim.sub', :'anna', false);
select space_id as space, invite_code as code from public.create_space('Anna') \gset
select vo_test.expect((select count(*) from public.spaces) = 1, 'Anna sieht ihren Raum');
select vo_test.expect_error($$select public.create_space('Anna2')$$, 'Anna kann keinen zweiten Raum anlegen');

insert into public.vier_ohren_entries (id, space_id, situation_id, role, statement, levels, created_at, updated_at)
values (:'e1', :'space', :'sit', 'sender', 'Die Küche sieht ja aus.', '{"sachebene":"Geschirr"}', '2026-01-01T10:00Z', '2026-01-01T10:00Z');
select vo_test.expect((select author_id from public.vier_ohren_entries where id = :'e1') = :'anna', 'author_id wird automatisch gesetzt');

-- Cleo (fremd) sieht nichts und kann nicht in Annas Raum schreiben
select set_config('request.jwt.claim.sub', :'cleo', false);
select vo_test.expect((select count(*) from public.vier_ohren_entries) = 0, 'Fremde sieht keine Einträge');
select vo_test.expect((select count(*) from public.spaces) = 0, 'Fremde sieht keinen Raum und keinen Einladungscode');
select vo_test.expect((select count(*) from public.space_members) = 0, 'Fremde sieht keine Mitglieder');
select vo_test.expect_error(format($$insert into public.vier_ohren_entries (id, space_id, situation_id, role, statement, created_at, updated_at) values (gen_random_uuid(), %L, gen_random_uuid(), 'sender', 'x', now(), now())$$, :'space'), 'Fremde kann nicht in den Raum schreiben');
select vo_test.expect_error($$select public.join_space('falscher-code', 'Cleo')$$, 'Falscher Einladungscode wird abgelehnt');
select vo_test.expect_error($$insert into public.space_members (space_id, user_id, display_name) select id, auth.uid(), 'Cleo' from public.spaces$$, 'Mitgliedschaft lässt sich nicht direkt einfügen');

-- Ben tritt bei
select set_config('request.jwt.claim.sub', :'ben', false);
select public.join_space(:'code', 'Ben');
select vo_test.expect((select count(*) from public.vier_ohren_entries) = 1, 'Ben sieht Annas Eintrag');
select vo_test.expect((select count(*) from public.space_members) = 2, 'Ben sieht beide Mitglieder');
insert into public.vier_ohren_entries (id, space_id, situation_id, role, statement, created_at, updated_at)
values (:'e2', :'space', :'sit', 'receiver', 'Die Küche sieht ja aus.', '2026-01-01T11:00Z', '2026-01-01T11:00Z');
update public.vier_ohren_entries set statement = 'von Ben geändert', updated_at = now() where id = :'e1';
select vo_test.expect((select statement from public.vier_ohren_entries where id = :'e1') = 'Die Küche sieht ja aus.', 'Ben kann Annas Eintrag nicht ändern');
select vo_test.expect_error(format($$insert into public.vier_ohren_entries (id, space_id, situation_id, author_id, role, statement, created_at, updated_at) values (gen_random_uuid(), %L, gen_random_uuid(), %L, 'sender', 'x', now(), now())$$, :'space', :'anna'), 'Ben kann nicht in Annas Namen schreiben');
select vo_test.expect_error(format($$delete from public.vier_ohren_entries where id = %L$$, :'e2'), 'Hartes Löschen ist gesperrt');
select vo_test.expect_error(format($$update public.vier_ohren_entries set situation_id = gen_random_uuid(), updated_at = now() where id = %L$$, :'e2'), 'situation_id ist unveränderlich');

-- Neuerer Stand bleibt; Löschmarkierung erreicht die andere Person
update public.vier_ohren_entries set levels = '{"sachebene":"neu"}', updated_at = '2026-01-03T00:00Z' where id = :'e2';
update public.vier_ohren_entries set levels = '{"sachebene":"alt"}', updated_at = '2026-01-02T00:00Z' where id = :'e2';
select vo_test.expect((select levels->>'sachebene' from public.vier_ohren_entries where id = :'e2') = 'neu', 'Älterer Stand überschreibt keinen neueren');
update public.vier_ohren_entries set deleted_at = now(), updated_at = now() where id = :'e2';
select set_config('request.jwt.claim.sub', :'anna', false);
select vo_test.expect((select deleted_at is not null from public.vier_ohren_entries where id = :'e2'), 'Anna sieht Bens Löschmarkierung');

-- Dritte Person passt nicht mehr in den Raum
select set_config('request.jwt.claim.sub', :'dana', false);
select vo_test.expect_error(format($$select public.join_space(%L, 'Dana')$$, :'code'), 'Dritte Person wird abgelehnt');
select vo_test.expect((select count(*) from public.vier_ohren_entries) = 0, 'Dritte Person sieht weiterhin nichts');

-- Eingabegrenzen
select set_config('request.jwt.claim.sub', :'anna', false);
select vo_test.expect_error(format($$insert into public.vier_ohren_entries (id, space_id, situation_id, role, statement, created_at, updated_at) values (gen_random_uuid(), %L, gen_random_uuid(), 'zuschauer', 'x', now(), now())$$, :'space'), 'Unbekannte Rolle wird abgelehnt');
select vo_test.expect_error(format($$insert into public.vier_ohren_entries (id, space_id, situation_id, role, statement, created_at, updated_at) values (gen_random_uuid(), %L, gen_random_uuid(), 'sender', repeat('x', 4001), now(), now())$$, :'space'), 'Zu langer Text wird abgelehnt');
reset role;
\echo ALLE PRUEFUNGEN BESTANDEN
