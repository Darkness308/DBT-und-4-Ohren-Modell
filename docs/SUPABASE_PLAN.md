# Gemeinsame Datenbank mit Supabase – Plan

Stand: vorbereitet, nicht angeschlossen. Die App läuft weiter rein lokal mit
Export/Import, bis die Schritte unter „Was du tun musst" erledigt sind.

## Ziel

Zwei Personen nutzen die App auf verschiedenen Geräten und sehen dieselben
Vier-Ohren-Einträge, ohne Dateien hin- und herzuschicken. Die App bleibt
offline nutzbar; abgeglichen wird, sobald eine Verbindung besteht.

## Was vorbereitet und geprüft ist

| Teil                                                    | Datei                                                  | Geprüft                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Datenbankschema, Zugriffsregeln, Raum anlegen/beitreten | `supabase/migrations/0001_vier_ohren_shared_space.sql` | Ja, 28 Prüfungen in `supabase/tests/rls_test.sql` gegen lokales PostgreSQL 16 |
| Platzhalter für die Zugangsdaten                        | `.env.example`                                         | –                                                                             |

Der lokale Test ersetzt Supabase durch einen Nachbau (`supabase/tests/local_auth_stub.sql`:
Rollen `anon`/`authenticated`, `auth.users`, `auth.uid()`). **Gegen ein echtes
Supabase-Projekt ist das Schema nicht gelaufen**, weil noch keines existiert.

Test wiederholen (lokales PostgreSQL nötig):

```bash
createdb vo_test
psql -d vo_test -v ON_ERROR_STOP=1 -f supabase/tests/local_auth_stub.sql
psql -d vo_test -v ON_ERROR_STOP=1 -f supabase/migrations/0001_vier_ohren_shared_space.sql
psql -d vo_test -f supabase/tests/rls_test.sql
```

## Datenmodell

```
spaces               ein Raum pro Paar, mit Einladungscode
space_members        höchstens zwei Personen pro Raum, eine Person in höchstens einem Raum
vier_ohren_entries   eine Sicht einer Person auf eine Situation
```

`vier_ohren_entries` entspricht dem lokalen Eintrag aus
`src/modules/vier-ohren/analysisStore.js`:

| Lokal                                    | Datenbank                    | Anmerkung                                                       |
| ---------------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `id`                                     | `id`                         | wird auf dem Gerät erzeugt (offline möglich)                    |
| `situationId`                            | `situation_id`               | verbindet beide Sichten                                         |
| `author.id`                              | `author_id`                  | wird zur Supabase-Benutzer-ID                                   |
| `author.name`                            | `space_members.display_name` | Name steht einmal am Mitglied                                   |
| `role`, `statement`, `context`, `levels` | gleichnamig                  | gleiche Längengrenzen wie lokal                                 |
| `createdAt`, `updatedAt`                 | `created_at`, `updated_at`   | Zeit des Geräts                                                 |
| –                                        | `deleted_at`                 | Löschmarkierung; behebt, dass Gelöschtes per Import zurückkommt |
| –                                        | `synced_at`                  | Zeit des Servers, für „alles seit dem letzten Abgleich"         |

## Zugriffsregeln (geprüft)

- Ohne Anmeldung: kein Zugriff.
- Fremde angemeldete Personen sehen weder Einträge noch Raum, Mitglieder oder Einladungscode.
- Mitglieder lesen alle Einträge ihres Raums, schreiben und ändern nur die eigenen.
- Niemand schreibt im Namen der anderen Person.
- Eine dritte Person kann dem Raum nicht beitreten.
- Mitgliedschaft entsteht nur über `create_space` und `join_space`.
- Hartes Löschen ist gesperrt; gelöscht wird über `deleted_at`.
- Ein älterer oder gleich alter Stand überschreibt keinen neueren.
- Aussage und Kontext eines Eintrags sind nach dem Anlegen unveränderlich; änderbar sind nur Rolle und Antworten.

