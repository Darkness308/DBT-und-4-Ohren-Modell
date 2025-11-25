# Agents System - DBT Skills & Vier-Ohren Web-App

## 🎯 Architektur-Übersicht

Die App verwendet eine **Agent-basierte Architektur**, bei der spezialisierte Sub-Agenten unterschiedliche therapeutische Module verwalten und vom Haupt-Agent orchestriert werden.

```
┌─────────────────────────────────────────────────────────────────┐
│                    AppOrchestrator (Haupt)                      │
│  - Koordiniert alle Sub-Agenten                                 │
│  - Verwaltet globalen State (User, Settings, History)           │
│  - Routing & Navigation                                         │
│  - Persistenz-Management                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌─────▼─────┐         ┌─────▼─────┐
   │ Analyse │          │ Training  │         │ Tracking  │
   │ Agents  │          │ Agents    │         │ Agents    │
   └─────────┘          └───────────┘         └───────────┘
        │                     │                     │
   ┌────┴────┐          ┌─────┴─────┐         ┌─────┴─────┐
   │         │          │           │         │           │
   ▼         ▼          ▼           ▼         ▼           ▼
VierOhren  Chain     Skill      Imagination Diary    Pattern
Analyzer   Analysis  Finder     Guide       Card     Recognition
Agent      Agent     Agent      Agent       Agent    Agent
```

---

## 🤖 Haupt-Agent

### **AppOrchestrator**

**Verantwortlichkeiten:**
- Koordination aller Sub-Agenten
- Globales State Management
- Routing zwischen Modulen
- Event-Bus für Agent-Kommunikation
- Persistenz (LocalStorage)
- Error-Handling & Recovery

**Technische Implementation:**
```jsx
// src/App.jsx - Main Orchestrator
import { createContext, useContext, useReducer, useEffect } from 'react'
import { eventBus } from './utils/eventBus'

const AppContext = createContext(null)

const initialState = {
  activeModule: 'home',
  user: {
    name: null,
    settings: {
      theme: 'light',
      reducedMotion: false,
      fontSize: 'normal'
    }
  },
  diaryData: [],
  chainAnalyses: [],
  skillHistory: []
}

function appReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, activeModule: action.payload }
    case 'UPDATE_SETTINGS':
      return { ...state, user: { ...state.user, settings: action.payload } }
    case 'ADD_DIARY_ENTRY':
      return { ...state, diaryData: [...state.diaryData, action.payload] }
    case 'ADD_CHAIN_ANALYSIS':
      return { ...state, chainAnalyses: [...state.chainAnalyses, action.payload] }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Persistenz laden
  useEffect(() => {
    const saved = localStorage.getItem('dbt-app-state')
    if (saved) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) })
    }
  }, [])

  // Persistenz speichern
  useEffect(() => {
    localStorage.setItem('dbt-app-state', JSON.stringify(state))
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Header />
      <Navigation />
      <MainContent />
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
```

**API:**
| Methode | Beschreibung |
|---------|--------------|
| `navigate(module)` | Navigation zu einem Modul |
| `updateSettings(settings)` | Benutzereinstellungen ändern |
| `saveState()` | Manuelles Speichern |
| `exportAllData()` | Alle Nutzerdaten exportieren |
| `resetApp()` | App zurücksetzen (mit Bestätigung) |

---

## 📊 Analyse-Agents

### 1. **VierOhrenAnalyzerAgent**

**Aufgabe:** Analyse von Aussagen nach dem Vier-Ohren-Modell (Schulz von Thun)

**Die vier Ebenen:**
| Ebene | Frage | Beispiel "Die Ampel ist grün" |
|-------|-------|-------------------------------|
| 🔵 **Sachebene** | Worüber informiere ich? | Die Ampelfarbe ist grün |
| 🟢 **Selbstoffenbarung** | Was gebe ich von mir preis? | Ich beobachte, bin aufmerksam/ungeduldig |
| 🟡 **Beziehungsebene** | Was halte ich vom anderen? | Du brauchst Hilfe / Du fährst zu langsam |
| 🔴 **Appellseite** | Wozu möchte ich veranlassen? | Fahr los! |

**Datenmodell:**
```javascript
// Eingabe
{
  statement: "Die Ampel ist grün.",
  context: "Partner sagt das während der Autofahrt",
  perspective: "receiver" // oder "sender"
}

// Ausgabe
{
  sachebene: {
    content: "Die Ampel zeigt grünes Licht",
    certainty: 0.95
  },
  selbstoffenbarung: {
    interpretations: [
      { text: "Ich beobachte die Ampel", likelihood: 0.7 },
      { text: "Ich habe es eilig", likelihood: 0.6 },
      { text: "Ich bin ungeduldig", likelihood: 0.4 }
    ]
  },
  beziehungsebene: {
    interpretations: [
      { text: "Ich helfe dir beim Fahren", likelihood: 0.5 },
      { text: "Du brauchst Hinweise", likelihood: 0.4 },
      { text: "Du fährst zu langsam", likelihood: 0.6 }
    ]
  },
  appellseite: {
    interpretations: [
      { text: "Fahr los!", likelihood: 0.8 },
      { text: "Achte auf die Ampel", likelihood: 0.5 }
    ]
  },
  potentialForMisunderstanding: 0.7,
  suggestions: [
    "Nachfragen: 'Meinst du, ich soll losfahren?'",
    "Perspektivwechsel: Wie könnte der Sender es gemeint haben?"
  ]
}
```

