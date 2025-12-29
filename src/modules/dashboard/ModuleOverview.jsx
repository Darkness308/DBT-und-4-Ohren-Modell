/**
 * ModuleOverview - Visuelle Übersicht aller Module
 */

const modules = [
  {
    id: 'vier-ohren',
    name: 'Vier-Ohren-Modell',
    icon: '👂',
    description: 'Kommunikation analysieren',
    color: 'from-blue-400 to-blue-600',
    status: 'active',
  },
  {
    id: 'skills',
    name: 'Skill-Finder',
    icon: '🧰',
    description: 'Passende DBT-Skills finden',
    color: 'from-green-400 to-green-600',
    status: 'active',
  },
  {
    id: 'diary',
    name: 'Diary Card',
    icon: '📊',
    description: 'Emotionen tracken',
    color: 'from-purple-400 to-purple-600',
    status: 'coming',
  },
  {
    id: 'chain',
    name: 'Chain Analysis',
    icon: '🔗',
    description: 'Verhalten verstehen',
    color: 'from-orange-400 to-orange-600',
    status: 'coming',
  },
]

export default function ModuleOverview({ onNavigate }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📱</span> Module
      </h3>

      {/* Architektur-Diagramm */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center text-sm text-gray-500 mb-3">Modul-Architektur</div>
        <div className="flex flex-col items-center">
          {/* Orchestrator */}
          <div className="bg-calm-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow">
            App Orchestrator
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-px bg-gray-300" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <div className="w-8 h-px bg-gray-300" />
          </div>

          {/* Module */}
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`
                  px-3 py-1 rounded-lg text-xs font-medium
                  ${
                    module.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }
                `}
              >
                {module.icon} {module.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-2 gap-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={() => module.status === 'active' && onNavigate(module.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ModuleCard({ module, onClick }) {
  const isActive = module.status === 'active'

  return (
    <button
      onClick={onClick}
      disabled={!isActive}
      className={`
        relative p-4 rounded-xl text-left transition-all duration-200
        ${
          isActive
            ? 'bg-gradient-to-br ' +
              module.color +
              ' text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }
      `}
    >
      <span className="text-2xl block mb-2">{module.icon}</span>
      <h4 className="font-semibold text-sm">{module.name}</h4>
      <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
        {module.description}
      </p>

      {!isActive && (
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full text-xs">
          Bald
        </span>
      )}
    </button>
  )
}
