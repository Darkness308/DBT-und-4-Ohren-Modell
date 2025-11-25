# Claude Code Prompt-Guide - DBT & Vier-Ohren App

## 🎯 Wie du diesen Guide nutzt

1. Starte Claude Code im Projektverzeichnis: `claude`
2. Kopiere den gewünschten Prompt
3. Passe ggf. Details in `[eckigen Klammern]` an
4. Führe aus und iteriere

---

## 🚀 Phase 1: Setup

### Prompt 1.1 – Projekt initialisieren
```
Lies CLAUDE.md und alle Dateien in docs/. 

Dann:
1. Erstelle die komplette Projektstruktur wie in CLAUDE.md beschrieben
2. Initialisiere Vite mit React
3. Konfiguriere Tailwind CSS
4. Erstelle die Basis-Komponenten (Card, Button, Input, Navigation)
5. Erstelle den Event-Bus in src/utils/eventBus.js
6. Erstelle einen minimalen App.jsx mit Navigation zwischen Home und einem Platzhalter-Modul

Teste dass `npm run dev` funktioniert.
```

### Prompt 1.2 – Design-System implementieren
```
Lies docs/design-system.md.

Implementiere das Design-System:
1. Erstelle tailwind.config.js mit den therapeutischen Farben
2. Erstelle src/index.css mit den Custom-Animationen
3. Erstelle alle Basis-Komponenten in src/components/common/:
   - Card.jsx (Standard, Skill-Card, Emotion-Card Varianten)
   - Button.jsx (Primary, Secondary, Calm Varianten)
   - Input.jsx (Text, Textarea, Slider)
   - Badge.jsx (Modul-Badge, Status-Badge, Streak-Badge)
   - Navigation.jsx (Tab-Navigation und Bottom-Nav)

Jede Komponente soll:
- Props für Varianten akzeptieren
- Accessibility-Attribute haben (aria-labels, focus-states)
- Mit JSDoc dokumentiert sein
```

---

## 📊 Phase 2: Kern-Module

### Prompt 2.1 – Vier-Ohren-Analyzer (Herzstück)
```
Lies docs/agents.md Abschnitt "VierOhrenAnalyzerAgent".

Implementiere das Vier-Ohren-Modul:

1. Erstelle src/agents/VierOhrenAnalyzerAgent.js mit:
   - analyzeStatement(input) - Analyse einer Aussage
   - getExamples(category) - Beispiele nach Kategorie
   - generateExercise(difficulty) - Übungen generieren

2. Erstelle src/data/vierOhrenExamples.js mit mindestens 10 Beispielen aus verschiedenen Kategorien (alltag, familie, arbeit, beziehung)

3. Erstelle die Komponenten in src/components/vier-ohren/:
   - AnalyzerForm.jsx - Eingabe von Aussage + Kontext
   - ResultDisplay.jsx - Anzeige der 4 Ebenen mit Interpretationen
   - ExerciseMode.jsx - Interaktiver Übungsmodus

4. Die Ergebnis-Anzeige soll:
   - Jede Ebene farblich kodiert darstellen (siehe Design-System)
   - Wahrscheinlichkeiten als Balken visualisieren
   - "Missverständnis-Potenzial" anzeigen
   - Vorschläge für bessere Kommunikation geben

Teste mit dem Ampel-Beispiel: "Die Ampel ist grün."
```

