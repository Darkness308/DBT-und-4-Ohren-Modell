/**
 * SituationSelector - Auswahl der aktuellen Situation
 */

import { skillFinder } from './SkillFinderAgent'

export default function SituationSelector({ selected, onSelect }) {
  const situationTypes = skillFinder.getAllSituationTypes()

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Was beschreibt deine Situation am besten?
      </h3>
      <p className="text-gray-500 text-sm mb-4">Wähle die Kategorie, die am ehesten zutrifft.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {situationTypes.map((situation) => (
          <SituationCard
            key={situation.id}
            situation={situation}
            isSelected={selected === situation.id}
            onClick={() => onSelect(situation.id)}
          />
        ))}
      </div>
    </div>
  )
}

function SituationCard({ situation, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-xl border-2 text-left
        transition-all duration-200
        ${
          isSelected
            ? 'border-calm-500 bg-calm-50 shadow-md'
            : 'border-gray-200 hover:border-calm-300 hover:bg-gray-50'
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="text-2xl block mb-2">{situation.icon}</span>
      <span className={`text-sm font-medium ${isSelected ? 'text-calm-700' : 'text-gray-700'}`}>
        {situation.label}
      </span>
    </button>
  )
}
