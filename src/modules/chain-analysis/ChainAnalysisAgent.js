/**
 * ChainAnalysisAgent
 * Verwaltet Verhaltenskettenanalysen nach DBT
 *
 * Eine Verhaltenskette besteht aus:
 * 1. Vulnerabilitätsfaktoren (was machte verletzlich)
 * 2. Auslösendes Ereignis (Trigger)
 * 3. Kettenglieder (Gedanken, Gefühle, Körperempfindungen, Verhalten)
 * 4. Problemverhalten
 * 5. Konsequenzen (kurz- und langfristig)
 * 6. Lösungsstrategien (wo Skills hätten helfen können)
 */

import eventBus from '../../core/eventBus'

// Vulnerability-Kategorien
export const vulnerabilityCategories = [
  {
    id: 'sleep',
    label: 'Schlafmangel',
    emoji: '😴',
    description: 'Weniger als 6 Stunden geschlafen',
  },
  {
    id: 'eating',
    label: 'Unregelmäßiges Essen',
    emoji: '🍽️',
    description: 'Mahlzeiten ausgelassen oder ungesund gegessen',
  },
  {
    id: 'illness',
    label: 'Körperlich unwohl',
    emoji: '🤒',
    description: 'Krank, Schmerzen, PMS, etc.',
  },
  {
    id: 'substances',
    label: 'Substanzen',
    emoji: '🍷',
    description: 'Alkohol, Koffein, Medikamente',
  },
  {
    id: 'stress',
    label: 'Anhaltender Stress',
    emoji: '😫',
    description: 'Stress von vorherigen Tagen',
  },
  {
    id: 'conflict',
    label: 'Zwischenmenschliche Konflikte',
    emoji: '😤',
    description: 'Streit, Spannung mit anderen',
  },
  { id: 'isolation', label: 'Isolation', emoji: '🏠', description: 'Wenig soziale Kontakte' },
  {
    id: 'overwhelm',
    label: 'Überforderung',
    emoji: '🌊',
    description: 'Zu viele Aufgaben/Termine',
  },
]

// Link-Typen für die Kette
export const linkTypes = [
  { id: 'thought', label: 'Gedanke', emoji: '💭', color: '#8B5CF6' },
  { id: 'emotion', label: 'Gefühl', emoji: '💗', color: '#EC4899' },
  { id: 'body', label: 'Körper', emoji: '🫀', color: '#EF4444' },
  { id: 'action', label: 'Verhalten', emoji: '🎬', color: '#F59E0B' },
]

// Problem-Verhaltensweisen (Zielverhalten)
export const problemBehaviors = [
  { id: 'self-harm', label: 'Selbstverletzung', emoji: '⚠️', critical: true },
  { id: 'substance-use', label: 'Substanzkonsum', emoji: '🍷', critical: false },
  { id: 'binge-eating', label: 'Essanfall', emoji: '🍔', critical: false },
  { id: 'restricting', label: 'Essen einschränken', emoji: '🚫', critical: false },
  { id: 'purging', label: 'Erbrechen', emoji: '🤢', critical: true },
  { id: 'isolation', label: 'Soziale Isolation', emoji: '🏠', critical: false },
  { id: 'aggression', label: 'Aggression', emoji: '💢', critical: false },
  { id: 'avoidance', label: 'Vermeidung', emoji: '🙈', critical: false },
  { id: 'dissociation', label: 'Dissoziation', emoji: '☁️', critical: false },
  { id: 'other', label: 'Anderes', emoji: '📝', critical: false },
]

class ChainAnalysisAgent {
  constructor() {
    this.storageKey = 'dbt-chain-analyses'
    this.analyses = this.loadAnalyses()
  }

