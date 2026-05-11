import { db } from "@/lib/db";
import ProductFormClient from "@/components/ProductFormClient";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ modelId: string }>;
}) {
    const { modelId } = await params;

    // 1️⃣ Fetch brands
    const brandsResult = await db.query(
        `
        SELECT id, name
        FROM brands
        ORDER BY name ASC
        `
    );

    const brands = brandsResult.rows;

    // 2️⃣ Fetch model
    const modelResult = await db.query(
        `
        SELECT id, name, brand_id, launch_year, is_active
        FROM phone_models
        WHERE id = $1
        LIMIT 1
        `,
        [modelId]
    );

    const model = modelResult.rows[0];

    if (!model) {
        throw new Error("Model not found");
    }

    // 3️⃣ Fetch variants
    const variantsResult = await db.query(
        `
        SELECT
            id,
            variant,
            base_price,
            is_active,
            phone_model_id
        FROM phone_variants
        WHERE phone_model_id = $1
        AND is_active = true
        ORDER BY base_price ASC
        `,
        [modelId]
    );

    const variants = variantsResult.rows;

    return (
        <ProductFormClient
            brands={brands ?? []}
            initialData={{
                model,
                variants: variants ?? [],
            }}
            isEdit
        />
    );
}