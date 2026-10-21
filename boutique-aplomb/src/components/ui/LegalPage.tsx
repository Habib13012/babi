import type { ReactNode } from "react";
import { isDemo, store } from "@/data";

/** Gabarit commun des pages d'information et des textes juridiques. */
export function LegalPage({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <article className="container-page py-14 md:py-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-5xl md:text-6xl">{title}</h1>
        {intro && <div className="mt-6 text-lg leading-relaxed text-graphite/85">{intro}</div>}
        <p className="mt-4 text-sm text-steel">Dernière mise à jour : {store.legalLastUpdated}</p>
        {(isDemo || !store.legalTextsReviewed) && (
          <p className="mt-6 rounded-2xl bg-warn-bg px-5 py-4 text-sm text-warn ring-1 ring-warn/20">
            Modèle de travail : ce texte doit être complété et validé par un professionnel du droit avant toute mise en ligne. Il ne constitue pas un conseil juridique.
          </p>
        )}
      </header>
      <div className="prose-legal">{children}</div>
    </article>
  );
}
