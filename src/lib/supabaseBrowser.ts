import { createClient } from "@supabase/supabase-js";

/**
 * Browser-only Supabase client.
 * Safe to use in client components.
 */
export const supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
