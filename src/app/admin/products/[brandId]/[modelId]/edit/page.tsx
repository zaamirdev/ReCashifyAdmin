import { supabaseServer } from "@/lib/supabaseServer";
import AddProductClientPage from "../../new/client-page";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ modelId: string }>;
}) {
    const { modelId } = await params;

    // 1️⃣ Fetch brands (same as Add Product)
    const { data: brands, error: brandsError } =
        await supabaseServer
            .from("brands")
            .select("id, name")
            .order("name");

    if (brandsError) {
        throw new Error(brandsError.message);
    }

    // 2️⃣ Fetch model
    const { data: model, error: modelError } =
        await supabaseServer
            .from("phone_models")
            .select("id, name, brand_id, launch_year, is_active")
            .eq("id", modelId)
            .single();

    if (modelError || !model) {
        throw new Error("Model not found");
    }

    // 3️⃣ Fetch variants
    const { data: variants, error: variantError } =
        await supabaseServer
            .from("phone_variants")
            .select("id, storage, base_price, is_active, phone_models(id)")
            .eq("phone_models.id", modelId)
            .eq("is_active", true);

    if (variantError) {
        throw new Error(variantError.message);
    }

    const filteredVariants =
        (variants ?? []).filter(
            (v) => v.phone_models !== null
        );

    return (
        <AddProductClientPage
            brands={brands ?? []}
            initialData={{
                model,
                variants: filteredVariants,
            }}
            isEdit
        />
    );

}
