/**
 * SkillUsageChart - Visualisierung der Skill-Nutzung mit Recharts
 */

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { dbtModules } from '../../data/dbtSkills'

const MODULE_COLORS = {
  achtsamkeit: '#3b82f6',
  stresstoleranz: '#f97316',
  emotionsregulation: '#22c55e',
  zwischenmenschlich: '#eab308'
}

export default function SkillUsageChart({ skillHistory }) {
  // Daten für Skill-Nutzung nach Modul
  const moduleData = useMemo(() => {
    const counts = {}

    skillHistory.forEach(entry => {
      const module = entry.module || 'unbekannt'
      counts[module] = (counts[module] || 0) + 1
    })

    return Object.entries(counts).map(([module, count]) => ({
      name: dbtModules[module]?.name || module,
      value: count,
      color: MODULE_COLORS[module] || '#9ca3af'
    }))
  }, [skillHistory])

  // Daten für Effektivität
  const effectivenessData = useMemo(() => {
    const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    skillHistory.forEach(entry => {
      const rating = entry.effectiveness || 3
      ratings[rating]++
    })

    return Object.entries(ratings).map(([rating, count]) => ({
      name: `${rating}★`,
      count,
      rating: parseInt(rating)
    }))
  }, [skillHistory])

  // Top Skills
  const topSkills = useMemo(() => {
    const counts = {}

    skillHistory.forEach(entry => {
      const name = entry.skillName || entry.skillId
      counts[name] = (counts[name] || 0) + 1
    })

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }, [skillHistory])

  if (skillHistory.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📈</span> Skill-Statistiken
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart - Nutzung nach Modul */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">
            Nutzung nach DBT-Modul
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moduleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {moduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} mal`, 'Genutzt']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Effektivität */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">
            Bewertete Effektivität
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={effectivenessData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={40}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} mal`, 'Bewertet']}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                >
                  {effectivenessData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rating >= 4 ? '#22c55e' : entry.rating >= 3 ? '#eab308' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Skills Liste */}
      {topSkills.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-3">
            🏆 Meistgenutzte Skills
          </h4>
          <div className="space-y-2">
            {topSkills.map((skill, index) => (
              <div
                key={skill.name}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-calm-100 text-calm-700 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="flex-1 text-gray-700">{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
