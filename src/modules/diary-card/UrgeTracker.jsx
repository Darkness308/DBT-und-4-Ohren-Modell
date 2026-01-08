import { useTheme } from '../../contexts/ThemeContext'
import { urgeCategories } from './DiaryCardAgent'

/**
 * UrgeTracker - Erfassung von Drang-Intensitäten
 *
 * Zeigt Warnung bei kritischen Urges
 */
export default function UrgeTracker({ urges, onChange, warnings = [] }) {
  const { isDark } = useTheme()

  const getIntensityColor = (value, critical) => {
    if (value === 0) return isDark ? '#374151' : '#E5E7EB'
    if (critical) {
      if (value >= 4) return '#DC2626'
      if (value >= 3) return '#F59E0B'
    }
    if (value >= 4) return '#EF4444'
    if (value >= 3) return '#F97316'
    if (value >= 2) return '#FBBF24'
    return '#22C55E'
  }

  return (
    <div className="space-y-4">
      {/* Warnungen anzeigen */}
      {warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {warnings.map((warning, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-l-4 ${
                warning.type === 'critical'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  warning.type === 'critical'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-orange-800 dark:text-orange-200'
                }`}
              >
                {warning.message}
              </p>
              {warning.helpline && (
                <p className="text-xs mt-1 text-red-600 dark:text-red-300">
                  Telefonseelsorge: {warning.helpline} (kostenlos, 24/7)
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Urge Slider */}
      {urgeCategories.map((urge) => {
        const value = urges[urge.id] || 0
        const color = getIntensityColor(value, urge.critical)

        return (
          <div key={urge.id} className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{urge.icon}</span>
                <span
                  className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
                >
                  {urge.label}
                </span>
                {urge.critical && (
                  <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                    Kritisch
                  </span>
                )}
              </div>
              <span
                className="text-sm font-medium px-2 py-1 rounded"
                style={{ color: value > 0 ? color : isDark ? '#9CA3AF' : '#6B7280' }}
              >
                {value}/5
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="5"
              value={value}
              onChange={(e) => onChange(urge.id, parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${color} ${value * 20}%, ${isDark ? '#374151' : '#E5E7EB'} ${value * 20}%)`,
              }}
              aria-label={`${urge.label} Intensität`}
            />
          </div>
        )
      })}
    </div>
  )
}
