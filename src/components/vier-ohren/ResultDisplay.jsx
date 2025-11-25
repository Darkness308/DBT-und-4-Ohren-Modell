/**
 * ResultDisplay - Zeigt die Vier-Ohren-Analyse an
 */

import { vierOhrenDescriptions } from '../../data/vierOhrenExamples'
import RelatedSkills from '../common/RelatedSkills'

export default function ResultDisplay({ analysis }) {
  const levels = ['sachebene', 'selbstoffenbarung', 'beziehungsebene', 'appellseite']

  // Kontext für Skill-Empfehlungen zusammenstellen
  const skillContext = [
    analysis.originalStatement,
    analysis.context,
    'kommunikation'
  ].filter(Boolean).join(' ')

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Ursprüngliche Aussage */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Analysierte Aussage:</p>
        <p className="text-lg font-medium text-gray-800">"{analysis.originalStatement}"</p>
        {analysis.context && (
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-medium">Kontext:</span> {analysis.context}
          </p>
        )}
      </div>

      {/* Vier Ebenen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map((level) => (
          <LevelCard
            key={level}
            level={level}
            data={analysis[level]}
            description={vierOhrenDescriptions[level]}
          />
        ))}
      </div>

      {/* Missverständnis-Potenzial */}
      <MisunderstandingIndicator value={analysis.potentialForMisunderstanding} />

      {/* Vorschläge */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <SuggestionsCard suggestions={analysis.suggestions} />
      )}

      {/* Cross-Verlinkung zu passenden Skills */}
      <RelatedSkills context={skillContext} maxItems={3} />

      {/* Hinweis bei generischer Analyse */}
      {analysis.note && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700 text-sm">
            <span className="font-medium">ℹ️ Hinweis:</span> {analysis.note}
          </p>
        </div>
      )}
    </div>
  )
}

function LevelCard({ level, data, description }) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    yellow: 'from-yellow-50 to-amber-100 border-yellow-200',
    red: 'from-red-50 to-red-100 border-red-200',
  }

  const textColors = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[description.color]} rounded-xl p-4 border`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{description.icon}</span>
        <h3 className={`font-semibold ${textColors[description.color]}`}>
          {description.name}
        </h3>
      </div>

      <p className="text-xs text-gray-500 mb-2 italic">{description.question}</p>

      {/* Sachebene hat direkten Content */}
      {data.content && (
        <p className="text-gray-700">{data.content}</p>
      )}

      {/* Andere Ebenen haben Interpretationen */}
      {data.interpretations && (
        <ul className="space-y-2">
          {data.interpretations.map((interp, index) => (
            <li key={index} className="flex items-start gap-2">
              <LikelihoodIndicator likelihood={interp.likelihood} />
              <span className="text-gray-700 text-sm">{interp.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LikelihoodIndicator({ likelihood }) {
  const percentage = Math.round(likelihood * 100)
  const width = `${percentage}%`

  return (
    <div
      className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mt-1.5"
      title={`${percentage}% Wahrscheinlichkeit`}
    >
      <div
        className="h-full bg-calm-500 rounded-full transition-all duration-500"
        style={{ width }}
      />
    </div>
  )
}

function MisunderstandingIndicator({ value }) {
  const percentage = Math.round(value * 100)

  let color = 'bg-green-500'
  let text = 'Gering'
  if (value > 0.6) {
    color = 'bg-red-400'
    text = 'Hoch'
  } else if (value > 0.3) {
    color = 'bg-yellow-400'
    text = 'Mittel'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Potenzial für Missverständnisse
        </span>
        <span className={`text-sm font-medium ${value > 0.6 ? 'text-red-600' : value > 0.3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {text} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Je höher das Potenzial, desto wichtiger ist es, nachzufragen und die eigene Interpretation zu überprüfen.
      </p>
    </div>
  )
}

function SuggestionsCard({ suggestions }) {
  return (
    <div className="bg-calm-50 rounded-xl p-4 border border-calm-200">
      <h4 className="font-semibold text-calm-700 mb-3 flex items-center gap-2">
        <span>💡</span> Tipps für bessere Kommunikation
      </h4>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-700">
            <span className="text-calm-500 mt-0.5">•</span>
            <span className="text-sm">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
