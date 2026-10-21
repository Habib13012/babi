import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { Val } from "@/components/ui/Missing";
import { SellerIdentity } from "@/components/ui/SellerBits";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Mentions légales", description: "Éditeur, hébergeur et informations légales du site Aplomb.", path: "/mentions-legales", noindex: isDemo });

export default function Page() {
  const s = store.seller;
  return (
    <LegalPage title="Mentions légales" intro="Informations prévues par l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).">
      <h2>Éditeur du site et vendeur</h2>
      <SellerIdentity seller={s} />
      <p>
        Directeur de la publication : <Val value={s.publicationDirector} label="directeur de la publication" />
      </p>
      <h2>Hébergeur</h2>
      {s.host ? (
        <p>
          {s.host.name} — {s.host.address} — {s.host.phone}
        </p>
      ) : (
        <p>
          <Val value={null} label="nom, adresse et téléphone de l'hébergeur" />
        </p>
      )}
      <h2>Emballages</h2>
      <p>
        Identifiant unique (REP emballages) : <Val value={s.packagingUniqueId} label="IDU délivré par l'ADEME" />
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Le nom « {s.tradeName} », le logo, les textes, les illustrations et le modèle 3D du site sont protégés. Toute reproduction sans autorisation écrite est interdite. Les polices Fraunces et Manrope sont utilisées sous licence SIL Open Font License.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Voir la <Link href="/confidentialite">politique de confidentialité</Link> et la page <Link href="/cookies">cookies</Link>.
      </p>
    </LegalPage>
  );
}
