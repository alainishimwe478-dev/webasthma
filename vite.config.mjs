import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-icons/fa',
      'react-icons/fa6',
      'recharts',
      'framer-motion',
      'react-hot-toast'
    ]
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  server: {
    hmr: {
      overlay: false
    },

    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
