"use client";

import { AjaxForm } from "@/components/forms/AjaxForm";

export function ContactForm() {
  return (
    <AjaxForm
      endpoint="/api/contact"
      submitLabel="Envoyer le message"
      fields={[
        { name: "name", label: "Nom", required: true, autoComplete: "name", maxLength: 100 },
        { name: "email", label: "E-mail", type: "email", required: true, autoComplete: "email", maxLength: 200 },
        { name: "orderReference", label: "Numéro de commande", maxLength: 40 },
        { name: "message", label: "Message", type: "textarea", required: true, maxLength: 4000 },
      ]}
      success={() => (
        <>
          <h2 className="font-sans text-lg font-semibold">Message envoyé</h2>
          <p className="mt-3 text-sm">Merci. Nous vous répondons par e-mail, les jours ouvrés.</p>
        </>
      )}
    />
  );
}