**Funktionen:**
| Funktion | Parameter | Rückgabe |
|----------|-----------|----------|
| `analyzeStatement(input)` | `{ statement, context?, perspective? }` | Analyse-Objekt |
| `getExamples(category)` | `string` (z.B. "alltag", "arbeit") | Array von Beispielen |
| `generateExercise(difficulty)` | `1-3` | Übungsaufgabe mit Lösung |
| `validateUserAnswer(exercise, answer)` | Übung + Nutzerantwort | Feedback-Objekt |

**Datei:** `src/agents/VierOhrenAnalyzerAgent.js`

---

### 2. **ChainAnalysisAgent**

**Aufgabe:** Interaktive Verhaltenskettenanalyse (DBT Chain Analysis)

**Ketten-Struktur:**
```
Vulnerabilität → Auslöser → [Gedanke → Gefühl → Körper → Impuls]* → Verhalten → Konsequenzen
```

**Datenmodell:**
```javascript
{
  id: "chain-2024-01-15-001",
  createdAt: "2024-01-15T14:30:00Z",
  
  targetBehavior: {
    description: "Ich habe mich selbst verletzt",
    severity: 4
  },
  
  vulnerabilities: [
    { type: "sleep", description: "Nur 4 Stunden geschlafen" },
    { type: "food", description: "Seit Mittag nichts gegessen" }
  ],
  
  promptingEvent: {
    description: "Freundin hat Treffen abgesagt",
    timestamp: "2024-01-15T18:00:00Z"
  },
  
  chain: [
    { type: "thought", content: "Sie will mich nicht sehen", intensity: 3 },
    { type: "emotion", content: "Traurigkeit, Angst", intensity: 4 },
    { type: "thought", content: "Niemand mag mich", intensity: 4 },
    { type: "urge", content: "Mich verletzen wollen", intensity: 5 },
    { type: "behavior", content: "Zum Messer gegriffen", intensity: 4 }
  ],
  
  consequences: {
    immediate: ["Kurze Erleichterung", "Dann Scham"],
    longTerm: ["Narben", "Freundin ist besorgt"]
  },
  
  interventionPoints: [
    { chainIndex: 0, skill: "Check the Facts", alternative: "Nachfragen warum" },
    { chainIndex: 3, skill: "TIPP", alternative: "Kaltes Wasser" }
  ]
}
```

**Funktionen:**
| Funktion | Beschreibung |
|----------|--------------|
| `createNewChain()` | Neue Chain-Analyse starten |
| `addChainLink(chainId, link)` | Kettenglied hinzufügen |
| `suggestInterventions(chain)` | Skill-Vorschläge für Interventionspunkte |
| `saveChain(chain)` | Chain speichern |
| `findPatterns(chains)` | Muster über mehrere Chains erkennen |

**Datei:** `src/agents/ChainAnalysisAgent.js`

---

## 🎓 Training-Agents

### 3. **SkillFinderAgent**

**Aufgabe:** Situationsbasierte Empfehlung passender DBT-Skills

**DBT-Module:**
| Modul | Farbe | Fokus |
|-------|-------|-------|
| 🧘 Achtsamkeit | Blau | Gegenwärtiger Moment, Wise Mind |
| 🆘 Stresstoleranz | Rot | Krisen überstehen, nicht verschlimmern |
| 💚 Emotionsregulation | Grün | Gefühle verstehen und steuern |
| 🤝 Zwischenmenschlich | Gelb | Effektive Kommunikation, Grenzen |

**Skill-Datenmodell:**
```javascript
{
  id: "tipp",
  name: "TIPP-Skills",
  module: "stresstoleranz",
  
  acronym: {
    T: "Temperatur (kaltes Wasser)",
    I: "Intensive Bewegung",
    P: "Paced Breathing",
    P: "Progressive Muskelentspannung"
  },
  
  whenToUse: [
    "Extreme emotionale Erregung",
    "Panikattacke",
    "Starker Drang zu selbstschädigendem Verhalten"
  ],
  
  steps: [
    {
      title: "Temperatur",
      instruction: "Halte dein Gesicht 30 Sekunden in kaltes Wasser",
      scienceNote: "Aktiviert den Tauchreflex, senkt Herzfrequenz"
    }
    // ...
  ],
  
  difficulty: 1,
  effectiveness: { acute: 5, longterm: 2 },
  tags: ["körperlich", "schnell", "krise"]
}
```

