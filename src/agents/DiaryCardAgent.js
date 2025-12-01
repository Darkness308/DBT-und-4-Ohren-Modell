/**
 * DiaryCardAgent
 * Tägliches Emotions- und Skill-Tracking nach DBT
 *
 * Features:
 * - Emotionen tracken (0-5 Skala)
 * - Drang-Intensitäten erfassen
 * - Verwendete Skills protokollieren
 * - Schlaf & Stimmung dokumentieren
 * - Statistiken und Trends berechnen
 */

import { eventBus } from '../utils/eventBus'

// Standard-Emotionen nach DBT
export const EMOTIONS = [
  { id: 'sadness', name: 'Traurigkeit', emoji: '😢', color: '#3b82f6' },
  { id: 'anger', name: 'Wut', emoji: '😠', color: '#ef4444' },
  { id: 'fear', name: 'Angst', emoji: '😰', color: '#8b5cf6' },
  { id: 'shame', name: 'Scham', emoji: '😳', color: '#f59e0b' },
  { id: 'joy', name: 'Freude', emoji: '😊', color: '#22c55e' },
  { id: 'disgust', name: 'Ekel', emoji: '🤢', color: '#84cc16' },
  { id: 'anxiety', name: 'Anspannung', emoji: '😬', color: '#ec4899' },
]

// Drang-Typen (Urges)
export const URGES = [
  { id: 'selfHarm', name: 'Selbstverletzung', emoji: '🩹', warning: true },
  { id: 'substanceUse', name: 'Substanzkonsum', emoji: '🍷', warning: true },
  { id: 'isolation', name: 'Rückzug', emoji: '🚪', warning: false },
  { id: 'binge', name: 'Essanfall', emoji: '🍔', warning: true },
  { id: 'restrict', name: 'Nicht-Essen', emoji: '🚫', warning: true },
  { id: 'impulsive', name: 'Impulsives Verhalten', emoji: '⚡', warning: false },
]

// Intensitätsstufen
export const INTENSITY_SCALE = [
  { value: 0, label: 'Nicht vorhanden', color: '#d1d5db' },
  { value: 1, label: 'Minimal', color: '#86efac' },
  { value: 2, label: 'Leicht', color: '#fde047' },
  { value: 3, label: 'Moderat', color: '#fdba74' },
  { value: 4, label: 'Stark', color: '#f87171' },
  { value: 5, label: 'Extrem', color: '#dc2626' },
]

class DiaryCardAgent {
  constructor() {
    this.entries = []
    this.emotions = EMOTIONS
    this.urges = URGES
    this.intensityScale = INTENSITY_SCALE
  }

  /**
   * Lädt gespeicherte Einträge
   */
  loadEntries(savedEntries = []) {
    this.entries = savedEntries
  }

  /**
   * Erstellt einen neuen Tagebucheintrag
   */
  createEntry(date = new Date().toISOString().split('T')[0]) {
    // Prüfen ob Eintrag für diesen Tag existiert
    const existing = this.getEntryByDate(date)
    if (existing) return existing

    const entry = {
      id: `diary-${date}-${Date.now()}`,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Emotionen (0-5 Skala)
      emotions: EMOTIONS.reduce((acc, e) => ({ ...acc, [e.id]: 0 }), {}),

      // Drang-Intensitäten (0-5)
      urges: URGES.reduce((acc, u) => ({ ...acc, [u.id]: 0 }), {}),

      // Ob Drängen nachgegeben wurde
      urgesActedOn: URGES.reduce((acc, u) => ({ ...acc, [u.id]: false }), {}),

      // Verwendete Skills
      skillsUsed: [],

      // Schlaf
      sleep: {
        hours: null,
        quality: null, // 1-5
      },

      // Allgemeine Stimmung
      mood: null, // 1-5

      // Medikamente genommen
      medicationTaken: null, // true/false/null

      // Notizen
      notes: '',

      // Status
      isComplete: false,
    }

    return entry
  }

  /**
   * Speichert oder aktualisiert einen Eintrag
   */
  saveEntry(entry) {
    const index = this.entries.findIndex((e) => e.id === entry.id)
    const updatedEntry = {
      ...entry,
      updatedAt: new Date().toISOString(),
      isComplete: this.isEntryComplete(entry),
    }

    if (index >= 0) {
      this.entries[index] = updatedEntry
    } else {
      this.entries.push(updatedEntry)
    }

    // Event auslösen
    eventBus.emit('diary:entry-saved', {
      entryId: updatedEntry.id,
      date: updatedEntry.date,
      isComplete: updatedEntry.isComplete,
    })

    return updatedEntry
  }

  /**
   * Prüft ob ein Eintrag vollständig ist
   */
  isEntryComplete(entry) {
    const hasEmotions = Object.values(entry.emotions).some((v) => v > 0)
    const hasMood = entry.mood !== null
    return hasEmotions && hasMood
  }

  /**
   * Gibt Eintrag für bestimmtes Datum zurück
   */
  getEntryByDate(date) {
    return this.entries.find((e) => e.date === date)
  }

