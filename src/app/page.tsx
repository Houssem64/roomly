import HomeComponent from "./components/HomeComponent";
import getListings, { IListingsParams } from "./actions/getListings";
import getCurrentUser from "./actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { SafeUser } from "./types";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
interface HomeProps {
  searchParams: IListingsParams
}

export default async function Home({ searchParams }: HomeProps) {
  try {
    const listings = await getListings(searchParams);
    const currentUser = await getCurrentUser();

    return (
      <ClientOnly>
        <Suspense fallback={<Loader />}>
          <HomeComponent 
            listings={listings}
            currentUser={currentUser as SafeUser | null}
          />
        </Suspense>
      </ClientOnly>
    );
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}