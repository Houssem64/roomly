import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";



const ReservationsPage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return <EmptyState title="You are not logged in" subtitle="Please login to see your reservations" />
    }

    const reservations = await getReservations({ authorId: currentUser.id });
    if (!reservations.length) {
        return <EmptyState title="No reservations Found" subtitle="Looks like you have no reservations on your property" />
    }
    return (
        <ReservationsClient
            reservations={reservations}
            currentUser={currentUser}
        />
    );
}

export default ReservationsPage;