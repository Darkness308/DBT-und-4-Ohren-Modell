import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../../components/common/Button'
import { skillFinder } from '../dbt-skills/SkillFinderAgent'

/**
 * SkillLogger - Erfasst welche Skills heute genutzt wurden
 */
export default function SkillLogger({ skillsUsed = [], onSkillAdd }) {
  const { isDark } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = skillFinder.searchSkills(query)
      setSearchResults(results.slice(0, 5))
    } else {
      setSearchResults([])
    }
  }

  const handleAddSkill = (skill, effectiveness = 3) => {
    onSkillAdd({
      skillId: skill.id,
      skillName: skill.name,
      module: skill.module?.id || skill.module,
      effectiveness,
    })
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)

    // Auch im SkillFinder als verwendet markieren
    skillFinder.markSkillUsed(skill.id, effectiveness)
  }

  const modules = skillFinder.getAllModules()

  // Quick-Add Buttons für häufige Skills
  const quickSkills = [
    { id: 'tipp', name: 'TIPP', emoji: '🧊' },
    { id: 'stop', name: 'STOP', emoji: '✋' },
    { id: 'accepts', name: 'ACCEPTS', emoji: '🎯' },
    { id: 'wise-mind', name: 'Wise Mind', emoji: '🧠' },
    { id: 'radical-acceptance', name: 'Radikale Akzeptanz', emoji: '🙏' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
        >
          Heute genutzte Skills
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Welche Skills hast du heute angewendet?
        </p>
      </div>

      {/* Quick-Add Buttons */}
      <div>
        <p className={`text-sm mb-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
          Schnell hinzufügen:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => {
                const fullSkill = skillFinder.getSkillById(skill.id)
                if (fullSkill) {
                  handleAddSkill(fullSkill)
                } else {
                  // Fallback für nicht gefundene Skills
                  onSkillAdd({
                    skillId: skill.id,
                    skillName: skill.name,
                    effectiveness: 3,
                  })
                }
              }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                border transition-all duration-200
                ${isDark ? 'border-gray-700 hover:border-calm-500 hover:bg-calm-900/20' : 'border-gray-200 hover:border-calm-500 hover:bg-calm-50'}
              `}
            >
              <span>{skill.emoji}</span>
              <span className={`text-sm ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}>
                {skill.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div>
        <Button variant="secondary" size="sm" onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? 'Suche schließen' : '+ Skill suchen'}
        </Button>

        {showSearch && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Skill suchen..."
              className={`
                w-full p-3 rounded-lg border
                ${isDark ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}
                focus:ring-2 focus:ring-calm-500 focus:border-transparent
              `}
            />

            {searchResults.length > 0 && (
              <div
                className={`
                rounded-lg border overflow-hidden
                ${isDark ? 'border-gray-700' : 'border-gray-200'}
              `}
              >
                {searchResults.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleAddSkill(skill)}
                    className={`
                      w-full p-3 text-left flex items-center justify-between
                      ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}
                      border-b last:border-b-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}
                    `}
                  >
                    <div>
                      <span
                        className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
                      >
                        {skill.name}
                      </span>
                      <span
                        className={`text-sm ml-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                      >
                        {skill.module?.name}
                      </span>
                    </div>
                    <span className="text-calm-600">+</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Liste der genutzten Skills */}
      {skillsUsed.length > 0 && (
        <div>
          <p className={`text-sm mb-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
            Heute genutzt ({skillsUsed.length}):
          </p>
          <div className="space-y-2">
            {skillsUsed.map((skill, idx) => (
              <div
                key={idx}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className={`${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
                    {skill.skillName}
                  </span>
                </div>
                <span className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                  {new Date(skill.timestamp).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillsUsed.length === 0 && (
        <div
          className={`
          text-center py-8 rounded-lg border-2 border-dashed
          ${isDark ? 'border-gray-700 text-darkText-secondary' : 'border-gray-200 text-gray-400'}
        `}
        >
          <p>Noch keine Skills heute genutzt</p>
          <p className="text-sm mt-1">Füge oben Skills hinzu, die du angewendet hast</p>
        </div>
      )}
    </div>
  )
}
