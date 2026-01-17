"use client";

import ProductFormClient from "@/components/ProductFormClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Brand = {
    id: string;
    name: string;
};

export default function AddProductClientPage({
    brands,
}: {
    brands: Brand[];
}) {
    const [canSave, setCanSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    return (
        <div className="max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    Add Product
                </h1>

                <div className="space-x-2">
                    <button
                        onClick={() => router.push("/admin/products")}
                        className="rounded border px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!canSave || isSaving}
                        className={`rounded px-4 py-2 text-white ${!canSave || isSaving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-800"
                            }`}
                        onClick={() => {
                            window.dispatchEvent(
                                new Event("submit-product")
                            );
                        }}
                    >
                        {isSaving ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left */}
                <div className="col-span-2">
                    <div className="rounded border bg-white p-4">
                        <h2 className="mb-4 text-lg font-medium">
                            Product Information
                        </h2>

                        <ProductFormClient
                            brands={brands}
                            onValidityChange={setCanSave}
                            onSavingChange={setIsSaving}
                        />
                    </div>
                </div>

                {/* Right */}
                <div>
                    <div className="rounded border bg-white p-4">
                        <h2 className="mb-4 text-lg font-medium">
                            Status
                        </h2>

                        <select className="w-full rounded border px-3 py-2">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
