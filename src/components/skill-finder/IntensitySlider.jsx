/**
 * IntensitySlider - Intensität der Situation angeben
 */

import { skillFinder } from '../../agents/SkillFinderAgent'

export default function IntensitySlider({ value, onChange }) {
  const levels = skillFinder.intensityLevels

  const currentLevel = levels.find(l => l.value === value) || levels[1]

  // Farben basierend auf Intensität
  const getColor = (val) => {
    if (val <= 1) return 'bg-green-500'
    if (val <= 2) return 'bg-yellow-500'
    if (val <= 3) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getTextColor = (val) => {
    if (val <= 1) return 'text-green-700'
    if (val <= 2) return 'text-yellow-700'
    if (val <= 3) return 'text-orange-700'
    return 'text-red-700'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Wie intensiv fühlt es sich an?
      </h3>

      <div className="space-y-4">
        {/* Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="4"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                #22c55e 0%, #22c55e 25%,
                #eab308 25%, #eab308 50%,
                #f97316 50%, #f97316 75%,
                #ef4444 75%, #ef4444 100%)`
            }}
            aria-label="Intensität"
          />

          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-500">
            {levels.map((level) => (
              <span
                key={level.value}
                className={value === level.value ? 'font-medium text-gray-700' : ''}
              >
                {level.label}
              </span>
            ))}
          </div>
        </div>

        {/* Aktueller Wert */}
        <div className={`p-4 rounded-xl ${value >= 3 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getColor(value)}`} />
            <div>
              <p className={`font-semibold ${getTextColor(value)}`}>
                {currentLevel.label}
              </p>
              <p className="text-sm text-gray-600">
                {currentLevel.description}
              </p>
            </div>
          </div>

          {/* Warnung bei hoher Intensität */}
          {value >= 4 && (
            <div className="mt-3 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-700">
                <span className="font-medium">⚠️ Bei extremer Intensität:</span>{' '}
                Körperlich regulieren ist wichtig. Die TIPP-Skills können helfen,
                das Nervensystem schnell zu beruhigen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
