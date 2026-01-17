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

export async function createModel(
    brandId: string,
    name: string,
    launchYear: number | null
) {
    if (!brandId) {
        throw new Error("Brand is required");
    }

    if (!name.trim()) {
        throw new Error("Model name is required");
    }

    const formattedName = toTitleCase(name.trim());

    /* -------- Duplicate check (brand scoped) -------- */

    const { data: existing } = await supabaseServer
        .from("phone_models")
        .select("id")
        .eq("brand_id", brandId)
        .ilike("name", formattedName)
        .maybeSingle();

    if (existing) {
        throw new Error("This product already exists");
    }

    const slug = formattedName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabaseServer
        .from("phone_models")
        .insert({
            brand_id: brandId,
            name: formattedName,
            slug,
            launch_year: launchYear,
            is_active: true,
        })
        .select("id, name")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
