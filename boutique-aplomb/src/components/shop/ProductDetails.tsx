import Image from "next/image";
import { StandIllustration } from "@/components/three/StandIllustration";
import { Missing } from "@/components/ui/Missing";
import type { Product, Spec } from "@/data/types";

export function SpecTable({ specs, empty }: { specs: Spec[]; empty: string }) {
  if (specs.length === 0) return <p><Missing>{empty}</Missing></p>;
  return (
    <dl className="divide-y divide-ink/10 border-y border-ink/10">
      {specs.map((s) => (
        <div key={s.label} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
          <dt className="font-semibold">{s.label}</dt>
          <dd className="text-graphite">
            {s.value}
            {!s.verified && (
              <span className="ml-2 inline-flex rounded-full bg-warn-bg px-2 py-0.5 align-middle text-[0.65rem] font-bold uppercase tracking-wider text-warn ring-1 ring-warn/30">
                à confirmer
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Gallery({ product }: { product: Product }) {
  const photos = product.images.filter((i) => i.kind === "photo");
  if (photos.length === 0) {
    return (
      <div className="card relative grid aspect-[4/3] place-items-center overflow-hidden">
        <StandIllustration className="h-full w-full p-10 opacity-70" />
        <p className="absolute inset-x-4 bottom-4 text-center text-sm">
          <Missing>photos réelles du produit</Missing>
        </p>
      </div>
    );
  }
  const [main, ...rest] = photos;
  return (
    <div className="grid gap-3">
      <div className="card overflow-hidden">
        <Image src={main!.src} alt={main!.alt} width={main!.width} height={main!.height} priority sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
      </div>
      {rest.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {rest.map((img) => (
            <li key={img.src} className="card overflow-hidden">
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" sizes="(min-width: 1024px) 16vw, 33vw" className="h-auto w-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Informations de sécurité produit (RGSP, règlement UE 2023/988). */
export function SafetyInfo({ product }: { product: Product }) {
  const m = product.manufacturer;
  const rp = product.euResponsiblePerson;
  return (
    <dl className="grid gap-6 text-sm sm:grid-cols-2">
      <div>
        <dt className="font-semibold">Fabricant</dt>
        <dd className="mt-1 text-graphite">{m ? `${m.name} — ${m.address} — ${m.contact}` : <Missing>nom, adresse et contact du fabricant</Missing>}</dd>
      </div>
      <div>
        <dt className="font-semibold">Personne responsable dans l&apos;UE</dt>
        <dd className="mt-1 text-graphite">{rp ? `${rp.name} — ${rp.address} — ${rp.contact}` : <Missing>personne responsable UE</Missing>}</dd>
      </div>
      <div>
        <dt className="font-semibold">Pays de fabrication</dt>
        <dd className="mt-1 text-graphite">{product.countryOfOrigin ?? <Missing>pays de fabrication</Missing>}</dd>
      </div>
      <div>
        <dt className="font-semibold">Référence</dt>
        <dd className="mt-1 text-graphite">
          {product.variants.map((v) => v.sku).join(", ")}
          {product.mpn ? ` · MPN ${product.mpn}` : ""}
          {product.gtin ? ` · GTIN ${product.gtin}` : ""}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="font-semibold">Avertissements et consignes</dt>
        <dd className="mt-1 text-graphite">
          {product.safetyInformation ? (
            <ul className="list-disc space-y-1 pl-5">
              {product.safetyInformation.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : (
            <Missing>consignes de sécurité du fabricant</Missing>
          )}
        </dd>
      </div>
    </dl>
  );
}
