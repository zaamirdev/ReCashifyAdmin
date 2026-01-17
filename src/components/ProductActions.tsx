"use client";

import Link from "next/link";

export default function ProductActions({
    modelId,
}: {
    modelId: string;
}) {
    const handleDelete = () => {
        // TODO: Implement soft delete for model + variants
        // This will be added in the next step
    };

    return (
        <div className="flex gap-3">
            <Link
                href={`/admin/products/${modelId}/edit`}
                className="text-blue-600 hover:underline"
            >
                Edit
            </Link>

            <button
                onClick={handleDelete}
                className="text-red-600 hover:underline"
            >
                Delete
            </button>
        </div>
    );
}
