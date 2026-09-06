import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { isDemoRef } from "@/app/libs/demoPayment";
import { PaymentStatus } from "@/app/libs/konnect";
import { getPaymentMode, PaymentMode } from "@/app/libs/settings";

/**
 * Résultat d'un paiement de démonstration.
 *
 * C'est l'équivalent local du retour de Konnect. Plusieurs garde-fous, pour
 * que cette adresse ne devienne pas un moyen de valider n'importe quoi :
 *   - la passerelle de démonstration doit être active ;
 *   - la référence doit être une référence de démonstration ;
 *   - la réservation doit appartenir à la personne connectée ;
 *   - le lien ne doit pas être expiré.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const mode = await getPaymentMode();
    if (mode !== PaymentMode.DEMO) {
      return NextResponse.json(
        { error: "The demo gateway is not active." },
        { status: 409 }
      );
    }

    const { paymentRef, outcome } = await request.json();

    if (!paymentRef || !isDemoRef(paymentRef)) {
      return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
    }
    if (outcome !== "success" && outcome !== "failure") {
      return NextResponse.json({ error: "Invalid payment outcome." }, { status: 400 });
    }

    const reservation = await prisma.reservation.findFirst({ where: { paymentRef } });

    if (!reservation || reservation.userId !== currentUser.id) {
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    }

    if (reservation.paymentStatus === PaymentStatus.COMPLETED) {
      return NextResponse.json({
        status: PaymentStatus.COMPLETED,
        redirectUrl: `/payment/success?payment_ref=${encodeURIComponent(paymentRef)}`,
      });
    }

    const expired =
      reservation.paymentExpiresAt !== null && reservation.paymentExpiresAt < new Date();

    if (expired) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      return NextResponse.json(
        { error: "This payment link has expired." },
        { status: 410 }
      );
    }

    const status = outcome === "success" ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { paymentStatus: status },
    });

    return NextResponse.json({
      status,
      redirectUrl:
        status === PaymentStatus.COMPLETED
          ? `/payment/success?payment_ref=${encodeURIComponent(paymentRef)}`
          : `/payment/failed?payment_ref=${encodeURIComponent(paymentRef)}`,
    });
  } catch (error) {
    console.error("DEMO_PAYMENT_CONFIRM_ERROR", error);
    return NextResponse.json({ error: "The payment could not be processed." }, { status: 500 });
  }
}
