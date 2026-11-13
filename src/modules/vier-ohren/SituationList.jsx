/**
 * SituationList - Übersicht aller festgehaltenen Situationen
 */

import { roleDescriptions } from './vierOhrenExamples'
import { surface, textMain, textSub } from './levelStyles'

export default function SituationList({ situations, profile, onOpen }) {
  if (situations.length === 0) {
    return (
      <div className={`${surface} p-6 text-center`}>
        <p className={textSub}>Noch keine Situation festgehalten.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {situations.map((situation) => {
        const mine = situation.entries.some((e) => e.author.id === profile.id)
        return (
          <li key={situation.situationId}>
            <button
              type="button"
              onClick={() => onOpen(situation.situationId)}
              className={`${surface} w-full text-left p-4 hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-calm-500`}
            >
              <p className={`font-medium ${textMain}`}>&bdquo;{situation.statement}&ldquo;</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {situation.entries.map((entry) => (
                  <span
                    key={entry.id}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-elevated text-gray-700 dark:text-darkText-primary"
                  >
                    {entry.author.name}: {roleDescriptions[entry.role].short}
                  </span>
                ))}
                {!mine && (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    Meine Sicht fehlt noch
                  </span>
                )}
                <span className={`text-xs ml-auto ${textSub}`}>
                  {new Date(situation.updatedAt).toLocaleDateString('de-DE')}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
