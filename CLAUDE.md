# CLAUDE.md - DBT Skills & Vier-Ohren-Modell Web-App

## 🎯 Projekt-Mission

Eine therapeutische Web-App, die **DBT-Skills** (Dialektisch-Behaviorale Therapie) mit dem **Vier-Ohren-Modell** nach Schulz von Thun verbindet. Ziel: Nutzerfreundliche Tools für Emotionsregulation und Kommunikationsanalyse.

---

## 📚 Dokumentation

| Datei | Inhalt |
|-------|--------|
| `docs/agents.md` | Agent-Architektur & Spezifikationen |
| `docs/design-system.md` | UI/UX Guidelines, Farben, Komponenten |
| `docs/dbt-skills-referenz.md` | Alle DBT-Skills mit Erklärungen |
| `docs/vier-ohren-theorie.md` | Kommunikationsmodell-Grundlagen |

---

## 🏗️ Architektur-Übersicht

### Tech-Stack
- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **State**: React Context + useReducer
- **Charts**: Chart.js / Recharts
- **Storage**: LocalStorage (später: Backend-Integration)
- **Audio**: Web Audio API (für Imaginationsübungen)

### Agent-basierte Architektur

```
┌─────────────────────────────────────────────────────────┐
│              AppOrchestrator (Haupt-Agent)              │
│  - Koordiniert alle Module                              │
│  - Globaler State (User-Daten, Einstellungen)           │
│  - Navigation & Routing                                 │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌─────▼─────┐    ┌─────▼─────┐
    │ Analyse │     │ Training  │    │ Tracking  │
    │ Agents  │     │ Agents    │    │ Agents    │
    └─────────┘     └───────────┘    └───────────┘
         │                │                │
    ┌────┴────┐     ┌─────┴─────┐    ┌─────┴─────┐
    │         │     │           │    │           │
    ▼         ▼     ▼           ▼    ▼           ▼
 VierOhren  Chain  SkillFinder Imagi- Diary   Pattern
 Analyzer   Analy- Agent      nation  Card    Recog-
 Agent      sisAgt            Agent   Agent   nition
```

---

## 📦 Module & Features

### Modul 1: Vier-Ohren-Analyzer
**Agent**: `VierOhrenAnalyzerAgent`
- Nutzer gibt Aussage ein
- App analysiert alle 4 Ebenen (Sach, Selbstoffenbarung, Beziehung, Appell)
- Zeigt mögliche Interpretationen
- Übungsaufgaben mit Feedback

### Modul 2: DBT-Skill-Finder
**Agent**: `SkillFinderAgent`
- Situation beschreiben (Freitext oder geführt)
- Matching-Algorithmus für passende Skills
- Kategorisiert nach: Achtsamkeit, Stresstoleranz, Emotionsregulation, Zwischenmenschliche Effektivität
- Skill-Details mit Übungsanleitungen

### Modul 3: Chain Analysis Tool
**Agent**: `ChainAnalysisAgent`
- Interaktive Verhaltensketten-Analyse
- Schritt-für-Schritt: Trigger → Gedanken → Gefühle → Verhalten → Konsequenzen
- Identifikation von Interventionspunkten
- Speicherung & Musteranalyse

### Modul 4: Digitale Diary Card
**Agent**: `DiaryCardAgent`
- Tägliches Tracking: Emotionen (0-5 Skala)
- Genutzte Skills protokollieren
- Problematische Verhaltensweisen tracken
- Visualisierung über Zeit (Charts)
- Export für Therapeuten

### Modul 5: Imaginations-Übungen
**Agent**: `ImaginationAgent`
- Audio-geführte Übungen
- Safe Place / Sicherer Ort
- Baum-Meditation
- Light Stream Technik
- Timer & Fortschrittsanzeige

### Modul 6: DEAR MAN Trainer
**Agent**: `DearManAgent`
- Interaktiver Kommunikations-Trainer
- Schritt-für-Schritt durch DEAR MAN
- Beispiel-Dialoge
- Eigene Szenarien erstellen & üben

---

## 🎨 Design-Prinzipien

Siehe `docs/design-system.md` für Details.

**Kernprinzipien:**
- **Beruhigend**: Sanfte Farben, keine grellen Akzente
- **Klar**: Einfache Navigation, wenig kognitive Last
- **Ermutiternd**: Positive Formulierungen, Fortschrittsanzeigen
- **Barrierefrei**: WCAG AA konform, Screen-Reader-optimiert

**Farbpalette (Therapeutisch angepasst):**
- Primary: `#667eea` (beruhigendes Blau-Violett)
- Success: `#22c55e` (sanftes Grün für Erfolge)
- Warning: `#f59e0b` (warmes Orange, nicht alarmierend)
- Calm: `#e0e7ff` (helles Indigo für Hintergründe)

---

## 📁 Projektstruktur

