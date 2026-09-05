"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { FiUsers, FiHome, FiCalendar, FiTrendingUp, FiClock, FiUserPlus } from "react-icons/fi";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Loader from "@/app/components/Loader";
import { SectionTitle, BarRow, PaymentBadge } from "./ui";

interface Stats {
    kpis: {
        totalUsers: number;
        totalOwners: number;
        newUsers: number;
        totalListings: number;
        totalReservations: number;
        revenue: number;
        pendingReservations: number;
        failedReservations: number;
        averagePrice: number;
    };
    byCategory: { label: string; count: number }[];
    byCity: { label: string; count: number }[];
    recentReservations: {
        id: string;
        createdAt: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
        paymentStatus: string;
        listingTitle: string;
        city: string;
        userName: string | null;
        userEmail: string | null;
    }[];
}

const KPI = ({
    icon: Icon,
    label,
    value,
    hint,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    hint?: string;
}) => (
    <Card>
        <CardContent className="flex items-start gap-4 p-5">
            <div className="rounded-lg bg-[#E2A399]/15 p-2.5 text-[#C67F72]">
                <Icon size={20} />
            </div>
            <div className="min-w-0">
                <div className="text-2xl font-bold tabular-nums">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
                {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
            </div>
        </CardContent>
    </Card>
);

export default function StatsPanel() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Chargement impossible.");
                if (!cancelled) setStats(data);
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

    if (isLoading) return <Loader />;
    if (!stats) return <p className="text-sm text-muted-foreground">Statistiques indisponibles.</p>;

    const { kpis } = stats;
    const maxCategory = Math.max(1, ...stats.byCategory.map((c) => c.count));
    const maxCity = Math.max(1, ...stats.byCity.map((c) => c.count));

    return (
        <div>
            <SectionTitle
                title="Vue d'ensemble"
                subtitle="Les chiffres clés de la plateforme, calculés en direct."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KPI icon={FiUsers} label="Utilisateurs inscrits" value={kpis.totalUsers}
                     hint={`dont ${kpis.totalOwners} propriétaires`} />
                <KPI icon={FiUserPlus} label="Nouveaux (30 derniers jours)" value={kpis.newUsers} />
                <KPI icon={FiHome} label="Biens en ligne" value={kpis.totalListings}
                     hint={`prix moyen ${kpis.averagePrice} DT`} />
                <KPI icon={FiCalendar} label="Réservations" value={kpis.totalReservations} />
                <KPI icon={FiTrendingUp} label="Recettes encaissées"
                     value={`${kpis.revenue.toLocaleString("fr-FR")} DT`}
                     hint="paiements confirmés uniquement" />
                <KPI icon={FiClock} label="Paiements en attente" value={kpis.pendingReservations}
                     hint={`${kpis.failedReservations} échoué${kpis.failedReservations > 1 ? "s" : ""}`} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Biens par catégorie</CardTitle>
                        <CardDescription>Répartition de l&apos;offre</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {stats.byCategory.length === 0 && (
                            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
                        )}
                        {stats.byCategory.map((c) => (
                            <BarRow key={c.label} label={c.label} count={c.count} max={maxCategory} />
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Biens par gouvernorat</CardTitle>
                        <CardDescription>Les huit villes les mieux représentées</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {stats.byCity.length === 0 && (
                            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
                        )}
                        {stats.byCity.map((c) => (
                            <BarRow key={c.label} label={c.label} count={c.count} max={maxCity} />
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Dernières réservations</CardTitle>
                    <CardDescription>Les huit demandes les plus récentes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bien</TableHead>
                                    <TableHead>Locataire</TableHead>
                                    <TableHead>Séjour</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                    <TableHead>Paiement</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.recentReservations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            Aucune réservation pour le moment.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {stats.recentReservations.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <div className="font-medium">{r.listingTitle}</div>
                                            <div className="text-xs text-muted-foreground">{r.city}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{r.userName || "—"}</div>
                                            <div className="text-xs text-muted-foreground">{r.userEmail}</div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-sm">
                                            {format(new Date(r.startDate), "d MMM yyyy", { locale: fr })}
                                            {" → "}
                                            {format(new Date(r.endDate), "d MMM yyyy", { locale: fr })}
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums whitespace-nowrap">
                                            {r.totalPrice} DT
                                        </TableCell>
                                        <TableCell>
                                            <PaymentBadge status={r.paymentStatus} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
