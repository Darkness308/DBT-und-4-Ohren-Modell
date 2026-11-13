# DBT-und-4-Ohren-Modell

Therapeutische Web-App: DBT-Skills (Dialektisch-Behaviorale Therapie) kombiniert mit dem Vier-Ohren-Modell. React + Tailwind, barrierefrei, offline-fähig. Diary Card, Skill-Finder, Chain Analysis, Imaginationsübungen.

## Schnellstart

```bash
# 1. Repository klonen
git clone https://github.com/Darkness308/DBT-und-4-Ohren-Modell.git
cd DBT-und-4-Ohren-Modell

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev

# 4. Im Browser öffnen
# http://localhost:5173
```

## Vier-Ohren-Modul: so nutzt ihr es zu zweit

Die App deutet nichts automatisch. Jede Person trägt die eigene Sicht auf die vier Seiten einer Aussage ein (gemeint oder gehört). Die Daten liegen nur auf dem jeweiligen Gerät.

1. Person A: **Analyzer → Neue Situation festhalten**, ausfüllen, speichern, **Diese Situation teilen** (JSON-Datei).
2. Person B: Datei über **Datei importieren** einlesen, **Meine Sicht eintragen**. Die Sicht von A bleibt bis dahin verdeckt.
3. Person B teilt die Situation zurück, Person A importiert. Beide sehen den Vergleich.

Import führt zusammen (gleiche Eintrags-ID: der neuere Stand bleibt) und erzeugt keine Duplikate.

## Dokumentation

| Datei                                                              | Beschreibung                |
| ------------------------------------------------------------------ | --------------------------- |
| [CLAUDE.md](CLAUDE.md)                                             | Haupt-Projektdokumentation  |
| [docs/](docs/)                                                     | Detaillierte Dokumentation  |
| [docs/TECHNICAL_DEBT_ANALYSIS.md](docs/TECHNICAL_DEBT_ANALYSIS.md) | Technische Schulden-Analyse |
| [docs/QUALITY_ASSESSMENT.md](docs/QUALITY_ASSESSMENT.md)           | Qualitätsbewertung          |

## Entwicklung

### Pre-Commit Hook

Dieses Projekt verwendet einen Husky Pre-Commit Hook, der automatisch Linting und Formatierung auf staged Dateien ausführt, bevor ein Commit durchgeführt wird.

**Was passiert beim Commit:**

- Der Hook führt `npx lint-staged` aus
- ESLint prüft und korrigiert JavaScript/JSX-Dateien automatisch
- Prettier formatiert alle staged Dateien

**Wenn der Hook fehlschlägt:**

1. **Linting-Fehler beheben:**

   ```bash
   npm run lint:fix
   ```

   Dies führt ESLint mit automatischer Fehlerkorrektur aus.

2. **Manuelle Überprüfung:**

   ```bash
   npm run lint
   ```

   Zeigt alle Linting-Probleme ohne sie zu beheben.

3. **Hook im Notfall umgehen:**
   ```bash
   git commit --no-verify
   ```
   ⚠️ **Nur in Notfällen verwenden!** Dies überspringt alle Pre-Commit-Prüfungen.

**Häufige Probleme:**

- **Syntaxfehler:** Behebe JavaScript-Syntaxfehler manuell
- **Import-Probleme:** Stelle sicher, dass alle Imports korrekt sind
- **Prettier-Konflikte:** Führe `npx prettier --write .` aus, um alle Dateien zu formatieren
