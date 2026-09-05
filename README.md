<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center">ROOMLY</h1>
</p>
<p align="center">
    <em><code>Plateforme de location immobilière — Next.js 14, Prisma, MongoDB</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/Houssem64/roomly?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Houssem64/roomly?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Houssem64/roomly?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Houssem64/roomly?style=flat&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Next.js-000000.svg?style=flat&logo=Next.js&logoColor=white" alt="Next.js">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/TailwindCSS-38B2AC.svg?style=flat&logo=Tailwind-CSS&logoColor=white" alt="TailwindCSS">
	<img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" alt="Prisma">
	<img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=MongoDB&logoColor=white" alt="MongoDB">
	<img src="https://img.shields.io/badge/NextAuth-000000.svg?style=flat&logo=Auth0&logoColor=white" alt="NextAuth">
	<img src="https://img.shields.io/badge/Leaflet-199900.svg?style=flat&logo=Leaflet&logoColor=white" alt="Leaflet">
</p>

<hr>

> 📘 **Une explication complète et non technique du projet se trouve dans
> [DOCUMENTATION.md](DOCUMENTATION.md)** — c'est le document à lire en premier.
>
> 🔑 Les identifiants de démonstration sont dans [COMPTES-DEMO.md](COMPTES-DEMO.md),
> généré par `npm run db:seed`.

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Structure du dépôt](#structure-du-dépôt)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts disponibles](#scripts-disponibles)
- [Variables d'environnement](#variables-denvironnement)
- [Paiement en ligne](#paiement-en-ligne)
- [Pistes d'évolution](#pistes-dévolution)

---

## Présentation

Roomly met en relation des **propriétaires** qui souhaitent louer un bien et des
**locataires** qui en cherchent un, partout en Tunisie.

Sept catégories sont couvertes — logement étudiant, location de vacances,
appartement, bureau, local commercial, box de stockage et villa — et les biens
sont classés par gouvernorat.

L'application est conçue pour **fonctionner intégralement en local** : la base de
données, les photos et les comptes vivent sur la machine. Le seul service
extérieur est la passerelle de paiement **Konnect**.

---

## Fonctionnalités

### Côté visiteur et locataire

- Recherche et filtrage des biens par catégorie et par gouvernorat
- Fiche détaillée avec photo, carte interactive (Leaflet) et calendrier
- Dates déjà réservées automatiquement grisées
- Calcul du prix à la nuit (villa, vacances) ou au mois (autres catégories)
- Réservation avec paiement en ligne
- Favoris et suivi de ses réservations

### Côté propriétaire

- Publication d'un bien en six étapes, avec envoi d'une photo depuis l'ordinateur
- Gestion de ses biens (« Mes propriétés »)
- Suivi des réservations reçues sur ses biens

### Côté administrateur

- Accès protégé par authentification, avec déconnexion
- Tableau de bord chiffré : comptes, biens, réservations, recettes encaissées,
  répartition par catégorie et par gouvernorat, dernières réservations
- Gestion des comptes utilisateurs : recherche, filtre par rôle, tri, pagination,
  suppression avec confirmation
- Consultation des biens en lecture seule (chaque propriétaire gère les siens)

### Transverse

- Authentification par e-mail / mot de passe (`bcrypt`) ou compte Google
- Mots de passe hachés, jamais stockés en clair
- Contrôle des chevauchements de dates au moment de l'enregistrement
- Photos stockées sur le disque, validées par type MIME **et** signature binaire

---

## Architecture

```
Navigateur ──▶ Next.js 14 (App Router) ──┬── Prisma ──▶ MongoDB (local, replica set)
                                         ├── fs      ──▶ public/uploads (photos)
                                         └── HTTPS   ──▶ Konnect (paiement)
```

| Couche | Technologie |
| --- | --- |
| Interface | React 18, Tailwind CSS, composants shadcn/ui |
| Application | Next.js 14 (App Router), TypeScript |
| Authentification | NextAuth (JWT), bcrypt |
| Accès aux données | Prisma 5 |
| Base de données | MongoDB 8 (replica set mono-nœud) |
| Cartographie | Leaflet / React-Leaflet |
| Paiement | Konnect (preprod) |

> **Pourquoi un replica set ?** Le connecteur MongoDB de Prisma a besoin des
> transactions, qui ne sont disponibles qu'en mode replica set — même avec un
> seul serveur. Le script `scripts/setup-mongodb-replicaset.ps1` s'en charge.

---

## Structure du dépôt

```sh
roomly/
├── prisma/
│   └── schema.prisma              # Modèles User, Listing, Reservation, Admin…
├── public/
│   ├── images/                    # Logo, image par défaut
│   └── uploads/                   # Photos envoyées par les utilisateurs
│       └── seed/                  # Photos de démonstration
├── scripts/
│   ├── setup-mongodb-replicaset.ps1  # Active le replica set (administrateur)
│   ├── init-replica.mjs              # Initialise le replica set rs0
│   ├── migrate-from-atlas.mjs        # Rapatrie l'ancienne base Atlas (lecture seule)
│   ├── fetch-seed-images.mjs         # Télécharge les photos de démonstration
│   ├── seed-data.mjs                 # Catalogue des données de démonstration
│   └── seed.mjs                      # Remplit la base
└── src/
    ├── middleware.ts              # Protection des routes /admin et API sensibles
    ├── components/ui/             # Primitives shadcn/ui
    ├── pages/api/auth/            # Configuration NextAuth
    └── app/
        ├── actions/               # Lectures serveur (listings, user, admin, paiement)
        ├── api/                   # Routes API
        │   ├── admin/stats/       # Statistiques du tableau de bord
        │   ├── payments/          # init + webhook Konnect
        │   ├── upload/            # Réception des photos
        │   └── …
        ├── admin/                 # Connexion + tableau de bord
        ├── components/            # Composants d'interface
        ├── libs/                  # prismadb, konnect, uploads
        ├── listings/[listingId]/  # Fiche d'un bien
        ├── payment/               # Pages de retour de paiement
        └── …
```

---

## Démarrage rapide

### Prérequis

- **Node.js 18+** — https://nodejs.org
- **MongoDB Community Server** — https://www.mongodb.com/try/download/community

### Installation

```sh
git clone https://github.com/Houssem64/roomly
cd roomly
npm install
```

### Activer le replica set MongoDB (une seule fois)

Dans un PowerShell lancé **en tant qu'administrateur** :

```sh
powershell -ExecutionPolicy Bypass -File scripts/setup-mongodb-replicaset.ps1
```

### Préparer la base et les données de démonstration

Dans un PowerShell normal, à la racine du projet :

```sh
npm run db:setup
```

### Lancer l'application

```sh
npm run dev
```

Le site est disponible sur **http://localhost:3000**, l'administration sur
**http://localhost:3000/admin**.

> Étape facultative : `npm run db:migrate` rapatrie les données de l'ancienne
> base MongoDB Atlas et télécharge au passage les photos qui étaient hébergées
> chez Cloudinary. La base distante n'est jamais modifiée.

---

## Scripts disponibles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Compile la version de production |
| `npm start` | Démarre la version compilée |
| `npm run lint` | Analyse statique du code |
| `npm run db:init` | Initialise le replica set MongoDB (`rs0`) |
| `npm run db:push` | Synchronise la base avec `schema.prisma` |
| `npm run db:images` | Télécharge les photos de démonstration |
| `npm run db:seed` | Remplit la base (`-- --reset` pour repartir de zéro) |
| `npm run db:setup` | Enchaîne `db:init`, `db:push`, `db:images`, `db:seed` |
| `npm run db:migrate` | Rapatrie l'ancienne base MongoDB Atlas |
| `npx prisma studio` | Explore la base dans une interface graphique |

---

## Variables d'environnement

Toutes les valeurs se trouvent dans `.env`, à la racine (fichier non versionné).

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Base MongoDB locale. Doit préciser `?replicaSet=rs0`. |
| `ATLAS_DATABASE_URL` | Ancienne base Atlas, utilisée uniquement par `db:migrate`, en lecture seule. |
| `ATLAS_DATABASE_URL_DIRECT` | Secours si le réseau bloque les requêtes DNS de type SRV. |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Configuration des sessions NextAuth. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Connexion Google (facultative). |
| `KONNECT_API_URL` / `KONNECT_API_KEY` / `KONNECT_WALLET_ID` | Passerelle de paiement. |
| `BASE_URL` | Adresse publique, utilisée pour les retours de paiement. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD` | Comptes de démonstration. |

---

## Paiement en ligne

Le paiement suit un aller-retour en quatre temps :

1. `POST /api/reservations` — enregistre la réservation en `PENDING`, après
   vérification des chevauchements de dates ;
2. `POST /api/payments/init` — appelle Konnect côté serveur, enregistre le
   `paymentRef` et renvoie l'adresse de paiement ;
3. le navigateur est redirigé vers Konnect, où la carte est saisie ;
4. au retour (`/payment/success` ou `/payment/failed`) **et** via le webhook
   `/api/payments/webhook`, l'état réel est **redemandé à Konnect** avant de
   passer la réservation en `COMPLETED` ou `FAILED`.

Une réservation `FAILED` libère automatiquement les dates concernées.

> ⚠️ **La clé d'API n'est jamais exposée au navigateur.** Tous les appels à
> Konnect partent du serveur.
>
> ⚠️ **Sur `localhost`, le webhook ne peut pas être appelé** par Konnect : c'est
> la vérification au retour de l'utilisateur qui confirme le paiement. Les deux
> chemins effectuent exactement le même contrôle.
>
> Si l'application signale « Clé d'API Konnect refusée », générez de nouvelles
> clés sur https://dashboard.preprod.konnect.network et reportez-les dans `.env`.

---

## Pistes d'évolution

- [ ] Plusieurs photos par bien (galerie)
- [ ] Modification d'une annonce déjà publiée
- [ ] Notes et commentaires des locataires
- [ ] Messagerie entre propriétaire et locataire
- [ ] Notifications par e-mail à la confirmation d'une réservation
- [ ] Interface bilingue français / arabe

---

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier `LICENSE`.
