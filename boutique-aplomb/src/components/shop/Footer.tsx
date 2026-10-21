import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Val } from "@/components/ui/Missing";
import type { StoreData } from "@/data/types";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { href: "/produit/socle-01", label: "Socle 01" },
      { href: "/panier", label: "Panier" },
      { href: "/faq", label: "Questions fréquentes" },
    ],
  },
  {
    title: "Service client",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/livraison", label: "Livraison" },
      { href: "/retours", label: "Retours et remboursements" },
      { href: "/retractation", label: "Se rétracter du contrat" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgv", label: "Conditions générales de vente" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export function Footer({ data }: { data: StoreData }) {
  const s = data.seller;
  return (
    <footer className="mt-32 bg-ink text-chalk/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-5">
          <Logo tone="chalk" className="h-9 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed text-chalk/65">
            Un seul objet, conçu pour remettre l&apos;écran à la bonne hauteur.
          </p>
          <address className="text-sm not-italic leading-relaxed text-chalk/65">
            <Val value={s.legalName} label="identité du vendeur" />
            <br />
            {s.address ? (
              <>
                {s.address.street}, {s.address.postalCode} {s.address.city}
              </>
            ) : (
              <Val value={null} label="adresse" />
            )}
            <br />
            <Val value={s.email} label="e-mail" /> · <Val value={s.phone} label="téléphone" />
          </address>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-chalk/50">{col.title}</h2>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-chalk">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-chalk/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-chalk/50 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {s.tradeName}. Prix en euros{" "}
            {s.vatRegime === "franchise" ? "— TVA non applicable, art. 293 B du CGI" : "TTC"}.
          </p>
          <p>Paiement par carte traité par Stripe. Aucune donnée bancaire n&apos;est stockée par {s.tradeName}.</p>
        </div>
      </div>
    </footer>
  );
}
