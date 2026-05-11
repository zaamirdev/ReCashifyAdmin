"use server";

import { db } from "@/lib/db";

type UpdateVariantPayload = {
    id: string;
    variant: string | null;
    base_price: number;
    is_active: boolean;
};

export async function updateVariant(
    payload: UpdateVariantPayload
) {
    const {
        id,
        variant,
        base_price,
        is_active,
    } = payload;

    await db.query(
        `
        UPDATE phone_variants
        SET
            variant = $1,
            base_price = $2,
            is_active = $3,
            updated_at = NOW()
        WHERE id = $4
        `,
        [
            variant,
            base_price,
            is_active,
            id,
        ]
    );

    return {
        success: true,
    };
}