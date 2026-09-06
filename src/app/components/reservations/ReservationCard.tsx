"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { differenceInCalendarDays, format, isPast } from "date-fns";
import {
    FiCalendar,
    FiMapPin,
    FiPhone,
    FiMail,
    FiUser,
    FiCreditCard,
    FiTrash2,
} from "react-icons/fi";

import { SafeReservation } from "@/app/types";

interface ReservationCardProps {
    reservation: SafeReservation;
    /** "guest" = bookings I made; "host" = bookings received on my properties. */
    variant: "guest" | "host";
    onCancel: (id: string) => void;
    onPay?: (id: string) => void;
    busy?: boolean;
}

const STATUS = {
    COMPLETED: { label: "Paid", className: "bg-green-100 text-green-700" },
    PENDING: { label: "Awaiting payment", className: "bg-amber-100 text-amber-700" },
    FAILED: { label: "Payment failed", className: "bg-red-100 text-red-700" },
} as const;

/** One reservation, shown as a row rather than a plain listing thumbnail. */
const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    variant,
    onCancel,
    onPay,
    busy,
}) => {
    const router = useRouter();

    const start = useMemo(() => new Date(reservation.startDate), [reservation.startDate]);
    const end = useMemo(() => new Date(reservation.endDate), [reservation.endDate]);

    const nights = Math.max(1, differenceInCalendarDays(end, start));
    const past = isPast(end);

    const status = STATUS[reservation.paymentStatus as keyof typeof STATUS] ?? {
        label: reservation.paymentStatus,
        className: "bg-neutral-100 text-neutral-700",
    };

    const listing = reservation.listing;
    const perNight = listing.category === "Villa" || listing.category === "Vacation";
    const guest = reservation.guest;

    const canPay = variant === "guest" && reservation.paymentStatus !== "COMPLETED" && !past;

    return (
        <article
            className={`flex flex-col gap-4 rounded-xl border bg-white p-4 transition sm:flex-row ${
                past ? "border-neutral-200 opacity-75" : "border-neutral-200 hover:shadow-md"
            }`}
        >
            {/* Photo */}
            <button
                type="button"
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-32 sm:w-44"
                aria-label={`View ${listing.title}`}
            >
                <Image
                    src={listing.imageSrc || "/images/placeholder.jpg"}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover transition hover:scale-105"
                />
            </button>

            {/* Details */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => router.push(`/listings/${listing.id}`)}
                            className="truncate text-left font-semibold hover:underline"
                        >
                            {listing.title}
                        </button>
                        <p className="flex items-center gap-1 text-sm text-neutral-500">
                            <FiMapPin size={13} />
                            {listing.locationValue} · {listing.category}
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                        {status.label}
                    </span>
                </div>

                <p className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-700">
                    <FiCalendar size={14} className="text-neutral-400" />
                    <span className="font-medium">{format(start, "d MMM yyyy")}</span>
                    <span className="text-neutral-400">→</span>
                    <span className="font-medium">{format(end, "d MMM yyyy")}</span>
                    <span className="text-neutral-500">
                        ({nights} {perNight ? (nights > 1 ? "nights" : "night") : "days"})
                    </span>
                    {past && (
                        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                            finished
                        </span>
                    )}
                </p>

                {/* Owner view: who booked */}
                {variant === "host" && guest && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-neutral-50 px-3 py-2 text-sm">
                        <span className="flex items-center gap-1.5 font-medium">
                            <FiUser size={13} className="text-neutral-400" />
                            {guest.name || "Guest"}
                        </span>
                        {guest.phoneNumber && (
                            <a
                                href={`tel:${guest.phoneNumber.replace(/\s/g, "")}`}
                                className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 hover:underline"
                            >
                                <FiPhone size={13} className="text-neutral-400" />
                                {guest.phoneNumber}
                            </a>
                        )}
                        {guest.email && (
                            <a
                                href={`mailto:${guest.email}`}
                                className="flex items-center gap-1.5 truncate text-neutral-600 hover:text-neutral-900 hover:underline"
                            >
                                <FiMail size={13} className="text-neutral-400" />
                                {guest.email}
                            </a>
                        )}
                    </div>
                )}

                {/* Price + actions */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-lg font-semibold">
                        {reservation.totalPrice.toLocaleString("en-US")} TND
                        <span className="ml-1 text-xs font-normal text-neutral-500">total</span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {canPay && onPay && (
                            <button
                                type="button"
                                onClick={() => onPay(reservation.id)}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#E2A399] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                                <FiCreditCard size={14} />
                                {reservation.paymentStatus === "FAILED" ? "Try again" : "Pay now"}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onCancel(reservation.id)}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
                        >
                            <FiTrash2 size={14} />
                            {variant === "host" ? "Decline" : "Cancel"}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ReservationCard;
