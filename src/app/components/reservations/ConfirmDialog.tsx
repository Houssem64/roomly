"use client";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/** Small confirmation dialog shown before an irreversible action. */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    confirmLabel,
    busy,
    onConfirm,
    onCancel,
}) => {
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
                <p className="mt-2 text-sm text-neutral-500">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 disabled:opacity-60"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                        {busy ? "Working..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
