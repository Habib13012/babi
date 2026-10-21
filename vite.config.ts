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
            // La scène 3D (three.js) reste dans un fichier à part, chargé seulement sur ordinateur.
            // Le thème charge immersive.js sans le ?v=… de Shopify : les morceaux s'importent
            // entre eux par la même URL, donc React n'est jamais chargé deux fois.
            entryFileNames: 'immersive.js',
            chunkFileNames: 'immersive-[name].js',
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
