import { Suspense } from 'react';
import MyReservationsClient from './MyReservationsClient';
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default async function MyReservationsPage() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return <EmptyState 
                title="Unauthorized" 
                subtitle="Please login to see your reservations" 
            />;
        }

        const reservations = await getReservations({ userId: currentUser.id });
        if (!reservations.length) {
            return <EmptyState 
                title="No reservations" 
                subtitle="You have not made any reservations yet" 
            />;
        }

        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <MyReservationsClient
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
            subtitle="Something went wrong while loading your reservations" 
        />;
    }
}