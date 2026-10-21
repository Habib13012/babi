"use client";

import { AjaxForm } from "@/components/forms/AjaxForm";

export function WithdrawalForm() {
  return (
    <AjaxForm
      endpoint="/api/retractation"
      submitLabel="Confirmer la rétractation"
      fields={[
        { name: "name", label: "Nom et prénom", required: true, autoComplete: "name", maxLength: 100 },
        { name: "email", label: "E-mail utilisé pour la commande", type: "email", required: true, autoComplete: "email", maxLength: 200, hint: "L'accusé de réception y sera envoyé." },
        { name: "orderReference", label: "Numéro de commande", required: true, maxLength: 40, hint: "Indiqué dans l'e-mail de confirmation, ex. APL-1A2B3C4D." },
        { name: "items", label: "Articles concernés", maxLength: 500, hint: "Laissez vide si la rétractation porte sur toute la commande." },
      ]}
      success={(b) => (
        <>
          <h2 className="font-sans text-lg font-semibold">Rétractation enregistrée</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Référence <strong>{String(b.id)}</strong>, reçue le {new Date(String(b.receivedAt)).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}. Un accusé de réception vous est envoyé par e-mail. Conservez cette référence.
          </p>
        </>
      )}
    />
  );
}
