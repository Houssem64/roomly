/**
 * Roomly — rapatrie les données de MongoDB Atlas (le "cloud") vers le
 * MongoDB installé sur ce PC.
 *
 * IMPORTANT : Atlas est ouvert en LECTURE SEULE. Le script n'y écrit
 * jamais rien : il ne fait que lire, copier, puis travailler sur la
 * copie locale.
 *
 * Ce qu'il fait, dans l'ordre :
 *   1. copie chaque collection en gardant les identifiants (_id) intacts,
 *      pour que les liens entre utilisateurs / annonces / réservations
 *      restent valides ;
 *   2. télécharge les photos qui étaient hébergées chez Cloudinary dans
 *      le dossier public/uploads/ ;
 *   3. remplace les adresses internet des photos par des chemins locaux.
 *
 * Le script est ré-exécutable sans risque : les doublons sont ignorés.
 *
 * Usage : npm run db:migrate
 */
import { MongoClient } from "mongodb";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const UPLOADS_DIR = path.join(ROOT, "public", "uploads");
const PLACEHOLDER = "/images/placeholder.jpg";

// Ordre volontaire : les "parents" avant les "enfants".
const COLLECTIONS = [
  "Admin",
  "User",
  "Account",
  "Session",
  "Listing",
  "Reservation",
  "VerificationToken",
];

const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

/** Petit lecteur de .env : évite d'ajouter une dépendance dotenv. */
async function readEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

/** Télécharge une image distante dans public/uploads. Renvoie le chemin local ou null. */
async function downloadImage(url) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) return null;

    const mime = (res.headers.get("content-type") || "").split(";")[0].trim();
    let ext = EXT_BY_MIME[mime];
    if (!ext) {
      const guessed = path.extname(new URL(url).pathname).toLowerCase();
      ext = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].includes(guessed) ? guessed : ".jpg";
    }

    // Nom déterministe : la même URL donne toujours le même fichier,
    // donc relancer le script ne duplique pas les images.
    const name = crypto.createHash("sha1").update(url).digest("hex").slice(0, 16) + ext;
    await fs.writeFile(path.join(UPLOADS_DIR, name), buf);
    return "/uploads/" + name;
  } catch {
    return null;
  }
}

