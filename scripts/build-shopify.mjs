// Assemble le thème Shopify : fichiers Liquid (shopify/) + bundle Vite + images, puis crée le zip.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const out = join(root, 'dist-shopify')
const theme = join(out, 'theme')
const zip = join(out, 'theme-mon-enfant-et-les-ecrans.zip')

// Le tokenizer Liquid de Shopify termine une balise {{ … }} à la première « } » :
// une accolade dans une chaîne (ex. '{x}') provoque une erreur de syntaxe en ligne.
function checkLiquidOutputTags(dir) {
  const errors = []
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (p.endsWith('.liquid')) {
        const src = readFileSync(p, 'utf8')
        // image_tag n'accepte que la sortie de image_url (pas asset_url) : erreur Liquid à l'affichage
        const badTag = src.search(/asset_url\s*\|\s*image_tag/)
        if (badTag !== -1) errors.push(`${relative(root, p)}:${src.slice(0, badTag).split('\n').length}  asset_url | image_tag interdit`)
        for (let i = src.indexOf('{{'); i !== -1; i = src.indexOf('{{', i + 2)) {
          const end = src.indexOf('}', i + 2)
          if (end === -1 || src[end + 1] !== '}') {
            const line = src.slice(0, i).split('\n').length
            errors.push(`${relative(root, p)}:${line}  ${src.slice(i, i + 60)}`)
          }
        }
      }
    }
  }
  walk(dir)
  if (errors.length) throw new Error(`Balises Liquid {{ }} invalides :\n${errors.join('\n')}`)
}
checkLiquidOutputTags(join(root, 'shopify'))

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
