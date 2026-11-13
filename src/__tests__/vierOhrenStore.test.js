import { describe, it, expect } from 'vitest'
import {
  LEVELS,
  createEntry,
  createTombstone,
  updateEntry,
  upsertEntry,
  removeEntry,
  groupBySituation,
  oppositeRole,
  buildExport,
  parseImport,
  mergeEntries,
  newId,
  sanitizeEntries,
} from '../modules/vier-ohren/analysisStore'

const anna = { id: 'p-anna', name: 'Anna' }
const ben = { id: 'p-ben', name: 'Ben' }
const t0 = new Date('2026-01-01T10:00:00.000Z')
const t1 = new Date('2026-01-01T11:00:00.000Z')
const t2 = new Date('2026-01-02T09:00:00.000Z')

const base = {
  author: anna,
  role: 'sender',
  statement: '  Die Ampel ist grün.  ',
  context: 'Autofahrt',
  levels: { sachebene: 'Die Ampel zeigt Grün.', appellseite: 'Fahr bitte los.' },
}

describe('createEntry', () => {
  it('legt einen Eintrag mit allen vier Ebenen an', () => {
    const entry = createEntry(base, t0)
    expect(entry.statement).toBe('Die Ampel ist grün.')
    expect(Object.keys(entry.levels)).toEqual(LEVELS)
    expect(entry.levels.selbstoffenbarung).toBe('')
    expect(entry.levels.appellseite).toBe('Fahr bitte los.')
    expect(entry.createdAt).toBe(t0.toISOString())
    expect(entry.id).toBeTruthy()
    expect(entry.situationId).toBeTruthy()
  })

  it('übernimmt eine bestehende situationId', () => {
    const first = createEntry(base, t0)
    const second = createEntry(
      { ...base, author: ben, role: 'receiver', situationId: first.situationId },
      t1
    )
    expect(second.situationId).toBe(first.situationId)
    expect(second.id).not.toBe(first.id)
  })

  it('lehnt leere Aussage, unbekannte Rolle und fehlendes Profil ab', () => {
    expect(() => createEntry({ ...base, statement: '   ' })).toThrow()
    expect(() => createEntry({ ...base, role: 'zuschauer' })).toThrow()
    expect(() => createEntry({ ...base, author: null })).toThrow()
  })
})

describe('updateEntry / upsertEntry / removeEntry', () => {
  it('ändert Antworten und setzt updatedAt', () => {
    const entry = createEntry(base, t0)
    const changed = updateEntry(entry, { levels: { sachebene: 'Neu' } }, t1)
    expect(changed.levels.sachebene).toBe('Neu')
    expect(changed.levels.appellseite).toBe('')
    expect(changed.updatedAt).toBe(t1.toISOString())
    expect(changed.createdAt).toBe(t0.toISOString())
  })

  it('ersetzt über die ID statt zu duplizieren', () => {
    const entry = createEntry(base, t0)
    const changed = updateEntry(entry, { levels: { sachebene: 'Neu' } }, t1)
    const list = upsertEntry(upsertEntry([], entry), changed)
    expect(list).toHaveLength(1)
    expect(list[0].levels.sachebene).toBe('Neu')
    expect(removeEntry(list, entry.id)).toHaveLength(0)
  })
})

describe('groupBySituation', () => {
  it('legt zwei Sichten auf dieselbe Situation zusammen, neueste Situation zuerst', () => {
    const a1 = createEntry(base, t0)
    const b1 = createEntry(
      { ...base, author: ben, role: 'receiver', situationId: a1.situationId },
      t1
    )
    const a2 = createEntry({ ...base, statement: 'Du bist spät dran.' }, t2)

    const groups = groupBySituation([b1, a2, a1])
    expect(groups).toHaveLength(2)
    expect(groups[0].statement).toBe('Du bist spät dran.')
    expect(groups[1].entries.map((e) => e.author.name)).toEqual(['Anna', 'Ben'])
    expect(groups[1].updatedAt).toBe(t1.toISOString())
  })

  it('oppositeRole tauscht die Rolle', () => {
    expect(oppositeRole('sender')).toBe('receiver')
    expect(oppositeRole('receiver')).toBe('sender')
  })
})

