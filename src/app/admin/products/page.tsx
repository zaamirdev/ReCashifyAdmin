import Link from "next/link";
import { db } from "@/lib/db";

type BrandRow = {
    id: string;
    name: string;
    is_active: boolean;
};

type ModelCountRow = {
    brand_id: string;
    count: number;
};

export default async function ProductsPage() {
    // 1️⃣ Fetch all brands
    const brandsResult = await db.query(
        `
        SELECT id, name, is_active
        FROM brands
        ORDER BY name ASC
        `
    );

    const brands = brandsResult.rows as BrandRow[];

    // 2️⃣ Fetch model counts grouped by brand
    const modelCountsResult = await db.query(
        `
        SELECT *
        FROM brand_model_counts()
        `
    );

    const modelCounts =
        modelCountsResult.rows as ModelCountRow[];

    // 3️⃣ Convert counts to map
    const countMap = new Map<string, number>();

    modelCounts.forEach((row) => {
        countMap.set(
            row.brand_id,
            Number(row.count)
        );
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Manage brands and their available models
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
                >
                    Add product
                </Link>
            </div>

            {/* Products table */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] text-left text-xs font-medium text-[var(--text-muted)]">
                            <th className="px-4 py-3">Brand</th>
                            <th className="px-4 py-3">Models</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {brands?.map((brand: BrandRow) => (
                            <tr
                                key={brand.id}
                                className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]"
                            >
                                <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                                    {brand.name}
                                </td>

                                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                                    {countMap.get(brand.id) ?? 0}
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={[
                                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                            brand.is_active
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-100 text-gray-600",
                                        ].join(" ")}
                                    >
                                        {brand.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/products/${brand.id}`}
                                        className="text-sm font-medium text-[var(--primary)] hover:underline"
                                    >
                                        View models
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {(!brands ||
                            brands.length === 0) && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
                                    >
                                        No products found
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}