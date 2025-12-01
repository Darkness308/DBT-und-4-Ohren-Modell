/**
 * DiaryCard - Hauptkomponente für das tägliche DBT-Tagebuch
 */

import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useApp } from '../../App'
import diaryCardAgent from '../../agents/DiaryCardAgent'
import EmotionTracker from './EmotionTracker'
import UrgeTracker from './UrgeTracker'
import SkillLogger from './SkillLogger'
import MoodSlider from './MoodSlider'
import DiaryStats from './DiaryStats'

export default function DiaryCard() {
  const { isDark } = useTheme()
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState('today')
  const [currentEntry, setCurrentEntry] = useState(null)
  const [stats, setStats] = useState(null)

  // Einträge aus State laden
  useEffect(() => {
    diaryCardAgent.loadEntries(state.diaryData || [])
    loadTodayEntry()
    updateStats()
  }, [state.diaryData])

  const loadTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0]
    let entry = diaryCardAgent.getEntryByDate(today)

    if (!entry) {
      entry = diaryCardAgent.createEntry(today)
    }

    setCurrentEntry(entry)
  }

  const updateStats = () => {
    setStats(diaryCardAgent.calculateStats(7))
  }

  const saveEntry = (updatedEntry) => {
    const saved = diaryCardAgent.saveEntry(updatedEntry)
    setCurrentEntry(saved)

    // In globalem State speichern
    dispatch({
      type: 'LOAD_STATE',
      payload: { diaryData: diaryCardAgent.getAllEntries() },
    })

    updateStats()
  }

  const handleEmotionChange = (emotionId, value) => {
    if (!currentEntry) return
    const updated = {
      ...currentEntry,
      emotions: { ...currentEntry.emotions, [emotionId]: value },
    }
    saveEntry(updated)
  }

  const handleUrgeChange = (urgeId, value) => {
    if (!currentEntry) return
    const updated = {
      ...currentEntry,
      urges: { ...currentEntry.urges, [urgeId]: value },
    }
    saveEntry(updated)
  }

  const handleUrgeActedChange = (urgeId, acted) => {
    if (!currentEntry) return
    const updated = {
      ...currentEntry,
      urgesActedOn: { ...currentEntry.urgesActedOn, [urgeId]: acted },
    }
    saveEntry(updated)
  }

  const handleMoodChange = (value) => {
    if (!currentEntry) return
    const updated = { ...currentEntry, mood: value }
    saveEntry(updated)
  }

  const handleNotesChange = (notes) => {
    if (!currentEntry) return
    const updated = { ...currentEntry, notes }
    saveEntry(updated)
  }

  const handleAddSkill = (skillId, skillName, effectiveness) => {
    if (!currentEntry) return
    diaryCardAgent.addSkillUsed(currentEntry.id, skillId, skillName, effectiveness)
    setCurrentEntry(diaryCardAgent.getEntryByDate(currentEntry.date))

    dispatch({
      type: 'LOAD_STATE',
      payload: { diaryData: diaryCardAgent.getAllEntries() },
    })
  }

  const tabs = [
    { id: 'today', label: 'Heute', icon: '📝' },
    { id: 'stats', label: 'Statistik', icon: '📊' },
    { id: 'history', label: 'Verlauf', icon: '📅' },
  ]

  if (!currentEntry) return null

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Streak Banner */}
      {stats?.streak > 0 && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 ${
            isDark
              ? 'bg-warning-900/30 border border-warning-500/30'
              : 'bg-warning-50 border border-warning-200'
          }`}
        >
          <span className="text-3xl">🔥</span>
          <div>
            <p className={`font-semibold ${isDark ? 'text-warning-300' : 'text-warning-700'}`}>
              {stats.streak} Tage Streak!
            </p>
            <p className={`text-sm ${isDark ? 'text-warning-400' : 'text-warning-600'}`}>
              Weiter so mit deinem täglichen Tracking
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div
        className={`rounded-xl p-1 flex gap-1 ${
          isDark ? 'bg-dark-surface' : 'bg-white shadow-soft'
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
              transition-all duration-200 font-medium text-sm
              ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-warning-600 text-white'
                    : 'bg-warning-500 text-white shadow-md'
                  : isDark
                    ? 'text-darkText-secondary hover:bg-dark-hover'
                    : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          {/* Datum */}
          <div
            className={`p-4 rounded-xl ${
              isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
            }`}
          >
            <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {new Date(currentEntry.date).toLocaleDateString('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Stimmung */}
          <MoodSlider value={currentEntry.mood} onChange={handleMoodChange} />

          {/* Emotionen */}
          <EmotionTracker emotions={currentEntry.emotions} onChange={handleEmotionChange} />

          {/* Dränge */}
          <UrgeTracker
            urges={currentEntry.urges}
            urgesActedOn={currentEntry.urgesActedOn}
            onChange={handleUrgeChange}
            onActedChange={handleUrgeActedChange}
          />

          {/* Skills */}
          <SkillLogger skillsUsed={currentEntry.skillsUsed} onAddSkill={handleAddSkill} />

          {/* Notizen */}
          <div
            className={`p-4 rounded-xl ${
              isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
            }`}
          >
            <h3
              className={`font-semibold mb-3 flex items-center gap-2 ${
                isDark ? 'text-darkText-primary' : 'text-gray-800'
              }`}
            >
              <span>📝</span> Notizen
            </h3>
            <textarea
              value={currentEntry.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Wie war dein Tag? Was ist passiert?"
              rows={3}
              className={`w-full p-3 rounded-lg resize-none ${
                isDark
                  ? 'bg-dark-elevated border-dark-border text-darkText-primary placeholder:text-darkText-muted'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              } border focus:ring-2 focus:ring-warning-500 focus:border-warning-500`}
            />
          </div>

          {/* Warnungen */}
          {diaryCardAgent.detectWarnings(currentEntry).length > 0 && (
            <div
              className={`p-4 rounded-xl ${
                isDark
                  ? 'bg-red-900/30 border border-red-500/30'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <h4
                className={`font-semibold mb-2 flex items-center gap-2 ${
                  isDark ? 'text-red-300' : 'text-red-700'
                }`}
              >
                <span>⚠️</span> Hinweise
              </h4>
              <ul className="space-y-1">
                {diaryCardAgent.detectWarnings(currentEntry).map((warning, i) => (
                  <li key={i} className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {warning.message}
                  </li>
                ))}
              </ul>
              <p className={`text-xs mt-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                Bei akuter Krise: Telefonseelsorge 0800 111 0 111 (kostenlos, 24/7)
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && <DiaryStats stats={stats} />}

      {activeTab === 'history' && (
        <DiaryHistory
          entries={diaryCardAgent.getAllEntries()}
          onSelectDate={(date) => {
            const entry = diaryCardAgent.getEntryByDate(date) || diaryCardAgent.createEntry(date)
            setCurrentEntry(entry)
            setActiveTab('today')
          }}
        />
      )}
    </div>
  )
}

// History-Komponente
function DiaryHistory({ entries, onSelectDate }) {
  const { isDark } = useTheme()

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  })

  return (
    <div
      className={`p-4 rounded-xl ${
        isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
      }`}
    >
      <h3
        className={`font-semibold mb-4 flex items-center gap-2 ${
          isDark ? 'text-darkText-primary' : 'text-gray-800'
        }`}
      >
        <span>📅</span> Letzte 30 Tage
      </h3>

      <div className="grid grid-cols-7 gap-1">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-1 ${
              isDark ? 'text-darkText-secondary' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}

        {last30Days.reverse().map((date) => {
          const entry = entries.find((e) => e.date === date)
          const isToday = date === new Date().toISOString().split('T')[0]
          const hasEntry = entry?.isComplete

          return (
            <button
              key={date}
              onClick={() => onSelectDate(date)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm
                transition-all duration-200
                ${isToday ? (isDark ? 'ring-2 ring-warning-500' : 'ring-2 ring-warning-500') : ''}
                ${
                  hasEntry
                    ? isDark
                      ? 'bg-success-900/50 text-success-300'
                      : 'bg-success-100 text-success-700'
                    : entry
                      ? isDark
                        ? 'bg-warning-900/30 text-warning-400'
                        : 'bg-warning-50 text-warning-600'
                      : isDark
                        ? 'bg-dark-elevated text-darkText-secondary hover:bg-dark-hover'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {new Date(date).getDate()}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${isDark ? 'bg-success-900/50' : 'bg-success-100'}`} />
          <span className={isDark ? 'text-darkText-secondary' : 'text-gray-500'}>Vollständig</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${isDark ? 'bg-warning-900/30' : 'bg-warning-50'}`} />
          <span className={isDark ? 'text-darkText-secondary' : 'text-gray-500'}>Begonnen</span>
        </div>
      </div>
    </div>
  )
}
