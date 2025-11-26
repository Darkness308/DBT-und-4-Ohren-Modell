/**
 * DataManagement - Daten-Export und Backup-Verwaltung
 */

import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../App'
import {
  exportToCSV,
  exportTherapyReport,
  exportFullBackup,
  importBackup,
} from '../../utils/exportUtils'
import {
  loadBackups,
  loadBackup,
  deleteBackup,
  getBackupStats,
  formatBytes,
} from '../../utils/backup'

export default function DataManagement() {
  const { state, dispatch } = useApp()
  const [backups, setBackups] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadBackupData()
  }, [])

  const loadBackupData = async () => {
    setLoading(true)
    try {
      const [backupList, backupStats] = await Promise.all([loadBackups(), getBackupStats()])
      setBackups(backupList)
      setStats(backupStats)
    } catch (error) {
      console.error('Failed to load backups:', error)
    }
    setLoading(false)
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExportJSON = () => {
    exportFullBackup(state)
    showMessage('Backup als JSON exportiert')
  }

  const handleExportCSV = () => {
    if (state.diaryData?.length > 0) {
      exportToCSV(state.diaryData, 'diary-daten')
      showMessage('Diary-Daten als CSV exportiert')
    } else if (state.skillHistory?.length > 0) {
      exportToCSV(state.skillHistory, 'skill-history')
      showMessage('Skill-Verlauf als CSV exportiert')
    } else {
      showMessage('Keine Daten zum Exportieren', 'warning')
    }
  }

  const handleExportReport = () => {
    exportTherapyReport(state, {
      includeSkills: true,
      includeDiary: true,
      includeAnalyses: true,
    })
    showMessage('Therapiebericht erstellt')
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const backup = await importBackup(file)
      dispatch({ type: 'LOAD_STATE', payload: backup.data })
      showMessage('Backup erfolgreich importiert')
    } catch (error) {
      showMessage(error.message, 'error')
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRestoreBackup = async (id) => {
    try {
      const backup = await loadBackup(id)
      if (backup?.data) {
        dispatch({ type: 'LOAD_STATE', payload: backup.data })
        showMessage('Backup wiederhergestellt')
      }
    } catch (error) {
      showMessage('Wiederherstellung fehlgeschlagen', 'error')
    }
  }

  const handleDeleteBackup = async (id) => {
    try {
      await deleteBackup(id)
      await loadBackupData()
      showMessage('Backup gelöscht')
    } catch (error) {
      showMessage('Löschen fehlgeschlagen', 'error')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-4 left-4 right-4 max-w-md mx-auto p-4 rounded-xl shadow-lg z-50 animate-fade-in ${
            message.type === 'error'
              ? 'bg-red-100 text-red-700'
              : message.type === 'warning'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📤</span> Daten exportieren
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 p-3 bg-calm-50 text-calm-700 rounded-lg hover:bg-calm-100 transition-colors"
          >
            <span>📁</span>
            <span className="text-sm font-medium">Vollständiges Backup (JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span>📊</span>
            <span className="text-sm font-medium">Tabelle (CSV)</span>
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span>📋</span>
            <span className="text-sm font-medium">Therapiebericht (HTML)</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📥</span> Daten importieren
        </h3>

        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="backup-import"
          />
          <label
            htmlFor="backup-import"
            className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-calm-400 hover:bg-calm-50 transition-colors cursor-pointer"
          >
            <span className="text-2xl">📂</span>
            <span className="text-gray-600">JSON-Backup auswählen</span>
          </label>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Hinweis: Der Import ersetzt alle aktuellen Daten. Erstelle vorher ein Backup!
        </p>
      </div>

      {/* Auto-Backup Stats */}
      {stats && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>💾</span> Automatische Backups
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-calm-600">{stats.count}</p>
              <p className="text-xs text-gray-500">Backups</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-calm-600">{formatBytes(stats.totalSize)}</p>
              <p className="text-xs text-gray-500">Speicher</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                {stats.newestBackup ? formatDate(stats.newestBackup) : '-'}
              </p>
              <p className="text-xs text-gray-500">Letztes Backup</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                {stats.oldestBackup ? formatDate(stats.oldestBackup) : '-'}
              </p>
              <p className="text-xs text-gray-500">Ältestes Backup</p>
            </div>
          </div>

          {/* Backup List */}
          {loading ? (
            <p className="text-gray-500 text-center py-4">Lädt...</p>
          ) : backups.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(backup.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500">{formatBytes(backup.size || 0)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreBackup(backup.id)}
                      className="px-3 py-1 text-xs bg-calm-100 text-calm-700 rounded hover:bg-calm-200 transition-colors"
                    >
                      Wiederherstellen
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Noch keine automatischen Backups vorhanden
            </p>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-700 text-sm">
          <span className="font-medium">Automatische Sicherung:</span> Deine Daten werden alle 24
          Stunden automatisch gesichert. Die letzten 10 Backups werden aufbewahrt.
        </p>
      </div>
    </div>
  )
}
