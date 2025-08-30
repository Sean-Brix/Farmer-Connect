import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173,
    open: true,
    host: 'localhost',

    proxy: {
      '/socket.io': {
        target: 'http://localhost:8091',
        ws: true,
        changeOrigin: true,
      },
      
      '/api': {
        target: 'http://localhost:8091/',
        changeOrigin: true,
      },

      '/auth': {
        target: 'http://localhost:8091/',
        changeOrigin: true,
      }

    }
  }
})
