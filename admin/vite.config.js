import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: process.env.VITE_ADMIN_API_BASE_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        // Required for cookies to work with proxy
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