describe('Export / Import', () => {
  it('übersteht den Roundtrip unverändert', () => {
    const entries = [createEntry(base, t0)]
    const text = JSON.stringify(buildExport(entries, anna, t1))
    const result = parseImport(text)
    expect(result.entries).toEqual(entries)
    expect(result.skipped).toBe(0)
    expect(result.exportedBy).toEqual(anna)
  })

  it('lehnt fremde Dateien und falsches Schema ab', () => {
    expect(() => parseImport('kein json')).toThrow()
    expect(() => parseImport(JSON.stringify({ version: '1.0.0', data: {} }))).toThrow()
    expect(() =>
      parseImport(JSON.stringify({ app: 'ctmm-vier-ohren', schema: 99, entries: [] }))
    ).toThrow()
  })

  it('überspringt defekte Einträge und entfernt unbekannte Felder', () => {
    const good = { ...createEntry(base, t0), fremd: '<script>' }
    const bad = { id: 'x', statement: 'ohne Autor' }
    const text = JSON.stringify({ ...buildExport([good, bad], anna, t1) })
    const result = parseImport(text)
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0]).not.toHaveProperty('fremd')
    expect(result.skipped).toBe(1)
  })
  it('überspringt Einträge mit überlangen IDs, statt sie zu kürzen', () => {
    const prefix = 'x'.repeat(80)
    const a = { ...createEntry(base, t0), id: `${prefix}-a` }
    const b = { ...createEntry(base, t0), id: `${prefix}-b` }
    const ok = { ...createEntry(base, t0), id: prefix }
    const result = parseImport(JSON.stringify(buildExport([a, b, ok], anna, t1)))
    expect(result.entries.map((e) => e.id)).toEqual([prefix])
    expect(result.skipped).toBe(2)
  })
})

describe('mergeEntries', () => {
  it('fügt neue Einträge hinzu und behält bei gleicher ID den neueren', () => {
    const mine = createEntry(base, t0)
    const theirs = createEntry(
      { ...base, author: ben, role: 'receiver', situationId: mine.situationId },
      t1
    )
    const mineNewer = updateEntry(mine, { levels: { sachebene: 'Neuer Stand' } }, t2)

    const first = mergeEntries([mine], [theirs, mineNewer])
    expect(first.added).toBe(1)
    expect(first.updated).toBe(1)
    expect(first.entries).toHaveLength(2)
    expect(first.entries.find((e) => e.id === mine.id).levels.sachebene).toBe('Neuer Stand')

    // Älterer Stand überschreibt nichts; erneuter Import ändert nichts
    const second = mergeEntries(first.entries, [mine, theirs])
    expect(second.added).toBe(0)
    expect(second.updated).toBe(0)
    expect(second.unchanged).toBe(2)
    expect(second.entries.find((e) => e.id === mine.id).levels.sachebene).toBe('Neuer Stand')
  })

  it('ändert bei bekannter ID nur Rolle und Antworten, nie Autor, Situation oder Aussage', () => {
    const theirs = createEntry({ ...base, author: ben, role: 'receiver' }, t0)
    const tampered = {
      ...theirs,
      statement: 'Etwas ganz anderes',
      context: 'anderer Kontext',
      createdAt: t2.toISOString(),
      levels: { ...theirs.levels, sachebene: 'Bens neuer Stand' },
      updatedAt: t1.toISOString(),
    }
    const result = mergeEntries([theirs], [tampered], { ownerId: anna.id })
    expect(result.updated).toBe(1)
    expect(result.entries[0].statement).toBe(theirs.statement)
    expect(result.entries[0].context).toBe(theirs.context)
    expect(result.entries[0].createdAt).toBe(theirs.createdAt)
    expect(result.entries[0].levels.sachebene).toBe('Bens neuer Stand')
  })

  it('lehnt Importe ab, die den Autor oder die Situation eines Eintrags ändern', () => {
    const theirs = createEntry({ ...base, author: ben, role: 'receiver' }, t0)
    const otherAuthor = { ...theirs, author: anna, updatedAt: t1.toISOString() }
    const otherSituation = { ...theirs, situationId: 'andere', updatedAt: t1.toISOString() }
    const result = mergeEntries([theirs], [otherAuthor, otherSituation])
    expect(result.rejected).toBe(2)
    expect(result.entries).toEqual([theirs])
  })

  it('lässt eigene Einträge durch einen Import unverändert', () => {
    const mine = createEntry(base, t0)
    const foreignEdit = updateEntry(mine, { levels: { sachebene: 'von außen' } }, t1)
    const result = mergeEntries([mine], [foreignEdit], { ownerId: anna.id })
    expect(result.rejected).toBe(1)
    expect(result.entries).toEqual([mine])
  })
})

