import { useState, useEffect } from 'react'
import haptics from '../../core/haptics'

/**
 * HapticsToggle - Einstellung für Vibrations-Feedback
 *
 * Wichtig für Barrierefreiheit:
 * - Sensorische Überempfindlichkeit respektieren
 * - Nutzer-Kontrolle über alle Vibrationen
 */
export default function HapticsToggle() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    setIsEnabled(haptics.isEnabled())
    setIsSupported(haptics.isSupported())
  }, [])

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    haptics.setEnabled(newState)

    // Feedback geben wenn aktiviert
    if (newState) {
      haptics.confirm()
    }
  }

  if (!isSupported) {
    return (
      <div className="haptics-toggle opacity-50">
        <div className="haptics-toggle-label">
          <span className="haptics-toggle-icon">📳</span>
          <div>
            <span className="haptics-toggle-text">Vibrations-Feedback</span>
            <p className="haptics-toggle-hint">Nicht unterstützt auf diesem Gerät</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="haptics-toggle">
      <div className="haptics-toggle-label">
        <span className="haptics-toggle-icon">📳</span>
        <div>
          <span className="haptics-toggle-text">Vibrations-Feedback</span>
          <p className="haptics-toggle-hint">
            {isEnabled
              ? 'Sanfte Vibrationen bei Aktionen'
              : 'Keine Vibrationen (für sensorische Empfindlichkeit)'}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`toggle-switch ${isEnabled ? 'on' : 'off'}`}
        role="switch"
        aria-checked={isEnabled}
        aria-label="Vibrations-Feedback ein/ausschalten"
      >
        <span className="toggle-switch-knob" />
      </button>
    </div>
  )
}

/**
 * HapticsTest - Zum Testen der verschiedenen Patterns
 * Nur für Entwicklung/Debug
 */
export function HapticsTest() {
  const patterns = [
    { name: 'Light', fn: () => haptics.light() },
    { name: 'Confirm', fn: () => haptics.confirm() },
    { name: 'Action', fn: () => haptics.action() },
    { name: 'Warning', fn: () => haptics.warning() },
    { name: 'Calm Pulse', fn: () => haptics.calmPulse() },
    { name: 'Heartbeat', fn: () => haptics.heartbeat() },
    { name: 'Wave', fn: () => haptics.wave() },
    { name: 'Success', fn: () => haptics.success() },
    { name: 'Relief', fn: () => haptics.relief() },
    { name: 'Ground', fn: () => haptics.ground() },
  ]

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-sm text-gray-500 uppercase">Haptics Test</h3>
      <div className="grid grid-cols-2 gap-2">
        {patterns.map((p) => (
          <button
            key={p.name}
            onClick={p.fn}
            className="btn-secondary px-3 py-2 text-sm rounded-lg"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
