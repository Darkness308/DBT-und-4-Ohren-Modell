/**
 * Beispiele für das Vier-Ohren-Modell
 * Basierend auf Schulz von Thun (1981)
 */

export const vierOhrenExamples = [
  {
    id: 'ampel',
    statement: 'Die Ampel ist grün.',
    context: 'Partner/in sagt das während der Autofahrt zum Fahrer/zur Fahrerin',
    category: 'alltag',
    analysis: {
      sachebene: {
        content: 'Die Ampel zeigt grünes Licht an.',
        certainty: 0.95,
      },
      selbstoffenbarung: {
        interpretations: [
          { text: 'Ich beobachte die Ampel aufmerksam', likelihood: 0.7 },
          { text: 'Ich habe es eilig', likelihood: 0.6 },
          { text: 'Ich bin ungeduldig', likelihood: 0.5 },
          { text: 'Ich möchte hilfreich sein', likelihood: 0.4 },
        ],
      },
      beziehungsebene: {
        interpretations: [
          { text: 'Ich helfe dir beim Fahren', likelihood: 0.5 },
          { text: 'Du brauchst Hinweise von mir', likelihood: 0.5 },
          { text: 'Du fährst zu langsam / unaufmerksam', likelihood: 0.6 },
          { text: 'Ich traue dir das Fahren nicht zu', likelihood: 0.3 },
        ],
      },
      appellseite: {
        interpretations: [
          { text: 'Fahr los!', likelihood: 0.85 },
          { text: 'Achte auf die Ampel!', likelihood: 0.5 },
          { text: 'Gib Gas!', likelihood: 0.4 },
        ],
      },
      potentialForMisunderstanding: 0.7,
      suggestions: [
        'Nachfragen: "Meinst du, ich soll losfahren?"',
        'Perspektivwechsel: Wie könnte der Sender es gemeint haben?',
        'Eigene Reaktion beobachten: Welches "Ohr" habe ich gerade besonders aktiv?',
      ],
    },
  },
  {
    id: 'essen',
    statement: 'Das Essen ist salzig.',
    context: 'Beim gemeinsamen Abendessen sagt ein Partner zum anderen',
    category: 'alltag',
    analysis: {
      sachebene: {
        content: 'Das Gericht enthält viel Salz.',
        certainty: 0.9,
      },
      selbstoffenbarung: {
        interpretations: [
          { text: 'Ich schmecke das Salz sehr intensiv', likelihood: 0.8 },
          { text: 'Mir ist es zu salzig', likelihood: 0.7 },
          { text: 'Ich bin überrascht vom Geschmack', likelihood: 0.4 },
          { text: 'Ich achte auf meine Ernährung', likelihood: 0.3 },
        ],
      },
      beziehungsebene: {
        interpretations: [
          { text: 'Du hast versalzen (Kritik)', likelihood: 0.5 },
          { text: 'Ich teile meine Wahrnehmung mit dir', likelihood: 0.6 },
          { text: 'Du kannst nicht kochen', likelihood: 0.3 },
          { text: 'Ich schätze deine Mühe, aber...', likelihood: 0.4 },
        ],
      },
      appellseite: {
        interpretations: [
          { text: 'Beim nächsten Mal weniger Salz verwenden', likelihood: 0.6 },
          { text: 'Nimm es nicht persönlich', likelihood: 0.3 },
          { text: 'Gib mir Wasser', likelihood: 0.2 },
        ],
      },
      potentialForMisunderstanding: 0.65,
      suggestions: [
        'Nachfragen: "Ist es dir zu salzig?"',
        'Ich-Botschaft nutzen: "Für meinen Geschmack ist es etwas zu salzig"',
        'Kontext beachten: Wer hat gekocht? Wie ist die Stimmung?',
      ],
    },
  },
  {
    id: 'zeit',
    statement: 'Du bist spät dran.',
    context: 'Ein Freund/eine Freundin bei einer Verabredung',
    category: 'alltag',
    analysis: {
      sachebene: {
        content: 'Du bist später als vereinbart angekommen.',
        certainty: 0.95,
      },
      selbstoffenbarung: {
        interpretations: [
          { text: 'Ich habe gewartet', likelihood: 0.8 },
          { text: 'Ich bin ungeduldig/genervt', likelihood: 0.6 },
          { text: 'Mir ist Pünktlichkeit wichtig', likelihood: 0.7 },
          { text: 'Ich habe mir Sorgen gemacht', likelihood: 0.4 },
        ],
      },
      beziehungsebene: {
        interpretations: [
          { text: 'Du bist unzuverlässig', likelihood: 0.5 },
          { text: 'Meine Zeit ist dir nicht wichtig', likelihood: 0.6 },
          { text: 'Ich bin dir wichtig genug um zu warten', likelihood: 0.3 },
          { text: 'Du respektierst mich nicht', likelihood: 0.4 },
        ],
      },
      appellseite: {
        interpretations: [
          { text: 'Sei das nächste Mal pünktlicher!', likelihood: 0.7 },
          { text: 'Entschuldige dich!', likelihood: 0.5 },
          { text: 'Erkläre mir, warum du spät bist!', likelihood: 0.4 },
        ],
      },
      potentialForMisunderstanding: 0.75,
      suggestions: [
        'Perspektivwechsel: Vielleicht gab es einen guten Grund für die Verspätung',
        'Eigene Gefühle kommunizieren: "Ich habe mir Sorgen gemacht"',
        'Verständnis signalisieren, bevor man kritisiert',
      ],
    },
  },
]

/**
 * Kategorien für Beispiele
 */
export const exampleCategories = [
  { value: 'alltag', label: 'Alltag' },
  { value: 'arbeit', label: 'Arbeit' },
  { value: 'beziehung', label: 'Beziehung' },
  { value: 'familie', label: 'Familie' },
]

/**
 * Beschreibungen der vier Ebenen
 */
export const vierOhrenDescriptions = {
  sachebene: {
    name: 'Sachebene',
    icon: '🔵',
    color: 'blue',
    question: 'Worüber informiere ich?',
    description: 'Der reine Sachinhalt der Nachricht - Fakten, Daten, Informationen.',
  },
  selbstoffenbarung: {
    name: 'Selbstoffenbarung',
    icon: '🟢',
    color: 'green',
    question: 'Was gebe ich von mir preis?',
    description: 'Was der Sender über sich selbst verrät - Gefühle, Werte, Bedürfnisse.',
  },
  beziehungsebene: {
    name: 'Beziehungsebene',
    icon: '🟡',
    color: 'yellow',
    question: 'Was halte ich vom anderen?',
    description: 'Wie der Sender zum Empfänger steht und was er von ihm hält.',
  },
  appellseite: {
    name: 'Appellseite',
    icon: '🔴',
    color: 'red',
    question: 'Wozu möchte ich veranlassen?',
    description: 'Was der Sender beim Empfänger erreichen oder bewirken möchte.',
  },
}

export default vierOhrenExamples