### Prompt 2.2 – Skill-Finder
```
Lies docs/agents.md Abschnitt "SkillFinderAgent" und docs/dbt-skills-referenz.md.

Implementiere den Skill-Finder:

1. Erstelle src/data/dbtSkills.js mit allen Skills aus der Referenz, strukturiert nach:
   - id, name, module (achtsamkeit/stresstoleranz/emotionsregulation/interpersonal)
   - acronym (falls vorhanden, z.B. TIPP, ACCEPTS, DEAR MAN)
   - whenToUse (Array von Situationen)
   - steps (Array mit Anleitungsschritten)
   - difficulty, effectiveness, tags

2. Erstelle src/agents/SkillFinderAgent.js mit:
   - findSkills(situation) - Matching-Algorithmus
   - getSkillById(id)
   - getSkillsByModule(module)
   - searchSkills(query)

3. Erstelle src/utils/skillMatcher.js mit der Matching-Logik:
   - Priorisiere nach crisisLevel
   - Berücksichtige emotionIntensity
   - Filtere nach timeAvailable
   - Beachte targetGoal

4. Erstelle Komponenten in src/components/skill-finder/:
   - SituationInput.jsx - Geführte Fragen oder Freitext
   - SkillRecommendations.jsx - Liste empfohlener Skills
   - SkillDetail.jsx - Detailansicht mit Schritt-für-Schritt

Der Nutzer soll mit 3-4 Fragen zur passenden Skill-Empfehlung geführt werden.
```

### Prompt 2.3 – Chain Analysis Tool
```
Lies docs/agents.md Abschnitt "ChainAnalysisAgent".

Implementiere die Verhaltenskettenanalyse:

1. Erstelle src/agents/ChainAnalysisAgent.js mit:
   - createNewChain()
   - addChainLink(chainId, link)
   - suggestInterventions(chain)
   - saveChain(chain)
   - getChainHistory()

2. Erstelle Komponenten in src/components/chain-analysis/:
   - ChainBuilder.jsx - Interaktiver Ketten-Editor
     * Schritt-für-Schritt durch: Vulnerabilität → Auslöser → Kette → Konsequenzen
     * Dynamisches Hinzufügen von Kettengliedern (Gedanke/Gefühl/Körper/Impuls/Verhalten)
     * Intensitäts-Slider für jedes Glied
   
   - ChainVisualization.jsx - Visuelle Darstellung der Kette
     * Horizontale Timeline mit verbundenen Knoten
     * Farbkodierung nach Typ (Gedanke=blau, Gefühl=rosa, etc.)
     * Klickbare Knoten für Details
   
   - InterventionSuggestions.jsx - Skill-Vorschläge pro Kettenglied
     * Automatische Vorschläge basierend auf Kettenglied-Typ
     * "Was hätte ich stattdessen tun können?"

3. Speichere Chains in LocalStorage via src/utils/storage.js

Die UI soll empathisch und nicht-wertend sein. Nutze ermutigende Sprache.
```

---

## 📈 Phase 3: Tracking

### Prompt 3.1 – Digitale Diary Card
```
Lies docs/agents.md Abschnitt "DiaryCardAgent".

Implementiere die Diary Card:

1. Erstelle src/agents/DiaryCardAgent.js mit:
   - createEntry(date)
   - updateEntry(id, data)
   - getEntry(date)
   - getWeeklyOverview(startDate)
   - generateChart(type, range)

2. Erstelle src/data/emotionList.js mit:
   - Basis-Emotionen (Traurigkeit, Wut, Angst, Scham, Freude, etc.)
   - Körperempfindungen
   - Typische Urges

3. Erstelle Komponenten in src/components/diary-card/:
   - DailyEntry.jsx - Tageseintrag-Formular
     * Datum-Auswahl
     * Emotions-Slider (0-5 für jede Emotion)
     * Urge-Tracker
     * Skill-Verwendung (Multi-Select aus genutzten Skills)
     * Schlaf, Medikamente, Notizen
   
   - EmotionSlider.jsx - Wiederverwendbarer Intensitäts-Slider
     * 0-5 Skala mit Emoji-Feedback
     * Farbverlauf basierend auf Intensität
   
   - WeeklyChart.jsx - Wochenübersicht mit Recharts
     * Liniendiagramm für Emotionsverlauf
     * Skill-Nutzung als Balkendiagramm

4. Implementiere Persistenz in LocalStorage
5. Zeige Streak-Badge an (Tage in Folge ausgefüllt)

Die Eingabe soll schnell und einfach sein - maximal 2-3 Minuten pro Tag.
```

