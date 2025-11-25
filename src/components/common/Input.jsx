/**
 * Reusable Input Components
 * Barrierefreie Eingabefelder
 */

export function TextInput({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  error = null,
  helpText = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full p-4 rounded-xl border
          ${error ? 'border-red-300' : 'border-gray-200'}
          focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
          disabled:bg-gray-50 disabled:text-gray-500
          transition-colors duration-200
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  )
}

export function TextArea({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  error = null,
  helpText = null,
  required = false,
  disabled = false,
  maxLength = null,
  className = '',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={`
          w-full p-4 rounded-xl border resize-none
          ${error ? 'border-red-300' : 'border-gray-200'}
          focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
          disabled:bg-gray-50 disabled:text-gray-500
          transition-colors duration-200
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />
      <div className="flex justify-between">
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-sm text-gray-500">
            {helpText}
          </p>
        )}
        {maxLength && (
          <p className="text-sm text-gray-400 ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Bitte wählen...',
  error = null,
  required = false,
  disabled = false,
  className = '',
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={`
          w-full p-4 rounded-xl border appearance-none
          ${error ? 'border-red-300' : 'border-gray-200'}
          focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
          disabled:bg-gray-50 disabled:text-gray-500
          transition-colors duration-200
          bg-white
        `}
        aria-invalid={error ? 'true' : 'false'}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
