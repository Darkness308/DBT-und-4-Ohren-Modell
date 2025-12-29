import clyde from '../../utils/clyde'
import Tooltip from './Tooltip'

/**
 * StressIndicator - Visuelle Ampel für Stress-Level
 *
 * Farben nach DBT-Standard:
 * - GRÜN (0-30%): Stabil, Reflexion möglich
 * - GELB (31-60%): Aufmerksam, Skills bereithalten
 * - ORANGE (61-80%): Angespannt, Körper-Skills nutzen
 * - ROT (81-100%): Notfall, nur TIPP/Eiswasser
 */
export default function StressIndicator({
  value = 30,
  showLabel = true,
  showValue = true,
  size = 'md',
  interactive = false,
  onChange
}) {
  const level = clyde.getStressLevel(value)
  const color = clyde.getStressColor(value)

  const sizeClasses = {
    sm: 'stress-indicator-sm',
    md: 'stress-indicator-md',
    lg: 'stress-indicator-lg'
  }

  const handleChange = (e) => {
    if (interactive && onChange) {
      onChange(parseInt(e.target.value, 10))
    }
  }

  return (
    <div className={`stress-indicator ${sizeClasses[size]}`}>
      {/* Label mit Tooltip */}
      {showLabel && (
        <div className="stress-indicator-header">
          <Tooltip
            title={clyde.tooltips.stressLevel.title}
            text={clyde.tooltips.stressLevel.text}
            example={clyde.tooltips.stressLevel.example}
          >
            <span className="stress-indicator-label">Stress-Level</span>
          </Tooltip>
          <span
            className="stress-indicator-status"
            style={{ color }}
            aria-label={`Status: ${level.label}`}
          >
            {level.label}
          </span>
        </div>
      )}

      {/* Ampel-Visualisierung */}
      <div className="stress-indicator-bar-container">
        <div
          className="stress-indicator-bar"
          style={{
            width: `${value}%`,
            backgroundColor: color
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Stress-Level: ${value}%`}
        />

        {/* Schwellenwert-Markierungen */}
        <div className="stress-indicator-markers">
          <span className="marker" style={{ left: '30%' }} aria-hidden="true" />
          <span className="marker" style={{ left: '60%' }} aria-hidden="true" />
          <span className="marker" style={{ left: '80%' }} aria-hidden="true" />
        </div>
      </div>

      {/* Slider für interaktive Nutzung */}
      {interactive && (
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={handleChange}
          className="stress-indicator-slider"
          style={{ accentColor: color }}
          aria-label="Stress-Level einstellen"
        />
      )}

      {/* Wert-Anzeige */}
      {showValue && (
        <div className="stress-indicator-value" style={{ color }}>
          {value}%
        </div>
      )}

      {/* Zone-Labels */}
      <div className="stress-indicator-zones" aria-hidden="true">
        <span className="zone zone-green">Stabil</span>
        <span className="zone zone-yellow">Achtsam</span>
        <span className="zone zone-orange">Skills!</span>
        <span className="zone zone-red">STOPP</span>
      </div>
    </div>
  )
}

/**
 * StressBadge - Kompakte Anzeige für Listen/Cards
 */
export function StressBadge({ min, max }) {
  let className = 'stress-badge stress-badge-green'
  let label = 'GRÜN'

  if (min >= 80) {
    className = 'stress-badge stress-badge-red'
    label = 'ROT'
  } else if (max > 60) {
    className = 'stress-badge stress-badge-orange'
    label = 'ORANGE'
  } else if (max > 30) {
    className = 'stress-badge stress-badge-yellow'
    label = 'GELB'
  }

  return (
    <span className={className} title={`Wirksam bei ${min}-${max}% Stress`}>
      {min}-{max}%
    </span>
  )
}
