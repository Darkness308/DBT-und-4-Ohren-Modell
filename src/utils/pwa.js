/**
 * PWA Utilities
 * Service Worker Registration, Install Prompt, Update Handler
 */

// Service Worker Registration
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('[PWA] Service Worker registered:', registration.scope)

    // Update Handler
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Neue Version verfügbar
          dispatchPWAEvent('updateAvailable', { registration })
        }
      })
    })

    return registration
  } catch (error) {
    console.error('[PWA] Registration failed:', error)
    return null
  }
}

// Update aktivieren
export function activateUpdate(registration) {
  if (registration?.waiting) {
    registration.waiting.postMessage('skipWaiting')
    // Zeige eine Bestätigungsabfrage, um Datenverlust zu vermeiden
    if (window.confirm('Eine neue Version ist verfügbar. Ungespeicherte Daten könnten verloren gehen. Möchtest du die Seite neu laden?')) {
      window.location.reload()
    }
  }
}

// Install Prompt Handler
let deferredPrompt = null

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Verhindere automatischen Browser-Prompt
    event.preventDefault()
    deferredPrompt = event

    // Informiere App über Installationsmöglichkeit
    dispatchPWAEvent('installAvailable')

    console.log('[PWA] Install prompt available')
  })

  // Installation abgeschlossen
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    dispatchPWAEvent('installed')
    console.log('[PWA] App installed')
  })
}

// Installation triggern
export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available')
    return false
  }

  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    console.log('[PWA] Install prompt outcome:', outcome)

    deferredPrompt = null
    return outcome === 'accepted'
  } catch (error) {
    console.error('[PWA] Install prompt error:', error)
    return false
  }
}

// Prüfen ob App installiert ist
export function isInstalled() {
  // Standalone Mode (installierte PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }

  // iOS Safari
  if (window.navigator.standalone === true) {
    return true
  }

  return false
}

// Prüfen ob Installation möglich ist
export function canInstall() {
  return deferredPrompt !== null
}

// Online/Offline Status
export function setupNetworkStatusHandler(callback) {
  const updateStatus = () => {
    callback(navigator.onLine)
  }

  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)

  // Initial status
  updateStatus()

  return () => {
    window.removeEventListener('online', updateStatus)
    window.removeEventListener('offline', updateStatus)
  }
}

// Custom Event Dispatcher
function dispatchPWAEvent(type, detail = {}) {
  window.dispatchEvent(new CustomEvent(`pwa:${type}`, { detail }))
}

// Event Listener Helper
export function onPWAEvent(type, callback) {
  const handler = (event) => callback(event.detail)
  window.addEventListener(`pwa:${type}`, handler)
  return () => window.removeEventListener(`pwa:${type}`, handler)
}

// Cache Management
export async function getCacheSize() {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return null
  }

  try {
    const estimate = await navigator.storage.estimate()
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      usagePercent: estimate.quota ? (estimate.usage / estimate.quota) * 100 : 0,
    }
  } catch (error) {
    console.error('[PWA] Storage estimate error:', error)
    return null
  }
}

// Clear Cache
export async function clearCache() {
  if (!('caches' in window)) {
    return false
  }

  try {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))
    console.log('[PWA] Cache cleared')
    return true
  } catch (error) {
    console.error('[PWA] Clear cache error:', error)
    return false
  }
}
