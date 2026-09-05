import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { BLOCKING_PAYMENT_STATUSES, PaymentStatus } from "@/app/libs/konnect";

/**
 * Création d'une réservation.
 *
 * La réservation est enregistrée « en attente de paiement ». Elle ne devient
 * définitive qu'une fois le paiement confirmé par Konnect
 * (voir /api/payments/init et /api/payments/webhook).
 */
export async function POST(request: Request) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json(
            { error: "Vous devez être connecté pour réserver." },
            { status: 401 }
        );
    }

    const body = await request.json();
    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.json(
            { error: "Informations de réservation incomplètes." },
            { status: 400 }
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
    }
    if (end < start) {
        return NextResponse.json(
            { error: "La date de fin doit suivre la date de début." },
            { status: 400 }
        );
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
        return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }

    if (listing.userId === currentUser.id) {
        return NextResponse.json(
            { error: "Vous ne pouvez pas réserver votre propre bien." },
            { status: 400 }
        );
    }

    // Vérification de disponibilité : deux séjours se chevauchent dès que
    // l'un commence avant que l'autre ne finisse. Les réservations dont le
    // paiement a échoué ne bloquent plus les dates.
    const overlapping = await prisma.reservation.findFirst({
        where: {
            listingId,
            paymentStatus: { in: [...BLOCKING_PAYMENT_STATUSES] },
            startDate: { lte: end },
            endDate: { gte: start },
        },
    });

    if (overlapping) {
        return NextResponse.json(
            { error: "Ces dates viennent d'être réservées. Choisissez une autre période." },
            { status: 409 }
        );
    }

    const reservation = await prisma.reservation.create({
        data: {
            listingId,
            userId: currentUser.id,
            startDate: start,
            endDate: end,
            totalPrice: Math.round(Number(totalPrice)),
            phoneNumber: currentUser.phoneNumber,
            paymentStatus: PaymentStatus.PENDING,
        },
    });

    return NextResponse.json({
        id: reservation.id,
        totalPrice: reservation.totalPrice,
        paymentStatus: reservation.paymentStatus,
    });
}
