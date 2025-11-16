import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Build configuration for production
  build: {
    outDir: path.resolve(__dirname, '../server/public/app'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          socket: ['socket.io-client'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
    host: 'localhost',

    proxy: {
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
      
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      },

      '/auth': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      }

    }
  }
})
