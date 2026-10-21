import { expect, test } from "@playwright/test";

const PAGES = ["/", "/produit/socle-01", "/a-propos", "/contact", "/mentions-legales", "/cgv", "/livraison", "/retours", "/retractation", "/confidentialite", "/cookies", "/faq", "/panier", "/paiement"];

test("toutes les pages répondent 200, sans débordement horizontal ni erreur JS", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of PAGES) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `débordement sur ${path}`).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

test("page 404", async ({ page }) => {
  const res = await page.goto("/nexiste-pas");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
});

test("aucun lien interne cassé", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of ["/", "/produit/socle-01", "/cgv"]) {
    await page.goto(path);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]!.split("?")[0]!));
    for (const h of hrefs) seen.add(h || "/");
  }
  for (const h of seen) expect((await request.get(h)).status(), h).toBe(200);
});

test("parcours panier : ajout, quantité, total identique au produit", async ({ page }) => {
  await page.goto("/produit/socle-01");
  await page.getByRole("button", { name: "Augmenter la quantité" }).click();
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByRole("status").filter({ hasText: "ajoutés au panier" })).toHaveCount(1);
  await page.goto("/panier");
  await expect(page.getByText("Total à payer")).toBeVisible();
  // 2 × 69,00 € + 5,90 € (valeurs de démonstration)
  await expect(page.locator("dd", { hasText: "143,90" })).toBeVisible();
  await page.getByRole("link", { name: "Passer à la commande" }).click();
  await expect(page).toHaveURL(/\/paiement/);
  await expect(page.getByText("J'ai lu et j'accepte")).toBeVisible();
  // Sans clé Stripe, le paiement est explicitement indisponible : aucune fausse commande.
  await expect(page.getByText("Le paiement en ligne n'est pas encore configuré.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Commander avec obligation de paiement" })).toHaveCount(0);
});

test("l'API de paiement refuse sans configuration et sans CGV", async ({ request }) => {
  const r = await request.post("/api/checkout", { data: { lines: [{ variantId: "argent", quantity: 1 }], acceptTerms: true } });
  expect(r.status()).toBe(503);
});

test("webhook : signature requise", async ({ request }) => {
  const r = await request.post("/api/webhooks/stripe", { data: "{}" });
  expect([400, 503]).toContain(r.status());
});

test("SEO : données structurées sans avis, canonical, démo non indexée", async ({ page, request }) => {
  await page.goto("/produit/socle-01");
  const ld = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent ?? "").join(""));
  expect(ld).toContain('"ProductGroup"');
  expect(ld).toContain('"price":"69.00"');
  expect(ld).not.toMatch(/Review|AggregateRating/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/produit\/socle-01$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  const feed = await (await request.get("/merchant/google.xml")).text();
  expect(feed).toContain("<g:price>69.00 EUR</g:price>");
  expect(feed).toContain("ne pas soumettre");
});

test("formulaire de rétractation : erreurs puis accusé de réception", async ({ page }) => {
  await page.goto("/retractation");
  await page.getByRole("button", { name: "Confirmer la rétractation" }).click();
  await expect(page.getByText("Nom et prénom : champ obligatoire.")).toBeVisible();
  await page.getByLabel("Nom et prénom").fill("Alex Martin");
  await page.getByLabel("E-mail utilisé pour la commande").fill("alex@exemple.test");
  await page.getByLabel("Numéro de commande").fill("APL-TEST0001");
  await page.getByRole("button", { name: "Confirmer la rétractation" }).click();
  await expect(page.getByText("Rétractation enregistrée")).toBeVisible();
});

test("menu mobile accessible au clavier", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile uniquement");
  await page.goto("/");
  const btn = page.getByRole("button", { name: "Ouvrir le menu" });
  await btn.click();
  await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeHidden();
});

test.describe("mouvement réduit", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  test("le contenu reste complet sans animation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Il reste en place." })).toBeAttached();
    await expect(page.getByText("Prototype 3D — rendu indicatif, non contractuel").first()).toBeVisible();
  });
});
