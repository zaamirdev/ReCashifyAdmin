"use server";

import { supabaseServer } from "@/lib/supabaseServer";

export async function searchModelsByBrand(
    brandId: string,
    query: string
) {
    if (!brandId || !query.trim()) return [];

    const { data, error } = await supabaseServer
        .from("phone_models")
        .select("id, name")
        .eq("brand_id", brandId)
        .ilike("name", `%${query}%`)
        .eq("is_active", true)
        .order("name");

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
