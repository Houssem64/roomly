import crypto from "crypto";

/**
 * Passerelle de paiement de DÉMONSTRATION.
 *
 * Elle imite le fonctionnement de Konnect — page de paiement, compte à
 * rebours, succès ou échec — mais sans aucun appel à Internet et sans
 * jamais manipuler d'argent réel.
 *
 * À quoi ça sert ?
 *   - présenter le parcours de réservation complet même hors ligne ;
 *   - continuer à travailler quand le bac à sable de Konnect est en panne
 *     (c'est arrivé pendant le développement de ce projet).
 *
 * L'administrateur choisit la passerelle active depuis le panneau
 * d'administration, onglet « Réglages ».
 */

/** Toutes les références de démonstration commencent par ce préfixe. */
const DEMO_PREFIX = "demo_";

/** Durée de validité d'un paiement, en minutes (identique à Konnect). */
export const DEMO_LIFESPAN_MINUTES = 30;

/** Une référence appartient-elle à la passerelle de démonstration ? */
export function isDemoRef(paymentRef?: string | null): boolean {
  return typeof paymentRef === "string" && paymentRef.startsWith(DEMO_PREFIX);
}

export interface DemoPaymentResult {
  payUrl: string;
  paymentRef: string;
  expiresAt: Date;
}

/**
 * Prépare un paiement de démonstration.
 *
 * Contrairement à Konnect, rien n'est envoyé nulle part : on fabrique une
 * référence unique et on renvoie l'adresse de notre propre page de paiement.
 */
export function initDemoPayment(baseUrl: string): DemoPaymentResult {
  const paymentRef = DEMO_PREFIX + crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + DEMO_LIFESPAN_MINUTES * 60 * 1000);

  return {
    paymentRef,
    expiresAt,
    payUrl: `${baseUrl}/payment/demo?ref=${encodeURIComponent(paymentRef)}`,
  };
}