async function main() {
  const env = await readEnv();
  const atlasUrl = process.env.ATLAS_DATABASE_URL || env.ATLAS_DATABASE_URL;
  const localUrl = process.env.DATABASE_URL || env.DATABASE_URL;

  if (!atlasUrl) {
    console.error("✖ ATLAS_DATABASE_URL est absent du fichier .env — rien à migrer.");
    process.exit(1);
  }
  if (!localUrl) {
    console.error("✖ DATABASE_URL est absent du fichier .env.");
    process.exit(1);
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  console.log("→ Connexion à MongoDB Atlas (lecture seule)...");
  // Certains réseaux (pare-feu, VPN, DNS filtré) bloquent les requêtes DNS de
  // type "SRV" utilisées par les adresses « mongodb+srv:// ». On réessaie
  // alors avec l'adresse directe, si elle est renseignée dans .env.
  const atlasDirect = process.env.ATLAS_DATABASE_URL_DIRECT || env.ATLAS_DATABASE_URL_DIRECT;
  const candidates = [atlasUrl, atlasDirect].filter(Boolean);

  let source = null;
  let lastError = null;
  for (const uri of candidates) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20000 });
    try {
      await client.connect();
      source = client;
      if (uri === atlasDirect && candidates.length > 1) {
        console.log("  (adresse SRV injoignable — bascule sur l'adresse directe)");
      }
      break;
    } catch (err) {
      lastError = err;
      await client.close().catch(() => {});
    }
  }

  if (!source) {
    console.error("\n✖ Impossible de joindre Atlas. Êtes-vous connecté à Internet ?");
    console.error("  Détail : " + lastError.message);
    if (/querySrv/i.test(lastError.message) && !atlasDirect) {
      console.error("\n  Votre réseau bloque les requêtes DNS « SRV ».");
      console.error("  Renseignez ATLAS_DATABASE_URL_DIRECT dans .env (voir .env.example).");
    }
    process.exit(1);
  }

  console.log("→ Connexion à MongoDB local...");
  const target = new MongoClient(localUrl, { serverSelectionTimeoutMS: 10000 });
  try {
    await target.connect();
  } catch (err) {
    console.error("\n✖ Impossible de joindre MongoDB local.");
    console.error("  Avez-vous lancé  npm run db:init  ?");
    console.error("  Détail : " + err.message);
    await source.close();
    process.exit(1);
  }

  const srcDb = source.db();
  const dstDb = target.db();
  const report = [];

  // ---------- 1. Copie des collections ----------
  for (const name of COLLECTIONS) {
    const docs = await srcDb.collection(name).find({}).toArray(); // LECTURE SEULE
    if (docs.length === 0) {
      report.push({ collection: name, lus: 0, copies: 0, deja_presents: 0 });
      console.log("  · " + name.padEnd(18) + " vide");
      continue;
    }

    let inserted = 0;
    let duplicates = 0;
    try {
      const res = await dstDb.collection(name).insertMany(docs, { ordered: false });
      inserted = res.insertedCount;
    } catch (err) {
      // insertMany non ordonné : les doublons échouent, le reste passe quand même.
      inserted = err.result?.insertedCount ?? err.insertedCount ?? 0;
      const writeErrors = err.writeErrors || [];
      duplicates = writeErrors.filter((e) => (e.err?.code ?? e.code) === 11000).length;
      const others = writeErrors.filter((e) => (e.err?.code ?? e.code) !== 11000);
      if (others.length) {
        console.warn(
          "  ⚠ " + name + " : " + others.length + " erreur(s) inattendue(s), ex. " +
            (others[0].err?.errmsg || others[0].errmsg)
        );
      }
    }

    report.push({ collection: name, lus: docs.length, copies: inserted, deja_presents: duplicates });
    console.log(
      "  ✓ " + name.padEnd(18) + docs.length + " lus, " + inserted + " copiés, " + duplicates + " déjà présents"
    );
  }

  // ---------- 2. Photos : du cloud vers public/uploads ----------
  console.log("\n→ Téléchargement des photos vers public/uploads (copie locale uniquement)...");
  const cache = new Map(); // une même URL n'est téléchargée qu'une seule fois
  let downloaded = 0;
  let failed = 0;

  async function localise(url) {
    if (cache.has(url)) return cache.get(url);
    const local = await downloadImage(url);
    cache.set(url, local);
    if (local) downloaded++;
    else failed++;
    return local;
  }

  // Annonces sans photo du tout (données incomplètes côté Atlas) : on leur
  // donne l'image par défaut, sinon l'affichage plante côté navigateur.
  const emptied = await dstDb
    .collection("Listing")
    .updateMany(
      { $or: [{ imageSrc: "" }, { imageSrc: null }, { imageSrc: { $exists: false } }] },
      { $set: { imageSrc: PLACEHOLDER } }
    );
  if (emptied.modifiedCount > 0) {
    console.log("  · " + emptied.modifiedCount + " annonce(s) sans photo → image par défaut");
  }

  // Photos des annonces
  const listings = await dstDb.collection("Listing").find({ imageSrc: /^https?:\/\//i }).toArray();
  for (const l of listings) {
    const local = await localise(l.imageSrc);
    await dstDb
      .collection("Listing")
      .updateOne({ _id: l._id }, { $set: { imageSrc: local || PLACEHOLDER } });
    console.log(
      "  " + (local ? "✓" : "✖") + " " + String(l.title).slice(0, 38).padEnd(40) + " → " + (local || PLACEHOLDER)
    );
  }
  if (listings.length === 0) console.log("  (aucune photo distante à rapatrier)");

  // Avatars des utilisateurs
  const users = await dstDb.collection("User").find({ image: /^https?:\/\//i }).toArray();
  for (const u of users) {
    const local = await localise(u.image);
    if (local) {
      await dstDb.collection("User").updateOne({ _id: u._id }, { $set: { image: local } });
    } else {
      // Pas de photo récupérable : on retire l'avatar, l'interface
      // affichera alors l'image par défaut.
      await dstDb.collection("User").updateOne({ _id: u._id }, { $unset: { image: "" } });
    }
  }

  // ---------- 3. Résumé ----------
  console.log("\n──────────────── RÉSUMÉ ────────────────");
  console.table(report);
  console.log("Photos téléchargées : " + downloaded);
  console.log("Photos introuvables : " + failed + (failed ? "  (remplacées par l'image par défaut)" : ""));

  const stillRemote = await dstDb.collection("Listing").countDocuments({ imageSrc: /^https?:\/\//i });
  console.log(
    stillRemote === 0
      ? "✓ Plus aucune annonce ne dépend d'une image hébergée sur Internet."
      : "⚠ " + stillRemote + " annonce(s) pointent encore vers une image distante."
  );

  await source.close();
  await target.close();
  console.log("\n  Étape suivante :  npm run db:images  puis  npm run db:seed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
