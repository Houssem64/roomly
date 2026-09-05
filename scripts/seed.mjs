/**
 * Roomly — remplit la base locale avec des données de démonstration.
 *
 * Crée :
 *   - 1 compte administrateur ;
 *   - 6 propriétaires (ils mettent des biens en location) ;
 *   - 6 locataires (ils réservent) ;
 *   - les biens de démonstration, répartis sur toutes les catégories et plusieurs gouvernorats ;
 *   - une douzaine de réservations avec différents états de paiement.
 *
 * Le script est ré-exécutable : il met à jour ce qui existe déjà plutôt
 * que de créer des doublons.
 *
 * Usage :
 *   npm run db:seed              (ajoute / met à jour)
 *   npm run db:seed -- --reset   (efface d'abord les données de démo)
 */
import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OWNERS, TENANTS, LISTINGS, SEED_IMAGES } from "./seed-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_IMG_DIR = path.join(ROOT, "public", "uploads", "seed");
const PLACEHOLDER = "/images/placeholder.jpg";

const RESET = process.argv.includes("--reset");

// ---------------------------------------------------------------- helpers

async function readEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

const nightsBetween = (a, b) => Math.max(1, Math.round((b - a) / 86400000));

/**
 * Même règle que l'application : les biens loués à la nuit (Villa, Vacation)
 * sont facturés au nombre de nuits ; les autres au prix affiché.
 */
const isNightly = (category) => category === "Villa" || category === "Vacation";

// ------------------------------------------------------------------ main

