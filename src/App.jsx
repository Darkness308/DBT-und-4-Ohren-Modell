import { createContext, useContext, useReducer, useEffect } from 'react'
import { eventBus } from './utils/eventBus'
import Navigation from './components/common/Navigation'
import VierOhrenAnalyzer from './components/vier-ohren/VierOhrenAnalyzer'

// App Context
const AppContext = createContext(null)

const initialState = {
  activeModule: 'vier-ohren',
  user: {
    name: null,
    settings: {
      theme: 'light',
      reducedMotion: false,
      fontSize: 'normal'
    }
  },
  diaryData: [],
  chainAnalyses: [],
  skillHistory: []
}

function appReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, activeModule: action.payload }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        user: { ...state.user, settings: { ...state.user.settings, ...action.payload } }
      }
    case 'ADD_DIARY_ENTRY':
      return { ...state, diaryData: [...state.diaryData, action.payload] }
    case 'ADD_CHAIN_ANALYSIS':
      return { ...state, chainAnalyses: [...state.chainAnalyses, action.payload] }
    case 'ADD_SKILL_USAGE':
      return { ...state, skillHistory: [...state.skillHistory, action.payload] }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Persistenz laden
  useEffect(() => {
    const saved = localStorage.getItem('dbt-app-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      } catch (e) {
        console.error('Fehler beim Laden der gespeicherten Daten:', e)
      }
    }
  }, [])

  // Persistenz speichern
  useEffect(() => {
    localStorage.setItem('dbt-app-state', JSON.stringify(state))
  }, [state])

  // Event-Bus Listener
  useEffect(() => {
    const unsubscribeSkill = eventBus.on('skill:used', (data) => {
      dispatch({ type: 'ADD_SKILL_USAGE', payload: { ...data, timestamp: new Date().toISOString() } })
    })

    return () => {
      unsubscribeSkill()
    }
  }, [])

  const navigate = (module) => {
    dispatch({ type: 'NAVIGATE', payload: module })
  }

  const renderModule = () => {
    switch (state.activeModule) {
      case 'vier-ohren':
        return <VierOhrenAnalyzer />
      case 'skills':
        return <ComingSoon title="Skill-Finder" icon="🧰" />
      case 'diary':
        return <ComingSoon title="Diary Card" icon="📊" />
      case 'chain':
        return <ComingSoon title="Chain Analysis" icon="🔗" />
      default:
        return <VierOhrenAnalyzer />
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch, navigate }}>
      <div className="min-h-screen gradient-subtle pb-20">
        {/* Header */}
        <header className="gradient-calm text-white p-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">DBT Skills & Vier-Ohren-Modell</h1>
            <p className="text-white/80 text-sm mt-1">
              Werkzeuge für Emotionsregulation und Kommunikation
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-4 mt-4">
          {renderModule()}
        </main>

        {/* Navigation */}
        <Navigation activeModule={state.activeModule} onNavigate={navigate} />
      </div>
    </AppContext.Provider>
  )
}

// Coming Soon Placeholder
function ComingSoon({ title, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center animate-fade-in">
      <span className="text-6xl mb-4 block">{icon}</span>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500">Dieses Modul wird bald verfügbar sein.</p>
    </div>
  )
}

export const useApp = () => useContext(AppContext)

export default App
