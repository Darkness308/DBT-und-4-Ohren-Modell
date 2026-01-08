# Multi-Dimensionen Qualitätsanalyse

Führe eine umfassende 10-Dimensionen-Qualitätsanalyse für die angegebene Komponente oder den Bereich durch.

## Analyse-Dimensionen

Bewerte jede Dimension auf einer Skala von 1-10 mit konkreten Code-Beispielen:

### 1. EFFIZIENZ (Performance-Kosten pro Feature)
- Re-Render-Frequenz
- Memory-Management (Cleanup, Leaks)
- Algorithmus-Komplexität (O-Notation)
- Bundle-Impact

### 2. FLEXIBILITÄT (Anpassbarkeit)
- Dependency Injection vorhanden?
- Konfigurierbarkeit
- Erweiterungspunkte
- Plugin-Fähigkeit

### 3. MODULARITÄT (Zerlegbarkeit)
- Single Responsibility
- Komponenten-Größe (Zeilen)
- Import/Export-Sauberkeit
- Zirkuläre Abhängigkeiten?

### 4. GRANULARITÄT (Schichtentrennung)
- Data Layer isoliert?
- Business Logic von UI getrennt?
- API-Abstraktion

### 5. PERFORMANCE (Messbare Metriken)
- Ladezeit-Impact
- Render-Zyklen
- Code-Splitting genutzt?
- Lazy Loading?

### 6. KONSISTENZ (Einheitlichkeit)
- Naming Conventions
- Code-Style
- Error-Handling-Pattern
- Sprach-Mix (DE/EN)?

### 7. ROBUSTHEIT (Fehlertoleranz)
- Error Boundaries
- Null/Undefined Checks
- Edge Cases abgedeckt?
- Graceful Degradation

### 8. INTERAKTIVITÄT (UX)
- Feedback-Mechanismen
- Loading States
- Animationen
- Touch/Keyboard Support

### 9. BARRIEREFREIHEIT (A11y)
- ARIA-Attribute
- Focus Management
- Screen Reader Support
- Kontraste (WCAG)

### 10. LOGIK (Business Logic Qualität)
- Algorithmus-Korrektheit
- Testbarkeit
- Domain-Modellierung
- Validierung

## Ausgabe-Format

```
┌─────────────────────────────────────────────┐
│ DIMENSION      │ NOTE │ PUNKTE │ KRITISCH  │
├─────────────────────────────────────────────┤
│ [Dimension]    │ [A-F]│ [1-10] │ [Ja/Nein] │
└─────────────────────────────────────────────┘

KRITISCHE FINDINGS:
1. [Problem] → [Fundort:Zeile] → [Lösung]

PARETO-EMPFEHLUNG (80/20):
- [Was mit 20% Aufwand 80% Impact bringt]

KI-FINGERPRINT-CHECK:
- [% KI] / [% Mensch] mit Begründung
```

## Ziel-Bereich

$ARGUMENTS

Falls kein Bereich angegeben: Analysiere die gesamte Codebasis.
