const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/home/user/babi/boutique-generale/src/', O = '/home/user/babi/boutique-generale/produits/';
const fs = require('fs');
const P = { 'repas': 'Planning-repas-et-liste-de-courses', 'routines': 'Routines-matin-et-soir-enfants', 'grossesse': 'Suivi-de-grossesse-et-valise-maternite', 'bebe': 'Journal-de-bebe-repas-couches-sommeil', 'habitudes': 'Habitudes-et-bien-etre', 'recompenses': 'Tableau-de-recompenses-enfants' };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [k, name] of Object.entries(P)) {
    fs.mkdirSync(O + k, { recursive: true });
    await p.goto('file://' + S + k + '.html'); await p.waitForTimeout(400);
    await p.pdf({ path: `${O}${k}/${name}.pdf`, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log(k);
  }
  await b.close();
})();
