import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";
import { WithdrawalForm } from "./WithdrawalForm";

export const metadata = pageMetadata({ title: "Se rétracter du contrat", description: "Exercer votre droit de rétractation en ligne.", path: "/retractation", noindex: isDemo });

export default function Page() {
  return (
    <LegalPage
      title="Se rétracter du contrat"
      intro={<>Vous disposez de {store.returns.withdrawalDays} jours après réception pour vous rétracter, sans justification. Remplissez ce formulaire puis confirmez : un accusé de réception horodaté vous est envoyé par e-mail.</>}
    >
      <div className="not-prose max-w-xl">
        <WithdrawalForm />
      </div>
      <p>
        Vous pouvez aussi utiliser le <Link href="/cgv#annexe">formulaire type</Link> ou nous écrire par e-mail ou courrier. Conditions de renvoi et de remboursement : <Link href="/retours">Retours et remboursements</Link>.
      </p>
    </LegalPage>
  );
}
