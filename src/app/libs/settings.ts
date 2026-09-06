import prisma from "@/app/libs/prismadb";

/**
 * Réglages modifiables depuis le panneau d'administration.
 *
 * Ils sont enregistrés dans la base (collection « Setting »), et non dans le
 * fichier .env : l'administrateur peut donc les changer depuis le site, sans
 * redémarrer le serveur.
 */

export const SETTINGS = {
  PAYMENT_MODE: "payment_mode",
} as const;

export const PaymentMode = {
  /** Vraie passerelle Konnect (nécessite Internet et des clés valides). */
  KONNECT: "konnect",
  /** Passerelle de démonstration intégrée, 100 % locale. */
  DEMO: "demo",
} as const;

export type PaymentModeValue = (typeof PaymentMode)[keyof typeof PaymentMode];

/** Lit un réglage. Renvoie `fallback` si rien n'a encore été enregistré. */
export async function getSetting(key: string, fallback: string): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch (error) {
    // Base indisponible : on préfère un comportement par défaut plutôt
    // qu'une page en erreur.
    console.error("GET_SETTING_ERROR", key, error);
    return fallback;
  }
}

/** Écrit un réglage (le crée s'il n'existe pas encore). */
export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

/**
 * Mode de paiement actuellement actif.
 *
 * Valeur par défaut : celle de PAYMENT_MODE dans .env, sinon « konnect ».
 * Dès que l'administrateur bascule le réglage dans le panneau, c'est la
 * valeur enregistrée en base qui l'emporte.
 */
export async function getPaymentMode(): Promise<PaymentModeValue> {
  const fallback =
    process.env.PAYMENT_MODE === PaymentMode.DEMO ? PaymentMode.DEMO : PaymentMode.KONNECT;

  const value = await getSetting(SETTINGS.PAYMENT_MODE, fallback);

  return value === PaymentMode.DEMO ? PaymentMode.DEMO : PaymentMode.KONNECT;
}

export async function setPaymentMode(mode: PaymentModeValue): Promise<void> {
  await setSetting(SETTINGS.PAYMENT_MODE, mode);
}
