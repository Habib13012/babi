import { Faq, faqItems } from "@/content/faq";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Questions fréquentes", description: "Compatibilité, livraison, retours, paiement et garanties de Socle 01.", path: "/faq", noindex: isDemo });

export default function Page() {
  return (
    <div className="container-page py-14 md:py-20">
      <h1 className="mb-12 text-5xl md:text-6xl">Questions fréquentes</h1>
      <div className="max-w-3xl">
        <Faq items={faqItems(store)} />
      </div>
    </div>
  );
}
