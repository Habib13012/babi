/**
 * Contrôle de mise en production : liste les informations manquantes.
 * Code de sortie 1 s'il reste des bloquants (utilisé avant le build de production).
 *
 *   npm run check:launch                       → données du mode courant (STORE_DATA_MODE)
 *   STORE_DATA_MODE=production npm run check:launch
 */
import { getStoreData } from "../src/data/index";
import { getLaunchBlockers } from "../src/lib/readiness";

const data = getStoreData();
const blockers = getLaunchBlockers(data);

if (blockers.length === 0) {
  console.log(`✔ Aucun bloquant (mode ${data.mode}).`);
  process.exit(0);
}

console.log(`✘ ${blockers.length} bloquant(s) avant mise en production (mode ${data.mode}) :\n`);
const byArea = Map.groupBy(blockers, (b) => b.area);
for (const [area, list] of byArea) {
  console.log(`■ ${area.toUpperCase()}`);
  for (const b of list) console.log(`  - ${b.label}\n      → ${b.howTo}`);
  console.log("");
}
process.exit(1);
