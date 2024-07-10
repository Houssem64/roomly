"use client";
import { toast } from "react-hot-toast"
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "../types";
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";

interface ReservationsClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations, currentUser
}) => {


    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback(async (id: string) => {
        setDeletingId(id);
        try {
            await axios.delete(`/api/reservations/${id}`);
            toast.success('Reservation Cancelled');
            router.refresh();
        } catch (error) {
            toast.error('Failed to cancel reservation');
        } finally {
            setDeletingId('');
        }
    }, [router]);
    return (

        <Container>
            <Heading title="Reservations on Your Property" subtitle="Bookings on your properties" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {reservations.map((reservation) => (
                    <>
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            actionId={reservation.id}
                            onAction={onCancel}
                            reservation={reservation}
                            actionLabel="Cancel Guest Reservation"
                            disabled={deletingId === reservation.id}
                            phoneNumber={reservation.phoneNumber}
                        />

                    </>
                ))}
            </div>
        </Container>
    );
}

export default ReservationsClient;