"use client";

import ReservationsView from "../components/reservations/ReservationsView";
import { SafeReservation, SafeUser } from "../types";

interface MyReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

/** Reservations I made, as a guest. */
const MyReservationsClient: React.FC<MyReservationsClientProps> = ({
  reservations,
  currentUser,
}) => (
  <ReservationsView
    reservations={reservations}
    currentUser={currentUser}
    variant="guest"
    title="My Reservations"
    subtitle="The places you booked, and where each payment stands."
  />
);

export default MyReservationsClient;
