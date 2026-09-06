"use client";

import ReservationsView from "../components/reservations/ReservationsView";
import { SafeReservation, SafeUser } from "../types";

interface ReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

/** Reservations received on my properties, as an owner. */
const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => (
  <ReservationsView
    reservations={reservations}
    currentUser={currentUser}
    variant="host"
    title="Reservations Received"
    subtitle="Bookings guests made on your properties, with their contact details."
  />
);

export default ReservationsClient;
