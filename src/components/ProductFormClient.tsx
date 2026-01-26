"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/admin/products/new/actions";

type Brand = {
    id: string;
    name: string;
};

type StorageUnit = "GB" | "TB";

type VariantInput = {
    ram_gb: number | "";
    storage_value: number | "";
    storage_unit: StorageUnit;
    base_price: number | "";
};

type InitialData = {
    model: {
        id: string;
        name: string;
        brand_id: string;
        launch_year: number | null;
        is_active: boolean;
    };
    variants: {
        id: string;
        variant: string;
        base_price: number;
        is_active: boolean;
    }[];
};

/* ---------------- helpers ---------------- */

function parseVariant(variant: string) {
    // "8 GB/256 GB" or "8 GB/1 TB"
    const [ramPart, storagePart] = variant.split("/");

    const ram = Number(ramPart.replace("GB", "").trim());
    const [storageValue, storageUnit] = storagePart.trim().split(" ");

    return {
        ram_gb: ram,
        storage_value: Number(storageValue),
        storage_unit: storageUnit as StorageUnit,
    };
}

/* ---------------- component ---------------- */

export default function ProductFormClient({
    brands,
    initialData,
    isEdit = false,
}: {
    brands: Brand[];
    initialData?: InitialData;
    isEdit?: boolean;
}) {
    const router = useRouter();

    const [brandId, setBrandId] = useState(
        initialData?.model.brand_id ?? ""
    );
    const [modelName, setModelName] = useState(
        initialData?.model.name ?? ""
    );

    const [variants, setVariants] = useState<VariantInput[]>(
        initialData
            ? initialData.variants.map((v) => {
                const parsed = parseVariant(v.variant);
                return {
                    ram_gb: parsed.ram_gb,
                    storage_value: parsed.storage_value,
                    storage_unit: parsed.storage_unit,
                    base_price: v.base_price,
                };
            })
            : [
                {
                    ram_gb: "",
                    storage_value: "",
                    storage_unit: "GB",
                    base_price: "",
                },
            ]
    );

    const [isSaving, setIsSaving] = useState(false);

    /* ---------------- variant helpers ---------------- */

    const addVariant = () => {
        setVariants((v) => [
            ...v,
            {
                ram_gb: "",
                storage_value: "",
                storage_unit: "GB",
                base_price: "",
            },
        ]);
    };

    const deleteVariant = (index: number) => {
        setVariants((v) => v.filter((_, i) => i !== index));
    };

    const updateVariant = <K extends keyof VariantInput>(
        index: number,
        field: K,
        value: VariantInput[K]
    ) => {
        setVariants((v) =>
            v.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };

    /* ---------------- save ---------------- */

    const saveProduct = async () => {
        setIsSaving(true);

        try {
            await createProduct({
                brand_id: brandId,
                model_name: modelName,
                is_active: true,
                variants: variants.map((v) => ({
                    variant: `${v.ram_gb} GB/${v.storage_value} ${v.storage_unit}`,
                    base_price: v.base_price as number,
                    is_active: true,
                })),
            });

            router.push("/admin/products");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const canSave =
        brandId &&
        modelName.trim().length > 0 &&
        variants.length > 0 &&
        variants.every(
            (v) =>
                typeof v.ram_gb === "number" &&
                typeof v.storage_value === "number" &&
                typeof v.base_price === "number" &&
                v.ram_gb > 0 &&
                v.storage_value > 0 &&
                v.base_price > 0
        );

    /* ---------------- UI ---------------- */

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-semibold">
                {isEdit ? "Edit Product" : "Add Product"}
            </h1>

            {/* Brand */}
            <div>
                <label className="mb-1 block text-sm font-medium">Brand</label>
                <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Model */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    Model Name
                </label>
                <input
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
            </div>

            {/* Variants */}
            <div>
                <label className="mb-2 block text-sm font-medium">Variants</label>

                <div className="grid grid-cols-7 gap-3 text-xs font-medium text-gray-500 mb-2">
                    <div>RAM</div>
                    <div>Storage</div>
                    <div>Unit</div>
                    <div>Price</div>
                    <div className="col-span-2">Preview</div>
                    <div></div>
                </div>

                {variants.map((v, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-7 gap-3 items-center mb-2"
                    >
                        <input
                            type="number"
                            value={v.ram_gb}
                            onChange={(e) =>
                                updateVariant(
                                    index,
                                    "ram_gb",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            className="rounded border px-2 py-1"
                        />

                        <input
                            type="number"
                            value={v.storage_value}
                            onChange={(e) =>
                                updateVariant(
                                    index,
                                    "storage_value",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            className="rounded border px-2 py-1"
                        />

                        <select
                            value={v.storage_unit}
                            onChange={(e) =>
                                updateVariant(
                                    index,
                                    "storage_unit",
                                    e.target.value as StorageUnit
                                )
                            }
                            className="rounded border px-2 py-1"
                        >
                            <option value="GB">GB</option>
                            <option value="TB">TB</option>
                        </select>

                        <div className="flex items-center border rounded px-2">
                            <span className="text-gray-500 text-sm">₹</span>
                            <input
                                type="number"
                                value={v.base_price}
                                onChange={(e) =>
                                    updateVariant(
                                        index,
                                        "base_price",
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full px-2 py-1 outline-none"
                            />
                        </div>

                        <div className="col-span-2 text-sm text-gray-600">
                            {v.ram_gb && v.storage_value
                                ? `${v.ram_gb} GB / ${v.storage_value} ${v.storage_unit}`
                                : "—"}
                        </div>

                        <button
                            onClick={() => deleteVariant(index)}
                            className="text-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addVariant}
                    className="text-sm text-blue-600 mt-2"
                >
                    + Add Variant
                </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => router.push("/admin/products")}
                    className="border rounded px-4 py-2"
                >
                    Cancel
                </button>

                <button
                    disabled={!canSave || isSaving}
                    onClick={saveProduct}
                    className={`rounded px-4 py-2 text-white ${!canSave || isSaving
                            ? "bg-gray-400"
                            : "bg-black hover:bg-gray-800"
                        }`}
                >
                    {isSaving
                        ? "Saving..."
                        : isEdit
                            ? "Save Changes"
                            : "Save Product"}
                </button>
            </div>
        </div>
    );
}
