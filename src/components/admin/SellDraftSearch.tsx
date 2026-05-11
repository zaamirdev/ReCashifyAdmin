"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SellDraftSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch =
        searchParams.get("search") || "";

    const [value, setValue] = useState(currentSearch);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(
                searchParams.toString()
            );

            if (value.trim()) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            const query = params.toString();

            const nextUrl = query
                ? `${pathname}?${query}`
                : pathname;

            const currentUrl =
                window.location.pathname +
                window.location.search;

            if (nextUrl !== currentUrl) {
                router.replace(nextUrl);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search by phone, brand, variant or ID..."
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-sm outline-none focus:border-blue-400"
        />
    );
}