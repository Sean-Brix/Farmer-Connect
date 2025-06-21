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

    proxy: {
      '/api': {
        target: 'http://localhost/Agri-Connect/server/api',
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          const url = new URL(newPath, 'http://localhost');
          const pathname = url.pathname;
          const search = url.search;
          url.pathname = pathname + '.php';
          url.search = search;
          return url.toString().replace('http://localhost', '');
        }
      },
      '/auth': {
        target: 'http://localhost/Agri-Connect/server/api',
        changeOrigin: true,

        rewrite: (path) => {
          const newPath = path.replace(/^\/auth/, '');
          const url = new URL(newPath, 'http://localhost'); // Use a base URL to parse
          const pathname = url.pathname + '.php';
          url.pathname = pathname;
          return url.toString().replace('http://localhost', ''); // Remove the base URL
        }
      }
    }

  }
  
})
