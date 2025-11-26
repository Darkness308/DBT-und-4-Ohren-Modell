/**
 * DBT-Skills Datenbank
 * Basierend auf Marsha Linehan's DBT Skills Training Manual (2nd Edition, 2015)
 */

/**
 * DBT-Module mit Metadaten
 */
export const dbtModules = {
  achtsamkeit: {
    id: 'achtsamkeit',
    name: 'Achtsamkeit',
    icon: '🧘',
    color: 'blue',
    colorClass: 'blue-500',
    description: 'Gegenwärtiger Moment, ohne Urteil',
    focus: 'Wise Mind erreichen, bewusst im Hier und Jetzt sein'
  },
  stresstoleranz: {
    id: 'stresstoleranz',
    name: 'Stresstoleranz',
    icon: '🆘',
    color: 'orange',
    colorClass: 'orange-500',
    description: 'Krisen überstehen ohne Verschlimmerung',
    focus: 'Akute Krisen bewältigen, Impulse kontrollieren'
  },
  emotionsregulation: {
    id: 'emotionsregulation',
    name: 'Emotionsregulation',
    icon: '💚',
    color: 'green',
    colorClass: 'green-500',
    description: 'Gefühle verstehen und verändern',
    focus: 'Emotionen erkennen, akzeptieren und steuern'
  },
  zwischenmenschlich: {
    id: 'zwischenmenschlich',
    name: 'Zwischenmenschliche Effektivität',
    icon: '🤝',
    color: 'yellow',
    colorClass: 'yellow-500',
    description: 'Beziehungen pflegen, Grenzen setzen',
    focus: 'Effektiv kommunizieren, Selbstachtung wahren'
  }
}

/**
 * Alle DBT-Skills
 */
