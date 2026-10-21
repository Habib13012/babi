import { Val } from "@/components/ui/Missing";
import { Address } from "@/components/ui/SellerBits";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "./ContactForm";

export const metadata = pageMetadata({ title: "Contact", description: "Contacter le service client Aplomb.", path: "/contact", noindex: isDemo });

export default function Page() {
  const s = store.seller;
  return (
    <div className="container-page grid gap-14 py-14 md:py-20 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <h1 className="text-5xl md:text-6xl">Contact</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite/85">Une question avant de commander, un suivi de colis, un retour ? Écrivez-nous.</p>
        <dl className="mt-10 space-y-5 text-sm">
          <div><dt className="font-semibold">E-mail</dt><dd className="mt-1 text-graphite">{s.email ? <a className="link" href={`mailto:${s.email}`}>{s.email}</a> : <Val value={null} label="e-mail" />}</dd></div>
          <div><dt className="font-semibold">Téléphone</dt><dd className="mt-1 text-graphite">{s.phone ? <a className="link" href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a> : <Val value={null} label="téléphone" />}</dd></div>
          <div><dt className="font-semibold">Adresse</dt><dd className="mt-1 text-graphite"><Val value={s.legalName} label="nom du vendeur" /><br /><Address address={s.address} /></dd></div>
        </dl>
      </div>
      <div className="card p-7 md:p-10">
        <ContactForm />
      </div>
    </div>
  );
}