### Prompt 3.2 – Muster-Erkennung
```
Lies docs/agents.md Abschnitt "PatternRecognitionAgent".

Implementiere die Mustererkennung:

1. Erstelle src/agents/PatternRecognitionAgent.js mit:
   - analyzePatterns(diaryData, chainData)
   - getActivePatterns()
   - suggestInterventions(pattern)

2. Erkenne folgende Muster:
   - Trigger-Korrelationen: "Wenn [Vulnerabilität], dann [erhöhte Urges]"
   - Skill-Effektivität: "Skill X hilft am besten bei Emotion Y"
   - Zeitliche Muster: "Montags ist Stimmung oft schlechter"
   - Fortschritt: "Durchschnittliche Urge-Intensität sinkt über Zeit"

3. Erstelle src/components/patterns/:
   - PatternCard.jsx - Einzelnes erkanntes Muster
   - PatternDashboard.jsx - Übersicht aller Muster
   - InsightNotification.jsx - Sanfte Benachrichtigung bei neuem Muster

4. Muster sollen:
   - Erst ab 5+ Datenpunkten angezeigt werden
   - Konfidenz-Wert haben
   - Vom Nutzer bestätigt/abgelehnt werden können
   - Konkrete Handlungsempfehlungen enthalten

Formuliere Muster positiv und ermutigend, nicht alarmierend.
```

---

## 🧘 Phase 4: Übungen

### Prompt 4.1 – Imaginationsübungen
```
Lies docs/agents.md Abschnitt "ImaginationAgent".

Implementiere Imaginationsübungen:

1. Erstelle src/agents/ImaginationAgent.js mit:
   - getExercise(id)
   - startExercise(id)
   - pauseExercise()
   - stopExercise()
   - trackCompletion(id)

2. Erstelle src/data/imaginationScripts.js mit Skripten für:
   - safe-place: Sicherer Ort (10 min)
   - tree-meditation: Baum-Meditation (8 min)
   - light-stream: Light-Stream-Technik (12 min)
   - clouds: Wolken-Übung für Gedanken (5 min)

   Jedes Skript enthält:
   - Textabschnitte mit Pausen-Zeiten
   - Vorbereitungs-Hinweise
   - Nachbereitungs-Schritte
   - Warnhinweise (bei Trauma-relevanten Übungen)

3. Erstelle Komponenten in src/components/imagination/:
   - ExercisePlayer.jsx
     * Start/Pause/Stop-Controls
     * Kreisförmiger Fortschritts-Timer
     * Aktueller Text-Abschnitt (sanft eingeblendet)
     * Optional: Text-to-Speech mit Web Speech API
   
   - ExerciseList.jsx - Übersicht aller Übungen
   - CompletionScreen.jsx - Sanfter Abschluss mit Reflexionsfrage

4. Beachte:
   - prefers-reduced-motion respektieren
   - Abbruch jederzeit möglich
   - Keine Auto-Play
   - Warnhinweise VOR Start anzeigen
```

### Prompt 4.2 – DEAR MAN Trainer
```
Implementiere einen interaktiven DEAR MAN Kommunikations-Trainer:

1. Erstelle src/components/dear-man/:
   - DearManTrainer.jsx - Hauptkomponente
   - StepGuide.jsx - Führt durch jeden Buchstaben
   - ScenarioBuilder.jsx - Eigene Szenarien erstellen
   - ExampleDialog.jsx - Beispiel-Dialoge

2. Der Trainer soll:
   - DEAR MAN Schritt für Schritt erklären
   - Für jeden Schritt ein Eingabefeld bieten
   - Beispiel-Formulierungen vorschlagen
   - Am Ende das komplette "Skript" zusammenstellen
   - Speichern für späteres Üben ermöglichen

3. Erstelle 3 vorgefertigte Szenarien:
   - Gehalt verhandeln
   - Nein sagen zu Freunden
   - Konflikt mit Partner ansprechen

4. DEAR MAN Struktur:
   D - Describe (Situation sachlich beschreiben)
   E - Express (Gefühle/Meinung ausdrücken)
   A - Assert (Klar sagen was man will)
   R - Reinforce (Vorteile nennen)
   M - Mindful (Beim Thema bleiben)
   A - Appear confident (Selbstsicher auftreten)
   N - Negotiate (Kompromisse anbieten)
```

---

