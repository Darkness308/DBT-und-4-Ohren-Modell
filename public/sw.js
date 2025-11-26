/**
 * Service Worker für DBT Skills & Vier-Ohren-Modell PWA
 * Ermöglicht Offline-Nutzung und verbesserte Performance
 */

const CACHE_NAME = 'dbt-skills-v1'
const RUNTIME_CACHE = 'dbt-runtime-v1'

// Statische Assets zum Cachen beim Install
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json']

// Install Event - Cache statische Assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Skip waiting')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Cache failed:', error)
      })
  )
})

// Activate Event - Cleanup alte Caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => {
        console.log('[SW] Claiming clients')
        return self.clients.claim()
      })
  )
})

// Fetch Event - Network-first mit Cache-Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Nur same-origin Requests behandeln
  if (url.origin !== location.origin) {
    return
  }

  // HTML Requests - Network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache erfolgreiche Responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Offline: Versuche aus Cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Fallback zu index.html für SPA
            return caches.match('/index.html')
          })
        })
    )
    return
  }

  // Statische Assets (JS, CSS, Images) - Cache first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Update cache in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, networkResponse)
                })
              }
            })
            .catch(() => {})
          return cachedResponse
        }

        // Nicht im Cache - vom Netzwerk holen
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return networkResponse
        })
      })
    )
    return
  }

  // Alle anderen Requests - Network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})

// Background Sync für Offline-Daten
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)

  if (event.tag === 'sync-diary-data') {
    event.waitUntil(syncDiaryData())
  }
})

async function syncDiaryData() {
  // Placeholder für zukünftige Backend-Sync
  console.log('[SW] Syncing diary data...')
}

// Push Notifications (für zukünftige Erinnerungen)
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body || 'Zeit für deine tägliche Skill-Übung!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Öffnen' },
      { action: 'dismiss', title: 'Später' },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title || 'DBT Skills', options))
})

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Fokussiere existierendes Fenster oder öffne neues
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})

// Message Handler für App-Kommunikation
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }

  if (event.data.type === 'CACHE_URLS') {
    caches.open(RUNTIME_CACHE).then((cache) => {
      cache.addAll(event.data.urls)
    })
  }
})
