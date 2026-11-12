/**
 * Export-Datei weitergeben: Teilen-Dialog des Geräts (Android), sonst Download.
 * @returns {Promise<'shared'|'downloaded'|'cancelled'>}
 */
export async function shareOrDownloadJson(data, filename) {
  const text = JSON.stringify(data, null, 2)

  try {
    const file = new File([text], filename, { type: 'application/json' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Vier-Ohren-Analyse' })
      return 'shared'
    }
  } catch (error) {
    if (error?.name === 'AbortError') return 'cancelled'
    // Teilen nicht möglich: weiter mit Download
  }

  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return 'downloaded'
}

export function exportFilename(name, now = new Date()) {
  const safeName = (name || 'export').toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '-')
  return `vier-ohren-${safeName}-${now.toISOString().slice(0, 10)}.json`
}
