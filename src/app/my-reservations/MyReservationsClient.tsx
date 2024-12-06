"use client";

import { useCallback, useState } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeReservation, SafeUser } from "../types";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface MyReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const MyReservationsClient: React.FC<MyReservationsClientProps> = ({
  reservations,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(async (id: string) => {
    try {
      setDeletingId(id);
      
      const response = await axios.delete(`/api/reservations/${id}`);
      
      if (response.status === 200) {
        toast.success('Reservation cancelled successfully');
        router.refresh();
      } else {
        throw new Error(response.data?.error || 'Failed to cancel reservation');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error cancelling reservation');
    } finally {
      setDeletingId('');
    }
  }, [router]);

  return (
    <Container>
      <Heading
        title="My Reservations"
        subtitle="Bookings on your properties"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default MyReservationsClient;