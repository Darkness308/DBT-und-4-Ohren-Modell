/**
 * DiaryStats - Statistiken und Visualisierungen
 */

import { useTheme } from '../../contexts/ThemeContext'
import { EMOTIONS, URGES } from '../../agents/DiaryCardAgent'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

export default function DiaryStats({ stats }) {
  const { isDark } = useTheme()

  if (!stats || stats.entriesCount === 0) {
    return (
      <div
        className={`p-8 rounded-xl text-center ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        <span className="text-5xl mb-4 block">📊</span>
        <h3
          className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-darkText-primary' : 'text-gray-800'
          }`}
        >
          Noch keine Daten
        </h3>
        <p className={isDark ? 'text-darkText-secondary' : 'text-gray-500'}>
          Fülle dein erstes Tagebuch aus, um Statistiken zu sehen.
        </p>
      </div>
    )
  }

  // Daten für Emotions-Chart
  const emotionData = EMOTIONS.map((emotion) => ({
    name: emotion.emoji,
    fullName: emotion.name,
    value: Math.round((stats.emotionAverages[emotion.id] || 0) * 10) / 10,
    color: emotion.color,
  }))

  // Daten für Urge-Chart (für zukünftige Erweiterung)
  // eslint-disable-next-line no-unused-vars
  const urgeData = URGES.map((urge) => ({
    name: urge.emoji,
    fullName: urge.name,
    value: Math.round((stats.urgeAverages[urge.id] || 0) * 10) / 10,
  }))

  // Stimmungsverlauf aus Entries
  const moodTrend = stats.entries
    ?.filter((e) => e.mood !== null)
    .slice(-7)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString('de-DE', { weekday: 'short' }),
      mood: e.mood,
    }))

  return (
    <div className="space-y-4">
      {/* Übersicht */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="📅" label="Einträge (7 Tage)" value={stats.entriesCount} isDark={isDark} />
        <StatCard
          icon="🎭"
          label="Ø Stimmung"
          value={stats.averageMood?.toFixed(1) || '-'}
          isDark={isDark}
        />
        <StatCard icon="🧰" label="Skills genutzt" value={stats.skillsUsedCount} isDark={isDark} />
        <StatCard icon="🔥" label="Streak" value={`${stats.streak} Tage`} isDark={isDark} />
      </div>

      {/* Stimmungsverlauf */}
      {moodTrend && moodTrend.length > 1 && (
        <div
          className={`p-4 rounded-xl ${
            isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
          }`}
        >
          <h3
            className={`font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-darkText-primary' : 'text-gray-800'
            }`}
          >
            <span>📈</span> Stimmungsverlauf
          </h3>

          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={moodTrend}>
              <XAxis
                dataKey="date"
                tick={{ fill: isDark ? '#9aa2aa' : '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[1, 5]}
                tick={{ fill: isDark ? '#9aa2aa' : '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1a1f26' : '#fff',
                  border: isDark ? '1px solid #2f3943' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: isDark ? '#e7e9ea' : '#374151' }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Emotionen-Durchschnitt */}
      <div
        className={`p-4 rounded-xl ${
          isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
        }`}
      >
        <h3
          className={`font-semibold mb-4 flex items-center gap-2 ${
            isDark ? 'text-darkText-primary' : 'text-gray-800'
          }`}
        >
          <span>💚</span> Durchschnittliche Emotionen
        </h3>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={emotionData} layout="vertical">
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fill: isDark ? '#9aa2aa' : '#6b7280', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 16 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              formatter={(value, name, props) => [value, props.payload.fullName]}
              contentStyle={{
                backgroundColor: isDark ? '#1a1f26' : '#fff',
                border: isDark ? '1px solid #2f3943' : '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="#667eea" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Skills */}
      {stats.mostUsedSkills.length > 0 && (
        <div
          className={`p-4 rounded-xl ${
            isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
          }`}
        >
          <h3
            className={`font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-darkText-primary' : 'text-gray-800'
            }`}
          >
            <span>🏆</span> Meistgenutzte Skills
          </h3>

          <div className="space-y-2">
            {stats.mostUsedSkills.map((skill, index) => (
              <div
                key={skill.skillId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? 'bg-dark-elevated' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-yellow-900'
                        : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                            ? 'bg-orange-400 text-orange-900'
                            : isDark
                              ? 'bg-dark-border text-darkText-secondary'
                              : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
                  >
                    {skill.skillName}
                  </span>
                </div>
                <span className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                  {skill.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, isDark }) {
  return (
    <div
      className={`p-4 rounded-xl ${
        isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  )
}
