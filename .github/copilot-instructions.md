# GitHub Copilot Instructions - DBT & Vier-Ohren App

## Projekt-Kontext

Dies ist eine **therapeutische Web-App** für DBT-Skills und das Vier-Ohren-Modell.
Die App hilft Menschen bei Emotionsregulation und Kommunikationsanalyse.

## Architektur

```
┌─────────────────────────────────────────────────────────┐
│              AppOrchestrator (App.jsx)                  │
│  - React Context für globalen State                     │
│  - Event-Bus für Agent-Kommunikation                    │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐     ┌───────────┐    ┌───────────┐
    │ Agents  │     │Components │    │   Data    │
    │ /agents │     │/components│    │  /data    │
    └─────────┘     └───────────┘    └───────────┘
```

## Code-Stil Regeln

### React Components
- **Functional Components** mit Hooks (keine Class Components)
- **Named exports** für Komponenten
- Props mit Destructuring
- JSDoc-Kommentare für öffentliche Funktionen

```jsx
// ✅ Richtig
export default function Button({ variant = 'primary', children, onClick }) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}

// ❌ Falsch
class Button extends React.Component { ... }
```

### State Management
- React Context + useReducer für globalen State
- Lokaler State mit useState
- Event-Bus für Agent-zu-Agent Kommunikation

```javascript
// Event-Bus Pattern
eventBus.emit('skill:used', { skillId, effectiveness })
eventBus.on('skill:used', (data) => { ... })
```

### Styling
- **TailwindCSS** für alle Styles
- Therapeutische Farbpalette aus `tailwind.config.js`
- Keine Inline-Styles außer für dynamische Werte

```jsx
// ✅ Richtig
<div className="bg-calm-50 rounded-xl p-4">

// ❌ Falsch
<div style={{ backgroundColor: '#e0e7ff' }}>
```

### Accessibility
- Alle Inputs brauchen Labels
- ARIA-Attribute für interaktive Elemente
- Focus-States sichtbar
- prefers-reduced-motion respektieren

```jsx
<button
  aria-label="Skill als verwendet markieren"
  className="focus:ring-2 focus:ring-calm-500"
>
```

## Therapeutischer Kontext

### Do's
- Ermutigende, positive Sprache
- Validierung von Gefühlen
- Hinweise auf professionelle Hilfe bei Krisen
- Datenschutz: Alles lokal speichern

### Don'ts
- Keine Diagnosen stellen
- Keine wertende Sprache
- Keine Auto-Play für Medien
- Keine alarmierenden Farben (Rot nur für echte Krisen)

## Datei-Struktur

```
src/
├── agents/           # Business Logic (Agent-Pattern)
├── components/
│   ├── common/       # Wiederverwendbare UI-Komponenten
│   ├── vier-ohren/   # Vier-Ohren-Modul
│   ├── skill-finder/ # Skill-Finder-Modul
│   ├── dashboard/    # Dashboard-Komponenten
│   └── [modul]/      # Weitere Module
├── data/             # Statische Daten (Skills, Beispiele)
├── utils/            # Hilfsfunktionen
└── hooks/            # Custom React Hooks
```

## Wichtige Dateien

- `CLAUDE.md` - Haupt-Projektdokumentation
- `docs/agents.md` - Agent-Spezifikationen
- `docs/design-system.md` - UI/UX Guidelines
- `docs/dbt-skills-referenz.md` - DBT-Skills Referenz

## Beispiel-Patterns

### Neuer Agent
```javascript
// src/agents/NewAgent.js
import eventBus from '../utils/eventBus'

class NewAgent {
  constructor() {
    this.data = []
  }

  doSomething(input) {
    // Logic
    eventBus.emit('new:event', { data })
    return result
  }
}

export const newAgent = new NewAgent()
export default newAgent
```

### Neue Komponente
```jsx
// src/components/module/NewComponent.jsx
import { useState } from 'react'
import Button from '../common/Button'

export default function NewComponent({ data, onAction }) {
  const [state, setState] = useState(null)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      {/* Content */}
    </div>
  )
}
```

## Tests

```javascript
// tests/agents/NewAgent.test.js
import { describe, it, expect } from 'vitest'
import { newAgent } from '../../src/agents/NewAgent'

describe('NewAgent', () => {
  it('should do something', () => {
    const result = newAgent.doSomething(input)
    expect(result).toBeDefined()
  })
})
```
