import clyde from '../../core/clyde'
import Button from './Button'

/**
 * ClydeMessage - Clyde spricht zu Bonnie
 *
 * Varianten:
 * - bubble: Standard-Nachricht mit Avatar
 * - inline: Kompakte Inline-Nachricht
 * - guide: Mit Call-to-Action
 */
export default function ClydeMessage({
  children,
  message,
  variant = 'bubble',
  showAvatar = true,
  action,
  onAction,
}) {
  const text = message || children

  if (variant === 'inline') {
    return (
      <span className="clyde-inline">
        {showAvatar && <span className="clyde-inline-avatar">C</span>}
        <span className="clyde-inline-text">{text}</span>
      </span>
    )
  }

  return (
    <div className="clyde-bubble">
      <p className="clyde-bubble-text">{text}</p>

      {action && (
        <div className="clyde-bubble-action">
          <Button variant="primary" size="sm" onClick={onAction}>
            {action.primary || action}
          </Button>
          {action.secondary && (
            <Button variant="secondary" size="sm">
              {action.secondary}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * ClydeGreeting - Begrüßung basierend auf Stress-Level
 */
export function ClydeGreeting({ stressLevel = 30 }) {
  const greeting = clyde.voice.greet(stressLevel)

  return (
    <div className="clyde-bubble">
      <p className="clyde-bubble-text">{greeting}</p>
    </div>
  )
}

/**
 * ClydeSkillFeedback - Feedback nach Skill-Nutzung
 */
export function ClydeSkillFeedback({ skillName, oldStress, newStress }) {
  const feedback = clyde.voice.skillUsed(skillName, oldStress, newStress)

  return (
    <div className="clyde-bubble">
      <p className="clyde-bubble-text">{feedback}</p>
    </div>
  )
}