## 🔧 Phase 5: Polish

### Prompt 5.1 – Onboarding
```
Erstelle einen sanften Onboarding-Flow für neue Nutzer:

1. Erstelle src/components/onboarding/:
   - OnboardingFlow.jsx - 4-5 Schritte
   - WelcomeStep.jsx - Begrüßung
   - GoalsStep.jsx - Was möchte der Nutzer erreichen?
   - ModuleIntro.jsx - Kurze Vorstellung der Module
   - SettingsStep.jsx - Basis-Einstellungen (Name, Erinnerungen)

2. Das Onboarding soll:
   - Überspringbar sein
   - Fortschritt speichern
   - Nicht überwältigend sein (max. 5 Schritte)
   - Therapeutisch einladend formuliert sein
   - Direkt zum ersten Modul führen

3. Nach Abschluss: Zeige "Skill des Tages" als sanften Einstieg
```

### Prompt 5.2 – Accessibility Audit
```
Führe einen Accessibility-Audit durch und behebe Probleme:

1. Prüfe alle Komponenten auf:
   - Korrekte Heading-Hierarchie (h1 → h2 → h3)
   - Alle Bilder/Icons haben alt-Text oder aria-label
   - Alle Inputs haben Labels
   - Fokus-Reihenfolge ist logisch
   - Kontraste sind mindestens 4.5:1
   - Touch-Targets sind mindestens 44x44px

2. Implementiere:
   - Skip-Link zum Hauptinhalt
   - Fokus-Trap in Modals
   - Escape schließt Modals
   - aria-live für dynamische Inhalte
   - prefers-reduced-motion Support

3. Teste mit Keyboard-Navigation durch alle Module

4. Dokumentiere Accessibility-Features in README.md
```

### Prompt 5.3 – PWA Setup
```
Mache die App zu einer Progressive Web App:

1. Erstelle public/manifest.json mit:
   - App-Name und Beschreibung
   - Icons in verschiedenen Größen
   - Theme-Color passend zum Design-System
   - display: standalone

2. Erstelle einen Service Worker für:
   - Offline-Caching der App-Shell
   - Caching der Skill-Daten

3. Füge Install-Prompt hinzu:
   - Zeige nach 3. Besuch
   - Kann abgelehnt werden
   - Nicht aufdringlich

4. Teste:
   - App funktioniert offline
   - Installierbar auf Mobile
   - Korrekte Icons
```

---

## 🐛 Debugging & Fixes

### Prompt D.1 – Fehler beheben
```
Ich habe folgenden Fehler:

[FEHLER HIER EINFÜGEN]

Analysiere den Fehler, finde die Ursache und behebe ihn.
Erkläre kurz was das Problem war.
```

### Prompt D.2 – Performance optimieren
```
Die App fühlt sich langsam an bei [BESCHREIBUNG].

Analysiere die Performance:
1. Prüfe auf unnötige Re-Renders
2. Prüfe auf große Bundle-Größen
3. Implementiere React.memo wo sinnvoll
4. Lazy-Loading für Module

Zeige vorher/nachher Verbesserungen.
```

### Prompt D.3 – Code Review
```
Führe ein Code Review durch für [DATEI ODER MODUL].

Prüfe auf:
1. Best Practices (React, Accessibility, Security)
2. Code-Duplikation
3. Fehlende Error-Handling
4. Verbesserungspotenzial

Erstelle eine Liste mit Prioritäten (kritisch/mittel/nice-to-have).
```

---

## 💡 Tipps für Claude Code

1. **Kontext aufbauen**: Beginne jede Session mit "Lies CLAUDE.md und docs/"
2. **Iterativ arbeiten**: Lieber kleine Prompts als ein riesiger
3. **Testen lassen**: Füge "Teste dass es funktioniert" hinzu
4. **Spezifisch sein**: Je genauer der Prompt, desto besser das Ergebnis
5. **Fehler nutzen**: Bei Fehlern einfach den Fehlertext als Prompt geben

---

## 📚 Weitere Ressourcen

- [Claude Code Dokumentation](https://docs.anthropic.com/claude-code)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
