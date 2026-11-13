-- Vier-Ohren: gemeinsamer Raum für genau zwei Personen
--
-- Ziel: Beide Personen sehen dieselben Einträge auf ihren Geräten.
-- Schutz: Row Level Security. Nur Mitglieder eines Raums lesen dessen
-- Einträge; schreiben darf jede Person nur die eigenen.
--
-- Ausführen: Supabase Dashboard → SQL Editor, oder `supabase db push`.

-- ---------------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------------

create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.space_members (
  space_id uuid not null references public.spaces (id) on delete cascade,
  -- Eine Person gehört zu höchstens einem Raum
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

create table public.vier_ohren_entries (
  -- Die ID vergibt das Gerät (offline erzeugt), nicht der Server
  id uuid primary key,
  space_id uuid not null references public.spaces (id) on delete cascade,
  situation_id uuid not null,
  author_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  role text not null check (role in ('sender', 'receiver')),
  statement text not null check (char_length(statement) between 1 and 4000),
  context text not null default '' check (char_length(context) <= 4000),
  -- { sachebene, selbstoffenbarung, beziehungsebene, appellseite }
  -- Je Feld dieselbe Grenze wie in der App (4000 Zeichen); die Gesamtgröße
  -- deckt vier volle Felder auch mit Mehrbyte-Zeichen ab.
  levels jsonb not null default '{}'::jsonb
    check (
      jsonb_typeof(levels) = 'object'
      and octet_length(levels::text) <= 70000
      and char_length(coalesce(levels ->> 'sachebene', '')) <= 4000
      and char_length(coalesce(levels ->> 'selbstoffenbarung', '')) <= 4000
      and char_length(coalesce(levels ->> 'beziehungsebene', '')) <= 4000
      and char_length(coalesce(levels ->> 'appellseite', '')) <= 4000
    ),
  -- Zeitstempel des Geräts (für "neuerer Stand bleibt")
  created_at timestamptz not null,
  updated_at timestamptz not null,
  -- Löschen = markieren, damit das Löschen auch das andere Gerät erreicht
  deleted_at timestamptz,
  -- Zeitstempel des Servers (für "alles seit dem letzten Abgleich holen")
  synced_at timestamptz not null default now()
);

create index vier_ohren_entries_space_synced_idx
  on public.vier_ohren_entries (space_id, synced_at);

-- ---------------------------------------------------------------------------
-- Hilfsfunktion und Trigger
-- ---------------------------------------------------------------------------

-- Läuft mit den Rechten des Eigentümers, damit die Prüfung nicht selbst an
-- der Zugriffsregel von space_members hängt (keine Rekursion).
create function public.is_space_member(p_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.space_members m
    where m.space_id = p_space_id
      and m.user_id = (select auth.uid())
  );
$$;

create function public.vier_ohren_entries_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if new.id <> old.id
       or new.space_id <> old.space_id
       or new.author_id <> old.author_id
       or new.situation_id <> old.situation_id
       or new.created_at <> old.created_at
       or new.statement <> old.statement
       or new.context <> old.context then
      raise exception 'id, space_id, author_id, situation_id, created_at, statement und context sind unveränderlich';
    end if;
    -- Nur ein echt neuerer Stand ersetzt den vorhandenen (wie mergeEntries
    -- in der App). Älter oder gleich alt: Zeile bleibt unverändert.
    if new.updated_at <= old.updated_at then
      return old;
    end if;
  end if;
  new.synced_at := now();
  return new;
end;
$$;

create trigger vier_ohren_entries_guard
  before insert or update on public.vier_ohren_entries
  for each row execute function public.vier_ohren_entries_guard();

-- ---------------------------------------------------------------------------
-- Raum anlegen und beitreten (einziger Weg, Mitglied zu werden)
-- ---------------------------------------------------------------------------

create function public.create_space(p_display_name text)
returns table (space_id uuid, invite_code text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_space uuid;
  v_code text;
begin
  if v_user is null then
    raise exception 'Nicht angemeldet';
  end if;
  if exists (select 1 from public.space_members m where m.user_id = v_user) then
    raise exception 'Du gehörst bereits zu einem Raum';
  end if;

  v_code := replace(gen_random_uuid()::text, '-', '');
  insert into public.spaces (invite_code, created_by)
  values (v_code, v_user)
  returning id into v_space;

  insert into public.space_members (space_id, user_id, display_name)
  values (v_space, v_user, btrim(p_display_name));

  return query select v_space, v_code;
end;
$$;

create function public.join_space(p_invite_code text, p_display_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_space uuid;
begin
  if v_user is null then
    raise exception 'Nicht angemeldet';
  end if;
  if exists (select 1 from public.space_members m where m.user_id = v_user) then
    raise exception 'Du gehörst bereits zu einem Raum';
  end if;

  -- Zeile sperren, damit nicht zwei Personen gleichzeitig den letzten Platz nehmen
  select s.id into v_space
  from public.spaces s
  where s.invite_code = p_invite_code
  for update;

  if v_space is null then
    raise exception 'Einladungscode unbekannt';
  end if;
  if (select count(*) from public.space_members m where m.space_id = v_space) >= 2 then
    raise exception 'Dieser Raum hat bereits zwei Personen';
  end if;

  insert into public.space_members (space_id, user_id, display_name)
  values (v_space, v_user, btrim(p_display_name));

  return v_space;
end;
$$;

revoke all on function public.is_space_member(uuid) from public, anon;
revoke all on function public.create_space(text) from public, anon;
revoke all on function public.join_space(text, text) from public, anon;
grant execute on function public.is_space_member(uuid) to authenticated;
grant execute on function public.create_space(text) to authenticated;
grant execute on function public.join_space(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.vier_ohren_entries enable row level security;

revoke all on public.spaces, public.space_members, public.vier_ohren_entries from anon;
revoke all on public.spaces, public.space_members, public.vier_ohren_entries from authenticated;
grant select on public.spaces, public.space_members to authenticated;
grant select, insert, update on public.vier_ohren_entries to authenticated;
-- Kein DELETE: gelöscht wird über deleted_at.

create policy "Mitglieder sehen ihren Raum"
  on public.spaces for select to authenticated
  using (public.is_space_member(id));

create policy "Mitglieder sehen die Mitglieder ihres Raums"
  on public.space_members for select to authenticated
  using (public.is_space_member(space_id));

create policy "Mitglieder lesen alle Einträge ihres Raums"
  on public.vier_ohren_entries for select to authenticated
  using (public.is_space_member(space_id));

create policy "Mitglieder legen nur eigene Einträge an"
  on public.vier_ohren_entries for insert to authenticated
  with check (author_id = (select auth.uid()) and public.is_space_member(space_id));

create policy "Mitglieder ändern nur eigene Einträge"
  on public.vier_ohren_entries for update to authenticated
  using (author_id = (select auth.uid()) and public.is_space_member(space_id))
  with check (author_id = (select auth.uid()) and public.is_space_member(space_id));
