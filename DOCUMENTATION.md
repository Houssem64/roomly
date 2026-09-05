# Roomly — Comment fonctionne ce projet

> Ce document explique le projet **sans supposer de connaissances techniques**.
> Il se lit du début à la fin. Chaque terme compliqué est expliqué la première fois.

---

## Table des matières

1. [Qu'est-ce que Roomly ?](#1-quest-ce-que-roomly-)
2. [Qui utilise l'application ?](#2-qui-utilise-lapplication-)
3. [Comment ça marche, simplement](#3-comment-ça-marche-simplement)
4. [Le parcours d'une réservation](#4-le-parcours-dune-réservation)
5. [Où sont rangées les choses](#5-où-sont-rangées-les-choses)
6. [Installation et démarrage](#6-installation-et-démarrage)
7. [Les comptes de démonstration](#7-les-comptes-de-démonstration)
8. [Ce qui est local et ce qui ne l'est pas](#8-ce-qui-est-local-et-ce-qui-ne-lest-pas)
9. [En cas de problème](#9-en-cas-de-problème)
10. [Pour aller plus loin](#10-pour-aller-plus-loin)

---

## 1. Qu'est-ce que Roomly ?

Roomly est un **site de location de biens immobiliers en Tunisie**.

C'est un intermédiaire entre deux personnes :

- quelqu'un qui possède un logement, un bureau ou un local et veut le louer ;
- quelqu'un qui cherche à louer ce genre de bien.

Le site permet de publier une annonce avec une photo, de chercher un bien par
ville et par type, de choisir des dates, puis de payer en ligne.

Sept types de biens sont proposés : **logement étudiant, location de vacances,
appartement, bureau, local commercial, box de stockage et villa**.

Les biens sont classés par **gouvernorat** (Tunis, Sousse, Sfax, Nabeul...).

---

## 2. Qui utilise l'application ?

Il y a quatre profils. C'est le point le plus important à comprendre.

### Le visiteur

Il n'a pas de compte. Il peut regarder les annonces, les filtrer par catégorie
et par ville, et consulter la fiche détaillée d'un bien. Dès qu'il veut réserver
ou publier une annonce, on lui demande de créer un compte.

### Le propriétaire

C'est la personne qui **met un bien en location**.

Elle crée un compte, clique sur « Roomly your home », et remplit un formulaire
en six étapes : catégorie du bien, ville, nombre de pièces, photo, description,
prix. Son annonce apparaît alors sur le site.

Elle retrouve ses biens dans **« Mes propriétés »** et les demandes reçues dans
**« Réservations sur mes biens »**.

### Le locataire

C'est la personne qui **cherche et réserve un bien**.

Elle choisit un bien, sélectionne ses dates dans un calendrier, paie, et
retrouve ensuite ses réservations dans **« Mes réservations »**. Elle peut aussi
mettre des biens en favoris (le petit cœur).

> Un même compte peut être à la fois propriétaire et locataire : rien n'empêche
> de louer un bien tout en proposant le sien.

### L'administrateur

Il surveille la plateforme depuis une interface séparée, à l'adresse
**http://localhost:3000/admin**.

Son rôle est **la gestion des comptes utilisateurs** : consulter la liste,
rechercher quelqu'un, et supprimer un compte qui pose problème. Il voit aussi
les statistiques générales et la liste des biens **en consultation seule** —
il ne modifie pas les annonces, ce sont les propriétaires qui gèrent les leurs.

---

## 3. Comment ça marche, simplement

Imaginons une **agence immobilière**. Chaque partie du programme y correspond
à un employé ou à un meuble.

| Dans l'agence | Dans Roomly | Son rôle |
| --- | --- | --- |
| La vitrine | Le **navigateur** (Chrome, Firefox) | Ce que voit le visiteur : les pages, les photos, les boutons. |
| L'agent d'accueil | **Next.js** | Reçoit les demandes, va chercher l'information, fabrique la page et la renvoie. |
| Le traducteur | **Prisma** | L'agent parle français, l'armoire est étiquetée en anglais. Prisma traduit dans les deux sens. |
| L'armoire à dossiers | **MongoDB** | Range tout ce qu'il faut retenir : comptes, annonces, réservations. |
| L'album photos | Le dossier **`public/uploads`** | Contient les photos des biens, en fichiers ordinaires sur le disque dur. |
| La caisse enregistreuse | **Konnect** | Encaisse l'argent. **Le seul élément qui n'est pas sur votre ordinateur.** |

### Le schéma général

```
   ┌──────────────┐
   │  Navigateur  │   La personne clique sur « Réserver »
   └──────┬───────┘
          │  1. « Je veux réserver ce bien »
          ▼
   ┌──────────────────────────┐
   │        Next.js           │   Le programme principal
   │  (pages + adresses API)  │
   └───┬──────────────────┬───┘
       │ 2. via Prisma    │ 4. paiement (Internet)
       ▼                  ▼
 ┌───────────┐      ┌───────────┐
 │  MongoDB  │      │  Konnect  │
 │ (sur ce   │      │ (en ligne)│
 │    PC)    │      └───────────┘
 └───────────┘
       ▲
       │ 3. lit et écrit aussi les photos
 ┌───────────────┐
 │ public/uploads│  (sur ce PC)
 └───────────────┘
```

### Trois mots à retenir

**Une base de données** est un grand classeur organisé. Roomly utilise
**MongoDB**, qui range l'information en « fiches » plutôt qu'en tableaux. Une
fiche utilisateur contient un nom, un e-mail, un téléphone ; une fiche annonce
contient un titre, un prix, une ville.

**Un serveur** est le programme qui écoute les demandes et répond. Ici il tourne
sur votre propre ordinateur, à l'adresse `localhost:3000`. « localhost » veut
littéralement dire « cette machine-ci ».

**Une API** est une adresse à laquelle le programme se parle à lui-même. Quand
la page a besoin de la liste des utilisateurs, elle appelle `/api/users`. Ce
n'est pas une page à regarder, c'est un guichet qui rend des données brutes.

### Les cinq types de fiches

| Fiche | Ce qu'elle contient |
| --- | --- |
| **User** | Un utilisateur : nom, e-mail, téléphone, mot de passe (chiffré), rôle, favoris. |
| **Listing** | Un bien : titre, description, photo, catégorie, ville, prix, nombre de pièces, propriétaire. |
| **Reservation** | Une réservation : qui, quel bien, quelles dates, quel montant, où en est le paiement. |
| **Admin** | Un administrateur. Volontairement séparé des utilisateurs ordinaires. |
| **Account / Session** | Techniques : servent à la connexion Google et à garder l'utilisateur connecté. |

### Un point sur la sécurité

Les mots de passe ne sont **jamais** enregistrés tels quels. Ils passent par une
opération à sens unique (`bcrypt`) : on peut vérifier qu'un mot de passe est le
bon, mais on ne peut pas le retrouver à partir de ce qui est stocké. Même en
ouvrant la base de données, on ne peut pas lire les mots de passe.

---

## 4. Le parcours d'une réservation

C'est l'enchaînement le plus important du projet.

1. **Le locataire choisit ses dates.** Le calendrier grise automatiquement les
   dates déjà prises. Le prix total se calcule tout seul : au nombre de nuits
   pour une villa ou une location de vacances, au mois pour les autres.

2. **Il clique sur « Réserver ».** Le site crée alors une réservation marquée
   **« en attente de paiement »** (`PENDING`). Elle existe, mais n'est pas
   encore définitive.

3. **Le site revérifie la disponibilité** au moment exact de l'enregistrement.
   C'est indispensable : deux personnes pourraient cliquer à la même seconde sur
   les mêmes dates. Si le bien vient d'être pris, la réservation est refusée avec
   un message clair.

4. **Le site demande une page de paiement à Konnect.** Il envoie le montant, le
   nom du client et le numéro de la réservation. Konnect renvoie une adresse
   sécurisée.

5. **Le navigateur part chez Konnect.** Le locataire saisit sa carte **sur le
   site de Konnect**, jamais sur Roomly. Les numéros de carte ne transitent donc
   jamais par notre programme — c'est le principe même d'une passerelle de
   paiement.

6. **Le locataire revient sur Roomly**, sur la page « Paiement confirmé » ou
   « Paiement non abouti ».

7. **Roomly revérifie auprès de Konnect.** C'est le point subtil : on ne croit
   pas l'adresse de retour sur parole. N'importe qui pourrait taper
   `/payment/success` à la main dans son navigateur. Le site redemande donc
   directement à Konnect : « ce paiement a-t-il vraiment été réglé ? » Seule
   cette réponse fait foi. La réservation passe alors en **`COMPLETED`** (payée)
   ou **`FAILED`** (échouée).

Une réservation **`FAILED`** libère automatiquement les dates : un paiement
abandonné ne doit pas bloquer un bien indéfiniment.

> **À savoir pour la démonstration.** Konnect prévient normalement le site tout
> seul, en appelant une adresse appelée *webhook*. Mais Konnect ne peut pas
> joindre « localhost », qui n'existe pas depuis Internet. Sur un ordinateur
> personnel, c'est donc l'étape 7 — la vérification au retour de l'utilisateur —
> qui confirme le paiement. Les deux chemins font exactement le même contrôle,
> tout fonctionne normalement.

---

## 5. Où sont rangées les choses

```
roomly/
│
├── prisma/
│   └── schema.prisma        ← LA DESCRIPTION DES FICHES.
│                              Modifier ce fichier change la forme de la base.
│
├── public/                  ← Fichiers servis tels quels au navigateur
│   ├── images/              ← Logo et image par défaut
│   └── uploads/             ← LES PHOTOS DES BIENS
│       └── seed/            ← Les photos de démonstration
│
├── scripts/                 ← Outils d'installation (voir chapitre 6)
│
├── src/
│   ├── app/
│   │   ├── page.tsx         ← La page d'accueil
│   │   ├── layout.tsx       ← Le cadre commun à toutes les pages
│   │   │
│   │   ├── actions/         ← Fonctions qui vont chercher des données
│   │   ├── api/             ← Les « guichets » (voir tableau ci-dessous)
│   │   ├── components/      ← Les morceaux réutilisables de l'interface
│   │   ├── libs/            ← Outils partagés (base, paiement, fichiers)
│   │   │
│   │   ├── admin/           ← L'espace d'administration
│   │   ├── listings/        ← La fiche détaillée d'un bien
│   │   ├── my-properties/   ← « Mes propriétés » (propriétaire)
│   │   ├── my-reservations/ ← « Mes réservations » (locataire)
│   │   ├── payment/         ← Pages de retour après paiement
│   │   └── favorites/       ← Les biens mis en favori
│   │
│   └── middleware.ts        ← LE VIGILE. Bloque l'accès à /admin
│                              aux personnes non autorisées.
│
├── .env                     ← LES RÉGLAGES ET MOTS DE PASSE.
│                              Ne jamais publier ce fichier.
└── DOCUMENTATION.md         ← Ce document
```

### Les principaux guichets (API)

| Adresse | À quoi elle sert | Qui y a droit |
| --- | --- | --- |
| `/api/register` | Créer un compte | Tout le monde |
| `/api/listings` | Publier un bien | Utilisateur connecté |
| `/api/listings/[id]` | Supprimer un bien | Son propriétaire uniquement |
| `/api/upload` | Envoyer une photo | Utilisateur connecté |
| `/api/reservations` | Réserver | Utilisateur connecté |
| `/api/payments/init` | Démarrer un paiement | Le locataire concerné |
| `/api/payments/webhook` | Recevoir le résultat du paiement | Konnect |
| `/api/users` | Lister les utilisateurs | **Administrateur** |
| `/api/users/[id]` | Supprimer un compte | **Administrateur** |
| `/api/alllistings` | Lister tous les biens | **Administrateur** |
| `/api/admin/stats` | Les statistiques | **Administrateur** |

---

## 6. Installation et démarrage

### Ce qu'il faut avoir installé

| Logiciel | Pourquoi | Où le trouver |
| --- | --- | --- |
| **Node.js** (version 18 ou plus) | Fait tourner le programme | https://nodejs.org |
| **MongoDB Community Server** | La base de données | https://www.mongodb.com/try/download/community |

Pour vérifier que Node.js est installé, ouvrez PowerShell et tapez :

```bash
node --version
```

Un numéro de version doit s'afficher (par exemple `v20.11.0`).

---

### Étape 1 — Installer les dépendances

Un projet Node.js s'appuie sur des bibliothèques écrites par d'autres. Cette
commande les télécharge toutes dans un dossier `node_modules`.

```bash
npm install
```

*Cela prend une à deux minutes la première fois.*

---

### Étape 2 — Autoriser MongoDB à fonctionner avec Prisma

**C'est l'étape que l'on oublie le plus souvent.**

Prisma exige que MongoDB tourne en mode « **replica set** ». Ce mot désigne
normalement un groupe de plusieurs serveurs qui se recopient mutuellement. Ici
il n'y en a qu'un seul, mais Prisma a besoin de ce mode pour pouvoir annuler
proprement une opération qui échouerait à mi-chemin.

Par défaut, MongoDB ne l'active pas. Il faut donc modifier sa configuration, ce
qui demande les droits administrateur :

1. Cliquez sur **Démarrer**, tapez `PowerShell` ;
2. **clic droit** sur « Windows PowerShell » → **« Exécuter en tant qu'administrateur »** ;
3. placez-vous dans le dossier du projet et lancez :

```bash
powershell -ExecutionPolicy Bypass -File scripts/setup-mongodb-replicaset.ps1
```

Le script modifie le fichier de configuration de MongoDB (après en avoir fait
une sauvegarde) puis redémarre le service. Il affiche `OK` quand c'est fait.

Ensuite, dans une fenêtre PowerShell **normale** :

```bash
npm run db:init
```

Le message attendu est : *« Le nœud est PRIMARY. MongoDB est prêt pour Prisma. »*

---

### Étape 3 — Créer la structure de la base

```bash
npm run db:push
```

Cette commande lit `prisma/schema.prisma` et prépare la base en conséquence.

---

### Étape 4 — Récupérer les photos de démonstration

```bash
npm run db:images
```

Télécharge une vingtaine de photos libres de droits dans
`public/uploads/seed/`. **Cette étape a besoin d'Internet, une seule fois.**
Ensuite, les photos sont sur le disque dur pour toujours.

---

### Étape 5 — Remplir la base

```bash
npm run db:seed
```

Crée l'administrateur, six propriétaires, six locataires, vingt-cinq biens et
une douzaine de réservations. Le fichier `COMPTES-DEMO.md` est généré avec tous
les identifiants.

Pour tout effacer et recommencer proprement :

```bash
npm run db:seed -- --reset
```

---

### Étape 6 — Démarrer le site

```bash
npm run dev
```

Ouvrez ensuite **http://localhost:3000** dans votre navigateur.

Pour arrêter le site : `Ctrl` + `C` dans la fenêtre PowerShell.

---

### Tout enchaîner d'un coup

Une fois l'étape 2 faite (elle ne se fait qu'une seule fois) :

```bash
npm run db:setup
```

Cette commande enchaîne les étapes 2 à 5.

---

### Étape facultative — Récupérer les anciennes données

Le projet utilisait auparavant une base hébergée sur Internet (MongoDB Atlas).
Si vous voulez rapatrier ces données sur votre ordinateur :

```bash
npm run db:migrate
```

Le script recopie tout vers la base locale et télécharge au passage les photos
qui étaient hébergées chez Cloudinary. **La base distante n'est jamais
modifiée** : le script se contente de lire.

---

## 7. Les comptes de démonstration

Les identifiants complets sont dans **`COMPTES-DEMO.md`**, généré
automatiquement. En résumé :

| Profil | Adresse e-mail | Mot de passe | Où se connecter |
| --- | --- | --- | --- |
| Administrateur | `admin@roomly.com` | `admin123` | `/admin` |
| Propriétaire | `sami.bensalah@roomly.tn` | `roomly123` | Bouton **Login** de l'accueil |
| Locataire | `amine.bouazizi@example.tn` | `roomly123` | Bouton **Login** de l'accueil |

Les mots de passe se changent dans le fichier `.env`
(`SEED_ADMIN_PASSWORD`, `SEED_USER_PASSWORD`), puis on relance `npm run db:seed`.

### Une démonstration en cinq minutes

1. **Accueil** — montrer les biens, filtrer par catégorie puis par ville.
2. **Fiche d'un bien** — la photo, la carte, le calendrier avec les dates déjà prises.
3. **Se connecter en propriétaire** → « Roomly your home » → publier un bien
   avec une photo prise sur l'ordinateur. Elle apparaît immédiatement.
4. **Se connecter en locataire** → réserver → paiement.
5. **Se connecter en administrateur** sur `/admin` → statistiques, recherche
   d'un utilisateur, pagination.

---

## 8. Ce qui est local et ce qui ne l'est pas

| Élément | Où il se trouve | A besoin d'Internet ? |
| --- | --- | --- |
| Le site | Votre ordinateur | Non |
| La base de données | Votre ordinateur (MongoDB) | Non |
| Les photos des biens | Votre ordinateur (`public/uploads`) | Non |
| Les comptes et mots de passe | Votre ordinateur | Non |
| La carte des biens | Fonds de carte OpenStreetMap | Oui, pour afficher la carte |
| Connexion « avec Google » | Serveurs de Google | Oui |
| **Le paiement (Konnect)** | **Serveurs de Konnect** | **Oui** |

En clair : **débranchez Internet, tout continue de fonctionner sauf le paiement,
la carte et la connexion Google.**

C'était l'objectif du projet : ne dépendre de l'extérieur que pour l'argent.

### Ce qui a changé par rapport à la version précédente

| Avant | Maintenant |
| --- | --- |
| Photos hébergées chez **Cloudinary** | Photos dans `public/uploads`, sur le PC |
| Base **MongoDB Atlas** (en ligne) | **MongoDB** installé sur le PC |
| Paiement écrit mais **jamais branché** | Paiement **Konnect réellement intégré** |
| Espace admin **accessible à tous** | Accès **contrôlé**, avec déconnexion |
| Tableaux sans recherche | **Recherche, filtres et pagination** |
| Aucune statistique | **Tableau de bord chiffré** |
| Double réservation possible | **Vérification des dates** à l'enregistrement |

---

## 9. En cas de problème

### « Server selection timeout » / le site ne trouve pas la base

MongoDB ne tourne pas. Dans PowerShell :

```bash
Get-Service MongoDB
```

Si l'état n'est pas `Running`, démarrez-le (PowerShell **administrateur**) :

```bash
Start-Service MongoDB
```

---

### « Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set »

L'étape 2 de l'installation n'a pas été faite, ou MongoDB a été réinstallé.
Reprenez l'étape 2.

---

### Le port 3000 est déjà utilisé

Un autre programme (ou un `npm run dev` resté ouvert) occupe l'adresse.
Pour voir qui :

```bash
netstat -ano | findstr :3000
```

Fermez le programme concerné, ou démarrez Roomly sur un autre port :

```bash
npx next dev -p 3001
```

---

### Les photos ne s'affichent pas

Vérifiez que le dossier `public/uploads/seed/` contient bien des images.
Sinon :

```bash
npm run db:images
npm run db:seed
```

---

### « Clé d'API Konnect refusée »

Les clés de paiement du fichier `.env` ne sont plus valables. Il faut en
générer de nouvelles :

1. connectez-vous sur https://dashboard.preprod.konnect.network ;
2. récupérez la **clé d'API** (au format `identifiant:secret`) et le
   **numéro de portefeuille** ;
3. reportez-les dans `.env` :

```
KONNECT_API_KEY="votre-identifiant:votre-secret"
KONNECT_WALLET_ID="votre-numero-de-portefeuille"
```

4. redémarrez le site (`Ctrl` + `C`, puis `npm run dev`).

Le reste de l'application fonctionne normalement pendant ce temps : seule
l'étape de paiement est concernée.

---

### J'ai tout cassé, je veux repartir de zéro

```bash
npm run db:seed -- --reset
```

Cela efface les données de démonstration et les recrée.

---

## 10. Pour aller plus loin

### Les technologies utilisées, en une phrase chacune

| Technologie | À quoi elle sert |
| --- | --- |
| **Next.js 14** | Le cadre général : pages, adresses API, affichage. |
| **React** | Construit l'interface à partir de petits morceaux réutilisables. |
| **TypeScript** | Du JavaScript qui vérifie les erreurs avant l'exécution. |
| **Tailwind CSS** | La mise en forme, écrite directement dans le code des pages. |
| **Prisma** | Le traducteur entre le programme et la base de données. |
| **MongoDB** | La base de données. |
| **NextAuth** | Gère les connexions et les sessions. |
| **bcrypt** | Chiffre les mots de passe. |
| **Leaflet** | Affiche la carte sur la fiche d'un bien. |
| **Konnect** | La passerelle de paiement tunisienne. |

### Les commandes utiles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre le site en mode développement |
| `npm run build` | Prépare une version optimisée |
| `npm start` | Démarre la version optimisée |
| `npm run db:init` | Initialise le replica set MongoDB |
| `npm run db:push` | Met la base à jour d'après `schema.prisma` |
| `npm run db:images` | Télécharge les photos de démonstration |
| `npm run db:seed` | Remplit la base de données |
| `npm run db:setup` | Enchaîne les quatre commandes précédentes |
| `npm run db:migrate` | Rapatrie les données de l'ancienne base en ligne |
| `npx prisma studio` | Ouvre une fenêtre pour consulter la base à la souris |

> `npx prisma studio` est très pratique pour une soutenance : il montre le
> contenu réel de la base dans un tableau lisible.

### Idées d'améliorations

- Plusieurs photos par bien (une seule aujourd'hui).
- Notes et commentaires laissés par les locataires.
- Messagerie entre propriétaire et locataire.
- Confirmation de réservation envoyée par e-mail.
- Modification d'une annonce déjà publiée.
- Version bilingue français / arabe.
