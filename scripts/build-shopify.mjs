// Assemble le thème Shopify : fichiers Liquid (shopify/) + bundle Vite + images, puis crée le zip.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const out = join(root, 'dist-shopify')
const theme = join(out, 'theme')
const zip = join(out, 'theme-mon-enfant-et-les-ecrans.zip')

execSync('npx vite build --mode shopify', { cwd: root, stdio: 'inherit' })

rmSync(theme, { recursive: true, force: true })
cpSync(join(root, 'shopify'), theme, { recursive: true })

const assets = join(theme, 'assets')
mkdirSync(assets, { recursive: true })
cpSync(join(out, 'build'), assets, { recursive: true })

// Le dossier assets/ d'un thème est à plat : on y copie toutes les images de public/images/*/
const images = join(root, 'public', 'images')
for (const folder of readdirSync(images)) {
  for (const file of readdirSync(join(images, folder))) {
    const target = join(assets, file)
    if (existsSync(target)) throw new Error(`Nom d'image en double dans assets/ : ${file}`)
    cpSync(join(images, folder, file), target)
  }
}

rmSync(zip, { force: true })
execSync(`zip -rq -X "${zip}" .`, { cwd: theme, stdio: 'inherit' })
console.log(`\nThème prêt : ${zip}`)
