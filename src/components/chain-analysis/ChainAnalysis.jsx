/**
 * ChainAnalysis - Hauptkomponente für Verhaltenskettenanalyse
 */

import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useApp } from '../../App'
import chainAnalysisAgent from '../../agents/ChainAnalysisAgent'
import ChainBuilder from './ChainBuilder'
import ChainList from './ChainList'
import ChainPatterns from './ChainPatterns'

export default function ChainAnalysis() {
  const { isDark } = useTheme()
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState('new')
  const [currentChain, setCurrentChain] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [editingChainId, setEditingChainId] = useState(null)

  // Chains aus State laden
  useEffect(() => {
    chainAnalysisAgent.loadChains(state.chainAnalyses || [])
  }, [state.chainAnalyses])

  const saveToState = () => {
    dispatch({
      type: 'LOAD_STATE',
      payload: { chainAnalyses: chainAnalysisAgent.getAllChains() },
    })
  }

  const startNewChain = () => {
    const chain = chainAnalysisAgent.createChain()
    setCurrentChain(chain)
    setEditingChainId(null)
    setActiveTab('builder')
  }

  const editChain = (chainId) => {
    const chain = chainAnalysisAgent.getChain(chainId)
    if (chain) {
      setCurrentChain({ ...chain })
      setEditingChainId(chainId)
      setActiveTab('builder')
    }
  }

  const handleSaveChain = (chain) => {
    chainAnalysisAgent.saveChain(chain)
    saveToState()
    setCurrentChain(chain)
  }

  const handleCompleteChain = (chain) => {
    const completed = chainAnalysisAgent.completeChain(chain.id)
    saveToState()
    setCurrentChain(completed)
    setActiveTab('list')
  }

  const handleDeleteChain = (chainId) => {
    chainAnalysisAgent.deleteChain(chainId)
    saveToState()
    if (currentChain?.id === chainId) {
      setCurrentChain(null)
    }
  }

  const tabs = [
    { id: 'new', label: 'Neue Analyse', icon: '➕' },
    { id: 'list', label: 'Meine Analysen', icon: '📋' },
    { id: 'patterns', label: 'Muster', icon: '🔍' },
  ]

  // Builder Tab zeigen wenn aktiv
  if (activeTab === 'builder' && currentChain) {
    return (
      <ChainBuilder
        chain={currentChain}
        onSave={handleSaveChain}
        onComplete={handleCompleteChain}
        onBack={() => {
          setActiveTab('list')
          setCurrentChain(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Info Banner */}
      <div
        className={`p-4 rounded-xl ${
          isDark
            ? 'bg-lavender-900/30 border border-lavender-500/30'
            : 'bg-lavender-50 border border-lavender-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔗</span>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-lavender-300' : 'text-lavender-700'}`}>
              Verhaltenskettenanalyse
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-lavender-400' : 'text-lavender-600'}`}>
              Verstehe die Kette von Ereignissen, die zu problematischem Verhalten führt. Finde
              Punkte, an denen du eingreifen kannst.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className={`rounded-xl p-1 flex gap-1 ${
          isDark ? 'bg-dark-surface' : 'bg-white shadow-soft'
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
              transition-all duration-200 font-medium text-sm
              ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-lavender-600 text-white'
                    : 'bg-lavender-500 text-white shadow-md'
                  : isDark
                    ? 'text-darkText-secondary hover:bg-dark-hover'
                    : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'new' && (
        <div
          className={`p-6 rounded-xl text-center ${
            isDark ? 'bg-dark-surface border border-dark-border' : 'bg-white shadow-soft'
          }`}
        >
          <span className="text-6xl mb-4 block">🔗</span>
          <h3
            className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-darkText-primary' : 'text-gray-800'
            }`}
          >
            Neue Verhaltenskettenanalyse
          </h3>
          <p
            className={`mb-6 max-w-md mx-auto ${
              isDark ? 'text-darkText-secondary' : 'text-gray-500'
            }`}
          >
            Analysiere ein problematisches Verhalten Schritt für Schritt, um Auslöser zu verstehen
            und Interventionspunkte zu finden.
          </p>

          <button
            onClick={startNewChain}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              isDark
                ? 'bg-lavender-600 text-white hover:bg-lavender-500'
                : 'bg-lavender-500 text-white hover:bg-lavender-600 shadow-md'
            }`}
          >
            Analyse starten
          </button>

          {/* Anleitung */}
          <div
            className={`mt-8 p-4 rounded-lg text-left ${
              isDark ? 'bg-dark-elevated' : 'bg-gray-50'
            }`}
          >
            <h4
              className={`font-medium mb-3 ${isDark ? 'text-darkText-primary' : 'text-gray-700'}`}
            >
              So funktioniert es:
            </h4>
            <ol
              className={`space-y-2 text-sm ${
                isDark ? 'text-darkText-secondary' : 'text-gray-600'
              }`}
            >
              <li className="flex gap-2">
                <span className="font-medium">1.</span>
                <span>Beschreibe das problematische Verhalten</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">2.</span>
                <span>Notiere Vulnerabilitäten (Schlaf, Stress, etc.)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">3.</span>
                <span>Identifiziere den Auslöser</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">4.</span>
                <span>Baue die Kette: Gedanken → Gefühle → Impulse</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">5.</span>
                <span>Erhalte Skill-Empfehlungen für Interventionspunkte</span>
              </li>
            </ol>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <ChainList
          chains={chainAnalysisAgent.getAllChains()}
          onEdit={editChain}
          onDelete={handleDeleteChain}
          onNew={startNewChain}
        />
      )}

      {activeTab === 'patterns' && <ChainPatterns patterns={chainAnalysisAgent.findPatterns()} />}
    </div>
  )
}
