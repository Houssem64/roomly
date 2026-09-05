import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentAdmin from '@/app/actions/getCurrentAdmin';

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/**
 * Liste des utilisateurs pour l'espace d'administration.
 *
 * Recherche, tri et pagination sont faits par la base de données : le
 * navigateur ne reçoit qu'une page à la fois, ce qui reste rapide même
 * avec des milliers de comptes.
 *
 * Paramètres : ?q=recherche&role=owner&page=1&limit=10&sort=createdAt&order=desc
 */
export async function GET(request: Request) {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);

        const q = (searchParams.get('q') || '').trim();
        const role = searchParams.get('role') || '';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
        const limit = Math.min(
            MAX_PAGE_SIZE,
            Math.max(1, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10) || PAGE_SIZE)
        );

        const sortField = ['createdAt', 'name', 'email'].includes(searchParams.get('sort') || '')
            ? (searchParams.get('sort') as string)
            : 'createdAt';
        const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

        const where: any = {};

        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { phoneNumber: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (role) {
            // « user » couvre aussi les anciens comptes sans rôle enregistré.
            where.role = role === 'user' ? { in: ['user', null] } : role;
        }

        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phoneNumber: true,
                    role: true,
                    createdAt: true,
                    _count: { select: { listings: true, reservations: true } },
                },
                orderBy: { [sortField]: order },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        return NextResponse.json({
            data: users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                phoneNumber: user.phoneNumber,
                role: user.role || 'user',
                createdAt: user.createdAt.toISOString(),
                listingCount: user._count.listings,
                reservationCount: user._count.reservations,
            })),
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            limit,
        });
    } catch (error) {
        console.error('ADMIN_USERS_ERROR', error);
        return NextResponse.json({ error: 'Chargement des utilisateurs impossible.' }, { status: 500 });
    }
}
