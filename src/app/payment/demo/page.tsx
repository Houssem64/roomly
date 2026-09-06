import { redirect } from "next/navigation";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { isDemoRef } from "@/app/libs/demoPayment";
import { PaymentStatus } from "@/app/libs/konnect";
import EmptyState from "@/app/components/EmptyState";
import DemoCheckout from "./DemoCheckout";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
    searchParams: { ref?: string };
}

/**
 * Page de paiement de démonstration.
 *
 * Les contrôles sont faits ici, côté serveur : on vérifie que la référence
 * existe, qu'elle appartient bien à la personne connectée, et que le
 * paiement est encore en attente.
 */
export default async function DemoPaymentPage({ searchParams }: PageProps) {
    const paymentRef = searchParams.ref;

    if (!paymentRef || !isDemoRef(paymentRef)) {
        return (
            <EmptyState
                title="Invalid payment link"
                subtitle="This address does not match any demo payment."
            />
        );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return (
            <EmptyState
                title="Sign in required"
                subtitle="Sign in to pay for your reservation."
            />
        );
    }

    const reservation = await prisma.reservation.findFirst({
        where: { paymentRef },
        include: { listing: { select: { title: true } } },
    });

    // Réservation inexistante, ou appartenant à quelqu'un d'autre : dans les
    // deux cas la même réponse, pour ne rien révéler.
    if (!reservation || reservation.userId !== currentUser.id) {
        return (
            <EmptyState
                title="Payment not found"
                subtitle="This payment does not exist, or is not yours."
            />
        );
    }

    // Déjà réglé : inutile de repasser par la caisse.
    if (reservation.paymentStatus === PaymentStatus.COMPLETED) {
        redirect(`/payment/success?payment_ref=${encodeURIComponent(paymentRef)}`);
    }

    return (
        <DemoCheckout
            paymentRef={paymentRef}
            amount={reservation.totalPrice}
            description={`Roomly — ${reservation.listing.title}`}
            merchant="roomly"
            expiresAt={reservation.paymentExpiresAt?.toISOString() ?? null}
        />
    );
}
