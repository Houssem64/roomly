import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { initPayment, isKonnectConfigured, PaymentStatus } from "@/app/libs/konnect";
import { initDemoPayment } from "@/app/libs/demoPayment";
import { getPaymentMode, PaymentMode } from "@/app/libs/settings";

/**
 * Démarre le paiement d'une réservation.
 *
 * Deux passerelles possibles, choisies par l'administrateur dans l'onglet
 * « Réglages » :
 *   - Konnect      : la vraie passerelle bancaire (nécessite Internet) ;
 *   - Démonstration : une simulation locale, utile hors ligne ou quand le
 *                     bac à sable de Konnect est indisponible.
 *
 * Dans les deux cas, le montant est repris depuis la base de données et
 * jamais depuis le navigateur : sinon n'importe qui pourrait payer un dinar
 * pour une villa.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const { reservationId } = await request.json();
    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json({ error: "No reservation specified." }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    // On ne paie que ses propres réservations.
    if (reservation.userId !== currentUser.id) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    if (reservation.paymentStatus === PaymentStatus.COMPLETED) {
      return NextResponse.json({ error: "This reservation is already paid." }, { status: 400 });
    }

    const baseUrl =
      process.env.BASE_URL || process.env.NEXTAUTH_URL || new URL(request.url).origin;

    const mode = await getPaymentMode();

    // ---------------- Passerelle de démonstration ----------------
    if (mode === PaymentMode.DEMO) {
      const { payUrl, paymentRef, expiresAt } = initDemoPayment(baseUrl);

      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          paymentRef,
          paymentStatus: PaymentStatus.PENDING,
          paymentExpiresAt: expiresAt,
        },
      });

      return NextResponse.json({ payUrl, paymentRef, mode });
    }

    // ---------------- Vraie passerelle Konnect ----------------
    if (!isKonnectConfigured()) {
      return NextResponse.json(
        {
          error:
            "Konnect payment is not configured. Set KONNECT_API_KEY and KONNECT_WALLET_ID " +
            "in .env, or switch to the demo gateway from the admin panel.",
        },
        { status: 503 }
      );
    }

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
      data: {
        paymentRef,
        paymentStatus: PaymentStatus.PENDING,
        paymentExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    return NextResponse.json({ payUrl, paymentRef, mode });
  } catch (error) {
    console.error("PAYMENT_INIT_ERROR", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start the payment." },
      { status: 500 }
    );
  }
}
