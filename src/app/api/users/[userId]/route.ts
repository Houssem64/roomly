import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentAdmin from '@/app/actions/getCurrentAdmin';
import { deleteLocalUpload } from '@/app/libs/uploads';

interface IParams {
    userId?: string;
}

/**
 * Suppression d'un compte par un administrateur.
 *
 * Supprimer un compte supprime aussi, en cascade, ses annonces et ses
 * réservations (voir onDelete: Cascade dans prisma/schema.prisma). On en
 * profite pour effacer les photos correspondantes du dossier public/uploads,
 * afin de ne pas laisser de fichiers orphelins.
 */
export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
    }

    try {
        const { userId } = params;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                image: true,
                listings: { select: { imageSrc: true } },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
        }

        await prisma.user.delete({ where: { id: userId } });

        // Nettoyage des fichiers : jamais bloquant.
        await Promise.all([
            ...user.listings.map((l) => deleteLocalUpload(l.imageSrc)),
            deleteLocalUpload(user.image),
        ]);

        return NextResponse.json({
            message: "Compte supprimé.",
            deletedListings: user.listings.length,
        });
    } catch (error) {
        console.error('ADMIN_DELETE_USER_ERROR', error);
        return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
    }
}
