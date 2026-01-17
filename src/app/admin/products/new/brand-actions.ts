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

export async function createBrand(name: string) {
    if (!name.trim()) {
        throw new Error("Brand name is required");
    }

    const formattedName = toTitleCase(name.trim());

    const slug = formattedName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabaseServer
        .from("brands")
        .insert({
            name: formattedName,
            slug,
            is_active: true,
        })
        .select("id, name")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
