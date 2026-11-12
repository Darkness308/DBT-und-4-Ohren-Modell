/**
 * VierOhrenAnalyzer - Geführte Selbstanalyse nach dem Vier-Seiten-Modell
 *
 * Die App deutet nichts automatisch. Jede Person hält die eigene Sicht fest
 * (gemeint oder gehört). Zwei Sichten auf dieselbe Situation werden
 * nebeneinander gelegt. Austausch zwischen Geräten per Export-Datei.
 */

import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/common/Button'
import GuidedForm from './GuidedForm'
import SituationList from './SituationList'
import SituationDetail from './SituationDetail'
import SharePanel from './SharePanel'
import {
  buildExport,
  createEntry,
  createProfile,
  groupBySituation,
  loadEntries,
  loadProfile,
  mergeEntries,
  oppositeRole,
  parseImport,
  removeEntry,
  saveEntries,
  saveProfile,
  updateEntry,
  upsertEntry,
} from './analysisStore'
import { exportFilename, shareOrDownloadJson } from './shareFile'
import { surface, textMain, textSub, fieldClass } from './levelStyles'

export default function VierOhrenAnalyzer() {
  const [profile, setProfile] = useState(loadProfile)
  const [entries, setEntries] = useState(loadEntries)
  // view: { name: 'list' } | { name: 'form', situationId?, entryId? } | { name: 'detail', situationId }
  const [view, setView] = useState({ name: 'list' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const situations = useMemo(() => groupBySituation(entries), [entries])
  const activeSituation = situations.find((s) => s.situationId === view.situationId) || null

  const handleExport = async (list) => {
    const result = await shareOrDownloadJson(
      buildExport(list, profile),
      exportFilename(profile.name)
    )
    if (result !== 'cancelled') {
      setMessage(
        `${list.length} ${list.length === 1 ? 'Eintrag' : 'Einträge'} exportiert. Die Datei kann jetzt verschickt werden.`
      )
    }
  }

  const handleImportFile = async (file) => {
    try {
      const { entries: incoming, skipped } = parseImport(await file.text())
      const result = mergeEntries(entries, incoming)
      setEntries(result.entries)
      setMessage(
        `Import fertig: ${result.added} neu, ${result.updated} aktualisiert, ${result.unchanged} unverändert` +
          (skipped ? `, ${skipped} übersprungen (unlesbar).` : '.')
      )
    } catch (error) {
      setMessage(`Import nicht möglich: ${error.message}`)
    }
  }

  const handleSave = ({ statement, context, role, levels }) => {
    const existing = entries.find((e) => e.id === view.entryId)
    const entry = existing
      ? updateEntry(existing, { role, levels })
      : createEntry({
          author: profile,
          role,
          statement,
          context,
          levels,
          situationId: view.situationId,
        })
    setEntries((prev) => upsertEntry(prev, entry))
    setMessage('')
    setView({ name: 'detail', situationId: entry.situationId })
  }

  const handleDelete = (entry) => {
    if (!window.confirm('Deine Sicht auf diese Situation löschen?')) return
    const remaining = removeEntry(entries, entry.id)
    setEntries(remaining)
    const stillExists = remaining.some((e) => e.situationId === entry.situationId)
    setView(stillExists ? { name: 'detail', situationId: entry.situationId } : { name: 'list' })
  }

  if (!profile) {
    return (
      <ProfileSetup
        onSave={(name) => {
          const created = createProfile(name)
          saveProfile(created)
          setProfile(created)
        }}
      />
    )
  }

  if (view.name === 'form') {
    const entry = entries.find((e) => e.id === view.entryId)
    const other = activeSituation?.entries.find((e) => e.author.id !== profile.id)
    return (
      <GuidedForm
        key={view.entryId || view.situationId || 'new'}
        situation={activeSituation}
        entry={entry}
        defaultRole={other ? oppositeRole(other.role) : 'sender'}
        onSave={handleSave}
        onCancel={() =>
          setView(
            activeSituation
              ? { name: 'detail', situationId: activeSituation.situationId }
              : { name: 'list' }
          )
        }
      />
    )
  }

  if (view.name === 'detail' && activeSituation) {
    return (
      <SituationDetail
        key={activeSituation.situationId}
        situation={activeSituation}
        profile={profile}
        onBack={() => setView({ name: 'list' })}
        onAddMine={() => setView({ name: 'form', situationId: activeSituation.situationId })}
        onEdit={(entry) =>
          setView({ name: 'form', situationId: activeSituation.situationId, entryId: entry.id })
        }
        onDelete={handleDelete}
        onShare={() => handleExport(activeSituation.entries)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className={`${surface} p-6 animate-fade-in`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl" aria-hidden="true">
            👂
          </span>
          <div>
            <h2 className={`text-2xl font-bold ${textMain}`}>Vier-Ohren-Modell</h2>
            <p className={textSub}>Gemeint und gehört nebeneinander legen</p>
          </div>
        </div>
        <p className={`leading-relaxed ${textMain}`}>
          Eine Aussage hat vier Seiten: <strong>Sache</strong>, <strong>Selbstoffenbarung</strong>,{' '}
          <strong>Beziehung</strong> und <strong>Appell</strong>. Hier hältst du fest, wie du eine
          Aussage gemeint oder gehört hast. Die andere Person macht dasselbe. Danach vergleichen wir
          beide Sichten.
        </p>
        <details className={`mt-3 text-sm ${textSub}`}>
          <summary className="cursor-pointer">Was dieses Werkzeug ist und was nicht</summary>
          <p className="mt-2">
            Das Vier-Seiten-Modell (Schulz von Thun, 1981) ist ein Lehr- und Reflexionsmodell. Es
            ist kein Test und kein Diagnose-Instrument. Die App deutet, bewertet und berechnet
            nichts. Sie ordnet nur, was ihr selbst eintragt.
          </p>
        </details>
        <div className="mt-4">
          <Button variant="primary" onClick={() => setView({ name: 'form' })} icon="➕">
            Neue Situation festhalten
          </Button>
        </div>
      </section>

      <section aria-label="Festgehaltene Situationen" className="space-y-3">
        <h3 className={`font-semibold ${textMain}`}>Situationen</h3>
        <SituationList
          situations={situations}
          profile={profile}
          onOpen={(situationId) => {
            setMessage('')
            setView({ name: 'detail', situationId })
          }}
        />
      </section>

      <SharePanel
        entryCount={entries.length}
        onExportAll={() => handleExport(entries)}
        onImportFile={handleImportFile}
        message={message}
      />

      <p className={`text-xs ${textSub}`}>Profil auf diesem Gerät: {profile.name}</p>
    </div>
  )
}

function ProfileSetup({ onSave }) {
  const [name, setName] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (name.trim()) onSave(name)
      }}
      className={`${surface} p-6 space-y-4 animate-fade-in`}
    >
      <h2 className={`text-xl font-bold ${textMain}`}>Wer nutzt dieses Gerät?</h2>
      <p className={`text-sm ${textSub}`}>
        Der Name steht später an deinen Einträgen, damit beide Sichten unterscheidbar sind. Er
        bleibt auf diesem Gerät und in deinen Export-Dateien.
      </p>
      <div className="space-y-1">
        <label htmlFor="vo-profile-name" className={`block text-sm font-medium ${textMain}`}>
          Name oder Kürzel
        </label>
        <input
          id="vo-profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
          autoComplete="off"
          className={fieldClass}
        />
      </div>
      <Button type="submit" variant="primary" disabled={!name.trim()}>
        Weiter
      </Button>
    </form>
  )
}
