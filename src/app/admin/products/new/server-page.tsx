import { supabaseServer } from "@/lib/supabaseServer";
import AddProductClientPage from "./client-page";

export default async function AddProductServerPage() {
    const { data: brands, error } = await supabaseServer
        .from("brands")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

    if (error) {
        throw new Error(error.message);
    }

    return <AddProductClientPage brands={brands ?? []} />;
}
