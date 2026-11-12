/**
 * GuidedForm - Geführte Eingabe der eigenen Sicht auf die vier Seiten
 *
 * Drei Fälle:
 * - neue Situation (Aussage + Kontext frei)
 * - eigene Sicht zu einer bestehenden Situation ergänzen (Aussage fest)
 * - eigenen Eintrag bearbeiten (Aussage fest)
 */

import { useState } from 'react'
import Button from '../../components/common/Button'
import ExampleSelector from './ExampleSelector'
import { LEVELS, ROLES } from './analysisStore'
import { vierOhrenDescriptions, roleDescriptions } from './vierOhrenExamples'
import { levelStyles, surface, textMain, textSub, fieldClass } from './levelStyles'

const emptyLevels = () => Object.fromEntries(LEVELS.map((level) => [level, '']))

export default function GuidedForm({ situation, entry, defaultRole = 'sender', onSave, onCancel }) {
  const isNewSituation = !situation
  const [statement, setStatement] = useState(situation?.statement ?? '')
  const [context, setContext] = useState(situation?.context ?? '')
  const [role, setRole] = useState(entry?.role ?? defaultRole)
  const [levels, setLevels] = useState(() => ({ ...emptyLevels(), ...entry?.levels }))

  const setLevel = (level, value) => setLevels((prev) => ({ ...prev, [level]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!statement.trim()) return
    onSave({ statement, context, role, levels })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      {/* Schritt 1: Die Aussage */}
      <section className={`${surface} p-5 space-y-4`}>
        <h3 className={`font-semibold ${textMain}`}>1. Die Aussage</h3>

        {isNewSituation ? (
          <>
            <div className="space-y-1">
              <label htmlFor="vo-statement" className={`block text-sm font-medium ${textMain}`}>
                Was wurde gesagt? Möglichst wörtlich.
              </label>
              <textarea
                id="vo-statement"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={2}
                required
                maxLength={4000}
                className={fieldClass}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="vo-context" className={`block text-sm font-medium ${textMain}`}>
                Situation (optional)
              </label>
              <textarea
                id="vo-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                maxLength={4000}
                placeholder="Wo, wann, was war vorher?"
                className={fieldClass}
              />
            </div>
            {!statement && (
              <ExampleSelector
                onSelect={(example) => {
                  setStatement(example.statement)
                  setContext(example.context)
                }}
              />
            )}
          </>
        ) : (
          <div>
            <p className={`text-lg font-medium ${textMain}`}>&bdquo;{statement}&ldquo;</p>
            {context && <p className={`text-sm mt-1 ${textSub}`}>{context}</p>}
          </div>
        )}
      </section>

      {/* Schritt 2: Die Rolle */}
      <fieldset className={`${surface} p-5`}>
        <legend className={`font-semibold float-left w-full mb-3 ${textMain}`}>
          2. Meine Rolle
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 clear-both">
          {ROLES.map((value) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors duration-200 ${
                role === value
                  ? 'border-calm-500 bg-calm-50 dark:bg-dark-elevated'
                  : 'border-gray-200 dark:border-dark-border'
              } ${textMain}`}
            >
              <input
                type="radio"
                name="vo-role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="w-4 h-4 accent-indigo-500"
              />
              {roleDescriptions[value].label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Schritt 3: Die vier Seiten */}
      <section className={`${surface} p-5 space-y-4`}>
        <div>
          <h3 className={`font-semibold ${textMain}`}>
            3. Die vier Seiten: {roleDescriptions[role].heading}
          </h3>
          <p className={`text-sm mt-1 ${textSub}`}>
            Kurze Sätze reichen. Ein Feld darf leer bleiben, wenn es unklar ist.
          </p>
        </div>

        {LEVELS.map((level) => {
          const description = vierOhrenDescriptions[level]
          const style = levelStyles[description.color]
          return (
            <div key={level} className={`rounded-xl border p-4 space-y-2 ${style.box}`}>
              <label htmlFor={`vo-${level}`} className="block">
                <span className={`font-semibold ${style.title}`}>
                  <span aria-hidden="true">{description.icon}</span> {description.name}
                </span>
                <span className={`block text-sm mt-1 ${textMain}`}>
                  {description.questions[role]}
                </span>
              </label>
              <textarea
                id={`vo-${level}`}
                value={levels[level]}
                onChange={(e) => setLevel(level, e.target.value)}
                rows={2}
                maxLength={4000}
                aria-describedby={`vo-${level}-help`}
                className={fieldClass}
              />
              <p id={`vo-${level}-help`} className={`text-xs ${textSub}`}>
                {description.description}
              </p>
            </div>
          )
        })}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={!statement.trim()} icon="💾">
          Speichern
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
