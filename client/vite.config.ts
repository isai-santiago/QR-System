import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // Todo lo que vaya a /api, Vite se lo manda al backend en silencio
    }
  }
})