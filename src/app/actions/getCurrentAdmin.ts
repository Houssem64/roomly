import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export interface CurrentAdmin {
  id: string;
  email: string;
}

/**
 * Renvoie l'administrateur connecté, ou null.
 *
 * À ne pas confondre avec getCurrentUser() : les administrateurs vivent
 * dans une collection séparée (« Admin »), pas dans « User ». getCurrentUser()
 * renverrait donc toujours null pour un administrateur.
 *
 * La vérification est refaite ici contre la base de données : le simple fait
 * que le jeton de session annonce « role: admin » ne suffit pas si le compte
 * a été supprimé entre-temps.
 */
export default async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  try {
    const session = await getServerSession(authOptions);

    const email = session?.user?.email;
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!email || role !== "admin") return null;

    const admin = await prisma.admin.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    return admin;
  } catch (error) {
    console.error("GET_CURRENT_ADMIN_ERROR", error);
    return null;
  }
}
