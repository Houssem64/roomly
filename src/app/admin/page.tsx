import { redirect } from "next/navigation";
import { Suspense } from "react";

import AdminComponent from "./AdminComponent";
import Loader from "../components/Loader";
import ClientOnly from "../components/ClientOnly";
import getCurrentAdmin from "../actions/getCurrentAdmin";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** Page de connexion de l'espace d'administration. */
export default async function AdminPage() {
    // Déjà connecté : inutile de redemander le mot de passe.
    const admin = await getCurrentAdmin();
    if (admin) {
        redirect("/admin/dashboard");
    }

    return (
        <ClientOnly>
            <Suspense fallback={<Loader />}>
                <AdminComponent />
            </Suspense>
        </ClientOnly>
    );
}
