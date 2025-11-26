/**
 * PWAManager - Zentrale Komponente für PWA-Features
 */

import { useState, useEffect } from 'react'
import { usePWA } from '../../hooks/usePWA'
import InstallBanner from './InstallBanner'
import UpdateBanner from './UpdateBanner'
import OfflineIndicator from './OfflineIndicator'

export default function PWAManager() {
  const { installed, installable, updateAvailable, online, install, update, dismissUpdate } =
    usePWA()
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [installDismissed, setInstallDismissed] = useState(false)

  // Install Banner nach kurzer Verzögerung anzeigen
  useEffect(() => {
    if (installable && !installed && !installDismissed) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true)
      }, 5000) // 5 Sekunden nach Ladevorgang

      return () => clearTimeout(timer)
    }
  }, [installable, installed, installDismissed])

  const handleInstallDismiss = () => {
    setShowInstallBanner(false)
    setInstallDismissed(true)
    // Speichere Dismiss-Status für Session
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setShowInstallBanner(false)
    }
  }

  // Lade Dismiss-Status beim Mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      setInstallDismissed(true)
    }
  }, [])

  return (
    <>
      {/* Offline Indicator */}
      {!online && <OfflineIndicator />}

      {/* Update Banner */}
      {updateAvailable && <UpdateBanner onUpdate={update} onDismiss={dismissUpdate} />}

      {/* Install Banner */}
      {showInstallBanner && !updateAvailable && (
        <InstallBanner onInstall={handleInstall} onDismiss={handleInstallDismiss} />
      )}
    </>
  )
}
