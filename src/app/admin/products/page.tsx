import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import ProductActions from "@/components/ProductActions";

type ProductRow = {
    base_price: number;
    phone_models: {
        id: string;
        name: string;
        is_active: boolean;
        brands: {
            name: string;
        };
    };
};

type ModelRow = {
    modelId: string;
    brandName: string;
    modelName: string;
    variantCount: number;
    minBasePrice: number;
    isActive: boolean;
};

export default async function ProductsPage() {
    const { data, error } = (await supabaseServer
        .from("phone_variants")
        .select(`
        id,
        storage,
        base_price,
        is_active,
        phone_models (
            id,
            name,
            is_active,
            brands (
                name
            )
        )
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })) as {
            data: ProductRow[] | null;
            error: any;
        };

    if (error) {
        throw new Error(error.message);
    }

    /* ---------------- Group variants by model ---------------- */

    const modelMap = new Map<string, ModelRow>();

    data?.forEach((variant) => {
        const model = variant.phone_models;
        if (!model) return;

        const modelId = model.id;

        const existing = modelMap.get(modelId);

        if (!existing) {
            modelMap.set(modelId, {
                modelId,
                brandName: model.brands.name,
                modelName: model.name,
                variantCount: 1,
                minBasePrice: variant.base_price,
                isActive: model.is_active,
            });
        } else {
            existing.variantCount += 1;
            existing.minBasePrice = Math.min(
                existing.minBasePrice,
                variant.base_price
            );
        }
    });

    const models = Array.from(modelMap.values());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>

                <Link
                    href="/admin/products/new"
                    className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    + Add Product
                </Link>
            </div>

            <div className="rounded border bg-white">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr className="text-sm text-gray-500">
                            <th className="p-4">Brand</th>
                            <th className="p-4">Model</th>
                            <th className="p-4">No. of Variants</th>
                            <th className="p-4">Base Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map((model) => (
                            <tr
                                key={model.modelId}
                                className="border-b text-sm"
                            >
                                <td className="p-4">
                                    {model.brandName}
                                </td>
                                <td className="p-4 font-medium">
                                    {model.modelName}
                                </td>
                                <td className="p-4">
                                    {model.variantCount}
                                </td>
                                <td className="p-4">
                                    ₹{model.minBasePrice}
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`rounded px-2 py-1 text-xs ${model.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {model.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <ProductActions
                                        modelId={model.modelId}
                                    />
                                </td>
                            </tr>
                        ))}

                        {models.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-6 text-center text-sm text-gray-500"
                                >
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