export const dbtSkills = [
  // ==================== ACHTSAMKEIT ====================
  {
    id: 'wise-mind',
    name: 'Wise Mind',
    module: 'achtsamkeit',
    shortDescription: 'Balance zwischen Emotion und Vernunft finden',
    fullDescription: 'Der Wise Mind ist der Zustand, in dem emotionaler und rationaler Geist zusammenarbeiten. Er ermöglicht kluge Entscheidungen, die sowohl Gefühle als auch Fakten berücksichtigen.',
    whenToUse: [
      'Bei schwierigen Entscheidungen',
      'Wenn Emotionen überwältigend sind',
      'Wenn du zu kopflastig reagierst',
      'Vor wichtigen Gesprächen'
    ],
    steps: [
      { title: 'Innehalten', instruction: 'Nimm dir einen Moment der Stille' },
      { title: 'Atmen', instruction: 'Atme 3x tief ein und aus' },
      { title: 'Fragen', instruction: 'Frage dich: "Was sagt mein Wise Mind dazu?"' },
      { title: 'Warten', instruction: 'Warte auf die innere Antwort, die sich "richtig" anfühlt' }
    ],
    difficulty: 2,
    effectiveness: { acute: 3, longterm: 5 },
    tags: ['grundlegend', 'entscheidung', 'balance'],
    relatedSkills: ['beobachten', 'beschreiben']
  },
  {
    id: 'beobachten',
    name: 'Beobachten (Observe)',
    module: 'achtsamkeit',
    shortDescription: 'Wahrnehmen ohne zu bewerten',
    fullDescription: 'Innere und äußere Erfahrungen wahrnehmen, ohne sie zu bewerten oder zu verändern. Wie Wolken am Himmel beobachten - sie kommen und gehen.',
    whenToUse: [
      'Bei Grübeln oder Sorgen',
      'Wenn Gedanken rasen',
      'Zur Beruhigung',
      'Als tägliche Übung'
    ],
    steps: [
      { title: 'Position', instruction: 'Setze oder lege dich bequem hin' },
      { title: 'Fokus', instruction: 'Richte die Aufmerksamkeit auf den Atem' },
      { title: 'Beobachten', instruction: 'Beobachte Gedanken und Gefühle wie vorbeiziehende Wolken' },
      { title: 'Zurückkehren', instruction: 'Wenn du abschweifst, kehre sanft zum Beobachten zurück' }
    ],
    difficulty: 1,
    effectiveness: { acute: 3, longterm: 5 },
    tags: ['grundlegend', 'beruhigend', 'täglich'],
    relatedSkills: ['beschreiben', 'wise-mind']
  },
  {
    id: 'beschreiben',
    name: 'Beschreiben (Describe)',
    module: 'achtsamkeit',
    shortDescription: 'Erlebtes in Worte fassen',
    fullDescription: '"Name it to tame it" - Durch das Benennen von Gefühlen und Gedanken verlieren sie an Intensität. Objektiv beschreiben, ohne zu interpretieren.',
    whenToUse: [
      'Bei intensiven Emotionen',
      'Wenn alles durcheinander ist',
      'Um Klarheit zu gewinnen',
      'In Konfliktsituationen'
    ],
    steps: [
      { title: 'Wahrnehmen', instruction: 'Was genau passiert gerade?' },
      { title: 'Benennen', instruction: 'Benenne das Gefühl: "Ich fühle Traurigkeit"' },
      { title: 'Fakten', instruction: 'Beschreibe nur Fakten, keine Interpretationen' },
      { title: 'Körper', instruction: 'Beschreibe körperliche Empfindungen' }
    ],
    difficulty: 1,
    effectiveness: { acute: 4, longterm: 4 },
    tags: ['grundlegend', 'emotionen', 'klarheit'],
    relatedSkills: ['beobachten', 'check-the-facts']
  },
  {
    id: 'one-mindfully',
    name: 'Eins nach dem Anderen',
    module: 'achtsamkeit',
    shortDescription: 'Volle Aufmerksamkeit auf eine Sache',
    fullDescription: 'Mono-Tasking statt Multi-Tasking. Eine Tätigkeit mit ganzer Aufmerksamkeit ausführen, ohne nebenbei anderes zu tun.',
    whenToUse: [
      'Bei Überforderung',
      'Wenn alles zu viel wird',
      'Beim Essen',
      'Bei wichtigen Aufgaben'
    ],
    steps: [
      { title: 'Wählen', instruction: 'Wähle eine Aktivität aus' },
      { title: 'Fokussieren', instruction: 'Richte deine volle Aufmerksamkeit darauf' },
      { title: 'Ablenkungen', instruction: 'Bemerke Ablenkungen und kehre zurück' },
      { title: 'Präsent', instruction: 'Bleibe im gegenwärtigen Moment' }
    ],
    difficulty: 1,
    effectiveness: { acute: 3, longterm: 4 },
    tags: ['alltag', 'fokus', 'stress'],
    relatedSkills: ['beobachten', 'teilnehmen']
  },

  // ==================== STRESSTOLERANZ ====================
  {
    id: 'stop',
    name: 'STOP-Skill',
    module: 'stresstoleranz',
    shortDescription: 'Innehalten in akuten Momenten',
    fullDescription: 'Ein Akronym für akute Situationen: Stop - Take a step back - Observe - Proceed mindfully. Verhindert impulsive Reaktionen.',
    acronym: {
      S: 'Stop - Halte inne, tu nichts überstürzt',
      T: 'Take a step back - Tritt einen Schritt zurück, atme',
      O: 'Observe - Beobachte die Situation sachlich',
      P: 'Proceed mindfully - Handle überlegt aus dem Wise Mind'
    },
    whenToUse: [
      'Bei Wut oder Ärger',
      'Vor impulsiven Handlungen',
      'In Konflikten',
      'Bei starkem Drang'
    ],
    steps: [
      { title: 'S - Stop', instruction: 'Friere ein! Bewege dich nicht, tu nichts' },
      { title: 'T - Take a step back', instruction: 'Tritt mental/physisch zurück, atme tief' },
      { title: 'O - Observe', instruction: 'Was passiert? Was fühle ich? Was denke ich?' },
      { title: 'P - Proceed', instruction: 'Handle überlegt - Was ist jetzt sinnvoll?' }
    ],
    difficulty: 1,
    effectiveness: { acute: 5, longterm: 3 },
    tags: ['akut', 'impuls', 'schnell'],
    relatedSkills: ['tipp', 'wise-mind']
  },
  {
    id: 'tipp',
    name: 'TIPP-Skills',
    module: 'stresstoleranz',
    shortDescription: 'Körperliche Techniken bei extremer Anspannung',
    fullDescription: 'Physiologische Übungen, die das Nervensystem schnell beruhigen. Besonders wirksam bei Panik oder extremem emotionalen Stress.',
    acronym: {
      T: 'Temperatur - Kaltes Wasser auf Gesicht/Nacken',
      I: 'Intensive Bewegung - 10-15 Min Sport',
      P: 'Paced Breathing - Langsames Atmen (4 ein, 6-8 aus)',
      P2: 'Progressive Muskelentspannung'
    },
    whenToUse: [
      'Bei Panikattacken',
      'Extremer emotionaler Erregung',
      'Starkem Drang zu selbstschädigendem Verhalten',
      'Wenn nichts anderes hilft'
    ],
    steps: [
      { title: 'T - Temperatur', instruction: 'Halte dein Gesicht 30 Sek. in kaltes Wasser oder lege Eiswürfel auf Nacken/Handgelenke', scienceNote: 'Aktiviert den Tauchreflex, senkt Herzfrequenz' },
      { title: 'I - Intensive Bewegung', instruction: 'Sprinte, mach Jumping Jacks, Treppen steigen - 10-15 Minuten', scienceNote: 'Baut Stresshormone ab' },
      { title: 'P - Paced Breathing', instruction: '4 Sekunden einatmen, 6-8 Sekunden ausatmen. 5-10 Minuten', scienceNote: 'Aktiviert Parasympathikus' },
      { title: 'P - Progressive Muskelentspannung', instruction: 'Muskelgruppen nacheinander anspannen (5 Sek.) und loslassen' }
    ],
    difficulty: 1,
    effectiveness: { acute: 5, longterm: 2 },
    tags: ['akut', 'körperlich', 'panik', 'schnell'],
    relatedSkills: ['stop', 'accepts']
  },
  {
    id: 'accepts',
    name: 'ACCEPTS',
    module: 'stresstoleranz',
    shortDescription: 'Gesunde Ablenkungsstrategien',
    fullDescription: 'Verschiedene Ablenkungstechniken für extremen emotionalen Schmerz. Kurzfristige Strategie - das Problem später angehen!',
    acronym: {
      A: 'Activities - Aktivitäten (Sport, Spiel, Aufräumen)',
      C: 'Contributing - Anderen helfen, zuhören',
      C2: 'Comparisons - Vergleiche mit schwierigeren Zeiten',
      E: 'Emotions - Andere Gefühle erzeugen (lustiger Film)',
      P: 'Pushing Away - Schmerz gedanklich wegschieben',
      T: 'Thoughts - Gedanken beschäftigen (Sudoku, Zählen)',
      S: 'Sensations - Intensive Sinnesreize (Eiswürfel, saure Bonbons)'
    },
    whenToUse: [
      'Bei überwältigendem Schmerz',
      'Wenn Gefühle zu intensiv sind',
      'Um Zeit zu gewinnen',
      'Bei Wartezeiten (z.B. auf Therapeut)'
    ],
    steps: [
      { title: 'Wählen', instruction: 'Wähle eine oder mehrere ACCEPTS-Strategien' },
      { title: 'Umsetzen', instruction: 'Setze sie sofort um' },
      { title: 'Zeit geben', instruction: 'Gib der Strategie mindestens 15-20 Minuten' },
      { title: 'Wiederholen', instruction: 'Bei Bedarf andere Strategie wählen' }
    ],
    difficulty: 1,
    effectiveness: { acute: 4, longterm: 2 },
    tags: ['ablenkung', 'kurzfristig', 'vielfältig'],
    relatedSkills: ['tipp', 'improve']
  },
  {
    id: 'improve',
    name: 'IMPROVE the Moment',
    module: 'stresstoleranz',
    shortDescription: 'Den Moment erträglicher machen',
    fullDescription: 'Skills, um eine schwere Situation erträglicher zu gestalten, ohne sie zu vermeiden.',
    acronym: {
      I: 'Imagery - Heilsame Bilder, Safe Place',
      M: 'Meaning - Sinn im Leid finden',
      P: 'Prayer - Spirituelle Anbindung',
      R: 'Relaxation - Entspannungstechniken',
      O: 'One thing - Eine Sache, voll konzentriert',
      V: 'Vacation - Mini-Auszeit (5-10 Min)',
      E: 'Encouragement - Selbst-Zuspruch'
    },
    whenToUse: [
      'Bei anhaltendem Stress',
      'In schwierigen Lebensphasen',
      'Wenn Ablenkung nicht reicht',
      'Zur Selbstfürsorge'
    ],
    steps: [
      { title: 'Identifizieren', instruction: 'Was brauchst du gerade am meisten?' },
      { title: 'Wählen', instruction: 'Wähle eine passende IMPROVE-Strategie' },
      { title: 'Anwenden', instruction: 'Nimm dir bewusst Zeit dafür' },
      { title: 'Würdigen', instruction: 'Erkenne an, dass du dir selbst hilfst' }
    ],
    difficulty: 2,
    effectiveness: { acute: 3, longterm: 4 },
    tags: ['moment', 'selbstfürsorge', 'erträglich'],
    relatedSkills: ['accepts', 'safe-place']
  },
  {
    id: 'radical-acceptance',
    name: 'Radikale Akzeptanz',
    module: 'stresstoleranz',
    shortDescription: 'Annehmen was ist - vollständig',
    fullDescription: 'Die Realität akzeptieren, wie sie ist - nicht gutheißen, sondern anerkennen. Schmerz + Nicht-Akzeptanz = Leiden. Schmerz + Akzeptanz = nur Schmerz.',
    whenToUse: [
      'Bei unveränderbaren Situationen',
      'Nach Verlust oder Enttäuschung',
      'Wenn Widerstand Energie kostet',
      'Bei chronischen Problemen'
    ],
    steps: [
      { title: 'Erkennen', instruction: 'Was ist die Realität, die ich nicht akzeptiere?' },
      { title: 'Anerkennen', instruction: 'Diese Situation ist jetzt so, wie sie ist' },
      { title: 'Körper', instruction: 'Spüre, wo der Widerstand im Körper sitzt' },
      { title: 'Loslassen', instruction: 'Atme aus und lasse den Widerstand los' },
      { title: 'Wiederholen', instruction: 'Akzeptanz ist ein Prozess, wiederhole bei Bedarf' }
    ],
    difficulty: 3,
    effectiveness: { acute: 2, longterm: 5 },
    tags: ['akzeptanz', 'loslassen', 'tiefgreifend'],
    relatedSkills: ['turning-the-mind', 'willingness']
  },

  // ==================== EMOTIONSREGULATION ====================
  {
    id: 'check-the-facts',
    name: 'Check the Facts',
    module: 'emotionsregulation',
    shortDescription: 'Fakten überprüfen',
    fullDescription: 'Prüfen, ob die Stärke und Art der Emotion zur Situation passt. Automatische Gedanken und Interpretationen hinterfragen.',
    whenToUse: [
      'Bei starken Emotionen',
      'Wenn die Reaktion übertrieben scheint',
      'Bei Konflikten',
      'Vor wichtigen Entscheidungen'
    ],
    steps: [
      { title: 'Emotion benennen', instruction: 'Welches Gefühl habe ich genau?' },
      { title: 'Auslöser', instruction: 'Was hat das Gefühl ausgelöst?' },
      { title: 'Interpretation', instruction: 'Wie interpretiere ich die Situation?' },
      { title: 'Fakten', instruction: 'Was sind die objektiven Fakten?' },
      { title: 'Alternativen', instruction: 'Welche anderen Erklärungen gibt es?' },
      { title: 'Bewerten', instruction: 'Passt meine Reaktion zu den Fakten?' }
    ],
    difficulty: 2,
    effectiveness: { acute: 4, longterm: 5 },
    tags: ['gedanken', 'realitätscheck', 'emotionen'],
    relatedSkills: ['opposite-action', 'problem-solving']
  },
  {
    id: 'opposite-action',
    name: 'Opposite Action',
    module: 'emotionsregulation',
    shortDescription: 'Entgegengesetzt handeln',
    fullDescription: 'Das Gegenteil des emotionalen Impulses tun, wenn die Emotion nicht zur Situation passt oder nicht hilfreich ist.',
    whenToUse: [
      'Bei Angst (Vermeidung)',
      'Bei Depression (Rückzug)',
      'Bei Wut (Angriff)',
      'Bei Scham (Verstecken)'
    ],
    examples: [
      { emotion: 'Angst', impuls: 'Vermeiden', opposite: 'Aktiv hingehen, offen schauen' },
      { emotion: 'Depression', impuls: 'Einigeln', opposite: 'Aufstehen, rausgehen, Aktivität' },
      { emotion: 'Wut', impuls: 'Angreifen', opposite: 'Freundlich sein, Abstand nehmen' },
      { emotion: 'Scham', impuls: 'Verstecken', opposite: 'Sich zeigen, darüber sprechen' }
    ],
    steps: [
      { title: 'Emotion identifizieren', instruction: 'Welche Emotion fühle ich?' },
      { title: 'Impuls erkennen', instruction: 'Was will ich tun?' },
      { title: 'Prüfen', instruction: 'Ist die Emotion/der Impuls gerade hilfreich?' },
      { title: 'Gegenteil', instruction: 'Was wäre das Gegenteil?' },
      { title: 'Handeln', instruction: 'Tue das Gegenteil - ganz und gar!' }
    ],
    difficulty: 3,
    effectiveness: { acute: 4, longterm: 5 },
    tags: ['verhalten', 'emotionen', 'veränderung'],
    relatedSkills: ['check-the-facts', 'problem-solving']
  },
  {
    id: 'abc-please',
    name: 'ABC PLEASE',
    module: 'emotionsregulation',
    shortDescription: 'Vulnerabilität reduzieren',
    fullDescription: 'Langfristige Strategien, um emotionale Verletzlichkeit zu reduzieren und Resilienz aufzubauen.',
    acronym: {
      A: 'Accumulate Positive Emotions - Positive Erlebnisse sammeln',
      B: 'Build Mastery - Kompetenz aufbauen',
      C: 'Cope Ahead - Vorausplanen für schwierige Situationen'
    },
    please: {
      PL: 'Treat Physical ILlness - Krankheiten behandeln',
      E: 'Balanced Eating - Ausgewogene Ernährung',
      A: 'Avoid mood-altering substances - Keine Drogen, wenig Alkohol',
      S: 'Balanced Sleep - 7-9h Schlaf',
      E2: 'Exercise - Regelmäßige Bewegung'
    },
    whenToUse: [
      'Zur Prävention',
      'In stabilen Phasen',
      'Als tägliche Routine',
      'Nach Krisen zur Stabilisierung'
    ],
    steps: [
      { title: 'A - Positive Erlebnisse', instruction: 'Plane täglich etwas Angenehmes ein' },
      { title: 'B - Kompetenz', instruction: 'Tu täglich etwas, das Erfolgserlebnis gibt' },
      { title: 'C - Vorausplanen', instruction: 'Überlege: Was könnte schwierig werden? Wie gehe ich damit um?' },
      { title: 'PLEASE', instruction: 'Achte auf Grundbedürfnisse: Schlaf, Essen, Bewegung, keine Substanzen' }
    ],
    difficulty: 2,
    effectiveness: { acute: 2, longterm: 5 },
    tags: ['prävention', 'langfristig', 'selbstfürsorge'],
    relatedSkills: ['opposite-action', 'check-the-facts']
  },
  {
    id: 'ride-the-wave',
    name: 'Ride the Wave',
    module: 'emotionsregulation',
    shortDescription: 'Emotionen wie Wellen surfen',
    fullDescription: 'Emotionen bewusst fühlen und durchleben, ohne sie zu bekämpfen oder zu verstärken. Sie kommen und gehen wie Wellen.',
    whenToUse: [
      'Bei intensiven Gefühlen',
      'Wenn Ablenkung nicht hilft',
      'Um Emotionen zu verarbeiten',
      'Bei Trauer oder Schmerz'
    ],
    steps: [
      { title: 'Beobachten', instruction: 'Beobachte die Emotion wie eine Welle, die kommt' },
      { title: 'Nicht kämpfen', instruction: 'Bekämpfe sie nicht, lass sie da sein' },
      { title: 'Körper', instruction: 'Spüre, wo sie im Körper ist' },
      { title: 'Atmen', instruction: 'Atme durch die Emotion hindurch' },
      { title: 'Warten', instruction: 'Warte - die Welle wird wieder abebben' }
    ],
    difficulty: 2,
    effectiveness: { acute: 3, longterm: 4 },
    tags: ['emotionen', 'akzeptanz', 'durchleben'],
    relatedSkills: ['radical-acceptance', 'beobachten']
  },

  // ==================== ZWISCHENMENSCHLICH ====================
  {
    id: 'dear-man',
    name: 'DEAR MAN',
    module: 'zwischenmenschlich',
    shortDescription: 'Effektiv Wünsche äußern',
    fullDescription: 'Strukturierter Leitfaden, um Wünsche zu äußern oder Nein zu sagen, während man die Beziehung pflegt.',
    acronym: {
      D: 'Describe - Situation sachlich beschreiben',
      E: 'Express - Gefühle in Ich-Botschaften ausdrücken',
      A: 'Assert - Klar formulieren was man will/nicht will',
      R: 'Reinforce - Positive Konsequenzen aufzeigen',
      M: 'Mindful - Beim Thema bleiben',
      A2: 'Appear confident - Selbstbewusst auftreten',
      N: 'Negotiate - Kompromissbereit sein'
    },
    whenToUse: [
      'Um Wünsche zu äußern',
      'Um Nein zu sagen',
      'In Verhandlungen',
      'Bei Konflikten'
    ],
    steps: [
      { title: 'D - Describe', instruction: 'Beschreibe die Situation sachlich, ohne Vorwürfe' },
      { title: 'E - Express', instruction: 'Drücke deine Gefühle aus: "Ich fühle mich..."' },
      { title: 'A - Assert', instruction: 'Sage klar, was du möchtest oder nicht möchtest' },
      { title: 'R - Reinforce', instruction: 'Erkläre, warum es gut wäre (für beide)' },
      { title: 'M - Mindful', instruction: 'Bleib beim Thema, lass dich nicht ablenken' },
      { title: 'A - Appear confident', instruction: 'Sprich klar, halte Blickkontakt' },
      { title: 'N - Negotiate', instruction: 'Sei offen für Kompromisse' }
    ],
    difficulty: 2,
    effectiveness: { acute: 4, longterm: 5 },
    tags: ['kommunikation', 'grenzen', 'wünsche'],
    relatedSkills: ['give', 'fast']
  },
  {
    id: 'give',
    name: 'GIVE',
    module: 'zwischenmenschlich',
    shortDescription: 'Beziehung pflegen',
    fullDescription: 'Skills, um die Beziehung zum Gegenüber zu pflegen, besonders wenn das Beziehungsziel wichtiger ist als das eigene Durchsetzen.',
    acronym: {
      G: 'Gentle - Freundlich, ohne Angriff oder Sarkasmus',
      I: 'Interested - Aufrichtig zuhören, nachfragen',
      V: 'Validate - Gefühle/Sicht des anderen anerkennen',
      E: 'Easy manner - Lockerer Umgang, Humor wenn passend'
    },
    whenToUse: [
      'In wichtigen Beziehungen',
      'Wenn Harmonie wichtig ist',
      'Nach Konflikten',
      'Im Alltag mit Nahestehenden'
    ],
    steps: [
      { title: 'G - Gentle', instruction: 'Sei freundlich, vermeide Angriffe und Sarkasmus' },
      { title: 'I - Interested', instruction: 'Zeige echtes Interesse, stelle Fragen' },
      { title: 'V - Validate', instruction: 'Bestätige die Gefühle des anderen: "Ich verstehe, dass..."' },
      { title: 'E - Easy', instruction: 'Bleib locker, nutze Humor wenn angemessen' }
    ],
    difficulty: 2,
    effectiveness: { acute: 4, longterm: 5 },
    tags: ['beziehung', 'empathie', 'kommunikation'],
    relatedSkills: ['dear-man', 'fast']
  },
  {
    id: 'fast',
    name: 'FAST',
    module: 'zwischenmenschlich',
    shortDescription: 'Selbstachtung wahren',
    fullDescription: 'Skills, um die eigene Selbstachtung zu bewahren, besonders in schwierigen Gesprächen.',
    acronym: {
      F: 'Fair - Gerecht zu sich selbst UND anderen',
      A: '(no) Apologies - Nicht übermäßig entschuldigen',
      S: 'Stick to values - An eigenen Werten festhalten',
      T: 'Truthful - Ehrlich sein, nicht lügen'
    },
    whenToUse: [
      'Wenn du dich unter Druck gesetzt fühlst',
      'Um Grenzen zu wahren',
      'Bei Manipulation',
      'Um authentisch zu bleiben'
    ],
    steps: [
      { title: 'F - Fair', instruction: 'Sei fair zu dir UND zum anderen' },
      { title: 'A - No Apologies', instruction: 'Entschuldige dich nicht übermäßig für berechtigte Wünsche' },
      { title: 'S - Stick to values', instruction: 'Bleibe bei deinen Werten, auch unter Druck' },
      { title: 'T - Truthful', instruction: 'Sei ehrlich, lüge nicht und übertreibe nicht' }
    ],
    difficulty: 2,
    effectiveness: { acute: 3, longterm: 5 },
    tags: ['selbstachtung', 'grenzen', 'werte'],
    relatedSkills: ['dear-man', 'give']
  }
]

