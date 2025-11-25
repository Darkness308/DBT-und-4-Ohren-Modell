/**
 * RecentActivity - Letzte Skill-Nutzungen
 */

import { useMemo } from 'react'
import { dbtModules } from '../../data/dbtSkills'

export default function RecentActivity({ skillHistory }) {
  const recentItems = useMemo(() => {
    return [...skillHistory]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
  }, [skillHistory])

  if (recentItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📋</span> Letzte Aktivität
      </h3>

      <div className="space-y-3">
        {recentItems.map((item, index) => (
          <ActivityItem key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

function ActivityItem({ item }) {
  const module = dbtModules[item.module]
  const timestamp = item.timestamp ? new Date(item.timestamp) : null

  const moduleColors = {
    achtsamkeit: 'bg-blue-100 text-blue-700',
    stresstoleranz: 'bg-orange-100 text-orange-700',
    emotionsregulation: 'bg-green-100 text-green-700',
    zwischenmenschlich: 'bg-yellow-100 text-yellow-700'
  }

  const formatTime = (date) => {
    if (!date) return ''

    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Gerade eben'
    if (minutes < 60) return `vor ${minutes} Min`
    if (hours < 24) return `vor ${hours} Std`
    if (days < 7) return `vor ${days} Tagen`

    return date.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${moduleColors[item.module] || 'bg-gray-100 text-gray-600'}`}>
        <span>{module?.icon || '📝'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">
          {item.skillName || item.skillId}
        </p>
        <p className="text-xs text-gray-500">
          {module?.name || 'Skill'} • {formatTime(timestamp)}
        </p>
      </div>

      {/* Effektivität */}
      {item.effectiveness && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xs ${i < item.effectiveness ? 'text-amber-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
