/**
 * Roomly — télécharge UNE SEULE FOIS les photos de démonstration.
 *
 * Les images sont enregistrées dans public/uploads/seed/. Une fois cette
 * étape faite, l'application n'a plus jamais besoin d'Internet pour
 * afficher les biens.
 *
 * Le script ignore les fichiers déjà présents : on peut le relancer sans
 * rien re-télécharger.
 *
 * Usage : npm run db:images
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_IMAGES } from "./seed-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_DIR = path.join(__dirname, "..", "public", "uploads", "seed");

async function exists(p) {
  try {
    const st = await fs.stat(p);
    return st.size > 0;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error("HTTP " + res.status);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error("fichier vide ou trop petit");

  await fs.writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(SEED_DIR, { recursive: true });

  console.log("→ Photos de démonstration vers public/uploads/seed/\n");

  let downloaded = 0;
  let skipped = 0;
  const failures = [];

  for (const { file, url } of SEED_IMAGES) {
    const dest = path.join(SEED_DIR, file);

    if (await exists(dest)) {
      console.log("  · " + file.padEnd(20) + " déjà présent");
      skipped++;
      continue;
    }

    try {
      const size = await download(url, dest);
      console.log("  ✓ " + file.padEnd(20) + Math.round(size / 1024) + " Ko");
      downloaded++;
    } catch (err) {
      console.log("  ✖ " + file.padEnd(20) + "échec (" + err.message + ")");
      failures.push(file);
    }
  }

  console.log(
    "\n" + downloaded + " téléchargée(s), " + skipped + " déjà présente(s), " + failures.length + " en échec."
  );

  if (failures.length) {
    console.log("\n⚠ Certaines photos n'ont pas pu être récupérées.");
    console.log("  Les annonces concernées utiliseront l'image par défaut.");
    console.log("  Relancez  npm run db:images  quand la connexion sera rétablie.");
  } else {
    console.log("✓ Toutes les photos sont sur le PC. Internet n'est plus nécessaire.");
  }

  console.log("\n  Étape suivante :  npm run db:seed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
