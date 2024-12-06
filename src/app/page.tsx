import HomeComponent from "./components/HomeComponent";
import getListings from "./actions/getListings";
import getCurrentUser from "./actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";
import { Suspense } from "react";
import Loader from "./components/Loader";
import EmptyState from "./components/EmptyState";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default async function Home() {
  try {
    const listings = await getListings({});
    const currentUser = await getCurrentUser();

    if (!listings.length) {
      return (
        <ClientOnly>
          <EmptyState 
            title="No properties found" 
            subtitle="Looks like there are no properties available." 
          />
        </ClientOnly>
      );
    }

    return (
      <ClientOnly>
        <Suspense fallback={<Loader />}>
          <HomeComponent 
            listings={listings}
            currentUser={currentUser}
          />
        </Suspense>
      </ClientOnly>
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <ClientOnly>
        <EmptyState 
          title="Error" 
          subtitle="Something went wrong while loading properties" 
        />
      </ClientOnly>
    );
  }
}