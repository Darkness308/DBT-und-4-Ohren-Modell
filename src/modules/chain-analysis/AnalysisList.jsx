import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Card from '../../components/common/Card'
import { chainAnalysis, problemBehaviors } from './ChainAnalysisAgent'

/**
 * AnalysisList - Übersicht aller Kettenanalysen
 *
 * Zeigt Entwürfe und abgeschlossene Analysen,
 * ermöglicht Bearbeiten, Löschen und Statistik-Ansicht.
 */
export default function AnalysisList({ onEdit, onNew }) {
  const { isDark } = useTheme()
  const [analyses, setAnalyses] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all') // all, draft, complete
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setAnalyses(chainAnalysis.getAllAnalyses())
    setStats(chainAnalysis.getStats())
  }

  const handleDelete = (id) => {
    if (window.confirm('Diese Analyse wirklich löschen?')) {
      chainAnalysis.deleteAnalysis(id)
      loadData()
    }
  }

  const filteredAnalyses = filter === 'all' ? analyses : analyses.filter((a) => a.status === filter)

  const getBehaviorInfo = (typeId) => problemBehaviors.find((b) => b.id === typeId)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      {stats && stats.total > 0 && (
        <Card>
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <div
                  className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
                >
                  {stats.total} Analyse{stats.total > 1 ? 'n' : ''}
                </div>
                <div className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                  {stats.complete} abgeschlossen, {stats.draft} Entwürfe
                </div>
              </div>
            </div>
            <span className={`transition-transform ${showStats ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showStats && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-4">
              {/* Common Vulnerabilities */}
              {stats.commonVulnerabilities.length > 0 && (
                <div>
                  <div
                    className={`text-sm font-medium mb-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
                  >
                    Häufigste Vulnerabilitäten:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.commonVulnerabilities.map((v) => (
                      <span
                        key={v?.id}
                        className={`text-sm px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        {v?.emoji} {v?.label} ({v?.count}x)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Behaviors */}
              {stats.commonBehaviors.length > 0 && (
                <div>
                  <div
                    className={`text-sm font-medium mb-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
                  >
                    Häufigste Problemverhaltensweisen:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.commonBehaviors.map((b) => (
                      <span
                        key={b?.id}
                        className={`text-sm px-3 py-1 rounded-full ${
                          b?.critical
                            ? isDark
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-red-100 text-red-700'
                            : isDark
                              ? 'bg-gray-800'
                              : 'bg-gray-100'
                        }`}
                      >
                        {b?.emoji} {b?.label} ({b?.count}x)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Most Used Skills */}
              {stats.mostUsedSkills.length > 0 && (
                <div>
                  <div
                    className={`text-sm font-medium mb-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
                  >
                    Häufigste Lösungs-Skills:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.mostUsedSkills.map((s) => (
                      <span
                        key={s.skillId}
                        className={`text-sm px-3 py-1 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}
                      >
                        {s.skillId} ({s.count}x)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Filter Tabs */}
      {analyses.length > 0 && (
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Alle' },
            { id: 'draft', label: 'Entwürfe' },
            { id: 'complete', label: 'Abgeschlossen' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  filter === tab.id
                    ? 'bg-calm-500 text-white'
                    : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Analysis List */}
      {filteredAnalyses.length > 0 ? (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis) => {
            const behavior = getBehaviorInfo(analysis.problemBehavior?.type)
            const vulnCount = analysis.vulnerabilities?.length || 0
            const linkCount = analysis.chainLinks?.length || 0
            const solutionCount = analysis.solutions?.length || 0

            return (
              <Card key={analysis.id}>
                <div className="flex items-start gap-4">
                  {/* Behavior Icon */}
                  <div
                    className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                    ${
                      behavior?.critical
                        ? isDark
                          ? 'bg-red-900/30'
                          : 'bg-red-100'
                        : isDark
                          ? 'bg-gray-800'
                          : 'bg-gray-100'
                    }
                  `}
                  >
                    {behavior?.emoji || '🔗'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
                        >
                          {behavior?.label || 'Kettenanalyse'}
                        </h3>
                        <p
                          className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                        >
                          {formatDate(analysis.createdAt)}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`
                        text-xs px-2 py-1 rounded-full
                        ${
                          analysis.status === 'complete'
                            ? isDark
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-700'
                            : isDark
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-yellow-100 text-yellow-700'
                        }
                      `}
                      >
                        {analysis.status === 'complete' ? '✓ Abgeschlossen' : '📝 Entwurf'}
                      </span>
                    </div>

                    {/* Trigger Preview */}
                    {analysis.trigger?.what && (
                      <p
                        className={`text-sm mt-2 line-clamp-2 ${isDark ? 'text-darkText-secondary' : 'text-gray-600'}`}
                      >
                        ⚡ {analysis.trigger.what.slice(0, 100)}
                        {analysis.trigger.what.length > 100 ? '...' : ''}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span
                        className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                      >
                        🛡️ {vulnCount} Vulnerabilität{vulnCount !== 1 ? 'en' : ''}
                      </span>
                      <span
                        className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                      >
                        🔗 {linkCount} Kettenglied{linkCount !== 1 ? 'er' : ''}
                      </span>
                      <span
                        className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}
                      >
                        💡 {solutionCount} Lösung{solutionCount !== 1 ? 'en' : ''}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onEdit(analysis.id)}
                        className={`
                          text-sm px-3 py-1.5 rounded-lg transition-all
                          ${
                            isDark
                              ? 'bg-calm-900/30 text-calm-400 hover:bg-calm-900/50'
                              : 'bg-calm-100 text-calm-700 hover:bg-calm-200'
                          }
                        `}
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(analysis.id)}
                        className={`
                          text-sm px-3 py-1.5 rounded-lg transition-all
                          ${
                            isDark
                              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }
                        `}
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">🔗</span>
            <h3
              className={`text-lg font-medium mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
            >
              {filter === 'all'
                ? 'Noch keine Kettenanalysen'
                : filter === 'draft'
                  ? 'Keine Entwürfe'
                  : 'Keine abgeschlossenen Analysen'}
            </h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
              {filter === 'all'
                ? 'Starte deine erste Verhaltenskettenanalyse, um Muster zu erkennen.'
                : filter === 'draft'
                  ? 'Alle angefangenen Analysen wurden abgeschlossen.'
                  : 'Schließe eine Analyse ab, um sie hier zu sehen.'}
            </p>
            {filter === 'all' && (
              <button
                onClick={onNew}
                className="px-4 py-2 bg-calm-500 text-white rounded-lg hover:bg-calm-600 transition-colors"
              >
                + Erste Analyse starten
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
