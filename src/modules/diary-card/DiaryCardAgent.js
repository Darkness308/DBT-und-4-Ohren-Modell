/**
 * DiaryCardAgent
 * Verwaltet tägliches Emotions- und Skill-Tracking nach DBT
 *
 * Tracked werden:
 * - Emotionen (0-5 Skala)
 * - Genutzte Skills
 * - Drang-Intensitäten
 * - Problematische Verhaltensweisen
 */

import eventBus from '../../core/eventBus'

// Standard-Emotionen nach DBT
export const emotionCategories = {
  primary: [
    { id: 'angst', label: 'Angst', emoji: '😰', color: '#8B5CF6' },
    { id: 'wut', label: 'Wut', emoji: '😠', color: '#EF4444' },
    { id: 'trauer', label: 'Trauer', emoji: '😢', color: '#3B82F6' },
    { id: 'freude', label: 'Freude', emoji: '😊', color: '#22C55E' },
    { id: 'scham', label: 'Scham', emoji: '😳', color: '#EC4899' },
    { id: 'schuld', label: 'Schuld', emoji: '😔', color: '#6366F1' },
  ],
  secondary: [
    { id: 'einsamkeit', label: 'Einsamkeit', emoji: '🥺', color: '#64748B' },
    { id: 'hoffnungslosigkeit', label: 'Hoffnungslosigkeit', emoji: '😞', color: '#475569' },
    { id: 'eifersucht', label: 'Eifersucht', emoji: '😒', color: '#F59E0B' },
    { id: 'liebe', label: 'Liebe', emoji: '🥰', color: '#EC4899' },
    { id: 'stolz', label: 'Stolz', emoji: '😌', color: '#10B981' },
    { id: 'erleichterung', label: 'Erleichterung', emoji: '😮‍💨', color: '#06B6D4' },
  ],
}

// Drang-Kategorien (Urges)
export const urgeCategories = [
  { id: 'selbstverletzung', label: 'Selbstverletzung', icon: '⚠️', critical: true },
  { id: 'suizidal', label: 'Suizidale Gedanken', icon: '🆘', critical: true },
  { id: 'substanzen', label: 'Substanzkonsum', icon: '🍷', critical: false },
  { id: 'essstoerung', label: 'Essverhalten', icon: '🍽️', critical: false },
  { id: 'vermeidung', label: 'Vermeidung', icon: '🙈', critical: false },
  { id: 'aggression', label: 'Aggression', icon: '💢', critical: false },
]

class DiaryCardAgent {
  constructor() {
    this.storageKey = 'dbt-diary-card'
    this.entries = this.loadEntries()
  }

