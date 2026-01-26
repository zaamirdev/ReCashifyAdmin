export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        Orders
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Manage and track customer orders
                    </p>
                </div>

                <button className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)]">
                    Create order
                </button>
            </div>

            {/* Status tabs */}
            <div className="flex gap-2 border-b border-[var(--border-default)]">
                <StatusTab label="All" active />
                <StatusTab label="Pending" />
                <StatusTab label="Completed" />
                <StatusTab label="Cancelled" />
            </div>

            {/* Orders table */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] text-left text-xs font-medium text-[var(--text-muted)]">
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        <OrderRow
                            order="#RC-1024"
                            customer="Amit Sharma"
                            status="Pending"
                            total="₹18,500"
                            date="Jan 24, 2026"
                        />
                        <OrderRow
                            order="#RC-1023"
                            customer="Neha Verma"
                            status="Completed"
                            total="₹32,000"
                            date="Jan 23, 2026"
                        />
                        <OrderRow
                            order="#RC-1022"
                            customer="Rahul Mehta"
                            status="Cancelled"
                            total="₹12,000"
                            date="Jan 22, 2026"
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

function StatusTab({
    label,
    active = false,
}: {
    label: string;
    active?: boolean;
}) {
    return (
        <button
            className={[
                "relative px-3 py-2 text-sm font-medium",
                active
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            ].join(" ")}
        >
            {label}
            {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)]" />
            )}
        </button>
    );
}

function OrderRow({
    order,
    customer,
    status,
    total,
    date,
}: {
    order: string;
    customer: string;
    status: "Pending" | "Completed" | "Cancelled";
    total: string;
    date: string;
}) {
    const statusStyles: Record<typeof status, string> = {
        Pending:
            "bg-yellow-50 text-yellow-700",
        Completed:
            "bg-green-50 text-green-700",
        Cancelled:
            "bg-red-50 text-red-700",
    };

    return (
        <tr className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]">
            <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                {order}
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                {customer}
            </td>
            <td className="px-4 py-3">
                <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
                >
                    {status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                {total}
            </td>
            <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                {date}
            </td>
        </tr>
    );
}
