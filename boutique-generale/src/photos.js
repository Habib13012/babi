const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const B = '/home/user/babi/boutique-generale/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2.5 });
  for (const k of ['repas', 'routines', 'grossesse', 'bebe', 'habitudes', 'recompenses', 'valise', 'naissance', 'pack1', 'pack2', 'pack3']) {
    fs.mkdirSync(B + 'produits/' + k, { recursive: true });
    for (const t of (k.startsWith('pack') ? ['1'] : ['1', '2'])) {
      await p.goto(`file://${B}src/photo.html?k=${k}&t=${t}`); await p.waitForTimeout(500);
      await p.screenshot({ path: `${B}produits/${k}/photo-${t}.jpg`, type: 'jpeg', quality: 90 });
    }
  }
  await b.close(); console.log('ok');
})();
