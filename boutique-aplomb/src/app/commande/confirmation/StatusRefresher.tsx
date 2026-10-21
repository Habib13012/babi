"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/components/shop/CartProvider";

/** Rafraîchit la page tant que le webhook n'a pas confirmé le paiement ; vide le panier une fois payé. */
export function StatusRefresher({ status }: { status: string }) {
  const router = useRouter();
  const { clear, ready, count } = useCart();

  useEffect(() => {
    if ((status === "paid" || status === "needs_review") && ready && count > 0) clear();
  }, [status, ready, count, clear]);

  useEffect(() => {
    if (status !== "pending") return;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (tries > 20) window.clearInterval(id);
      else router.refresh();
    }, 3000);
    return () => window.clearInterval(id);
  }, [status, router]);

  return null;
}
