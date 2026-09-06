"use client";

import { usePathname } from "next/navigation";

/**
 * Pages qui ne doivent PAS porter l'habillage du site public :
 *   - /admin        : l'espace d'administration a sa propre interface ;
 *   - /payment/demo : c'est une passerelle de paiement, elle doit se
 *                     présenter comme une page autonome, exactement comme
 *                     la vraie page de Konnect.
 */
const STANDALONE_PREFIXES = ["/admin", "/payment/demo"];

const isStandalone = (pathname: string | null) =>
    STANDALONE_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

/** Masque la barre de navigation et les fenêtres du site public. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (isStandalone(pathname)) return null;
    return <>{children}</>;
}

/**
 * Zone de contenu. Sur le site public il faut réserver la place de la barre
 * de navigation fixe ; sur les pages autonomes, non.
 */
export function PageArea({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return <div className={isStandalone(pathname) ? "" : "pb-20 pt-28"}>{children}</div>;
}
