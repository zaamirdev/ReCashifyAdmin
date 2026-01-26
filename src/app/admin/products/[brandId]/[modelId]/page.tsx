import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import VariantsEditor from "@/components/VariantsEditor";

export default async function ModelVariantsPage({
    params,
}: {
    params: Promise<{ brandId: string; modelId: string }>;
}) {
    const { brandId, modelId } = await params;

    // Fetch model info
    const { data: model } = await supabaseServer
        .from("phone_models")
        .select("id, name")
        .eq("id", modelId)
        .single();

    // Fetch variants
    const { data: variants, error } = await supabaseServer
        .from("phone_variants")
        .select("id, variant, base_price, is_active")
        .eq("phone_model_id", modelId)
        .order("base_price", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        {model?.name} variants
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Manage pricing, availability, and variant details
                    </p>
                </div>

                <Link
                    href={`/admin/products/${brandId}`}
                    className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                    ← Back to models
                </Link>
            </div>

            {/* Editor surface */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                <VariantsEditor
                    initialVariants={variants ?? []}
                    modelId={modelId}
                />
            </div>
        </div>
    );
}
