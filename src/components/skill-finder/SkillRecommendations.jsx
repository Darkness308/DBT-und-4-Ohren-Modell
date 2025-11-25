/**
 * SkillRecommendations - Zeigt empfohlene Skills an
 */

import { dbtModules } from '../../data/dbtSkills'

export default function SkillRecommendations({ results, onSkillSelect }) {
  const { situation, intensity, recommendations, tips } = results

  // Gruppiere nach Priorität
  const primarySkills = recommendations.filter(s => s.priority === 1)
  const secondarySkills = recommendations.filter(s => s.priority === 2)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-calm-50 rounded-xl p-4 border border-calm-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{situation.icon}</span>
          <div>
            <p className="font-medium text-calm-700">{situation.label}</p>
            <p className="text-sm text-gray-600">
              Intensität: {intensity.label}
            </p>
          </div>
        </div>
      </div>

      {/* Tipps */}
      {tips && tips.length > 0 && (
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </div>
      )}

      {/* Primäre Empfehlungen */}
      {primarySkills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Empfohlene Skills
          </h3>
          <div className="space-y-3">
            {primarySkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isPrimary={true}
                onClick={() => onSkillSelect(skill)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sekundäre Empfehlungen */}
      {secondarySkills.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-600 mb-3">
            Weitere passende Skills
          </h3>
          <div className="space-y-3">
            {secondarySkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isPrimary={false}
                onClick={() => onSkillSelect(skill)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Keine Ergebnisse */}
      {recommendations.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Keine passenden Skills gefunden. Versuche eine andere Situation.
          </p>
        </div>
      )}
    </div>
  )
}

function SkillCard({ skill, isPrimary, onClick }) {
  const module = dbtModules[skill.module]

  const moduleColors = {
    achtsamkeit: 'border-l-blue-500 bg-blue-50/30',
    stresstoleranz: 'border-l-orange-500 bg-orange-50/30',
    emotionsregulation: 'border-l-green-500 bg-green-50/30',
    zwischenmenschlich: 'border-l-yellow-500 bg-yellow-50/30'
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl border-l-4
        ${moduleColors[skill.module] || 'border-l-gray-300'}
        bg-white shadow-sm
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
        ${isPrimary ? 'ring-1 ring-calm-200' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{module?.icon}</span>
            <h4 className="font-semibold text-gray-800">{skill.name}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {skill.shortDescription}
          </p>
          <div className="flex items-center gap-2">
            <ModuleBadge module={module} />
            {isPrimary && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Empfohlen
              </span>
            )}
          </div>
        </div>
        <span className="text-gray-400 text-xl">→</span>
      </div>
    </button>
  )
}

function ModuleBadge({ module }) {
  if (!module) return null

  const colors = {
    achtsamkeit: 'bg-blue-100 text-blue-700',
    stresstoleranz: 'bg-orange-100 text-orange-700',
    emotionsregulation: 'bg-green-100 text-green-700',
    zwischenmenschlich: 'bg-yellow-100 text-yellow-700'
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[module.id]}`}>
      {module.name}
    </span>
  )
}

function TipCard({ tip }) {
  const bgColors = {
    warning: 'bg-amber-50 border-amber-200',
    crisis: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  const textColors = {
    warning: 'text-amber-700',
    crisis: 'text-red-700',
    info: 'text-blue-700'
  }

  return (
    <div className={`p-3 rounded-xl border ${bgColors[tip.type] || bgColors.info}`}>
      <p className={`text-sm ${textColors[tip.type] || textColors.info}`}>
        <span className="mr-2">{tip.icon}</span>
        {tip.text}
      </p>
    </div>
  )
}
