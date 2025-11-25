/**
 * Reusable Card Component
 * Basis-Karte für konsistentes Layout
 */

export default function Card({
  children,
  className = '',
  variant = 'default',
  borderColor = null,
  onClick = null
}) {
  const baseStyles = 'bg-white rounded-xl shadow-md p-6 border animate-fade-in'

  const variants = {
    default: 'border-gray-100',
    elevated: 'border-gray-100 shadow-lg',
    outlined: 'border-gray-200 shadow-sm',
  }

  const borderStyles = borderColor
    ? `border-l-4 border-l-${borderColor}`
    : ''

  const interactiveStyles = onClick
    ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'
    : ''

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${borderStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

// Varianten als benannte Exports
export function SkillCard({ icon, title, description, module, onClick }) {
  const moduleColors = {
    achtsamkeit: 'blue-500',
    stresstoleranz: 'orange-500',
    emotionsregulation: 'green-500',
    zwischenmenschlich: 'yellow-500',
  }

  return (
    <Card
      className={`border-l-4 border-l-${moduleColors[module] || 'gray-300'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </Card>
  )
}

export function ResultCard({ title, children, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    red: 'from-red-50 to-red-100 border-red-200',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 border animate-fade-in`}>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      {children}
    </div>
  )
}
