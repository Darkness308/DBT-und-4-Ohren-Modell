import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import VulnerabilityStep from './steps/VulnerabilityStep'
import TriggerStep from './steps/TriggerStep'
import ChainLinksStep from './steps/ChainLinksStep'
import ProblemBehaviorStep from './steps/ProblemBehaviorStep'
import ConsequencesStep from './steps/ConsequencesStep'
import SolutionsStep from './steps/SolutionsStep'
import AnalysisList from './AnalysisList'
import { chainAnalysis } from './ChainAnalysisAgent'

/**
 * ChainAnalysis - Verhaltenskettenanalyse nach DBT
 *
 * 6 Schritte:
 * 1. Vulnerabilitätsfaktoren
 * 2. Auslösendes Ereignis (Trigger)
 * 3. Kettenglieder
 * 4. Problemverhalten
 * 5. Konsequenzen
 * 6. Lösungen/Skills
 */
export default function ChainAnalysis() {
  const { isDark } = useTheme()
  const [view, setView] = useState('list') // list, new, edit
  const [currentStep, setCurrentStep] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [analysis, setAnalysis] = useState({
    vulnerabilities: [],
    vulnerabilityNotes: '',
    trigger: { what: '', when: '', where: '', who: '' },
    chainLinks: [],
    problemBehavior: { type: '', description: '', intensity: 0 },
    consequences: { shortTerm: '', longTerm: '', positive: '', negative: '' },
    solutions: [],
    notes: '',
  })

  const steps = [
    {
      id: 'vulnerability',
      label: 'Vulnerabilität',
      emoji: '🛡️',
      description: 'Was machte dich verletzlich?',
    },
    { id: 'trigger', label: 'Auslöser', emoji: '⚡', description: 'Was war der Trigger?' },
    { id: 'chain', label: 'Kette', emoji: '🔗', description: 'Was passierte dann?' },
    { id: 'behavior', label: 'Verhalten', emoji: '🎯', description: 'Das Problemverhalten' },
    {
      id: 'consequences',
      label: 'Folgen',
      emoji: '📊',
      description: 'Was waren die Konsequenzen?',
    },
    {
      id: 'solutions',
      label: 'Lösungen',
      emoji: '💡',
      description: 'Welche Skills hätten geholfen?',
    },
  ]

  // Reset bei neuer Analyse
  const startNewAnalysis = () => {
    setAnalysis({
      vulnerabilities: [],
      vulnerabilityNotes: '',
      trigger: { what: '', when: '', where: '', who: '' },
      chainLinks: [],
      problemBehavior: { type: '', description: '', intensity: 0 },
      consequences: { shortTerm: '', longTerm: '', positive: '', negative: '' },
      solutions: [],
      notes: '',
    })
    setCurrentStep(0)
    setEditingId(null)
    setView('new')
  }

  // Bestehende Analyse bearbeiten
  const editAnalysis = (id) => {
    const existing = chainAnalysis.getAnalysis(id)
    if (existing) {
      setAnalysis(existing)
      setEditingId(id)
      setCurrentStep(0)
      setView('edit')
    }
  }

  // Analyse speichern
  const saveAnalysis = () => {
    if (editingId) {
      chainAnalysis.updateAnalysis(editingId, analysis)
    } else {
      chainAnalysis.createAnalysis(analysis)
    }
    setView('list')
  }

  // Als abgeschlossen markieren
  const completeAndSave = () => {
    if (editingId) {
      chainAnalysis.updateAnalysis(editingId, { ...analysis, status: 'complete' })
    } else {
      const created = chainAnalysis.createAnalysis(analysis)
      chainAnalysis.completeAnalysis(created.id)
    }
    setView('list')
  }

  // Navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Update-Handler
  const updateAnalysis = (field, value) => {
    setAnalysis((prev) => ({ ...prev, [field]: value }))
  }

  // Liste anzeigen
  if (view === 'list') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-xl font-semibold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
              >
                Verhaltenskettenanalyse
              </h2>
              <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                Verstehe dein Verhalten Schritt für Schritt
              </p>
            </div>
            <Button onClick={startNewAnalysis} variant="primary">
              + Neue Analyse
            </Button>
          </div>
        </Card>

        <AnalysisList onEdit={editAnalysis} onNew={startNewAnalysis} />
      </div>
    )
  }

  // Wizard anzeigen
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-semibold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
            >
              {editingId ? 'Analyse bearbeiten' : 'Neue Kettenanalyse'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {steps[currentStep].description}
            </p>
          </div>
          <Button onClick={() => setView('list')} variant="outline" size="sm">
            Zurück zur Liste
          </Button>
        </div>
      </Card>

      {/* Progress Steps */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(idx)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap
              transition-all duration-200
              ${
                currentStep === idx
                  ? 'bg-calm-500 text-white shadow-md'
                  : idx < currentStep
                    ? isDark
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-100 text-green-700'
                    : isDark
                      ? 'bg-gray-800 text-gray-400'
                      : 'bg-gray-100 text-gray-500'
              }
            `}
          >
            <span>{step.emoji}</span>
            <span className="hidden sm:inline">{step.label}</span>
            {idx < currentStep && <span>✓</span>}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        {currentStep === 0 && (
          <VulnerabilityStep
            vulnerabilities={analysis.vulnerabilities}
            notes={analysis.vulnerabilityNotes}
            onChange={(vulns, notes) => {
              updateAnalysis('vulnerabilities', vulns)
              updateAnalysis('vulnerabilityNotes', notes)
            }}
          />
        )}
        {currentStep === 1 && (
          <TriggerStep
            trigger={analysis.trigger}
            onChange={(trigger) => updateAnalysis('trigger', trigger)}
          />
        )}
        {currentStep === 2 && (
          <ChainLinksStep
            chainLinks={analysis.chainLinks}
            onChange={(links) => updateAnalysis('chainLinks', links)}
          />
        )}
        {currentStep === 3 && (
          <ProblemBehaviorStep
            behavior={analysis.problemBehavior}
            onChange={(behavior) => updateAnalysis('problemBehavior', behavior)}
          />
        )}
        {currentStep === 4 && (
          <ConsequencesStep
            consequences={analysis.consequences}
            onChange={(consequences) => updateAnalysis('consequences', consequences)}
          />
        )}
        {currentStep === 5 && (
          <SolutionsStep
            chainLinks={analysis.chainLinks}
            solutions={analysis.solutions}
            onChange={(solutions) => updateAnalysis('solutions', solutions)}
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button onClick={prevStep} variant="outline" disabled={currentStep === 0}>
          ← Zurück
        </Button>

        <div className="flex gap-2">
          <Button onClick={saveAnalysis} variant="outline">
            Entwurf speichern
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={completeAndSave} variant="primary">
              Abschließen ✓
            </Button>
          ) : (
            <Button onClick={nextStep} variant="primary">
              Weiter →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
