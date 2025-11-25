/**
 * Dashboard - Hauptübersicht mit Statistiken und Quick-Actions
 */

import { useApp } from '../../App'
import ModuleOverview from './ModuleOverview'
import SkillUsageChart from './SkillUsageChart'
import QuickActions from './QuickActions'
import StreakCard from './StreakCard'
import RecentActivity from './RecentActivity'
import SkillOfTheDay from './SkillOfTheDay'

export default function Dashboard() {
  const { state, navigate } = useApp()
  const { skillHistory } = state

  return (
    <div className="space-y-6">
      {/* Willkommen */}
      <div className="bg-gradient-to-r from-calm-500 to-purple-500 rounded-xl p-6 text-white shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">
          Willkommen zurück! 👋
        </h2>
        <p className="text-white/80">
          Deine Werkzeuge für Emotionsregulation und bessere Kommunikation.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions onNavigate={navigate} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skill des Tages */}
        <SkillOfTheDay />

        {/* Streak */}
        <StreakCard skillHistory={skillHistory} />
      </div>

      {/* Skill-Nutzung Chart */}
      {skillHistory.length > 0 && (
        <SkillUsageChart skillHistory={skillHistory} />
      )}

      {/* Modul-Übersicht */}
      <ModuleOverview onNavigate={navigate} />

      {/* Letzte Aktivität */}
      {skillHistory.length > 0 && (
        <RecentActivity skillHistory={skillHistory} />
      )}

      {/* Hilfe-Hinweis */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-700 text-sm">
          <span className="font-medium">💡 Tipp:</span>{' '}
          Regelmäßiges Üben macht Skills zur Gewohnheit.
          Schon 5 Minuten täglich können einen Unterschied machen.
        </p>
      </div>

      {/* Krisen-Hinweis */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-gray-600 text-sm">
          <span className="font-medium">📞 Bei akuter Krise:</span>{' '}
          Telefonseelsorge <strong>0800 111 0 111</strong> (kostenlos, 24/7)
        </p>
      </div>
    </div>
  )
}
