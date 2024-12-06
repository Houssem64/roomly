import { Suspense } from "react";
import FavoritesClient from "./FavoritesClient";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default async function FavoritesPage() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return <EmptyState
                title="Unauthorized"
                subtitle="Please login to view your favorites"
            />;
        }

        const listings = await getFavoriteListings();
        if (!listings.length) {
            return <EmptyState
                title="No favorites found"
                subtitle="Looks like you haven't favorited any properties yet"
            />;
        }

        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <FavoritesClient
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
            subtitle="Something went wrong while loading your favorites" 
        />;
    }
}