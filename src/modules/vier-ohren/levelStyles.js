/**
 * Farben der vier Ebenen (hell + dunkel), als vollständige Klassen
 * ausgeschrieben, damit Tailwind sie findet.
 */
export const levelStyles = {
  blue: {
    box: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    title: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    box: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    title: 'text-green-700 dark:text-green-300',
  },
  yellow: {
    box: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    title: 'text-yellow-700 dark:text-yellow-300',
  },
  red: {
    box: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    title: 'text-red-700 dark:text-red-300',
  },
}

export const surface =
  'bg-white dark:bg-dark-surface rounded-xl shadow-md dark:shadow-dark-soft border border-gray-100 dark:border-dark-border'
export const textMain = 'text-gray-800 dark:text-darkText-primary'
export const textSub = 'text-gray-500 dark:text-darkText-secondary'
export const fieldClass =
  'w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-elevated text-gray-800 dark:text-darkText-primary focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-colors duration-200'
