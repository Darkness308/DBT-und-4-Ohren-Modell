import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base URL für GitHub Pages (leer für lokale Entwicklung)
  base: process.env.VITE_BASE_URL || '/',

  plugins: [react()],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    // PWA Service Worker muss im Root sein
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },

  // PWA Optimierungen
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
}))
