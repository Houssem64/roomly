"use client";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { Listing, Reservation, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "./HeartButton";
import Button from "../Button";
import TNDSvg from "../TNDSvg";



interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (action: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
    phoneNumber?: string | null;
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
}
const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
    currentUser, phoneNumber
}) => {
    const router = useRouter();
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {

            e.stopPropagation();
            if (disabled) {
                return;

            }
            onAction?.(actionId);
        }, [onAction, actionId, disabled]
    )

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }
        return data.price;
    }, [reservation, data.price])
    const reservationDate = useMemo(() => {
        if (!reservation) { return null; }
        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)
        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])
    return (<div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="col-span-1 cursor-pointer group"
    >
        <div className="flex flex-col gap-2 w-full">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                <Image fill alt="listing" src={data.imageSrc} className="object-cover h-full w-full group-hover:scale-110 transition" />
                <div className="absolute top-3 right-3">
                    <HeartButton listingId={data.id} currentUser={currentUser} />
                </div>

            </div>
            <div className="font-semibold text-lg">
                {data?.locationValue}
            </div>
            <div className="font-light text-neutral-500">
                {reservationDate || data.category}
            </div>
            <span className="text-sm flex-nowrap">
                Number: {data.phoneNumber || phoneNumber}
            </span>
            <div className="flex flex-row items-center gap-1 flex-nowrap">

                <div className="font-semibold text-lg">{price} TND </div>
                {!reservation && (
                    <div className="font-normal text-[12px]">
                        {(data.category === "Villa" || data.category === "Vacation") ? "per Night" : "per Month"}
                    </div>
                )}


            </div>
            {onAction && actionLabel && (<Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />)}
        </div>
    </div>);
}

export default ListingCard;