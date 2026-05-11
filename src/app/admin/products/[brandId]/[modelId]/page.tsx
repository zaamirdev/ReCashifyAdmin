import Link from "next/link";
import { db } from "@/lib/db";
import VariantsEditor from "@/components/VariantsEditor";

export default async function ModelVariantsPage({
    params,
}: {
    params: Promise<{ brandId: string; modelId: string }>;
}) {
    const { brandId, modelId } = await params;

    // Fetch model info
    const modelResult = await db.query(
        `
        SELECT id, name
        FROM phone_models
        WHERE id = $1
        LIMIT 1
        `,
        [modelId]
    );

    const model = modelResult.rows[0];

    // Fetch variants
    const variantsResult = await db.query(
        `
        SELECT id, variant, base_price, is_active
        FROM phone_variants
        WHERE phone_model_id = $1
        ORDER BY base_price ASC
        `,
        [modelId]
    );

    const variants = variantsResult.rows;

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