/**
 * Reusable Button Component
 * Therapeutisch angepasste Buttons
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon = null,
  ...props
}) {
  const baseStyles = `
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-indigo-500 to-purple-500 text-white
      hover:shadow-lg hover:-translate-y-0.5
      focus:ring-purple-400
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200
      focus:ring-gray-400
    `,
    calm: `
      bg-blue-50 text-blue-700 border border-blue-200
      hover:bg-blue-100
      focus:ring-blue-400
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 text-white
      hover:shadow-lg hover:-translate-y-0.5
      focus:ring-green-400
    `,
    danger: `
      bg-red-50 text-red-700 border border-red-200
      hover:bg-red-100
      focus:ring-red-400
    `,
    ghost: `
      text-gray-600
      hover:bg-gray-100
      focus:ring-gray-400
    `,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}

// Icon-only Button
export function IconButton({ icon, label, onClick, variant: _variant = 'ghost', size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${sizes[size]} rounded-full
        flex items-center justify-center
        transition-all duration-200
        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-calm-500
      `}
      aria-label={label}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
