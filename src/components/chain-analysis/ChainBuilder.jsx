/**
 * ChainBuilder - Schritt-für-Schritt Chain-Analyse erstellen
 */

import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import {
  VULNERABILITY_TYPES,
  LINK_TYPES,
  INTERVENTION_SKILLS,
} from '../../agents/ChainAnalysisAgent'

const STEPS = [
  { id: 'target', title: 'Zielverhalten', icon: '🎯' },
  { id: 'vulnerabilities', title: 'Vulnerabilitäten', icon: '⚠️' },
  { id: 'trigger', title: 'Auslöser', icon: '💥' },
  { id: 'chain', title: 'Kette bauen', icon: '🔗' },
  { id: 'consequences', title: 'Konsequenzen', icon: '📊' },
  { id: 'solutions', title: 'Lösungen', icon: '💡' },
]

export default function ChainBuilder({ chain, onSave, onComplete, onBack }) {
  const { isDark } = useTheme()
  const [currentStep, setCurrentStep] = useState(chain.step || 0)
  const [localChain, setLocalChain] = useState(chain)

  const updateChain = (updates) => {
    const updated = { ...localChain, ...updates, step: currentStep }
    setLocalChain(updated)
    onSave(updated)
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      updateChain({ step: currentStep + 1 })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'target':
        return (
          <TargetBehaviorStep
            data={localChain.targetBehavior}
            onChange={(data) => updateChain({ targetBehavior: data })}
            isDark={isDark}
          />
        )
      case 'vulnerabilities':
        return (
          <VulnerabilitiesStep
            data={localChain.vulnerabilities}
            onChange={(data) => updateChain({ vulnerabilities: data })}
            isDark={isDark}
          />
        )
      case 'trigger':
        return (
          <TriggerStep
            data={localChain.promptingEvent}
            onChange={(data) => updateChain({ promptingEvent: data })}
            isDark={isDark}
          />
        )
      case 'chain':
        return (
          <ChainLinksStep
            data={localChain.links}
            onChange={(data) => updateChain({ links: data })}
            isDark={isDark}
          />
        )
      case 'consequences':
        return (
          <ConsequencesStep
            data={localChain.consequences}
            onChange={(data) => updateChain({ consequences: data })}
            isDark={isDark}
          />
        )
      case 'solutions':
        return (
          <SolutionsStep
            chain={localChain}
            onChange={(data) => updateChain({ solutionAnalysis: data })}
            isDark={isDark}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg ${isDark ? 'hover:bg-dark-hover' : 'hover:bg-gray-100'}`}
        >
          ← Zurück
        </button>
        <h2
          className={`text-lg font-semibold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
        >
          Verhaltenskettenanalyse
        </h2>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(index)}
            className={`
              flex-1 h-2 rounded-full transition-all
              ${
                index <= currentStep ? 'bg-lavender-500' : isDark ? 'bg-dark-border' : 'bg-gray-200'
              }
            `}
          />
        ))}
      </div>

      {/* Step Title */}
      <div
        className={`p-4 rounded-xl ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{STEPS[currentStep].icon}</span>
          <div>
            <p className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              Schritt {currentStep + 1} von {STEPS.length}
            </p>
            <h3 className={`font-semibold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
              {STEPS[currentStep].title}
            </h3>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div
        className={`p-4 rounded-xl ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            className={`flex-1 py-3 rounded-xl font-medium ${
              isDark
                ? 'bg-dark-elevated text-darkText-primary hover:bg-dark-hover'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Zurück
          </button>
        )}

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            className={`flex-1 py-3 rounded-xl font-medium ${
              isDark
                ? 'bg-lavender-600 text-white hover:bg-lavender-500'
                : 'bg-lavender-500 text-white hover:bg-lavender-600'
            }`}
          >
            Weiter
          </button>
        ) : (
          <button
            onClick={() => onComplete(localChain)}
            className={`flex-1 py-3 rounded-xl font-medium ${
              isDark
                ? 'bg-success-600 text-white hover:bg-success-500'
                : 'bg-success-500 text-white hover:bg-success-600'
            }`}
          >
            Analyse abschließen
          </button>
        )}
      </div>
    </div>
  )
}

