/**
 * SkillDetail - Detailansicht eines Skills
 */

import { useState } from 'react'
import Button from '../common/Button'

export default function SkillDetail({ skill, onBack, onMarkUsed }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState(false)

  const handleMarkUsed = (effectiveness) => {
    onMarkUsed(effectiveness)
    setFeedbackGiven(true)
    setShowFeedback(false)
  }

  const moduleColors = {
    achtsamkeit: 'from-blue-500 to-blue-600',
    stresstoleranz: 'from-orange-500 to-orange-600',
    emotionsregulation: 'from-green-500 to-green-600',
    zwischenmenschlich: 'from-yellow-500 to-yellow-600'
  }

  const moduleBgColors = {
    achtsamkeit: 'bg-blue-50',
    stresstoleranz: 'bg-orange-50',
    emotionsregulation: 'bg-green-50',
    zwischenmenschlich: 'bg-yellow-50'
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className={`bg-gradient-to-r ${moduleColors[skill.module.id]} rounded-xl p-6 text-white`}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors"
        >
          ← Zurück
        </button>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{skill.module.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{skill.name}</h2>
            <p className="text-white/80">{skill.module.name}</p>
          </div>
        </div>
      </div>

      {/* Beschreibung */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-700 leading-relaxed">
          {skill.fullDescription}
        </p>
      </div>

      {/* Akronym (falls vorhanden) */}
      {skill.acronym && (
        <div className={`${moduleBgColors[skill.module.id]} rounded-xl p-6`}>
          <h3 className="font-semibold text-gray-800 mb-3">
            {skill.name} steht für:
          </h3>
          <div className="space-y-2">
            {Object.entries(skill.acronym).map(([letter, meaning]) => (
              <div key={letter} className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-calm-600">
                  {letter}
                </span>
                <p className="text-gray-700 pt-1">{meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wann anwenden */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🎯</span> Wann anwenden?
        </h3>
        <ul className="space-y-2">
          {skill.whenToUse.map((situation, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-calm-500 mt-0.5">•</span>
              {situation}
            </li>
          ))}
        </ul>
      </div>

      {/* Schritte */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Anleitung
        </h3>
        <div className="space-y-4">
          {skill.steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-calm-100 text-calm-700 flex items-center justify-center font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.instruction}</p>
                {step.scienceNote && (
                  <p className="text-gray-500 text-xs mt-1 italic">
                    ℹ️ {step.scienceNote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beispiele (falls vorhanden) */}
      {skill.examples && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span> Beispiele
          </h3>
          <div className="space-y-3">
            {skill.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800">{example.emotion}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <span className="text-red-600">Impuls:</span>
                    <p className="text-gray-600">{example.impuls}</p>
                  </div>
                  <div>
                    <span className="text-green-600">Opposite Action:</span>
                    <p className="text-gray-600">{example.opposite}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Effektivität */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Wirksamkeit</h3>
        <div className="grid grid-cols-2 gap-4">
          <EffectivenessBar
            label="Akut"
            value={skill.effectiveness.acute}
            description="Schnelle Wirkung in der Krise"
          />
          <EffectivenessBar
            label="Langfristig"
            value={skill.effectiveness.longterm}
            description="Nachhaltige Veränderung"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Feedback / Skill verwendet */}
      <div className="bg-calm-50 rounded-xl p-6 border border-calm-200">
        {!feedbackGiven ? (
          <>
            <p className="text-calm-700 mb-4">
              Hast du diesen Skill ausprobiert? Dein Feedback hilft dir, zu sehen,
              welche Skills für dich funktionieren.
            </p>
            {!showFeedback ? (
              <Button
                variant="calm"
                onClick={() => setShowFeedback(true)}
                icon="✓"
              >
                Skill als verwendet markieren
              </Button>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">Wie hilfreich war der Skill?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleMarkUsed(rating)}
                      className="w-10 h-10 rounded-full bg-white border-2 border-calm-300 hover:border-calm-500 hover:bg-calm-100 transition-all font-medium text-calm-700"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  1 = nicht hilfreich, 5 = sehr hilfreich
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 text-green-700">
            <span className="text-2xl">✅</span>
            <p className="font-medium">
              Super! Der Skill wurde in deiner History gespeichert.
            </p>
          </div>
        )}
      </div>

      {/* Zurück Button */}
      <Button
        variant="secondary"
        onClick={onBack}
        className="w-full"
        icon="←"
      >
        Zurück zur Übersicht
      </Button>
    </div>
  )
}

function EffectivenessBar({ label, value, description }) {
  const percentage = (value / 5) * 100

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}/5</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-calm-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  )
}
