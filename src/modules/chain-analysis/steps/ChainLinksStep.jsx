import { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { linkTypes } from '../ChainAnalysisAgent'

/**
 * ChainLinksStep - Erfassung der Kettenglieder
 *
 * Die Abfolge von Gedanken, Gefühlen, Körperempfindungen und Verhaltensweisen,
 * die vom Auslöser zum Problemverhalten führten.
 */
export default function ChainLinksStep({ chainLinks, onChange }) {
  const { isDark } = useTheme()
  const [newLink, setNewLink] = useState({ type: 'thought', content: '', intensity: 3 })

  const addLink = () => {
    if (!newLink.content.trim()) return

    const link = {
      id: Date.now().toString(),
      type: newLink.type,
      content: newLink.content,
      intensity: newLink.intensity,
    }

    onChange([...chainLinks, link])
    setNewLink({ type: 'thought', content: '', intensity: 3 })
  }

  const removeLink = (id) => {
    onChange(chainLinks.filter((l) => l.id !== id))
  }

  const moveLink = (id, direction) => {
    const idx = chainLinks.findIndex((l) => l.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === chainLinks.length - 1) return

    const newLinks = [...chainLinks]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newLinks[idx], newLinks[swapIdx]] = [newLinks[swapIdx], newLinks[idx]]
    onChange(newLinks)
  }

  const getLinkType = (typeId) => linkTypes.find((t) => t.id === typeId)

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
        >
          🔗 Die Verhaltenskette
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Was kam nach dem Auslöser? Füge Gedanken, Gefühle, Körperempfindungen und Verhaltensweisen
          hinzu.
        </p>
      </div>

      {/* Add New Link */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {linkTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setNewLink((prev) => ({ ...prev, type: type.id }))}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  newLink.type === type.id
                    ? 'text-white shadow-md'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
              style={newLink.type === type.id ? { backgroundColor: type.color } : {}}
            >
              {type.emoji} {type.label}
            </button>
          ))}
        </div>

        <textarea
          value={newLink.content}
          onChange={(e) => setNewLink((prev) => ({ ...prev, content: e.target.value }))}
          placeholder={`${getLinkType(newLink.type)?.emoji} Beschreibe ${getLinkType(newLink.type)?.label.toLowerCase()}...`}
          rows={2}
          className={`
            w-full p-3 rounded-lg border resize-none mb-3
            ${
              isDark
                ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
            }
            focus:ring-2 focus:ring-calm-500 focus:border-transparent
          `}
        />

        {/* Intensity Slider */}
        <div className="flex items-center gap-4 mb-3">
          <label className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
            Intensität:
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={newLink.intensity}
            onChange={(e) =>
              setNewLink((prev) => ({ ...prev, intensity: parseInt(e.target.value) }))
            }
            className="flex-1"
          />
          <span
            className={`text-sm font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
          >
            {newLink.intensity}/5
          </span>
        </div>

        <button
          onClick={addLink}
          disabled={!newLink.content.trim()}
          className={`
            w-full py-2 rounded-lg font-medium transition-all
            ${
              newLink.content.trim()
                ? 'bg-calm-500 text-white hover:bg-calm-600'
                : isDark
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          + Kettenglied hinzufügen
        </button>
      </div>

      {/* Chain Visualization */}
      {chainLinks.length > 0 ? (
        <div className="space-y-2">
          {chainLinks.map((link, idx) => {
            const type = getLinkType(link.type)
            return (
              <div key={link.id} className="flex items-stretch gap-2">
                {/* Connection Line */}
                <div className="flex flex-col items-center w-6">
                  {idx > 0 && (
                    <div className={`w-0.5 h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  )}
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: type?.color }}
                  />
                  {idx < chainLinks.length - 1 && (
                    <div className={`w-0.5 flex-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  )}
                </div>

                {/* Link Content */}
                <div
                  className={`
                    flex-1 p-3 rounded-lg border-l-4
                    ${isDark ? 'bg-gray-800' : 'bg-white'}
                  `}
                  style={{ borderLeftColor: type?.color }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`text-xs font-medium mb-1`} style={{ color: type?.color }}>
                        {type?.emoji} {type?.label}
                      </div>
                      <p
                        className={`text-sm ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
                      >
                        {link.content}
                      </p>
                      <div
                        className={`text-xs mt-1 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                      >
                        Intensität: {link.intensity}/5
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => moveLink(link.id, 'up')}
                        disabled={idx === 0}
                        className={`p-1 rounded text-xs ${idx === 0 ? 'opacity-30' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveLink(link.id, 'down')}
                        disabled={idx === chainLinks.length - 1}
                        className={`p-1 rounded text-xs ${idx === chainLinks.length - 1 ? 'opacity-30' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="p-1 rounded text-xs text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          className={`text-center py-8 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-700 text-darkText-secondary' : 'border-gray-200 text-gray-400'}`}
        >
          <span className="text-4xl mb-2 block">🔗</span>
          <p>Noch keine Kettenglieder</p>
          <p className="text-sm mt-1">Füge oben das erste Glied hinzu</p>
        </div>
      )}

      {/* Summary */}
      {chainLinks.length > 0 && (
        <div className={`p-3 rounded-lg ${isDark ? 'bg-calm-900/20' : 'bg-calm-50'}`}>
          <div className={`text-sm ${isDark ? 'text-calm-300' : 'text-calm-700'}`}>
            <strong>{chainLinks.length}</strong> Kettenglieder:{' '}
            {linkTypes
              .map((type) => {
                const count = chainLinks.filter((l) => l.type === type.id).length
                return count > 0 ? `${type.emoji} ${count}` : null
              })
              .filter(Boolean)
              .join(' • ')}
          </div>
        </div>
      )}
    </div>
  )
}
