/**
 * Auto-Backup Manager
 * Automatische Sicherung der Daten in IndexedDB und Download-Erinnerungen
 */

const DB_NAME = 'dbt-backups'
const DB_VERSION = 1
const STORE_NAME = 'backups'
const MAX_BACKUPS = 10
const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 Stunden

let db = null

// IndexedDB initialisieren
async function initDB() {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

// Backup erstellen
export async function createBackup(appState) {
  const database = await initDB()

  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: appState,
    size: new Blob([JSON.stringify(appState)]).size,
  }

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.add(backup)

    request.onsuccess = () => {
      // Alte Backups aufräumen
      cleanupOldBackups().catch(console.error)
      resolve(request.result)
    }

    request.onerror = () => reject(request.error)
  })
}

// Alle Backups laden
export async function loadBackups() {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('timestamp')

    const request = index.getAll()

    request.onsuccess = () => {
      // Neueste zuerst
      const backups = request.result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      resolve(backups)
    }

    request.onerror = () => reject(request.error)
  })
}

// Einzelnes Backup laden
export async function loadBackup(id) {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Backup löschen
export async function deleteBackup(id) {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Alte Backups aufräumen (behalte nur MAX_BACKUPS)
async function cleanupOldBackups() {
  const backups = await loadBackups()

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS)
    await Promise.all(toDelete.map((b) => deleteBackup(b.id)))
  }
}

// Auto-Backup Manager
export class AutoBackupManager {
  constructor(getState) {
    this.getState = getState
    this.lastBackup = null
    this.intervalId = null
  }

  start() {
    // Initial backup check
    this.checkAndBackup()

    // Periodic backup
    this.intervalId = setInterval(
      () => {
        this.checkAndBackup()
      },
      60 * 60 * 1000
    ) // Stündlich prüfen

    // Backup bei Sichtbarkeitsänderung
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.checkAndBackup()
      }
    })

    // Backup vor dem Schließen
    window.addEventListener('beforeunload', () => {
      this.checkAndBackup()
    })
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  async checkAndBackup() {
    try {
      const lastBackupTime = localStorage.getItem('dbt-last-backup')
      const now = Date.now()

      // Backup wenn kein letztes Backup oder älter als Intervall
      if (!lastBackupTime || now - parseInt(lastBackupTime) > BACKUP_INTERVAL_MS) {
        const state = this.getState()

        // Nur backup wenn Daten vorhanden
        if (this.hasData(state)) {
          await createBackup(state)
          localStorage.setItem('dbt-last-backup', now.toString())
          this.lastBackup = new Date()
          console.log('[Backup] Auto-backup created')
        }
      }
    } catch (error) {
      console.error('[Backup] Auto-backup failed:', error)
    }
  }

  hasData(state) {
    return (
      state.diaryData?.length > 0 ||
      state.chainAnalyses?.length > 0 ||
      state.skillHistory?.length > 0
    )
  }

  getLastBackupTime() {
    const timestamp = localStorage.getItem('dbt-last-backup')
    return timestamp ? new Date(parseInt(timestamp)) : null
  }
}

// Backup-Statistiken
export async function getBackupStats() {
  const backups = await loadBackups()

  if (backups.length === 0) {
    return {
      count: 0,
      totalSize: 0,
      oldestBackup: null,
      newestBackup: null,
    }
  }

  return {
    count: backups.length,
    totalSize: backups.reduce((sum, b) => sum + (b.size || 0), 0),
    oldestBackup: new Date(backups[backups.length - 1].timestamp),
    newestBackup: new Date(backups[0].timestamp),
  }
}

// Formatierung
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
