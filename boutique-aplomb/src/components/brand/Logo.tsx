import { WORDMARK_PATH } from "./wordmark";

interface Props {
  className?: string;
  /** "full" = symbole + mot ; "mark" = symbole seul. */
  variant?: "full" | "mark";
  tone?: "ink" | "chalk";
  title?: string;
}

/**
 * Symbole : un « A » dont la barre est remplacée par un fil à plomb.
 * Lu comme : la verticale retrouvée — l'« aplomb ».
 */
export function Logo({ className, variant = "full", tone = "ink", title = "Aplomb" }: Props) {
  const stroke = tone === "ink" ? "var(--color-ink)" : "var(--color-chalk)";
  const bob = tone === "ink" ? "var(--color-copper)" : "var(--color-copper-light)";
  const mark = (
    <>
      <path d="M12 54 32 10 52 54M32 10v27" fill="none" stroke={stroke} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="43" r="5" fill={bob} />
    </>
  );
  if (variant === "mark") {
    return (
      <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
        {mark}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 252 72" className={className} role="img" aria-label={title}>
      {mark}
      <path transform="translate(78.4 54) scale(0.0285)" fill={stroke} d={WORDMARK_PATH} />
    </svg>
  );
}
