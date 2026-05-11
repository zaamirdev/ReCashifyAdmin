import { db } from "@/lib/db";
import AddProductClientPage from "./client-page";

export default async function AddProductPage() {
    const result = await db.query(
        `
        SELECT id, name
        FROM brands
        WHERE is_active = true
        ORDER BY name
        `
    );

    return (
        <AddProductClientPage
            brands={result.rows ?? []}
        />
    );
}