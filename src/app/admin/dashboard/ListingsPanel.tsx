"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { FiExternalLink, FiInfo } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Loader from "@/app/components/Loader";
import { SectionTitle, SearchInput, Select, Pagination } from "./ui";

interface AdminListing {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    category: string;
    locationValue: string;
    price: number;
    roomCount: number;
    guestCount: number;
    createdAt: string;
    ownerName: string | null;
    ownerEmail: string | null;
    reservationCount: number;
}

export default function ListingsPanel() {
    const [listings, setListings] = useState<AdminListing[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
    const [filters, setFilters] = useState<{ categories: string[]; cities: string[] }>({
        categories: [],
        cities: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(search);
            setPage(1);
        }, 350);
        return () => clearTimeout(timer);
    }, [search]);

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "10" });
            if (debounced) params.set("q", debounced);
            if (category) params.set("category", category);
            if (city) params.set("city", city);

            const res = await fetch(`/api/alllistings?${params}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Chargement impossible.");

            setListings(data.data);
            setMeta({ total: data.total, page: data.page, pages: data.pages });
            setFilters(data.filters);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Chargement impossible.");
        } finally {
            setIsLoading(false);
        }
    }, [page, debounced, category, city]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div>
            <SectionTitle
                title="Biens en ligne"
                subtitle="Consultation uniquement : chaque propriétaire gère ses propres annonces."
            />

            <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                <FiInfo className="mt-0.5 shrink-0" />
                <p>
                    Cette page sert au suivi de l&apos;offre. La modification et la suppression d&apos;un bien
                    se font depuis l&apos;espace <strong>Mes propriétés</strong> de son propriétaire.
                </p>
            </div>

            <Card>
                <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Titre, description ou ville..."
                        />
                        <div className="flex gap-2">
                            <Select
                                value={category}
                                onChange={(v) => { setCategory(v); setPage(1); }}
                                options={filters.categories.map((c) => ({ value: c, label: c }))}
                                placeholder="Toutes catégories"
                            />
                            <Select
                                value={city}
                                onChange={(v) => { setCity(v); setPage(1); }}
                                options={filters.cities.map((c) => ({ value: c, label: c }))}
                                placeholder="Tous gouvernorats"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bien</TableHead>
                                            <TableHead>Propriétaire</TableHead>
                                            <TableHead>Catégorie</TableHead>
                                            <TableHead>Ville</TableHead>
                                            <TableHead className="text-right">Prix</TableHead>
                                            <TableHead className="text-center">Résa.</TableHead>
                                            <TableHead>Publié le</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listings.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                    Aucun bien ne correspond à cette recherche.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {listings.map((listing) => (
                                            <TableRow key={listing.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                                            <Image
                                                                src={listing.imageSrc || "/images/placeholder.jpg"}
                                                                alt={listing.title}
                                                                fill
                                                                sizes="64px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0 max-w-xs">
                                                            <Link
                                                                href={`/listings/${listing.id}`}
                                                                target="_blank"
                                                                className="font-medium hover:underline inline-flex items-center gap-1"
                                                            >
                                                                <span className="truncate">{listing.title}</span>
                                                                <FiExternalLink size={12} className="shrink-0" />
                                                            </Link>
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {listing.roomCount} pièce(s) · {listing.guestCount} pers.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{listing.ownerName || "—"}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {listing.ownerEmail}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-sm">
                                                    {listing.category}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-sm">
                                                    {listing.locationValue}
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums whitespace-nowrap">
                                                    {listing.price} DT
                                                </TableCell>
                                                <TableCell className="text-center tabular-nums">
                                                    {listing.reservationCount}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-sm">
                                                    {format(new Date(listing.createdAt), "d MMM yyyy", { locale: fr })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <Pagination
                                page={meta.page}
                                pages={meta.pages}
                                total={meta.total}
                                label="bien"
                                onPage={setPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
