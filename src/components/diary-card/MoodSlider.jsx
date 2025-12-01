/**
 * MoodSlider - Allgemeine Stimmung erfassen
 */

import { useTheme } from '../../contexts/ThemeContext'

const MOOD_LEVELS = [
  { value: 1, emoji: '😢', label: 'Sehr schlecht', color: '#ef4444' },
  { value: 2, emoji: '😕', label: 'Schlecht', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
  { value: 4, emoji: '🙂', label: 'Gut', color: '#84cc16' },
  { value: 5, emoji: '😊', label: 'Sehr gut', color: '#22c55e' },
]

export default function MoodSlider({ value, onChange }) {
  const { isDark } = useTheme()
  const selectedMood = MOOD_LEVELS.find((m) => m.value === value)

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
        <span>🎭</span> Allgemeine Stimmung
      </h3>

      <div className="flex justify-between gap-2">
        {MOOD_LEVELS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={`
              flex-1 flex flex-col items-center p-3 rounded-xl transition-all duration-200
              ${
                value === mood.value
                  ? 'ring-2 ring-offset-2 scale-105'
                  : isDark
                    ? 'hover:bg-dark-hover'
                    : 'hover:bg-gray-100'
              }
            `}
            style={{
              backgroundColor: value === mood.value ? `${mood.color}20` : 'transparent',
              ringColor: value === mood.value ? mood.color : 'transparent',
            }}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span
              className={`text-xs font-medium ${
                isDark ? 'text-darkText-secondary' : 'text-gray-600'
              }`}
            >
              {mood.value}
            </span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <p className={`text-center mt-3 text-sm font-medium`} style={{ color: selectedMood.color }}>
          {selectedMood.label}
        </p>
      )}
    </div>
  )
}
