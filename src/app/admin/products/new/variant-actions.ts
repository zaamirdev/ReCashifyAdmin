"use server";

import { supabaseServer } from "@/lib/supabaseServer";

type VariantInput = {
    storage: string;
    base_price: number;
};

export async function createVariants(
    modelId: string,
    variants: VariantInput[]
) {
    if (!modelId) {
        throw new Error("Model ID is required");
    }

    if (!variants.length) {
        throw new Error("At least one variant is required");
    }

    const payload = variants.map((v) => ({
        phone_model_id: modelId,
        storage: `${v.storage}GB`,
        base_price: v.base_price,
        is_active: true,
    }));

    const { error } = await supabaseServer
        .from("phone_variants")
        .insert(payload);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}