async function main() {
  const env = await readEnv();
  const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL;

  const adminEmail = process.env.SEED_ADMIN_EMAIL || env.SEED_ADMIN_EMAIL || "admin@roomly.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || env.SEED_ADMIN_PASSWORD || "admin123";
  const userPassword = process.env.SEED_USER_PASSWORD || env.SEED_USER_PASSWORD || "roomly123";

  if (!databaseUrl) {
    console.error("✖ DATABASE_URL est absent du fichier .env.");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  // --- 0. Mise à niveau des anciennes réservations -----------------------
  // Les réservations rapatriées d'Atlas n'ont pas encore les champs de
  // paiement ; Prisma refuserait de les lire. On les complète d'abord,
  // avec le pilote MongoDB brut.
  {
    const raw = new MongoClient(databaseUrl, { serverSelectionTimeoutMS: 10000 });
    try {
      await raw.connect();
    } catch (err) {
      console.error("\n✖ Impossible de joindre MongoDB local.");
      console.error("  Avez-vous lancé  npm run db:init  ?");
      console.error("  Détail : " + err.message);
      process.exit(1);
    }
    const reservations = raw.db().collection("Reservation");

    const res = await reservations.updateMany(
      { paymentStatus: { $exists: false } },
      { $set: { paymentStatus: "COMPLETED" } }
    );
    if (res.modifiedCount > 0) {
      console.log("→ " + res.modifiedCount + " ancienne(s) réservation(s) mise(s) à niveau (paiement).");
    }

    // paymentRef porte un index unique. MongoDB considère plusieurs valeurs
    // null explicites comme des doublons : on retire donc le champ au lieu
    // de le laisser à null.
    await reservations.updateMany({ paymentRef: null }, { $unset: { paymentRef: "" } });

    await raw.close();
  }

  // --- 1. Remise à zéro éventuelle des données de démo -------------------
  const seedEmails = [...OWNERS, ...TENANTS].map((p) => p.email);

  if (RESET) {
    console.log("→ Suppression des données de démonstration existantes...");
    const seeded = await prisma.user.findMany({
      where: { email: { in: seedEmails } },
      select: { id: true },
    });
    const ids = seeded.map((u) => u.id);

    if (ids.length) {
      // L'ordre compte : réservations, puis annonces, puis comptes.
      await prisma.reservation.deleteMany({
        where: { OR: [{ userId: { in: ids } }, { listing: { userId: { in: ids } } }] },
      });
      await prisma.listing.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    console.log("  " + ids.length + " compte(s) de démonstration supprimé(s).");
  }

  // --- 2. Quelles photos sont réellement disponibles ? -------------------
  const available = new Set();
  for (const { file } of SEED_IMAGES) {
    try {
      const st = await fs.stat(path.join(SEED_IMG_DIR, file));
      if (st.size > 0) available.add(file);
    } catch {
      /* photo absente */
    }
  }
  if (available.size === 0) {
    console.log("\n⚠ Aucune photo trouvée dans public/uploads/seed/.");
    console.log("  Lancez  npm run db:images  pour les télécharger.");
    console.log("  Les annonces seront créées avec l'image par défaut.\n");
  }
  const imagePath = (file) => (available.has(file) ? "/uploads/seed/" + file : PLACEHOLDER);

  // --- 3. Administrateur -------------------------------------------------
  const adminHash = await bcrypt.hash(adminPassword, 12);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { hashedPassword: adminHash },
    create: { email: adminEmail, hashedPassword: adminHash },
  });
  console.log("✓ Administrateur : " + adminEmail);

  // --- 4. Propriétaires et locataires ------------------------------------
  const userHash = await bcrypt.hash(userPassword, 12);

  const owners = [];
  for (const o of OWNERS) {
    owners.push(
      await prisma.user.upsert({
        where: { email: o.email },
        update: { name: o.name, phoneNumber: o.phoneNumber, role: "owner" },
        create: { ...o, role: "owner", hashedPassword: userHash },
      })
    );
  }
  console.log("✓ " + owners.length + " propriétaires");

  const tenants = [];
  for (const t of TENANTS) {
    tenants.push(
      await prisma.user.upsert({
        where: { email: t.email },
        update: { name: t.name, phoneNumber: t.phoneNumber, role: "user" },
        create: { ...t, role: "user", hashedPassword: userHash },
      })
    );
  }
  console.log("✓ " + tenants.length + " locataires");

  // --- 5. Annonces --------------------------------------------------------
  const created = [];
  let reused = 0;

  for (const l of LISTINGS) {
    const owner = owners[l.owner];

    // Une annonce est identifiée par son titre + son propriétaire.
    const existing = await prisma.listing.findFirst({
      where: { title: l.title, userId: owner.id },
    });

    const data = {
      title: l.title,
      description: l.description,
      imageSrc: imagePath(l.image),
      category: l.category,
      locationValue: l.city,
      roomCount: l.rooms,
      bathroomCount: l.baths,
      guestCount: l.guests,
      price: l.price,
      userId: owner.id,
      phoneNumber: owner.phoneNumber,
    };

    if (existing) {
      created.push(await prisma.listing.update({ where: { id: existing.id }, data }));
      reused++;
    } else {
      created.push(await prisma.listing.create({ data }));
    }
  }
  console.log("✓ " + created.length + " annonces (" + (created.length - reused) + " créées, " + reused + " mises à jour)");

  // --- 6. Réservations ----------------------------------------------------
  // Un panachage volontaire : séjours passés et à venir, paiements réussis,
  // en attente et échoués, pour que le tableau de bord soit parlant.
  const plan = [
    { listing: 0, tenant: 0, from: 6, to: 10, status: "COMPLETED" },
    { listing: 1, tenant: 1, from: 14, to: 21, status: "COMPLETED" },
    { listing: 2, tenant: 2, from: 30, to: 34, status: "PENDING" },
    { listing: 3, tenant: 3, from: -20, to: -14, status: "COMPLETED" },
    { listing: 4, tenant: 4, from: 3, to: 7, status: "COMPLETED" },
    { listing: 5, tenant: 5, from: 45, to: 52, status: "PENDING" },
    { listing: 6, tenant: 0, from: -40, to: -35, status: "COMPLETED" },
    { listing: 7, tenant: 1, from: 10, to: 40, status: "COMPLETED" },
    { listing: 13, tenant: 2, from: 5, to: 35, status: "COMPLETED" },
    { listing: 17, tenant: 3, from: 12, to: 42, status: "FAILED" },
    { listing: 20, tenant: 4, from: 8, to: 38, status: "COMPLETED" },
    { listing: 22, tenant: 5, from: 20, to: 50, status: "PENDING" },
  ];

  let madeReservations = 0;
  for (const p of plan) {
    const listing = created[p.listing];
    const tenant = tenants[p.tenant];
    if (!listing || !tenant) continue;

    const startDate = daysFromNow(p.from);
    const endDate = daysFromNow(p.to);

    const already = await prisma.reservation.findFirst({
      where: { listingId: listing.id, userId: tenant.id, startDate },
    });
    if (already) continue;

    const totalPrice = isNightly(listing.category)
      ? listing.price * nightsBetween(startDate, endDate)
      : listing.price;

    await prisma.reservation.create({
      data: {
        listingId: listing.id,
        userId: tenant.id,
        startDate,
        endDate,
        totalPrice,
        phoneNumber: tenant.phoneNumber,
        paymentStatus: p.status,
        // Les paiements aboutis d'une démo reçoivent une référence fictive
        // reconnaissable, pour ne pas être confondus avec de vrais paiements.
        // Sans paiement, le champ reste absent : l'index unique de MongoDB
        // refuserait plusieurs valeurs null identiques.
        ...(p.status === "COMPLETED"
          ? { paymentRef: "demo-" + listing.id.slice(-8) + "-" + p.tenant }
          : {}),
      },
    });
    madeReservations++;
  }
  console.log("✓ " + madeReservations + " réservations créées");

  // --- 7. Récapitulatif + fichier des identifiants ------------------------
  const [nbUsers, nbListings, nbReservations] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.reservation.count(),
  ]);

  await writeCredentialsFile({ adminEmail, adminPassword, userPassword });

  console.log("\n──────────── BASE DE DONNÉES LOCALE ────────────");
  console.log("  Utilisateurs  : " + nbUsers);
  console.log("  Annonces      : " + nbListings);
  console.log("  Réservations  : " + nbReservations);
  console.log("\n  Identifiants de connexion : voir COMPTES-DEMO.md");
  console.log("  Démarrer le site :  npm run dev\n");

  await prisma.$disconnect();
}

async function writeCredentialsFile({ adminEmail, adminPassword, userPassword }) {
  const rows = (list, role) =>
    list.map((p) => "| " + p.name + " | " + p.email + " | `" + userPassword + "` | " + role + " |").join("\n");

  const content = `# Comptes de démonstration — Roomly

> Fichier généré automatiquement par \`npm run db:seed\`.
> Ces comptes n'existent que dans la base de données de votre ordinateur.

## Administrateur

Se connecte sur **http://localhost:3000/admin**

| Adresse e-mail | Mot de passe |
| --- | --- |
| ${adminEmail} | \`${adminPassword}\` |

## Propriétaires

Ils déposent des biens et consultent les réservations reçues.
Connexion sur la page d'accueil, bouton **Login**.

| Nom | Adresse e-mail | Mot de passe | Rôle |
| --- | --- | --- | --- |
${rows(OWNERS, "Propriétaire")}

## Locataires

Ils cherchent un bien, le réservent et le paient.

| Nom | Adresse e-mail | Mot de passe | Rôle |
| --- | --- | --- | --- |
${rows(TENANTS, "Locataire")}

---

Pour repartir de zéro : \`npm run db:seed -- --reset\`
`;

  await fs.writeFile(path.join(ROOT, "COMPTES-DEMO.md"), content, "utf8");
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
