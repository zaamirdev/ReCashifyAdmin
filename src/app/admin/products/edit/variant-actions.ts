"use server";

import { supabaseServer } from "@/lib/supabaseServer";

export async function upsertVariants(
    modelId: string,
    variants: {
        id?: string;
        storage: string;
        base_price: number;
    }[]
) {
    // 1️⃣ Fetch ALL variants for this model (ACTIVE + INACTIVE)
    const { data: existingVariants, error } =
        await supabaseServer
            .from("phone_variants")
            .select("id")
            .eq("phone_model_id", modelId);

    if (error) {
        throw new Error(error.message);
    }

    const existingIds = new Set(
        (existingVariants ?? []).map((v) => v.id)
    );

    // 2️⃣ Split incoming variants
    const toUpdate = variants.filter((v) => v.id);
    const toInsert = variants.filter((v) => !v.id);

    // 3️⃣ Update existing variants
    for (const v of toUpdate) {
        await supabaseServer
            .from("phone_variants")
            .update({
                storage: `${v.storage}GB`,
                base_price: v.base_price,
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq("id", v.id!);

        existingIds.delete(v.id!);
    }

    // 4️⃣ Soft-delete removed variants (THIS WAS FAILING BEFORE)
    if (existingIds.size > 0) {
        await supabaseServer
            .from("phone_variants")
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .in("id", Array.from(existingIds));
    }

    // 5️⃣ Insert new variants
    if (toInsert.length > 0) {
        await supabaseServer.from("phone_variants").insert(
            toInsert.map((v) => ({
                phone_model_id: modelId,
                storage: `${v.storage}GB`,
                base_price: v.base_price,
                is_active: true,
            }))
        );
    }
}
