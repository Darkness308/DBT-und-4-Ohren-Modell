/**
 * InstallBanner - Banner für PWA Installation
 */

import { useState } from 'react'

export default function InstallBanner({ onInstall, onDismiss }) {
  const [installing, setInstalling] = useState(false)

  const handleInstall = async () => {
    setInstalling(true)
    try {
      await onInstall()
    } finally {
      setInstalling(false)
    }
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-calm-200 p-4 animate-fade-in z-50">
      <div className="flex items-start gap-3">
        <div className="bg-calm-100 rounded-lg p-2 flex-shrink-0">
          <span className="text-2xl">📱</span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm">App installieren</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Installiere die App für Offline-Zugriff und schnelleren Start
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Schließen"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={onDismiss}
          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Später
        </button>
        <button
          onClick={handleInstall}
          disabled={installing}
          className="flex-1 px-3 py-2 text-sm bg-calm-500 text-white rounded-lg hover:bg-calm-600 transition-colors disabled:opacity-50"
        >
          {installing ? 'Wird installiert...' : 'Installieren'}
        </button>
      </div>
    </div>
  )
}
