/**
 * VierOhrenAnalyzerAgent
 * Analysiert Aussagen nach dem Vier-Ohren-Modell (Schulz von Thun)
 *
 * Die vier Ebenen:
 * - Sachebene: Worüber informiere ich?
 * - Selbstoffenbarung: Was gebe ich von mir preis?
 * - Beziehungsebene: Was halte ich vom anderen?
 * - Appellseite: Wozu möchte ich veranlassen?
 */

import { vierOhrenExamples } from '../data/vierOhrenExamples'
import eventBus from '../utils/eventBus'

class VierOhrenAnalyzerAgent {
  constructor() {
    this.examples = vierOhrenExamples
    this.analysisHistory = []
  }

  /**
   * Analysiert eine Aussage nach dem Vier-Ohren-Modell
   * @param {Object} input - { statement, context?, perspective? }
   * @returns {Object} Analyse-Objekt
   */
  analyzeStatement(input) {
    const { statement, context = '', perspective = 'receiver' } = input

    if (!statement || statement.trim().length === 0) {
      return {
        error: 'Bitte gib eine Aussage ein.',
        success: false
      }
    }

    // Prüfen ob es ein bekanntes Beispiel ist
    const knownExample = this.findMatchingExample(statement)
    if (knownExample) {
      return {
        ...knownExample.analysis,
        isExample: true,
        originalStatement: statement,
        context,
        perspective,
        success: true
      }
    }

    // Generische Analyse für unbekannte Aussagen
    const analysis = this.generateGenericAnalysis(statement, context, perspective)

    // Event auslösen
    eventBus.emit('vier-ohren:analyzed', {
      statement,
      timestamp: new Date().toISOString()
    })

    // In History speichern
    this.analysisHistory.push({
      input,
      analysis,
      timestamp: new Date().toISOString()
    })

    return {
      ...analysis,
      isExample: false,
      originalStatement: statement,
      context,
      perspective,
      success: true
    }
  }

  /**
   * Findet ein passendes Beispiel
   */
  findMatchingExample(statement) {
    const normalizedInput = statement.toLowerCase().trim()
    return this.examples.find(example =>
      example.statement.toLowerCase().trim() === normalizedInput ||
      normalizedInput.includes(example.statement.toLowerCase().trim())
    )
  }

  /**
   * Generiert eine generische Analyse
   */
  generateGenericAnalysis(statement, _context, _perspective) {
    return {
      sachebene: {
        content: `Die Aussage "${statement}" enthält eine Information oder Feststellung.`,
        certainty: 0.6
      },
      selbstoffenbarung: {
        interpretations: [
          { text: 'Der Sender teilt eine Beobachtung oder Meinung mit', likelihood: 0.7 },
          { text: 'Der Sender möchte gehört werden', likelihood: 0.6 },
          { text: 'Der Sender hat ein bestimmtes Gefühl dabei', likelihood: 0.5 }
        ]
      },
      beziehungsebene: {
        interpretations: [
          { text: 'Der Sender wendet sich an den Empfänger', likelihood: 0.7 },
          { text: 'Es gibt eine Erwartungshaltung', likelihood: 0.5 },
          { text: 'Die Beziehung zum Empfänger spielt eine Rolle', likelihood: 0.6 }
        ]
      },
      appellseite: {
        interpretations: [
          { text: 'Der Sender möchte eine Reaktion', likelihood: 0.7 },
          { text: 'Es gibt einen impliziten Wunsch', likelihood: 0.5 },
          { text: 'Der Empfänger soll etwas tun oder verstehen', likelihood: 0.6 }
        ]
      },
      potentialForMisunderstanding: 0.5,
      suggestions: [
        'Nachfragen, was genau gemeint ist',
        'Die eigene Interpretation mitteilen und abgleichen',
        'Alle vier Ebenen bewusst wahrnehmen',
        'Nicht nur auf eine Ebene (z.B. Beziehung) hören'
      ],
      note: 'Dies ist eine generische Analyse. Für tiefere Einsichten hilft es, den genauen Kontext und die Beziehung zwischen Sender und Empfänger zu berücksichtigen.'
    }
  }

