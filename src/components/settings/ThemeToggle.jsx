/**
 * ThemeToggle - Therapeutisches Theme-Umschalter
 *
 * Features:
 * - 3 Modi: Hell / Dunkel / System
 * - Visuelles Feedback mit Icons
 * - Smooth Transition
 * - Wissenschaftliche Erklärung für Nutzer
 */

import { useTheme, THEMES } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, isDark, setTheme } = useTheme()

  const themeOptions = [
    {
      value: THEMES.LIGHT,
      icon: '☀️',
      label: 'Hell',
      description: 'Klassisches helles Design',
    },
    {
      value: THEMES.DARK,
      icon: '🌙',
      label: 'Dunkel',
      description: 'Reduziert mentale Ermüdung',
    },
    {
      value: THEMES.SYSTEM,
      icon: '💻',
      label: 'System',
      description: 'Folgt deinen Geräte-Einstellungen',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Theme Selection */}
      <div className="grid grid-cols-3 gap-2">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              flex flex-col items-center p-3 rounded-xl transition-all duration-200
              ${
                theme === option.value
                  ? isDark
                    ? 'bg-calm-600 text-white ring-2 ring-calm-400'
                    : 'bg-calm-100 text-calm-700 ring-2 ring-calm-500'
                  : isDark
                    ? 'bg-dark-elevated text-darkText-secondary hover:bg-dark-hover'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            aria-pressed={theme === option.value}
          >
            <span className="text-2xl mb-1">{option.icon}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Current Selection Info */}
      <div
        className={`p-3 rounded-lg text-sm ${isDark ? 'bg-dark-elevated text-darkText-secondary' : 'bg-gray-50 text-gray-600'}`}
      >
        <p>{themeOptions.find((o) => o.value === theme)?.description}</p>
      </div>

      {/* Scientific Note */}
      <div
        className={`p-4 rounded-xl border ${isDark ? 'bg-lavender-900/20 border-lavender-500/30 text-lavender-300' : 'bg-lavender-50 border-lavender-200 text-lavender-700'}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl">🧠</span>
          <div className="text-xs leading-relaxed">
            <p className="font-medium mb-1">Wissenschaftlich fundiert</p>
            <p>
              Der Dark Mode nutzt sanftes Charcoal statt hartes Schwarz. Studien zeigen, dass dies
              die visuelle Ermüdung reduziert und bei kognitiver Überlastung weniger belastend
              wirkt.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ThemeQuickToggle - Kompakter Toggle für Header/Navigation
 */
export function ThemeQuickToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${isDark ? 'bg-dark-elevated hover:bg-dark-hover text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}
        ${className}
      `}
      aria-label={isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln'}
    >
      <span className="text-xl" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
