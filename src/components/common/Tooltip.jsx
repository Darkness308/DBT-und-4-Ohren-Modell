import { useState, useRef, useEffect } from 'react'

/**
 * Tooltip - Schüler-Erklärungen für komplexe Konzepte
 *
 * Clyde erklärt einfach:
 * - Kurzer Titel
 * - Simple Erklärung
 * - Konkretes Beispiel
 */
export default function Tooltip({
  children,
  title,
  text,
  example,
  position: _position = 'top', // Reserved for future positioning
  showIcon = true,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  // Position berechnen
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect()
      const tooltip = tooltipRef.current.getBoundingClientRect()

      let x = trigger.left + trigger.width / 2 - tooltip.width / 2
      let y = trigger.top - tooltip.height - 8

      // Viewport-Grenzen beachten
      if (x < 8) x = 8
      if (x + tooltip.width > window.innerWidth - 8) {
        x = window.innerWidth - tooltip.width - 8
      }
      if (y < 8) {
        y = trigger.bottom + 8 // Unter dem Element anzeigen
      }

      setCoords({ x, y })
    }
  }, [isVisible])

  const handleMouseEnter = () => setIsVisible(true)
  const handleMouseLeave = () => setIsVisible(false)
  const handleFocus = () => setIsVisible(true)
  const handleBlur = () => setIsVisible(false)

  return (
    <span className="tooltip-wrapper">
      {/* Trigger Element */}
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="button"
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
        className="tooltip-trigger"
      >
        {children}
        {showIcon && (
          <span className="tooltip-icon" aria-hidden="true">
            ⓘ
          </span>
        )}
      </span>

      {/* Tooltip Content */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          className="tooltip-content"
          style={{
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          {title && <div className="tooltip-title">{title}</div>}
          {text && <div className="tooltip-text">{text}</div>}
          {example && (
            <div className="tooltip-example">
              <span className="tooltip-example-label">Beispiel:</span>
              <span className="tooltip-example-text">{example}</span>
            </div>
          )}
        </div>
      )}
    </span>
  )
}

/**
 * ClydeExplains - Wrapper für Clyde-Erklärungen
 * Zeigt einen Skill mit einfacher + wissenschaftlicher Erklärung
 */
export function ClydeExplains({ skill, children }) {
  const [showScience, setShowScience] = useState(false)

  if (!skill) return children

  return (
    <div className="clyde-explains">
      <div className="clyde-explains-header">
        <span className="clyde-avatar">C</span>
        <span className="clyde-title">{skill.title}</span>
      </div>

      <p className="clyde-simple">{skill.simple}</p>

      {skill.science && (
        <button
          className="clyde-science-toggle"
          onClick={() => setShowScience(!showScience)}
          aria-expanded={showScience}
        >
          {showScience ? '▼' : '▶'} Warum funktioniert das?
        </button>
      )}

      {showScience && skill.science && <p className="clyde-science">{skill.science}</p>}

      {skill.steps && (
        <ol className="clyde-steps">
          {skill.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}

      {children}
    </div>
  )
}
