import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentAdmin from '@/app/actions/getCurrentAdmin';

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/**
 * Liste des annonces pour l'espace d'administration — CONSULTATION SEULE.
 *
 * L'administrateur ne gère pas les biens : chaque propriétaire gère les
 * siens depuis « Mes propriétés ». Cette vue sert uniquement au suivi.
 *
 * Paramètres : ?q=recherche&category=Villa&city=Tunis&page=1&limit=10
 */
export async function GET(request: Request) {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);

        const q = (searchParams.get('q') || '').trim();
        const category = searchParams.get('category') || '';
        const city = searchParams.get('city') || '';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
        const limit = Math.min(
            MAX_PAGE_SIZE,
            Math.max(1, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10) || PAGE_SIZE)
        );

        const where: any = {};

        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { locationValue: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (category) where.category = category;
        if (city) where.locationValue = city;

        const [total, listings, allCategories, allCities] = await Promise.all([
            prisma.listing.count({ where }),
            prisma.listing.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: { select: { name: true, email: true } },
                    _count: { select: { reservation: true } },
                },
            }),
            // Valeurs proposées dans les filtres, calculées depuis les données
            // réelles plutôt que codées en dur.
            prisma.listing.findMany({ select: { category: true }, distinct: ['category'] }),
            prisma.listing.findMany({ select: { locationValue: true }, distinct: ['locationValue'] }),
        ]);

        return NextResponse.json({
            data: listings.map((listing) => ({
                id: listing.id,
                title: listing.title,
                description: listing.description,
                imageSrc: listing.imageSrc,
                category: listing.category,
                locationValue: listing.locationValue,
                price: listing.price,
                roomCount: listing.roomCount,
                guestCount: listing.guestCount,
                createdAt: listing.createdAt.toISOString(),
                ownerName: listing.user.name,
                ownerEmail: listing.user.email,
                reservationCount: listing._count.reservation,
            })),
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            limit,
            filters: {
                categories: allCategories.map((c) => c.category).filter(Boolean).sort(),
                cities: allCities.map((c) => c.locationValue).filter(Boolean).sort(),
            },
        });
    } catch (error) {
        console.error('ADMIN_LISTINGS_ERROR', error);
        return NextResponse.json({ error: 'Chargement des annonces impossible.' }, { status: 500 });
    }
}
