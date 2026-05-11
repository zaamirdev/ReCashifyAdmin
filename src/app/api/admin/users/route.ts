import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const result = await db.query(
            `
            SELECT id, email
            FROM users
            ORDER BY email ASC
            `
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch users",
            },
            { status: 500 }
        );
    }
}