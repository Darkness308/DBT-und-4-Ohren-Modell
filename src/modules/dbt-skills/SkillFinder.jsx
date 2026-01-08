/**
 * SkillFinder - Hauptkomponente
 * Findet passende DBT-Skills basierend auf der Situation
 */

import { useState } from 'react'
import SituationSelector from './SituationSelector'
import IntensitySlider from './IntensitySlider'
import SkillRecommendations from './SkillRecommendations'
import SkillDetail from './SkillDetail'
import Button from '../../components/common/Button'
import { skillFinder } from './SkillFinderAgent'

export default function SkillFinder() {
  const [situationType, setSituationType] = useState(null)
  const [intensity, setIntensity] = useState(2)
  const [results, setResults] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!situationType) return

    setIsSearching(true)
    setSelectedSkill(null)

    // Kurze Verzögerung für UX
    setTimeout(() => {
      const searchResults = skillFinder.findSkills({
        situationType,
        intensity,
      })

      setResults(searchResults)
      setIsSearching(false)
    }, 400)
  }

  const handleSkillSelect = (skill) => {
    const fullSkill = skillFinder.getSkillById(skill.id)
    setSelectedSkill(fullSkill)
  }

  const handleBack = () => {
    setSelectedSkill(null)
  }

  const handleReset = () => {
    setSituationType(null)
    setIntensity(2)
    setResults(null)
    setSelectedSkill(null)
  }

  // Skill-Detail Ansicht
  if (selectedSkill) {
    return (
      <SkillDetail
        skill={selectedSkill}
        onBack={handleBack}
        onMarkUsed={(effectiveness) => {
          skillFinder.markSkillUsed(selectedSkill.id, effectiveness)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Einführung */}
      <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧰</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Skill-Finder</h2>
            <p className="text-gray-500">DBT-Skills für deine Situation</p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Beschreibe deine aktuelle Situation und wie intensiv sie sich anfühlt. Der Skill-Finder
          empfiehlt dir passende <strong>DBT-Skills</strong> aus den Bereichen Achtsamkeit,
          Stresstoleranz, Emotionsregulation und zwischenmenschliche Effektivität.
        </p>
      </div>

      {/* Situations-Auswahl */}
      <SituationSelector selected={situationType} onSelect={setSituationType} />

      {/* Intensität */}
      {situationType && <IntensitySlider value={intensity} onChange={setIntensity} />}

      {/* Such-Button */}
      {situationType && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSearch}
            loading={isSearching}
            icon="🔍"
            className="flex-1"
          >
            {isSearching ? 'Suche Skills...' : 'Skills finden'}
          </Button>
          {results && (
            <Button variant="secondary" onClick={handleReset} icon="🔄">
              Neu
            </Button>
          )}
        </div>
      )}

      {/* Ergebnisse */}
      {results && results.success && (
        <SkillRecommendations results={results} onSkillSelect={handleSkillSelect} />
      )}

      {/* Fehler */}
      {results && !results.success && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {results.error}
        </div>
      )}
    </div>
  )
}
