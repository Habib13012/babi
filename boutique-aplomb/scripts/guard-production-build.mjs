// Exécuté avant `next build` : en mode production, le build échoue
// tant que des informations bloquantes manquent.
import { spawnSync } from "node:child_process";

if (process.env.STORE_DATA_MODE === "production") {
  const r = spawnSync("npx", ["tsx", "scripts/check-launch.ts"], { stdio: "inherit", env: process.env });
  if (r.status !== 0) {
    console.error("\nBuild de production refusé : complétez les informations ci-dessus (src/data/production.ts et variables d'environnement).");
    process.exit(1);
  }
}
