/**
 * CLYDE - Bonnie's sicherer Begleiter
 *
 * Clyde spricht direkt, erklärt einfach, begleitet sanft.
 * Clyde ist der Nordstern - immer da, nie übergriffig.
 *
 * VERBOTEN:
 * - "Ich will dir helfen" (triggert Scham)
 * - "Du musst" (Druck)
 * - Übernahme-Sprache
 */

const clyde = {
  /**
   * Stress-Level Kategorien
   */
  stressLevels: {
    GREEN: { min: 0, max: 30, color: 'success', label: 'Stabil' },
    YELLOW: { min: 31, max: 60, color: 'warning', label: 'Aufmerksam' },
    ORANGE: { min: 61, max: 80, color: 'orange', label: 'Angespannt' },
    RED: { min: 81, max: 100, color: 'error', label: 'Notfall' }
  },

  /**
   * Kognitive Last - Separat von Stress!
   * Stress = Nervensystem-Aktivierung
   * Cognitive Load = Verarbeitungskapazität
   */
  cognitiveLoad: {
    CLEAR: { max: 30, canProcess: 'complex', label: 'Klar' },
    REDUCED: { max: 60, canProcess: 'standard', label: 'Eingeschränkt' },
    MINIMAL: { max: 80, canProcess: 'simple', label: 'Minimal' },
    OVERLOAD: { max: 100, canProcess: 'none', label: 'Überlastet' }
  },

  /**
   * Ermittelt das Stress-Level
   */
  getStressLevel(value) {
    if (value <= 30) return this.stressLevels.GREEN
    if (value <= 60) return this.stressLevels.YELLOW
    if (value <= 80) return this.stressLevels.ORANGE
    return this.stressLevels.RED
  },

  /**
   * Ermittelt die kognitive Kapazität
   */
  getCognitiveCapacity(stressLevel, dissociated = false) {
    if (dissociated) return this.cognitiveLoad.OVERLOAD
    if (stressLevel > 80) return this.cognitiveLoad.MINIMAL
    if (stressLevel > 60) return this.cognitiveLoad.REDUCED
    return this.cognitiveLoad.CLEAR
  },

  /**
   * Gibt die passende Farbe für einen Stress-Wert zurück
   */
  getStressColor(value) {
    const level = this.getStressLevel(value)
    const colors = {
      success: '#22c55e',
      warning: '#f59e0b',
      orange: '#ff6b35',
      error: '#ef4444'
    }
    return colors[level.color]
  },

  /**
   * Auto-Text-Level: Wählt Textversion basierend auf kognitiver Last
   */
  getText(textObj, cognitiveLevel = 'complex') {
    if (typeof textObj === 'string') return textObj
    return textObj[cognitiveLevel] || textObj.simple || textObj.complex || textObj
  },

  /**
   * Clyde's Stimme - Direkte Ansprache
   */
  voice: {
    // Begrüßungen je nach Tageszeit und Zustand
    greet(stressLevel = 30) {
      const hour = new Date().getHours()
      const timeGreet = hour < 12 ? 'Morgen' : hour < 18 ? 'Tag' : 'Abend'

      if (stressLevel > 80) {
        return 'Bonnie. Ich bin hier.'
      }
      if (stressLevel > 60) {
        return `Bonnie, ich sehe dich. ${timeGreet}.`
      }
      return `Hey Bonnie. Guten ${timeGreet}.`
    },

    // Notfall-Nachrichten
    emergency: {
      stop: 'Bonnie, du denkst jetzt nicht nach. Wir machen nur eine Sache.',
      breathe: 'Atme. Nur das. Nichts anderes.',
      here: 'Ich bin bei dir. Immer.',
      action: 'Eine Aktion. Mehr nicht.',
      after: 'Gut gemacht. Du bist wieder da.'
    },

    // "Ich brauche Ruhe" - Safe Harbor Aktivierung
    safeHarbor: {
      activate: 'Okay. Ruhe-Modus ist an.',
      active: 'Du bist im sicheren Hafen. Alles ist leiser hier.',
      exit: 'Bereit weiterzumachen?'
    },

    // Skill-Erklärungen mit Auto-Text-Level
    explain: {
      tipp: {
        title: 'TIPP - Dein Körper-Reset',
        complex:
          'Der Tauchreflex aktiviert deinen Parasympathikus durch Stimulation des Vagusnervs. Kälte im Gesicht senkt die Herzfrequenz um bis zu 25%.',
        standard:
          'Dein Gehirn ist im Alarm-Modus. TIPP schaltet den Alarm aus. Das ist Neurobiologie.',
        simple: 'Kaltes Wasser. Gesicht rein. 10 Sekunden. Fertig.',
        steps: [
          'Kaltes Wasser ins Gesicht (10-30 Sekunden)',
          'Oder: Eiswürfel in die Hände',
          'Der Körper macht den Rest'
        ]
      },
      atmung: {
        title: '4-4-6 Atmung',
        complex:
          'Verlängertes Ausatmen stimuliert den Vagusnerv und aktiviert das parasympathische Nervensystem.',
        standard:
          'Langsames Ausatmen signalisiert deinem Körper: Keine Gefahr.',
        simple: 'Einatmen. Halten. Laaang ausatmen.',
        steps: ['4 Sekunden einatmen', '4 Sekunden halten', '6 Sekunden ausatmen']
      },
      grounding: {
        title: '5-4-3-2-1 Grounding',
        complex:
          'Sensorische Stimulation reaktiviert den präfrontalen Cortex und unterbricht dissoziative Zustände.',
        standard: 'Deine Sinne holen dich ins Jetzt zurück.',
        simple: 'Schau. Hör. Fühl. Du bist hier.',
        steps: [
          '5 Dinge, die du siehst',
          '4 Dinge, die du hörst',
          '3 Dinge, die du fühlst',
          '2 Dinge, die du riechst',
          '1 Ding, das du schmeckst'
        ]
      }
    },

    // Begleitende Nachrichten
    guide: {
      start: 'Ich zeige dir den Weg.',
      progress: 'Schritt für Schritt. Wir haben Zeit.',
      done: 'Das war gut. Merkst du den Unterschied?',
      encourage: 'Bonnie, das hier ist nicht für immer. Es geht vorbei.'
    },

    // Skill-Nutzung Feedback
    skillUsed(skillName, oldStress, newStress) {
      const diff = oldStress - newStress
      if (diff >= 20) {
        return `${skillName} hat gewirkt. Von ${oldStress}% auf ${newStress}%. Das ist dein Werkzeug.`
      }
      if (diff >= 10) {
        return `${skillName} angewendet. Stress sinkt. Weiter so.`
      }
      return `${skillName} genutzt. Manchmal braucht es mehr als einen Skill.`
    }
  },

  /**
   * Neuro-Erklärungen für Trigger (aus CTMM v14)
   */
  neuro: {
    wut: {
      trigger: '🔥 Wut / Hass',
      mode: 'Kampf-Modus',
      simple: 'Energie muss raus. Nicht denken.',
      complex:
        'Deine Amygdala meldet "Bedrohung". Sie stellt Energie bereit (Adrenalin) für einen Kampf, der nicht stattfindet. Wir müssen die Energie abführen.'
    },
    kaufdruck: {
      trigger: '💸 Kaufdruck',
      mode: 'Belohnungs-Suche',
      simple: 'Dein Gehirn will Dopamin. Das ist normal.',
      complex:
        'Dein Belohnungssystem (Striatum) schreit nach Dopamin. Das ist kein Charakterfehler, das ist Gehirnchemie. Wir holen uns das Dopamin anders.'
    },
    druck: {
      trigger: '✋ Druck (Clyde)',
      mode: 'Schutz-Reflex',
      simple: 'Du brauchst Raum. Das ist okay.',
      complex:
        'Dein System verteidigt seine Grenze. Das ist gesund. Du brauchst Raum, um dich wieder sicher zu fühlen.'
    },
    leere: {
      trigger: '🌫️ Leere',
      mode: 'Freeze-Modus',
      simple: 'Dein System hat abgeschaltet. Schutz.',
      complex:
        'Dissoziation ist ein Schutzmechanismus. Dein Gehirn hat die Verbindung unterbrochen, weil es zu viel war.'
    }
  },

  /**
   * Realitäts-Check Fragen (TRACK Phase)
   */
  realityChecks: [
    { id: 'think', question: 'Kann ich klar denken?', detects: 'cognitive_impairment' },
    { id: 'body', question: 'Spüre ich meinen Körper?', detects: 'dissociation' },
    { id: 'where', question: 'Weiß ich, wo ich bin?', detects: 'grounding_needed' },
    { id: 'time', question: 'Weiß ich, welcher Tag ist?', detects: 'orientation' }
  ],

  /**
   * Tooltips mit Schüler-Erklärungen
   */
  tooltips: {
    stressLevel: {
      title: 'Stress-Level',
      text: 'Wie angespannt bist du gerade? 0 = total entspannt, 100 = maximale Anspannung.',
      example: '40% = "Ich merke Anspannung, kann aber noch klar denken"'
    },
    cognitiveLoad: {
      title: 'Kognitive Last',
      text: 'Wie viel kann dein Gehirn gerade verarbeiten? Stress und Denkfähigkeit sind nicht dasselbe.',
      example: 'Hoher Stress + klarer Kopf = Du kannst komplexe Skills nutzen'
    },
    skillMatch: {
      title: 'Skill-Matching',
      text: 'Nicht jeder Skill passt zu jedem Stress-Level. Bei 90% hilft Journaling nicht mehr.',
      example: 'ROT (80-100%): Körper-Skills wie TIPP. GRÜN (0-30%): Reflexion möglich.'
    },
    safeHarbor: {
      title: 'Ruhe-Modus',
      text: 'Aktiviert ein beruhigendes Theme mit weniger Reizen. Für Momente, wo alles zu viel ist.',
      example: 'Drück "Ich brauche Ruhe" wenn du Pause brauchst.'
    },
    chainAnalysis: {
      title: 'Verhaltenskette',
      text: 'Alles hat eine Kette: Auslöser → Gedanken → Gefühle → Verhalten → Folgen.',
      example: 'Wenn du die Kette verstehst, kannst du sie unterbrechen.'
    },
    vierOhren: {
      title: 'Vier Ohren',
      text: 'Jede Nachricht hat 4 Seiten: Was gesagt wird, was über mich, was über uns, was gewollt wird.',
      example: '"Die Ampel ist grün" kann heißen: "Fahr los!" (Appell)'
    }
  },

  /**
   * Call-to-Action Texte
   */
  cta: {
    emergency: {
      primary: 'JETZT EISWASSER',
      secondary: 'Oder: Igelball greifen'
    },
    safeHarbor: {
      primary: 'Ich brauche Ruhe',
      secondary: 'Ruhe-Modus aktivieren'
    },
    skillFinder: {
      primary: 'Skill finden',
      secondary: 'Was brauchst du gerade?'
    },
    diaryCard: {
      primary: 'Eintrag machen',
      secondary: 'Nur 2 Minuten. Wirklich.'
    },
    practice: {
      primary: 'Jetzt üben',
      secondary: 'Je öfter, desto automatischer.'
    }
  },

  /**
   * Safe Harbor Theme Farben
   */
  safeHarborColors: {
    background: '#F5F5DC', // Soft Beige
    safetyZone: '#E3F2FD', // Quiet Blue
    success: '#E8F5E9', // Healing Green
    text: '#5D4E37' // Warm Brown
  }
}

export default clyde