  /**
   * Gibt Beispiele für eine Kategorie zurück
   * @param {string} category - z.B. "alltag", "arbeit"
   * @returns {Array} Array von Beispielen
   */
  getExamples(category = null) {
    if (!category) {
      return this.examples
    }
    return this.examples.filter(example => example.category === category)
  }

  /**
   * Generiert eine Übungsaufgabe
   * @param {number} difficulty - 1-3
   * @returns {Object} Übungsaufgabe mit Lösung
   */
  generateExercise(difficulty = 1) {
    const shuffled = [...this.examples].sort(() => Math.random() - 0.5)
    const example = shuffled[0]

    return {
      id: `exercise-${Date.now()}`,
      difficulty,
      statement: example.statement,
      context: example.context,
      task: 'Analysiere diese Aussage nach dem Vier-Ohren-Modell. Was könnten die verschiedenen Ebenen sein?',
      hints: difficulty === 1 ? [
        'Sachebene: Was ist der reine Informationsgehalt?',
        'Selbstoffenbarung: Was verrät der Sender über sich?',
        'Beziehung: Was sagt das über die Beziehung aus?',
        'Appell: Was soll der Empfänger tun?'
      ] : [],
      solution: example.analysis
    }
  }

  /**
   * Validiert eine Nutzerantwort auf eine Übung
   * @param {Object} exercise - Die Übungsaufgabe
   * @param {Object} answer - Die Nutzerantwort
   * @returns {Object} Feedback-Objekt
   */
  validateUserAnswer(exercise, answer) {
    const feedback = {
      overall: 'good',
      details: {},
      encouragement: ''
    }

    // Einfaches Feedback basierend auf Vollständigkeit
    const levels = ['sachebene', 'selbstoffenbarung', 'beziehungsebene', 'appellseite']
    let completedLevels = 0

    levels.forEach(level => {
      if (answer[level] && answer[level].trim().length > 0) {
        completedLevels++
        feedback.details[level] = {
          provided: true,
          hint: `Vergleiche deine Antwort mit: ${exercise.solution[level].content || exercise.solution[level].interpretations?.[0]?.text}`
        }
      } else {
        feedback.details[level] = {
          provided: false,
          hint: `Denke darüber nach: ${this.getLevelQuestion(level)}`
        }
      }
    })

    if (completedLevels === 4) {
      feedback.overall = 'excellent'
      feedback.encouragement = 'Toll! Du hast alle vier Ebenen berücksichtigt. Das ist eine wichtige Fähigkeit für bessere Kommunikation.'
    } else if (completedLevels >= 2) {
      feedback.overall = 'good'
      feedback.encouragement = 'Guter Ansatz! Versuche noch die fehlenden Ebenen zu berücksichtigen.'
    } else {
      feedback.overall = 'needs_work'
      feedback.encouragement = 'Das Vier-Ohren-Modell braucht Übung. Keine Sorge - mit der Zeit wird es leichter!'
    }

    return feedback
  }

  /**
   * Hilfsfunktion: Frage für eine Ebene
   */
  getLevelQuestion(level) {
    const questions = {
      sachebene: 'Worüber wird informiert?',
      selbstoffenbarung: 'Was verrät der Sender über sich selbst?',
      beziehungsebene: 'Was sagt das über die Beziehung aus?',
      appellseite: 'Was soll der Empfänger tun oder denken?'
    }
    return questions[level] || ''
  }

  /**
   * Gibt die Analyse-Historie zurück
   */
  getHistory() {
    return this.analysisHistory
  }

  /**
   * Löscht die Analyse-Historie
   */
  clearHistory() {
    this.analysisHistory = []
  }
}

// Singleton-Instanz exportieren
export const vierOhrenAnalyzer = new VierOhrenAnalyzerAgent()
export default vierOhrenAnalyzer
