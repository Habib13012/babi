import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ConsentProvider } from "@/components/consent/Consent";
import { CartProvider } from "@/components/shop/CartProvider";
import { Footer } from "@/components/shop/Footer";
import { Header } from "@/components/shop/Header";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { RevealObserver } from "@/components/ui/Reveal";
import { isDemo, store } from "@/data";
import { siteUrl } from "@/lib/site";
import { organizationJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Aplomb — Socle 01, support d'ordinateur portable en aluminium", template: "%s · Aplomb" },
  description: store.product.shortDescription,
  applicationName: "Aplomb",
  // Le mode démonstration n'est jamais indexé.
  robots: isDemo ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="no-js">
      <body className="flex min-h-dvh flex-col">
        <a href="#contenu" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-chalk focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Aller au contenu
        </a>
        <ConsentProvider gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined}>
          <CartProvider maxQuantity={store.payment.maxQuantityPerOrder}>
            {isDemo && <DemoBanner />}
            <Header />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <Footer data={store} />
          </CartProvider>
        </ConsentProvider>
        <RevealObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(store, siteUrl)) }} />
      </body>
    </html>
  );
}
