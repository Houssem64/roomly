import prisma from '@/app/libs/prismadb';
import { BLOCKING_PAYMENT_STATUSES } from '@/app/libs/konnect';


interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
    /**
     * Ne remonter que les réservations qui bloquent réellement le calendrier
     * (paiement réussi ou en attente). Utilisé sur la fiche d'un bien : une
     * réservation dont le paiement a échoué ne doit pas condamner les dates.
     */
    blockingOnly?: boolean;
}
export default async function getReservations(params: IParams) {
    try {
        const { listingId, userId, authorId, blockingOnly } = params;
        const query: any = {}
        if (listingId) {
            query.listingId = listingId;
        }
        if (userId) {
            query.userId = userId;
        }
        if (authorId) {
            query.listing = { userId: authorId };
        }
        if (blockingOnly) {
            query.paymentStatus = { in: [...BLOCKING_PAYMENT_STATUSES] };
        }
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
                // Le propriétaire doit pouvoir contacter son locataire :
                // on remonte le strict nécessaire, jamais le mot de passe.
                user: { select: { name: true, email: true, phoneNumber: true, image: true } },
            },
            orderBy: {
                startDate: 'desc'
            }
        });
        const SafeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            paymentExpiresAt: reservation.paymentExpiresAt?.toISOString() ?? null,
            guest: reservation.user,
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString(),

            }
        }))
        return SafeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}
