/**
 * ThemeContext - Therapeutisches Theme Management
 *
 * Wissenschaftliche Grundlage:
 * - Dark Mode reduziert mentale Ermüdung (Spengler et al., 2015)
 * - Sanfte Hintergründe (nicht #000) sind weniger belastend für das visuelle System
 * - Automatische Theme-Erkennung respektiert Nutzer-Präferenzen
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

// Verfügbare Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// Modul-Farben für konsistente Navigation
export const MODULE_COLORS = {
  home: {
    light: 'bg-calm-500',
    dark: 'bg-calm-600',
    text: 'text-calm-500',
    border: 'border-calm-500',
    glow: 'shadow-glow-calm',
  },
  'vier-ohren': {
    light: 'bg-lavender-500',
    dark: 'bg-lavender-600',
    text: 'text-lavender-500',
    border: 'border-lavender-500',
  },
  skills: {
    light: 'bg-success-500',
    dark: 'bg-success-600',
    text: 'text-success-500',
    border: 'border-success-500',
    glow: 'shadow-glow-success',
  },
  diary: {
    light: 'bg-warning-500',
    dark: 'bg-warning-600',
    text: 'text-warning-500',
    border: 'border-warning-500',
  },
  settings: {
    light: 'bg-gray-500',
    dark: 'bg-gray-600',
    text: 'text-gray-500',
    border: 'border-gray-500',
  },
}

export function ThemeProvider({ children }) {
  // Initialer Theme-State aus localStorage oder System-Präferenz
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return THEMES.SYSTEM

    const saved = localStorage.getItem('dbt-theme')
    if (saved && Object.values(THEMES).includes(saved)) {
      return saved
    }
    return THEMES.SYSTEM
  })

  // Effektiver Theme-Wert (resolved von 'system')
  const [resolvedTheme, setResolvedTheme] = useState('light')

  // System-Präferenz überwachen
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateResolvedTheme = () => {
      if (theme === THEMES.SYSTEM) {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()
    mediaQuery.addEventListener('change', updateResolvedTheme)

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  // Dark-Class auf HTML-Element setzen
  useEffect(() => {
    const root = document.documentElement

    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Meta Theme-Color für Mobile Browser aktualisieren
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', resolvedTheme === 'dark' ? '#0f1419' : '#667eea')
    }
  }, [resolvedTheme])

  // Theme setzen und speichern
  const setTheme = useCallback((newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) {
      console.warn('Invalid theme:', newTheme)
      return
    }

    setThemeState(newTheme)
    localStorage.setItem('dbt-theme', newTheme)
  }, [])

  // Theme umschalten (für Quick Toggle)
  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? THEMES.LIGHT : THEMES.DARK
    setTheme(next)
  }, [resolvedTheme, setTheme])

  // Prüfen ob aktuell Dark Mode aktiv ist
  const isDark = resolvedTheme === 'dark'

  // Hilfsfunktion für bedingte Klassen
  const themeClass = useCallback(
    (lightClass, darkClass) => {
      return isDark ? darkClass : lightClass
    },
    [isDark]
  )

  // Modul-spezifische Farbe abrufen
  const getModuleColor = useCallback(
    (moduleId, type = 'light') => {
      const colors = MODULE_COLORS[moduleId] || MODULE_COLORS.home
      if (type === 'bg') {
        return isDark ? colors.dark : colors.light
      }
      return colors[type] || colors.text
    },
    [isDark]
  )

  const value = {
    theme, // Gespeicherter Theme-Wert (light/dark/system)
    resolvedTheme, // Tatsächlich aktiver Theme-Wert (light/dark)
    isDark,
    setTheme,
    toggleTheme,
    themeClass,
    getModuleColor,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
