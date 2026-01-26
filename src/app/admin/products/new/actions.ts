"use server";

import { supabaseServer } from "@/lib/supabaseServer";

export type CreateProductPayload = {
    brand_id: string;
    model_name: string;
    launch_year?: number;
    is_active: boolean;
    variants: {
        variant: string;
        base_price: number;
        is_active: boolean;
    }[];
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function createProduct(payload: CreateProductPayload) {
    const {
        brand_id,
        model_name,
        launch_year,
        is_active,
        variants,
    } = payload;

    /* ---------- Basic validation (server-side safety) ---------- */

    if (!brand_id) {
        throw new Error("Brand is required");
    }

    if (!model_name || model_name.trim().length === 0) {
        throw new Error("Model name is required");
    }

    if (!variants || variants.length === 0) {
        throw new Error("At least one variant is required");
    }

    variants.forEach((v, index) => {
        if (!v.variant || v.variant.trim().length === 0) {
            throw new Error(`Variant name missing at row ${index + 1}`);
        }

        if (v.base_price <= 0) {
            throw new Error(
                `Base price must be greater than 0 (row ${index + 1})`
            );
        }
    });

    /* ---------- 1️⃣ Create phone model ---------- */

    const slug = slugify(model_name);

    const { data: model, error: modelError } =
        await supabaseServer
            .from("phone_models")
            .insert({
                brand_id,
                name: model_name.trim(),
                slug,
                launch_year: launch_year ?? null,
                is_active,
            })
            .select("id")
            .single();

    if (modelError) {
        throw new Error(modelError.message);
    }

    /* ---------- 2️⃣ Create variants ---------- */

    const variantRows = variants.map((v) => ({
        phone_model_id: model.id,
        variant: v.variant.trim(),
        base_price: v.base_price,
        is_active: v.is_active,
    }));

    const { error: variantError } =
        await supabaseServer
            .from("phone_variants")
            .insert(variantRows);

    if (variantError) {
        throw new Error(variantError.message);
    }

    /* ---------- Success ---------- */

    return {
        success: true,
        model_id: model.id,
    };
}
