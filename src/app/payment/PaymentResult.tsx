import Link from "next/link";
import { format } from "date-fns";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import { VerifiedPayment } from "@/app/actions/verifyPayment";

const CONFIG = {
  COMPLETED: {
    icon: FaCheckCircle,
    colour: "text-green-500",
    title: "Payment confirmed",
    subtitle: "Your reservation is confirmed. Enjoy your stay!",
  },
  FAILED: {
    icon: FaTimesCircle,
    colour: "text-red-500",
    title: "Payment not completed",
    subtitle: "Nothing was charged. You can try again whenever you like.",
  },
  PENDING: {
    icon: FaHourglassHalf,
    colour: "text-amber-500",
    title: "Payment being processed",
    subtitle: "The bank has not confirmed yet. Refresh this page in a moment.",
  },
  UNKNOWN: {
    icon: FaHourglassHalf,
    colour: "text-neutral-400",
    title: "Payment not found",
    subtitle: "We could not find this payment. Check your reservations to be sure.",
  },
} as const;

/** Landing page after coming back from the payment gateway. */
export default function PaymentResult({ status, reservation }: VerifiedPayment) {
  const config = CONFIG[status] ?? CONFIG.UNKNOWN;
  const Icon = config.icon;

  return (
    <Container>
      <div className="max-w-lg mx-auto flex flex-col items-center gap-6 py-10 text-center">
        <Icon size={64} className={config.colour} />

        <Heading title={config.title} subtitle={config.subtitle} center />

        {reservation && (
          <div className="w-full rounded-xl border border-neutral-200 p-6 text-left">
            <div className="font-semibold text-lg mb-4">{reservation.listingTitle}</div>

            <dl className="flex flex-col gap-2 text-sm text-neutral-600">
              <div className="flex justify-between">
                <dt>Check-in</dt>
                <dd className="font-medium text-neutral-900">
                  {format(reservation.startDate, "d MMMM yyyy")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Check-out</dt>
                <dd className="font-medium text-neutral-900">
                  {format(reservation.endDate, "d MMMM yyyy")}
                </dd>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <dt>Amount</dt>
                <dd className="font-semibold text-neutral-900">{reservation.totalPrice} TND</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/my-reservations"
            className="flex-1 rounded-lg bg-[#E2A399] px-6 py-3 font-semibold text-white transition hover:opacity-80"
          >
            My reservations
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-lg border border-neutral-300 px-6 py-3 font-semibold transition hover:bg-neutral-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  );
}
