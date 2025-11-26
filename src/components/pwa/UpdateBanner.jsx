/**
 * UpdateBanner - Banner für verfügbare Updates
 */

export default function UpdateBanner({ onUpdate, onDismiss }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-calm-600 text-white py-2 px-4 z-50 animate-fade-in">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔄</span>
          <p className="text-sm">Eine neue Version ist verfügbar!</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDismiss}
            className="px-3 py-1 text-sm text-white/80 hover:text-white transition-colors"
          >
            Später
          </button>
          <button
            onClick={onUpdate}
            className="px-3 py-1 text-sm bg-white text-calm-600 rounded-lg hover:bg-calm-50 transition-colors font-medium"
          >
            Jetzt aktualisieren
          </button>
        </div>
      </div>
    </div>
  )
}
