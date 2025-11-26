# DBT-und-4-Ohren-Modell

Therapeutische Web-App: DBT-Skills (Dialektisch-Behaviorale Therapie) kombiniert mit dem Vier-Ohren-Modell. React + Tailwind, barrierefrei, offline-fähig. Diary Card, Skill-Finder, Chain Analysis, Imaginationsübungen.

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
