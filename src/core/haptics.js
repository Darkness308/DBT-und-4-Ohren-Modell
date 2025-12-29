/**
 * HAPTICS - Therapeutisches Vibrations-Feedback
 *
 * Basiert auf wissenschaftlichen Erkenntnissen:
 * - Apollo Neuroscience: Vagusnerv-Stimulation durch Vibration
 * - TouchPoints: BLAST-Technologie für Stress-Reduktion
 * - Lief: HRV-synchronisierte Haptik
 *
 * RICHTLINIEN:
 * - Weniger ist mehr (zu viel = Stress-Trigger)
 * - Synchron mit visueller Animation
 * - Immer deaktivierbar (sensorische Überempfindlichkeit)
 * - Niemals HeavyImpact in Krisen
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */

const haptics = {
  /**
   * Prüft ob Vibration verfügbar ist
   */
  isSupported() {
    return 'vibrate' in navigator
  },

  /**
   * Prüft ob Haptics aktiviert sind (User-Präferenz)
   */
  isEnabled() {
    const stored = localStorage.getItem('dbt-app-haptics')
    return stored !== 'disabled'
  },

  /**
   * Aktiviert/Deaktiviert Haptics
   */
  setEnabled(enabled) {
    localStorage.setItem('dbt-app-haptics', enabled ? 'enabled' : 'disabled')
  },

  /**
   * Basis-Vibration mit Fallback
   */
  vibrate(pattern) {
    if (!this.isSupported() || !this.isEnabled()) return false
    try {
      return navigator.vibrate(pattern)
    } catch {
      return false
    }
  },

  /**
   * Stoppt alle Vibrationen
   */
  stop() {
    if (this.isSupported()) {
      navigator.vibrate(0)
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // THERAPEUTISCHE PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sanfter Tap - Navigation, Menü-Auswahl
   * Entspricht Flutter: HapticFeedback.selectionClick()
   */
  light() {
    return this.vibrate(10)
  },

  /**
   * Bestätigung - Button-Klick, Erfolg
   * Entspricht Flutter: HapticFeedback.lightImpact()
   */
  confirm() {
    return this.vibrate(30)
  },

  /**
   * Wichtige Aktion - Skill anwenden, Speichern
   * Entspricht Flutter: HapticFeedback.mediumImpact()
   */
  action() {
    return this.vibrate(50)
  },

  /**
   * Warnung - Stress steigt, Grenze erreicht
   * Kurz und prägnant, nicht beängstigend
   */
  warning() {
    return this.vibrate([30, 50, 30])
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BERUHIGENDE MUSTER (Vagusnerv-Stimulation)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Herzschlag-Muster - Beruhigend, rhythmisch
   * Wie ein ruhiger Herzschlag: lub-dub ... lub-dub
   * Pattern: [start, vibrate, pause, vibrate]
   */
  calmPulse() {
    return this.vibrate([0, 20, 200, 20])
  },

  /**
   * Doppelter Herzschlag - Für tiefere Beruhigung
   * Längere Sequenz für Meditation/Imagination
   */
  heartbeat() {
    return this.vibrate([0, 20, 100, 20, 400, 20, 100, 20])
  },

  /**
   * Wellen-Muster - Steigt und fällt wie Atmung
   * Für Urge Surfing und Atemübungen
   */
  wave() {
    return this.vibrate([0, 10, 50, 20, 100, 30, 150, 30, 100, 20, 50, 10])
  },

  /**
   * Atem-Begleitung (4-4-6)
   * Sanfte Impulse zu Beginn jeder Phase
   */
  breatheCycle() {
    // Einatmen-Signal, Pause, Halten-Signal, Pause, Ausatmen-Signal
    return this.vibrate([
      0,
      30, // Einatmen starten
      4000, // 4s Einatmen (keine Vibration)
      30, // Halten starten
      4000, // 4s Halten
      30, // Ausatmen starten
      6000, // 6s Ausatmen
      50, // Ende-Feedback
    ])
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FEEDBACK-PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Erfolg - Skill angewendet, Stress gesunken
   * Aufsteigendes Muster (positiv)
   */
  success() {
    return this.vibrate([0, 20, 80, 30, 80, 40])
  },

  /**
   * Sanftes Ankommen - Nach Emergency zurück
   * Wie ein erleichtertes Aufatmen
   */
  relief() {
    return this.vibrate([0, 50, 200, 30, 300, 20])
  },

  /**
   * Grounding-Impuls - Kurz und erdend
   * Holt zurück ins Hier und Jetzt
   */
  ground() {
    return this.vibrate([0, 100])
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STRESS-ADAPTIVE PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Wählt automatisch passendes Pattern basierend auf Stress-Level
   */
  adaptiveConfirm(stressLevel) {
    if (stressLevel > 80) {
      // Notfall: Keine Vibration oder nur minimal
      return this.vibrate(10)
    }
    if (stressLevel > 60) {
      // Angespannt: Sanft und beruhigend
      return this.calmPulse()
    }
    if (stressLevel > 30) {
      // Aufmerksam: Standard-Bestätigung
      return this.confirm()
    }
    // Stabil: Normales Feedback
    return this.action()
  },

  /**
   * Skill-Anwendung mit Stress-adaptivem Feedback
   */
  skillApplied(stressLevel, effectiveness) {
    if (stressLevel > 80) {
      // Im Notfall: Minimal, dann beruhigend
      this.ground()
      setTimeout(() => this.calmPulse(), 500)
      return
    }

    if (effectiveness >= 4) {
      return this.success()
    }
    return this.confirm()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTINUOUS PATTERNS (für Übungen)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Startet wiederholenden Herzschlag
   * Für längere Beruhigungsphasen
   * @returns {number} Interval-ID zum Stoppen
   */
  startCalmLoop() {
    if (!this.isSupported() || !this.isEnabled()) return null

    this.heartbeat()
    return setInterval(() => {
      this.heartbeat()
    }, 1200) // Alle 1.2 Sekunden (50 BPM - ruhiger Puls)
  },

  /**
   * Stoppt den Calm Loop
   */
  stopCalmLoop(intervalId) {
    if (intervalId) {
      clearInterval(intervalId)
      this.stop()
    }
  },
}

export default haptics