/**
 * Situations-Typen für Skill-Matching
 */
export const situationTypes = [
  { id: 'crisis', label: 'Akute Krise', icon: '🚨', priority: ['tipp', 'stop', 'accepts'] },
  { id: 'anxiety', label: 'Angst / Panik', icon: '😰', priority: ['tipp', 'opposite-action', 'check-the-facts'] },
  { id: 'sadness', label: 'Traurigkeit / Depression', icon: '😢', priority: ['opposite-action', 'abc-please', 'ride-the-wave'] },
  { id: 'anger', label: 'Wut / Ärger', icon: '😠', priority: ['stop', 'opposite-action', 'check-the-facts'] },
  { id: 'overwhelm', label: 'Überforderung', icon: '😵', priority: ['stop', 'one-mindfully', 'tipp'] },
  { id: 'conflict', label: 'Konflikt / Streit', icon: '💢', priority: ['dear-man', 'give', 'stop'] },
  { id: 'boundary', label: 'Grenzen setzen', icon: '🛑', priority: ['dear-man', 'fast', 'check-the-facts'] },
  { id: 'rumination', label: 'Grübeln / Sorgen', icon: '🌀', priority: ['beobachten', 'one-mindfully', 'accepts'] },
  { id: 'shame', label: 'Scham / Schuld', icon: '😳', priority: ['opposite-action', 'check-the-facts', 'radical-acceptance'] },
  { id: 'urge', label: 'Starker Drang', icon: '⚡', priority: ['tipp', 'accepts', 'ride-the-wave'] },
  { id: 'loss', label: 'Verlust / Trauer', icon: '💔', priority: ['radical-acceptance', 'ride-the-wave', 'improve'] },
  { id: 'daily', label: 'Tägliche Übung', icon: '🌱', priority: ['beobachten', 'one-mindfully', 'abc-please'] }
]

/**
 * Intensitätsstufen
 */
export const intensityLevels = [
  { value: 1, label: 'Leicht', description: 'Unangenehm aber handelbar' },
  { value: 2, label: 'Mittel', description: 'Deutlich belastend' },
  { value: 3, label: 'Stark', description: 'Sehr belastend, schwer auszuhalten' },
  { value: 4, label: 'Extrem', description: 'Überwältigend, Krisenniveau' }
]

export default dbtSkills
