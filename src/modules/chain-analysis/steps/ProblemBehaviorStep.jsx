import { useTheme } from '../../../contexts/ThemeContext'
import { problemBehaviors } from '../ChainAnalysisAgent'

/**
 * ProblemBehaviorStep - Erfassung des Problemverhaltens
 *
 * Das Zielverhalten, das analysiert wird.
 * Kann kritisch (z.B. Selbstverletzung) oder nicht-kritisch sein.
 */
export default function ProblemBehaviorStep({ behavior, onChange }) {
  const { isDark } = useTheme()

  const updateField = (field, value) => {
    onChange({ ...behavior, [field]: value })
  }

  const selectedBehavior = problemBehaviors.find((b) => b.id === behavior.type)

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
        >
          🎯 Das Problemverhalten
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Welches Verhalten möchtest du analysieren und verändern?
        </p>
      </div>

      {/* Behavior Type Selection */}
      <div className="grid grid-cols-2 gap-2">
        {problemBehaviors.map((pb) => {
          const isSelected = behavior.type === pb.id
          return (
            <button
              key={pb.id}
              onClick={() => updateField('type', pb.id)}
              className={`
                p-3 rounded-lg text-left transition-all duration-200 border-2
                ${
                  isSelected
                    ? pb.critical
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-calm-500 bg-calm-50 dark:bg-calm-900/20'
                    : isDark
                      ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{pb.emoji}</span>
                <span
                  className={`text-sm font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
                >
                  {pb.label}
                </span>
                {pb.critical && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    kritisch
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Description */}
      {behavior.type && (
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
          >
            Beschreibe genauer, was passiert ist:
          </label>
          <textarea
            value={behavior.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder={`Was genau hast du getan? Wie hat sich ${selectedBehavior?.label} gezeigt?`}
            rows={4}
            className={`
              w-full p-3 rounded-lg border resize-none
              ${
                isDark
                  ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              }
              focus:ring-2 focus:ring-calm-500 focus:border-transparent
            `}
          />
        </div>
      )}

      {/* Intensity */}
      {behavior.type && (
        <div>
          <label
            className={`block text-sm font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
          >
            Intensität des Verhaltens: <strong>{behavior.intensity || 0}/5</strong>
          </label>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => updateField('intensity', val)}
                className={`
                  flex-1 py-3 rounded-lg text-center font-medium transition-all
                  ${
                    behavior.intensity >= val
                      ? selectedBehavior?.critical
                        ? 'bg-red-500 text-white'
                        : 'bg-calm-500 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }
                `}
              >
                {val}
              </button>
            ))}
          </div>

          <div
            className={`flex justify-between text-xs mt-1 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
          >
            <span>Leicht</span>
            <span>Extrem</span>
          </div>
        </div>
      )}

      {/* Warning for Critical Behaviors */}
      {selectedBehavior?.critical && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🆘</span>
            <div>
              <div className={`font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                Wichtiger Hinweis
              </div>
              <p className={`text-sm mt-1 ${isDark ? 'text-red-300/80' : 'text-red-600'}`}>
                Wenn du aktuell in einer Krise bist, nutze bitte die Notfall-Ressourcen:
              </p>
              <div className={`mt-2 text-sm ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                <div>
                  📞 Telefonseelsorge: <strong>0800 111 0 111</strong> (kostenlos)
                </div>
                <div className="mt-1">
                  💬 Online: <strong>online.telefonseelsorge.de</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {behavior.type && behavior.description && (
        <div
          className={`p-4 rounded-lg border-l-4 ${selectedBehavior?.critical ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-calm-500 bg-calm-50 dark:bg-calm-900/10'}`}
        >
          <div
            className={`text-sm font-medium mb-1 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
          >
            {selectedBehavior?.emoji} {selectedBehavior?.label} (Intensität: {behavior.intensity}/5)
          </div>
          <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
            {behavior.description}
          </p>
        </div>
      )}
    </div>
  )
}
