import verifyPayment from "@/app/actions/verifyPayment";
import PaymentResult from "../PaymentResult";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
    searchParams: { payment_ref?: string; paymentRef?: string };
}

/**
 * Page d'arrivée après un paiement réussi côté Konnect.
 * On revérifie tout de même l'état auprès de Konnect : l'adresse de retour
 * seule ne prouve rien.
 */
export default async function PaymentSuccessPage({ searchParams }: PageProps) {
    const ref = searchParams.payment_ref || searchParams.paymentRef;
    const result = await verifyPayment(ref);

    return <PaymentResult {...result} />;
}
