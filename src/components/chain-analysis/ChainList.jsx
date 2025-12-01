/**
 * ChainList - Liste aller Chain-Analysen
 */

import { useTheme } from '../../contexts/ThemeContext'

export default function ChainList({ chains, onEdit, onDelete, onNew }) {
  const { isDark } = useTheme()

  if (chains.length === 0) {
    return (
      <div
        className={`p-8 rounded-xl text-center ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        <span className="text-5xl mb-4 block">📋</span>
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-darkText-primary' : 'text-gray-800'
          }`}
        >
          Keine Analysen vorhanden
        </h3>
        <p className={`mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Starte deine erste Verhaltenskettenanalyse
        </p>
        <button
          onClick={onNew}
          className={`px-4 py-2 rounded-lg font-medium ${
            isDark
              ? 'bg-lavender-600 text-white hover:bg-lavender-500'
              : 'bg-lavender-500 text-white hover:bg-lavender-600'
          }`}
        >
          Neue Analyse
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {chains.map((chain) => (
        <ChainCard
          key={chain.id}
          chain={chain}
          onEdit={() => onEdit(chain.id)}
          onDelete={() => onDelete(chain.id)}
          isDark={isDark}
        />
      ))}
    </div>
  )
}

function ChainCard({ chain, onEdit, onDelete, isDark }) {
  const isComplete = chain.status === 'completed'

  return (
    <div
      className={`p-4 rounded-xl ${
        isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                isComplete
                  ? isDark
                    ? 'bg-success-900/50 text-success-300'
                    : 'bg-success-100 text-success-700'
                  : isDark
                    ? 'bg-warning-900/50 text-warning-300'
                    : 'bg-warning-100 text-warning-700'
              }`}
            >
              {isComplete ? 'Abgeschlossen' : 'In Bearbeitung'}
            </span>
            <span className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {new Date(chain.targetBehavior.date).toLocaleDateString('de-DE')}
            </span>
          </div>

          <h4 className={`font-medium mb-1 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
            {chain.targetBehavior.description || 'Ohne Titel'}
          </h4>

          <div className="flex items-center gap-4 text-sm">
            <span className={isDark ? 'text-darkText-secondary' : 'text-gray-500'}>
              {chain.links.length} Kettenglieder
            </span>
            <span className={isDark ? 'text-darkText-secondary' : 'text-gray-500'}>
              {chain.vulnerabilities.length} Vulnerabilitäten
            </span>
          </div>

          {/* Chain Preview */}
          {chain.links.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {chain.links.slice(0, 5).map((link) => (
                <span
                  key={link.id}
                  className={`text-xs px-2 py-1 rounded ${
                    isDark ? 'bg-dark-elevated' : 'bg-gray-100'
                  }`}
                >
                  {getLinkEmoji(link.type)}
                </span>
              ))}
              {chain.links.length > 5 && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isDark ? 'bg-dark-elevated' : 'bg-gray-100'
                  }`}
                >
                  +{chain.links.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-dark-hover' : 'hover:bg-gray-100'}`}
          >
            ✏️
          </button>
          <button
            onClick={() => {
              if (confirm('Diese Analyse wirklich löschen?')) {
                onDelete()
              }
            }}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-dark-hover' : 'hover:bg-gray-100'}`}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

function getLinkEmoji(type) {
  const emojis = {
    thought: '💭',
    emotion: '💚',
    body: '🫀',
    urge: '⚡',
    behavior: '🎬',
  }
  return emojis[type] || '•'
}
