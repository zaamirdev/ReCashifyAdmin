"use client";

import { useEffect, useState } from "react";
import { searchModelsByBrand } from "@/app/admin/products/new/search-models";
import toast from "react-hot-toast";
import { createModel } from "@/app/admin/products/new/model-actions";
import { createVariants } from "@/app/admin/products/new/variant-actions";

type Brand = {
    id: string;
    name: string;
};

type Variant = {
    id?: string;
    storage: string;
    base_price: string;
};

export default function ProductFormClient({
    brands,
    initialData,
    onValidityChange,
    onSavingChange,
}: {
    brands: Brand[];
    initialData?: {
        model: {
            id: string;
            name: string;
            brand_id: string;
            launch_year: number | null;
            is_active: boolean;
        };
        variants: {
            id: string;
            storage: string;
            base_price: number;
            is_active: boolean;
        }[];
    };
    onValidityChange: (valid: boolean) => void;
    onSavingChange: (saving: boolean) => void;
}) {
    /* ---------------- Brand ---------------- */
    const [brandId, setBrandId] = useState(
        initialData?.model.brand_id ?? ""
    );

    /* ---------------- Model ---------------- */
    const [modelName, setModelName] = useState(
        initialData?.model.name ?? ""
    );

    const [modelLaunchYear, setModelLaunchYear] = useState(
        initialData?.model.launch_year
            ? String(initialData.model.launch_year)
            : ""
    );

    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [suggestedModels, setSuggestedModels] = useState<
        { id: string; name: string }[]
    >([]);

    /* ---------------- Suggestions ---------------- */
    useEffect(() => {
        if (!brandId || modelName.trim().length < 2) {
            setSuggestedModels([]);
            return;
        }

        const timeout = setTimeout(() => {
            searchModelsByBrand(brandId, modelName)
                .then((results) => {
                    const normalizedInput =
                        modelName.trim().toLowerCase();

                    const hasExactMatch = results.some(
                        (m) =>
                            m.name.toLowerCase() === normalizedInput
                    );

                    setSuggestedModels(
                        hasExactMatch ? [] : results
                    );
                })
                .catch(() => setSuggestedModels([]));
        }, 300);

        return () => clearTimeout(timeout);
    }, [brandId, modelName]);

    /* ---------------- Variants ---------------- */
    const [variants, setVariants] = useState<Variant[]>(
        initialData
            ? initialData.variants.map((v) => ({
                id: v.id, // 👈 KEEP ID
                storage: v.storage.replace("GB", ""),
                base_price: String(v.base_price),
            }))
            : [{ storage: "", base_price: "" }]
    );

    const addVariant = () => {
        setVariants([...variants, { storage: "", base_price: "" }]);
    };

    const updateVariant = (
        index: number,
        field: keyof Variant,
        value: string
    ) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    /* ---------------- DIRTY CHECK (EDIT MODE) ---------------- */
    useEffect(() => {
        if (!initialData) {
            setIsDirty(true);
            return;
        }

        const initialVariants = initialData.variants.map((v) => ({
            storage: v.storage.replace("GB", ""),
            base_price: String(v.base_price),
        }));

        const dirty =
            brandId !== initialData.model.brand_id ||
            modelName !== initialData.model.name ||
            modelLaunchYear !==
            (initialData.model.launch_year
                ? String(initialData.model.launch_year)
                : "") ||
            JSON.stringify(initialVariants) !==
            JSON.stringify(variants);

        setIsDirty(dirty);
    }, [
        brandId,
        modelName,
        modelLaunchYear,
        variants,
        initialData,
    ]);

    /* ---------------- Validity ---------------- */
    useEffect(() => {
        const isValid =
            !!brandId &&
            modelName.trim() !== "" &&
            variants.length > 0 &&
            variants.every(
                (v) =>
                    v.storage.trim() !== "" &&
                    Number(v.base_price) > 0
            );

        onValidityChange(isValid && !isSaving && isDirty);
    }, [
        brandId,
        modelName,
        variants,
        isSaving,
        isDirty,
        onValidityChange,
    ]);

    const handleModelBlur = () => {
        setTimeout(() => {
            setSuggestedModels([]);
        }, 150);
    };

    /* ---------------- Submit (UNCHANGED) ---------------- */
    const handleSubmit = async () => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            let modelId: string;

            if (initialData) {
                const { updateModel } = await import(
                    "@/app/admin/products/edit/model-actions"
                );

                await updateModel(
                    initialData.model.id,
                    brandId,
                    modelName,
                    modelLaunchYear ? Number(modelLaunchYear) : null
                );

                modelId = initialData.model.id;
            } else {
                const model = await createModel(
                    brandId,
                    modelName,
                    modelLaunchYear ? Number(modelLaunchYear) : null
                );

                modelId = model.id;
            }

            if (initialData) {
                const { upsertVariants } = await import(
                    "@/app/admin/products/edit/variant-actions"
                );

                await upsertVariants(
                    modelId,
                    variants.map((v) => ({
                        id: v.id,
                        storage: v.storage,
                        base_price: Number(v.base_price),
                    }))
                );
            } else {
                await createVariants(
                    modelId,
                    variants.map((v) => ({
                        storage: v.storage,
                        base_price: Number(v.base_price),
                    }))
                );
            }

            toast.success("Product created successfully");
            window.location.href = "/admin/products";
        } catch (err: any) {
            toast.error(
                err?.message || "Something went wrong"
            );
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        onSavingChange(isSaving);
    }, [isSaving, onSavingChange]);

    useEffect(() => {
        const listener = () => handleSubmit();
        window.addEventListener("submit-product", listener);
        return () =>
            window.removeEventListener(
                "submit-product",
                listener
            );
    }, [brandId, modelName, modelLaunchYear, variants]);

    /* ---------------- UI ---------------- */
    return (
        <div className="space-y-6">
            {/* Brand */}
            <div>
                <label className="block text-sm font-medium">
                    Brand
                </label>
                <select
                    value={brandId}
                    onChange={(e) =>
                        setBrandId(e.target.value)
                    }
                    className="mt-1 w-full rounded border px-3 py-2"
                >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                        <option
                            key={brand.id}
                            value={brand.id}
                        >
                            {brand.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Model */}
            <div className="relative">
                <label className="block text-sm font-medium">
                    Phone Model
                </label>
                <input
                    value={modelName}
                    onChange={(e) =>
                        setModelName(e.target.value)
                    }
                    onBlur={handleModelBlur}
                    disabled={!brandId}
                    className="mt-1 w-full rounded border px-3 py-2 disabled:bg-gray-100"
                />

                {suggestedModels.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded border bg-white shadow">
                        {suggestedModels.map((model) => (
                            <div
                                key={model.id}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                                onMouseDown={() => {
                                    setModelName(model.name);
                                    setSuggestedModels([]);
                                }}
                            >
                                {model.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Launch Year */}
            <div>
                <label className="block text-sm font-medium">
                    Launch Year (optional)
                </label>
                <input
                    type="number"
                    value={modelLaunchYear}
                    onChange={(e) =>
                        setModelLaunchYear(e.target.value)
                    }
                    className="mt-1 w-full rounded border px-3 py-2"
                />
            </div>

            {/* Variants */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">
                        Variants
                    </label>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        + Add variant
                    </button>
                </div>

                <div className="space-y-3">
                    {variants.map((variant, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3"
                        >
                            <div className="relative w-1/2">
                                <input
                                    type="number"
                                    value={variant.storage}
                                    onChange={(e) =>
                                        updateVariant(
                                            index,
                                            "storage",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded border px-3 py-2 pr-10"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    GB
                                </span>
                            </div>

                            <div className="relative w-1/3">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    value={variant.base_price}
                                    onChange={(e) =>
                                        updateVariant(
                                            index,
                                            "base_price",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded border px-3 py-2 pl-7"
                                />
                            </div>

                            {variants.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeVariant(index)
                                    }
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
