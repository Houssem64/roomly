import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import MyReservationsClient from "./MyReservations";
const MyReservationsPage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return <EmptyState title="You are not logged in" subtitle="Please login to see your reservations" />;
    }


    const reservations = await getReservations({ userId: currentUser.id });
    if (!reservations.length) {
        return <EmptyState title="No reservations" subtitle="You have not made any reservations yet" />;
    }
    return (
        <MyReservationsClient
            reservations={reservations}
            currentUser={currentUser}
        />

    )

}


export default MyReservationsPage;