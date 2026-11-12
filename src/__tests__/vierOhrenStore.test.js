import { describe, it, expect } from 'vitest'
import {
  LEVELS,
  createEntry,
  updateEntry,
  upsertEntry,
  removeEntry,
  groupBySituation,
  oppositeRole,
  buildExport,
  parseImport,
  mergeEntries,
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
})
