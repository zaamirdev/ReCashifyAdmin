"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Customers", href: "/admin/customers" },
    { label: "Products", href: "/admin/products" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-[var(--border-default)] bg-[var(--bg-surface)]">
            {/* Brand */}
            <div className="flex h-14 items-center border-b border-[var(--border-default)] px-4">
                <span className="text-sm font-semibold tracking-tight">
                    ReCashify
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                "flex h-9 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]",
                            ].join(" ")}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
