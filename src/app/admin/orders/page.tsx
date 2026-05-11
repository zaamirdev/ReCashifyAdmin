import { updateDraftStatus } from "@/app/actions/updateDraftStatus";
import SellDraftSearch from "@/components/admin/SellDraftSearch";
import { db } from "@/lib/db";
import Link from "next/link";

/* =========================
   PAGE
========================= */

export default async function OrdersPage({
    searchParams,
}: {
    searchParams?: Promise<{
        status?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;

    const statusFilter =
        params?.status || "accepted";

    const search = params?.search || "";

    const result = await db.query(
        `
        SELECT
            sd.id,
            sd.final_price,
            sd.negotiated_price,
            sd.admin_notes,
            sd.status,
            sd.created_at,

            b.name AS brand_name,
            pm.name AS model_name,
            pv.variant AS variant_name,

            u.name AS customer_name,
            u.phone AS customer_phone

        FROM sell_drafts sd

        LEFT JOIN brands b
            ON sd.brand_id = b.id

        LEFT JOIN phone_models pm
            ON sd.phone_model_id = pm.id

        LEFT JOIN phone_variants pv
            ON sd.phone_variant_id = pv.id

        LEFT JOIN users u
            ON sd.user_id = u.id

        WHERE (
            (
                $1 = 'all'
                AND sd.status IN (
                    'accepted',
                    'device_received',
                    'completed'
                )
            )

            OR sd.status = $1
        )

        AND (
            $2 = ''
            OR LOWER(sd.id::text) LIKE LOWER('%' || $2 || '%')
            OR LOWER(b.name) LIKE LOWER('%' || $2 || '%')
            OR LOWER(pm.name) LIKE LOWER('%' || $2 || '%')
            OR LOWER(pv.variant) LIKE LOWER('%' || $2 || '%')
            OR LOWER(u.name) LIKE LOWER('%' || $2 || '%')
            OR LOWER(u.phone) LIKE LOWER('%' || $2 || '%')
        )

        ORDER BY sd.created_at DESC
        `,
        [statusFilter, search]
    );

    const orders = result.rows;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        Orders
                    </h1>

                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Manage active device purchase orders
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[var(--border-default)]">
                <StatusTab
                    label="Pending"
                    value="accepted"
                    active={statusFilter === "accepted"}
                />

                <StatusTab
                    label="Received"
                    value="device_received"
                    active={
                        statusFilter ===
                        "device_received"
                    }
                />

                <StatusTab
                    label="Completed"
                    value="completed"
                    active={statusFilter === "completed"}
                />

                <StatusTab
                    label="All"
                    value="all"
                    active={statusFilter === "all"}
                />
            </div>

            {/* Search */}
            <div>
                <SellDraftSearch />
            </div>

            {/* Orders */}
            <div className="grid gap-4">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                    />
                ))}
            </div>
        </div>
    );
}

/* =========================
   STATUS TAB
========================= */

function StatusTab({
    label,
    value,
    active = false,
}: {
    label: string;
    value: string;
    active?: boolean;
}) {
    return (
        <Link
            href={`/admin/orders?status=${value}`}
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
        </Link>
    );
}

/* =========================
   ORDER CARD
========================= */

function OrderCard({
    order,
}: {
    order: any;
}) {
    const status =
        order.status === "completed"
            ? "Completed"
            : order.status === "device_received"
                ? "Received"
                : "Pending";

    const statusStyles: Record<string, string> = {
        Pending:
            "bg-yellow-50 text-yellow-700",

        Received:
            "bg-blue-50 text-blue-700",

        Completed:
            "bg-green-50 text-green-700",
    };

    const finalPurchasePrice =
        order.negotiated_price ||
        order.final_price;

    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
            {/* Top */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">
                        {order.brand_name}{" "}
                        {order.model_name}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {order.variant_name ||
                            "No Variant"}
                    </p>

                    <div className="mt-3 flex flex-col gap-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            {order.customer_name ||
                                "Unknown Customer"}
                        </p>

                        <p className="text-xs text-[var(--text-secondary)]">
                            {order.customer_phone ||
                                "No Phone"}
                        </p>
                    </div>

                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                        Order ID: {order.id}
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Created{" "}
                        {new Date(
                            order.created_at
                        ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    {order.admin_notes && (
                        <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface-secondary)] px-3 py-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                Admin Notes
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">
                                {order.admin_notes}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
                    >
                        {status}
                    </span>

                    {order.negotiated_price && (
                        <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Negotiated
                        </span>
                    )}

                    <div className="text-left lg:text-right">
                        <p className="text-xs text-[var(--text-muted)]">
                            Final Purchase Price
                        </p>

                        <p className="text-lg font-semibold text-green-700">
                            ₹{finalPurchasePrice}
                        </p>

                        {order.negotiated_price && (
                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                Evaluated:
                                {" "}
                                ₹{order.final_price}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
                <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                >
                    View Details
                </Link>

                {order.status === "accepted" && (
                    <form
                        action={async () => {
                            "use server";

                            await updateDraftStatus(
                                order.id,
                                "device_received"
                            );
                        }}
                    >
                        <button className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
                            Device Received
                        </button>
                    </form>
                )}

                {order.status ===
                    "device_received" && (
                        <form
                            action={async () => {
                                "use server";

                                await updateDraftStatus(
                                    order.id,
                                    "completed"
                                );
                            }}
                        >
                            <button className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700">
                                Mark Completed
                            </button>
                        </form>
                    )}
            </div>
        </div>
    );
}