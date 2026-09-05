import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { initPayment, isKonnectConfigured, PaymentStatus } from "@/app/libs/konnect";

/**
 * Démarre le paiement d'une réservation.
 *
 * Le montant est repris depuis la base de données, jamais depuis le
 * navigateur : sinon n'importe qui pourrait payer un dinar pour une villa.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
    }

    if (!isKonnectConfigured()) {
      return NextResponse.json(
        {
          error:
            "Le paiement en ligne n'est pas configuré. Renseignez KONNECT_API_KEY et KONNECT_WALLET_ID dans le fichier .env.",
        },
        { status: 503 }
      );
    }

    const { reservationId } = await request.json();
    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json({ error: "Réservation non précisée." }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    // On ne paie que ses propres réservations.
    if (reservation.userId !== currentUser.id) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    if (reservation.paymentStatus === PaymentStatus.COMPLETED) {
      return NextResponse.json(
        { error: "Cette réservation est déjà payée." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.BASE_URL || process.env.NEXTAUTH_URL || new URL(request.url).origin;

    const [firstName, ...rest] = (currentUser.name || "Client Roomly").trim().split(/\s+/);

    const { payUrl, paymentRef } = await initPayment({
      amountInDinars: reservation.totalPrice,
      orderId: reservation.id,
      description: `Roomly — ${reservation.listing.title}`.slice(0, 100),
      firstName,
      lastName: rest.join(" ") || firstName,
      email: currentUser.email || "client@roomly.tn",
      phoneNumber: currentUser.phoneNumber,
      baseUrl,
    });

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { paymentRef, paymentStatus: PaymentStatus.PENDING },
    });

    return NextResponse.json({ payUrl, paymentRef });
  } catch (error) {
    console.error("PAYMENT_INIT_ERROR", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Le démarrage du paiement a échoué.",
      },
      { status: 500 }
    );
  }
}
