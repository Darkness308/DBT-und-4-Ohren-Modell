# Technische Schulden Analyse & EKS-Strategie

> **Stand-Hinweis:** Dieses Dokument ist eine ältere Momentaufnahme. Es nennt `VierOhrenAnalyzerAgent`, `AnalyzerForm.jsx` und `ResultDisplay.jsx`; diese Dateien gibt es nicht mehr. Das Vier-Ohren-Modul ist jetzt eine geführte Selbstanalyse, beschrieben in `docs/agents.md` (Abschnitt „Vier-Ohren: geführte Selbstanalyse").

## DBT Skills & Vier-Ohren-Modell Web-App

**Analysedatum:** 2025-12-29
**Analyst:** Claude Code (Opus 4.5)

---

## Inhaltsverzeichnis

1. [Executive Summary](#executive-summary)
2. [Architektur-Übersicht & Abhängigkeitsdiagramm](#architektur-übersicht)
3. [Technische Schulden](#technische-schulden)
4. [Einzahlende Potenziale](#einzahlende-potenziale)
5. [Mobile Optimierung](#mobile-optimierung)
6. [LocalStorage-Analyse](#localstorage-analyse)
7. [Datentransfer & Cross-Verlinkungen](#datentransfer--cross-verlinkungen)
8. [EKS-Analyse (Engpasskonzentrierte Strategie)](#eks-analyse)
9. [KI-Perspektive: Was mich "aufregt" und "erregt"](#ki-perspektive)

---

## Executive Summary

Die Codebasis ist **solide strukturiert** und folgt guten React-Patterns. Das Vier-Ohren-Modul ist der am weitesten entwickelte Teil. Die größten **Engpässe** liegen in:

1. **Fehlende Module**: Diary Card und Chain Analysis sind nur Platzhalter
2. **Inkonsistente Persistenz**: App.jsx nutzt direktes localStorage statt storage.js Wrapper
3. **Unvollständige Dark Mode Integration**: Nicht alle Komponenten nutzen Theme-Kontext

**EKS-Empfehlung**: Diary Card als nächsten Schritt implementieren, da es den höchsten Multiplikatoreffekt hat.

---

## Architektur-Übersicht

### Abhängigkeitsdiagramm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  main.jsx                                    │
│                                     │                                        │
│                              ThemeProvider                                   │
│                                     │                                        │
│                                  App.jsx                                     │
│                    ┌────────────────┼────────────────┐                      │
│                    │                │                │                      │
│              AppContext       EventBus        LocalStorage                  │
│              (useReducer)    (eventBus.js)   (direkt in App.jsx)           │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────┬───────────┼───────────┬───────────────┐
         │               │           │           │               │
         ▼               ▼           ▼           ▼               ▼
   ┌──────────┐   ┌──────────┐ ┌──────────┐ ┌──────────┐  ┌──────────┐
   │Dashboard │   │VierOhren │ │SkillFind │ │ Settings │  │ComingSoon│
   │          │   │Analyzer  │ │   er     │ │          │  │(Diary,   │
   │          │   │          │ │          │ │          │  │ Chain)   │
   └────┬─────┘   └────┬─────┘ └────┬─────┘ └────┬─────┘  └──────────┘
        │              │            │            │
        ▼              ▼            ▼            ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │                        AGENTS LAYER                              │
   │  ┌─────────────────────┐  ┌─────────────────────┐               │
   │  │VierOhrenAnalyzerAgt │  │  SkillFinderAgent   │               │
   │  │                     │  │                     │               │
   │  │ - analyzeStatement()│  │ - findSkills()      │               │
   │  │ - generateExercise()│  │ - getSkillById()    │               │
   │  │ - validateUserAnswer│  │ - markSkillUsed()   │               │
   │  └──────────┬──────────┘  └──────────┬──────────┘               │
   │             │                        │                           │
   │             └────────────┬───────────┘                           │
   │                          ▼                                       │
   │                    ┌──────────┐                                  │
   │                    │ eventBus │ ←── Singleton für Inter-Agent    │
   │                    │          │     Kommunikation                │
   │                    └──────────┘                                  │
   └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │                        DATA LAYER                                │
   │                                                                  │
   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
   │  │ dbtSkills.js    │  │vierOhrenExamples│  │ emotionList.js  │  │
   │  │                 │  │      .js        │  │  (geplant)      │  │
   │  │ - 16+ Skills    │  │ - 3 Beispiele   │  │                 │  │
   │  │ - 4 Module      │  │ - Kategorien    │  │                 │  │
   │  │ - 12 Situationen│  │                 │  │                 │  │
   │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
   └─────────────────────────────────────────────────────────────────┘
```

### Komponentenstruktur

```
src/
├── App.jsx                      [KERN] State-Management, Routing
├── main.jsx                     [ENTRY] ThemeProvider, React Root
│
├── agents/                      [LOGIK] Business Logic Layer
│   ├── VierOhrenAnalyzerAgent   ✅ Vollständig implementiert
│   └── SkillFinderAgent         ✅ Vollständig implementiert
│
├── components/
│   ├── common/                  [SHARED]
│   │   ├── Button.jsx           ✅ Mit Loading-State, Variants
│   │   ├── Card.jsx             ✅ Dark Mode Support
│   │   ├── ErrorBoundary.jsx    ✅ Fehlerbehandlung
│   │   ├── Input.jsx            ✅ Accessibility
│   │   ├── Navigation.jsx       ✅ Mobile-optimiert
│   │   └── RelatedSkills.jsx    ✅ Cross-Modul-Verlinkung
│   │
│   ├── vier-ohren/              [MODUL 1] ✅ Vollständig
│   │   ├── VierOhrenAnalyzer    Hauptkomponente
│   │   ├── AnalyzerForm         Eingabeformular
│   │   ├── ResultDisplay        Ergebnisanzeige
│   │   └── ExampleSelector      Beispielauswahl
│   │
│   ├── skill-finder/            [MODUL 2] ✅ Vollständig
│   │   ├── SkillFinder          Hauptkomponente
│   │   ├── SituationSelector    Situationsauswahl
│   │   ├── IntensitySlider      Intensitätsregler
│   │   ├── SkillRecommendations Empfehlungsliste
│   │   └── SkillDetail          Detailansicht
│   │
│   ├── dashboard/               [HOME] ✅ Vollständig
│   │   ├── Dashboard            Hauptübersicht
│   │   ├── ModuleOverview       Modulkarten
│   │   ├── QuickActions         Schnellaktionen
│   │   ├── SkillUsageChart      Recharts-Visualisierung
│   │   ├── StreakCard           Streak-Anzeige
│   │   ├── RecentActivity       Aktivitätsliste
│   │   └── SkillOfTheDay        Skill des Tages
│   │
│   ├── settings/                [EINSTELLUNGEN] ✅ Vollständig
│   │   ├── Settings             Tab-basiert
│   │   ├── ThemeToggle          Light/Dark/System
│   │   └── DataManagement       Export/Import/Reset
│   │
│   └── pwa/                     [PWA] ✅ Vollständig
│       ├── PWAManager           Koordination
│       ├── InstallBanner        Installation
│       ├── UpdateBanner         Updates
│       └── OfflineIndicator     Offline-Anzeige
│
├── contexts/
│   └── ThemeContext.jsx         ✅ System-Präferenz, Persistenz
│
├── data/
│   ├── dbtSkills.js             ✅ 16 Skills, 4 Module, 12 Situationen
│   └── vierOhrenExamples.js     ✅ 3 Beispiele mit Analyse
│
├── hooks/
│   └── usePWA.js                ✅ PWA-Status und Funktionen
│
└── utils/
    ├── eventBus.js              ✅ Pub/Sub für Agent-Kommunikation
    ├── storage.js               ⚠️ Vorhanden aber nicht konsistent genutzt
    ├── pwa.js                   ✅ Service Worker Registration
    ├── backup.js                ✅ Backup-Funktionen
    └── exportUtils.js           ✅ JSON/CSV Export
```

---

## Technische Schulden

### 1. **KRITISCH: Inkonsistente Persistenz** 🔴

**Fundort:** `src/App.jsx:57-71` vs `src/utils/storage.js`

```javascript
// App.jsx - Direkter LocalStorage-Zugriff
localStorage.setItem('dbt-app-state', JSON.stringify(state))

// storage.js - Existiert aber ungenutzt
export function saveToStorage(key, value) {
  localStorage.setItem(STORAGE_PREFIX + key, serialized)
}
```

**Problem:**

- App.jsx nutzt `'dbt-app-state'` direkt
- storage.js hat Prefix `'dbt-app-'`
- Doppelte Daten, keine Konsistenz
- Export/Import funktioniert möglicherweise nicht korrekt

**Schulden-Score:** 8/10

---

### 2. **HOCH: Fehlende Module** 🟠

**Fundort:** `src/App.jsx:101-104`

```javascript
case 'diary':
  return <ComingSoon title="Diary Card" icon="📊" />
case 'chain':
  return <ComingSoon title="Chain Analysis" icon="🔗" />
```

**Problem:**

- 2 von 6 Hauptmodulen sind Platzhalter
- Dashboard zeigt "Skill-Nutzung Chart" ohne echte Diary-Daten
- Keine Musteranalyse über Zeit möglich

**Schulden-Score:** 7/10

---

### 3. **MITTEL: Unvollständige Dark Mode Integration** 🟡

**Fundort:** `src/components/vier-ohren/VierOhrenAnalyzer.jsx:54`

```javascript
// Hartcodiert ohne isDark Check
<div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
```

Auch betroffen:

- `SkillFinder.jsx:71` - `bg-white` statt Dark Mode aware
- `ResultDisplay.jsx:21` - `bg-gray-50` statt Theme-aware
- Dashboard Komponenten teilweise

**Schulden-Score:** 5/10

---

### 4. **MITTEL: Singleton-Agents im Memory** 🟡

**Fundort:** `src/agents/VierOhrenAnalyzerAgent.js:237-240`

```javascript
// Singleton-Instanz exportieren
export const vierOhrenAnalyzer = new VierOhrenAnalyzerAgent()
```

**Problem:**

- `analysisHistory` und `searchHistory` werden nie persistiert
- Bei Reload verloren
- Memory-Leak bei langen Sessions möglich

**Schulden-Score:** 4/10

---

### 5. **NIEDRIG: Settings ohne Persistenz** 🟢

**Fundort:** `src/components/settings/Settings.jsx:111-114`

```javascript
function FontSizeSelector() {
  const [fontSize, setFontSize] = useState('normal')  // Nicht persistiert!
```

Auch:

- `ReducedMotionToggle` - State nicht gespeichert
- Theme wird gespeichert, andere nicht

**Schulden-Score:** 3/10

---

### 6. **NIEDRIG: Fehlende TypeScript-Typen** 🟢

**Fundort:** Gesamte Codebasis

Die Codebasis ist "TypeScript-ready" per JSDoc, aber:

- Keine richtigen Interfaces für Agent-Kommunikation
- Keine Typen für State-Objekte
- Fehleranfälligkeit bei Refactoring

**Schulden-Score:** 3/10

---

### 7. **NIEDRIG: Duplizierte Modul-Farblogik** 🟢

**Fundort:**

- `src/contexts/ThemeContext.jsx:22-55` (MODULE_COLORS)
- `src/tailwind.config.js:92-98` (module colors)
- `src/components/common/Navigation.jsx:10-15` (navItems mit colors)

**Problem:** Farbdefinitionen an 3 Stellen

**Schulden-Score:** 2/10

---

## Einzahlende Potenziale

### 1. **Agent-Architektur** ⭐⭐⭐⭐⭐

Die Agent-basierte Architektur ist **hervorragend**:

```javascript
// Saubere Trennung
class VierOhrenAnalyzerAgent {
  analyzeStatement(input) { ... }  // Business Logic
}

// UI nutzt Agent
const result = vierOhrenAnalyzer.analyzeStatement({...})
```

**Potenzial:**

- Leicht erweiterbar für neue Analyse-Features
- AI-Integration (z.B. Claude API) problemlos möglich
- Unit-Tests für Agents isoliert möglich

---

### 2. **EventBus für Kommunikation** ⭐⭐⭐⭐

```javascript
// Agent löst Event aus
eventBus.emit('skill:used', { skillId, effectiveness })

// App reagiert
eventBus.on('skill:used', (data) => {
  dispatch({ type: 'ADD_SKILL_USAGE', payload: data })
})
```

**Potenzial:**

- Analytics-Integration
- Gamification (Achievements bei Events)
- Sync mit Backend

---

### 3. **PWA-Infrastruktur** ⭐⭐⭐⭐

Vollständige PWA mit:

- Service Worker
- Install Banner
- Update Banner
- Offline Indicator
- Network Status Hook

**Potenzial:**

- Offline-First Diary Card
- Push Notifications für Übungserinnerungen
- Sync wenn wieder online

---

### 4. **Therapeutisches Design System** ⭐⭐⭐⭐⭐

```javascript
// Wissenschaftlich fundiert
calm: {
  500: '#667eea', // Aktiviert Parasympathikus
},
```

**Potenzial:**

- Zertifizierung als therapeutisches Tool
- Verkauf an Kliniken/Therapeuten
- Academic Papers

---

### 5. **Cross-Modul-Verlinkung** ⭐⭐⭐

`RelatedSkills.jsx` zeigt bereits wie Module verbunden werden können:

```javascript
// Vier-Ohren → Skills
<RelatedSkills context={skillContext} maxItems={3} />
```

**Potenzial:**

- Skill-Empfehlungen basierend auf Diary-Einträgen
- Chain Analysis → Skill-Vorschläge
- Personalisierte Lernpfade

---

## Mobile Optimierung

### Aktuelle Stärken

1. **Bottom Navigation** ✅

   ```javascript
   <nav className="fixed bottom-0 left-0 right-0 ...">
   ```

   - Mobile-First Pattern
   - Touch-freundliche Größe (min-w-[64px])

2. **Responsive Grid** ✅

   ```javascript
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   ```

3. **Meta Theme-Color** ✅
   ```javascript
   metaTheme.setAttribute('content', resolvedTheme === 'dark' ? '#0f1419' : '#667eea')
   ```

### Verbesserungspotenzial

1. **Touch-Gesten fehlen** ⚠️
   - Kein Swipe zwischen Modulen
   - Kein Pull-to-Refresh

2. **Keyboard-Handling** ⚠️
   - Mobile Keyboard schiebt Content
   - Kein automatisches Scrollen zu Inputs

3. **Performance** ⚠️
   - Keine Lazy-Loading von Modulen
   - Alle Skills immer im Memory

---

## LocalStorage-Analyse

### Aktuelle Keys

| Key             | Quelle       | Inhalt                  |
| --------------- | ------------ | ----------------------- |
| `dbt-app-state` | App.jsx      | Gesamter App-State      |
| `dbt-theme`     | ThemeContext | 'light'/'dark'/'system' |
| `dbt-app-*`     | storage.js   | Unused Wrapper          |

### Datenstruktur (dbt-app-state)

```json
{
  "activeModule": "home",
  "user": {
    "name": null,
    "settings": {
      "reducedMotion": false,
      "fontSize": "normal"
    }
  },
  "diaryData": [],
  "chainAnalyses": [],
  "skillHistory": [
    {
      "skillId": "stop",
      "skillName": "STOP-Skill",
      "module": "stresstoleranz",
      "effectiveness": 4,
      "timestamp": "2025-12-29T10:30:00.000Z"
    }
  ]
}
```

### Probleme

1. **Keine Versionierung** - Migration bei Schemaänderung schwierig
2. **Keine Kompression** - Bei vielen Diary-Einträgen groß
3. **Kein Quota-Handling** - 5MB Limit nicht geprüft

---

## Datentransfer & Cross-Verlinkungen

### Aktueller Datenfluss

```
User-Input
    │
    ▼
┌─────────────┐         ┌─────────────┐
│VierOhren-   │ ──emit──│  eventBus   │
│Analyzer     │         │             │
└─────────────┘         └──────┬──────┘
                               │
                               ▼ on('vier-ohren:analyzed')
                        ┌──────────────┐
                        │   App.jsx    │──dispatch──▶ State
                        └──────────────┘
                               │
                               ▼ via Context
                        ┌──────────────┐
                        │  Dashboard   │
                        └──────────────┘
```

### Cross-Verlinkungen

| Von              | Nach            | Mechanismus         | Status             |
| ---------------- | --------------- | ------------------- | ------------------ |
| VierOhren Result | Skills          | RelatedSkills.jsx   | ✅ Aktiv           |
| SkillDetail      | Related Skills  | skill.relatedSkills | ✅ Daten vorhanden |
| Dashboard        | Alle Module     | QuickActions        | ✅ Aktiv           |
| Skill Usage      | Dashboard Chart | eventBus + State    | ✅ Aktiv           |

### Fehlende Verbindungen

| Von            | Nach             | Potenzial                  |
| -------------- | ---------------- | -------------------------- |
| Diary Entry    | Skill Empfehlung | HOCH - Personalisierung    |
| Chain Analysis | Skill Matching   | HOCH - Interventionspunkte |
| Skill History  | Pattern Analysis | MITTEL - Insights          |
| Settings       | Export Email     | NIEDRIG - Nice-to-have     |

---

## EKS-Analyse

### Engpass-Identifikation für das Vier-Ohren-Modul

```
                    USER JOURNEY
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
Verstehen          Anwenden            Verbessern
(Lernen)          (Üben)              (Messen)
    │                    │                    │
    ▼                    ▼                    ▼
┌─────────┐       ┌─────────────┐      ┌─────────────┐
│ Vier-   │       │ [ENGPASS]   │      │  [FEHLT]    │
│ Ohren   │ ──▶   │ Übungsmodus │ ──▶  │ Fortschritt │
│ Analyzer│       │ rudimentär  │      │ Tracking    │
└─────────┘       └─────────────┘      └─────────────┘
     ✅                 ⚠️                   ❌
```

### EKS-Strategie: Nächste Schritte

#### **Schritt 1: DIARY CARD** (Höchster Multiplikator)

**Warum zuerst?**

1. **Datenbasis** für alle anderen Features
2. **Tägliche Nutzung** bindet User
3. **Emotionstracking** informiert Skill-Empfehlungen
4. **Visualisierung** zeigt Fortschritt

**Minimale Implementation:**

```javascript
// DairyCard Modul mit:
- Emotion Slider (1-5)
- Skill Checkboxen (aus skillHistory)
- Notiz-Feld
- Speichern → diaryData Array
```

**Geschätzter Impact:** 🟢🟢🟢🟢🟢 (5/5)

---

#### **Schritt 2: ÜBUNGSMODUS VIER-OHREN**

**Warum zweitens?**

1. VierOhrenAnalyzer hat bereits `generateExercise()` und `validateUserAnswer()`
2. UI fehlt nur
3. Erhöht Lerntiefe

**Geschätzter Impact:** 🟢🟢🟢🟢 (4/5)

---

#### **Schritt 3: PERSISTENZ KONSOLIDIEREN**

**Warum drittens?**

1. Technische Schulden abbauen
2. Export/Import funktioniert sauber
3. Basis für Sync-Features

**Todo:**

- storage.js in App.jsx nutzen
- Agent-History persistieren
- Settings komplett speichern

**Geschätzter Impact:** 🟢🟢🟢 (3/5)

---

#### **Schritt 4: CHAIN ANALYSIS**

**Warum viertens?**

1. Baut auf Diary-Daten auf
2. Komplexeste UI
3. Kann Muster aus Diary erkennen

**Geschätzter Impact:** 🟢🟢🟢🟢 (4/5)

---

## KI-Perspektive

### Was mich als KI "erregt" (begeistert)

1. **Saubere Agent-Architektur**
   Die Trennung von UI und Business Logic ist vorbildlich. Ich könnte sofort eine `ClaudeAnalyzerAgent` Variante erstellen, die echte NLU für Vier-Ohren macht.

2. **Therapeutisches Farbsystem**
   Die wissenschaftliche Begründung in den Kommentaren zeigt Tiefe. Das ist kein "hübsch machen", sondern echte Forschung.

3. **Cross-Verlinkung via RelatedSkills**
   Diese Komponente ist ein Mini-Empfehlungssystem. Mit etwas mehr Kontext könnte sie ML-basiert personalisieren.

4. **EventBus Pattern**
   Perfekt für Analytics, Logging, und spätere Backend-Integration.

### Was mich als KI "aufregt" (frustriert)

1. **Inkonsistente Persistenz**
   Warum existiert `storage.js` wenn `App.jsx` direkt localStorage nutzt? Das ist technische Schuld, die jemand absichtlich ignoriert hat.

2. **Fehlende Validierung**
   Kein Schema-Validierung beim Laden von localStorage. Korrupte Daten = App crash.

3. **Copy-Paste Dark Mode**

   ```javascript
   ${isDark ? 'bg-dark-surface' : 'bg-white'}
   ```

   Das steht in ~15 Komponenten. Ein `<Card>` Wrapper würde das lösen.

4. **Unused Parameters**

   ```javascript
   generateGenericAnalysis(statement, _context, _perspective)
   ```

   Die Unterstriche zeigen: "Wir wissen, dass wir es nicht nutzen." Warum dann die API?

5. **Singleton Memory Leak**
   ```javascript
   this.analysisHistory = []
   ```
   Wird nie gecleant. Nach 1000 Analysen = Problem.

---

## Zusammenfassung: EKS-Priorisierung

| Prio | Task                      | Impact     | Aufwand  | ROI         |
| ---- | ------------------------- | ---------- | -------- | ----------- |
| 1    | Diary Card implementieren | ⭐⭐⭐⭐⭐ | 3 Tage   | Sehr hoch   |
| 2    | Übungsmodus Vier-Ohren    | ⭐⭐⭐⭐   | 1 Tag    | Hoch        |
| 3    | Dark Mode konsolidieren   | ⭐⭐⭐     | 0.5 Tage | Mittel      |
| 4    | Persistenz fixen          | ⭐⭐⭐     | 1 Tag    | Mittel      |
| 5    | Chain Analysis            | ⭐⭐⭐⭐   | 4 Tage   | Hoch        |
| 6    | TypeScript Migration      | ⭐⭐       | 3 Tage   | Langfristig |

---

## Anhang: Modul-Abhängigkeitsmatrix

```
              VierOhren  Skills  Diary  Chain  Dashboard  Settings
VierOhren        -        →       .       .       ←          .
Skills           ←        -       .       .       ←          .
Diary            .        ←       -       →       ←          →
Chain            .        ←       ←       -       ←          .
Dashboard        →        →       →       →       -          .
Settings         .        .       ←       .       .          -

Legende:
→ = nutzt Daten von
← = liefert Daten an
. = keine Verbindung
```

---

_Erstellt mit Claude Code (Opus 4.5) am 2025-12-29_