describe('Löschvermerke', () => {
  it('ein gelöschter eigener Eintrag kommt über eine ältere Export-Datei nicht zurück', () => {
    const mine = createEntry(base, t0)
    const oldExport = parseImport(JSON.stringify(buildExport([mine], ben, t1)))
    const tombstones = [createTombstone(mine, t2)]
    const result = mergeEntries([], oldExport.entries, {
      ownerId: anna.id,
      tombstones,
      incomingTombstones: oldExport.deleted,
    })
    expect(result.entries).toEqual([])
    expect(result.added).toBe(0)
    expect(result.tombstones).toEqual(tombstones)
  })

  it('das Löschen erreicht das andere Gerät über den Export', () => {
    const theirs = createEntry({ ...base, author: ben, role: 'receiver' }, t0)
    const file = parseImport(
      JSON.stringify(buildExport([], ben, t2, [createTombstone(theirs, t1)]))
    )
    const result = mergeEntries([theirs], file.entries, {
      ownerId: anna.id,
      incomingTombstones: file.deleted,
    })
    expect(result.removed).toBe(1)
    expect(result.entries).toEqual([])
    // und bleibt gelöscht, wenn später eine alte Datei kommt
    const again = mergeEntries(result.entries, [theirs], {
      ownerId: anna.id,
      tombstones: result.tombstones,
    })
    expect(again.entries).toEqual([])
  })

  it('fremde Löschvermerke entfernen keine eigenen oder fremd zugeordneten Einträge', () => {
    const mine = createEntry(base, t0)
    const theirs = createEntry({ ...base, author: ben, role: 'receiver' }, t0)
    const forged = [
      { id: mine.id, authorId: anna.id, deletedAt: t1.toISOString() },
      { id: theirs.id, authorId: 'jemand-anderes', deletedAt: t1.toISOString() },
    ]
    const result = mergeEntries([mine, theirs], [], {
      ownerId: anna.id,
      incomingTombstones: forged,
    })
    expect(result.removed).toBe(0)
    expect(result.entries).toHaveLength(2)
    expect(result.tombstones).toEqual([])
  })

  it('verwirft unlesbare Löschvermerke beim Import', () => {
    const data = { ...buildExport([], anna, t0), deleted: [{ id: 1 }, null, 'x'] }
    expect(parseImport(JSON.stringify(data)).deleted).toEqual([])
  })
})

describe('newId / sanitizeEntries', () => {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

  it('erzeugt UUIDs, auch ohne crypto.randomUUID', () => {
    expect(newId()).toMatch(uuid)
    const original = globalThis.crypto.randomUUID
    try {
      globalThis.crypto.randomUUID = undefined
      const ids = new Set(Array.from({ length: 50 }, newId))
      expect(ids.size).toBe(50)
      ids.forEach((id) => expect(id).toMatch(uuid))
    } finally {
      globalThis.crypto.randomUUID = original
    }
  })

  it('verwirft Unlesbares aus Backup-Daten', () => {
    const good = createEntry(base, t0)
    expect(sanitizeEntries([good, { id: 1 }, null])).toEqual([good])
    expect(sanitizeEntries('kaputt')).toEqual([])
  })
})
