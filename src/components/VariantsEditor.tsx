"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";

type Variant = {
    id: string;
    variant: string | null;
    base_price: number;
    is_active: boolean;
};

export default function VariantsEditor({
    initialVariants,
    modelId,
}: {
    initialVariants: Variant[];
    modelId: string;
}) {
    const [variants, setVariants] = useState<Variant[]>(initialVariants);
    const [savingId, setSavingId] = useState<string | null>(null);

    const handleChange = (
        id: string,
        field: keyof Variant,
        value: any
    ) => {
        setVariants((prev) =>
            prev.map((v) =>
                v.id === id ? { ...v, [field]: value } : v
            )
        );
    };

    const saveVariant = async (variant: Variant) => {
        setSavingId(variant.id);

        const { error } = await supabaseBrowser
            .from("phone_variants")
            .update({
                variant: variant.variant,
                base_price: variant.base_price,
                is_active: variant.is_active,
            })
            .eq("id", variant.id);

        setSavingId(null);

        if (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-[var(--border-default)] text-xs font-medium text-[var(--text-muted)]">
                        <th className="px-4 py-3">Variant</th>
                        <th className="px-4 py-3">Base price</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {variants.map((variant) => (
                        <tr
                            key={variant.id}
                            className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-surface-hover)] text-sm"
                        >
                            {/* Variant Name */}
                            <td className="px-4 py-3">
                                <input
                                    value={variant.variant ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            variant.id,
                                            "variant",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-default)] px-2 py-1 text-sm"
                                    placeholder="e.g. 128 GB"
                                />
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    value={variant.base_price}
                                    onChange={(e) =>
                                        handleChange(
                                            variant.id,
                                            "base_price",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-28 rounded-[var(--radius-sm)] border border-[var(--border-default)] px-2 py-1 text-sm"
                                />
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <select
                                    value={variant.is_active ? "active" : "inactive"}
                                    onChange={(e) =>
                                        handleChange(
                                            variant.id,
                                            "is_active",
                                            e.target.value === "active"
                                        )
                                    }
                                    className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-2 py-1 text-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </td>

                            {/* Save */}
                            <td className="px-4 py-3 text-right">
                                <button
                                    onClick={() => saveVariant(variant)}
                                    disabled={savingId === variant.id}
                                    className="inline-flex h-8 items-center rounded-[var(--radius-md)] bg-[var(--primary)] px-3 text-xs font-medium text-black hover:bg-[var(--primary-hover)] disabled:opacity-50"
                                >
                                    {savingId === variant.id ? "Saving…" : "Save"}
                                </button>
                            </td>
                        </tr>
                    ))}

                    {variants.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
                            >
                                No variants found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
