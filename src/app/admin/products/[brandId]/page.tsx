import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

type ModelRow = {
    id: string;
    name: string;
    is_active: boolean;
};

type VariantCountRow = {
    model_id: string;
    count: number;
};

export default async function BrandModelsPage({
    params,
}: {
    params: Promise<{ brandId: string }>;
}) {
    const { brandId } = await params;

    // 1️⃣ Fetch brand info
    const { data: brand } = await supabaseServer
        .from("brands")
        .select("id, name")
        .eq("id", brandId)
        .single();

    // 2️⃣ Fetch models for this brand
    const { data: models, error } = await supabaseServer
        .from("phone_models")
        .select("id, name, is_active")
        .eq("brand_id", brandId)
        .order("name", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    // 3️⃣ Fetch variant counts per model
    const { data: variantCounts, error: countError } =
        await supabaseServer.rpc("model_variant_counts", {
            p_brand_id: brandId,
        });

    if (countError) {
        throw new Error(countError.message);
    }

    // 4️⃣ Build lookup map
    const countMap = new Map<string, number>();
    (variantCounts as VariantCountRow[]).forEach((row) => {
        countMap.set(row.model_id, row.count);
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        {brand?.name} models
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Manage phone models and their variants
                    </p>
                </div>

                <Link
                    href="/admin/products"
                    className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                    ← Back to products
                </Link>
            </div>

            {/* Models table */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] text-left text-xs font-medium text-[var(--text-muted)]">
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">Variants</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {models?.map((model: ModelRow) => (
                            <tr
                                key={model.id}
                                className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]"
                            >
                                <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                                    {model.name}
                                </td>

                                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                                    {countMap.get(model.id) ?? 0}
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={[
                                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                            model.is_active
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-100 text-gray-600",
                                        ].join(" ")}
                                    >
                                        {model.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/products/${brandId}/${model.id}`}
                                        className="text-sm font-medium text-[var(--primary)] hover:underline"
                                    >
                                        View variants
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {(!models || models.length === 0) && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
                                >
                                    No models found for this brand
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
