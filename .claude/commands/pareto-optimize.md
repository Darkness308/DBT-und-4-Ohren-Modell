# Pareto-Optimierung mit Web-Recherche

Führe eine Pareto-Analyse durch und recherchiere moderne Web-Lösungen.

## Analyse-Modi

### STANDARD (80/20)
Identifiziere Lösungen, die mit **20% Aufwand 80% des Ergebnisses** liefern:
- Quick Wins (< 1 Stunde)
- Low-Hanging Fruits (< 1 Tag)
- High-Impact Changes (< 1 Woche)

### EXPANSIV (85/15)
Identifiziere Lösungen für **15% mehr Aufwand bei 85% Ergebnis**:
- Moderne Frameworks/Libraries
- Web Workers / Service Workers
- Build-Tool-Optimierungen
- Cloud/Edge-Lösungen

## Recherche-Bereiche

1. **Performance**
   - Bundler (Vite, esbuild, Turbopack)
   - State-Management (Zustand, Jotai, Valtio)
   - Rendering (React Server Components, Islands)

2. **Barrierefreiheit**
   - Testing-Tools (axe-core, Pa11y)
   - Component Libraries (Radix, React Aria)
   - Audit-Automatisierung

3. **Developer Experience**
   - TypeScript-Integration
   - Testing (Vitest, Playwright)
   - Linting/Formatting (Biome, oxlint)

4. **Offline/PWA**
   - Workbox Strategien
   - IndexedDB Wrapper (Dexie, idb)
   - Sync-Mechanismen

5. **Therapie-spezifisch**
   - Charting Libraries (für Emotionstracking)
   - Audio APIs (für Imaginationsübungen)
   - Encryption (für sensible Daten)

## Ausgabe-Format

```
┌─────────────────────────────────────────────────────────────┐
│ PARETO 80/20 - QUICK WINS                                   │
├─────────────────────────────────────────────────────────────┤
│ [Lösung] │ Aufwand │ Impact │ Code-Änderung               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PARETO 85/15 - EXPANSIVE OPTIMIERUNGEN                     │
├─────────────────────────────────────────────────────────────┤
│ [Tool/Framework] │ Zweck │ Integration │ Quelle           │
└─────────────────────────────────────────────────────────────┘
```

## Fokus-Bereich

$ARGUMENTS

Falls kein Bereich angegeben: Analysiere Performance, A11y, und DX.
