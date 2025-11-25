# Design System - DBT Skills & Vier-Ohren Web-App

## 🎯 Design-Philosophie

Diese App ist für Menschen in **therapeutischen Kontexten** gedacht. Das Design muss:
- **Beruhigend** wirken, nicht stimulierend
- **Klar** und einfach navigierbar sein
- **Ermutigend** statt bewertend kommunizieren
- **Barrierefrei** für alle Nutzer sein

---

## 🎨 Farbpalette

### Therapeutische Primärfarben
| Farbe | Hex | Verwendung |
|-------|-----|------------|
| **Calm Blue** | `#667eea` | Navigation, Headers, Primary Actions |
| **Soft Purple** | `#8b5cf6` | Gradients, Highlights, Hover States |
| **Warm Indigo** | `#6366f1` | Tiefe, Stabilität, Fokus |

### DBT-Modul-Farben
| Modul | Farbe | Hex |
|-------|-------|-----|
| 🧘 Achtsamkeit | Blau | `#3b82f6` |
| 🆘 Stresstoleranz | Koralle | `#f97316` |
| 💚 Emotionsregulation | Grün | `#22c55e` |
| 🤝 Zwischenmenschlich | Gelb | `#eab308` |

### Vier-Ohren-Farben
| Ebene | Farbe | Hex |
|-------|-------|-----|
| 🔵 Sachebene | Blau | `#3b82f6` |
| 🟢 Selbstoffenbarung | Grün | `#22c55e` |
| 🟡 Beziehung | Gelb | `#eab308` |
| 🔴 Appell | Rot | `#ef4444` |

### Semantische Farben
- **Success**: `#22c55e` - Fortschritt, Abschluss, Ermutigung
- **Warning**: `#f59e0b` - Aufmerksamkeit (nicht alarmierend!)
- **Info**: `#3b82f6` - Hinweise, Tipps
- **Crisis**: `#ef4444` - Nur für echte Krisen (sehr sparsam!)

### Grauskala
| Name | Hex | Verwendung |
|------|-----|------------|
| Gray 50 | `#f9fafb` | Hintergründe |
| Gray 100 | `#f3f4f6` | Card-Hintergründe |
| Gray 200 | `#e5e7eb` | Borders |
| Gray 500 | `#6b7280` | Placeholder-Text |
| Gray 700 | `#374151` | Sekundärer Text |
| Gray 900 | `#111827` | Haupttext |

### Gradients
```css
/* Beruhigender Header-Gradient */
--gradient-calm: linear-gradient(135deg, #667eea 0%, #8b5cf6 100%);

/* Erfolgs-Gradient */
--gradient-success: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

/* Sanfter Hintergrund */
--gradient-subtle: linear-gradient(180deg, #f9fafb 0%, #e0e7ff 100%);
```

---

## 📐 Spacing System

| Token | Wert | Tailwind | Verwendung |
|-------|------|----------|------------|
| xs | 4px | `p-1` | Icon-Abstände |
| sm | 8px | `p-2` | Kleine Gaps |
| md | 16px | `p-4` | Standard |
| lg | 24px | `p-6` | Komponenten-Padding |
| xl | 32px | `p-8` | Sektion-Abstände |
| 2xl | 48px | `p-12` | Große Trennung |

---

## 📝 Typografie

### Schriftart
System Font Stack für optimale Lesbarkeit:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

### Schriftgrößen
| Element | Größe | Tailwind | Gewicht |
|---------|-------|----------|---------|
| H1 (Titel) | 36px | `text-4xl` | 700 |
| H2 (Sektionen) | 30px | `text-3xl` | 600 |
| H3 (Cards) | 24px | `text-2xl` | 600 |
| H4 (Unter-Titel) | 20px | `text-xl` | 500 |
| Body | 16px | `text-base` | 400 |
| Small | 14px | `text-sm` | 400 |
| Caption | 12px | `text-xs` | 400 |

### Therapeutische Textregeln
- **Zeilenhöhe**: Mindestens 1.5 für bessere Lesbarkeit
- **Zeilenlänge**: Max. 65-75 Zeichen pro Zeile
- **Kontrast**: Minimum 4.5:1 (WCAG AA)

---

## 🧩 Komponenten

### Cards

#### Standard Card
```jsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  {/* Content */}
</div>
```

#### Skill-Card
```jsx
<div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-blue-500">
  <div className="flex items-center gap-3 mb-4">
    <span className="text-2xl">🧘</span>
    <h3 className="text-xl font-semibold">TIPP-Skills</h3>
  </div>
  <p className="text-gray-600">Körperorientierte Techniken...</p>
</div>
```

