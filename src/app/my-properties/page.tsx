import { Suspense } from "react";
import MyPropertiesClient from "./MyPropertiesClient";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default async function MyPropertiesPage() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return <EmptyState
                title="Unauthorized"
                subtitle="Please login to view your properties"
            />;
        }

        const listings = await getListings({ userId: currentUser.id });
        if (!listings.length) {
            return <EmptyState
                title="No properties found"
                subtitle="Looks like you haven't listed any properties yet"
            />;
        }

        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <MyPropertiesClient
                        listings={listings}
                        currentUser={currentUser}
                    />
                </Suspense>
            </ClientOnly>
        );
    } catch (error) {
        console.error('Error:', error);
        return <EmptyState 
            title="Error" 
            subtitle="Something went wrong while loading your properties" 
        />;
    }
}