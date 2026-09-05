/**
 * Roomly — initialise le replica set MongoDB local (rs0).
 *
 * Prisma exige un replica set, même avec un seul serveur. Ce script se
 * connecte directement au MongoDB local et lance `replSetInitiate`, puis
 * attend que le serveur devienne PRIMARY.
 *
 * Prérequis : avoir lancé UNE FOIS, en administrateur,
 *   powershell -ExecutionPolicy Bypass -File scripts/setup-mongodb-replicaset.ps1
 *
 * Usage : npm run db:init
 */
import { MongoClient } from "mongodb";

const HOST = process.env.MONGO_HOST || "127.0.0.1:27017";
const DIRECT_URI = `mongodb://${HOST}/?directConnection=true&serverSelectionTimeoutMS=5000`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`→ Connexion directe à ${HOST} ...`);

  const client = new MongoClient(DIRECT_URI);
  try {
    await client.connect();
  } catch (err) {
    console.error(`\n✖ Impossible de joindre MongoDB sur ${HOST}.`);
    console.error("  Vérifiez que le service tourne :  Get-Service MongoDB");
    console.error(`  Détail : ${err.message}`);
    process.exit(1);
  }

  const admin = client.db("admin");

  // 1. Le serveur accepte-t-il seulement d'être en replica set ?
  let hello;
  try {
    hello = await admin.command({ hello: 1 });
  } catch (err) {
    console.error(`✖ Commande "hello" refusée : ${err.message}`);
    await client.close();
    process.exit(1);
  }

  if (!hello.setName && !hello.isreplicaset) {
    console.error("\n✖ MongoDB tourne en mode « standalone » : la replication n'est pas activée.");
    console.error("  Lancez d'abord, dans un PowerShell ADMINISTRATEUR :");
    console.error("    powershell -ExecutionPolicy Bypass -File scripts/setup-mongodb-replicaset.ps1\n");
    await client.close();
    process.exit(1);
  }

  // 2. Initialisation (idempotente)
  if (hello.setName) {
    console.log(`✓ Replica set « ${hello.setName} » déjà initialisé.`);
  } else {
    console.log("→ Initialisation du replica set rs0 ...");
    try {
      await admin.command({
        replSetInitiate: {
          _id: "rs0",
          members: [{ _id: 0, host: HOST }],
        },
      });
      console.log("✓ replSetInitiate envoyé.");
    } catch (err) {
      if (err.codeName === "AlreadyInitialized" || /already initialized/i.test(err.message)) {
        console.log("✓ Replica set déjà initialisé.");
      } else {
        console.error(`✖ Échec de l'initialisation : ${err.message}`);
        await client.close();
        process.exit(1);
      }
    }
  }

  // 3. Attente du statut PRIMARY (l'élection prend quelques secondes)
  process.stdout.write("→ Attente du passage en PRIMARY ");
  for (let i = 0; i < 40; i++) {
    try {
      const h = await admin.command({ hello: 1 });
      if (h.isWritablePrimary || h.ismaster) {
        console.log("\n✓ Le nœud est PRIMARY. MongoDB est prêt pour Prisma.");
        console.log("\n  Étape suivante :  npm run db:push");
        await client.close();
        return;
      }
    } catch {
      /* le serveur redémarre son état interne, on réessaie */
    }
    process.stdout.write(".");
    await sleep(500);
  }

  console.log("\n✖ Le nœud n'est pas devenu PRIMARY après 20 secondes.");
  console.log("  Consultez le journal MongoDB : C:\Program Files\MongoDB\Server\<version>\log\mongod.log");
  await client.close();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
