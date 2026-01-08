/**
 * QuickActions - Schnellzugriff auf häufige Aktionen
 */

export default function QuickActions({ onNavigate }) {
  const actions = [
    {
      id: 'analyze',
      icon: '👂',
      label: 'Aussage analysieren',
      module: 'vier-ohren',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
    {
      id: 'find-skill',
      icon: '🆘',
      label: 'Skill finden',
      module: 'skills',
      color: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
    },
    {
      id: 'calm',
      icon: '🧘',
      label: 'Beruhigen',
      module: 'skills',
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
      subtext: 'TIPP-Skills',
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md p-4 animate-fade-in">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Schnellzugriff</h3>
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.module)}
            className={`
              flex-1 p-3 rounded-xl text-center transition-all duration-200
              ${action.color}
            `}
          >
            <span className="text-2xl block mb-1">{action.icon}</span>
            <span className="text-xs font-medium block">{action.label}</span>
            {action.subtext && <span className="text-xs opacity-70 block">{action.subtext}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
