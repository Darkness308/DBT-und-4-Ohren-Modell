/**
 * LocalStorage Wrapper mit Error-Handling
 */

const STORAGE_PREFIX = 'dbt-app-'

/**
 * Daten im LocalStorage speichern
 * @param {string} key - Schlüssel
 * @param {any} value - Wert (wird JSON-serialisiert)
 */
export function saveToStorage(key, value) {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(STORAGE_PREFIX + key, serialized)
    return true
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    return false
  }
}

/**
 * Daten aus LocalStorage laden
 * @param {string} key - Schlüssel
 * @param {any} defaultValue - Standardwert falls nicht vorhanden
 * @returns {any} - Geladene Daten oder Standardwert
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const serialized = localStorage.getItem(STORAGE_PREFIX + key)
    if (serialized === null) {
      return defaultValue
    }
    return JSON.parse(serialized)
  } catch (error) {
    console.error('Fehler beim Laden:', error)
    return defaultValue
  }
}

/**
 * Daten aus LocalStorage entfernen
 * @param {string} key - Schlüssel
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
    return true
  } catch (error) {
    console.error('Fehler beim Entfernen:', error)
    return false
  }
}

/**
 * Alle App-Daten exportieren
 * @returns {object} - Alle gespeicherten Daten
 */
export function exportAllData() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const cleanKey = key.replace(STORAGE_PREFIX, '')
      data[cleanKey] = loadFromStorage(cleanKey)
    }
  }
  return data
}

/**
 * Alle App-Daten löschen
 */
export function clearAllData() {
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}
