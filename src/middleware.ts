import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

/**
 * Garde d'entrée de l'espace d'administration.
 *
 * Tout ce qui commence par /admin/dashboard ou /api/admin est réservé aux
 * comptes administrateurs. Les pages redirigent vers la page de connexion,
 * tandis que les adresses d'API répondent une erreur 401 en JSON.
 *
 * Remarque : ce filtre est une première barrière. Chaque route sensible
 * revérifie de son côté (voir getCurrentAdmin), car le middleware ne peut
 * pas interroger la base de données.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request });
    const isAdmin = token?.role === "admin";

    if (isAdmin) return NextResponse.next();

    // Adresses d'API : réponse machine.
    if (pathname.startsWith("/api/")) {
        return NextResponse.json(
            { error: "Réservé aux administrateurs." },
            { status: 401 }
        );
    }

    // Pages : retour à l'écran de connexion.
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/admin/dashboard/:path*",
        "/api/admin/:path*",
        "/api/users/:path*",
        "/api/alllistings/:path*",
    ],
};
