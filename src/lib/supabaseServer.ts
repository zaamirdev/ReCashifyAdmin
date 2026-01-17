import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 * DO NOT import this in client components.
 */
if (typeof window !== "undefined") {
    throw new Error(
        "supabaseServer must not be imported in the browser"
    );
}

export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            persistSession: false,
        },
    }
);
