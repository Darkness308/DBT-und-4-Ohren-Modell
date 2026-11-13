/**
 * SituationDetail - Sichten auf eine Situation nebeneinander
 *
 * Die App bewertet nicht. Sie legt nur nebeneinander, was gemeint
 * und was gehört wurde.
 */

import { useState } from 'react'
import Button from '../../components/common/Button'
import { LEVELS } from './analysisStore'
import { vierOhrenDescriptions, roleDescriptions } from './vierOhrenExamples'
import { levelStyles, surface, textMain, textSub } from './levelStyles'

export default function SituationDetail({
  situation,
  profile,
  onBack,
  onAddMine,
  onEdit,
  onDelete,
  onShare,
}) {
  const myEntry = situation.entries.find((e) => e.author.id === profile.id)
  const otherEntries = situation.entries.filter((e) => e.author.id !== profile.id)

  // Fremde Sicht bleibt verdeckt, bis die eigene eingetragen ist
  // (damit die eigene Erinnerung nicht beeinflusst wird)
  const [revealed, setRevealed] = useState(false)
  const hideOthers = !myEntry && otherEntries.length > 0 && !revealed
  const visibleEntries = hideOthers ? [] : situation.entries

  return (
    <div className="space-y-4 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className={`text-sm underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-calm-500 rounded ${textSub}`}
      >
        ← Zur Übersicht
      </button>

      <section className={`${surface} p-5`}>
        <p className={`text-sm ${textSub}`}>Aussage</p>
        <p className={`text-lg font-medium ${textMain}`}>&bdquo;{situation.statement}&ldquo;</p>
        {situation.context && <p className={`text-sm mt-2 ${textSub}`}>{situation.context}</p>}
      </section>

      {hideOthers && (
        <section className={`${surface} p-5 space-y-3`}>
          <p className={textMain}>
            {otherEntries.map((e) => e.author.name).join(' und ')}{' '}
            {otherEntries.length > 1 ? 'haben' : 'hat'} die eigene Sicht schon eingetragen. Sie
            bleibt verdeckt, bis deine Sicht steht. So bleibt deine Erinnerung unbeeinflusst.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={onAddMine} icon="✍️">
              Meine Sicht eintragen
            </Button>
            <Button
              variant="ghost"
              className="dark:text-darkText-secondary dark:hover:bg-dark-hover"
              onClick={() => setRevealed(true)}
            >
              Trotzdem anzeigen
            </Button>
          </div>
        </section>
      )}

      {visibleEntries.length > 0 && (
        <section className="space-y-3" aria-label="Vergleich der Sichten">
          {LEVELS.map((level) => {
            const description = vierOhrenDescriptions[level]
            const style = levelStyles[description.color]
            return (
              <div key={level} className={`rounded-xl border p-4 ${style.box}`}>
                <h3 className={`font-semibold mb-3 ${style.title}`}>
                  <span aria-hidden="true">{description.icon}</span> {description.name}
                </h3>
                <div
                  className={`grid grid-cols-1 gap-3 ${visibleEntries.length > 1 ? 'md:grid-cols-2' : ''}`}
                >
                  {visibleEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg bg-white/70 dark:bg-dark-surface/70 p-3"
                    >
                      <p className={`text-xs font-medium mb-1 ${textSub}`}>
                        {entry.author.name} · {roleDescriptions[entry.role].short}
                      </p>
                      <p className={`text-xs italic mb-1 ${textSub}`}>
                        {description.questions[entry.role]}
                      </p>
                      {entry.levels[level] ? (
                        <p className={`whitespace-pre-wrap ${textMain}`}>{entry.levels[level]}</p>
                      ) : (
                        <p className={`italic ${textSub}`}>offen gelassen</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {visibleEntries.length > 1 && (
        <section className={`${surface} p-5`}>
          <h3 className={`font-semibold mb-2 ${textMain}`}>Fürs Gespräch</h3>
          <ul className={`text-sm space-y-1 list-disc pl-5 ${textMain}`}>
            <li>Ein Unterschied ist eine Information. Er ist kein Fehler von jemandem.</li>
            <li>Auf welcher Seite liegen gemeint und gehört am weitesten auseinander?</li>
            <li>Welcher Satz hätte die gemeinte Seite direkt ausgesprochen?</li>
          </ul>
        </section>
      )}

      {!hideOthers && (
        <div className="flex flex-wrap gap-3">
          {myEntry ? (
            <Button variant="primary" onClick={() => onEdit(myEntry)} icon="✏️">
              Meine Sicht bearbeiten
            </Button>
          ) : (
            <Button variant="primary" onClick={onAddMine} icon="✍️">
              Meine Sicht eintragen
            </Button>
          )}
          <Button variant="calm" onClick={onShare} icon="📤">
            Diese Situation teilen
          </Button>
          {myEntry && (
            <Button variant="danger" onClick={() => onDelete(myEntry)}>
              Meine Sicht löschen
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
