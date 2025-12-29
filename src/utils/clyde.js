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
   * Ermittelt das Stress-Level
   */
  getStressLevel(value) {
    if (value <= 30) return this.stressLevels.GREEN
    if (value <= 60) return this.stressLevels.YELLOW
    if (value <= 80) return this.stressLevels.ORANGE
    return this.stressLevels.RED
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

    // Skill-Erklärungen (Schüler-Level)
    explain: {
      tipp: {
        title: 'TIPP - Dein Körper-Reset',
        simple: 'Dein Gehirn ist gerade im Alarm-Modus. TIPP schaltet den Alarm aus.',
        science: 'Das ist Neurobiologie: Kälte aktiviert deinen Tauchreflex. Dein Herzschlag verlangsamt sich automatisch.',
        steps: [
          'Kaltes Wasser ins Gesicht (10-30 Sekunden)',
          'Oder: Eiswürfel in die Hände',
          'Der Körper macht den Rest'
        ]
      },
      atmung: {
        title: '4-4-6 Atmung',
        simple: 'Langsames Ausatmen signalisiert deinem Körper: Keine Gefahr.',
        science: 'Das aktiviert deinen Parasympathikus - den "Ruhe-Nerv".',
        steps: [
          '4 Sekunden einatmen',
          '4 Sekunden halten',
          '6 Sekunden ausatmen'
        ]
      },
      grounding: {
        title: '5-4-3-2-1 Grounding',
        simple: 'Deine Sinne holen dich ins Jetzt zurück.',
        science: 'Dissoziation bedeutet: Du bist nicht hier. Sinnesreize bringen dich zurück.',
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
   * Tooltips mit Schüler-Erklärungen
   */
  tooltips: {
    stressLevel: {
      title: 'Stress-Level',
      text: 'Wie angespannt bist du gerade? 0 = total entspannt, 100 = maximale Anspannung.',
      example: '40% = "Ich merke Anspannung, kann aber noch klar denken"'
    },
    skillMatch: {
      title: 'Skill-Matching',
      text: 'Nicht jeder Skill passt zu jedem Stress-Level. Bei 90% hilft Journaling nicht mehr.',
      example: 'ROT (80-100%): Körper-Skills wie TIPP. GRÜN (0-30%): Reflexion möglich.'
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
  }
}

export default clyde
