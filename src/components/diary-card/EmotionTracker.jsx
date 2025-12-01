/**
 * EmotionTracker - Emotionen auf einer 0-5 Skala tracken
 */

import { useTheme } from '../../contexts/ThemeContext'
import { EMOTIONS, INTENSITY_SCALE } from '../../agents/DiaryCardAgent'

export default function EmotionTracker({ emotions, onChange }) {
  const { isDark } = useTheme()

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
        <span>💚</span> Emotionen heute
      </h3>

      <div className="space-y-4">
        {EMOTIONS.map((emotion) => (
          <EmotionRow
            key={emotion.id}
            emotion={emotion}
            value={emotions[emotion.id] || 0}
            onChange={(value) => onChange(emotion.id, value)}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Legende */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
        <div className="flex justify-between text-xs">
          {INTENSITY_SCALE.map((level) => (
            <div key={level.value} className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: level.color }} />
              <span className={isDark ? 'text-darkText-secondary' : 'text-gray-500'}>
                {level.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmotionRow({ emotion, value, onChange, isDark }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-28">
        <span className="text-xl">{emotion.emoji}</span>
        <span
          className={`text-sm font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
        >
          {emotion.name}
        </span>
      </div>

      <div className="flex-1 flex gap-1">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`
              flex-1 h-8 rounded-lg transition-all duration-200
              ${value === level ? 'ring-2 ring-offset-2 ring-calm-500' : ''}
            `}
            style={{
              backgroundColor:
                level <= value ? INTENSITY_SCALE[level].color : isDark ? '#2f3943' : '#e5e7eb',
            }}
            aria-label={`${emotion.name} Intensität ${level}`}
          />
        ))}
      </div>

      <span
        className={`w-6 text-center text-sm font-medium ${
          isDark ? 'text-darkText-primary' : 'text-gray-700'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