// Step Components
function TargetBehaviorStep({ data, onChange, isDark }) {
  return (
    <div className="space-y-4">
      <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
        Welches problematische Verhalten möchtest du analysieren?
      </p>

      <textarea
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        placeholder="z.B. Ich habe mich selbst verletzt / Ich habe geschrien / Ich habe zu viel getrunken..."
        rows={3}
        className={`w-full p-3 rounded-lg ${
          isDark
            ? 'bg-dark-elevated border-dark-border text-darkText-primary placeholder:text-darkText-muted'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
        } border focus:ring-2 focus:ring-lavender-500`}
      />

      <div>
        <label
          className={`text-sm mb-2 block ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
        >
          Wie schwerwiegend war es? (1-5)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => onChange({ ...data, severity: level })}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                data.severity === level
                  ? 'bg-lavender-500 text-white'
                  : isDark
                    ? 'bg-dark-elevated text-darkText-secondary hover:bg-dark-hover'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="target-date"
          className={`text-sm mb-2 block ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
        >
          Wann ist das Verhalten aufgetreten?
        </label>
        <input
          id="target-date"
          type="date"
          value={data.date}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
          className={`w-full p-3 rounded-lg ${
            isDark
              ? 'bg-dark-elevated border-dark-border text-darkText-primary'
              : 'bg-gray-50 border-gray-200 text-gray-900'
          } border focus:ring-2 focus:ring-lavender-500`}
        />
      </div>
    </div>
  )
}

function VulnerabilitiesStep({ data, onChange, isDark }) {
  const toggleVulnerability = (type) => {
    const exists = data.find((v) => v.type === type.id)
    if (exists) {
      onChange(data.filter((v) => v.type !== type.id))
    } else {
      onChange([...data, { id: `vuln-${Date.now()}`, type: type.id, description: '', severity: 3 }])
    }
  }

  const updateDescription = (typeId, description) => {
    onChange(data.map((v) => (v.type === typeId ? { ...v, description } : v)))
  }

  return (
    <div className="space-y-4">
      <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
        Welche Faktoren haben dich anfälliger gemacht? (PLEASE-Skills beachten)
      </p>

      <div className="grid grid-cols-2 gap-2">
        {VULNERABILITY_TYPES.map((type) => {
          const isSelected = data.some((v) => v.type === type.id)
          return (
            <button
              key={type.id}
              onClick={() => toggleVulnerability(type)}
              className={`p-3 rounded-lg text-left transition-all ${
                isSelected
                  ? isDark
                    ? 'bg-lavender-900/50 border-lavender-500 border'
                    : 'bg-lavender-100 border-lavender-500 border'
                  : isDark
                    ? 'bg-dark-elevated hover:bg-dark-hover'
                    : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{type.emoji}</span>
              <span
                className={`ml-2 text-sm font-medium ${
                  isDark ? 'text-darkText-primary' : 'text-gray-700'
                }`}
              >
                {type.name}
              </span>
            </button>
          )
        })}
      </div>

      {data.length > 0 && (
        <div className="space-y-2 pt-4">
          {data.map((vuln) => {
            const type = VULNERABILITY_TYPES.find((t) => t.id === vuln.type)
            return (
              <div key={vuln.id}>
                <label
                  className={`text-sm mb-1 block ${
                    isDark ? 'text-darkText-secondary' : 'text-gray-600'
                  }`}
                >
                  {type?.emoji} {type?.name} - Details:
                </label>
                <input
                  type="text"
                  value={vuln.description}
                  onChange={(e) => updateDescription(vuln.type, e.target.value)}
                  placeholder={type?.examples?.[0] || 'Beschreibung...'}
                  className={`w-full p-2 rounded-lg text-sm ${
                    isDark
                      ? 'bg-dark-elevated border-dark-border text-darkText-primary'
                      : 'bg-white border-gray-200 text-gray-900'
                  } border`}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TriggerStep({ data, onChange, isDark }) {
  return (
    <div className="space-y-4">
      <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
        Was war der direkte Auslöser? Was ist kurz vorher passiert?
      </p>

      <textarea
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        placeholder="z.B. Mein Partner hat mir abgesagt / Ich habe eine schlechte Note bekommen..."
        rows={4}
        className={`w-full p-3 rounded-lg ${
          isDark
            ? 'bg-dark-elevated border-dark-border text-darkText-primary placeholder:text-darkText-muted'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
        } border focus:ring-2 focus:ring-lavender-500`}
      />

      <input
        type="text"
        value={data.location || ''}
        onChange={(e) => onChange({ ...data, location: e.target.value })}
        placeholder="Wo warst du?"
        className={`w-full p-3 rounded-lg ${
          isDark
            ? 'bg-dark-elevated border-dark-border text-darkText-primary placeholder:text-darkText-muted'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
        } border`}
      />
    </div>
  )
}

function ChainLinksStep({ data, onChange, isDark }) {
  const [selectedType, setSelectedType] = useState(null)
  const [linkContent, setLinkContent] = useState('')
  const [linkIntensity, setLinkIntensity] = useState(3)

  const addLink = () => {
    if (!selectedType || !linkContent.trim()) return

    const newLink = {
      id: `link-${Date.now()}`,
      type: selectedType,
      content: linkContent,
      intensity: linkIntensity,
      order: data.length,
    }

    onChange([...data, newLink])
    setSelectedType(null)
    setLinkContent('')
    setLinkIntensity(3)
  }

  const removeLink = (linkId) => {
    onChange(data.filter((l) => l.id !== linkId))
  }

  return (
    <div className="space-y-4">
      <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
        Baue die Kette: Was passierte nach dem Auslöser?
      </p>

      {/* Existing Links */}
      {data.length > 0 && (
        <div className="space-y-2">
          {data.map((link, index) => {
            const type = LINK_TYPES.find((t) => t.id === link.type)
            return (
              <div
                key={link.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  isDark ? 'bg-dark-elevated' : 'bg-gray-50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: type?.color || '#6b7280' }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{type?.emoji}</span>
                    <span
                      className={`text-xs font-medium ${
                        isDark ? 'text-darkText-secondary' : 'text-gray-500'
                      }`}
                    >
                      {type?.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        isDark ? 'bg-dark-border' : 'bg-gray-200'
                      }`}
                    >
                      {link.intensity}/5
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}>
                    {link.content}
                  </p>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add New Link */}
      <div
        className={`p-4 rounded-lg border-2 border-dashed ${
          isDark ? 'border-dark-border' : 'border-gray-300'
        }`}
      >
        {!selectedType ? (
          <div className="grid grid-cols-5 gap-2">
            {LINK_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                  isDark ? 'hover:bg-dark-hover' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{type.emoji}</span>
                <span className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                  {type.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {LINK_TYPES.find((t) => t.id === selectedType)?.emoji}{' '}
                {LINK_TYPES.find((t) => t.id === selectedType)?.name}
              </span>
              <button onClick={() => setSelectedType(null)} className="text-sm text-gray-500">
                Ändern
              </button>
            </div>

            <input
              type="text"
              value={linkContent}
              onChange={(e) => setLinkContent(e.target.value)}
              placeholder={LINK_TYPES.find((t) => t.id === selectedType)?.prompt}
              className={`w-full p-2 rounded-lg ${
                isDark
                  ? 'bg-dark-surface border-dark-border text-darkText-primary'
                  : 'bg-white border-gray-200 text-gray-900'
              } border`}
            />

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Intensität: {linkIntensity}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={linkIntensity}
                onChange={(e) => setLinkIntensity(parseInt(e.target.value))}
                className="w-full"
                aria-label="Intensität festlegen"
              />
            </div>

            <button
              onClick={addLink}
              disabled={!linkContent.trim()}
              className={`w-full py-2 rounded-lg font-medium ${
                linkContent.trim()
                  ? isDark
                    ? 'bg-lavender-600 text-white'
                    : 'bg-lavender-500 text-white'
                  : isDark
                    ? 'bg-dark-border text-darkText-muted'
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              Hinzufügen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ConsequencesStep({ data, onChange, isDark }) {
  const addConsequence = (type, value) => {
    if (!value.trim()) return
    onChange({
      ...data,
      [type]: [...(data[type] || []), value],
    })
  }

  const removeConsequence = (type, index) => {
    onChange({
      ...data,
      [type]: data[type].filter((_, i) => i !== index),
    })
  }

  const ConsequenceInput = ({ type, label, placeholder }) => {
    const [value, setValue] = useState('')

    return (
      <div>
        <label
          className={`text-sm mb-2 block font-medium ${
            isDark ? 'text-darkText-primary' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 p-2 rounded-lg ${
              isDark
                ? 'bg-dark-elevated border-dark-border text-darkText-primary'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            } border`}
          />
          <button
            onClick={() => {
              addConsequence(type, value)
              setValue('')
            }}
            className={`px-3 rounded-lg ${
              isDark ? 'bg-lavender-600 text-white' : 'bg-lavender-500 text-white'
            }`}
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {(data[type] || []).map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                isDark ? 'bg-dark-elevated' : 'bg-gray-100'
              }`}
            >
              {item}
              <button onClick={() => removeConsequence(type, i)} className="text-red-500">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
        Was waren die Folgen deines Verhaltens?
      </p>

      <ConsequenceInput
        type="immediate"
        label="Unmittelbare Folgen"
        placeholder="z.B. Kurze Erleichterung, Scham..."
      />

      <ConsequenceInput
        type="shortTerm"
        label="Kurzfristige Folgen (Stunden/Tage)"
        placeholder="z.B. Partner ist besorgt..."
      />

      <ConsequenceInput
        type="longTerm"
        label="Langfristige Folgen"
        placeholder="z.B. Vertrauensverlust, Narben..."
      />
    </div>
  )
}

function SolutionsStep({ chain, onChange, isDark }) {
  return (
    <div className="space-y-6">
      <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}>
        Was könntest du beim nächsten Mal anders machen?
      </p>

      {/* Interventionspunkte Vorschau */}
      {chain.links.filter((l) => l.intensity >= 3).length > 0 && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-success-900/20' : 'bg-success-50'}`}>
          <h4
            className={`font-medium mb-2 flex items-center gap-2 ${
              isDark ? 'text-success-300' : 'text-success-700'
            }`}
          >
            <span>💡</span> Mögliche Interventionspunkte
          </h4>
          <div className="space-y-2">
            {chain.links
              .filter((l) => l.intensity >= 3)
              .map((link) => {
                const type = LINK_TYPES.find((t) => t.id === link.type)
                const skills = INTERVENTION_SKILLS[link.type] || []
                return (
                  <div
                    key={link.id}
                    className={`p-2 rounded ${isDark ? 'bg-dark-surface' : 'bg-white'}`}
                  >
                    <p className={`text-sm ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}>
                      {type?.emoji} Bei &quot;{link.content}&quot; →{' '}
                      <span className="font-medium">{skills.join(', ')}</span>
                    </p>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      <div>
        <label
          className={`text-sm mb-2 block font-medium ${
            isDark ? 'text-darkText-primary' : 'text-gray-700'
          }`}
        >
          Was hätte das Verhalten verhindern können?
        </label>
        <textarea
          value={chain.solutionAnalysis?.whatCouldPrevent || ''}
          onChange={(e) =>
            onChange({ ...chain.solutionAnalysis, whatCouldPrevent: e.target.value })
          }
          placeholder="z.B. Früher Hilfe holen, Skills anwenden..."
          rows={3}
          className={`w-full p-3 rounded-lg ${
            isDark
              ? 'bg-dark-elevated border-dark-border text-darkText-primary'
              : 'bg-gray-50 border-gray-200 text-gray-900'
          } border`}
        />
      </div>

      <div>
        <label
          className={`text-sm mb-2 block font-medium ${
            isDark ? 'text-darkText-primary' : 'text-gray-700'
          }`}
        >
          Gibt es etwas zu reparieren?
        </label>
        <textarea
          value={chain.solutionAnalysis?.repairActions?.join('\n') || ''}
          onChange={(e) =>
            onChange({
              ...chain.solutionAnalysis,
              repairActions: e.target.value.split('\n').filter(Boolean),
            })
          }
          placeholder="z.B. Mich bei meinem Partner entschuldigen..."
          rows={2}
          className={`w-full p-3 rounded-lg ${
            isDark
              ? 'bg-dark-elevated border-dark-border text-darkText-primary'
              : 'bg-gray-50 border-gray-200 text-gray-900'
          } border`}
        />
      </div>
    </div>
  )
}
