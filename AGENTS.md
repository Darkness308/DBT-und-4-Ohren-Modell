# AGENTS.md – Zusammenarbeit mehrerer KI-Agenten

In diesem Repository arbeiten mehrere Agenten: Claude Code, GitHub Copilot
(Coding Agent, Review, Autofix) und Codex (Review). Diese Regeln gelten für
alle. Ziel: Jede Aufgabe hat genau eine zuständige Stelle, und niemand
überschreibt die Arbeit einer anderen.

Über das Mergen entscheidet immer der Mensch. Kein Agent merged selbst.

## 1. Ein Branch gehört einem Agenten

| Branch-Präfix  | Zuständig   |
| -------------- | ----------- |
| `claude/…`     | Claude Code |
| `copilot/…`    | Copilot     |
| `dependabot/…` | Dependabot  |

- Kein Agent pusht auf den Branch eines anderen und schreibt dessen
  Historie nicht um (kein Rebase, Amend oder Force-Push).
- Änderungswünsche an einem fremden Branch kommen als Review-Kommentar,
  nicht als Commit.
- „Commit suggestion" und Autofix in der GitHub-Oberfläche erzeugen einen
  Commit auf dem Branch. Auf einem Branch, an dem gerade ein Agent
  arbeitet, bitte nicht nutzen, sondern den Befund dem Branch-Inhaber
  überlassen (siehe 2).

## 2. Ein Befund hat genau eine zuständige Stelle

- **Standard:** Wer den PR geöffnet hat, behebt die Review-Befunde darin.
- **Ausnahme:** Der Mensch weist einen Befund ausdrücklich zu
  (z.B. `@copilot fix …` oder eine Nachricht an Claude). Dann behebt ihn
  nur der genannte Agent; der andere prüft das Ergebnis, ändert aber nichts.
- Ist ein zugewiesener Befund beim Merge noch offen, übernimmt ihn der
  Agent, der als Nächstes an den betroffenen Dateien arbeitet, in einem
  eigenen PR und nennt dort den ursprünglichen Befund.
- Jeder behobene Befund bekommt eine Antwort im Thread mit Commit und
  Prüfnachweis. So sieht der andere Agent, dass er erledigt ist.

## 3. Vor jeder Änderung: Überschneidungen prüfen

1. `git fetch` und den eigenen Branch auf den Stand des Remotes bringen.
2. Offene PRs und Branches ansehen. Berührt ein offener PR dieselben
   Dateien, wird die eigene Änderung darauf abgestimmt: warten, im eigenen
   PR auf den anderen verweisen oder die Datei auslassen.
3. Vor jedem Push erneut `git fetch`. Sind fremde Commits auf dem eigenen
   Branch gelandet, werden sie per Merge übernommen, nie überschrieben.

Jede PR-Beschreibung nennt unter **„Berührt"** die geänderten Bereiche,
damit Überschneidungen ohne Diff-Lesen sichtbar sind.

## 4. Dateien mit erhöhtem Kollisionsrisiko

Änderungen hier immer klein halten und nicht mit anderem bündeln:

- `.github/workflows/*` (CI und Deployment)
- `src/modules/vier-ohren/analysisStore.js` und
  `src/__tests__/vierOhrenStore.test.js`
- `supabase/migrations/*` – bestehende Migrationen nur ändern, solange sie
  in keinem echten Projekt gelaufen sind; danach neue Migrationsdatei
- `package.json`, `package-lock.json`
- `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`

## 5. Prüfen statt behaupten

- Vor dem Push: `npm run lint`, `npm run test:run`, `npm run build`.
- Bei Änderungen unter `supabase/`: die Prüfungen aus
  `docs/SUPABASE_PLAN.md` gegen ein lokales PostgreSQL.
- Die PR-Beschreibung trennt „geprüft" von „nicht geprüft".
- Befunde anderer Agenten werden am Code nachvollzogen, bevor sie behoben
  oder zurückgewiesen werden.

## 6. Weitere Regeln

- Projektkontext und Sprachregeln (Clyde): `CLAUDE.md`
- Code-Stil: `.github/copilot-instructions.md`
