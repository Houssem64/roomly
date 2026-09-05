import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";

/**
 * Gestion des comptes administrateurs.
 *
 * Seul un administrateur déjà connecté peut en créer un autre. Le tout
 * premier administrateur est créé par le script d'installation :
 *   npm run db:seed
 *
 * (Sans ce contrôle, n'importe quel visiteur pourrait se fabriquer un
 * compte administrateur en appelant cette adresse.)
 */
export async function POST(request: Request) {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json(
            { error: "Réservé aux administrateurs déjà connectés." },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Adresse e-mail et mot de passe obligatoires." },
                { status: 400 }
            );
        }

        if (String(password).length < 8) {
            return NextResponse.json(
                { error: "Le mot de passe doit contenir au moins 8 caractères." },
                { status: 400 }
            );
        }

        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return NextResponse.json(
                { error: "Un administrateur utilise déjà cette adresse." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const created = await prisma.admin.create({
            data: { email, hashedPassword },
        });

        return NextResponse.json(
            { id: created.id, email: created.email },
            { status: 201 }
        );
    } catch (error) {
        console.error("ADMIN_REGISTRATION_ERROR", error);
        return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
    }
}

/** Liste des administrateurs (sans les mots de passe). */
export async function GET() {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
    }

    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, email: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(admins, { status: 200 });
    } catch (error) {
        console.error("FETCH_ADMINS_ERROR", error);
        return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
    }
}
