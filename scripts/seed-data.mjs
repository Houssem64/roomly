/**
 * Roomly — catalogue des données de démonstration.
 *
 * Ce fichier ne fait RIEN tout seul : il contient uniquement la liste des
 * comptes, des biens et des photos. Il est utilisé par :
 *   - scripts/fetch-seed-images.mjs  (télécharge les photos)
 *   - scripts/seed.mjs               (crée les comptes et les annonces)
 *
 * Les villes doivent correspondre EXACTEMENT à la liste des gouvernorats
 * de src/app/components/Inputs/CountrySelect.tsx, sinon la carte et les
 * filtres de recherche ne retrouvent pas les biens.
 *
 * Les catégories doivent correspondre EXACTEMENT aux libellés de
 * src/app/components/Navbar/Categories.tsx.
 */

/** Photos libres de droits (Unsplash). Téléchargées une seule fois. */
export const SEED_IMAGES = [
  { file: "villa-01.jpg", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80" },
  { file: "villa-02.jpg", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" },
  { file: "villa-03.jpg", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" },
  { file: "appart-01.jpg", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80" },
  { file: "appart-02.jpg", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80" },
  { file: "appart-03.jpg", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80" },
  { file: "appart-04.jpg", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80" },
  { file: "studio-01.jpg", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80" },
  { file: "studio-02.jpg", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80" },
  { file: "studio-03.jpg", url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80" },
  { file: "bureau-01.jpg", url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80" },
  { file: "bureau-02.jpg", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80" },
  { file: "bureau-03.jpg", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80" },
  { file: "commerce-01.jpg", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80" },
  { file: "commerce-02.jpg", url: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&q=80" },
  { file: "commerce-03.jpg", url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=80" },
  { file: "depot-01.jpg", url: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80" },
  { file: "depot-02.jpg", url: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&q=80" },
  { file: "vacances-01.jpg", url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80" },
  { file: "vacances-02.jpg", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80" },
  { file: "vacances-03.jpg", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80" },
  { file: "vacances-04.jpg", url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80" },
];

/** Propriétaires : ils déposent des biens et gèrent leurs réservations. */
export const OWNERS = [
  { name: "Sami Ben Salah", email: "sami.bensalah@roomly.tn", phoneNumber: "+216 22 145 870" },
  { name: "Ines Trabelsi", email: "ines.trabelsi@roomly.tn", phoneNumber: "+216 98 331 204" },
  { name: "Karim Jaziri", email: "karim.jaziri@roomly.tn", phoneNumber: "+216 55 620 117" },
  { name: "Nadia Cherif", email: "nadia.cherif@roomly.tn", phoneNumber: "+216 20 774 903" },
  { name: "Youssef Mansouri", email: "youssef.mansouri@roomly.tn", phoneNumber: "+216 24 508 662" },
  { name: "Leila Gharbi", email: "leila.gharbi@roomly.tn", phoneNumber: "+216 97 412 335" },
];

/** Locataires : ils cherchent un bien et réservent. */
export const TENANTS = [
  { name: "Amine Bouazizi", email: "amine.bouazizi@example.tn", phoneNumber: "+216 21 903 447" },
  { name: "Sarra Hamdi", email: "sarra.hamdi@example.tn", phoneNumber: "+216 52 118 026" },
  { name: "Mehdi Khelifi", email: "mehdi.khelifi@example.tn", phoneNumber: "+216 27 640 819" },
  { name: "Rania Belhaj", email: "rania.belhaj@example.tn", phoneNumber: "+216 99 205 731" },
  { name: "Hatem Nasri", email: "hatem.nasri@example.tn", phoneNumber: "+216 23 876 154" },
  { name: "Emna Zouari", email: "emna.zouari@example.tn", phoneNumber: "+216 58 342 690" },
];

/**
 * Les biens de démonstration.
 * `owner` = index dans OWNERS. `image` = nom de fichier dans SEED_IMAGES.
 * `price` en dinars tunisiens (par nuit pour Villa/Vacation, par mois sinon).
 */
export const LISTINGS = [
  // ---- Villa (prix par nuit) ----
  { owner: 0, category: "Villa", city: "Nabeul", image: "villa-01.jpg", price: 450, guests: 8, rooms: 4, baths: 3,
    title: "Villa avec piscine à Hammamet",
    description: "Grande villa familiale à dix minutes de la plage, avec piscine privée, jardin arboré et terrasse ombragée. Cuisine équipée, climatisation dans toutes les chambres et parking fermé. Idéale pour des vacances en famille ou entre amis." },
  { owner: 1, category: "Villa", city: "Sousse", image: "villa-02.jpg", price: 520, guests: 10, rooms: 5, baths: 4,
    title: "Villa moderne vue mer à Port El Kantaoui",
    description: "Villa contemporaine sur deux niveaux offrant une vue dégagée sur la marina. Cinq chambres spacieuses, grand salon lumineux, cuisine américaine et vaste terrasse avec barbecue. Proche des restaurants et du golf." },
  { owner: 2, category: "Villa", city: "Bizerte", image: "villa-03.jpg", price: 380, guests: 6, rooms: 3, baths: 2,
    title: "Villa traditionnelle près de la plage",
    description: "Charmante villa au style andalou, à cinq minutes à pied de la plage de Rimel. Patio central, trois chambres confortables et grande cuisine conviviale. Calme absolu, quartier résidentiel." },

  // ---- Vacation (prix par nuit) ----
  { owner: 3, category: "Vacation", city: "Monastir", image: "vacances-01.jpg", price: 210, guests: 4, rooms: 2, baths: 1,
    title: "Appartement de vacances face à la marina",
    description: "Appartement lumineux au premier étage avec balcon donnant sur le port de plaisance. Deux chambres, salon spacieux, wifi et climatisation. Commerces et cafés au pied de l'immeuble." },
  { owner: 4, category: "Vacation", city: "Mahdia", image: "vacances-02.jpg", price: 175, guests: 4, rooms: 2, baths: 1,
    title: "Studio bord de mer à Mahdia",
    description: "Pied dans l'eau, ce logement rénové donne directement sur une plage de sable fin. Cuisine équipée, terrasse privative et place de parking. Parfait pour un séjour au calme." },
  { owner: 5, category: "Vacation", city: "Tozeur", image: "vacances-03.jpg", price: 240, guests: 6, rooms: 3, baths: 2,
    title: "Maison d'hôtes au cœur de l'oasis",
    description: "Maison en briques traditionnelles au milieu de la palmeraie. Trois chambres décorées à la main, patio frais et terrasse sur le toit pour observer les étoiles. Petit-déjeuner possible sur demande." },
  { owner: 0, category: "Vacation", city: "Medenine", image: "vacances-04.jpg", price: 160, guests: 4, rooms: 2, baths: 1,
    title: "Maison troglodyte rénovée à Djerba nord",
    description: "Une expérience unique dans une maison creusée dans la roche, entièrement rénovée avec le confort moderne. Fraîche en été, deux chambres voûtées, cour intérieure fleurie." },

  // ---- Apartment (prix par mois) ----
  { owner: 1, category: "Apartment", city: "Tunis", image: "appart-01.jpg", price: 1200, guests: 4, rooms: 3, baths: 2,
    title: "Appartement S+2 au centre de Tunis",
    description: "Appartement rénové dans un immeuble récent, à deux pas de l'avenue Habib Bourguiba. Séjour lumineux, deux chambres, cuisine équipée et ascenseur. Transports et commerces immédiats." },
  { owner: 2, category: "Apartment", city: "Ariana", image: "appart-02.jpg", price: 950, guests: 4, rooms: 3, baths: 1,
    title: "S+2 lumineux aux Jardins d'El Menzah",
    description: "Bel appartement au troisième étage avec double exposition. Deux chambres, grand salon, cuisine séparée et balcon. Résidence sécurisée avec parking et espace vert." },
  { owner: 3, category: "Apartment", city: "Sfax", image: "appart-03.jpg", price: 800, guests: 5, rooms: 3, baths: 2,
    title: "Appartement familial S+3 à Sfax",
    description: "Grand appartement de 120 m² proche des écoles et du marché central. Trois chambres, deux salles d'eau, cuisine spacieuse et cellier. Idéal pour une famille." },
  { owner: 4, category: "Apartment", city: "Ben Arous", image: "appart-04.jpg", price: 720, guests: 3, rooms: 2, baths: 1,
    title: "S+1 neuf à Ezzahra",
    description: "Appartement jamais habité dans une résidence livrée cette année. Chambre avec dressing, séjour ouvert sur cuisine américaine, balcon. Proche de la gare TGM et de la plage." },
  { owner: 5, category: "Apartment", city: "Sousse", image: "appart-01.jpg", price: 880, guests: 4, rooms: 3, baths: 2,
    title: "Appartement S+2 à Sahloul",
    description: "Quartier calme et recherché, à proximité de l'hôpital et de la faculté de médecine. Deux chambres, salon double, cuisine équipée et garage individuel." },
  { owner: 0, category: "Apartment", city: "Nabeul", image: "appart-02.jpg", price: 690, guests: 3, rooms: 2, baths: 1,
    title: "S+1 meublé à Nabeul centre",
    description: "Entièrement meublé et équipé, disponible immédiatement. Chambre, salon, cuisine et balcon donnant sur une rue tranquille. Charges d'eau incluses." },

  // ---- Student housing (prix par mois) ----
  { owner: 1, category: "Student housing", city: "Tunis", image: "studio-01.jpg", price: 380, guests: 1, rooms: 1, baths: 1,
    title: "Studio étudiant proche de l'ENIT",
    description: "Studio meublé de 25 m² à dix minutes à pied de l'École nationale d'ingénieurs. Lit, bureau, kitchenette et salle d'eau privative. Wifi et charges comprises." },
  { owner: 2, category: "Student housing", city: "Manouba", image: "studio-02.jpg", price: 320, guests: 2, rooms: 1, baths: 1,
    title: "Chambre en colocation près du campus",
    description: "Chambre individuelle meublée dans un appartement partagé par trois étudiants. Cuisine et salon communs, machine à laver, internet fibre. Bus universitaire à cent mètres." },
  { owner: 3, category: "Student housing", city: "Sfax", image: "studio-03.jpg", price: 350, guests: 1, rooms: 1, baths: 1,
    title: "Studio équipé proche de la faculté de médecine",
    description: "Studio calme au premier étage d'une maison familiale, entrée indépendante. Meublé, kitchenette, salle de bain privée. Environnement idéal pour réviser." },
  { owner: 4, category: "Student housing", city: "Monastir", image: "studio-01.jpg", price: 300, guests: 2, rooms: 1, baths: 1,
    title: "Chambre étudiante à Monastir",
    description: "Chambre lumineuse dans une résidence étudiante gardée, à deux pas de la faculté de pharmacie. Bureau, armoire, salle d'eau partagée entre deux chambres." },

  // ---- Office (prix par mois) ----
  { owner: 5, category: "Office", city: "Tunis", image: "bureau-01.jpg", price: 1800, guests: 12, rooms: 4, baths: 2,
    title: "Plateau de bureaux aux Berges du Lac",
    description: "Plateau de 140 m² au sixième étage d'un immeuble de standing. Quatre bureaux cloisonnés, salle de réunion, kitchenette et deux parkings en sous-sol. Fibre optique installée." },
  { owner: 0, category: "Office", city: "Ariana", image: "bureau-02.jpg", price: 1100, guests: 8, rooms: 3, baths: 1,
    title: "Bureaux aménagés à Ariana Centre",
    description: "Local professionnel de 90 m² en rez-de-chaussée, vitrine sur rue. Trois espaces de travail, accueil, climatisation gainable. Conviendrait à un cabinet ou une agence." },
  { owner: 1, category: "Office", city: "Sousse", image: "bureau-03.jpg", price: 900, guests: 6, rooms: 2, baths: 1,
    title: "Espace de coworking privatisable à Sousse",
    description: "Deux salles modulables dans un espace de coworking récent. Accès 24h/24, salle de réunion partagée, café et imprimante inclus. Contrat mensuel souple." },

  // ---- Commercial (prix par mois) ----
  { owner: 2, category: "Commercial", city: "Tunis", image: "commerce-01.jpg", price: 2200, guests: 20, rooms: 2, baths: 1,
    title: "Local commercial avenue de Carthage",
    description: "Emplacement numéro un avec une très forte fréquentation piétonne. 110 m² de surface de vente, réserve à l'arrière, double vitrine et rideau métallique électrique." },
  { owner: 3, category: "Commercial", city: "Sfax", image: "commerce-02.jpg", price: 1400, guests: 15, rooms: 2, baths: 1,
    title: "Boutique en centre-ville de Sfax",
    description: "Boutique de 70 m² sur une artère commerçante animée. Vitrine de six mètres, sol carrelé neuf, éclairage LED et point d'eau. Libre de suite." },
  { owner: 4, category: "Commercial", city: "Kairouan", image: "commerce-03.jpg", price: 850, guests: 10, rooms: 1, baths: 1,
    title: "Local commercial près de la médina",
    description: "Local de 45 m² à l'entrée de la médina, zone très touristique. Idéal pour l'artisanat, la restauration rapide ou une supérette. Loyer négociable pour un bail long." },

  // ---- Self-storage (prix par mois) ----
  { owner: 5, category: "Self-storage", city: "Ben Arous", image: "depot-01.jpg", price: 400, guests: 2, rooms: 1, baths: 1,
    title: "Box de stockage sécurisé à Mégrine",
    description: "Box fermé de 30 m² dans un entrepôt gardé et sous vidéosurveillance. Accès véhicule utilitaire, hauteur sous plafond de quatre mètres, sol béton. Accès libre en semaine." },
  { owner: 0, category: "Self-storage", city: "Bizerte", image: "depot-02.jpg", price: 300, guests: 2, rooms: 1, baths: 1,
    title: "Dépôt 50 m² zone industrielle de Bizerte",
    description: "Dépôt indépendant avec porte sectionnelle et quai de déchargement. Électricité triphasée, bureau attenant, cour de manœuvre. Convient au stockage de marchandises." },
];
