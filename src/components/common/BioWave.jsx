import { useRef, useEffect, useState, useCallback } from 'react'
import clyde from '../../utils/clyde'

/**
 * BioWave - Therapeutische Wellen-Visualisierung
 *
 * Basiert auf HRV4Biofeedback und HeartMath Inner Balance:
 * - Welle visualisiert inneren Zustand
 * - Farbe zeigt Stress-Level (Ampel-System)
 * - Animation synchron mit Atmung/Herzschlag
 *
 * Therapeutischer Nutzen (aus Forschung):
 * 1. Erkennen: "Ah, die Welle ist unruhig"
 * 2. Handeln: Atmen, Skill anwenden
 * 3. Belohnen: Welle wird flacher und grüner
 *
 * Das schamfreie Feedback stärkt Selbstwirksamkeit.
 */
export default function BioWave({
  stressLevel = 50,
  bpm = 60,
  mode = 'stress', // 'stress' | 'breathing' | 'urge'
  height = 120,
  showLabel = true,
  className = ''
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 300, height })

  // Farbe basierend auf Stress-Level
  const getColor = useCallback(() => {
    return clyde.getStressColor(stressLevel)
  }, [stressLevel])

  // Amplitude basierend auf Stress (hoher Stress = große Wellen)
  const getAmplitude = useCallback(() => {
    // Bei Stress: Große, unruhige Wellen
    // Bei Ruhe: Flache, sanfte Wellen
    const base = dimensions.height * 0.3
    const stressFactor = stressLevel / 100
    return base * (0.3 + stressFactor * 0.7)
  }, [stressLevel, dimensions.height])

  // Frequenz basierend auf BPM oder Stress
  const getFrequency = useCallback(() => {
    if (mode === 'breathing') {
      // Atem-Modus: Langsame Wellen (6 Atemzüge/Minute)
      return 0.1
    }
    if (mode === 'urge') {
      // Urge-Surfing: Wellen die kommen und gehen
      return 0.15
    }
    // Stress-Modus: Frequenz an Herzschlag gekoppelt
    return bpm / 60 / 2 // Halbe BPM-Rate für sanftere Wellen
  }, [mode, bpm])

  // Canvas-Größe anpassen
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    resizeObserver.observe(canvas.parentElement)
    return () => resizeObserver.disconnect()
  }, [height])

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let time = 0
    const { width } = dimensions

    // High-DPI Support
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const animate = () => {
      const amplitude = getAmplitude()
      const frequency = getFrequency()
      const color = getColor()
      const baseline = height / 2

      // Clear
      ctx.clearRect(0, 0, width, height)

      // Gradient Fill unter der Welle
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, `${color}20`)
      gradient.addColorStop(1, `${color}05`)

      // Welle zeichnen
      ctx.beginPath()
      ctx.moveTo(0, baseline)

      for (let x = 0; x <= width; x++) {
        const progress = x / width
        // Haupt-Sinus mit leichter Variation für natürlicheren Look
        const y =
          baseline +
          Math.sin(progress * Math.PI * 4 + time * frequency * Math.PI * 2) *
            amplitude *
            0.8 +
          Math.sin(progress * Math.PI * 2 + time * frequency * Math.PI) *
            amplitude *
            0.2
        ctx.lineTo(x, y)
      }

      // Füllung unter der Welle
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Wellen-Linie
      ctx.beginPath()
      ctx.moveTo(0, baseline)
      for (let x = 0; x <= width; x++) {
        const progress = x / width
        const y =
          baseline +
          Math.sin(progress * Math.PI * 4 + time * frequency * Math.PI * 2) *
            amplitude *
            0.8 +
          Math.sin(progress * Math.PI * 2 + time * frequency * Math.PI) *
            amplitude *
            0.2
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.stroke()

      // Glow-Effekt
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      // Zeit vorrücken (Reduced Motion respektieren)
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
      time += prefersReducedMotion ? 0.005 : 0.016

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, height, getAmplitude, getFrequency, getColor])

  // Label Text
  const getLabelText = () => {
    if (mode === 'breathing') return 'Atme mit der Welle'
    if (mode === 'urge') return 'Die Welle bricht gleich'

    const level = clyde.getStressLevel(stressLevel)
    return level.label
  }

  return (
    <div className={`bio-wave-container ${className}`}>
      {showLabel && (
        <div className="bio-wave-header">
          <span className="bio-wave-label">{getLabelText()}</span>
          <span className="bio-wave-value" style={{ color: getColor() }}>
            {stressLevel}%
          </span>
        </div>
      )}

      <div className="bio-wave-canvas-container">
        <canvas
          ref={canvasRef}
          className="bio-wave-canvas"
          aria-label={`Stress-Welle: ${stressLevel}%`}
          role="img"
        />

        {mode === 'urge' && (
          <div className="bio-wave-overlay">
            <span className="bio-wave-timer">🌊</span>
          </div>
        )}
      </div>

      {mode === 'breathing' && (
        <p className="bio-wave-hint">Nicht gegen die Welle kämpfen. Mit ihr atmen.</p>
      )}
    </div>
  )
}

/**
 * UrgeWave - Spezialisierte Welle für Urge Surfing
 * Mit Timer und Countdown
 */
export function UrgeWave({ duration = 120, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [stress, setStress] = useState(80)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete?.()
          return 0
        }
        return prev - 1
      })

      // Stress sinkt langsam während Urge Surfing
      setStress((prev) => Math.max(30, prev - 0.3))
    }, 1000)

    return () => clearInterval(timer)
  }, [duration, onComplete])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="urge-wave-container">
      <BioWave stressLevel={stress} mode="urge" height={150} showLabel={false} />

      <div className="urge-wave-timer-overlay">
        <span className="urge-wave-time">{formatTime(timeLeft)}</span>
      </div>

      <p className="urge-wave-message">Die Welle steigt... und fällt wieder.</p>
    </div>
  )
}
