/**
 * Passerelle de paiement Konnect.
 *
 * C'est le SEUL service extérieur utilisé par Roomly : tout le reste
 * (base de données, photos) fonctionne sur l'ordinateur.
 *
 * Ce fichier ne doit jamais être importé depuis un composant "use client" :
 * la clé d'API resterait alors visible dans le navigateur.
 */

const API_URL = process.env.KONNECT_API_URL || "https://api.preprod.konnect.network/api/v2";
const API_KEY = process.env.KONNECT_API_KEY;
const WALLET_ID = process.env.KONNECT_WALLET_ID;

export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type PaymentStatusValue = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/** Une réservation dont le paiement a échoué ne bloque plus le calendrier. */
export const BLOCKING_PAYMENT_STATUSES = [PaymentStatus.PENDING, PaymentStatus.COMPLETED];

export function isKonnectConfigured(): boolean {
  return Boolean(API_KEY && WALLET_ID);
}

/** Konnect raisonne en millimes : 1 dinar = 1000 millimes. */
export function dinarsToMillimes(dinars: number): number {
  return Math.round(dinars * 1000);
}

interface InitPaymentInput {
  amountInDinars: number;
  orderId: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  baseUrl: string;
}

interface InitPaymentResult {
  payUrl: string;
  paymentRef: string;
}

/**
 * Démarre un paiement et renvoie l'adresse de la page de paiement Konnect,
 * vers laquelle le navigateur du locataire sera redirigé.
 */
export async function initPayment(input: InitPaymentInput): Promise<InitPaymentResult> {
  if (!API_KEY || !WALLET_ID) {
    throw new Error(
      "Le paiement n'est pas configuré : renseignez KONNECT_API_KEY et KONNECT_WALLET_ID dans le fichier .env."
    );
  }

  const body = {
    receiverWalletId: WALLET_ID,
    token: "TND",
    amount: dinarsToMillimes(input.amountInDinars),
    type: "immediate",
    description: input.description,
    acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
    lifespan: 30, // minutes avant expiration du lien de paiement
    checkoutForm: false,
    addPaymentFeesToAmount: false,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneNumber: sanitisePhone(input.phoneNumber),
    email: input.email,
    orderId: input.orderId,
    // Konnect appelle cette adresse tout seul, en arrière-plan, pour nous
    // annoncer le résultat. C'est cette information qui fait foi.
    webhook: `${input.baseUrl}/api/payments/webhook`,
    silentWebhook: true,
    successUrl: `${input.baseUrl}/payment/success`,
    failUrl: `${input.baseUrl}/payment/failed`,
    theme: "light",
  };

  const response = await fetch(`${API_URL}/payments/init-payment`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("KONNECT_INIT_FAILED", response.status, text);
    throw new Error(describeKonnectError(response.status, text));
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Réponse illisible de la passerelle de paiement.");
  }

  if (!data?.payUrl || !data?.paymentRef) {
    console.error("KONNECT_INIT_UNEXPECTED", text);
    throw new Error("Réponse inattendue de la passerelle de paiement.");
  }

  return { payUrl: data.payUrl, paymentRef: data.paymentRef };
}

/**
 * Interroge Konnect pour connaître l'état réel d'un paiement.
 *
 * On ne fait JAMAIS confiance à ce qui arrive dans l'adresse de retour :
 * n'importe qui pourrait la fabriquer. Seule cette vérification compte.
 */
export async function getPaymentStatus(paymentRef: string): Promise<PaymentStatusValue> {
  if (!API_KEY) {
    throw new Error("KONNECT_API_KEY manquant dans le fichier .env.");
  }

  const response = await fetch(`${API_URL}/payments/${encodeURIComponent(paymentRef)}`, {
    headers: { "x-api-key": API_KEY },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    console.error("KONNECT_STATUS_FAILED", response.status, await response.text());
    throw new Error("Impossible de vérifier l'état du paiement.");
  }

  const data = await response.json();
  const payment = data?.payment ?? data;

  const status = String(payment?.status ?? "").toLowerCase();

  if (["completed", "success", "successful", "paid"].includes(status)) {
    return PaymentStatus.COMPLETED;
  }

  // Certains paiements restent « pending » alors qu'une transaction a
  // déjà abouti : on regarde donc aussi le détail des transactions.
  const transactions: any[] = Array.isArray(payment?.transactions) ? payment.transactions : [];
  const succeeded = transactions.some((t) =>
    ["success", "completed", "successful"].includes(String(t?.status ?? "").toLowerCase())
  );
  if (succeeded) return PaymentStatus.COMPLETED;

  if (["failed", "expired", "cancelled", "canceled", "aborted"].includes(status)) {
    return PaymentStatus.FAILED;
  }

  return PaymentStatus.PENDING;
}

/** Konnect attend un numéro sans espaces ni indicatif « + ». */
function sanitisePhone(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/[^\d]/g, "");
}

/**
 * Traduit la réponse d'erreur de Konnect en un message exploitable.
 *
 * Sans cela, une clé d'API expirée se manifeste par un simple « erreur 500 »,
 * impossible à diagnostiquer.
 */
function describeKonnectError(status: number, body: string): string {
  let code = "";
  let message = "";

  try {
    const parsed = JSON.parse(body);
    const first = Array.isArray(parsed?.errors) ? parsed.errors[0] : null;
    code = String(first?.code ?? "");
    message = String(first?.message ?? "");
  } catch {
    /* réponse non JSON */
  }

  if (status === 401 || code === "AUTHENTICATE_TOKEN_INVALID") {
    return (
      "Clé d'API Konnect refusée. Vérifiez KONNECT_API_KEY et KONNECT_WALLET_ID " +
      "dans le fichier .env : la clé doit être celle du tableau de bord Konnect " +
      "(https://dashboard.preprod.konnect.network), au format « identifiant:secret »."
    );
  }

  if (status === 422 || status === 400) {
    return `Konnect a refusé les informations de paiement${message ? " : " + message : "."}`;
  }

  return `La passerelle de paiement a répondu une erreur ${status}${message ? " : " + message : "."}`;
}
