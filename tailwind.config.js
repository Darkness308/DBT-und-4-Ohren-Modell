/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // Ermöglicht manuelle Theme-Kontrolle

  theme: {
    extend: {
      colors: {
        // ═══════════════════════════════════════════════════════════════
        // THERAPEUTISCHES FARBSYSTEM
        // Basiert auf: Farbpsychologie, Kognitionswissenschaft, WCAG AA
        // ═══════════════════════════════════════════════════════════════

        // PRIMÄR: Beruhigendes Blau-Violett
        // Aktiviert Parasympathikus, fördert Entspannung
        calm: {
          50: '#eef2ff', // Heller Hintergrund (Light Mode)
          100: '#e0e7ff', // Subtle Highlight
          200: '#c7d2fe', // Hover States
          300: '#a5b4fc', // Active States
          400: '#818cf8', // Interaktive Elemente
          500: '#667eea', // Primär-Farbe
          600: '#5a67d8', // Hover auf Primär
          700: '#4c51bf', // Active auf Primär
          800: '#3730a3', // Dunklere Variante
          900: '#312e81', // Dunkelste Variante
        },

        // ERFOLG: Sanftes Grün
        // Verbessert Arbeitsgedächtnis, signalisiert positiven Fortschritt
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#22c55e', // Haupt-Erfolgsfarbe
          600: '#16a34a',
          700: '#15803d',
        },

        // WARNUNG: Warmes Orange
        // Nicht alarmierend, sanfte Aufmerksamkeit
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },

        // LAVENDEL: Stress-Reduktion
        // Senkt Cortisol, beruhigt bei hoher emotionaler Last
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },

        // ═══════════════════════════════════════════════════════════════
        // DARK MODE SPEZIFISCHE FARBEN
        // Kein reines Schwarz (#000) - zu harsch für mentale Gesundheit
        // ═══════════════════════════════════════════════════════════════

        // Dark Mode Hintergründe (Soft Charcoal Palette)
        dark: {
          bg: '#0f1419', // Haupthintergrund (nicht #000!)
          surface: '#1a1f26', // Karten, Modals
          elevated: '#242b35', // Erhöhte Oberflächen
          border: '#2f3943', // Subtile Grenzen
          hover: '#363f4a', // Hover-States
        },

        // Dark Mode Text
        darkText: {
          primary: '#e7e9ea', // Haupttext (Kontrast 12.6:1)
          secondary: '#9aa2aa', // Sekundärtext (Kontrast 5.3:1)
          muted: '#6b7280', // Gedämpfter Text
          inverse: '#0f1419', // Für helle Buttons
        },

        // ═══════════════════════════════════════════════════════════════
        // MODUL-FARBEN (Konsistente Navigation)
        // Gleiche Farbe = gleicher Kontext = weniger kognitive Last
        // ═══════════════════════════════════════════════════════════════

        module: {
          home: '#667eea', // Dashboard - Primär Blau
          analyzer: '#8b5cf6', // Vier-Ohren - Violett (Reflexion)
          skills: '#22c55e', // Skills - Grün (Wachstum/Lernen)
          diary: '#f59e0b', // Diary - Warm Orange (Emotionen)
          data: '#6b7280', // Daten - Neutral Grau
        },
      },

      // Therapeutische Schatten
      boxShadow: {
        soft: '0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.15)',
        'dark-soft': '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.4)',
        'glow-calm': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
      },

      // Animationen
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'soft-pulse': 'softPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 300ms ease-out',
        glow: 'glow 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(102, 126, 234, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' },
        },
      },

      // Typography für bessere Lesbarkeit
      fontSize: {
        reading: ['1.0625rem', { lineHeight: '1.65', letterSpacing: '0.01em' }],
      },
    },
  },

  plugins: [],
}
