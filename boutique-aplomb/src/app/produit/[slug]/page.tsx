import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Faq, faqItems } from "@/content/faq";
import { AddToCart } from "@/components/shop/AddToCart";
import { OfferSummary, PriceTag } from "@/components/shop/OfferSummary";
import { Gallery, SafetyInfo, SpecTable } from "@/components/shop/ProductDetails";
import { HeroViewer } from "@/components/three/HeroViewer";
import { isDemo, product, store } from "@/data";
import { currentStock, variantOptions } from "@/lib/inventory";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { productJsonLd } from "@/lib/structured-data";

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: product.slug }];
}

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  if (slug !== product.slug) return {};
  const photo = product.images.find((i) => i.kind === "photo");
  return {
    ...pageMetadata({
      title: `${product.brand} ${product.name} — ${product.tagline}`,
      description: product.shortDescription,
      path: `/produit/${product.slug}`,
      noindex: isDemo,
    }),
    ...(photo ? { openGraph: { images: [{ url: absoluteUrl(photo.src), width: photo.width, height: photo.height, alt: photo.alt }] } } : {}),
  };
}

export default async function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  if (slug !== product.slug) notFound();

  const stock = currentStock(store);
  const variants = variantOptions(store, stock);
  const anyInStock = variants.some((v) => v.inStock);
  const jsonLd = productJsonLd(store, stock, siteUrl);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: `${product.brand} ${product.name}`, item: absoluteUrl(`/produit/${product.slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="container-page pt-6">
        <nav aria-label="Fil d'Ariane" className="text-sm text-steel">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="container-page grid gap-12 py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Gallery product={product} />
          <div className="card p-4">
            <HeroViewer model={product.model} variants={product.variants} />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="eyebrow">{product.tagline}</p>
            <h1 className="mt-3 text-5xl md:text-6xl">
              {product.brand} {product.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-graphite/85">{product.shortDescription}</p>
          </div>
          <PriceTag data={store} />
          <Suspense>
            <AddToCart variants={variants} purchasable={Boolean(product.price)} maxQuantity={store.payment.maxQuantityPerOrder} />
          </Suspense>
          <OfferSummary data={store} inStock={anyInStock} />

          <div className="space-y-4 leading-relaxed text-graphite">
            <h2 className="text-3xl text-ink">Description</h2>
            {product.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div id="caracteristiques" className="scroll-mt-28">
            <h2 className="mb-4 text-3xl">Caractéristiques</h2>
            <SpecTable specs={product.specs} empty="caractéristiques techniques confirmées" />
          </div>

          <div>
            <h2 className="mb-4 text-3xl">Contenu du colis</h2>
            <SpecTable specs={product.boxContents} empty="contenu exact du colis" />
            <p className="mt-3 text-sm text-steel">Non inclus : {product.notIncluded.join(", ").toLowerCase()}.</p>
          </div>

          <div>
            <h2 className="mb-4 text-3xl">Utilisation</h2>
            <ol className="space-y-3">
              {product.usageSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-chalk">{i + 1}</span>
                  <p className="pt-1">
                    <strong>{s.title}.</strong> {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="mb-4 text-3xl">Sécurité et traçabilité</h2>
            <SafetyInfo product={product} />
          </div>
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="faq-produit">
        <h2 id="faq-produit" className="mb-8 text-4xl">
          Questions fréquentes
        </h2>
        <Faq items={faqItems(store)} />
      </section>
    </>
  );
}
