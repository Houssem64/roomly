import { redirect } from "next/navigation";
import { Suspense } from "react";

import DashboardComponent from "./DashboardComponent";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DashboardPage() {
    try {
        // Contrôle d'accès côté serveur : sans compte administrateur valide,
        // la page n'est jamais construite ni envoyée au navigateur.
        const admin = await getCurrentAdmin();
        if (!admin) {
            redirect("/admin");
        }

        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <DashboardComponent adminEmail={admin.email} />
                </Suspense>
            </ClientOnly>
        );
    } catch (error) {
        // redirect() fonctionne en levant une exception : il ne faut surtout
        // pas l'intercepter ici.
        if (error && typeof error === "object" && "digest" in error) {
            throw error;
        }

        console.error("ADMIN_DASHBOARD_ERROR", error);
        return (
            <EmptyState
                title="Erreur"
                subtitle="Le tableau de bord n'a pas pu être chargé."
            />
        );
    }
}
