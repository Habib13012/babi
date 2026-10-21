const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** Centimes → « 69,00 € ». */
export function formatPrice(cents: number): string {
  return eur.format(cents / 100).replace(/ /g, " ");
}

/** Centimes → « 69.00 EUR » (format attendu par Google Merchant Center). */
export function feedPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`;
}

export function formatRange([min, max]: [number, number], unit = "jours ouvrés"): string {
  return min === max ? `${min} ${unit}` : `${min} à ${max} ${unit}`;
}
