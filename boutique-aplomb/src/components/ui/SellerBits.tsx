import { Missing, Val } from "@/components/ui/Missing";
import type { PostalAddress, Seller } from "@/data/types";

export function Address({ address, label = "adresse postale" }: { address: PostalAddress | null; label?: string }) {
  if (!address) return <Missing>{label}</Missing>;
  return (
    <>
      {address.street}, {address.postalCode} {address.city}, {address.country}
    </>
  );
}

/** Bloc d'identité du vendeur, réutilisé dans les mentions légales, les CGV et la confidentialité. */
export function SellerIdentity({ seller }: { seller: Seller }) {
  return (
    <ul>
      <li>
        Nom commercial : <strong>{seller.tradeName}</strong>
      </li>
      <li>
        Dénomination / nom : <Val value={seller.legalName} label="dénomination sociale ou nom de l'entrepreneur" />
      </li>
      <li>
        Forme juridique : <Val value={seller.legalForm} label="forme juridique" />
        {seller.shareCapital ? `, capital social de ${seller.shareCapital}` : null}
      </li>
      <li>
        Adresse : <Address address={seller.address} />
      </li>
      <li>
        SIREN : <Val value={seller.siren} label="SIREN" /> — <Val value={seller.registration} label="immatriculation RCS / RNE" />
      </li>
      <li>
        TVA :{" "}
        {seller.vatRegime === "franchise" ? (
          "TVA non applicable, art. 293 B du CGI"
        ) : seller.vatRegime === "standard" ? (
          <Val value={seller.vatNumber} label="n° de TVA intracommunautaire" />
        ) : (
          <Missing>régime de TVA</Missing>
        )}
      </li>
      <li>
        E-mail : <Val value={seller.email} label="e-mail" /> — Téléphone : <Val value={seller.phone} label="téléphone" />
      </li>
    </ul>
  );
}
