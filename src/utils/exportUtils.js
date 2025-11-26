/**
 * Export Utilities
 * Unterstützt Export in JSON, CSV und PDF-kompatibles Format
 */

// JSON Export
export function exportToJSON(data, filename = 'dbt-export') {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, `${filename}-${getDateString()}.json`)
}

// CSV Export für Diary-Daten
export function exportToCSV(data, filename = 'dbt-diary') {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Header aus erstem Objekt extrahieren
  const headers = Object.keys(flattenObject(data[0]))
  const csvRows = [headers.join(';')]

  // Daten konvertieren
  for (const item of data) {
    const flat = flattenObject(item)
    const row = headers.map((header) => {
      const value = flat[header] ?? ''
      // Escape Semikolons und Zeilenumbrüche
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csvRows.push(row.join(';'))
  }

  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8',
  })
  downloadBlob(blob, `${filename}-${getDateString()}.csv`)
}

// Therapiebericht-Export (HTML/Print-Ready)
export function exportTherapyReport(data, options = {}) {
  const {
    patientName = 'Anonym',
    dateRange = getDateRange(data),
    includeSkills = true,
    includeDiary = true,
    includeAnalyses = true,
  } = options

  const html = generateReportHTML({
    patientName,
    dateRange,
    data,
    includeSkills,
    includeDiary,
    includeAnalyses,
  })

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  downloadBlob(blob, `therapie-bericht-${getDateString()}.html`)
}

// Vollständiges Backup aller Daten
export function exportFullBackup(appState) {
  const backup = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    app: 'DBT Skills & Vier-Ohren-Modell',
    data: appState,
  }
  exportToJSON(backup, 'dbt-backup')
}

// Import von Backup
export async function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)

        // Validierung
        if (!data.version || !data.data) {
          throw new Error('Ungültiges Backup-Format')
        }

        resolve(data)
      } catch (error) {
        reject(new Error('Backup konnte nicht gelesen werden: ' + error.message))
      }
    }

    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'))
    reader.readAsText(file)
  })
}

// Helper: Blob Download
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Helper: Datums-String
function getDateString() {
  return new Date().toISOString().split('T')[0]
}

// Helper: Objekt flachen
function flattenObject(obj, prefix = '') {
  const result = {}

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenObject(value, newKey))
    } else if (Array.isArray(value)) {
      result[newKey] = value.join(', ')
    } else {
      result[newKey] = value
    }
  }

  return result
}

// Helper: Datumsbereich aus Daten ermitteln
function getDateRange(data) {
  const dates = []

  const extractDates = (obj) => {
    if (!obj) return
    if (obj.timestamp) dates.push(new Date(obj.timestamp))
    if (obj.date) dates.push(new Date(obj.date))
    if (Array.isArray(obj)) obj.forEach(extractDates)
    else if (typeof obj === 'object') Object.values(obj).forEach(extractDates)
  }

  extractDates(data)

  if (dates.length === 0) {
    return { start: new Date(), end: new Date() }
  }

  dates.sort((a, b) => a - b)
  return { start: dates[0], end: dates[dates.length - 1] }
}

// Helper: HTML Report generieren
function generateReportHTML({
  patientName,
  dateRange,
  data,
  includeSkills,
  includeDiary,
  includeAnalyses,
}) {
  const formatDate = (date) =>
    date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Therapiebericht - ${patientName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { font-size: 24px; color: #667eea; margin-bottom: 8px; }
    h2 { font-size: 18px; color: #374151; margin: 32px 0 16px; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; }
    h3 { font-size: 14px; color: #6b7280; margin: 16px 0 8px; }
    .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
    .section { margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 8px 12px; text-align: left; border: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-weight: 600; }
    .stat { display: inline-block; padding: 8px 16px; background: #e0e7ff; border-radius: 8px; margin: 4px; }
    .stat-value { font-size: 24px; font-weight: 700; color: #667eea; }
    .stat-label { font-size: 12px; color: #6b7280; }
    .skill-tag { display: inline-block; padding: 2px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 12px; margin: 2px; }
    @media print {
      body { padding: 20px; }
      h2 { break-before: page; }
    }
  </style>
</head>
<body>
  <h1>Therapiebericht</h1>
  <p class="meta">
    Patient: ${patientName}<br>
    Zeitraum: ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}<br>
    Erstellt: ${formatDate(new Date())}
  </p>

  ${
    includeSkills && data.skillHistory?.length > 0
      ? `
  <h2>Verwendete Skills</h2>
  <div class="section">
    <p>Insgesamt <strong>${data.skillHistory.length}</strong> Skill-Anwendungen dokumentiert.</p>
    <div style="margin-top: 16px;">
      ${getSkillStats(data.skillHistory)}
    </div>
    <table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Skill</th>
          <th>Effektivität</th>
        </tr>
      </thead>
      <tbody>
        ${data.skillHistory
          .slice(0, 20)
          .map(
            (s) => `
          <tr>
            <td>${new Date(s.timestamp).toLocaleDateString('de-DE')}</td>
            <td>${s.skillName || s.skillId}</td>
            <td>${s.effectiveness ? `${Math.round(s.effectiveness * 100)}%` : '-'}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    ${data.skillHistory.length > 20 ? `<p style="color: #6b7280; font-size: 12px;">... und ${data.skillHistory.length - 20} weitere Einträge</p>` : ''}
  </div>
  `
      : ''
  }

  ${
    includeDiary && data.diaryData?.length > 0
      ? `
  <h2>Diary Card Einträge</h2>
  <div class="section">
    <p>Insgesamt <strong>${data.diaryData.length}</strong> Einträge.</p>
    <table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Stimmung</th>
          <th>Notizen</th>
        </tr>
      </thead>
      <tbody>
        ${data.diaryData
          .slice(0, 20)
          .map(
            (d) => `
          <tr>
            <td>${new Date(d.date || d.timestamp).toLocaleDateString('de-DE')}</td>
            <td>${d.mood ?? '-'}/5</td>
            <td>${d.notes || '-'}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  ${
    includeAnalyses && data.chainAnalyses?.length > 0
      ? `
  <h2>Verhaltensanalysen</h2>
  <div class="section">
    <p>Insgesamt <strong>${data.chainAnalyses.length}</strong> Chain Analyses dokumentiert.</p>
  </div>
  `
      : ''
  }

  <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
    Generiert mit DBT Skills & Vier-Ohren-Modell App
  </div>
</body>
</html>`
}

function getSkillStats(skillHistory) {
  const counts = {}
  skillHistory.forEach((s) => {
    const name = s.skillName || s.skillId
    counts[name] = (counts[name] || 0) + 1
  })

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return sorted.map(([name, count]) => `<span class="skill-tag">${name}: ${count}x</span>`).join('')
}
