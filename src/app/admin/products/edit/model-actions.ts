"use server";

import { supabaseServer } from "@/lib/supabaseServer";

function toTitleCase(value: string) {
    return value
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}

export async function updateModel(
    modelId: string,
    brandId: string,
    name: string,
    launchYear: number | null
) {
    if (!modelId) {
        throw new Error("Model ID is required");
    }

    if (!brandId) {
        throw new Error("Brand is required");
    }

    if (!name.trim()) {
        throw new Error("Model name is required");
    }

    const formattedName = toTitleCase(name.trim());

    /* -------- Duplicate check (exclude self) -------- */
    const { data: existing } = await supabaseServer
        .from("phone_models")
        .select("id")
        .eq("brand_id", brandId)
        .ilike("name", formattedName)
        .neq("id", modelId)
        .maybeSingle();

    if (existing) {
        throw new Error("Another product with this name already exists");
    }

    const slug = formattedName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const { error } = await supabaseServer
        .from("phone_models")
        .update({
            brand_id: brandId,
            name: formattedName,
            slug,
            launch_year: launchYear,
            updated_at: new Date().toISOString(),
        })
        .eq("id", modelId);

    if (error) {
        throw new Error(error.message);
    }

    return { id: modelId };
}
