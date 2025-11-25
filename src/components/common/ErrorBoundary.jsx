/**
 * Error Boundary Component
 * Fängt JavaScript-Fehler in Kindkomponenten ab und zeigt eine Fallback-UI
 */

import { Component } from 'react'
import Button from './Button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })

    // Hier könnte man Fehler an einen Logging-Service senden
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center animate-fade-in">
            {/* Beruhigendes Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-calm-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Etwas ist schiefgelaufen
            </h2>

            <p className="text-gray-600 mb-6">
              Keine Sorge, deine Daten sind sicher.
              Manchmal passieren kleine Fehler - das ist völlig normal.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="w-full"
                icon="🔄"
              >
                Nochmal versuchen
              </Button>

              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Seite neu laden
              </Button>
            </div>

            {/* Technische Details (nur für Entwicklung) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Technische Details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * HOC für einfachere Verwendung
 */
export function withErrorBoundary(Component, fallback = null) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

export default ErrorBoundary
