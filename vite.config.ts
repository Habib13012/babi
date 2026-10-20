import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  // `vite build --mode shopify` : fichiers à plat, noms fixes, pour le dossier assets/ d'un thème Shopify
  if (mode === 'shopify') {
    return {
      plugins: [react(), tailwindcss()],
      base: './',
      publicDir: false,
      build: {
        outDir: 'dist-shopify/build',
        emptyOutDir: true,
        assetsDir: '',
        modulePreload: { polyfill: false },
        assetsInlineLimit: 0,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          input: 'src/main.tsx',
          output: {
            // un seul fichier : Shopify ajoute ?v=… aux URL, ce qui casserait les imports entre morceaux
            inlineDynamicImports: true,
            entryFileNames: 'immersive.js',
            // CSS → immersive.css ; polices sous leur nom d'origine (réutilisées par base.css)
            assetFileNames: (info) => (info.names[0]?.endsWith('.css') ? 'immersive.css' : '[name][extname]'),
          },
        },
      },
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    build: {
      // La scène 3D est chargée à part (React.lazy) : ce seuil concerne ce chunk-là.
      chunkSizeWarningLimit: 1200,
    },
  }
})
