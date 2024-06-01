"use client";
import Container from "@/app/components/Container";
import { categories } from "@/app/components/Navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";

import ListingReservation from "@/app/components/listings/ListingReservation";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeUser, SafeReservation } from "@/app/types";

import axios from "axios";
import { differenceInCalendarDays, differenceInDays, eachDayOfInterval, setDate } from "date-fns";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import toast from "react-hot-toast";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
}


interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser;
    };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    currentUser,
    reservations = []
}) => {
    const loginModal = useLoginModal();
    const router = useRouter();
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];
        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });
            dates = [...dates, ...range];
        })
        return dates
    }, [reservations])
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        setIsLoading(true);
        axios.post(`/api/reservations`, {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing.id
        }).then(() => {
            toast.success("Reservation created successfully");
            setDateRange(initialDateRange);
            router.refresh()
        }).catch((error) => {
            toast.error("An error occurred")
        }).finally(() => {
            setIsLoading(false);

        })

    }, [
        totalPrice,
        dateRange,
        listing?.id,
        currentUser,
        router,
        loginModal
    ])
    // TODO: condition for villa and vacation
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(

                dateRange.endDate,
                dateRange.startDate
            )
            if (dayCount && listing.price && (listing.category === "Villa" || listing.category === "Vacation")) {
                setTotalPrice(dayCount * listing.price)
            }
        }
    }, [dateRange, listing.price])


    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category)
    }, [listing.category])
    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo user={listing.user} category={category} description={listing.description} roomCount={listing.roomCount} guestCount={listing.guestCount} bathroomCount={listing.bathroomCount} locationValue={listing.locationValue} />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation price={listing.price} totalPrice={totalPrice} onChangeDate={(value) => setDateRange(value)} category={listing.category} dateRange={dateRange} onSubmit={onCreateReservation} disabledDates={disabledDates} />
                        </div>

                    </div>
                </div>
            </div>
        </Container>);
}

export default ListingClient;