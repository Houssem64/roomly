"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { isPast } from "date-fns";

import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import { SafeReservation, SafeUser } from "@/app/types";
import ReservationCard from "./ReservationCard";
import ConfirmDialog from "./ConfirmDialog";

type Filter = "upcoming" | "past" | "all";

interface ReservationsViewProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
    variant: "guest" | "host";
    title: string;
    subtitle: string;
}

const FILTERS: { id: Filter; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "all", label: "All" },
];

/**
 * Reservation list, shared by both pages:
 *   - "My Reservations"       (variant "guest"): the stays I booked;
 *   - "Reservations Received" (variant "host"): what guests booked at my places.
 *
 * Both show the same information; only the available actions differ.
 */
const ReservationsView: React.FC<ReservationsViewProps> = ({
    reservations,
    variant,
    title,
    subtitle,
}) => {
    const router = useRouter();
    const [filter, setFilter] = useState<Filter>("upcoming");
    const [busyId, setBusyId] = useState<string | null>(null);
    const [toCancel, setToCancel] = useState<SafeReservation | null>(null);

    const groups = useMemo(() => {
        const upcoming: SafeReservation[] = [];
        const past: SafeReservation[] = [];

        for (const r of reservations) {
            (isPast(new Date(r.endDate)) ? past : upcoming).push(r);
        }

        // Upcoming stays read better soonest-first.
        upcoming.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));

        return { upcoming, past, all: [...upcoming, ...past] };
    }, [reservations]);

    const visible = groups[filter];

    const totals = useMemo(() => {
        const paid = reservations.filter((r) => r.paymentStatus === "COMPLETED");
        return {
            count: reservations.length,
            upcoming: groups.upcoming.length,
            pending: reservations.filter((r) => r.paymentStatus === "PENDING").length,
            amount: paid.reduce((sum, r) => sum + r.totalPrice, 0),
        };
    }, [reservations, groups.upcoming.length]);

    const confirmCancel = useCallback(async () => {
        if (!toCancel) return;
        const id = toCancel.id;

        setBusyId(id);
        try {
            await axios.delete(`/api/reservations/${id}`);
            toast.success(
                variant === "host" ? "Reservation declined." : "Reservation cancelled."
            );
            setToCancel(null);
            router.refresh();
        } catch (error) {
            const message = axios.isAxiosError(error) ? error.response?.data?.error : undefined;
            toast.error(message || "Could not cancel the reservation.");
        } finally {
            setBusyId(null);
        }
    }, [toCancel, variant, router]);

    const onPay = useCallback(async (id: string) => {
        setBusyId(id);
        try {
            const { data } = await axios.post("/api/payments/init", { reservationId: id });
            toast.success("Redirecting to payment...");
            window.location.href = data.payUrl;
        } catch (error) {
            const message = axios.isAxiosError(error) ? error.response?.data?.error : undefined;
            toast.error(message || "Could not start the payment.");
            setBusyId(null);
        }
    }, []);

    return (
        <Container>
            <Heading title={title} subtitle={subtitle} />

            {/* Key figures */}
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Total" value={totals.count} />
                <Stat label="Upcoming" value={totals.upcoming} />
                <Stat label="Awaiting payment" value={totals.pending} highlight={totals.pending > 0} />
                <Stat
                    label={variant === "host" ? "Revenue collected" : "Total paid"}
                    value={`${totals.amount.toLocaleString("en-US")} TND`}
                />
            </dl>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                    const count = groups[f.id].length;
                    return (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilter(f.id)}
                            aria-pressed={filter === f.id}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                filter === f.id
                                    ? "bg-[#E2A399] text-white"
                                    : "border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                            }`}
                        >
                            {f.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div className="mt-6 flex flex-col gap-4">
                {visible.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
                        {filter === "upcoming"
                            ? "No upcoming reservations."
                            : filter === "past"
                            ? "No past reservations."
                            : "No reservations yet."}
                    </p>
                ) : (
                    visible.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            variant={variant}
                            onCancel={() => setToCancel(reservation)}
                            onPay={onPay}
                            busy={busyId === reservation.id}
                        />
                    ))
                )}
            </div>

            <ConfirmDialog
                open={Boolean(toCancel)}
                title={variant === "host" ? "Decline this reservation?" : "Cancel this reservation?"}
                message={
                    toCancel
                        ? `${toCancel.listing.title} — ${toCancel.totalPrice.toLocaleString("en-US")} TND. ` +
                          (toCancel.paymentStatus === "COMPLETED"
                              ? "This stay has already been paid for; the refund must be handled separately."
                              : "The dates will become available again.")
                        : ""
                }
                confirmLabel={variant === "host" ? "Decline" : "Cancel reservation"}
                busy={busyId !== null}
                onConfirm={confirmCancel}
                onCancel={() => setToCancel(null)}
            />
        </Container>
    );
};

function Stat({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-xl border border-neutral-200 p-4">
            <dd
                className={`text-xl font-bold tabular-nums ${
                    highlight ? "text-amber-600" : "text-neutral-900"
                }`}
            >
                {value}
            </dd>
            <dt className="mt-0.5 text-xs text-neutral-500">{label}</dt>
        </div>
    );
}

export default ReservationsView;
