import { useReducer, useEffect, useRef, lazy, Suspense } from 'react'
import { eventBus } from './core/eventBus'
import { useTheme } from './contexts/ThemeContext'
import { AppContext } from './contexts/AppContext'
import Navigation from './components/common/Navigation'
import ErrorBoundary from './components/common/ErrorBoundary'
import PWAManager from './components/pwa/PWAManager'

// Lazy-loaded modules für Code-Splitting
const VierOhrenAnalyzer = lazy(() => import('./modules/vier-ohren/VierOhrenAnalyzer'))
const SkillFinder = lazy(() => import('./modules/dbt-skills/SkillFinder'))
const Dashboard = lazy(() => import('./modules/dashboard/Dashboard'))
const DiaryCard = lazy(() => import('./modules/diary-card/DiaryCard'))
const Settings = lazy(() => import('./components/settings/Settings'))

const initialState = {
  activeModule: 'home',
  user: {
    name: null,
    settings: {
      reducedMotion: false,
      fontSize: 'normal',
    },
  },
  diaryData: [],
  chainAnalyses: [],
  skillHistory: [],
}

function appReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, activeModule: action.payload }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        user: { ...state.user, settings: { ...state.user.settings, ...action.payload } },
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
  const { isDark, toggleTheme } = useTheme()
  const saveTimeoutRef = useRef(null)

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

  // Persistenz speichern (debounced für Performance)
  useEffect(() => {
    // Vorherigen Timeout abbrechen
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Neuen Timeout setzen (500ms Verzögerung)
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('dbt-app-state', JSON.stringify(state))
    }, 500)

    // Cleanup bei Unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state])

  // Event-Bus Listener
  useEffect(() => {
    const unsubscribeSkill = eventBus.on('skill:used', (data) => {
      dispatch({
        type: 'ADD_SKILL_USAGE',
        payload: { ...data, timestamp: new Date().toISOString() },
      })
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
      case 'home':
        return <Dashboard />
      case 'vier-ohren':
        return <VierOhrenAnalyzer />
      case 'skills':
        return <SkillFinder />
      case 'settings':
        return <Settings />
      case 'diary':
        return <DiaryCard />
      case 'chain':
        return <ComingSoon title="Chain Analysis" icon="🔗" />
      default:
        return <Dashboard />
    }
  }

  // Dynamischer Header-Titel
  const getHeaderInfo = () => {
    switch (state.activeModule) {
      case 'home':
        return { title: 'DBT Skills & Vier-Ohren', subtitle: 'Dein Dashboard' }
      case 'vier-ohren':
        return { title: 'Vier-Ohren-Modell', subtitle: 'Kommunikation verstehen' }
      case 'skills':
        return { title: 'Skill-Finder', subtitle: 'DBT-Skills entdecken' }
      case 'settings':
        return { title: 'Einstellungen', subtitle: 'Design & Daten' }
      case 'diary':
        return { title: 'Diary Card', subtitle: 'Emotionen tracken' }
      case 'chain':
        return { title: 'Chain Analysis', subtitle: 'Verhalten verstehen' }
      default:
        return { title: 'DBT Skills & Vier-Ohren', subtitle: 'Werkzeuge für dich' }
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <AppContext.Provider value={{ state, dispatch, navigate }}>
      <PWAManager />
      <div
        className={`min-h-screen pb-20 transition-theme ${isDark ? 'bg-dark-bg' : 'gradient-subtle'}`}
      >
        {/* Header */}
        <header className="gradient-calm text-white p-6 shadow-lg transition-theme">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{headerInfo.title}</h1>
              <p className="text-white/80 text-sm mt-1">{headerInfo.subtitle}</p>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln'}
            >
              <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </header>

        {/* Main Content mit Error Boundary + Suspense für Lazy Loading */}
        <main className="max-w-4xl mx-auto p-4 mt-4">
          <ErrorBoundary>
            <Suspense fallback={<ModuleLoader />}>{renderModule()}</Suspense>
          </ErrorBoundary>
        </main>

        {/* Navigation */}
        <Navigation activeModule={state.activeModule} onNavigate={navigate} />
      </div>
    </AppContext.Provider>
  )
}

// Loading Placeholder für Lazy-loaded Module
function ModuleLoader() {
  const { isDark } = useTheme()

  return (
    <div
      className={`rounded-xl shadow-md p-8 text-center animate-pulse ${isDark ? 'bg-dark-surface' : 'bg-white'}`}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-calm-200 dark:bg-calm-800" />
      <div className="h-6 w-48 mx-auto mb-2 rounded bg-calm-100 dark:bg-calm-900" />
      <div className="h-4 w-32 mx-auto rounded bg-calm-50 dark:bg-calm-950" />
    </div>
  )
}

// Coming Soon Placeholder
function ComingSoon({ title, icon }) {
  const { isDark } = useTheme()

  return (
    <div
      className={`rounded-xl shadow-md p-8 text-center animate-fade-in transition-theme ${isDark ? 'bg-dark-surface' : 'bg-white'}`}
    >
      <span className="text-6xl mb-4 block">{icon}</span>
      <h2
        className={`text-2xl font-semibold mb-2 ${isDark ? 'text-darkText-primary' : 'text-gray-800'}`}
      >
        {title}
      </h2>
      <p className={`mb-4 ${isDark ? 'text-darkText-secondary' : 'text-gray-500'}`}>
        Dieses Modul wird bald verfügbar sein.
      </p>
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${isDark ? 'bg-calm-900/50 text-calm-300' : 'bg-calm-50 text-calm-700'}`}
      >
        <span className="animate-pulse">🔨</span>
        <span>In Entwicklung</span>
      </div>
    </div>
  )
}

// Re-export useApp für Abwärtskompatibilität
export { useApp } from './contexts/AppContext'

export default App
