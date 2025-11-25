/**
 * Bottom Navigation Component
 * Mobile-optimierte Navigation zwischen Modulen
 */

const navItems = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'vier-ohren', icon: '👂', label: 'Vier Ohren' },
  { id: 'skills', icon: '🧰', label: 'Skills' },
  { id: 'diary', icon: '📊', label: 'Diary' },
]

export default function Navigation({ activeModule, onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeModule === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        px-3 py-2 rounded-xl
        transition-smooth min-w-[64px]
        ${active
          ? 'bg-calm-100 text-calm-700'
          : 'text-gray-500 hover:bg-gray-100'
        }
      `}
      aria-current={active ? 'page' : undefined}
    >
      <span className="text-xl mb-1" aria-hidden="true">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
