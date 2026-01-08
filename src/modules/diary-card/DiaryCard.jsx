import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import EmotionSlider from './EmotionSlider'
import UrgeTracker from './UrgeTracker'
import SkillLogger from './SkillLogger'
import DayOverview from './DayOverview'
import { diaryCard, emotionCategories } from './DiaryCardAgent'

/**
 * DiaryCard - Haupt-Komponente für tägliches Tracking
 *
 * Tabs:
 * 1. Emotionen - Primäre & sekundäre Emotionen tracken
 * 2. Drang - Urges und kritische Verhaltensweisen
 * 3. Skills - Welche Skills wurden heute genutzt
 * 4. Übersicht - Statistiken und Verlauf
 */
export default function DiaryCard() {
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('emotions')
  const [entry, setEntry] = useState({
    emotions: {},
    urges: {},
    skillsUsed: [],
    notes: '',
    sleepHours: null,
  })
  const [warnings, setWarnings] = useState([])
  const [saved, setSaved] = useState(false)

  // Heutigen Eintrag laden
  useEffect(() => {
    const todayEntry = diaryCard.getEntry()
    if (todayEntry) {
      setEntry(todayEntry)
    }
  }, [])

  // Auto-save bei Änderungen
  const saveEntry = useCallback(() => {
    diaryCard.saveEntry(entry)
    const newWarnings = diaryCard.checkCriticalUrges(entry)
    setWarnings(newWarnings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [entry])

  // Emotion ändern
  const handleEmotionChange = (emotionId, value) => {
    setEntry((prev) => ({
      ...prev,
      emotions: { ...prev.emotions, [emotionId]: value },
    }))
  }

  // Urge ändern
  const handleUrgeChange = (urgeId, value) => {
    const newEntry = {
      ...entry,
      urges: { ...entry.urges, [urgeId]: value },
    }
    setEntry(newEntry)

    // Sofort auf kritische Urges prüfen
    const newWarnings = diaryCard.checkCriticalUrges(newEntry)
    setWarnings(newWarnings)
  }

  // Skill hinzufügen
  const handleSkillAdd = (skill) => {
    setEntry((prev) => ({
      ...prev,
      skillsUsed: [
        ...prev.skillsUsed,
        {
          ...skill,
          timestamp: new Date().toISOString(),
        },
      ],
    }))
  }

  const tabs = [
    { id: 'emotions', label: 'Emotionen', emoji: '💭' },
    { id: 'urges', label: 'Drang', emoji: '⚡' },
    { id: 'skills', label: 'Skills', emoji: '🛠️' },
    { id: 'overview', label: 'Übersicht', emoji: '📊' },
  ]

  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-semibold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
            >
              Diary Card
            </h2>
            <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {today}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-sm text-green-600 dark:text-green-400 animate-fade-in">
                ✓ Gespeichert
              </span>
            )}
            <Button onClick={saveEntry} variant="primary" size="sm">
              Speichern
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-dark-surface rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md
              text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-dark-bg text-calm-600 dark:text-calm-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card>
        {activeTab === 'emotions' && (
          <div className="space-y-6">
            <div>
              <h3
                className={`text-lg font-medium mb-4 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
              >
                Primäre Emotionen
              </h3>
              {emotionCategories.primary.map((emotion) => (
                <EmotionSlider
                  key={emotion.id}
                  emotion={emotion}
                  value={entry.emotions[emotion.id] || 0}
                  onChange={handleEmotionChange}
                />
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
              <h3
                className={`text-lg font-medium mb-4 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
              >
                Sekundäre Emotionen
              </h3>
              {emotionCategories.secondary.map((emotion) => (
                <EmotionSlider
                  key={emotion.id}
                  emotion={emotion}
                  value={entry.emotions[emotion.id] || 0}
                  onChange={handleEmotionChange}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'urges' && (
          <div>
            <h3
              className={`text-lg font-medium mb-4 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
            >
              Drang-Intensität heute
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              Wie stark war der Drang heute? (0 = gar nicht, 5 = extrem stark)
            </p>
            <UrgeTracker urges={entry.urges} onChange={handleUrgeChange} warnings={warnings} />
          </div>
        )}

        {activeTab === 'skills' && (
          <SkillLogger skillsUsed={entry.skillsUsed} onSkillAdd={handleSkillAdd} />
        )}

        {activeTab === 'overview' && <DayOverview />}
      </Card>

      {/* Notizen */}
      {activeTab !== 'overview' && (
        <Card>
          <h3
            className={`text-lg font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
          >
            Notizen
          </h3>
          <textarea
            value={entry.notes}
            onChange={(e) => setEntry((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Was ist heute passiert? Wie geht es dir?"
            rows={3}
            className={`
              w-full p-3 rounded-lg border resize-none
              ${isDark ? 'bg-dark-bg border-gray-700 text-darkText-primary placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}
              focus:ring-2 focus:ring-calm-500 focus:border-transparent
            `}
          />
        </Card>
      )}
    </div>
  )
}
