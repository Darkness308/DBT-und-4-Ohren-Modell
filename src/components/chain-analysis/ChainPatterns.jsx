/**
 * ChainPatterns - Mustererkennung über mehrere Chains
 */

import { useTheme } from '../../contexts/ThemeContext'

export default function ChainPatterns({ patterns }) {
  const { isDark } = useTheme()

  if (!patterns.hasEnoughData) {
    return (
      <div
        className={`p-8 rounded-xl text-center ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        <span className="text-5xl mb-4 block">🔍</span>
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-darkText-primary' : 'text-gray-800'
          }`}
        >
          Noch nicht genug Daten
        </h3>
        <p className={`max-w-md mx-auto ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Erstelle mindestens 3 Chain-Analysen, um Muster zu erkennen. Je mehr Analysen, desto
          aussagekräftiger die Erkenntnisse.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Übersicht */}
      <div
        className={`p-4 rounded-xl ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
              Analyse-Übersicht
            </h3>
            <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              Basierend auf {patterns.chainCount} Analysen
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${isDark ? 'text-success-400' : 'text-success-600'}`}>
              {patterns.completedCount}
            </p>
            <p className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              Abgeschlossen
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Cards */}
      {patterns.patterns.map((pattern, index) => (
        <PatternCard key={index} pattern={pattern} isDark={isDark} />
      ))}

      {/* Empfehlungen */}
      {patterns.patterns.length > 0 && (
        <div
          className={`p-4 rounded-xl ${
            isDark
              ? 'bg-lavender-900/30 border border-lavender-500/30'
              : 'bg-lavender-50 border border-lavender-200'
          }`}
        >
          <h3
            className={`font-semibold mb-2 flex items-center gap-2 ${
              isDark ? 'text-lavender-300' : 'text-lavender-700'
            }`}
          >
            <span>💡</span> Empfehlungen
          </h3>
          <ul className={`space-y-2 text-sm ${isDark ? 'text-lavender-400' : 'text-lavender-600'}`}>
            {patterns.patterns.some((p) => p.type === 'vulnerability') && (
              <li>• Achte besonders auf deine PLEASE-Skills (Schlaf, Ernährung, etc.)</li>
            )}
            {patterns.patterns.some((p) => p.type === 'thought') && (
              <li>
                • Deine Gedankenmuster zeigen kognitive Verzerrungen. Probiere &quot;Check the
                Facts&quot;
              </li>
            )}
            <li>• Mach weiter mit den Chain-Analysen - jede bringt neue Erkenntnisse</li>
          </ul>
        </div>
      )}
    </div>
  )
}

function PatternCard({ pattern, isDark }) {
  const getIcon = () => {
    switch (pattern.type) {
      case 'vulnerability':
        return '⚠️'
      case 'thought':
        return '💭'
      case 'emotion':
        return '💚'
      default:
        return '📊'
    }
  }

  return (
    <div
      className={`p-4 rounded-xl ${
        isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
      }`}
    >
      <h3
        className={`font-semibold mb-3 flex items-center gap-2 ${
          isDark ? 'text-darkText-primary' : 'text-gray-800'
        }`}
      >
        <span>{getIcon()}</span>
        {pattern.title}
      </h3>

      <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
        {pattern.description}
      </p>

      <div className="space-y-2">
        {pattern.items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg ${
              isDark ? 'bg-dark-elevated' : 'bg-gray-50'
            }`}
          >
            <span className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}>
              {item.name || item.word}
            </span>
            <div className="flex items-center gap-2">
              {item.percentage !== undefined && (
                <div
                  className="h-2 rounded-full bg-lavender-500"
                  style={{ width: `${item.percentage}px` }}
                />
              )}
              <span className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                {item.count}x{item.percentage !== undefined && ` (${item.percentage}%)`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
