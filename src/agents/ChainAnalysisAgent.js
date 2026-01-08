/**
 * ChainAnalysisAgent
 * Interaktive Verhaltenskettenanalyse nach DBT
 *
 * Ketten-Struktur:
 * Vulnerabilität → Auslöser → [Gedanke → Gefühl → Körper → Impuls]* → Verhalten → Konsequenzen
 */

import { eventBus } from '../utils/eventBus'

// Typen von Vulnerabilitäten
export const VULNERABILITY_TYPES = [
  {
    id: 'sleep',
    name: 'Schlafmangel',
    emoji: '😴',
    examples: ['Wenig geschlafen', 'Schlecht geschlafen'],
  },
  {
    id: 'food',
    name: 'Ernährung',
    emoji: '🍽️',
    examples: ['Nichts gegessen', 'Unregelmäßig gegessen'],
  },
  {
    id: 'illness',
    name: 'Krankheit',
    emoji: '🤒',
    examples: ['Erkältet', 'Kopfschmerzen', 'Erschöpft'],
  },
  {
    id: 'stress',
    name: 'Stress',
    emoji: '😫',
    examples: ['Arbeitsstress', 'Prüfungsstress', 'Zeitdruck'],
  },
  {
    id: 'conflict',
    name: 'Vorheriger Konflikt',
    emoji: '💢',
    examples: ['Streit am Morgen', 'Ungelöste Spannung'],
  },
  { id: 'loneliness', name: 'Einsamkeit', emoji: '😔', examples: ['Allein zu Hause', 'Isolation'] },
  {
    id: 'medication',
    name: 'Medikamente',
    emoji: '💊',
    examples: ['Medikamente vergessen', 'Nebenwirkungen'],
  },
  { id: 'substances', name: 'Substanzen', emoji: '🍷', examples: ['Alkohol getrunken', 'Koffein'] },
]

// Typen von Kettengliedern
export const LINK_TYPES = [
  {
    id: 'thought',
    name: 'Gedanke',
    emoji: '💭',
    color: '#3b82f6',
    prompt: 'Was ging dir durch den Kopf?',
  },
  {
    id: 'emotion',
    name: 'Gefühl',
    emoji: '💚',
    color: '#22c55e',
    prompt: 'Welches Gefühl kam auf?',
  },
  {
    id: 'body',
    name: 'Körperempfindung',
    emoji: '🫀',
    color: '#f59e0b',
    prompt: 'Was hast du körperlich gespürt?',
  },
  {
    id: 'urge',
    name: 'Impuls/Drang',
    emoji: '⚡',
    color: '#ef4444',
    prompt: 'Welchen Drang hattest du?',
  },
  {
    id: 'behavior',
    name: 'Verhalten',
    emoji: '🎬',
    color: '#8b5cf6',
    prompt: 'Was hast du getan?',
  },
]

// Beispiel-Skills für Interventionspunkte
export const INTERVENTION_SKILLS = {
  thought: ['check-the-facts', 'wise-mind', 'radical-acceptance'],
  emotion: ['opposite-action', 'emotion-regulation', 'self-soothe'],
  body: ['tipp', 'progressive-relaxation', 'grounding'],
  urge: ['urge-surfing', 'distract-accepts', 'pros-cons'],
  behavior: ['stop', 'dear-man', 'give'],
}

class ChainAnalysisAgent {
  constructor() {
    this.chains = []
    this.vulnerabilityTypes = VULNERABILITY_TYPES
    this.linkTypes = LINK_TYPES
  }

  /**
   * Lädt gespeicherte Ketten
   */
  loadChains(savedChains = []) {
    this.chains = savedChains
  }