  /**
   * Lädt gespeicherte Einträge
   */
  loadEntries() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Speichert alle Einträge
   */
  saveEntries() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.entries))
  }

  /**
   * Erstellt oder aktualisiert einen Tageseintrag
   */
  saveEntry(entry) {
    const today = this.getDateKey(new Date())
    const existingIndex = this.entries.findIndex((e) => e.date === today)

    const fullEntry = {
      date: today,
      timestamp: new Date().toISOString(),
      emotions: entry.emotions || {},
      urges: entry.urges || {},
      skillsUsed: entry.skillsUsed || [],
      behaviors: entry.behaviors || [],
      notes: entry.notes || '',
      sleepHours: entry.sleepHours || null,
      medicationTaken: entry.medicationTaken ?? null,
    }

    if (existingIndex >= 0) {
      // Merge mit bestehendem Eintrag
      this.entries[existingIndex] = {
        ...this.entries[existingIndex],
        ...fullEntry,
        timestamp: new Date().toISOString(),
      }
    } else {
      this.entries.push(fullEntry)
    }

    this.saveEntries()

    eventBus.emit('diary:updated', {
      date: today,
      entry: fullEntry,
    })

    return fullEntry
  }

  /**
   * Holt Eintrag für ein Datum
   */
  getEntry(date = new Date()) {
    const dateKey = this.getDateKey(date)
    return this.entries.find((e) => e.date === dateKey) || null
  }

  /**
   * Holt Einträge für einen Zeitraum
   */
  getEntriesRange(startDate, endDate) {
    const start = this.getDateKey(startDate)
    const end = this.getDateKey(endDate)

    return this.entries.filter((e) => e.date >= start && e.date <= end)
  }

  /**
   * Holt die letzten N Tage
   */
  getLastDays(days = 7) {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days + 1)
    return this.getEntriesRange(start, end)
  }

  /**
   * Berechnet Statistiken für einen Zeitraum
   */
  getStats(days = 7) {
    const entries = this.getLastDays(days)

    if (entries.length === 0) {
      return {
        averageEmotions: {},
        skillUsageCount: {},
        urgePatterns: {},
        streakDays: 0,
        completionRate: 0,
      }
    }

    // Durchschnittliche Emotionen
    const emotionSums = {}
    const emotionCounts = {}

    entries.forEach((entry) => {
      Object.entries(entry.emotions || {}).forEach(([emotion, value]) => {
        emotionSums[emotion] = (emotionSums[emotion] || 0) + value
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      })
    })

    const averageEmotions = {}
    Object.keys(emotionSums).forEach((emotion) => {
      averageEmotions[emotion] = emotionSums[emotion] / emotionCounts[emotion]
    })

    // Skill-Nutzung
    const skillUsageCount = {}
    entries.forEach((entry) => {
      ;(entry.skillsUsed || []).forEach((skill) => {
        skillUsageCount[skill.skillId] = (skillUsageCount[skill.skillId] || 0) + 1
      })
    })

    // Urge-Muster
    const urgePatterns = {}
    entries.forEach((entry) => {
      Object.entries(entry.urges || {}).forEach(([urge, value]) => {
        if (!urgePatterns[urge]) urgePatterns[urge] = []
        urgePatterns[urge].push(value)
      })
    })

    // Streak berechnen
    let streakDays = 0
    const sortedEntries = [...this.entries].sort((a, b) => b.date.localeCompare(a.date))

    for (let i = 0; i < sortedEntries.length; i++) {
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)
      const expectedKey = this.getDateKey(expectedDate)

      if (sortedEntries[i]?.date === expectedKey) {
        streakDays++
      } else {
        break
      }
    }

    return {
      averageEmotions,
      skillUsageCount,
      urgePatterns,
      streakDays,
      completionRate: entries.length / days,
      totalEntries: entries.length,
    }
  }

  /**
   * Prüft auf kritische Urges und gibt Warnung zurück
   */
  checkCriticalUrges(entry) {
    const warnings = []

    urgeCategories
      .filter((u) => u.critical)
      .forEach((urge) => {
        const value = entry.urges?.[urge.id]
        if (value >= 4) {
          warnings.push({
            type: 'critical',
            urge: urge.id,
            label: urge.label,
            value,
            message: `Hoher Drang: ${urge.label}. Bitte nutze einen TIPP-Skill oder hole dir Unterstützung.`,
            helpline: '0800 111 0 111',
          })
        } else if (value >= 3) {
          warnings.push({
            type: 'warning',
            urge: urge.id,
            label: urge.label,
            value,
            message: `Erhöhter Drang: ${urge.label}. Ein guter Zeitpunkt für einen Skill.`,
          })
        }
      })

    return warnings
  }

  /**
   * Formatiert Datum als YYYY-MM-DD
   */
  getDateKey(date) {
    return date.toISOString().split('T')[0]
  }

  /**
   * Löscht einen Eintrag
   */
  deleteEntry(date) {
    const dateKey = typeof date === 'string' ? date : this.getDateKey(date)
    this.entries = this.entries.filter((e) => e.date !== dateKey)
    this.saveEntries()
  }

  /**
   * Exportiert Daten als JSON
   */
  exportData() {
    return {
      exportDate: new Date().toISOString(),
      entries: this.entries,
      stats: this.getStats(30),
    }
  }
}

export const diaryCard = new DiaryCardAgent()
export default diaryCard
