/**
 * analysisStore - Datenmodell der geführten Vier-Ohren-Selbstanalyse
 *
 * Die App deutet nichts automatisch. Jede Person trägt ihre eigene Sicht
 * auf die vier Seiten einer Aussage ein. Zwei Sichten auf dieselbe Situation
 * (gleiche situationId) lassen sich nebeneinander legen.
 *
 * Austausch zwischen zwei Geräten: Export als JSON-Datei, Import mit
 * Zusammenführung (Merge) über die Eintrags-ID. Kein Server.
 *
 * Alle Funktionen außer load/save sind rein (ohne Seiteneffekte) und testbar.
 */

import { loadFromStorage, saveToStorage } from '../../core/storage'

export const LEVELS = ['sachebene', 'selbstoffenbarung', 'beziehungsebene', 'appellseite']
export const ROLES = ['sender', 'receiver']

export const EXPORT_APP_ID = 'ctmm-vier-ohren'
export const SCHEMA_VERSION = 1

const ENTRIES_KEY = 'vier-ohren-entries'
const PROFILE_KEY = 'vier-ohren-profile'
const MAX_TEXT = 4000
const MAX_NAME = 60

/** Eindeutige ID (UUID wenn verfügbar) */
export function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function cleanText(value, max = MAX_TEXT) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function cleanLevels(levels) {
  const result = {}
  LEVELS.forEach((level) => {
    result[level] = cleanText(levels?.[level])
  })
  return result
}

/** Profil für dieses Gerät anlegen */
export function createProfile(name) {
  return { id: newId(), name: cleanText(name, MAX_NAME) }
}

/**
 * Neuen Eintrag anlegen.
 * Ohne situationId entsteht eine neue Situation.
 */
export function createEntry(
  { author, role, statement, context, levels, situationId },
  now = new Date()
) {
  const cleanStatement = cleanText(statement)
  if (!cleanStatement) throw new Error('Die Aussage fehlt.')
  if (!ROLES.includes(role)) throw new Error('Unbekannte Rolle.')
  if (!author?.id || !cleanText(author.name, MAX_NAME)) throw new Error('Das Profil fehlt.')

  const timestamp = now.toISOString()
  return {
    id: newId(),
    situationId: situationId || newId(),
    author: { id: author.id, name: cleanText(author.name, MAX_NAME) },
    role,
    statement: cleanStatement,
    context: cleanText(context),
    levels: cleanLevels(levels),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/** Bestehenden Eintrag ändern (Rolle und Antworten) */
export function updateEntry(entry, { role, levels }, now = new Date()) {
  return {
    ...entry,
    role: ROLES.includes(role) ? role : entry.role,
    levels: cleanLevels(levels ?? entry.levels),
    updatedAt: now.toISOString(),
  }
}

/** Eintrag einfügen oder ersetzen (über die ID) */
export function upsertEntry(entries, entry) {
  const exists = entries.some((e) => e.id === entry.id)
  return exists ? entries.map((e) => (e.id === entry.id ? entry : e)) : [...entries, entry]
}

export function removeEntry(entries, id) {
  return entries.filter((e) => e.id !== id)
}

/**
 * Einträge zu Situationen gruppieren, neueste zuerst.
 * Aussage und Kontext stammen vom ältesten Eintrag der Situation.
 */
export function groupBySituation(entries) {
  const map = new Map()
  entries.forEach((entry) => {
    const list = map.get(entry.situationId) || []
    list.push(entry)
    map.set(entry.situationId, list)
  })

  return [...map.entries()]
    .map(([situationId, list]) => {
      const sorted = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      const updatedAt = sorted.reduce((max, e) => (e.updatedAt > max ? e.updatedAt : max), '')
      return {
        situationId,
        statement: sorted[0].statement,
        context: sorted[0].context,
        entries: sorted,
        updatedAt,
      }
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/** Die jeweils andere Rolle */
export function oppositeRole(role) {
  return role === 'sender' ? 'receiver' : 'sender'
}

/** Export-Objekt bauen */
export function buildExport(entries, profile, now = new Date()) {
  return {
    app: EXPORT_APP_ID,
    schema: SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    exportedBy: profile ? { id: profile.id, name: profile.name } : null,
    entries,
  }
}

function isIsoDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

/** Einen importierten Eintrag prüfen und auf bekannte Felder reduzieren */
function sanitizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null
  const statement = cleanText(raw.statement)
  const authorName = cleanText(raw.author?.name, MAX_NAME)
  const valid =
    typeof raw.id === 'string' &&
    raw.id &&
    typeof raw.situationId === 'string' &&
    raw.situationId &&
    typeof raw.author?.id === 'string' &&
    raw.author.id &&
    authorName &&
    ROLES.includes(raw.role) &&
    statement &&
    isIsoDate(raw.createdAt) &&
    isIsoDate(raw.updatedAt)

  if (!valid) return null

  return {
    id: raw.id,
    situationId: raw.situationId,
    author: { id: raw.author.id, name: authorName }
    role: raw.role,
    statement,
    context: cleanText(raw.context),
    levels: cleanLevels(raw.levels),
    createdAt: new Date(raw.createdAt).toISOString(),
    updatedAt: new Date(raw.updatedAt).toISOString(),
  }
}

/**
 * Export-Datei lesen und prüfen.
 * @returns {{ entries: Array, skipped: number, exportedBy: object|null }}
 */
export function parseImport(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Die Datei ist kein gültiges JSON.')
  }
  if (!data || data.app !== EXPORT_APP_ID || !Array.isArray(data.entries)) {
    throw new Error('Die Datei ist kein Vier-Ohren-Export dieser App.')
  }
  if (data.schema !== SCHEMA_VERSION) {
    throw new Error(
      `Die Datei hat Schema ${data.schema}. Diese App liest Schema ${SCHEMA_VERSION}.`
    )
  }

  const entries = []
  let skipped = 0
  data.entries.forEach((raw) => {
    const entry = sanitizeEntry(raw)
    if (entry) entries.push(entry)
    else skipped++
  })

  return { entries, skipped, exportedBy: data.exportedBy || null }
}

/**
 * Importierte Einträge mit den lokalen zusammenführen.
 * Gleiche ID: der Eintrag mit dem neueren updatedAt bleibt.
 */
export function mergeEntries(local, incoming) {
  const byId = new Map(local.map((e) => [e.id, e]))
  let added = 0
  let updated = 0
  let unchanged = 0

  incoming.forEach((entry) => {
    const existing = byId.get(entry.id)
    if (!existing) {
      byId.set(entry.id, entry)
      added++
    } else if (entry.updatedAt > existing.updatedAt) {
      byId.set(entry.id, entry)
      updated++
    } else {
      unchanged++
    }
  })

  return { entries: [...byId.values()], added, updated, unchanged }
}

// --- Persistenz (LocalStorage dieses Geräts) ---

export function loadEntries() {
  const stored = loadFromStorage(ENTRIES_KEY, [])
  return Array.isArray(stored) ? stored : []
}

export function saveEntries(entries) {
  return saveToStorage(ENTRIES_KEY, entries)
}

export function loadProfile() {
  const profile = loadFromStorage(PROFILE_KEY, null)
  return profile?.id && profile?.name ? profile : null
}

export function saveProfile(profile) {
  return saveToStorage(PROFILE_KEY, profile)
}
