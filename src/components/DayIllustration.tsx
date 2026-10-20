import type { ReactNode } from 'react'

/*
 * Illustrations au trait des 14 jours du plan (viewBox 160 × 120).
 * Classes : « l » = trait clair, « a » = trait orange, « f » = aplat orange.
 * pathLength=1 permet de « dessiner » chaque trait au défilement (voir Journey.tsx).
 */
const P = { pathLength: 1 } as const

const art: ReactNode[] = [
  // 1. Lire les chapitres 1 à 3 : livre ouvert, marque-page
  <>
    <path className="l" {...P} d="M80 34c-14-8-34-9-52-4v62c18-5 38-4 52 4 14-8 34-9 52-4V30c-18-5-38-4-52 4z" />
    <path className="l" {...P} d="M80 34v62" />
    <path className="l" {...P} d="M40 46h28M40 56h28M40 66h20M92 46h28M92 56h28M92 66h22" />
    <path className="a" {...P} d="M112 28v24l6-5 6 5V28" />
  </>,
  // 2. Repérer les déclencheurs de crise : tablette, loupe, éclair
  <>
    <rect className="l" {...P} x="26" y="24" width="64" height="80" rx="8" />
    <path className="l" {...P} d="M52 96h12" />
    <path className="a" {...P} d="M62 42 50 62h12l-8 18" />
    <circle className="a" {...P} cx="108" cy="58" r="20" />
    <path className="a" {...P} d="m122 72 16 16" />
  </>,
  // 3. Noter nos temps d'écran : carnet, liste, crayon
  <>
    <rect className="l" {...P} x="30" y="20" width="70" height="86" rx="6" />
    <path className="l" {...P} d="M44 20v-6M58 20v-6M72 20v-6M86 20v-6" />
    <path className="a" {...P} d="m42 42 4 4 8-8M42 62l4 4 8-8" />
    <path className="l" {...P} d="M62 42h26M62 62h26M44 82h44" />
    <path className="a" {...P} d="m112 92 26-50 8 4-26 50-10 6z" />
  </>,
  // 4. Se mettre d'accord entre adultes : deux bulles, coche
  <>
    <path className="l" {...P} d="M22 30h62a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H48l-14 12V74H22a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" />
    <path className="l" {...P} d="M76 52h62a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8h-12v12l-14-12H76a8 8 0 0 1-8-8V60a8 8 0 0 1 8-8z" />
    <path className="a" {...P} d="m94 74 10 10 20-20" />
  </>,
  // 5. Écrire le plan familial : feuille, cœur, stylo
  <>
    <path className="l" {...P} d="M36 14h56l18 18v76H36z" />
    <path className="l" {...P} d="M92 14v18h18" />
    <path className="a" {...P} d="M73 50c-3-7-14-6-14 2 0 7 14 14 14 14s14-7 14-14c0-8-11-9-14-2z" />
    <path className="l" {...P} d="M50 80h46M50 92h32" />
    <path className="a" {...P} d="m120 104 20-40 7 3-20 40-8 5z" />
  </>,
  // 6. Présenter le plan à l'enfant : adulte et enfant, feuille entre eux
  <>
    <circle className="l" {...P} cx="40" cy="36" r="12" />
    <path className="l" {...P} d="M18 104c0-26 10-46 22-46s22 20 22 46" />
    <circle className="l" {...P} cx="122" cy="58" r="9" />
    <path className="l" {...P} d="M106 104c0-18 7-32 16-32s16 14 16 32" />
    <rect className="a" {...P} x="68" y="64" width="26" height="32" rx="3" />
    <path className="a" {...P} d="M74 74h14M74 82h10" />
  </>,
  // 7. Afficher le plan, choisir un minuteur : affiche punaisée, minuteur visuel
  <>
    <rect className="l" {...P} x="20" y="22" width="56" height="74" rx="4" />
    <circle className="f" cx="48" cy="22" r="5" />
    <path className="l" {...P} d="M32 44h32M32 56h32M32 68h22" />
    <rect className="l" {...P} x="90" y="44" width="54" height="54" rx="12" />
    <circle className="l" {...P} cx="117" cy="71" r="18" />
    <path className="f" d="M117 71V53a18 18 0 0 1 15.6 27z" />
  </>,
  // 8. Repas sans écran pour tous : assiette, fourchette, couteau
  <>
    <circle className="l" {...P} cx="80" cy="64" r="34" />
    <circle className="a" {...P} cx="80" cy="64" r="22" />
    <path className="l" {...P} d="M28 34v20a6 6 0 0 0 12 0V34M34 54v44" />
    <path className="l" {...P} d="M128 98V34c8 4 10 16 10 28h-10" />
    <path className="a" {...P} d="M72 22c-3-5 3-7 0-12M88 22c-3-5 3-7 0-12" />
  </>,
  // 9. Écrans hors de la chambre le soir : lit, lune, étoiles
  <>
    <path className="l" {...P} d="M16 98V54M16 80h128v18M144 80V68a10 10 0 0 0-10-10H62v22" />
    <rect className="l" {...P} x="24" y="64" width="30" height="16" rx="7" />
    <path className="a" {...P} d="M120 18a18 18 0 1 0 20 24 15 15 0 0 1-20-24z" />
    <path className="a" {...P} d="M86 22v8M82 26h8M100 40v6M97 43h6" />
  </>,
  // 10. Un matin sans écran avant l'école : soleil levant, cartable
  <>
    <path className="a" {...P} d="M18 70a26 26 0 0 1 52 0" />
    <path className="a" {...P} d="M44 30v-10M20 46l-7-6M68 46l7-6M10 70h68" />
    <rect className="l" {...P} x="92" y="40" width="50" height="62" rx="10" />
    <path className="l" {...P} d="M106 40v-6a11 11 0 0 1 22 0v6M92 64h50M112 64v10h10V64" />
  </>,
  // 11. Réduire la durée, avec préavis : minuteur qui diminue, cloche
  <>
    <circle className="l" {...P} cx="70" cy="64" r="38" />
    <path className="f" d="M70 64V26a38 38 0 0 1 26.9 11.1z" />
    <path className="l" {...P} d="M70 64V36M60 18h20" />
    <path className="a" {...P} d="M124 46a12 12 0 0 1 24 0c0 14 6 18 6 18h-36s6-4 6-18zM131 72a6 6 0 0 0 10 0" />
  </>,
  // 12. Faire le point en famille : trois personnes, bulle
  <>
    <circle className="l" {...P} cx="40" cy="58" r="11" />
    <path className="l" {...P} d="M20 104c0-18 9-30 20-30s20 12 20 30" />
    <circle className="l" {...P} cx="80" cy="50" r="13" />
    <path className="l" {...P} d="M56 104c0-22 11-36 24-36s24 14 24 36" />
    <circle className="l" {...P} cx="120" cy="64" r="9" />
    <path className="l" {...P} d="M104 104c0-15 7-24 16-24s16 9 16 24" />
    <path className="a" {...P} d="M96 14h40a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-22l-10 8v-8h-8a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" />
  </>,
  // 13. Un moment de qualité sans écran : cerf-volant, pièces de puzzle
  <>
    <path className="a" {...P} d="m104 10 26 26-26 34-26-34z" />
    <path className="a" {...P} d="M104 10v60M78 36h52" />
    <path className="l" {...P} d="M104 70c-6 10 6 16 0 26s4 14 0 18" />
    <path className="l" {...P} d="M18 70h14a6 6 0 1 1 12 0h14v14a6 6 0 1 0 0 12v14H18V96a6 6 0 1 1 0-12z" />
  </>,
  // 14. Bilan et ajustements : médaille étoilée, rubans
  <>
    <path className="l" {...P} d="m64 14 10 36M96 14 86 50" />
    <circle className="l" {...P} cx="80" cy="76" r="32" />
    <path className="a" {...P} d="m80 56 6 13 14 1-11 9 4 14-13-8-13 8 4-14-11-9 14-1z" />
  </>,
]

export function DayIllustration({ day, className = '' }: { day: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      className={`day-art ${className}`}
    >
      {art[day - 1]}
    </svg>
  )
}
