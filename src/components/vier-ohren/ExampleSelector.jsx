/**
 * ExampleSelector - Auswahl von Beispiel-Aussagen
 */

import { vierOhrenExamples } from '../../data/vierOhrenExamples'
import Button from '../common/Button'

export default function ExampleSelector({ onSelect, onSkip }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Starte mit einem Beispiel
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Wähle eine Beispiel-Aussage, um das Vier-Ohren-Modell kennenzulernen.
      </p>

      <div className="space-y-3 mb-4">
        {vierOhrenExamples.map((example) => (
          <ExampleCard
            key={example.id}
            example={example}
            onClick={() => onSelect(example)}
          />
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <Button variant="ghost" onClick={onSkip} className="w-full">
          Eigene Aussage eingeben →
        </Button>
      </div>
    </div>
  )
}

function ExampleCard({ example, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-calm-300 hover:bg-calm-50 transition-all duration-200 group"
    >
      <p className="font-medium text-gray-800 group-hover:text-calm-700">
        &ldquo;{example.statement}&rdquo;
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {example.context}
      </p>
    </button>
  )
}
