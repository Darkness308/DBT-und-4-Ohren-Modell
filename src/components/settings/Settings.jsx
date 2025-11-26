/**
 * Settings - Zentrale Einstellungsseite
 *
 * Kombiniert:
 * - Theme-Auswahl (Dark Mode)
 * - Daten-Management (Export/Backup)
 */

import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import DataManagement from './DataManagement'

export default function Settings() {
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('design')

  const tabs = [
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'data', label: 'Daten', icon: '💾' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div
        className={`rounded-xl p-1 flex gap-1 ${isDark ? 'bg-dark-surface' : 'bg-white shadow-soft'}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
              transition-all duration-200 font-medium text-sm
              ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-calm-600 text-white'
                    : 'bg-calm-500 text-white shadow-md'
                  : isDark
                    ? 'text-darkText-secondary hover:bg-dark-hover'
                    : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={`rounded-xl p-6 ${isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'}`}
      >
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
              >
                <span>🌗</span> Erscheinungsbild
              </h3>
              <ThemeToggle />
            </div>

            {/* Additional Design Settings */}
            <div className={`pt-6 border-t ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
              >
                <span>🔤</span> Schriftgröße
              </h3>
              <FontSizeSelector />
            </div>

            {/* Reduced Motion Setting */}
            <div className={`pt-6 border-t ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
              >
                <span>✨</span> Animationen
              </h3>
              <ReducedMotionToggle />
            </div>
          </div>
        )}

        {activeTab === 'data' && <DataManagement />}
      </div>

      {/* Color Palette Preview (Design Tab) */}
      {activeTab === 'design' && (
        <div
          className={`rounded-xl p-6 ${isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'}`}
        >
          <h3
            className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
          >
            <span>🎨</span> Therapeutische Farbpalette
          </h3>
          <ColorPalettePreview />
        </div>
      )}
    </div>
  )
}

// Font Size Selector
function FontSizeSelector() {
  const { isDark } = useTheme()
  const [fontSize, setFontSize] = useState('normal')

  const sizes = [
    { id: 'small', label: 'Klein', size: '14px' },
    { id: 'normal', label: 'Normal', size: '16px' },
    { id: 'large', label: 'Groß', size: '18px' },
  ]

  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <button
          key={size.id}
          onClick={() => setFontSize(size.id)}
          className={`
            flex-1 py-2 px-3 rounded-lg transition-all text-sm
            ${
              fontSize === size.id
                ? isDark
                  ? 'bg-calm-600 text-white'
                  : 'bg-calm-100 text-calm-700 ring-2 ring-calm-500'
                : isDark
                  ? 'bg-dark-elevated text-darkText-secondary hover:bg-dark-hover'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          style={{ fontSize: size.size }}
        >
          {size.label}
        </button>
      ))}
    </div>
  )
}

// Reduced Motion Toggle
function ReducedMotionToggle() {
  const { isDark } = useTheme()
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={`font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}>
          Reduzierte Bewegung
        </p>
        <p className={`text-sm ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
          Animationen minimieren für besseren Fokus
        </p>
      </div>
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${reducedMotion ? (isDark ? 'bg-calm-600' : 'bg-calm-500') : isDark ? 'bg-dark-border' : 'bg-gray-300'}
        `}
        role="switch"
        aria-checked={reducedMotion}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
            transition-transform duration-200
            ${reducedMotion ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  )
}

// Color Palette Preview
function ColorPalettePreview() {
  const { isDark } = useTheme()

  const colors = [
    {
      name: 'Beruhigendes Blau',
      color: '#667eea',
      description: 'Aktiviert Parasympathikus',
    },
    {
      name: 'Sanftes Grün',
      color: '#22c55e',
      description: 'Verbessert Arbeitsgedächtnis',
    },
    {
      name: 'Lavendel',
      color: '#a855f7',
      description: 'Senkt Cortisol',
    },
    {
      name: 'Warmes Orange',
      color: '#f59e0b',
      description: 'Sanfte Aufmerksamkeit',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {colors.map((color) => (
        <div
          key={color.name}
          className={`p-3 rounded-lg ${isDark ? 'bg-dark-elevated' : 'bg-gray-50'}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg shadow-inner"
              style={{ backgroundColor: color.color }}
            />
            <div>
              <p
                className={`text-sm font-medium ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
              >
                {color.name}
              </p>
              <p className={`text-xs ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
                {color.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
