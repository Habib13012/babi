import Link from "next/link";
import { Suspense } from "react";
import { Faq, faqItems } from "@/content/faq";
import { AddToCart } from "@/components/shop/AddToCart";
import { OfferSummary, PriceTag } from "@/components/shop/OfferSummary";
import { SpecTable } from "@/components/shop/ProductDetails";
import { FeatureStory } from "@/components/three/FeatureStory";
import { HeroViewer } from "@/components/three/HeroViewer";
import { isDemo, product, store } from "@/data";
import { currentStock, variantOptions } from "@/lib/inventory";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Aplomb — Socle 01, support d'ordinateur portable en aluminium",
  description: product.shortDescription,
  path: "/",
  noindex: isDemo,
});

export default function HomePage() {
  const stock = currentStock(store);
  const variants = variantOptions(store, stock);
  const purchasable = Boolean(product.price);
  const anyInStock = variants.some((v) => v.inStock);

  return (
    <>
      {/* HÉRO */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120%] bg-[radial-gradient(60%_50%_at_70%_40%,#ffffff_0%,transparent_70%)]" />
        <div className="container-page grid items-center gap-8 pb-16 pt-6 md:pt-10 lg:grid-cols-[1fr_1.15fr] lg:gap-4 lg:pb-24">
          <div className="animate-rise space-y-7 lg:pr-6">
            <p className="eyebrow">
              {product.brand} {product.name} · {product.tagline}
            </p>
            <h1 id="hero-title" className="text-display">
              L&apos;écran à hauteur
              <br /> des yeux.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-graphite/85">{product.shortDescription}</p>
            <PriceTag data={store} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="sm:w-56">
                <Suspense>
                  <AddToCart variants={variants} purchasable={purchasable} maxQuantity={store.payment.maxQuantityPerOrder} compact />
                </Suspense>
              </div>
              <Link href={`/produit/${product.slug}`} className="btn btn-ghost">
                Découvrir le produit
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-graphite/80">
              <li>Livraison en {store.shipping.zoneLabel}</li>
              <li>{store.returns.withdrawalDays} jours pour changer d&apos;avis</li>
              <li>Paiement par carte via Stripe</li>
            </ul>
          </div>
          <div className="animate-rise [animation-delay:150ms]">
            <HeroViewer model={product.model} variants={product.variants} />
          </div>
        </div>
      </section>

      {/* BÉNÉFICES */}
      <section id="decouvrir" className="container-page py-20 md:py-28" aria-labelledby="benefits-title">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Ce qu&apos;il fait</p>
          <h2 id="benefits-title" className="mt-4 text-4xl md:text-5xl">
            Un objet simple, réglé pour le travail de tous les jours.
          </h2>
        </div>
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {product.benefits.map((b, i) => (
            <li key={b.title} className="reveal card p-8" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="font-display text-5xl text-copper/80">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-graphite/85">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* RÉCIT 3D */}
      <section className="bg-chalk py-20 md:py-28" aria-labelledby="story-title">
        <div className="container-page">
          <div className="reveal mb-12 max-w-2xl">
            <p className="eyebrow">En détail</p>
            <h2 id="story-title" className="mt-4 text-4xl md:text-5xl">
              Quatre gestes, un seul objet.
            </h2>
          </div>
          <FeatureStory steps={product.story} model={product.model} color={product.variants[0]?.swatch ?? "#C9CCD1"} />
        </div>
      </section>

      {/* UTILISATION */}
      <section className="container-page py-20 md:py-28" aria-labelledby="usage-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="reveal">
            <p className="eyebrow">Utilisation</p>
            <h2 id="usage-title" className="mt-4 text-4xl md:text-5xl">
              Installé en quelques secondes.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-graphite/85">{product.description[2]}</p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-[1.5rem] bg-ink/10 sm:grid-cols-2">
            {product.usageSteps.map((s, i) => (
              <li key={s.title} className="reveal bg-paper p-8">
                <span className="text-sm font-semibold text-copper">Étape {i + 1}</span>
                <h3 className="mt-3 text-2xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-graphite/85">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="container-page" aria-labelledby="audience-title">
        <div className="reveal grid gap-10 rounded-[2rem] bg-ink p-8 text-chalk md:grid-cols-2 md:p-14">
          <div>
            <p className="eyebrow !text-chalk/60">Pour qui</p>
            <h2 id="audience-title" className="mt-4 text-3xl md:text-4xl">
              Pensé pour vous si…
            </h2>
            <ul className="mt-6 space-y-3 text-chalk/85">
              {product.audience.map((a) => (
                <li key={a} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-light" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl md:mt-14">Moins adapté si…</h3>
            <ul className="mt-6 space-y-3 text-chalk/85">
              {product.notFor.map((a) => (
                <li key={a} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-chalk/40" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OFFRE */}
      <section id="offre" className="container-page py-20 md:py-28" aria-labelledby="offer-title">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="reveal space-y-6">
            <p className="eyebrow">L&apos;offre</p>
            <h2 id="offer-title" className="text-4xl md:text-5xl">
              Un prix, tout compris, affiché avant le paiement.
            </h2>
            <PriceTag data={store} />
            <Suspense>
              <AddToCart variants={variants} purchasable={purchasable} maxQuantity={store.payment.maxQuantityPerOrder} />
            </Suspense>
            {!anyInStock && purchasable && <p className="text-sm text-steel">Aucune finition n&apos;est en stock actuellement.</p>}
          </div>
          <div className="reveal space-y-8">
            <OfferSummary data={store} inStock={anyInStock} />
            <div>
              <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-steel">Dans le colis</h3>
              <SpecTable specs={product.boxContents} empty="contenu exact du colis" />
              <p className="mt-3 text-sm text-steel">Non inclus : {product.notIncluded.join(", ").toLowerCase()}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page" aria-labelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="reveal">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="mt-4 text-4xl">
              Avant de commander.
            </h2>
            <Link href="/faq" className="link mt-6 inline-block">
              Toutes les questions
            </Link>
          </div>
          <Faq items={faqItems(store).slice(0, 5)} />
        </div>
      </section>
    </>
  );
}
