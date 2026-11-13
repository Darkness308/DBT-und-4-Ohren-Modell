/**
 * Inhalte für das Vier-Ohren-Modul (Vier-Seiten-Modell, Schulz von Thun 1981)
 *
 * Die Beispiele sind Übungssätze zum Ausprobieren. Sie enthalten bewusst
 * keine vorgefertigte Deutung: Die Deutung trägt jede Person selbst ein.
 */

export const vierOhrenExamples = [
  {
    id: 'ampel',
    statement: 'Die Ampel ist grün.',
    context: 'Autofahrt. Die Person auf dem Beifahrersitz sagt das zur Person am Steuer.',
  },
  {
    id: 'essen',
    statement: 'Das Essen ist salzig.',
    context: 'Gemeinsames Abendessen. Eine Person hat gekocht.',
  },
  {
    id: 'spaet',
    statement: 'Du bist spät dran.',
    context: 'Verabredung. Eine Person kommt nach der vereinbarten Zeit an.',
  },
]

/**
 * Die vier Seiten einer Nachricht.
 * Je Rolle eine eigene Leitfrage: gemeint (sender) und gehört (receiver).
 */
export const vierOhrenDescriptions = {
  sachebene: {
    name: 'Sachebene',
    icon: '🔵',
    color: 'blue',
    description: 'Der reine Sachinhalt: Fakten, Daten, Informationen.',
    questions: {
      sender: 'Worüber wollte ich informieren?',
      receiver: 'Welche Sachinformation habe ich verstanden?',
    },
  },
  selbstoffenbarung: {
    name: 'Selbstoffenbarung',
    icon: '🟢',
    color: 'green',
    description: 'Was die sprechende Person über sich zeigt: Gefühle, Bedürfnisse, Zustand.',
    questions: {
      sender: 'Was ging in mir vor, als ich das gesagt habe?',
      receiver: 'Was dachte ich, was in dir vorgeht?',
    },
  },
  beziehungsebene: {
    name: 'Beziehungsebene',
    icon: '🟡',
    color: 'yellow',
    description: 'Wie die sprechende Person zur anderen steht.',
    questions: {
      sender: 'Wie stand ich in dem Moment zu dir?',
      receiver: 'Was habe ich darüber gehört, wie du zu mir stehst?',
    },
  },
  appellseite: {
    name: 'Appellseite',
    icon: '🔴',
    color: 'red',
    description: 'Was die sprechende Person erreichen möchte.',
    questions: {
      sender: 'Was habe ich mir von dir gewünscht?',
      receiver: 'Was dachte ich, was ich tun soll?',
    },
  },
}

export const roleDescriptions = {
  sender: {
    label: 'Ich habe es gesagt',
    short: 'gemeint',
    heading: 'So habe ich es gemeint',
  },
  receiver: {
    label: 'Ich habe es gehört',
    short: 'gehört',
    heading: 'So habe ich es gehört',
  },
}

export default vierOhrenExamples
