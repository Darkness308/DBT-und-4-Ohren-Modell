/**
 * SkillOfTheDay - Täglicher Skill-Vorschlag
 */

import { useMemo } from 'react'
import { dbtSkills, dbtModules } from '../../data/dbtSkills'

export default function SkillOfTheDay() {
  // Skill basierend auf dem Tag auswählen (deterministisch)
  const skill = useMemo(() => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 86400000
    )
    const index = dayOfYear % dbtSkills.length
    return dbtSkills[index]
  }, [])

  const module = dbtModules[skill.module]

  const moduleColors = {
    achtsamkeit: 'from-blue-400 to-blue-600',
    stresstoleranz: 'from-orange-400 to-orange-600',
    emotionsregulation: 'from-green-400 to-green-600',
    zwischenmenschlich: 'from-yellow-400 to-yellow-600'
  }

  return (
    <div className={`bg-gradient-to-br ${moduleColors[skill.module]} rounded-xl p-6 text-white shadow-lg animate-fade-in`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{module?.icon}</span>
        <span className="text-sm font-medium text-white/80">Skill des Tages</span>
      </div>

      <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
      <p className="text-white/90 text-sm mb-4">
        {skill.shortDescription}
      </p>

      {/* Mini-Anleitung */}
      <div className="bg-white/20 rounded-lg p-3">
        <p className="text-xs text-white/80 mb-2">Erste Schritte:</p>
        {skill.steps.slice(0, 2).map((step, index) => (
          <p key={index} className="text-sm text-white flex items-start gap-2 mb-1">
            <span className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
              {index + 1}
            </span>
            <span>{step.title}</span>
          </p>
        ))}
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {skill.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-white/20 rounded-full text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
