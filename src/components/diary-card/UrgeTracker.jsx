/**
 * UrgeTracker - Dränge/Impulse tracken
 */

import { useTheme } from '../../contexts/ThemeContext'
import { URGES, INTENSITY_SCALE } from '../../agents/DiaryCardAgent'

export default function UrgeTracker({ urges, urgesActedOn, onChange, onActedChange }) {
  const { isDark } = useTheme()

  return (
    <div
      className={`p-4 rounded-xl ${
        isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
      }`}
    >
      <h3
        className={`font-semibold mb-2 flex items-center gap-2 ${
          isDark ? 'text-darkText-primary' : 'text-gray-800'
        }`}
      >
        <span>⚡</span> Dränge / Impulse
      </h3>

      <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
        Wie stark waren heute deine Dränge? Hast du ihnen nachgegeben?
      </p>

      <div className="space-y-4">
        {URGES.map((urge) => (
          <UrgeRow
            key={urge.id}
            urge={urge}
            value={urges[urge.id] || 0}
            actedOn={urgesActedOn[urge.id] || false}
            onChange={(value) => onChange(urge.id, value)}
            onActedChange={(acted) => onActedChange(urge.id, acted)}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}

function UrgeRow({ urge, value, actedOn, onChange, onActedChange, isDark }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 w-36">
          <span className="text-xl">{urge.emoji}</span>
          <span
            className={`text-sm font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
          >
            {urge.name}
          </span>
          {urge.warning && <span className="text-xs text-red-500">⚠️</span>}
        </div>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="5"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                ${INTENSITY_SCALE[value].color} 0%,
                ${INTENSITY_SCALE[value].color} ${(value / 5) * 100}%,
                ${isDark ? '#2f3943' : '#e5e7eb'} ${(value / 5) * 100}%,
                ${isDark ? '#2f3943' : '#e5e7eb'} 100%)`,
            }}
          />
        </div>

        <span
          className={`w-6 text-center text-sm font-medium ${
            isDark ? 'text-darkText-primary' : 'text-gray-700'
          }`}
        >
          {value}
        </span>
      </div>

      {/* Nachgegeben? */}
      {value > 0 && (
        <div className="flex items-center gap-2 ml-10">
          <button
            onClick={() => onActedChange(!actedOn)}
            className={`
              flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all
              ${
                actedOn
                  ? isDark
                    ? 'bg-red-900/50 text-red-300'
                    : 'bg-red-100 text-red-700'
                  : isDark
                    ? 'bg-success-900/50 text-success-300'
                    : 'bg-success-100 text-success-700'
              }
            `}
          >
            {actedOn ? (
              <>
                <span>❌</span> Nachgegeben
              </>
            ) : (
              <>
                <span>✅</span> Widerstanden
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
