/**
 * VierOhrenAnalyzer - Hauptkomponente
 * Kombiniert Eingabe und Ergebnis-Anzeige
 */

import { useState } from 'react'
import AnalyzerForm from './AnalyzerForm'
import ResultDisplay from './ResultDisplay'
import ExampleSelector from './ExampleSelector'
import { vierOhrenAnalyzer } from './VierOhrenAnalyzerAgent'

export default function VierOhrenAnalyzer() {
  const [statement, setStatement] = useState('')
  const [context, setContext] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showExamples, setShowExamples] = useState(true)

  const handleAnalyze = () => {
    if (!statement.trim()) return

    setIsAnalyzing(true)

    // Kurze Verzögerung für UX
    setTimeout(() => {
      const result = vierOhrenAnalyzer.analyzeStatement({
        statement,
        context,
        perspective: 'receiver',
      })

      setAnalysis(result)
      setIsAnalyzing(false)
      setShowExamples(false)
    }, 500)
  }

  const handleExampleSelect = (example) => {
    setStatement(example.statement)
    setContext(example.context)
    setShowExamples(false)
  }

  const handleReset = () => {
    setStatement('')
    setContext('')
    setAnalysis(null)
    setShowExamples(true)
  }

  return (
    <div className="space-y-6">
      {/* Einführung */}
      <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">👂</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vier-Ohren-Modell</h2>
            <p className="text-gray-500">Nach Schulz von Thun</p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Jede Nachricht hat vier Seiten: <strong>Sachinhalt</strong>,{' '}
          <strong>Selbstoffenbarung</strong>, <strong>Beziehung</strong> und <strong>Appell</strong>
          . Analysiere Aussagen, um Missverständnisse zu erkennen und besser zu kommunizieren.
        </p>
      </div>

      {/* Beispiele oder Eingabe */}
      {showExamples && !analysis ? (
        <ExampleSelector onSelect={handleExampleSelect} onSkip={() => setShowExamples(false)} />
      ) : (
        <AnalyzerForm
          statement={statement}
          setStatement={setStatement}
          context={context}
          setContext={setContext}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          isAnalyzing={isAnalyzing}
          hasAnalysis={!!analysis}
        />
      )}

      {/* Ergebnis */}
      {analysis && analysis.success && <ResultDisplay analysis={analysis} />}

      {/* Fehler */}
      {analysis && !analysis.success && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {analysis.error}
        </div>
      )}
    </div>
  )
}
