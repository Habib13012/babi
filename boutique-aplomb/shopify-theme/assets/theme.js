/* Aplomb — comportements du thème (sans dépendance). */
(() => {
  document.documentElement.classList.remove("no-js");

  // En-tête : fond au défilement, menu mobile accessible.
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const toggle = header.querySelector("[data-menu-toggle]");
    const menu = document.getElementById("menu-mobile");
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("[data-label]").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
      menu.hidden = !open;
      header.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle?.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Apparition au défilement (contenu lisible sans JS).
  const reveals = document.querySelectorAll(".reveal");
  const rio = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), rio.unobserve(e.target))),
    { rootMargin: "0px 0px -10% 0px" },
  );
  reveals.forEach((el) => rio.observe(el));

  // 3D : le module three.js n'est chargé qu'à l'approche d'une zone 3D, si WebGL est disponible.
  const zones = document.querySelectorAll("[data-aplomb-3d]");
  const src = document.querySelector("meta[name='aplomb-3d-src']")?.content;
  const hasWebGL = (() => {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  })();
  if (zones.length && src && hasWebGL) {
    let loaded = false;
    const zio = new IntersectionObserver(
      (entries) => {
        if (loaded || !entries.some((e) => e.isIntersecting)) return;
        loaded = true;
        zio.disconnect();
        import(src).catch(() => {});
      },
      { rootMargin: "300px" },
    );
    zones.forEach((z) => zio.observe(z));
  }

  // Quantité.
  document.querySelectorAll("[data-qty]").forEach((wrap) => {
    const input = wrap.querySelector("input");
    const max = Number(input.max) || 99;
    wrap.querySelector("[data-qty-minus]")?.addEventListener("click", () => (input.value = Math.max(1, Number(input.value) - 1)));
    wrap.querySelector("[data-qty-plus]")?.addEventListener("click", () => (input.value = Math.min(max, Number(input.value) + 1)));
  });

  // Ajout au panier sans rechargement (le formulaire fonctionne aussi sans JS).
  document.querySelectorAll("[data-product-form]").forEach((form) => {
    const status = form.querySelector("[data-status]");
    const priceEl = document.querySelector("[data-price]");
    const variants = JSON.parse(form.querySelector("[data-variants]")?.textContent || "[]");

    form.addEventListener("change", (e) => {
      if (e.target.name !== "id") return;
      const v = variants.find((x) => String(x.id) === e.target.value);
      if (!v) return;
      form.querySelector("[data-selected-name]").textContent = v.title;
      form.querySelectorAll("[data-buy]").forEach((b) => (b.disabled = !v.available));
      if (priceEl) priceEl.textContent = v.price;
      const url = new URL(location.href);
      url.searchParams.set("variant", v.id);
      history.replaceState(null, "", url);
    });

    form.addEventListener("submit", async (e) => {
      const submitter = e.submitter;
      if (!submitter || submitter.name === "checkout") return; // « Acheter maintenant » : envoi classique vers le paiement
      e.preventDefault();
      submitter.disabled = true;
      try {
        const res = await fetch(`${window.Shopify?.routes?.root || "/"}cart/add.js`, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        const body = await res.json();
        if (!res.ok) throw new Error(body.description || body.message || "Ajout impossible.");
        const cart = await (await fetch(`${window.Shopify?.routes?.root || "/"}cart.js`)).json();
        document.querySelectorAll("[data-cart-count]").forEach((el) => {
          el.textContent = cart.item_count;
          el.hidden = cart.item_count === 0;
        });
        status.innerHTML = `${body.quantity} × ${body.product_title} ajouté au panier. <a class="link" href="/cart">Voir le panier</a>`;
      } catch (err) {
        status.textContent = err.message;
      } finally {
        submitter.disabled = false;
      }
    });
  });
})();
