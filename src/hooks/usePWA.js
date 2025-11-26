/**
 * usePWA Hook - PWA Status und Funktionen für React
 */

import { useState, useEffect, useCallback } from 'react'
import {
  registerServiceWorker,
  setupInstallPrompt,
  promptInstall,
  isInstalled,
  onPWAEvent,
  activateUpdate,
  setupNetworkStatusHandler,
} from '../utils/pwa'

export function usePWA() {
  const [installed, setInstalled] = useState(isInstalled())
  const [installable, setInstallable] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    // Service Worker registrieren
    registerServiceWorker().then((reg) => {
      setRegistration(reg)
    })

    // Install Prompt Setup
    setupInstallPrompt()

    // Event Listeners
    const unsubInstallAvailable = onPWAEvent('installAvailable', () => {
      setInstallable(true)
    })

    const unsubInstalled = onPWAEvent('installed', () => {
      setInstalled(true)
      setInstallable(false)
    })

    const unsubUpdateAvailable = onPWAEvent('updateAvailable', ({ registration }) => {
      setUpdateAvailable(true)
      setRegistration(registration)
    })

    // Network Status
    const unsubNetwork = setupNetworkStatusHandler(setOnline)

    return () => {
      unsubInstallAvailable()
      unsubInstalled()
      unsubUpdateAvailable()
      unsubNetwork()
    }
  }, [])

  const install = useCallback(async () => {
    const success = await promptInstall()
    if (success) {
      setInstallable(false)
    }
    return success
  }, [])

  const update = useCallback(() => {
    if (registration) {
      activateUpdate(registration)
    }
  }, [registration])

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false)
  }, [])

  return {
    installed,
    installable,
    updateAvailable,
    online,
    install,
    update,
    dismissUpdate,
  }
}

export default usePWA