  /**
   * Lädt gespeicherte Analysen
   */
  loadAnalyses() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Speichert alle Analysen
   */
  saveAnalyses() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.analyses))
  }

  /**
   * Erstellt eine neue Kettenanalyse
   */
  createAnalysis(data) {
    const analysis = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft', // draft, complete

      // 1. Vulnerabilitätsfaktoren
      vulnerabilities: data.vulnerabilities || [],
      vulnerabilityNotes: data.vulnerabilityNotes || '',

      // 2. Auslösendes Ereignis
      trigger: {
        what: data.trigger?.what || '',
        when: data.trigger?.when || '',
        where: data.trigger?.where || '',
        who: data.trigger?.who || '',
      },

      // 3. Kettenglieder
      chainLinks: data.chainLinks || [],

      // 4. Problemverhalten
      problemBehavior: {
        type: data.problemBehavior?.type || '',
        description: data.problemBehavior?.description || '',
        intensity: data.problemBehavior?.intensity || 0,
      },

      // 5. Konsequenzen
      consequences: {
        shortTerm: data.consequences?.shortTerm || '',
        longTerm: data.consequences?.longTerm || '',
        positive: data.consequences?.positive || '', // Was hat es kurzfristig gebracht?
        negative: data.consequences?.negative || '', // Was hat es langfristig gekostet?
      },

      // 6. Lösungen
      solutions: data.solutions || [],

      // Meta
      notes: data.notes || '',
    }

    this.analyses.unshift(analysis)
    this.saveAnalyses()

    eventBus.emit('chain:created', { id: analysis.id, analysis })

    return analysis
  }

  /**
   * Aktualisiert eine Analyse
   */
  updateAnalysis(id, data) {
    const index = this.analyses.findIndex((a) => a.id === id)
    if (index === -1) return null

    this.analyses[index] = {
      ...this.analyses[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.saveAnalyses()
    eventBus.emit('chain:updated', { id, analysis: this.analyses[index] })

    return this.analyses[index]
  }

  /**
   * Markiert Analyse als abgeschlossen
   */
  completeAnalysis(id) {
    return this.updateAnalysis(id, { status: 'complete' })
  }

  /**
   * Holt eine Analyse
   */
  getAnalysis(id) {
    return this.analyses.find((a) => a.id === id) || null
  }

  /**
   * Holt alle Analysen
   */
  getAllAnalyses() {
    return this.analyses
  }

  /**
   * Holt Analysen nach Status
   */
  getAnalysesByStatus(status) {
    return this.analyses.filter((a) => a.status === status)
  }

  /**
   * Löscht eine Analyse
   */
  deleteAnalysis(id) {
    this.analyses = this.analyses.filter((a) => a.id !== id)
    this.saveAnalyses()
    eventBus.emit('chain:deleted', { id })
  }

  /**
   * Fügt ein Kettenglied hinzu
   */
  addChainLink(analysisId, link) {
    const analysis = this.getAnalysis(analysisId)
    if (!analysis) return null

    const newLink = {
      id: Date.now().toString(),
      type: link.type,
      content: link.content,
      intensity: link.intensity || 0,
      skillOpportunity: link.skillOpportunity || null,
    }

    const chainLinks = [...analysis.chainLinks, newLink]
    return this.updateAnalysis(analysisId, { chainLinks })
  }

  /**
   * Fügt eine Lösung hinzu
   */
  addSolution(analysisId, solution) {
    const analysis = this.getAnalysis(analysisId)
    if (!analysis) return null

    const newSolution = {
      id: Date.now().toString(),
      linkId: solution.linkId, // An welches Kettenglied gekoppelt
      skillId: solution.skillId,
      skillName: solution.skillName,
      description: solution.description || '',
    }

    const solutions = [...analysis.solutions, newSolution]
    return this.updateAnalysis(analysisId, { solutions })
  }

  /**
   * Berechnet Statistiken
   */
  getStats() {
    if (this.analyses.length === 0) {
      return {
        total: 0,
        complete: 0,
        draft: 0,
        commonVulnerabilities: [],
        commonBehaviors: [],
        mostUsedSkills: [],
      }
    }

    // Häufigste Vulnerabilitäten
    const vulnCounts = {}
    this.analyses.forEach((a) => {
      ;(a.vulnerabilities || []).forEach((v) => {
        vulnCounts[v] = (vulnCounts[v] || 0) + 1
      })
    })

    const commonVulnerabilities = Object.entries(vulnCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        ...vulnerabilityCategories.find((v) => v.id === id),
        count,
      }))

    // Häufigste Problemverhaltensweisen
    const behaviorCounts = {}
    this.analyses.forEach((a) => {
      if (a.problemBehavior?.type) {
        behaviorCounts[a.problemBehavior.type] = (behaviorCounts[a.problemBehavior.type] || 0) + 1
      }
    })

    const commonBehaviors = Object.entries(behaviorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        ...problemBehaviors.find((b) => b.id === id),
        count,
      }))

    // Häufigste Skills in Lösungen
    const skillCounts = {}
    this.analyses.forEach((a) => {
      ;(a.solutions || []).forEach((s) => {
        if (s.skillId) {
          skillCounts[s.skillId] = (skillCounts[s.skillId] || 0) + 1
        }
      })
    })

    const mostUsedSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([skillId, count]) => ({ skillId, count }))

    return {
      total: this.analyses.length,
      complete: this.analyses.filter((a) => a.status === 'complete').length,
      draft: this.analyses.filter((a) => a.status === 'draft').length,
      commonVulnerabilities,
      commonBehaviors,
      mostUsedSkills,
    }
  }

  /**
   * Exportiert alle Analysen
   */
  exportData() {
    return {
      exportDate: new Date().toISOString(),
      analyses: this.analyses,
      stats: this.getStats(),
    }
  }
}

export const chainAnalysis = new ChainAnalysisAgent()
export default chainAnalysis
