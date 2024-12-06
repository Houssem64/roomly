import { Suspense } from "react";

import Loader from "../components/Loader";
import ReservationsClient from "./ReservationsClient";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function PropertyReservationsPage() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return <EmptyState
                title="Unauthorized"
                subtitle="Please login to view property reservations"
            />;
        }

        const reservations = await getReservations({ authorId: currentUser.id });
        if (!reservations.length) {
            return <EmptyState
                title="No reservations found"
                subtitle="Looks like you have no reservations on your properties"
            />;
        }

        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <ReservationsClient
                        reservations={reservations}
                        currentUser={currentUser}
                    />
                </Suspense>
            </ClientOnly>
        );
    } catch (error) {
        console.error('Error:', error);
        return <EmptyState 
            title="Error" 
            subtitle="Something went wrong while loading property reservations" 
        />;
    }
}