  /**
   * Erstellt eine neue Chain-Analyse
   */
  createChain() {
    const chain = {
      id: `chain-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Zielverhalten (das problematische Verhalten)
      targetBehavior: {
        description: '',
        severity: 3, // 1-5
        date: new Date().toISOString().split('T')[0],
        time: '',
      },

      // Vulnerabilitäten (PLEASE-Skills beachten)
      vulnerabilities: [],

      // Auslösendes Ereignis
      promptingEvent: {
        description: '',
        timestamp: '',
        location: '',
      },

      // Die eigentliche Kette
      links: [],

      // Konsequenzen
      consequences: {
        immediate: [],
        shortTerm: [],
        longTerm: [],
      },

      // Interventionspunkte
      interventionPoints: [],

      // Lösungsanalyse
      solutionAnalysis: {
        whatCouldPrevent: '',
        skillsToTry: [],
        repairActions: [],
      },

      // Status
      status: 'in_progress', // 'in_progress', 'completed', 'reviewed'
      step: 0, // Aktueller Schritt im Prozess
    }

    return chain
  }

  /**
   * Speichert eine Chain
   */
  saveChain(chain) {
    const index = this.chains.findIndex((c) => c.id === chain.id)
    const updatedChain = {
      ...chain,
      updatedAt: new Date().toISOString(),
    }

    if (index >= 0) {
      this.chains[index] = updatedChain
    } else {
      this.chains.push(updatedChain)
    }

    eventBus.emit('chain:saved', {
      chainId: updatedChain.id,
      status: updatedChain.status,
    })

    return updatedChain
  }

  /**
   * Fügt eine Vulnerabilität hinzu
   */
  addVulnerability(chainId, vulnerability) {
    const chain = this.chains.find((c) => c.id === chainId)
    if (!chain) return null

    chain.vulnerabilities.push({
      id: `vuln-${Date.now()}`,
      type: vulnerability.type,
      description: vulnerability.description,
      severity: vulnerability.severity || 3,
    })

    chain.updatedAt = new Date().toISOString()
    return chain
  }

  /**
   * Fügt ein Kettenglied hinzu
   */
  addLink(chainId, link) {
    const chain = this.chains.find((c) => c.id === chainId)
    if (!chain) return null

    const newLink = {
      id: `link-${Date.now()}`,
      type: link.type,
      content: link.content,
      intensity: link.intensity || 3, // 1-5
      timestamp: new Date().toISOString(),
      order: chain.links.length,
    }

    chain.links.push(newLink)
    chain.updatedAt = new Date().toISOString()

    return { chain, newLink }
  }

  /**
   * Entfernt ein Kettenglied
   */
  removeLink(chainId, linkId) {
    const chain = this.chains.find((c) => c.id === chainId)
    if (!chain) return null

    chain.links = chain.links.filter((l) => l.id !== linkId)
    // Order neu berechnen
    chain.links.forEach((l, i) => (l.order = i))
    chain.updatedAt = new Date().toISOString()

    return chain
  }

  /**
   * Schlägt Interventionspunkte vor
   */
  suggestInterventions(chain) {
    const interventions = []

    chain.links.forEach((link, index) => {
      // Hohe Intensität = guter Interventionspunkt
      if (link.intensity >= 3) {
        const skillIds = INTERVENTION_SKILLS[link.type] || []

        interventions.push({
          linkIndex: index,
          linkId: link.id,
          linkType: link.type,
          linkContent: link.content,
          intensity: link.intensity,
          suggestedSkills: skillIds,
          alternative: this.suggestAlternative(link),
        })
      }
    })

    // Nach Intensität sortieren
    return interventions.sort((a, b) => b.intensity - a.intensity)
  }

          /**
           * Schlägt eine alternative, skills-orientierte Reaktionsmöglichkeit für ein Kettenglied vor.
           *
           * @param {Object} link - Das aktuelle Kettenglied, für das eine Alternative gesucht wird.
           * @param {string} link.type - Der Typ des Kettenglieds (z.B. 'thought', 'emotion', 'body', 'urge', 'behavior').
           * @returns {string|undefined} Eine zufällig ausgewählte Alternativ-Idee oder `undefined`, falls keine Option vorhanden ist.
           */
          suggestAlternative(link) {
            const alternatives = {
              thought: [
                'Welche Fakten sprechen dagegen?',
                'Was würde ich einem Freund sagen?',
                'Ist das ein Gefühl oder ein Fakt?',
              ],
              emotion: [
                'Gegenteiliges Handeln (Opposite Action)',
                'Die Emotion benennen und akzeptieren',
                'Körperliche Regulation (TIPP)',
              ],
              body: [
                'Tiefes Atmen (4-7-8 Technik)',
                'Progressive Muskelentspannung',
                'Kaltes Wasser im Gesicht',
              ],
              urge: [
                'Den Drang beobachten ohne zu handeln',
                'Pro-Contra-Liste erstellen',
                'Zeitverschiebung: 10 Minuten warten',
              ],
              behavior: ['STOP-Skill anwenden', 'Wise Mind konsultieren', 'Hilfe holen'],
            }

            const options = alternatives[link.type] || []
            return options[Math.floor(Math.random() * options.length)]
          }

  /**
   * Markiert eine Chain als abgeschlossen
   */
  completeChain(chainId) {
    const chain = this.chains.find((c) => c.id === chainId)
    if (!chain) return null

    chain.status = 'completed'
    chain.completedAt = new Date().toISOString()
    chain.updatedAt = new Date().toISOString()
    chain.interventionPoints = this.suggestInterventions(chain)

    eventBus.emit('chain:completed', { chainId })

    return chain
  }

  /**
   * Gibt eine Chain zurück
   */
  getChain(chainId) {
    return this.chains.find((c) => c.id === chainId)
  }

  /**
   * Gibt alle Chains zurück
   */
  getAllChains() {
    return [...this.chains].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  /**
   * Findet Muster über mehrere Chains
   */
  findPatterns() {
    if (this.chains.length < 3) {
      return { hasEnoughData: false, patterns: [] }
    }

    const patterns = []

    // Häufige Vulnerabilitäten
    const vulnCounts = {}
    this.chains.forEach((chain) => {
      chain.vulnerabilities.forEach((v) => {
        vulnCounts[v.type] = (vulnCounts[v.type] || 0) + 1
      })
    })

    const topVulnerabilities = Object.entries(vulnCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    if (topVulnerabilities.length > 0) {
      patterns.push({
        type: 'vulnerability',
        title: 'Häufige Vulnerabilitäten',
        description: `Diese Faktoren tauchen oft vor problematischem Verhalten auf`,
        items: topVulnerabilities.map(([type, count]) => ({
          type,
          name: VULNERABILITY_TYPES.find((v) => v.id === type)?.name || type,
          count,
          percentage: Math.round((count / this.chains.length) * 100),
        })),
      })
    }

    // Häufige Gedankenmuster
    const thoughtPatterns = this.chains
      .flatMap((c) => c.links.filter((l) => l.type === 'thought'))
      .map((l) => l.content.toLowerCase())

    // Einfache Wort-Frequenz-Analyse
    const wordCounts = {}
    const triggerWords = [
      'niemand',
      'immer',
      'nie',
      'muss',
      'sollte',
      'kann nicht',
      'wertlos',
      'schuld',
    ]

    thoughtPatterns.forEach((thought) => {
      triggerWords.forEach((word) => {
        if (thought.includes(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1
        }
      })
    })

    const topWords = Object.entries(wordCounts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])

    if (topWords.length > 0) {
      patterns.push({
        type: 'thought',
        title: 'Wiederkehrende Denkmuster',
        description: 'Diese Wörter tauchen häufig in deinen Gedanken auf',
        items: topWords.map(([word, count]) => ({ word, count })),
      })
    }

    // Effektive Interventionen
    const skillCounts = {}
    this.chains
      .filter((c) => c.status === 'completed')
      .forEach((chain) => {
        chain.interventionPoints.forEach((ip) => {
          ip.suggestedSkills.forEach((skillId) => {
            skillCounts[skillId] = (skillCounts[skillId] || 0) + 1
          })
        })
      })

    return {
      hasEnoughData: true,
      patterns,
      chainCount: this.chains.length,
      completedCount: this.chains.filter((c) => c.status === 'completed').length,
    }
  }

  /**
   * Löscht eine Chain
   */
  deleteChain(chainId) {
    const index = this.chains.findIndex((c) => c.id === chainId)
    if (index >= 0) {
      this.chains.splice(index, 1)
      eventBus.emit('chain:deleted', { chainId })
      return true
    }
    return false
  }

  /**
   * Exportiert eine Chain als Text
   */
  exportChainAsText(chainId) {
    const chain = this.getChain(chainId)
    if (!chain) return null

    let text = `VERHALTENSKETTENANALYSE\n`
    text += `Datum: ${chain.targetBehavior.date}\n`
    text += `${'='.repeat(40)}\n\n`

    text += `ZIELVERHALTEN:\n${chain.targetBehavior.description}\n\n`

    if (chain.vulnerabilities.length > 0) {
      text += `VULNERABILITÄTEN:\n`
      chain.vulnerabilities.forEach((v) => {
        text += `• ${v.description}\n`
      })
      text += '\n'
    }

    text += `AUSLÖSENDES EREIGNIS:\n${chain.promptingEvent.description}\n\n`

    if (chain.links.length > 0) {
      text += `KETTE:\n`
      chain.links.forEach((link, i) => {
        const type = LINK_TYPES.find((t) => t.id === link.type)
        text += `${i + 1}. ${type?.emoji || ''} ${type?.name || link.type}: ${link.content} (Intensität: ${link.intensity}/5)\n`
      })
      text += '\n'
    }

    if (chain.consequences.immediate.length > 0) {
      text += `KONSEQUENZEN:\n`
      text += `Unmittelbar: ${chain.consequences.immediate.join(', ')}\n`
      if (chain.consequences.shortTerm.length > 0) {
        text += `Kurzfristig: ${chain.consequences.shortTerm.join(', ')}\n`
      }
      text += '\n'
    }

    if (chain.interventionPoints.length > 0) {
      text += `INTERVENTIONSPUNKTE:\n`
      chain.interventionPoints.slice(0, 3).forEach((ip) => {
        text += `• Bei "${ip.linkContent}": ${ip.alternative}\n`
      })
    }

    return text
  }
}

// Singleton-Instanz
export const chainAnalysisAgent = new ChainAnalysisAgent()
export default chainAnalysisAgent
