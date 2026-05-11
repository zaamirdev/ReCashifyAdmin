"use server";

import { db } from "@/lib/db";

export type CreateProductPayload = {
    brand_id: string;
    model_name: string;
    launch_year?: number;
    is_active: boolean;
    variants: {
        variant: string;
        base_price: number;
        is_active: boolean;
    }[];
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function createProduct(
    payload: CreateProductPayload
) {
    const {
        brand_id,
        model_name,
        launch_year,
        is_active,
        variants,
    } = payload;

    /* ---------- Basic validation ---------- */

    if (!brand_id) {
        throw new Error("Brand is required");
    }

    if (!model_name || model_name.trim().length === 0) {
        throw new Error("Model name is required");
    }

    if (!variants || variants.length === 0) {
        throw new Error("At least one variant is required");
    }

    variants.forEach((v, index) => {
        if (!v.variant || v.variant.trim().length === 0) {
            throw new Error(
                `Variant name missing at row ${index + 1}`
            );
        }

        if (v.base_price <= 0) {
            throw new Error(
                `Base price must be greater than 0 (row ${index + 1
                })`
            );
        }
    });

    /* ---------- 1️⃣ Create phone model ---------- */

    const slug = slugify(model_name);

    const modelResult = await db.query(
        `
        INSERT INTO phone_models (
            brand_id,
            name,
            slug,
            launch_year,
            is_active
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [
            brand_id,
            model_name.trim(),
            slug,
            launch_year ?? null,
            is_active,
        ]
    );

    const model = modelResult.rows[0];

    /* ---------- 2️⃣ Create variants ---------- */

    for (const v of variants) {
        await db.query(
            `
            INSERT INTO phone_variants (
                phone_model_id,
                variant,
                base_price,
                is_active
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                model.id,
                v.variant.trim(),
                v.base_price,
                v.is_active,
            ]
        );
    }

    /* ---------- Success ---------- */

    return {
        success: true,
        model_id: model.id,
    };
}