import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import MyPropertiesClient from "./MyProperties";
const myPropertiesPage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return <EmptyState title="You are not logged in" subtitle="Please login to see your reservations" />;
    }


    const listings = await getListings({ userId: currentUser.id });
    if (!listings.length) {
        return <EmptyState title="No Properties Found" subtitle="You have not Listed any Properties" />;
    }
    return (
        <MyPropertiesClient
            listings={listings}
            currentUser={currentUser}
        />

    )

}


export default myPropertiesPage;