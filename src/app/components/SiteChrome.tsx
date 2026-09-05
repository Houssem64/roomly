"use client";

import { usePathname } from "next/navigation";

const isAdminArea = (pathname: string | null) => Boolean(pathname?.startsWith("/admin"));

/**
 * Masque l'habillage du site public (barre de navigation, fenêtres de
 * connexion, de recherche...) dans l'espace d'administration, qui a sa
 * propre interface.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (isAdminArea(pathname)) return null;
    return <>{children}</>;
}

/**
 * Zone de contenu. Sur le site public il faut réserver la place de la barre
 * de navigation fixe ; dans l'administration, non.
 */
export function PageArea({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return <div className={isAdminArea(pathname) ? "" : "pb-20 pt-28"}>{children}</div>;
}
