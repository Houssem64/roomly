import prisma from "@/app/libs/prismadb";
import { getPaymentStatus, PaymentStatus, PaymentStatusValue } from "@/app/libs/konnect";

export interface VerifiedPayment {
  status: PaymentStatusValue | "UNKNOWN";
  reservation: {
    id: string;
    totalPrice: number;
    startDate: Date;
    endDate: Date;
    listingTitle: string;
  } | null;
}

/**
 * Redemande à Konnect l'état d'un paiement et met la réservation à jour.
 *
 * Sur un ordinateur personnel, Konnect ne peut pas appeler le webhook :
 * « localhost » n'existe pas depuis Internet. C'est donc cette vérification,
 * déclenchée au retour du locataire sur le site, qui confirme le paiement
 * en développement. Les deux chemins font exactement le même contrôle.
 */
export default async function verifyPayment(paymentRef?: string | null): Promise<VerifiedPayment> {
  if (!paymentRef) return { status: "UNKNOWN", reservation: null };

  try {
    const reservation = await prisma.reservation.findFirst({
      where: { paymentRef },
      include: { listing: { select: { title: true } } },
    });

    if (!reservation) return { status: "UNKNOWN", reservation: null };

    let status: PaymentStatusValue = reservation.paymentStatus as PaymentStatusValue;

    // Un paiement déjà confirmé n'est jamais redemandé.
    if (status !== PaymentStatus.COMPLETED) {
      status = await getPaymentStatus(paymentRef);

      if (status !== reservation.paymentStatus) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { paymentStatus: status },
        });
      }
    }

    return {
      status,
      reservation: {
        id: reservation.id,
        totalPrice: reservation.totalPrice,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        listingTitle: reservation.listing.title,
      },
    };
  } catch (error) {
    console.error("VERIFY_PAYMENT_ERROR", error);
    return { status: "UNKNOWN", reservation: null };
  }
}
