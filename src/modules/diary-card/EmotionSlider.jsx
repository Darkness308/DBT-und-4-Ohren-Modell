import { useTheme } from '../../contexts/ThemeContext'

/**
 * EmotionSlider - Slider für Emotions-Intensität (0-5)
 *
 * 0 = Nicht vorhanden
 * 5 = Extrem stark
 */
export default function EmotionSlider({ emotion, value, onChange }) {
  const { isDark } = useTheme()

  const levels = [
    { value: 0, label: 'Keine' },
    { value: 1, label: 'Kaum' },
    { value: 2, label: 'Leicht' },
    { value: 3, label: 'Mittel' },
    { value: 4, label: 'Stark' },
    { value: 5, label: 'Extrem' },
  ]

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emotion.emoji}</span>
          <span className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
            {emotion.label}
          </span>
        </div>
        <span
          className="text-sm font-medium px-2 py-1 rounded"
          style={{
            backgroundColor: value > 0 ? `${emotion.color}20` : 'transparent',
            color: value > 0 ? emotion.color : isDark ? '#9CA3AF' : '#6B7280',
          }}
        >
          {levels[value]?.label || 'Keine'}
        </span>
      </div>

      <div className="flex gap-1">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(emotion.id, level.value)}
            className={`
              flex-1 h-8 rounded-md transition-all duration-200
              ${value === level.value ? 'ring-2 ring-offset-2' : ''}
              ${isDark ? 'ring-offset-dark-bg' : 'ring-offset-white'}
            `}
            style={{
              backgroundColor:
                value >= level.value && level.value > 0
                  ? emotion.color
                  : isDark
                    ? '#374151'
                    : '#E5E7EB',
              opacity: value >= level.value ? 1 : 0.3,
              ringColor: emotion.color,
            }}
            aria-label={`${emotion.label}: ${level.label}`}
          />
        ))}
      </div>
    </div>
  )
}
