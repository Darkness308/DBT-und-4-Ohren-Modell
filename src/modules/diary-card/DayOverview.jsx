import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { diaryCard, emotionCategories } from './DiaryCardAgent'

/**
 * DayOverview - Zeigt Statistiken und Verlauf
 */
export default function DayOverview() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState(null)
  const [lastDays, setLastDays] = useState([])
  const [range, setRange] = useState(7)

  useEffect(() => {
    setStats(diaryCard.getStats(range))
    setLastDays(diaryCard.getLastDays(range))
  }, [range])

  if (!stats) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
        Lade Statistiken...
      </div>
    )
  }

  const allEmotions = [...emotionCategories.primary, ...emotionCategories.secondary]

  // Top 3 Emotionen
  const topEmotions = Object.entries(stats.averageEmotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, avg]) => ({
      ...allEmotions.find((e) => e.id === id),
      average: avg,
    }))

  return (
    <div className="space-y-6">
      {/* Range Selector */}
      <div className="flex gap-2">
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            onClick={() => setRange(days)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                range === days
                  ? 'bg-calm-500 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {days} Tage
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak */}
        <div
          className={`
          p-4 rounded-lg text-center
          ${isDark ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border border-orange-200'}
        `}
        >
          <div className="text-3xl mb-1">🔥</div>
          <div className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {stats.streakDays}
          </div>
          <div className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
            Tage Streak
          </div>
        </div>

        {/* Completion Rate */}
        <div
          className={`
          p-4 rounded-lg text-center
          ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}
        `}
        >
          <div className="text-3xl mb-1">✓</div>
          <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {Math.round(stats.completionRate * 100)}%
          </div>
          <div className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
            Einträge ({stats.totalEntries}/{range})
          </div>
        </div>
      </div>

      {/* Top Emotionen */}
      {topEmotions.length > 0 && (
        <div>
          <h4 className={`font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
            Häufigste Emotionen
          </h4>
          <div className="space-y-2">
            {topEmotions.map((emotion) => (
              <div
                key={emotion?.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
                `}
              >
                <span className="text-2xl">{emotion?.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-darkText-primary' : 'text-gray-800'}>
                      {emotion?.label}
                    </span>
                    <span
                      className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                    >
                      Ø {emotion.average.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(emotion.average / 5) * 100}%`,
                        backgroundColor: emotion?.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill-Nutzung */}
      {Object.keys(stats.skillUsageCount).length > 0 && (
        <div>
          <h4 className={`font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
            Genutzte Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.skillUsageCount)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([skillId, count]) => (
                <span
                  key={skillId}
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${isDark ? 'bg-calm-900/30 text-calm-300' : 'bg-calm-100 text-calm-700'}
                  `}
                >
                  {skillId} ({count}x)
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Wochenverlauf */}
      {lastDays.length > 0 && (
        <div>
          <h4 className={`font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
            Letzte {range} Tage
          </h4>
          <div className="flex gap-1">
            {Array.from({ length: range }).map((_, idx) => {
              const date = new Date()
              date.setDate(date.getDate() - (range - 1 - idx))
              const dateKey = date.toISOString().split('T')[0]
              const hasEntry = lastDays.some((e) => e.date === dateKey)
              const isToday = idx === range - 1

              return (
                <div
                  key={idx}
                  className={`
                    flex-1 h-8 rounded
                    ${hasEntry ? 'bg-green-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}
                    ${isToday ? 'ring-2 ring-calm-500 ring-offset-2' : ''}
                    ${isDark && isToday ? 'ring-offset-dark-bg' : 'ring-offset-white'}
                  `}
                  title={`${date.toLocaleDateString('de-DE')}: ${hasEntry ? 'Eintrag vorhanden' : 'Kein Eintrag'}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {new Date(Date.now() - (range - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(
                'de-DE',
                {
                  day: 'numeric',
                  month: 'short',
                }
              )}
            </span>
            <span className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              Heute
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {lastDays.length === 0 && (
        <div
          className={`
          text-center py-8 rounded-lg border-2 border-dashed
          ${isDark ? 'border-gray-700 text-darkText-secondary' : 'border-gray-200 text-gray-400'}
        `}
        >
          <span className="text-4xl mb-2 block">📝</span>
          <p>Noch keine Einträge</p>
          <p className="text-sm mt-1">Starte mit deinem ersten Tageseintrag!</p>
        </div>
      )}
    </div>
  )
}
