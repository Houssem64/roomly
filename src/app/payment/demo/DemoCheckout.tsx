"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiCreditCard, FiShield, FiCheck } from "react-icons/fi";

interface DemoCheckoutProps {
    paymentRef: string;
    amount: number;
    description: string;
    merchant: string;
    expiresAt: string | null;
}

const METHODS = [
    { id: "card", label: "Bank card", brands: ["VISA", "Mastercard", "AMEX", "Diners"] },
    { id: "edinar", label: "E-Dinar card", brands: ["La Poste"] },
];

/**
 * DEMO checkout page.
 *
 * It mirrors the layout of a real Konnect page — merchant, amount, countdown,
 * payment method — but contacts no bank at all: the buttons simply decide the
 * outcome.
 *
 * No card number is ever requested. That is deliberate: nobody should be able
 * to mistake this page for a real payment.
 */
export default function DemoCheckout({
    paymentRef,
    amount,
    description,
    merchant,
    expiresAt,
}: DemoCheckoutProps) {
    const router = useRouter();
    const [method, setMethod] = useState("card");
    const [busy, setBusy] = useState<null | "success" | "failure">(null);

    const deadline = useMemo(
        () => (expiresAt ? new Date(expiresAt).getTime() : null),
        [expiresAt]
    );
    // Volontairement null au premier rendu : le compte à rebours dépend de
    // l'heure courante, qui diffère forcément entre le serveur et le
    // navigateur. Le calculer ici provoquerait une erreur d'hydratation.
    const [remaining, setRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (!deadline) return;

        const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
        tick();

        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [deadline]);

    const expired = remaining !== null && remaining <= 0;

    const clock = useMemo(() => {
        if (remaining === null) return null;
        const total = Math.floor(remaining / 1000);
        const mm = String(Math.floor(total / 60)).padStart(2, "0");
        const ss = String(total % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    }, [remaining]);

    const submit = async (outcome: "success" | "failure") => {
        setBusy(outcome);
        try {
            const res = await fetch("/api/payments/demo/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentRef, outcome }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "The payment did not go through.");

            router.replace(data.redirectUrl);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "The payment failed.");
            setBusy(null);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Banner: impossible to mistake for a real payment */}
            <div className="bg-amber-100 px-4 py-3 text-center text-sm font-medium text-amber-900">
                Demo payment gateway — no real payment is taken and no card details are requested.
            </div>

            <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-2 lg:py-16">
                {/* ---------------- Left: the summary ---------------- */}
                <div>
                    <p className="text-sm text-neutral-500">This payment expires in</p>
                    <p
                        className={`text-3xl font-bold tabular-nums ${
                            expired ? "text-red-600" : "text-neutral-900"
                        }`}
                    >
                        {clock ?? "--:--"}
                    </p>

                    <div className="mt-8 flex items-start justify-between gap-6">
                        <div>
                            <p className="text-sm text-neutral-500">You are paying</p>
                            <div className="mt-2 flex items-center gap-2">
                                <Image
                                    src="/images/logo.png"
                                    alt=""
                                    width={80}
                                    height={28}
                                    className="h-6 w-auto object-contain"
                                />
                                <span className="font-semibold">{merchant}</span>
                                <FiCheck className="text-green-600" aria-label="Verified merchant" />
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-neutral-500">Total amount</p>
                            <p className="text-3xl font-bold">
                                {amount.toLocaleString("en-US")}{" "}
                                <span className="align-super text-base font-medium">TND</span>
                            </p>
                        </div>
                    </div>

                    <p className="mt-8 border-t pt-6 text-sm text-neutral-600">{description}</p>

                    <p className="mt-2 text-xs text-neutral-400">Reference: {paymentRef}</p>
                </div>

                {/* ---------------- Right: the payment method ---------------- */}
                <div>
                    <h1 className="text-xl font-semibold">Payment method</h1>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-[#E2A399] px-4 py-3">
                        <FiCreditCard />
                        <span className="text-neutral-600">Card</span>
                    </div>

                    <fieldset className="mt-6 flex flex-col gap-3" disabled={expired || busy !== null}>
                        <legend className="sr-only">Choose a payment method</legend>

                        {METHODS.map((m) => (
                            <label
                                key={m.id}
                                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${
                                    method === m.id
                                        ? "border-[#E2A399] bg-[#E2A399]/5"
                                        : "border-neutral-200 hover:border-neutral-300"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="method"
                                        value={m.id}
                                        checked={method === m.id}
                                        onChange={() => setMethod(m.id)}
                                        className="accent-[#E2A399]"
                                    />
                                    <span className="font-medium">{m.label}</span>
                                </span>
                                <span className="hidden gap-1 sm:flex">
                                    {m.brands.map((b) => (
                                        <span
                                            key={b}
                                            className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500"
                                        >
                                            {b}
                                        </span>
                                    ))}
                                </span>
                            </label>
                        ))}
                    </fieldset>

                    <div className="mt-6 flex items-start gap-3 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-500">
                        <FiShield className="mt-0.5 shrink-0" />
                        <p>
                            On a real gateway you would now be sent to your bank&apos;s secure page to
                            enter your card. Here, the two buttons below simulate the two possible
                            outcomes.
                        </p>
                    </div>

                    {expired ? (
                        <div className="mt-6 rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-700">
                            This payment link has expired. Go back to “My Reservations” to start the
                            payment again.
                        </div>
                    ) : (
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => submit("success")}
                                disabled={busy !== null}
                                className="w-full rounded-lg bg-[#E2A399] py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {busy === "success"
                                    ? "Processing..."
                                    : `Pay ${amount.toLocaleString("en-US")} TND`}
                            </button>

                            <button
                                type="button"
                                onClick={() => submit("failure")}
                                disabled={busy !== null}
                                className="w-full rounded-lg border border-neutral-300 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-60"
                            >
                                {busy === "failure" ? "Cancelling..." : "Simulate a failed payment"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
