/**
 * SkillLogger - Verwendete Skills protokollieren
 */

import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import skillFinder from '../../agents/SkillFinderAgent'

export default function SkillLogger({ skillsUsed, onAddSkill }) {
  const { isDark } = useTheme()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [effectiveness, setEffectiveness] = useState(3)

  const searchResults = searchQuery.length >= 2 ? skillFinder.searchSkills(searchQuery) : []

  const handleAddSkill = () => {
    if (selectedSkill) {
      onAddSkill(selectedSkill.id, selectedSkill.name, effectiveness)
      setSelectedSkill(null)
      setSearchQuery('')
      setEffectiveness(3)
      setShowSearch(false)
    }
  }

  return (
    <div
      className={`p-4 rounded-xl ${
        isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-semibold flex items-center gap-2 ${
            isDark ? 'text-darkText-primary' : 'text-gray-800'
          }`}
        >
          <span>🧰</span> Verwendete Skills
        </h3>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            isDark
              ? 'bg-success-900/50 text-success-300 hover:bg-success-900/70'
              : 'bg-success-100 text-success-700 hover:bg-success-200'
          }`}
        >
          + Skill hinzufügen
        </button>
      </div>

      {/* Skill hinzufügen Dialog */}
      {showSearch && (
        <div className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-dark-elevated' : 'bg-gray-50'}`}>
          {!selectedSkill ? (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Skill suchen..."
                className={`w-full p-2 rounded-lg mb-2 ${
                  isDark
                    ? 'bg-dark-surface border-dark-border text-darkText-primary placeholder:text-darkText-muted'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                } border focus:ring-2 focus:ring-success-500`}
              />

              {searchResults.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {searchResults.slice(0, 5).map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        isDark
                          ? 'hover:bg-dark-hover text-darkText-primary'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span
                        className={`text-xs ml-2 ${
                          isDark ? 'text-darkText-secondary' : 'text-gray-500'
                        }`}
                      >
                        {skill.module?.name || skill.module}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                  Keine Skills gefunden
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
                >
                  {selectedSkill.name}
                </span>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                >
                  Ändern
                </button>
              </div>

              <div className="mb-3">
                <label
                  className={`text-sm mb-2 block ${
                    isDark ? 'text-darkText-secondary' : 'text-gray-600'
                  }`}
                >
                  Wie effektiv war der Skill?
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEffectiveness(level)}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        effectiveness >= level
                          ? 'bg-success-500 text-white'
                          : isDark
                            ? 'bg-dark-border text-darkText-secondary'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddSkill}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-success-600 text-white hover:bg-success-500'
                    : 'bg-success-500 text-white hover:bg-success-600'
                }`}
              >
                Hinzufügen
              </button>
            </>
          )}
        </div>
      )}

      {/* Verwendete Skills Liste */}
      {skillsUsed.length > 0 ? (
        <div className="space-y-2">
          {skillsUsed.map((skill, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-dark-elevated' : 'bg-gray-50'
              }`}
            >
              <div>
                <span
                  className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
                >
                  {skill.skillName}
                </span>
                <span
                  className={`text-xs ml-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                >
                  {new Date(skill.timestamp).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      skill.effectiveness >= level
                        ? 'bg-success-500'
                        : isDark
                          ? 'bg-dark-border'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          className={`text-sm text-center py-4 ${
            isDark ? 'text-darkText-secondary' : 'text-gray-500'
          }`}
        >
          Noch keine Skills verwendet heute.
          <br />
          Probiere einen aus dem Skill-Finder!
        </p>
      )}
    </div>
  )
}
