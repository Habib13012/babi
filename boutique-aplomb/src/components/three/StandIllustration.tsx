/**
 * Illustration vectorielle statique : image de remplacement de la 3D
 * (chargement, WebGL indisponible, erreur). Rendu indicatif.
 */
export function StandIllustration({ className, color = "#C9CCD1" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 600 420" className={className} role="img" aria-label="Illustration indicative du support Socle 01 déplié">
      <defs>
        <linearGradient id="si-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor="#15171a" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="si-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#15171a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#15171a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="352" rx="250" ry="34" fill="url(#si-shadow)" />
      {/* base */}
      <path d="M90 330 300 368 512 318 302 288Z" fill="url(#si-metal)" stroke="#15171a" strokeOpacity=".25" />
      {/* bras */}
      <path d="M410 316 268 168 286 162 430 312Z" fill={color} stroke="#15171a" strokeOpacity=".3" />
      <path d="M196 342 120 196 138 190 216 338Z" fill={color} stroke="#15171a" strokeOpacity=".3" opacity=".7" />
      {/* plateau */}
      <path d="M96 196 300 120 528 176 330 262Z" fill="url(#si-metal)" stroke="#15171a" strokeOpacity=".3" />
      {Array.from({ length: 6 }, (_, i) => {
        const t = (i + 1) / 7;
        const x1 = 96 + (300 - 96) * t;
        const y1 = 196 + (120 - 196) * t;
        const x2 = 330 + (528 - 330) * t;
        const y2 = 262 + (176 - 262) * t;
        return <line key={i} x1={x1 + 18} y1={y1 + 6} x2={x2 - 18} y2={y2 - 6} stroke="#15171a" strokeOpacity=".22" strokeWidth="5" strokeLinecap="round" />;
      })}
      <path d="M96 196 330 262 330 280 96 212Z" fill={color} stroke="#15171a" strokeOpacity=".3" />
    </svg>
  );
}
