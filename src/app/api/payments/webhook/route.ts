import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { getPaymentStatus, PaymentStatus } from "@/app/libs/konnect";

export const dynamic = "force-dynamic";

/**
 * Adresse appelée par Konnect pour annoncer le résultat d'un paiement.
 *
 * Point important : le paramètre reçu (payment_ref) sert uniquement à savoir
 * DE QUEL paiement on parle. L'état réel est ensuite redemandé directement
 * à Konnect. Sans cela, il suffirait d'ouvrir cette adresse à la main pour
 * faire passer une réservation en « payée ».
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentRef = searchParams.get("payment_ref") || searchParams.get("paymentRef");

  if (!paymentRef) {
    return NextResponse.json({ error: "payment_ref manquant." }, { status: 400 });
  }

  return handle(paymentRef);
}

/** Konnect peut aussi notifier en POST selon la configuration du compte. */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  let paymentRef = searchParams.get("payment_ref") || searchParams.get("paymentRef");

  if (!paymentRef) {
    try {
      const body = await request.json();
      paymentRef = body?.payment_ref || body?.paymentRef || null;
    } catch {
      /* corps vide ou non JSON */
    }
  }

  if (!paymentRef) {
    return NextResponse.json({ error: "payment_ref manquant." }, { status: 400 });
  }

  return handle(paymentRef);
}

async function handle(paymentRef: string) {
  try {
    const reservation = await prisma.reservation.findFirst({ where: { paymentRef } });

    if (!reservation) {
      // Réservation supprimée entre-temps : rien à faire, mais on répond
      // « 200 » pour que Konnect ne réessaie pas indéfiniment.
      console.warn("PAYMENT_WEBHOOK_UNKNOWN_REF", paymentRef);
      return NextResponse.json({ received: true });
    }

    const status = await getPaymentStatus(paymentRef);

    if (reservation.paymentStatus !== status) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { paymentStatus: status },
      });
      console.log("PAYMENT_WEBHOOK", paymentRef, reservation.paymentStatus, "→", status);
    }

    return NextResponse.json({ received: true, status });
  } catch (error) {
    console.error("PAYMENT_WEBHOOK_ERROR", error);
    return NextResponse.json({ error: "Vérification impossible." }, { status: 500 });
  }
}

