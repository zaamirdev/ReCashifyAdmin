export default function UsersPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        Customers
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        View and manage registered customers
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search customers"
                    className="h-9 w-64 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-sm placeholder:text-[var(--text-muted)]"
                />

                <select className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-sm">
                    <option>All customers</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Customers table */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] text-left text-xs font-medium text-[var(--text-muted)]">
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Orders</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Joined</th>
                        </tr>
                    </thead>

                    <tbody>
                        <UserRow
                            name="Amit Sharma"
                            email="amit.sharma@email.com"
                            orders="12"
                            status="Active"
                            joined="Jan 12, 2025"
                        />
                        <UserRow
                            name="Neha Verma"
                            email="neha.verma@email.com"
                            orders="5"
                            status="Active"
                            joined="Mar 03, 2025"
                        />
                        <UserRow
                            name="Rahul Mehta"
                            email="rahul.mehta@email.com"
                            orders="0"
                            status="Inactive"
                            joined="Dec 18, 2024"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* =========================
   INTERNAL COMPONENTS
   ========================= */

function UserRow({
    name,
    email,
    orders,
    status,
    joined,
}: {
    name: string;
    email: string;
    orders: string;
    status: "Active" | "Inactive";
    joined: string;
}) {
    return (
        <tr className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]">
            <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                {name}
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                {email}
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                {orders}
            </td>
            <td className="px-4 py-3">
                <span
                    className={[
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                >
                    {status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                {joined}
            </td>
        </tr>
    );
}
