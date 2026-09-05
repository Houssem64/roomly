"use client";

import { Button } from "@/components/ui/button";

/** Petits éléments réutilisés par les trois onglets du tableau de bord. */

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
    );
}

/** Champ de recherche avec un léger délai avant de lancer la requête. */
export function SearchInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    return (
        <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-9 w-full sm:w-72 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#E2A399] focus:ring-1 focus:ring-[#E2A399]"
        />
    );
}

export function Select({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#E2A399] focus:ring-1 focus:ring-[#E2A399]"
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}

export function Pagination({
    page,
    pages,
    total,
    label,
    onPage,
}: {
    page: number;
    pages: number;
    total: number;
    label: string;
    onPage: (p: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 pt-4 text-sm">
            <span className="text-muted-foreground">
                {total} {label}
                {total > 1 ? "s" : ""} — page {page} sur {pages}
            </span>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
                    Précédent
                </Button>
                <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
                    Suivant
                </Button>
            </div>
        </div>
    );
}

/** Ligne « barre » utilisée pour les répartitions (par catégorie, par ville). */
export function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
    const width = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-36 shrink-0 truncate" title={label}>
                {label}
            </span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-[#E2A399]" style={{ width: `${width}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right font-medium tabular-nums">{count}</span>
        </div>
    );
}

const STATUS_STYLES: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
    COMPLETED: "Payée",
    PENDING: "En attente",
    FAILED: "Échouée",
};

export function PaymentBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                STATUS_STYLES[status] || "bg-neutral-100 text-neutral-700"
            }`}
        >
            {STATUS_LABELS[status] || status}
        </span>
    );
}

const ROLE_LABELS: Record<string, string> = {
    owner: "Propriétaire",
    admin: "Administrateur",
    user: "Locataire",
};

export function RoleBadge({ role }: { role: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                role === "owner" ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-700"
            }`}
        >
            {ROLE_LABELS[role] || role}
        </span>
    );
}

/** Fenêtre de confirmation avant une suppression définitive. */
export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel,
    busy,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4"
            role="dialog"
            aria-modal="true"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={busy}>
                        Annuler
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={busy}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {busy ? "Suppression..." : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
