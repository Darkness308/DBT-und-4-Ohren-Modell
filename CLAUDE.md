# CLAUDE.md - CTMM Bonnie (Crisis & Therapeutic Management Module)

## 🎯 Projekt-Mission

**CTMM Bonnie** ist eine therapeutische Web-App für **Bonnie** - eine Begleiterin in Krisen und im Alltag. **Clyde** ist der digitale Guide, der Bonnie durch schwierige Momente navigiert.

Die App verbindet:

- **DBT-Skills** (Dialektisch-Behaviorale Therapie)
- **Vier-Ohren-Modell** nach Schulz von Thun
- **Stress-adaptives UI** mit Notfall-Modus
- **Neuro-Framing** (neurobiologische Erklärungen)

---

## 🧭 Clyde - Der digitale Begleiter

Clyde spricht direkt zu Bonnie. Seine Stimme ist:

- **Direkt**: Klare, kurze Sätze
- **Erklärend**: Neurobiologische Zusammenhänge
- **Begleitend**: "Wir machen das zusammen"
- **Nordstern**: Gibt Orientierung in Krisen

**VERBOTEN:**

- "Ich will dir helfen" (triggert Scham)
- "Du musst" (erzeugt Druck)
- Übernahme-Sprache

---

## 📚 Dokumentation

| Datei                             | Inhalt                                |
| --------------------------------- | ------------------------------------- |
| `docs/agents.md`                  | Agent-Architektur & Spezifikationen   |
| `docs/design-system.md`           | UI/UX Guidelines, Farben, Komponenten |
| `docs/dbt-skills-referenz.md`     | Alle DBT-Skills mit Erklärungen       |
| `docs/vier-ohren-theorie.md`      | Kommunikationsmodell-Grundlagen       |
| `docs/TECHNICAL_DEBT_ANALYSIS.md` | Technische Schulden & EKS-Strategie   |
| `docs/QUALITY_ASSESSMENT.md`      | 10-Dimensionen Qualitätsbewertung     |
| `docs/PARETO_OPTIMIZATION.md`     | 80/20 & 85/15 Optimierungsguide       |

---

## 🤖 Claude Code Slash Commands

Verfügbare Befehle in `.claude/commands/`:

| Befehl             | Beschreibung                           | Beispiel                       |
| ------------------ | -------------------------------------- | ------------------------------ |
| `/analyze-quality` | 10-Dimensionen Qualitätsanalyse        | `/analyze-quality src/modules` |
| `/pareto-optimize` | Pareto-Optimierungen mit Web-Recherche | `/pareto-optimize performance` |
| `/deep-analyze`    | Tiefenanalyse mit Präzisionsgraden     | `/deep-analyze deep src/core`  |

---

## 🏗️ Architektur-Übersicht

### Tech-Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **State**: React Context + useReducer
- **Haptics**: Web Vibration API
- **Storage**: LocalStorage
- **PWA**: Service Worker ready

### Modul-basierte Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    App.jsx (Orchestrator)                   │
│  - Navigation, State, Event-Bus                             │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼────┐         ┌─────▼─────┐        ┌─────▼─────┐
    │  CORE   │         │  MODULES  │        │COMPONENTS │
    │ System  │         │  Feature  │        │  Shared   │
    └─────────┘         └───────────┘        └───────────┘
         │                    │                    │
    ┌────┴────┐         ┌─────┴─────┐        ┌─────┴─────┐
    │         │         │           │        │           │
    ▼         ▼         ▼           ▼        ▼           ▼
  Clyde   Haptics   VierOhren   DBT-Skills  Button    Card
  EventBus Storage  Dashboard   Emergency   Tooltip   BioWave
