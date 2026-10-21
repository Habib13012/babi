import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { store } from "@/data";
import { pageMetadata } from "@/lib/metadata";
import { getPaymentAvailability } from "@/lib/payments/stripe";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({ title: "Paiement sécurisé", description: "Finaliser votre commande Aplomb.", path: "/paiement", noindex: true });

export default function CheckoutPage() {
  const pay = getPaymentAvailability(store);
  return (
    <div className="container-page py-12">
      <h1 className="mb-3 text-5xl">Paiement sécurisé</h1>
      <p className="mb-10 max-w-2xl text-graphite/85">Vérifiez votre commande. Le paiement par carte se fait ensuite sur la page sécurisée de notre prestataire Stripe.</p>
      <CheckoutForm data={store} available={pay.ok} unavailableReason={pay.ok ? undefined : pay.reason} testMode={pay.ok && pay.testMode} />
    </div>
  );
}
