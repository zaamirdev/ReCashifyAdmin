"use client";

import { useState } from "react";

type CreateEntityModalProps = {
    open: boolean;
    title: string;
    placeholder: string;
    onClose: () => void;
    onSave: (value: string) => Promise<void> | void;
    children?: React.ReactNode;
};

export default function CreateEntityModal({
    open,
    title,
    placeholder,
    onClose,
    onSave,
    children,
}: CreateEntityModalProps) {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSave = async () => {
        if (!value.trim()) return;

        try {
            setLoading(true);
            await onSave(value.trim());
            setValue("");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                    if (!loading) onClose();
                }}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm rounded bg-white shadow-lg">
                <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>
                </div>

                <div className="space-y-4 p-4">
                    <input
                        autoFocus
                        required
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded border px-3 py-2"
                    />

                    {children}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="rounded border px-3 py-1.5 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={loading || !value.trim()}
                            className={`rounded px-3 py-1.5 text-sm text-white ${loading
                                    ? "bg-gray-400"
                                    : "bg-black hover:bg-gray-800"
                                }`}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
