import { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { linkTypes } from '../ChainAnalysisAgent'

// Empfohlene Skills nach Kettenglied-Typ
const skillSuggestions = {
  thought: [
    {
      id: 'check-facts',
      name: 'Check the Facts',
      emoji: '🔍',
      description: 'Prüfe die Fakten deiner Gedanken',
    },
    {
      id: 'opposite-action',
      name: 'Gegenteiliges Handeln',
      emoji: '↔️',
      description: 'Handle entgegen dem Impuls',
    },
    {
      id: 'wise-mind',
      name: 'Wise Mind',
      emoji: '🧘',
      description: 'Finde die Balance zwischen Emotion und Verstand',
    },
    {
      id: 'radical-acceptance',
      name: 'Radikale Akzeptanz',
      emoji: '🙏',
      description: 'Akzeptiere, was du nicht ändern kannst',
    },
  ],
  emotion: [
    {
      id: 'tipp',
      name: 'TIPP',
      emoji: '🧊',
      description: 'Temperatur, Intensive Bewegung, Paced Breathing, Paired Relaxation',
    },
    {
      id: 'self-soothe',
      name: 'Selbstberuhigung',
      emoji: '💆',
      description: 'Nutze deine 5 Sinne zur Beruhigung',
    },
    {
      id: 'improve',
      name: 'IMPROVE',
      emoji: '🌟',
      description: 'Imagery, Meaning, Prayer, Relaxation...',
    },
    {
      id: 'distress-tolerance',
      name: 'Ablenkung (ACCEPTS)',
      emoji: '🎯',
      description: 'Activities, Contributing, Comparisons...',
    },
  ],
  body: [
    {
      id: 'paced-breathing',
      name: 'Paced Breathing',
      emoji: '🌬️',
      description: '4-4-6 Atmung zur Beruhigung',
    },
    {
      id: 'cold-water',
      name: 'Kaltes Wasser',
      emoji: '💧',
      description: 'Aktiviere den Tauchreflex',
    },
    {
      id: 'muscle-relaxation',
      name: 'Muskelentspannung',
      emoji: '💪',
      description: 'Progressive Muskelentspannung',
    },
    {
      id: 'grounding',
      name: '5-4-3-2-1 Grounding',
      emoji: '🌳',
      description: 'Komm zurück ins Hier und Jetzt',
    },
  ],
  action: [
    {
      id: 'stop',
      name: 'STOP Skill',
      emoji: '🛑',
      description: 'Stop, Take a step back, Observe, Proceed mindfully',
    },
    {
      id: 'dear-man',
      name: 'DEAR MAN',
      emoji: '💬',
      description: 'Für zwischenmenschliche Effektivität',
    },
    { id: 'walk-away', name: 'Kurz weggehen', emoji: '🚶', description: 'Nimm dir eine Auszeit' },
    {
      id: 'distraction',
      name: 'Ablenkung',
      emoji: '🎮',
      description: 'Lenke dich mit einer Aktivität ab',
    },
  ],
}

/**
 * SolutionsStep - Erarbeitung von Lösungsstrategien
 *
 * Wo in der Kette hätten Skills helfen können?
 * Verknüpft Kettenglieder mit passenden DBT-Skills.
 */
export default function SolutionsStep({ chainLinks, solutions, onChange }) {
  const { isDark } = useTheme()
  const [selectedLinkId, setSelectedLinkId] = useState(null)
  const [customSkill, setCustomSkill] = useState('')

  const getLinkType = (typeId) => linkTypes.find((t) => t.id === typeId)

  const addSolution = (linkId, skill) => {
    const newSolution = {
      id: Date.now().toString(),
      linkId,
      skillId: skill.id,
      skillName: skill.name,
      emoji: skill.emoji,
      description: '',
    }
    onChange([...solutions, newSolution])
    setSelectedLinkId(null)
  }

  const addCustomSolution = (linkId) => {
    if (!customSkill.trim()) return
    const newSolution = {
      id: Date.now().toString(),
      linkId,
      skillId: 'custom',
      skillName: customSkill,
      emoji: '✨',
      description: '',
    }
    onChange([...solutions, newSolution])
    setCustomSkill('')
    setSelectedLinkId(null)
  }

  const removeSolution = (id) => {
    onChange(solutions.filter((s) => s.id !== id))
  }

  const updateSolutionDescription = (id, description) => {
    onChange(solutions.map((s) => (s.id === id ? { ...s, description } : s)))
  }

  const getSolutionsForLink = (linkId) => solutions.filter((s) => s.linkId === linkId)

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
        >
          💡 Lösungsstrategien
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Wo in der Kette hätten Skills helfen können, das Problemverhalten zu verhindern?
        </p>
      </div>

      {chainLinks.length === 0 ? (
        <div
          className={`text-center py-8 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-700 text-darkText-secondary' : 'border-gray-200 text-gray-400'}`}
        >
          <span className="text-4xl mb-2 block">🔗</span>
          <p>Keine Kettenglieder vorhanden</p>
          <p className="text-sm mt-1">Gehe zurück zu Schritt 3 und füge Kettenglieder hinzu</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chainLinks.map((link, idx) => {
            const type = getLinkType(link.type)
            const linkSolutions = getSolutionsForLink(link.id)
            const isSelected = selectedLinkId === link.id
            const suggestedSkills = skillSuggestions[link.type] || []

            return (
              <div key={link.id} className="space-y-2">
                {/* Chain Link */}
                <div
                  className={`
                    p-4 rounded-lg border-l-4 cursor-pointer transition-all
                    ${
                      isSelected
                        ? isDark
                          ? 'bg-calm-900/30 border-calm-500'
                          : 'bg-calm-50 border-calm-500'
                        : isDark
                          ? 'bg-gray-800 hover:bg-gray-750'
                          : 'bg-white hover:bg-gray-50'
                    }
                  `}
                  style={{ borderLeftColor: type?.color }}
                  onClick={() => setSelectedLinkId(isSelected ? null : link.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                      <span className="text-lg">{type?.emoji}</span>
                      <span
                        className={`text-sm ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
                      >
                        {link.content.slice(0, 50)}
                        {link.content.length > 50 ? '...' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {linkSolutions.length > 0 && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}
                        >
                          {linkSolutions.length} Skill{linkSolutions.length > 1 ? 's' : ''}
                        </span>
                      )}
                      <span
                        className={`text-sm ${isSelected ? 'transform rotate-180' : ''} transition-transform`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Solutions for this link */}
                {linkSolutions.length > 0 && (
                  <div className="pl-4 space-y-2">
                    {linkSolutions.map((solution) => (
                      <div
                        key={solution.id}
                        className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{solution.emoji}</span>
                            <span
                              className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}
                            >
                              {solution.skillName}
                            </span>
                          </div>
                          <button
                            onClick={() => removeSolution(solution.id)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          value={solution.description}
                          onChange={(e) => updateSolutionDescription(solution.id, e.target.value)}
                          placeholder="Wie hättest du diesen Skill hier einsetzen können?"
                          rows={2}
                          className={`
                            w-full p-2 rounded border text-sm resize-none
                            ${
                              isDark
                                ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                            }
                          `}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Skill Selection Panel */}
                {isSelected && (
                  <div className={`p-4 rounded-lg ml-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div
                      className={`text-sm font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
                    >
                      Passende Skills für {type?.label}:
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {suggestedSkills.map((skill) => (
                        <button
                          key={skill.id}
                          onClick={() => addSolution(link.id, skill)}
                          className={`
                            p-3 rounded-lg text-left transition-all text-sm
                            ${
                              isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-darkText-primary'
                                : 'bg-white hover:bg-gray-100 text-gray-800'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{skill.emoji}</span>
                            <span className="font-medium">{skill.name}</span>
                          </div>
                          <p
                            className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                          >
                            {skill.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Custom Skill */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        placeholder="Anderen Skill eingeben..."
                        className={`
                          flex-1 p-2 rounded border text-sm
                          ${
                            isDark
                              ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500'
                              : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                          }
                        `}
                      />
                      <button
                        onClick={() => addCustomSolution(link.id)}
                        disabled={!customSkill.trim()}
                        className={`
                          px-4 py-2 rounded text-sm font-medium transition-all
                          ${
                            customSkill.trim()
                              ? 'bg-calm-500 text-white hover:bg-calm-600'
                              : isDark
                                ? 'bg-gray-700 text-gray-500'
                                : 'bg-gray-200 text-gray-400'
                          }
                        `}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {solutions.length > 0 && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-calm-900/20' : 'bg-calm-50'}`}>
          <div className={`text-sm font-medium mb-2 ${isDark ? 'text-calm-300' : 'text-calm-700'}`}>
            {solutions.length} Lösungsstrategie{solutions.length > 1 ? 'n' : ''} identifiziert
          </div>
          <div className="flex flex-wrap gap-2">
            {solutions.map((s) => (
              <span
                key={s.id}
                className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-calm-900/40 text-calm-300' : 'bg-calm-100 text-calm-700'}`}
              >
                {s.emoji} {s.skillName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      <div
        className={`p-4 rounded-lg ${isDark ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <div className={`font-medium mb-1 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              Tipp für nächstes Mal
            </div>
            <p className={`text-sm ${isDark ? 'text-purple-300/80' : 'text-purple-600'}`}>
              Je früher in der Kette du einen Skill einsetzt, desto leichter ist es, das
              Problemverhalten zu verhindern. Achte besonders auf die ersten Warnsignale!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