```
/dbt-vier-ohren-app/
├── CLAUDE.md                     # Diese Datei
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
│
├── docs/
│   ├── agents.md                 # Agent-Spezifikationen
│   ├── design-system.md          # UI/UX Guidelines
│   ├── dbt-skills-referenz.md    # DBT-Skills Dokumentation
│   └── vier-ohren-theorie.md     # Kommunikationsmodell
│
├── src/
│   ├── main.jsx                  # Entry Point
│   ├── App.jsx                   # Haupt-Orchestrator
│   ├── index.css                 # Globale Styles
│   │
│   ├── agents/                   # Agent-Implementierungen
│   │   ├── VierOhrenAnalyzerAgent.js
│   │   ├── SkillFinderAgent.js
│   │   ├── ChainAnalysisAgent.js
│   │   ├── DiaryCardAgent.js
│   │   ├── ImaginationAgent.js
│   │   └── DearManAgent.js
│   │
│   ├── components/
│   │   ├── common/               # Shared Components
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Navigation.jsx
│   │   │
│   │   ├── vier-ohren/           # Vier-Ohren-Modul
│   │   │   ├── AnalyzerForm.jsx
│   │   │   ├── ResultDisplay.jsx
│   │   │   └── ExerciseMode.jsx
│   │   │
│   │   ├── skill-finder/         # Skill-Finder-Modul
│   │   │   ├── SituationInput.jsx
│   │   │   ├── SkillRecommendations.jsx
│   │   │   └── SkillDetail.jsx
│   │   │
│   │   ├── chain-analysis/       # Chain-Analysis-Modul
│   │   │   ├── ChainBuilder.jsx
│   │   │   ├── ChainVisualization.jsx
│   │   │   └── InterventionSuggestions.jsx
│   │   │
│   │   ├── diary-card/           # Diary-Card-Modul
│   │   │   ├── DailyEntry.jsx
│   │   │   ├── SkillTracker.jsx
│   │   │   ├── EmotionSlider.jsx
│   │   │   └── WeeklyChart.jsx
│   │   │
│   │   └── imagination/          # Imaginations-Modul
│   │       ├── ExercisePlayer.jsx
│   │       ├── SafePlaceGuide.jsx
│   │       └── ProgressTimer.jsx
│   │
│   ├── data/
│   │   ├── dbtSkills.js          # Alle DBT-Skills als Daten
│   │   ├── vierOhrenExamples.js  # Beispiele für Vier-Ohren
│   │   ├── emotionList.js        # Emotionswortschatz
│   │   └── imaginationScripts.js # Übungs-Skripte
│   │
│   ├── utils/
│   │   ├── eventBus.js           # Agent-Kommunikation
│   │   ├── storage.js            # LocalStorage Wrapper
│   │   ├── skillMatcher.js       # Skill-Matching-Logik
│   │   └── exportUtils.js        # Daten-Export
│   │
│   └── hooks/
│       ├── useAgent.js           # Agent-Hook
│       ├── useDiaryCard.js       # Diary-Card-Hook
│       └── useLocalStorage.js    # Persistenz-Hook
│
├── public/
│   ├── audio/                    # Imaginations-Audios
│   └── images/                   # Icons, Grafiken
│
└── tests/
    ├── agents/                   # Agent-Tests
    └── components/               # Component-Tests
```

---

## 🚀 Entwicklungs-Befehle

```bash
# Installation
npm install

# Entwicklung starten
npm run dev

# Build für Produktion
npm run build

# Tests ausführen
npm run test

# Linting
npm run lint
```

---

## 🔧 Entwicklungs-Richtlinien

### Code-Stil
- **Functional Components** mit Hooks (keine Class Components)
- **TypeScript-ready** (JSDoc für jetzt, später TS-Migration möglich)
- **Keine externen UI-Libraries** außer TailwindCSS
- **Accessibility first**: Alle Komponenten mit ARIA-Labels

### Agent-Entwicklung
1. Jeder Agent in eigener Datei unter `src/agents/`
2. Klare Schnittstellen definieren (siehe `docs/agents.md`)
3. Event-Bus für Inter-Agent-Kommunikation
4. State-Isolation: Agenten mutieren nie globalen State direkt

### Commit-Konventionen
```
feat: Neue Funktion hinzugefügt
fix: Bugfix
docs: Dokumentation aktualisiert
style: Formatierung (kein Code-Change)
refactor: Code-Refactoring
test: Tests hinzugefügt/geändert
```

---

## ⚠️ Wichtige Hinweise für Claude Code

### Therapeutischer Kontext
- Diese App ist für **Selbsthilfe und Therapie-Begleitung**
- Keine Diagnosen stellen
- Bei Krisen-Features: Immer Hinweis auf professionelle Hilfe
- Trigger-Warnungen bei sensiblen Übungen

### Datenschutz
- Alle Daten lokal speichern (LocalStorage)
- Keine Analytics ohne Consent
- Export-Funktion für Nutzer-Autonomie

### Barrierefreiheit
- Alle Inputs mit Labels
- Fokus-Management bei Modals
- Reduzierte Bewegung respektieren (`prefers-reduced-motion`)
- Ausreichende Kontraste (4.5:1 minimum)

---

## 📊 Status & Roadmap

### Phase 1: MVP (aktuell)
- [ ] Projekt-Setup (Vite + React + Tailwind)
- [ ] Basis-Komponenten (Card, Button, Navigation)
- [ ] Vier-Ohren-Analyzer (Kernfunktion)
- [ ] Skill-Finder (Basis-Version)

### Phase 2: Core Features
- [ ] Chain Analysis Tool
- [ ] Digitale Diary Card
- [ ] LocalStorage-Persistenz

### Phase 3: Erweiterungen
- [ ] Imaginations-Übungen mit Audio
- [ ] DEAR MAN Trainer
- [ ] Muster-Erkennung über Zeit
- [ ] Export-Funktionen (PDF, CSV)

### Phase 4: Polish
- [ ] Onboarding-Flow
- [ ] Einstellungen & Personalisierung
- [ ] PWA-Unterstützung
- [ ] Accessibility-Audit

---

## 🔗 Referenzen

- **DBT Skills Training**: Linehan, M. (2015). DBT Skills Training Manual
- **Vier-Ohren-Modell**: Schulz von Thun, F. (1981). Miteinander reden
- **React Best Practices**: https://react.dev
- **TailwindCSS**: https://tailwindcss.com/docs
