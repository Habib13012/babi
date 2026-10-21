import type { ReactNode } from "react";

/**
 * Information réelle manquante. Rendue de façon volontairement visible :
 * le build de production échoue tant qu'il en reste (npm run check:launch).
 */
export function Missing({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-warn-bg px-1.5 py-0.5 font-semibold text-warn ring-1 ring-warn/30" data-missing="true">
      [À compléter : {children}]
    </mark>
  );
}

/** Valeur de démonstration, non contractuelle. */
export function DemoTag({ label = "démo" }: { label?: string }) {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-warn-bg px-2 py-0.5 align-middle text-[0.65rem] font-bold uppercase tracking-wider text-warn ring-1 ring-warn/30">
      {label}
    </span>
  );
}

/** Affiche la valeur si elle existe, sinon le marqueur « à compléter ». */
export function Val({ value, label }: { value: string | null | undefined; label: string }) {
  return value ? <>{value}</> : <Missing>{label}</Missing>;
}
