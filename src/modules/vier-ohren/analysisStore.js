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
const MAX_ID = 80

/**
 * Eindeutige ID, immer im UUID-Format (v4).
 * Die geplante Datenbank speichert id und situation_id als uuid.
 */
export function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variante RFC 4122
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
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
  // IDs werden nie gekürzt: zu lange IDs könnten sonst zusammenfallen
  const isId = (value) => typeof value === 'string' && value.length > 0 && value.length <= MAX_ID
  const valid =
    isId(raw.id) &&
    isId(raw.situationId) &&
    isId(raw.author?.id) &&
    authorName &&
    ROLES.includes(raw.role) &&
    statement &&
    isIsoDate(raw.createdAt) &&
    isIsoDate(raw.updatedAt)

  if (!valid) return null

  return {
    id: raw.id,
    situationId: raw.situationId,
    author: { id: raw.author.id, name: authorName },
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
 *
 * - Neue ID: Eintrag wird übernommen.
 * - Bekannte ID: nur ein neuerer Stand (updatedAt) ändert etwas, und dann
 *   nur Rolle und Antworten. Autor, Situation, Aussage, Kontext und
 *   createdAt bleiben wie lokal (wie in der App nicht änderbar).
 * - Mit ownerId: Einträge dieser Person werden durch einen Import nie
 *   geändert. Nur sie selbst bearbeitet ihre Sicht.
 */
export function mergeEntries(local, incoming, { ownerId = null } = {}) {
  const byId = new Map(local.map((e) => [e.id, e]))
  let added = 0
  let updated = 0
  let unchanged = 0
  let rejected = 0

  incoming.forEach((entry) => {
    const existing = byId.get(entry.id)
    if (!existing) {
      byId.set(entry.id, entry)
      added++
    } else if (entry.updatedAt <= existing.updatedAt) {
      unchanged++
    } else if (
      (ownerId && existing.author.id === ownerId) ||
      entry.author.id !== existing.author.id ||
      entry.situationId !== existing.situationId
    ) {
      rejected++
    } else {
      byId.set(entry.id, {
        ...existing,
        role: entry.role,
        levels: entry.levels,
        updatedAt: entry.updatedAt,
      })
      updated++
    }
  })

  return { entries: [...byId.values()], added, updated, unchanged, rejected }
}

/** Rohdaten (z.B. aus einem Backup) prüfen; Unlesbares wird verworfen */
export function sanitizeEntries(rawEntries) {
  return Array.isArray(rawEntries) ? rawEntries.map(sanitizeEntry).filter(Boolean) : []
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

// --- Vollständiges Backup (Einstellungen → Daten) ---

/** Vier-Ohren-Daten dieses Geräts für das vollständige Backup */
export function getBackupData() {
  return { entries: loadEntries(), profile: loadProfile() }
}

/**
 * Vier-Ohren-Daten aus einem vollständigen Backup zurückholen.
 * Einträge werden zusammengeführt. Das Profil wird nur gesetzt, wenn auf
 * diesem Gerät noch keines existiert.
 */
export function restoreBackupData(data) {
  if (!data || typeof data !== 'object') return { added: 0, updated: 0 }

  if (!loadProfile() && typeof data.profile?.id === 'string' && data.profile.id.length <= MAX_ID) {
    const name = cleanText(data.profile.name, MAX_NAME)
    if (name) saveProfile({ id: data.profile.id, name })
  }

  const result = mergeEntries(loadEntries(), sanitizeEntries(data.entries))
  saveEntries(result.entries)
  return { added: result.added, updated: result.updated }
}