## Ablauf in der App (noch zu bauen)

1. **Anmelden** per E-Mail-Link (kein Passwort). Supabase verschickt den Link.
2. **Raum**: Person A legt den Raum an und bekommt einen Einladungscode.
   Person B gibt den Code ein. Danach ist der Raum voll.
3. **Übernahme**: Die bisher lokalen Einträge der Person bekommen ihre
   Supabase-Benutzer-ID als `author.id` und werden hochgeladen.
4. **Abgleich**: Beim Öffnen, nach jedem Speichern und beim Wiederverbinden:
   lokale Änderungen hochladen (`upsert`), alles mit `synced_at` nach dem
   letzten Abgleich holen, mit `mergeEntries` zusammenführen.
5. **Offline**: Einträge liegen weiter im LocalStorage. Ungesendete Änderungen
   werden beim nächsten Abgleich übertragen.
6. **Verdeckte Sicht** bleibt eine Regel der Oberfläche. Die Datenbank liefert
   einem Mitglied beide Sichten; technisch erzwungen ist das Verdecken nicht.
7. Export/Import bleibt als Sicherung erhalten.

Neue Abhängigkeit: `@supabase/supabase-js`. Der Code wird nur aktiv, wenn
`VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` gesetzt sind.

## Was du tun musst

1. Auf supabase.com ein Projekt anlegen. **Region in der EU wählen**
   (die Region lässt sich später nicht ändern).
2. Im SQL Editor den Inhalt von
   `supabase/migrations/0001_vier_ohren_shared_space.sql` ausführen.
   Die Dateien unter `supabase/tests/` dort **nicht** ausführen.
3. Authentication → URL Configuration: als Site URL und Redirect URL
   `https://darkness308.github.io/DBT-und-4-Ohren-Modell/` eintragen.
4. Project Settings → API: **Project URL** und **anon/publishable key** kopieren.
5. Im GitHub-Repo unter Settings → Secrets and variables → Actions → Variables
   `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` anlegen.
   Den `service_role`-Key nirgends eintragen.
6. Mir Bescheid geben. Dann baue ich Anmeldung, Raum und Abgleich und teste
   gegen das echte Projekt.

## Offene Entscheidungen

| Frage                                                   | Vorschlag     | Warum                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Anmeldung                                               | E-Mail-Link   | kein Passwort zu merken; braucht pro Person eine E-Mail-Adresse                                                                                                                                                                                                                                        |
| Inhalte zusätzlich verschlüsseln (Ende-zu-Ende)?        | zunächst nein | Die Zugriffsregeln schützen vor Dritten. Ohne Verschlüsselung kann aber lesen, wer Zugriff auf das Supabase-Projekt hat (Projektinhaber, Anbieter). Verschlüsselung mit gemeinsamem Kennwort ist nachrüstbar und passt in dasselbe Schema; geht das Kennwort verloren, sind die Server-Daten unlesbar. |
| Andere Module (Diary Card, Chain Analysis) auch teilen? | nein          | Die sind persönlich; geteilt wird nur, was für den Vergleich gedacht ist.                                                                                                                                                                                                                              |
| Live-Aktualisierung (Realtime)                          | später        | Abgleich beim Öffnen und Speichern reicht für zwei Personen.                                                                                                                                                                                                                                           |

## Nicht geprüft / Risiken

- Verhalten im echten Supabase (Rollenrechte, `auth.uid()`, E-Mail-Versand,
  Limits des kostenlosen Tarifs). Die aktuellen Tarifbedingungen habe ich
  nicht nachgelesen.
- Die Einträge sind persönliche, gesundheitsnahe Daten zweier Personen.
  Ob für eure Nutzung weitere Datenschutzpflichten gelten, habe ich nicht geprüft.
- Die Gerätezeit bestimmt, welcher Stand „neuer" ist. Eine falsch gestellte
  Uhr kann einen neueren Stand verdrängen.