  /**
   * Gibt alle Einträge zurück
   */
  getAllEntries() {
    return [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  /**
   * Gibt Einträge für Zeitraum zurück
   */
  getEntriesInRange(startDate, endDate) {
    return this.entries.filter((e) => {
      const date = new Date(e.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
  }

  /**
   * Fügt einen verwendeten Skill hinzu
   */
  addSkillUsed(entryId, skillId, skillName, effectiveness = 3) {
    const entry = this.entries.find((e) => e.id === entryId)
    if (!entry) return null

    entry.skillsUsed.push({
      skillId,
      skillName,
      effectiveness,
      timestamp: new Date().toISOString(),
    })

    entry.updatedAt = new Date().toISOString()

    eventBus.emit('skill:used', {
      skillId,
      skillName,
      effectiveness,
      timestamp: new Date().toISOString(),
    })

    return entry
  }

  /**
   * Berechnet Statistiken für einen Zeitraum
   */
  calculateStats(days = 7) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)

    const entries = this.getEntriesInRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    )

    if (entries.length === 0) {
      return {
        entriesCount: 0,
        averageMood: null,
        emotionAverages: {},
        urgeAverages: {},
        skillsUsedCount: 0,
        mostUsedSkills: [],
        streak: this.calculateStreak(),
      }
    }

    // Durchschnittliche Stimmung
    const moodValues = entries.filter((e) => e.mood !== null).map((e) => e.mood)
    const averageMood =
      moodValues.length > 0 ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length : null

    // Durchschnittliche Emotionen
    const emotionAverages = {}
    EMOTIONS.forEach((emotion) => {
      const values = entries.map((e) => e.emotions[emotion.id] || 0)
      emotionAverages[emotion.id] = values.reduce((a, b) => a + b, 0) / values.length
    })

    // Durchschnittliche Dränge
    const urgeAverages = {}
    URGES.forEach((urge) => {
      const values = entries.map((e) => e.urges[urge.id] || 0)
      urgeAverages[urge.id] = values.reduce((a, b) => a + b, 0) / values.length
    })

    // Skill-Nutzung
    const allSkills = entries.flatMap((e) => e.skillsUsed || [])
    const skillCounts = {}
    allSkills.forEach((s) => {
      skillCounts[s.skillId] = (skillCounts[s.skillId] || 0) + 1
    })

    const mostUsedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skillId, count]) => {
        const skill = allSkills.find((s) => s.skillId === skillId)
        return { skillId, skillName: skill?.skillName || skillId, count }
      })

    return {
      entriesCount: entries.length,
      averageMood,
      emotionAverages,
      urgeAverages,
      skillsUsedCount: allSkills.length,
      mostUsedSkills,
      streak: this.calculateStreak(),
      entries,
    }
  }

  /**
   * Berechnet die aktuelle Streak (aufeinanderfolgende Tage)
   */
  calculateStreak() {
    const sorted = [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date))

    if (sorted.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))

      if (diffDays === 0 || diffDays === 1) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  }

  /**
   * Gibt Trend für eine Emotion zurück
   */
  getEmotionTrend(emotionId, days = 7) {
    const stats = this.calculateStats(days)
    const entries = stats.entries || []

    return entries.map((e) => ({
      date: e.date,
      value: e.emotions[emotionId] || 0,
    }))
  }

  /**
   * Erkennt Warnzeichen
   */
  detectWarnings(entry) {
    const warnings = []

    // Hohe Drang-Intensitäten
    URGES.filter((u) => u.warning).forEach((urge) => {
      if ((entry.urges[urge.id] || 0) >= 4) {
        warnings.push({
          type: 'urge',
          severity: 'high',
          message: `Hohe Intensität bei "${urge.name}"`,
          urgeId: urge.id,
        })
      }
    })

    // Drängen nachgegeben
    URGES.filter((u) => u.warning).forEach((urge) => {
      if (entry.urgesActedOn[urge.id]) {
        warnings.push({
          type: 'acted',
          severity: 'medium',
          message: `Drang "${urge.name}" nachgegeben`,
          urgeId: urge.id,
        })
      }
    })

    // Sehr niedrige Stimmung
    if (entry.mood !== null && entry.mood <= 1) {
      warnings.push({
        type: 'mood',
        severity: 'high',
        message: 'Sehr niedrige Stimmung',
      })
    }

    // Schlafmangel
    if (entry.sleep.hours !== null && entry.sleep.hours < 4) {
      warnings.push({
        type: 'sleep',
        severity: 'medium',
        message: 'Wenig Schlaf',
      })
    }

    return warnings
  }

  /**
   * Gibt Empfehlungen basierend auf Eintrag
   */
  getRecommendations(entry) {
    const recommendations = []
    const warnings = this.detectWarnings(entry)

    if (warnings.some((w) => w.severity === 'high')) {
      recommendations.push({
        type: 'crisis',
        priority: 1,
        text: 'Bei akuter Krise: Telefonseelsorge 0800 111 0 111',
        action: 'call',
      })
    }

    // Hohe Emotionsintensität
    const maxEmotion = Math.max(...Object.values(entry.emotions))
    if (maxEmotion >= 4) {
      recommendations.push({
        type: 'skill',
        priority: 2,
        text: 'Probiere die TIPP-Skills für schnelle Regulation',
        skillId: 'tipp',
      })
    }

    // Keine Skills verwendet
    if (entry.skillsUsed.length === 0 && maxEmotion >= 2) {
      recommendations.push({
        type: 'skill',
        priority: 3,
        text: 'Versuche heute einen DBT-Skill anzuwenden',
        action: 'skills',
      })
    }

    return recommendations
  }

  /**
   * Löscht einen Eintrag
   */
  deleteEntry(entryId) {
    const index = this.entries.findIndex((e) => e.id === entryId)
    if (index >= 0) {
      this.entries.splice(index, 1)
      eventBus.emit('diary:entry-deleted', { entryId })
      return true
    }
    return false
  }
}

// Singleton-Instanz
export const diaryCardAgent = new DiaryCardAgent()
export default diaryCardAgent
