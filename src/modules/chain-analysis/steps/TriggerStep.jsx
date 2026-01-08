import { useTheme } from '../../../contexts/ThemeContext'

/**
 * TriggerStep - Erfassung des auslösenden Ereignisses
 *
 * Das spezifische Ereignis, das die Verhaltenskette ausgelöst hat.
 * Wichtige Fragen: Was, Wann, Wo, Wer?
 */
export default function TriggerStep({ trigger, onChange }) {
  const { isDark } = useTheme()

  const updateField = (field, value) => {
    onChange({ ...trigger, [field]: value })
  }

  const inputClass = `
    w-full p-3 rounded-lg border
    ${
      isDark
        ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500'
        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
    }
    focus:ring-2 focus:ring-calm-500 focus:border-transparent
  `

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
        >
          ⚡ Was war der Auslöser?
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Beschreibe das Ereignis, das die Kette zum Problemverhalten gestartet hat.
        </p>
      </div>

      {/* What */}
      <div>
        <label className={labelClass}>
          <span className="text-lg mr-2">📝</span>
          Was ist passiert?
        </label>
        <textarea
          value={trigger.what}
          onChange={(e) => updateField('what', e.target.value)}
          placeholder="Beschreibe das Ereignis so konkret wie möglich..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* When */}
      <div>
        <label className={labelClass}>
          <span className="text-lg mr-2">🕐</span>
          Wann war das?
        </label>
        <input
          type="text"
          value={trigger.when}
          onChange={(e) => updateField('when', e.target.value)}
          placeholder="z.B. Gestern Abend gegen 20 Uhr"
          className={inputClass}
        />
      </div>

      {/* Where */}
      <div>
        <label className={labelClass}>
          <span className="text-lg mr-2">📍</span>
          Wo warst du?
        </label>
        <input
          type="text"
          value={trigger.where}
          onChange={(e) => updateField('where', e.target.value)}
          placeholder="z.B. Zu Hause, bei der Arbeit, unterwegs"
          className={inputClass}
        />
      </div>

      {/* Who */}
      <div>
        <label className={labelClass}>
          <span className="text-lg mr-2">👥</span>
          Wer war dabei?
        </label>
        <input
          type="text"
          value={trigger.who}
          onChange={(e) => updateField('who', e.target.value)}
          placeholder="z.B. Allein, mit Partner, mit Kollegen"
          className={inputClass}
        />
      </div>

      {/* Preview */}
      {trigger.what && (
        <div
          className={`p-4 rounded-lg border-l-4 border-orange-500 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}
        >
          <div
            className={`text-sm font-medium mb-2 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}
          >
            Zusammenfassung des Auslösers:
          </div>
          <p className={`text-sm ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}>
            {trigger.what}
          </p>
          {(trigger.when || trigger.where || trigger.who) && (
            <div className={`text-xs mt-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {trigger.when && <span className="mr-3">🕐 {trigger.when}</span>}
              {trigger.where && <span className="mr-3">📍 {trigger.where}</span>}
              {trigger.who && <span>👥 {trigger.who}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
