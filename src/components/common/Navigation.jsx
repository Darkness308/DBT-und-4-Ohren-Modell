/**
 * Bottom Navigation Component
 * Mobile-optimierte Navigation zwischen Modulen
 * Dark Mode Support mit therapeutischen Modul-Farben
 */

import { useTheme } from '../../contexts/ThemeContext'

// Modul-spezifische Farben für konsistente Navigation
const navItems = [
  { id: 'home', icon: '🏠', label: 'Home', color: 'calm' },
  { id: 'vier-ohren', icon: '👂', label: 'Analyzer', color: 'lavender' },
  { id: 'skills', icon: '🧰', label: 'Skills', color: 'success' },
  { id: 'settings', icon: '⚙️', label: 'Mehr', color: 'gray' },
]

export default function Navigation({ activeModule, onNavigate }) {
  const { isDark } = useTheme()

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 px-4 py-2 shadow-lg transition-theme
        ${isDark ? 'bg-dark-surface border-t border-dark-border' : 'bg-white border-t border-gray-200'}
      `}
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            color={item.color}
            active={activeModule === item.id}
            onClick={() => onNavigate(item.id)}
            isDark={isDark}
          />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ icon, label, color, active, onClick, isDark }) {
  // Modul-spezifische aktive Farben
  const getActiveClasses = () => {
    const colorMap = {
      calm: isDark ? 'bg-calm-900/50 text-calm-400' : 'bg-calm-100 text-calm-700',
      lavender: isDark
        ? 'bg-lavender-900/50 text-lavender-400'
        : 'bg-lavender-100 text-lavender-700',
      success: isDark ? 'bg-success-900/50 text-success-400' : 'bg-success-100 text-success-700',
      warning: isDark ? 'bg-warning-900/50 text-warning-400' : 'bg-warning-100 text-warning-700',
      gray: isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700',
    }
    return colorMap[color] || colorMap.calm
  }

  const getInactiveClasses = () => {
    return isDark
      ? 'text-darkText-secondary hover:bg-dark-hover'
      : 'text-gray-500 hover:bg-gray-100'
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        px-3 py-2 rounded-xl
        transition-smooth min-w-[64px]
        ${active ? getActiveClasses() : getInactiveClasses()}
      `}
      aria-current={active ? 'page' : undefined}
    >
      <span className="text-xl mb-1" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
