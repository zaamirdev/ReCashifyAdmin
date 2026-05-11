"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateDraftStatus(
    id: string,
    status:
        | "accepted"
        | "rejected"
        | "device_received"
        | "completed",
    formData?: FormData
) {
    const negotiatedPrice =
        formData?.get("negotiated_price");

    const adminNotes =
        formData?.get("admin_notes");

    await db.query(
        `
        UPDATE sell_drafts
        SET
            status = $1,

            negotiated_price =
                COALESCE($2, negotiated_price),

            admin_notes =
                COALESCE($3, admin_notes),

            updated_at = NOW()

        WHERE id = $4
        `,
        [
            status,
            negotiatedPrice || null,
            adminNotes || null,
            id,
        ]
    );

    revalidatePath("/admin/sell-drafts");
    revalidatePath("/admin/orders");
}