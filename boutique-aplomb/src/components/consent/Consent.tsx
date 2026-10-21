"use client";

import Link from "next/link";
import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Consentement (CNIL / RGPD) : aucun traceur non essentiel n'est déposé
 * avant un choix explicite. « Refuser » est aussi simple que « Accepter ».
 * Si aucun outil de mesure n'est configuré, aucun bandeau n'est affiché :
 * le site n'utilise alors que du stockage strictement nécessaire (panier).
 */
const KEY = "aplomb.consent.v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // 6 mois

type Choice = { analytics: boolean; at: number };

interface ConsentApi {
  enabled: boolean;
  choice: Choice | null;
  set: (analytics: boolean) => void;
  reopen: () => void;
}

const Ctx = createContext<ConsentApi | null>(null);

export function ConsentProvider({ children, gaId }: { children: ReactNode; gaId?: string }) {
  const enabled = Boolean(gaId);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const c = raw ? (JSON.parse(raw) as Choice) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (c && Date.now() - c.at < MAX_AGE_MS) setChoice(c);
    } catch {
      /* stockage indisponible : on redemandera */
    }
    setLoaded(true);
  }, []);

  const set = useCallback((analytics: boolean) => {
    const c = { analytics, at: Date.now() };
    setChoice(c);
    setForceOpen(false);
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
    if (!analytics) {
      // Retrait du consentement : suppression des cookies de mesure.
      for (const name of document.cookie.split(";").map((c) => c.split("=")[0]!.trim())) {
        if (name.startsWith("_ga")) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
      }
    }
  }, []);

  const api: ConsentApi = { enabled, choice, set, reopen: () => setForceOpen(true) };
  const showBanner = enabled && loaded && (choice === null || forceOpen);

  return (
    <Ctx.Provider value={api}>
      {children}
      {enabled && choice?.analytics && gaId && <Analytics gaId={gaId} />}
      {showBanner && <Banner onChoice={set} />}
    </Ctx.Provider>
  );
}

export function useConsent() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useConsent hors de ConsentProvider");
  return c;
}

function Analytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},{anonymize_ip:true});`}
      </Script>
    </>
  );
}

function Banner({ onChoice }: { onChoice: (analytics: boolean) => void }) {
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md">
      <div className="card p-6 shadow-2xl">
        <h2 id="consent-title" className="font-sans text-base font-semibold">
          Mesure d&apos;audience
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite">
          Avec votre accord, nous utilisons Google Analytics pour mesurer la fréquentation du site. Aucun traceur publicitaire n&apos;est utilisé. Vous pouvez changer d&apos;avis à tout moment depuis la page{" "}
          <Link href="/cookies" className="link">
            Cookies
          </Link>
          .
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => onChoice(false)}>
            Refuser
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => onChoice(true)}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

/** Contrôle affiché sur la page Cookies. */
export function ConsentSettings() {
  const { enabled, choice, set } = useConsent();
  if (!enabled) {
    return <p className="rounded-2xl bg-mist px-5 py-4 text-sm">Aucun outil de mesure d&apos;audience ni traceur publicitaire n&apos;est actuellement utilisé sur ce site.</p>;
  }
  return (
    <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm">
        Mesure d&apos;audience (Google Analytics) :{" "}
        <strong>{choice === null ? "aucun choix enregistré" : choice.analytics ? "acceptée" : "refusée"}</strong>
      </p>
      <div className="flex gap-3">
        <button type="button" className="btn btn-ghost" onClick={() => set(false)}>
          Refuser
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => set(true)}>
          Accepter
        </button>
      </div>
    </div>
  );
}
