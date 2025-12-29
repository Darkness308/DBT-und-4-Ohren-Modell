import { useEffect, useCallback } from 'react'
import clyde from '../../utils/clyde'

/**
 * Emergency Overlay - Aktiviert bei Stress > 90%
 *
 * Reduziert alles auf das Wesentliche:
 * - Klare Anweisung
 * - Ein Skill (TIPP)
 * - Ein Button zum Zurückkehren
 *
 * Clyde übernimmt die Führung.
 */
export default function EmergencyOverlay({ stressLevel, onExit }) {
  // Nur anzeigen bei extremem Stress
  const isActive = stressLevel >= 90

  // ESC zum Beenden (falls Nutzer wieder klar denken kann)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isActive) {
        onExit?.()
      }
    },
    [isActive, onExit]
  )

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown)
      // Body-Scroll verhindern
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isActive, handleKeyDown])

  if (!isActive) return null

  return (
    <div
      className="emergency-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
      aria-describedby="emergency-desc"
    >
      {/* Hauptinhalt - Zentriert, Fokus auf Essenz */}
      <div className="emergency-content">
        {/* STOPP - Großer Anker */}
        <h1 id="emergency-title" className="emergency-title">
          STOPP.
        </h1>

        {/* Clyde spricht */}
        <p id="emergency-desc" className="emergency-message">
          {clyde.voice.emergency.stop}
        </p>

        {/* Der eine Skill */}
        <div className="emergency-skill">
          <span className="emergency-skill-icon">🧊</span>
          <div className="emergency-skill-text">
            <span className="emergency-skill-name">EISWASSER (TIPP)</span>
            <span className="emergency-skill-hint">
              Kaltes Wasser ins Gesicht. 10 Sekunden. Mehr nicht.
            </span>
          </div>
        </div>

        {/* Alternative */}
        <div className="emergency-alternative">
          <span>Kein Wasser?</span>
          <span className="emergency-alt-options">
            Eiswürfel greifen · Igelball · Ammoniak riechen
          </span>
        </div>

        {/* Zurück-Button */}
        <button
          onClick={onExit}
          className="emergency-exit-btn"
          autoFocus
          aria-label="Notfall-Modus beenden und zur App zurückkehren"
        >
          ICH BIN WIEDER DA
        </button>

        {/* Clyde's Nordstern */}
        <p className="emergency-nordstern">{clyde.voice.emergency.here}</p>
      </div>

      {/* Escape-Hinweis */}
      <div className="emergency-escape-hint">
        <kbd>ESC</kbd> zum Schließen
      </div>
    </div>
  )
}
