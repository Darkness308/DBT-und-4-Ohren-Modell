/**
 * ExampleSelector - Übungssätze zum Ausprobieren
 */

import { vierOhrenExamples } from './vierOhrenExamples'
import { textMain, textSub } from './levelStyles'

export default function ExampleSelector({ onSelect }) {
  return (
    <div>
      <p className={`text-sm mb-2 ${textSub}`}>Oder ein Übungssatz zum Ausprobieren:</p>
      <div className="flex flex-wrap gap-2">
        {vierOhrenExamples.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => onSelect(example)}
            className={`px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border text-sm hover:border-calm-300 hover:bg-calm-50 dark:hover:bg-dark-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-calm-500 ${textMain}`}
          >
            &bdquo;{example.statement}&ldquo;
          </button>
        ))}
      </div>
    </div>
  )
}
