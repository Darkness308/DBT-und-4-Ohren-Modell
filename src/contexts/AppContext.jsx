import { createContext, useContext } from 'react'

/**
 * AppContext - Globaler App-State und Navigation
 *
 * Ausgelagert aus App.jsx um zirkuläre Abhängigkeiten zu vermeiden
 */
export const AppContext = createContext(null)

/**
 * Hook für Zugriff auf App-State und Navigation
 */
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppContext.Provider')
  }
  return context
}

export default AppContext
