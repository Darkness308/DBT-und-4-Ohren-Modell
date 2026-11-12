/**
 * SharePanel - Austausch zwischen zwei Geräten per Datei
 */

import { useRef } from 'react'
import Button from '../../components/common/Button'
import { surface, textMain, textSub } from './levelStyles'

export default function SharePanel({ entryCount, onExportAll, onImportFile, message }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onImportFile(file)
    e.target.value = ''
  }

  return (
    <section className={`${surface} p-5 space-y-3`}>
      <div>
        <h3 className={`font-semibold ${textMain}`}>Austausch</h3>
        <p className={`text-sm mt-1 ${textSub}`}>
          Die Einträge liegen nur auf diesem Gerät. Zum Vergleichen: Datei exportieren, der anderen
          Person schicken, dort importieren. Importieren führt zusammen und überschreibt nichts
          Neueres.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="calm" onClick={onExportAll} disabled={entryCount === 0} icon="📤">
          Alles exportieren
        </Button>
        <Button variant="secondary" onClick={() => inputRef.current?.click()} icon="📥">
          Datei importieren
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="sr-only"
          aria-label="Vier-Ohren-Export importieren"
        />
      </div>
      <p role="status" aria-live="polite" className={`text-sm min-h-[1.25rem] ${textMain}`}>
        {message}
      </p>
    </section>
  )
}