```

---

## 📁 Projektstruktur (NEU)

```
/ctmm-bonnie/
├── CLAUDE.md                     # Diese Datei
├── package.json
├── vite.config.js
├── tailwind.config.js
│
├── docs/                         # Dokumentation
│
├── src/
│   ├── main.jsx                  # Entry Point
│   ├── App.jsx                   # Haupt-Orchestrator
│   ├── index.css                 # Globale Styles + Clyde/Emergency
│   │
│   ├── core/                     # 🔧 KERN-SYSTEM
│   │   ├── clyde.js              # Clyde Voice, Stress-Levels, Neuro-Framing
│   │   ├── haptics.js            # Web Vibration API Patterns
│   │   ├── eventBus.js           # Inter-Modul-Kommunikation
│   │   ├── storage.js            # LocalStorage Wrapper
│   │   └── useHaptics.js         # React Hook für Haptics
│   │
│   ├── modules/                  # 📦 FEATURE-MODULE
│   │   ├── vier-ohren/           # Kommunikations-Analyse
│   │   │   ├── VierOhrenAnalyzer.jsx
│   │   │   ├── VierOhrenAnalyzerAgent.js
│   │   │   ├── AnalyzerForm.jsx
│   │   │   ├── ResultDisplay.jsx
│   │   │   ├── ExampleSelector.jsx
│   │   │   └── vierOhrenExamples.js
│   │   │
│   │   ├── dbt-skills/           # DBT Skill-Finder
│   │   │   ├── SkillFinder.jsx
│   │   │   ├── SkillFinderAgent.js
│   │   │   ├── SkillDetail.jsx
│   │   │   ├── SkillRecommendations.jsx
│   │   │   ├── SituationSelector.jsx
│   │   │   ├── IntensitySlider.jsx
│   │   │   └── dbtSkills.js
│   │   │
│   │   ├── dashboard/            # Dashboard & Übersicht
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ModuleOverview.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── SkillOfTheDay.jsx
│   │   │   ├── SkillUsageChart.jsx
│   │   │   └── StreakCard.jsx
│   │   │
│   │   ├── diary-card/           # Diary Card (Tägliches Tracking)
│   │   │   ├── DiaryCard.jsx
│   │   │   ├── DiaryCardAgent.js
│   │   │   ├── EmotionSlider.jsx
│   │   │   ├── UrgeTracker.jsx
│   │   │   ├── SkillLogger.jsx
│   │   │   └── DayOverview.jsx
│   │   │
│   │   ├── chain-analysis/       # Verhaltenskettenanalyse
│   │   │   ├── ChainAnalysis.jsx
│   │   │   ├── ChainAnalysisAgent.js
│   │   │   ├── AnalysisList.jsx
│   │   │   └── steps/            # 6-Schritt Wizard
│   │   │       ├── VulnerabilityStep.jsx
│   │   │       ├── TriggerStep.jsx
│   │   │       ├── ChainLinksStep.jsx
│   │   │       ├── ProblemBehaviorStep.jsx
│   │   │       ├── ConsequencesStep.jsx
│   │   │       └── SolutionsStep.jsx
│   │   │
│   │   └── emergency/            # Notfall-UI
│   │       └── EmergencyOverlay.jsx
│   │
│   ├── components/               # 🎨 SHARED COMPONENTS
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ClydeMessage.jsx  # Clyde Sprechblasen
│   │   │   ├── Tooltip.jsx       # Schüler-Erklärungen
│   │   │   ├── StressIndicator.jsx
│   │   │   ├── BioWave.jsx       # Stress-Visualisierung
│   │   │   └── RelatedSkills.jsx
│   │   │
│   │   ├── settings/
│   │   │   ├── Settings.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── HapticsToggle.jsx
│   │   │   └── DataManagement.jsx
│   │   │
│   │   └── pwa/
│   │       ├── PWAManager.jsx
│   │       ├── InstallBanner.jsx
│   │       ├── UpdateBanner.jsx
│   │       └── OfflineIndicator.jsx
│   │
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   └── usePWA.js
│   │
│   └── utils/                    # Legacy (wird migriert)
│       ├── backup.js
│       ├── exportUtils.js
│       └── pwa.js
│
└── .claude/commands/             # Slash Commands
    ├── analyze-quality.md
    ├── pareto-optimize.md
    └── deep-analyze.md
```

---

## 🚦 Stress-Level System

| Level  | Range   | Farbe     | Clyde-Modus |
| ------ | ------- | --------- | ----------- |
| GREEN  | 0-30%   | `success` | Standard    |
| YELLOW | 31-60%  | `warning` | Aufmerksam  |
| ORANGE | 61-80%  | `orange`  | Vereinfacht |
| RED    | 81-100% | `error`   | Notfall-UI  |

Bei **RED (>90%)**: EmergencyOverlay wird aktiv mit TIPP-Skills.

---

## 🧠 Neuro-Framing

Clyde erklärt neurobiologische Zusammenhänge:

```javascript
clyde.neuro.wut = {
  trigger: '🔥 Wut / Hass',
  mode: 'Kampf-Modus',
  simple: 'Energie muss raus. Nicht denken.',
  complex: 'Deine Amygdala meldet "Bedrohung"...',
}
```

**Ziel**: "Das ist Gehirnchemie, kein Charakterfehler."

---

## 📳 Haptics System

Therapeutische Vibrationsmuster (Web Vibration API):

| Pattern        | Funktion                      |
| -------------- | ----------------------------- |
| `calmPulse`    | Beruhigender Einzelimpuls     |
| `heartbeat`    | Langsamer Herzschlag (50 BPM) |
| `wave`         | Ansteigende/abfallende Welle  |
| `breatheCycle` | 4-4-6 Atem-Begleitung         |

---

## 🚀 Entwicklungs-Befehle

```bash
npm install          # Installation
npm run dev          # Entwicklung
npm run build        # Produktion
npm run lint         # Linting
```

---

## 📊 Status & Roadmap

### Phase 1: Foundation ✅

- [x] Projekt-Setup (Vite + React + Tailwind)
- [x] Basis-Komponenten
- [x] Vier-Ohren-Analyzer
- [x] Skill-Finder

### Phase 2: Clyde System ✅

- [x] Clyde Voice Guidelines
- [x] Stress-Level Tracking
- [x] Emergency Overlay
- [x] Neuro-Framing
- [x] Cognitive Load Tracking

### Phase 3: Sensorik ✅

- [x] Haptics Module (Web Vibration API)
- [x] BioWave Visualisierung
- [x] Stress-adaptive UI

### Phase 4: Konsolidierung ✅

- [x] Modul-basierte Architektur
- [x] Core/Modules/Components Trennung
- [x] Import-Pfade bereinigt

### Phase 5: Erweiterungen

- [x] Digitale Diary Card (Emotionen, Urges, Skills, Stats)
- [x] Chain Analysis Tool (6-Schritt Wizard: Vulnerabilität, Trigger, Kette, Verhalten, Konsequenzen, Lösungen)
- [ ] Imaginations-Übungen mit Audio
- [ ] DEAR MAN Trainer

---

## 🔗 Referenzen

- **DBT Skills Training**: Linehan, M. (2015). DBT Skills Training Manual
- **Vier-Ohren-Modell**: Schulz von Thun, F. (1981). Miteinander reden
- **Apollo Neuroscience**: Vagus-Stimulation Forschung
- **React Best Practices**: https://react.dev
