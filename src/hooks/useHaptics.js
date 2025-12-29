import { useCallback, useRef, useEffect } from 'react'
import haptics from '../utils/haptics'

/**
 * useHaptics - React Hook für therapeutisches Vibrations-Feedback
 *
 * Bietet einfachen Zugriff auf Haptics mit:
 * - Automatische Stress-Adaption
 * - Cleanup bei Unmount
 * - Memoized Callbacks
 *
 * @param {number} stressLevel - Aktueller Stress-Level (0-100)
 * @returns {Object} Haptics-Methoden
 */
export default function useHaptics(stressLevel = 50) {
  const calmLoopRef = useRef(null)

  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      if (calmLoopRef.current) {
        haptics.stopCalmLoop(calmLoopRef.current)
      }
    }
  }, [])

  /**
   * Sanfter Tap für Navigation
   */
  const tap = useCallback(() => {
    haptics.light()
  }, [])

  /**
   * Bestätigung für Aktionen
   */
  const confirm = useCallback(() => {
    haptics.confirm()
  }, [])

  /**
   * Wichtige Aktion
   */
  const action = useCallback(() => {
    haptics.action()
  }, [])

  /**
   * Warnung
   */
  const warn = useCallback(() => {
    haptics.warning()
  }, [])

  /**
   * Stress-adaptive Bestätigung
   */
  const adaptiveConfirm = useCallback(() => {
    haptics.adaptiveConfirm(stressLevel)
  }, [stressLevel])

  /**
   * Skill wurde angewendet
   */
  const skillApplied = useCallback(
    (effectiveness = 3) => {
      haptics.skillApplied(stressLevel, effectiveness)
    },
    [stressLevel]
  )

  /**
   * Beruhigende Impulse starten
   */
  const startCalming = useCallback(() => {
    if (calmLoopRef.current) {
      haptics.stopCalmLoop(calmLoopRef.current)
    }
    calmLoopRef.current = haptics.startCalmLoop()
  }, [])

  /**
   * Beruhigende Impulse stoppen
   */
  const stopCalming = useCallback(() => {
    if (calmLoopRef.current) {
      haptics.stopCalmLoop(calmLoopRef.current)
      calmLoopRef.current = null
    }
  }, [])

  /**
   * Einmaliger Calm Pulse
   */
  const calmPulse = useCallback(() => {
    haptics.calmPulse()
  }, [])

  /**
   * Erfolgs-Feedback
   */
  const success = useCallback(() => {
    haptics.success()
  }, [])

  /**
   * Erleichterung (nach Emergency)
   */
  const relief = useCallback(() => {
    haptics.relief()
  }, [])

  /**
   * Grounding-Impuls
   */
  const ground = useCallback(() => {
    haptics.ground()
  }, [])

  /**
   * Atem-Begleitung starten
   */
  const breatheCycle = useCallback(() => {
    haptics.breatheCycle()
  }, [])

  /**
   * Alle Vibrationen stoppen
   */
  const stop = useCallback(() => {
    haptics.stop()
    if (calmLoopRef.current) {
      haptics.stopCalmLoop(calmLoopRef.current)
      calmLoopRef.current = null
    }
  }, [])

  return {
    // Basis
    tap,
    confirm,
    action,
    warn,

    // Adaptive
    adaptiveConfirm,
    skillApplied,

    // Beruhigend
    calmPulse,
    startCalming,
    stopCalming,
    breatheCycle,

    // Feedback
    success,
    relief,
    ground,

    // Control
    stop,

    // Status
    isSupported: haptics.isSupported(),
    isEnabled: haptics.isEnabled()
  }
}
