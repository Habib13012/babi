import { z } from "zod";

export const checkoutSchema = z.object({
  lines: z
    .array(z.object({ variantId: z.string().min(1).max(40), quantity: z.number().int().min(1).max(10) }))
    .min(1)
    .max(10),
  acceptTerms: z.literal(true, { error: "Vous devez accepter les conditions générales de vente." }),
});

const text = (max: number) => z.string().trim().max(max);

export const contactSchema = z.object({
  name: text(100).min(2, "Indiquez votre nom."),
  email: z.email("Adresse e-mail invalide.").max(200),
  orderReference: text(40).optional().default(""),
  message: text(4000).min(10, "Votre message doit contenir au moins 10 caractères."),
  /** Champ piège invisible : doit rester vide. */
  website: z.string().max(0).optional().default(""),
});

export const withdrawalSchema = z.object({
  name: text(100).min(2, "Indiquez votre nom."),
  email: z.email("Adresse e-mail invalide.").max(200),
  orderReference: text(40).min(4, "Indiquez le numéro de commande (ex. APL-1A2B3C4D)."),
  items: text(500).optional().default(""),
  website: z.string().max(0).optional().default(""),
});

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
