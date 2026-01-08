# Tiefenanalyse mit konfigurierbarer Präzision

Führe eine strukturierte Code-Analyse durch mit konfigurierbarem Detailgrad.

## Konfiguration aus Argumenten

**Eingabe**: $ARGUMENTS

Interpretiere die Argumente wie folgt:
- `quick` oder `minimal` → Nur Kern-Ergebnisse, keine Details
- `standard` (default) → Ausgewogene Analyse mit Empfehlungen
- `deep` oder `maximum` → Vollständige Analyse aller Ebenen
- `--quiet` → Kompakte Ausgabe ohne Diagramme

Falls ein Pfad angegeben ist, analysiere nur diesen Bereich.

## Analyse-Struktur (KERN-KONZEPT)

### 1. KERN-BEFUND
- Was ist das Hauptproblem/die Haupterkenntnis?
- Eine Zeile, maximal prägnant

### 2. KONTEXT
- Wo im Code liegt das Problem?
- Welche Dateien/Funktionen sind betroffen?

### 3. TIEFE (je nach Präzisionsgrad)

**Bei `quick`:**
- Nur Kern-Befund + 3 Bullet Points

**Bei `standard`:**
- Kern-Befund
- Betroffene Dateien mit Zeilennummern
- Top-3 Handlungsempfehlungen
- Geschätzter Aufwand

**Bei `deep`:**
- Alles aus standard, plus:
- Abhängigkeits-Diagramm
- Code-Beispiele für Fixes
- Risiko-Bewertung
- Alternative Lösungsansätze
- Langzeit-Auswirkungen

### 4. NÄCHSTER SCHRITT
- Eine konkrete Aktion, die sofort umsetzbar ist

## Ausgabe-Format

Strukturiere die Ausgabe immer so:

```
┌─ KERN ──────────────────────────────────────┐
│ [Haupterkenntnis in einem Satz]             │
└─────────────────────────────────────────────┘

KONTEXT: [Dateien/Bereiche]

[Details je nach Präzisionsgrad]

→ NÄCHSTER SCHRITT: [Konkrete Aktion]
```

## Beispiele

- `/deep-analyze quick src/agents` → Schnelle Agent-Übersicht
- `/deep-analyze deep --quiet` → Tiefe Analyse, kompakte Ausgabe
- `/deep-analyze standard performance` → Standard Performance-Check
