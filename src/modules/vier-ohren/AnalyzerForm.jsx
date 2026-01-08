/**
 * AnalyzerForm - Eingabeformular für Aussagen
 */

import { TextArea } from '../../components/common/Input'
import Button from '../../components/common/Button'

export default function AnalyzerForm({
  statement,
  setStatement,
  context,
  setContext,
  onAnalyze,
  onReset,
  isAnalyzing,
  hasAnalysis,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onAnalyze()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 space-y-4 animate-fade-in"
    >
      <TextArea
        label="Aussage zum Analysieren"
        id="statement"
        value={statement}
        onChange={setStatement}
        placeholder='z.B. "Die Ampel ist grün."'
        rows={3}
        required
        helpText="Gib eine Aussage ein, die du nach dem Vier-Ohren-Modell analysieren möchtest."
      />

      <TextArea
        label="Kontext (optional)"
        id="context"
        value={context}
        onChange={setContext}
        placeholder="z.B. Partner sagt das während der Autofahrt"
        rows={2}
        helpText="Der Kontext hilft bei einer genaueren Analyse."
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          loading={isAnalyzing}
          disabled={!statement.trim()}
          icon="🔍"
        >
          {isAnalyzing ? 'Analysiere...' : 'Analysieren'}
        </Button>

        {hasAnalysis && (
          <Button type="button" variant="secondary" onClick={onReset} icon="🔄">
            Neue Analyse
          </Button>
        )}
      </div>
    </form>
  )
}
