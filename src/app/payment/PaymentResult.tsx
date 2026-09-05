import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import { VerifiedPayment } from "@/app/actions/verifyPayment";

const CONFIG = {
  COMPLETED: {
    icon: FaCheckCircle,
    colour: "text-green-500",
    title: "Paiement confirmé",
    subtitle: "Votre réservation est validée. Bon séjour !",
  },
  FAILED: {
    icon: FaTimesCircle,
    colour: "text-red-500",
    title: "Paiement non abouti",
    subtitle: "Aucun montant n'a été débité. Vous pouvez réessayer quand vous le souhaitez.",
  },
  PENDING: {
    icon: FaHourglassHalf,
    colour: "text-amber-500",
    title: "Paiement en cours de traitement",
    subtitle: "La banque n'a pas encore confirmé. Actualisez cette page dans quelques instants.",
  },
  UNKNOWN: {
    icon: FaHourglassHalf,
    colour: "text-neutral-400",
    title: "Paiement introuvable",
    subtitle: "Nous n'avons pas retrouvé ce paiement. Consultez vos réservations pour vérifier.",
  },
} as const;

/** Page de retour après un passage par la page de paiement Konnect. */
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
                <dt>Arrivée</dt>
                <dd className="font-medium text-neutral-900">
                  {format(reservation.startDate, "d MMMM yyyy", { locale: fr })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Départ</dt>
                <dd className="font-medium text-neutral-900">
                  {format(reservation.endDate, "d MMMM yyyy", { locale: fr })}
                </dd>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <dt>Montant</dt>
                <dd className="font-semibold text-neutral-900">{reservation.totalPrice} DT</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/my-reservations"
            className="flex-1 rounded-lg bg-[#E2A399] px-6 py-3 font-semibold text-white transition hover:opacity-80"
          >
            Mes réservations
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-lg border border-neutral-300 px-6 py-3 font-semibold transition hover:bg-neutral-50"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </Container>
  );
}
