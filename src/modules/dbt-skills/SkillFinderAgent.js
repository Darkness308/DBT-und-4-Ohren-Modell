/**
 * SkillFinderAgent
 * Empfiehlt passende DBT-Skills basierend auf der Situation
 */

import { dbtSkills, dbtModules, situationTypes, intensityLevels } from './dbtSkills'
import eventBus from '../../core/eventBus'

class SkillFinderAgent {
  constructor() {
    this.skills = dbtSkills
    this.modules = dbtModules
    this.situationTypes = situationTypes
    this.intensityLevels = intensityLevels
    this.searchHistory = []
  }

  /**
   * Findet passende Skills basierend auf Situation und Intensität
   * @param {Object} input - { situationType, intensity, keywords?, module? }
   * @returns {Object} - { recommendations, allMatches, tips }
   */
  findSkills(input) {
    const { situationType, intensity = 2, keywords = '', module = null } = input

    if (!situationType) {
      return {
        error: 'Bitte wähle eine Situation aus.',
        success: false,
      }
    }

    // Situation finden
    const situation = this.situationTypes.find((s) => s.id === situationType)
    if (!situation) {
      return {
        error: 'Unbekannte Situation.',
        success: false,
      }
    }

    // Prioritäts-Skills für diese Situation
    const prioritySkillIds = situation.priority || []
    const prioritySkills = prioritySkillIds
      .map((id) => this.skills.find((s) => s.id === id))
      .filter(Boolean)

    // Zusätzliche Skills basierend auf Intensität und Keywords
    let additionalSkills = this.skills.filter((skill) => {
      // Nicht bereits in Priority
      if (prioritySkillIds.includes(skill.id)) return false

      // Modul-Filter
      if (module && skill.module !== module) return false

      // Keyword-Suche
      if (keywords) {
        const searchLower = keywords.toLowerCase()
        const matchesKeyword =
          skill.name.toLowerCase().includes(searchLower) ||
          skill.shortDescription.toLowerCase().includes(searchLower) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        if (!matchesKeyword) return false
      }

      return true
    })

    // Bei hoher Intensität: Akute Skills priorisieren
    if (intensity >= 3) {
      additionalSkills = additionalSkills.sort((a, b) => {
        return (b.effectiveness.acute || 0) - (a.effectiveness.acute || 0)
      })
    }

    // Kombinierte Empfehlungen
    const recommendations = [
      ...prioritySkills.map((skill) => ({
        ...skill,
        matchReason: 'Empfohlen für diese Situation',
        priority: 1,
      })),
      ...additionalSkills.slice(0, 3).map((skill) => ({
        ...skill,
        matchReason: 'Könnte auch helfen',
        priority: 2,
      })),
    ]

    // Tipps basierend auf Intensität
    const tips = this.getTipsForIntensity(intensity, situationType)

    // Event auslösen
    eventBus.emit('skill:searched', {
      situationType,
      intensity,
      resultsCount: recommendations.length,
      timestamp: new Date().toISOString(),
    })

    // In History speichern
    this.searchHistory.push({
      input,
      resultsCount: recommendations.length,
      timestamp: new Date().toISOString(),
    })

    return {
      situation,
      intensity: this.intensityLevels.find((l) => l.value === intensity),
      recommendations,
      tips,
      success: true,
    }
  }

  /**
   * Gibt Tipps basierend auf Intensität
   */
  getTipsForIntensity(intensity, situationType) {
    const tips = []

    if (intensity >= 4) {
      tips.push({
        type: 'warning',
        icon: '⚠️',
        text: 'Bei sehr hoher Intensität: Zuerst körperlich regulieren (TIPP-Skills), dann weiterdenken.',
      })
      tips.push({
        type: 'crisis',
        icon: '📞',
        text: 'Bei akuter Krise: Telefonseelsorge 0800 111 0 111 (kostenlos, 24/7)',
      })
    }

    if (intensity >= 3) {
      tips.push({
        type: 'info',
        icon: '💡',
        text: 'Starte mit einem einfachen Skill. Perfektion ist nicht das Ziel - Anfangen zählt!',
      })
    }

    if (situationType === 'conflict' || situationType === 'boundary') {
      tips.push({
        type: 'info',
        icon: '🤝',
        text: 'Bei Konflikten: Erst selbst regulieren, dann kommunizieren.',
      })
    }

    if (situationType === 'rumination') {
      tips.push({
        type: 'info',
        icon: '🧠',
        text: 'Grübeln ist kein Problemlösen. Setze dir ein Zeitlimit von 10 Minuten.',
      })
    }

    return tips
  }

  /**
   * Gibt einen einzelnen Skill zurück
   * @param {string} skillId - ID des Skills
   * @returns {Object|null} - Skill oder null
   */
  getSkillById(skillId) {
    const skill = this.skills.find((s) => s.id === skillId)
    if (!skill) return null

    return {
      ...skill,
      module: this.modules[skill.module],
    }
  }

  /**
   * Gibt alle Skills eines Moduls zurück
   * @param {string} moduleId - ID des Moduls
   * @returns {Array} - Skills des Moduls
   */
  getSkillsByModule(moduleId) {
    return this.skills.filter((s) => s.module === moduleId)
  }

  /**
   * Gibt alle Module zurück
   * @returns {Array} - Alle Module
   */
  getAllModules() {
    return Object.values(this.modules)
  }

  /**
   * Gibt alle Situations-Typen zurück
   * @returns {Array} - Alle Situations-Typen
   */
  getAllSituationTypes() {
    return this.situationTypes
  }

  /**
   * Sucht Skills nach Keyword
   * @param {string} query - Suchbegriff
   * @returns {Array} - Gefundene Skills
   */
  searchSkills(query) {
    if (!query || query.trim().length < 2) return []

    const searchLower = query.toLowerCase().trim()

    return this.skills
      .filter((skill) => {
        return (
          skill.name.toLowerCase().includes(searchLower) ||
          skill.shortDescription.toLowerCase().includes(searchLower) ||
          skill.fullDescription.toLowerCase().includes(searchLower) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          (skill.acronym &&
            Object.values(skill.acronym).some((v) => v.toLowerCase().includes(searchLower)))
        )
      })
      .map((skill) => ({
        ...skill,
        module: this.modules[skill.module],
      }))
  }

  /**
   * Markiert einen Skill als verwendet
   * @param {string} skillId - ID des Skills
   * @param {number} effectiveness - Wie effektiv war der Skill (1-5)
   */
  markSkillUsed(skillId, effectiveness = 3) {
    const skill = this.getSkillById(skillId)
    if (!skill) return

    eventBus.emit('skill:used', {
      skillId,
      skillName: skill.name,
      module: skill.module.id,
      effectiveness,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Gibt die Suchhistorie zurück
   */
  getSearchHistory() {
    return this.searchHistory
  }
}

// Singleton-Instanz exportieren
export const skillFinder = new SkillFinderAgent()
export default skillFinder
