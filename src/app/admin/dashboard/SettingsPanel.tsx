"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCreditCard, FiPlayCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Loader from "@/app/components/Loader";
import { SectionTitle } from "./ui";

interface Settings {
    paymentMode: "konnect" | "demo";
    konnectConfigured: boolean;
    konnectApiUrl: string;
    pendingPayments: number;
}

const OPTIONS = [
    {
        id: "konnect" as const,
        icon: FiCreditCard,
        title: "Konnect (paiement réel)",
        summary: "La vraie passerelle bancaire tunisienne, en mode test.",
        details: [
            "Le locataire est redirigé vers la page sécurisée de Konnect.",
            "Nécessite une connexion Internet et des clés valides dans .env.",
            "À utiliser dès que le service de Konnect fonctionne.",
        ],
    },
    {
        id: "demo" as const,
        icon: FiPlayCircle,
        title: "Démonstration (hors ligne)",
        summary: "Une passerelle intégrée qui imite Konnect, sans Internet.",
        details: [
            "Le locataire voit une page de paiement identique dans son déroulé.",
            "Deux boutons simulent un paiement réussi ou un échec.",
            "Aucune carte n'est demandée, aucun argent ne circule.",
        ],
    },
];

export default function SettingsPanel() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Chargement impossible.");
                if (!cancelled) setSettings(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(error instanceof Error ? error.message : "Chargement impossible.");
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const choose = async (paymentMode: "konnect" | "demo") => {
        if (!settings || settings.paymentMode === paymentMode) return;

        setSaving(paymentMode);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentMode }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Enregistrement impossible.");

            setSettings({ ...settings, paymentMode: data.paymentMode });
            toast.success(
                data.paymentMode === "demo"
                    ? "Passerelle de démonstration activée."
                    : "Passerelle Konnect activée."
            );
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Enregistrement impossible.");
        } finally {
            setSaving(null);
        }
    };

    if (isLoading) return <Loader />;
    if (!settings) return <p className="text-sm text-muted-foreground">Réglages indisponibles.</p>;

    return (
        <div>
            <SectionTitle
                title="Réglages"
                subtitle="Paramètres de la plateforme. La modification est immédiate, sans redémarrage."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Passerelle de paiement</CardTitle>
                    <CardDescription>
                        Choisissez comment les locataires règlent leurs réservations.
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    {!settings.konnectConfigured && (
                        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            <FiAlertTriangle className="mt-0.5 shrink-0" />
                            <p>
                                Les clés Konnect ne sont pas renseignées dans le fichier{" "}
                                <code>.env</code>. Seule la passerelle de démonstration est
                                utilisable pour le moment.
                            </p>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        {OPTIONS.map((option) => {
                            const Icon = option.icon;
                            const active = settings.paymentMode === option.id;
                            const disabled =
                                saving !== null ||
                                (option.id === "konnect" && !settings.konnectConfigured);

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => choose(option.id)}
                                    disabled={disabled}
                                    aria-pressed={active}
                                    className={`flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition ${
                                        active
                                            ? "border-[#E2A399] bg-[#E2A399]/5"
                                            : "border-neutral-200 hover:border-neutral-300"
                                    } ${disabled && !active ? "cursor-not-allowed opacity-50" : ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 font-semibold">
                                            <Icon className="text-[#C67F72]" />
                                            {option.title}
                                        </span>
                                        {active && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                <FiCheckCircle size={12} />
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground">{option.summary}</p>

                                    <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        {option.details.map((d) => (
                                            <li key={d} className="flex gap-2">
                                                <span aria-hidden="true">·</span>
                                                <span>{d}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {saving === option.id && (
                                        <span className="text-xs font-medium text-[#C67F72]">
                                            Activation...
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <dl className="grid gap-2 border-t pt-4 text-sm sm:grid-cols-2">
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Clés Konnect</dt>
                            <dd className="font-medium">
                                {settings.konnectConfigured ? "renseignées" : "absentes"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Paiements en attente</dt>
                            <dd className="font-medium tabular-nums">{settings.pendingPayments}</dd>
                        </div>
                    </dl>

                    <p className="text-xs text-muted-foreground">
                        Le changement s&apos;applique aux nouveaux paiements. Une réservation dont le
                        paiement a déjà été lancé continue sur la passerelle d&apos;origine.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
