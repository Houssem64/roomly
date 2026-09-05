import verifyPayment from "@/app/actions/verifyPayment";
import PaymentResult from "../PaymentResult";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
    searchParams: { payment_ref?: string; paymentRef?: string };
}

/** Page d'arrivée lorsque le paiement a été abandonné ou refusé. */
export default async function PaymentFailedPage({ searchParams }: PageProps) {
    const ref = searchParams.payment_ref || searchParams.paymentRef;
    const result = await verifyPayment(ref);

    // Si Konnect nous renvoie ici, le paiement n'a pas abouti : on l'affiche
    // comme tel meme si l'etat exact n'a pas pu etre recupere.
    const status = result.status === "COMPLETED" ? result.status : "FAILED";

    return <PaymentResult status={status} reservation={result.reservation} />;
}
