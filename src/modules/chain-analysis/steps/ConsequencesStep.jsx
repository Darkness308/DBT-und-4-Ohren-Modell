import { useTheme } from '../../../contexts/ThemeContext'

/**
 * ConsequencesStep - Erfassung der Konsequenzen
 *
 * Was waren die kurz- und langfristigen Folgen des Verhaltens?
 * Unterscheidet zwischen positiven und negativen Konsequenzen.
 */
export default function ConsequencesStep({ consequences, onChange }) {
  const { isDark } = useTheme()

  const updateField = (field, value) => {
    onChange({ ...consequences, [field]: value })
  }

  const textareaClass = `
    w-full p-3 rounded-lg border resize-none
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
          📊 Konsequenzen des Verhaltens
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Was hat das Verhalten gebracht? Kurzfristig und langfristig, positiv und negativ.
        </p>
      </div>

      {/* Positive Short-term */}
      <div
        className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}
      >
        <label
          className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-green-300' : 'text-green-700'}`}
        >
          <span className="text-lg">✅</span>
          Was hat es kurzfristig gebracht?
        </label>
        <p className={`text-xs mb-2 ${isDark ? 'text-green-300/70' : 'text-green-600'}`}>
          Z.B. Erleichterung, Spannungsabbau, Flucht vor Gefühlen
        </p>
        <textarea
          value={consequences.positive}
          onChange={(e) => updateField('positive', e.target.value)}
          placeholder="Welche kurzfristige Erleichterung oder Belohnung gab es?"
          rows={3}
          className={textareaClass}
        />
      </div>

      {/* Negative Long-term */}
      <div
        className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}
      >
        <label
          className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}
        >
          <span className="text-lg">❌</span>
          Was hat es langfristig gekostet?
        </label>
        <p className={`text-xs mb-2 ${isDark ? 'text-red-300/70' : 'text-red-600'}`}>
          Z.B. Scham, Verletzungen, Beziehungsprobleme, verstärkte Emotionen
        </p>
        <textarea
          value={consequences.negative}
          onChange={(e) => updateField('negative', e.target.value)}
          placeholder="Welche negativen Folgen hatte das Verhalten?"
          rows={3}
          className={textareaClass}
        />
      </div>

      {/* Short-term effects */}
      <div>
        <label className={labelClass}>
          <span className="text-lg mr-2">⏱️</span>
          Kurzfristige Auswirkungen (Minuten bis Stunden)
        </label>
        <textarea
          value={consequences.shortTerm}
          onChange={(e) => updateField('shortTerm', e.target.value)}
          placeholder="Wie hast du dich direkt danach gefühlt? Was ist unmittelbar passiert?"
          rows={3}
          className={textareaClass}
        />
      </div>

      {/* Long-term effects */}
      <div>
        <label className={labelClass}>
          <span className="text-lg mr-2">📅</span>
          Langfristige Auswirkungen (Tage bis Wochen)
        </label>
        <textarea
          value={consequences.longTerm}
          onChange={(e) => updateField('longTerm', e.target.value)}
          placeholder="Welche Folgen hatte das Verhalten in den folgenden Tagen/Wochen?"
          rows={3}
          className={textareaClass}
        />
      </div>

      {/* Key Insight */}
      <div
        className={`p-4 rounded-lg ${isDark ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className={`font-medium mb-1 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              Wichtige Erkenntnis
            </div>
            <p className={`text-sm ${isDark ? 'text-purple-300/80' : 'text-purple-600'}`}>
              Problemverhalten hat oft <strong>kurzfristig positive</strong> und{' '}
              <strong>langfristig negative</strong> Konsequenzen. Das ist der Grund, warum es so
              schwer zu ändern ist - es funktioniert kurzfristig!
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-purple-300/80' : 'text-purple-600'}`}>
              Das Ziel ist, Skills zu finden, die ähnliche kurzfristige Entlastung bieten, ohne die
              langfristigen Kosten.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Preview */}
      {(consequences.positive || consequences.negative) && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div
            className={`text-sm font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
          >
            Zusammenfassung:
          </div>
          <div className="grid grid-cols-2 gap-4">
            {consequences.positive && (
              <div>
                <div
                  className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}
                >
                  ✅ Kurzfristiger Gewinn:
                </div>
                <p
                  className={`text-sm mt-1 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
                >
                  {consequences.positive.slice(0, 100)}
                  {consequences.positive.length > 100 ? '...' : ''}
                </p>
              </div>
            )}
            {consequences.negative && (
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  ❌ Langfristige Kosten:
                </div>
                <p
                  className={`text-sm mt-1 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
                >
                  {consequences.negative.slice(0, 100)}
                  {consequences.negative.length > 100 ? '...' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
