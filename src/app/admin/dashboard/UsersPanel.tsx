"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Loader from "@/app/components/Loader";
import { SectionTitle, SearchInput, Select, Pagination, RoleBadge, ConfirmDialog } from "./ui";

interface AdminUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    phoneNumber: string | null;
    role: string;
    createdAt: string;
    listingCount: number;
    reservationCount: number;
}

const ROLE_OPTIONS = [
    { value: "owner", label: "Propriétaires" },
    { value: "user", label: "Locataires" },
];

export default function UsersPanel() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const [role, setRole] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [page, setPage] = useState(1);

    const [toDelete, setToDelete] = useState<AdminUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // On attend 350 ms après la dernière frappe avant d'interroger le serveur.
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
            const params = new URLSearchParams({ page: String(page), limit: "10", sort });
            if (debounced) params.set("q", debounced);
            if (role) params.set("role", role);

            const res = await fetch(`/api/users?${params}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Chargement impossible.");

            setUsers(data.data);
            setMeta({ total: data.total, page: data.page, pages: data.pages });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Chargement impossible.");
        } finally {
            setIsLoading(false);
        }
    }, [page, debounced, role, sort]);

    useEffect(() => {
        load();
    }, [load]);

    const confirmDelete = async () => {
        if (!toDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/users/${toDelete.id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Suppression impossible.");

            toast.success(
                data.deletedListings
                    ? `Compte supprimé, ainsi que ${data.deletedListings} annonce(s).`
                    : "Compte supprimé."
            );
            setToDelete(null);

            // Si la page devient vide, on recule d'une page.
            if (users.length === 1 && page > 1) setPage(page - 1);
            else load();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Suppression impossible.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <SectionTitle
                title="Utilisateurs"
                subtitle="Rechercher, filtrer et supprimer les comptes de la plateforme."
            />

            <Card>
                <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Nom, e-mail ou téléphone..."
                        />
                        <div className="flex gap-2">
                            <Select
                                value={role}
                                onChange={(v) => { setRole(v); setPage(1); }}
                                options={ROLE_OPTIONS}
                                placeholder="Tous les rôles"
                            />
                            <Select
                                value={sort}
                                onChange={(v) => { setSort(v || "createdAt"); setPage(1); }}
                                options={[
                                    { value: "createdAt", label: "Plus récents" },
                                    { value: "name", label: "Nom" },
                                    { value: "email", label: "E-mail" },
                                ]}
                                placeholder="Trier par"
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
                                            <TableHead>Utilisateur</TableHead>
                                            <TableHead>Téléphone</TableHead>
                                            <TableHead>Rôle</TableHead>
                                            <TableHead className="text-center">Biens</TableHead>
                                            <TableHead className="text-center">Résa.</TableHead>
                                            <TableHead>Inscrit le</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                    Aucun utilisateur ne correspond à cette recherche.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9 border">
                                                            <AvatarImage
                                                                src={user.image || "/images/placeholder.jpg"}
                                                                alt={user.name || "Utilisateur"}
                                                            />
                                                            <AvatarFallback>
                                                                {user.name?.charAt(0).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <div className="font-medium truncate">
                                                                {user.name || "Sans nom"}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-sm">
                                                    {user.phoneNumber || "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <RoleBadge role={user.role} />
                                                </TableCell>
                                                <TableCell className="text-center tabular-nums">
                                                    {user.listingCount}
                                                </TableCell>
                                                <TableCell className="text-center tabular-nums">
                                                    {user.reservationCount}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-sm">
                                                    {format(new Date(user.createdAt), "d MMM yyyy", { locale: fr })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Supprimer ${user.name || user.email}`}
                                                        onClick={() => setToDelete(user)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
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
                                label="utilisateur"
                                onPage={setPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={Boolean(toDelete)}
                title="Supprimer ce compte ?"
                message={
                    toDelete
                        ? `${toDelete.name || toDelete.email} sera définitivement supprimé, ` +
                          `ainsi que ses ${toDelete.listingCount} annonce(s) et ses ` +
                          `${toDelete.reservationCount} réservation(s). Cette action est irréversible.`
                        : ""
                }
                confirmLabel="Supprimer définitivement"
                busy={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
