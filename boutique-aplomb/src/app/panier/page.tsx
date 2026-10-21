import { Suspense } from "react";
import { CartView } from "@/components/shop/CartView";
import { store } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Panier", description: "Votre panier Aplomb.", path: "/panier", noindex: true });

export default function CartPage() {
  return (
    <div className="container-page py-12">
      <h1 className="mb-10 text-5xl">Panier</h1>
      <Suspense>
        <CartView data={store} />
      </Suspense>
    </div>
  );
}
