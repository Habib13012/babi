import { site } from '../config'

/** Emblème : un livre ouvert sous un soleil levant (sérénité retrouvée). */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <rect width="48" height="48" rx="12" fill="#f4f2ec" />
      <circle cx="24" cy="15.5" r="4.5" fill="#e8843c" />
      <path d="M8 21.5c6.2-1.6 11.6-.9 15 2.4V38c-3.4-3-8.8-3.7-15-2.2z" fill="#12283e" />
      <path d="M40 21.5c-6.2-1.6-11.6-.9-15 2.4V38c3.4-3 8.8-3.7 15-2.2z" fill="#12283e" />
    </svg>
  )
}

/** Logo complet : emblème + nom en deux graisses (sans-serif + italique). */
export function Logo({ className = '' }: { className?: string }) {
  const [first, ...rest] = site.brand.split(' ')
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0 md:h-9 md:w-9" />
      <span className="text-[17px] leading-none font-extrabold tracking-tight text-paper md:text-lg">
        {first}
        {rest.length > 0 && <span className="serif-accent ml-1 text-[1.12em] font-normal text-ember">{rest.join(' ')}</span>}
      </span>
    </span>
  )
}
