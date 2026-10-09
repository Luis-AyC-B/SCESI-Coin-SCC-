import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const seedDir = fileURLToPath(new URL('../seed', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src', '@seed': seedDir },
  },
  server: {
    // permite importar ../seed/data.json como mock
    fs: { allow: ['.', seedDir] },
  },
})
