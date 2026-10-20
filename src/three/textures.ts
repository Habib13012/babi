import * as THREE from 'three'

/**
 * Textures dessinées en code pour les faces du livre dont nous n'avons pas de visuel :
 * tranche, 4e de couverture, page de titre, tranche des pages.
 * Elles reprennent uniquement les textes présents sur la couverture.
 */

const NAVY = '#12283e'
const NAVY_DEEP = '#0d1f31'
const EMBER = '#e8843c'
const PAPER = '#f4f0e6'
const FONT = '"Plus Jakarta Sans", system-ui, sans-serif'

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (ctx) draw(ctx)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function centeredLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, lh: number) {
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh))
}

export function spineTexture() {
  return canvasTexture(1400, 160, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 160)
    g.addColorStop(0, NAVY_DEEP)
    g.addColorStop(0.5, NAVY)
    g.addColorStop(1, NAVY_DEEP)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 1400, 160)
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f4f2ec'
    ctx.font = `800 54px ${FONT}`
    ctx.fillText('Mon enfant et les écrans', 120, 82)
    ctx.fillStyle = EMBER
    ctx.fillRect(1030, 78, 46, 6)
    ctx.font = `600 36px ${FONT}`
    ctx.fillStyle = '#c9d3dc'
    ctx.fillText('Habib Tahrat', 1100, 82)
  })
}

export function backTexture() {
  return canvasTexture(1024, 1448, (ctx) => {
    const g = ctx.createRadialGradient(512, 500, 80, 512, 700, 1000)
    g.addColorStop(0, '#1d3a58')
    g.addColorStop(1, NAVY_DEEP)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 1024, 1448)

    ctx.textAlign = 'center'
    ctx.fillStyle = EMBER
    ctx.font = `700 26px ${FONT}`
    ctx.fillText('G U I D E   P R A T I Q U E   P O U R   L E S   P A R E N T S', 512, 300)

    ctx.fillStyle = '#f4f2ec'
    ctx.font = `800 82px ${FONT}`
    centeredLines(ctx, ['Le plan en 14 jours', 'pour reprendre', 'la main.'], 512, 450, 96)

    ctx.fillStyle = EMBER
    ctx.fillRect(472, 720, 80, 8)

    ctx.fillStyle = '#c9d3dc'
    ctx.font = `500 38px ${FONT}`
    centeredLines(ctx, ['Règles claires', 'Phrases prêtes à dire', 'Outils à imprimer'], 512, 840, 64)

    ctx.fillStyle = '#f4f2ec'
    ctx.font = `700 34px ${FONT}`
    ctx.fillText('Habib Tahrat', 512, 1300)
  })
}

export function titlePageTexture() {
  return canvasTexture(1024, 1448, (ctx) => {
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, 1024, 1448)
    // léger dégradé de reliure côté gauche
    const g = ctx.createLinearGradient(0, 0, 140, 0)
    g.addColorStop(0, 'rgba(60,45,30,0.22)')
    g.addColorStop(1, 'rgba(60,45,30,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 140, 1448)

    ctx.textAlign = 'center'
    ctx.fillStyle = EMBER
    ctx.font = `700 24px ${FONT}`
    ctx.fillText('G U I D E   P R A T I Q U E   P O U R   L E S   P A R E N T S', 540, 420)
    ctx.fillStyle = NAVY
    ctx.font = `800 96px ${FONT}`
    centeredLines(ctx, ['Mon enfant', 'et les écrans'], 540, 560, 110)
    ctx.fillStyle = EMBER
    ctx.fillRect(500, 690, 80, 7)
    ctx.fillStyle = '#4a5866'
    ctx.font = `500 36px ${FONT}`
    centeredLines(ctx, ['Le plan en 14 jours', 'pour reprendre la main', 'sans cris ni guerre'], 540, 780, 54)
    ctx.fillStyle = NAVY
    ctx.font = `700 34px ${FONT}`
    ctx.fillText('Habib Tahrat', 540, 1240)
  })
}

export function innerCoverTexture() {
  return canvasTexture(512, 724, (ctx) => {
    const g = ctx.createLinearGradient(512, 0, 0, 0)
    g.addColorStop(0, NAVY_DEEP)
    g.addColorStop(1, NAVY)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 724)
  })
}

/** Tranche des pages : fines lignes parallèles. */
export function pageEdgeTexture(vertical: boolean) {
  const tex = canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = '#efe9dc'
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 512; i += 3) {
      const shade = 200 + Math.floor(Math.random() * 30)
      ctx.fillStyle = `rgba(${shade - 40},${shade - 50},${shade - 70},0.35)`
      if (vertical) ctx.fillRect(i, 0, 1, 512)
      else ctx.fillRect(0, i, 512, 1)
    }
  })
  return tex
}
