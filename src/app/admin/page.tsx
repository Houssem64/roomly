import { Suspense } from "react";
import AdminComponent from "./AdminComponent";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default async function AdminPage() {
    try {
       /*  const currentUser = await getCurrentUser();
        if (!currentUser?.isAdmin) {
            return <EmptyState
                title="Unauthorized"
                subtitle="You must be an admin to view this page"
            />;
        } */

        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <AdminComponent /* currentUser={currentUser} */ />
                </Suspense>
            </ClientOnly>
        );
    } catch (error) {
        console.error('Error:', error);
        return <EmptyState 
            title="Error" 
            subtitle="Something went wrong while loading the admin page" 
        />;
    }
}