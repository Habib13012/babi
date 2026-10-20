import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // La scène 3D est chargée à part (React.lazy) : ce seuil concerne ce chunk-là.
    chunkSizeWarningLimit: 1200,
  },
})