#### Emotions-Card (Diary)
```jsx
<div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-4">
  <div className="flex justify-between items-center">
    <span className="text-lg">Traurigkeit</span>
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button 
          key={n}
          className={`w-8 h-8 rounded-full ${
            n <= value ? 'bg-purple-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  </div>
</div>
```

### Buttons

#### Primary Button
```jsx
<button className="
  bg-gradient-to-r from-indigo-500 to-purple-500
  text-white font-medium
  px-6 py-3 rounded-xl
  hover:shadow-lg hover:-translate-y-0.5
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
">
  Skill starten
</button>
```

#### Secondary Button
```jsx
<button className="
  bg-gray-100 text-gray-700 font-medium
  px-6 py-3 rounded-xl
  hover:bg-gray-200
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-400
">
  Abbrechen
</button>
```

#### Calm Button (für kritische Bereiche)
```jsx
<button className="
  bg-blue-50 text-blue-700 font-medium
  px-6 py-3 rounded-xl
  border border-blue-200
  hover:bg-blue-100
  transition-all duration-200
">
  Hilfe anzeigen
</button>
```

### Navigation

#### Tab-Navigation
```jsx
<nav className="flex gap-2 p-2 bg-gray-100 rounded-xl">
  <button className="px-4 py-2 rounded-lg bg-white shadow-sm text-indigo-600 font-medium">
    Aktiv
  </button>
  <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-white/50">
    Inaktiv
  </button>
</nav>
```

#### Modul-Navigation (unten)
```jsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
  <div className="flex justify-around max-w-md mx-auto">
    <NavItem icon="🏠" label="Home" active />
    <NavItem icon="📊" label="Diary" />
    <NavItem icon="🧰" label="Skills" />
    <NavItem icon="⚙️" label="Settings" />
  </div>
</nav>
```

### Inputs

#### Text Input
```jsx
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">
    Beschreibe die Situation
  </label>
  <textarea 
    className="
      w-full p-4 rounded-xl border border-gray-200
      focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
      resize-none min-h-[120px]
    "
    placeholder="Was ist passiert?"
  />
</div>
```

#### Slider (Emotions-Intensität)
```jsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Intensität</span>
    <span className="font-medium">{value}/10</span>
  </div>
  <input 
    type="range" 
    min="0" 
    max="10" 
    value={value}
    className="w-full accent-purple-500"
  />
  <div className="flex justify-between text-xs text-gray-400">
    <span>Niedrig</span>
    <span>Hoch</span>
  </div>
</div>
```

### Badges

```jsx
{/* Modul-Badge */}
<span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
  Achtsamkeit
</span>

{/* Status-Badge */}
<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
  ✓ Abgeschlossen
</span>

{/* Streak-Badge */}
<span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
  🔥 7 Tage
</span>
```

### Progress-Anzeigen

#### Übungs-Timer
```jsx
<div className="relative w-32 h-32">
  <svg className="w-full h-full -rotate-90">
    <circle 
      cx="64" cy="64" r="56" 
      stroke="#e5e7eb" strokeWidth="8" fill="none"
    />
    <circle 
      cx="64" cy="64" r="56" 
      stroke="#8b5cf6" strokeWidth="8" fill="none"
      strokeDasharray={2 * Math.PI * 56}
      strokeDashoffset={2 * Math.PI * 56 * (1 - progress)}
      className="transition-all duration-1000"
    />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-2xl font-bold">{timeLeft}s</span>
  </div>
</div>
```

---

## 🎭 Icons & Emojis

Wir verwenden Emojis für sofortige Wiedererkennung:

| Kontext | Emoji |
|---------|-------|
| Home | 🏠 |
| Diary Card | 📊 |
| Skills | 🧰 |
| Achtsamkeit | 🧘 |
| Stresstoleranz | 🆘 |
| Emotionsregulation | 💚 |
| Zwischenmenschlich | 🤝 |
| Vier Ohren | 👂 |
| Erfolg | ✅ |
| Warnung | ⚠️ |
| Info | ℹ️ |
| Übung | 🎯 |
| Timer | ⏱️ |
| Speichern | 💾 |
| Export | 📤 |

---

## 🌊 Animationen

### Sanfte Übergänge
```css
/* Standard-Transition für alle interaktiven Elemente */
.transition-smooth {
  transition: all 200ms ease-out;
}
```

### Fade-In (für Inhalte)
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```

### Pulse (für Fokus-Elemente)
```css
@keyframes softPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-soft-pulse {
  animation: softPulse 2s ease-in-out infinite;
}
```

**⚠️ Wichtig:** Respektiere `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Design

### Breakpoints
| Name | Min-Width | Verwendung |
|------|-----------|------------|
| sm | 640px | Große Phones |
| md | 768px | Tablets |
| lg | 1024px | Desktop |

### Mobile-First Patterns
```jsx
{/* Grid: 1 Spalte → 2 Spalten → 3 Spalten */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

{/* Bottom Navigation auf Mobile, Sidebar auf Desktop */}
<nav className="fixed bottom-0 left-0 right-0 md:static md:w-64">
  {/* Navigation */}
</nav>
```

---

## ♿ Accessibility

### Kritische Anforderungen

1. **Kontrast**: Minimum 4.5:1 für Text
2. **Focus-States**: Sichtbar für Keyboard-Navigation
3. **Touch-Targets**: Minimum 44x44px
4. **Labels**: Alle Inputs brauchen Labels
5. **ARIA**: Semantische Markup-Elemente nutzen

### Focus-Styles
```css
:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Screen-Reader Texte
```jsx
{/* Versteckter Text nur für Screen Reader */}
<span className="sr-only">Übung abgeschlossen</span>
<span aria-hidden="true">✅</span>
```

---

## ✅ Do's & Don'ts

### ✅ Do's
- Sanfte, beruhigende Farben verwenden
- Klare, einfache Sprache
- Ermutigende Formulierungen ("Gut gemacht!" statt nur "Fertig")
- Ausreichend Weißraum für Ruhe
- Progressive Disclosure (nicht alles auf einmal zeigen)
- Immer einen "Zurück"-Weg anbieten

### ❌ Don'ts
- Keine grellen Farben oder Blink-Animationen
- Keine bewertende Sprache ("Du hast versagt")
- Keine überladenen Screens
- Keine Auto-Play-Videos oder -Audio
- Keine langen Formulare ohne Zwischenspeichern
- Keine versteckten Aktionen (alles muss reversibel sein)

---

## 🔧 Tailwind-Konfiguration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
        }
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'soft-pulse': 'softPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## 📚 Ressourcen

- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Components](https://inclusive-components.design/)
- [React Accessibility](https://react.dev/reference/react-dom/components#common-props)
