/**
 * StreakCard - Zeigt Nutzungs-Streak und Motivation
 */

import { useMemo } from 'react'

export default function StreakCard({ skillHistory }) {
  const stats = useMemo(() => {
    if (!skillHistory || skillHistory.length === 0) {
      return { streak: 0, totalUses: 0, lastUsed: null }
    }

    // Streak berechnen (aufeinanderfolgende Tage mit Skill-Nutzung)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const usageDays = new Set()
    skillHistory.forEach(entry => {
      if (entry.timestamp) {
        const date = new Date(entry.timestamp)
        date.setHours(0, 0, 0, 0)
        usageDays.add(date.getTime())
      }
    })

    let streak = 0
    let currentDay = new Date(today)

    // Prüfe ob heute oder gestern genutzt wurde
    if (!usageDays.has(currentDay.getTime())) {
      currentDay.setDate(currentDay.getDate() - 1)
    }

    while (usageDays.has(currentDay.getTime())) {
      streak++
      currentDay.setDate(currentDay.getDate() - 1)
    }

    // Letzte Nutzung
    const sortedHistory = [...skillHistory].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )
    const lastUsed = sortedHistory[0]?.timestamp
      ? new Date(sortedHistory[0].timestamp)
      : null

    return {
      streak,
      totalUses: skillHistory.length,
      lastUsed
    }
  }, [skillHistory])

  const motivationalMessages = [
    'Jeder Skill ist ein Schritt nach vorn!',
    'Du machst das großartig!',
    'Übung macht den Meister!',
    'Kleine Schritte, große Wirkung!',
    'Du investierst in dich selbst!'
  ]

  const message = motivationalMessages[stats.totalUses % motivationalMessages.length]

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>🔥</span> Dein Fortschritt
        </h3>
        {stats.streak > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            {stats.streak} {stats.streak === 1 ? 'Tag' : 'Tage'} Streak
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <span className="text-2xl font-bold text-amber-600">{stats.totalUses}</span>
          <p className="text-xs text-gray-600">Skills genutzt</p>
        </div>
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <span className="text-2xl font-bold text-amber-600">{stats.streak}</span>
          <p className="text-xs text-gray-600">Tage in Folge</p>
        </div>
      </div>

      {/* Streak-Visualisierung */}
      <div className="flex gap-1 mb-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              i < stats.streak ? 'bg-amber-400' : 'bg-gray-200'
            }`}
            title={`Tag ${i + 1}`}
          />
        ))}
      </div>

      {/* Motivations-Nachricht */}
      <p className="text-sm text-gray-600 italic text-center">
        "{message}"
      </p>

      {/* Letzte Nutzung */}
      {stats.lastUsed && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Zuletzt genutzt: {stats.lastUsed.toLocaleDateString('de-DE', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      )}
    </div>
  )
}
