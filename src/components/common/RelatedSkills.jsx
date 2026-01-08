/**
 * RelatedSkills - Cross-Verlinkung zu passenden Skills
 * Zeigt kontextbezogene Skill-Empfehlungen in anderen Modulen
 */

import { useMemo } from 'react'
import { dbtSkills, dbtModules } from '../../modules/dbt-skills/dbtSkills'
import { useApp } from '../../contexts/AppContext'

export default function RelatedSkills({ context, maxItems = 3 }) {
  const { navigate } = useApp()

  // Finde passende Skills basierend auf Kontext
  const relatedSkills = useMemo(() => {
    const contextLower = context.toLowerCase()

    // Keywords und zugehörige Skill-Tags
    const keywordMappings = {
      // Kommunikation
      kommunikation: ['kommunikation', 'grenzen', 'wünsche'],
      konflikt: ['kommunikation', 'grenzen', 'stop'],
      streit: ['kommunikation', 'stop', 'emotionen'],
      missverständnis: ['kommunikation', 'klarheit'],

      // Emotionen
      wut: ['impuls', 'schnell', 'akut'],
      ärger: ['impuls', 'schnell', 'stop'],
      angst: ['akut', 'körperlich', 'beruhigend'],
      trauer: ['emotionen', 'akzeptanz', 'durchleben'],
      stress: ['körperlich', 'schnell', 'beruhigend'],

      // Situationen
      arbeit: ['kommunikation', 'grenzen', 'wünsche'],
      beziehung: ['kommunikation', 'beziehung', 'empathie'],
      familie: ['kommunikation', 'grenzen', 'beziehung'],
    }

    // Finde relevante Tags
    const relevantTags = new Set()
    Object.entries(keywordMappings).forEach(([keyword, tags]) => {
      if (contextLower.includes(keyword)) {
        tags.forEach((tag) => relevantTags.add(tag))
      }
    })

    // Fallback: Kommunikations-Skills für Vier-Ohren
    if (relevantTags.size === 0) {
      ['kommunikation', 'klarheit', 'emotionen'].forEach((tag) => relevantTags.add(tag))
    }

    // Finde passende Skills
    return dbtSkills
      .filter((skill) => skill.tags.some((tag) => relevantTags.has(tag)))
      .slice(0, maxItems)
      .map((skill) => ({
        ...skill,
        module: dbtModules[skill.module],
      }))
  }, [context, maxItems])

  if (relatedSkills.length === 0) {
    return null
  }

  const handleSkillClick = (_skillId) => {
    // Navigiere zum Skill-Finder mit vorausgewähltem Skill
    navigate('skills')
    // Könnte erweitert werden um den Skill direkt zu öffnen
  }

  return (
    <div className="bg-calm-50 rounded-xl p-4 border border-calm-200 animate-fade-in">
      <h4 className="font-semibold text-calm-700 mb-3 flex items-center gap-2">
        <span>🔗</span> Passende DBT-Skills
      </h4>

      <div className="space-y-2">
        {relatedSkills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => handleSkillClick(skill.id)}
            className="w-full flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 text-left group"
          >
            <span className="text-xl">{skill.module?.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 group-hover:text-calm-600 truncate">
                {skill.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{skill.shortDescription}</p>
            </div>
            <span className="text-gray-400 group-hover:text-calm-500">→</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Diese Skills können bei ähnlichen Situationen helfen
      </p>
    </div>
  )
}

/**
 * Kompakte Version für Inline-Nutzung
 */
export function RelatedSkillsBadge({ skillId, onClick }) {
  const skill = dbtSkills.find((s) => s.id === skillId)
  if (!skill) return null

  const module = dbtModules[skill.module]

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 bg-calm-50 text-calm-700 rounded-full text-xs hover:bg-calm-100 transition-colors"
    >
      <span>{module?.icon}</span>
      <span>{skill.name}</span>
    </button>
  )
}