**Matching-Logik:**
```javascript
function matchSkills(situation) {
  const { crisisLevel, emotionIntensity, targetGoal } = situation
  
  // Akute Krise → Stresstoleranz priorisieren
  if (crisisLevel >= 4) {
    return [
      { skill: 'tipp', priority: 1 },
      { skill: 'stop', priority: 2 }
    ]
  }
  
  // Kommunikation → Interpersonelle Skills
  if (targetGoal === 'communicate') {
    return [
      { skill: 'dear-man', priority: 1 },
      { skill: 'give', priority: 2 }
    ]
  }
  
  // ...
}
```

**Datei:** `src/agents/SkillFinderAgent.js`

---

### 4. **ImaginationAgent**

**Aufgabe:** Geführte Imaginationsübungen abspielen

**Verfügbare Übungen:**
| Übung | Dauer | Ziel |
|-------|-------|------|
| 🏠 Sicherer Ort | 10 min | Stabilisierung, innere Zuflucht |
| 🌳 Baum-Meditation | 8 min | Verwurzelung, Standfestigkeit |
| 💡 Light Stream | 12 min | Körperliche Anspannung lösen |
| ☁️ Wolken-Übung | 5 min | Gedanken ziehen lassen |

**Datenmodell:**
```javascript
{
  id: "safe-place",
  name: "Sicherer Ort",
  duration: 600,
  
  script: [
    {
      text: "Atme tief ein... und langsam wieder aus...",
      pauseAfter: 5000
    },
    {
      text: "Stelle dir einen Ort vor, an dem du dich vollkommen sicher fühlst...",
      pauseAfter: 10000
    }
  ],
  
  audioFile: "/audio/safe-place-de.mp3",
  
  warnings: [
    "Bei Trauma kann diese Übung intensive Gefühle auslösen"
  ]
}
```

**Datei:** `src/agents/ImaginationAgent.js`

---

## 📈 Tracking-Agents

### 5. **DiaryCardAgent**

**Aufgabe:** Tägliches Emotions- und Skill-Tracking

**Tageseintrag:**
```javascript
{
  date: "2024-01-15",
  
  emotions: {
    sadness: 3,      // 0-5 Skala
    anger: 1,
    fear: 2,
    shame: 4,
    joy: 1
  },
  
  urges: {
    selfHarm: 2,
    substanceUse: 0,
    isolation: 4
  },
  
  skillsUsed: [
    { skillId: "tipp", effectiveness: 4 },
    { skillId: "opposite-action", effectiveness: 3 }
  ],
  
  sleep: { hours: 6, quality: 2 },
  mood: 3,
  notes: "Schwieriger Tag, aber durchgehalten"
}
```

**Visualisierungen:**
- 📊 Wochen-Verlauf (Liniendiagramm)
- 🥧 Emotions-Verteilung (Pie Chart)
- 📈 Skill-Nutzung (Bar Chart)
- 🔥 Streak-Anzeige (Tage in Folge)

**Datei:** `src/agents/DiaryCardAgent.js`

---

### 6. **PatternRecognitionAgent**

**Aufgabe:** Automatische Mustererkennung

**Erkennbare Muster:**
- Trigger-Ketten (z.B. "Schlafmangel → erhöhte Urges")
- Zyklen (z.B. wöchentliche Stimmungsschwankungen)
- Skill-Effektivität (z.B. "TIPP hilft bei Panik am besten")
- Fortschritt (z.B. "Urges nehmen ab über Zeit")

**Datei:** `src/agents/PatternRecognitionAgent.js`

---

## 🔄 Agent-Kommunikation

### Event-Bus

```javascript
// src/utils/eventBus.js
class EventBus {
  constructor() {
    this.events = {}
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(cb => cb(data))
    }
  }

  on(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = []
    this.events[eventName].push(callback)
    return () => this.off(eventName, callback)
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
    }
  }
}

export const eventBus = new EventBus()
```

### Event-Katalog

| Event | Payload | Beschreibung |
|-------|---------|--------------|
| `diary:entry-created` | `{ entryId, date }` | Neuer Diary-Eintrag |
| `skill:used` | `{ skillId, effectiveness }` | Skill wurde benutzt |
| `chain:completed` | `{ chainId }` | Chain-Analyse abgeschlossen |
| `imagination:started` | `{ exerciseId }` | Übung gestartet |
| `pattern:detected` | `{ patternId, type }` | Muster erkannt |

---

## 🚀 Best Practices

### 1. Single Responsibility
Jeder Agent hat **genau eine** klar definierte Aufgabe.

### 2. Loose Coupling
Agenten kommunizieren **nur über Events**.

### 3. Immutability
```javascript
// ❌ Schlecht
agent.data.push(newItem)

// ✅ Gut
agent.data = [...agent.data, newItem]
```

### 4. Therapeutischer Kontext
- Keine Diagnosen stellen
- Bei Krisen: Hinweis auf professionelle Hilfe
- Positive, ermutigende Sprache
- Datenschutz: Alles lokal

---

## 📚 Weitere Dokumentation

- [CLAUDE.md](../CLAUDE.md) - Projekt-Übersicht
- [Design System](./design-system.md) - UI/UX Guidelines
- [DBT-Skills Referenz](./dbt-skills-referenz.md) - Alle Skills
- [Vier-Ohren-Theorie](./vier-ohren-theorie.md) - Kommunikationsmodell
