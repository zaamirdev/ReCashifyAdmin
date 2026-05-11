import { db } from "@/lib/db";

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    const result = await db.query(
        `
        SELECT
            sd.*,

            b.name AS brand_name,
            pm.name AS model_name,
            pv.variant AS variant_name,

            u.name AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,
            u.city AS customer_city,
            u.state AS customer_state,
            u.pincode AS customer_pincode

        FROM sell_drafts sd

        LEFT JOIN brands b
            ON sd.brand_id = b.id

        LEFT JOIN phone_models pm
            ON sd.phone_model_id = pm.id

        LEFT JOIN phone_variants pv
            ON sd.phone_variant_id = pv.id

        LEFT JOIN users u
            ON sd.user_id = u.id

        WHERE sd.id = $1

        LIMIT 1
        `,
        [id]
    );

    const order = result.rows[0];

    if (!order) {
        return (
            <div className="p-6">
                Order not found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                        {order.brand_name}{" "}
                        {order.model_name}
                    </h1>

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
                </div>

                <div className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                    {order.status}
                </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left */}
                <div className="lg:col-span-2">
                    {/* Evaluation */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                                Device Evaluation
                            </h2>

                            <div className="rounded-[var(--radius-md)] bg-green-50 px-4 py-2 text-right">
                                <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                                    Final Purchase Price
                                </p>

                                <p className="mt-1 text-xl font-bold text-green-700">
                                    ₹
                                    {order.negotiated_price ||
                                        order.final_price}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <InfoCard
                                title="Base Price"
                                value={`₹${order.base_price}`}
                            />

                            <InfoCard
                                title="Evaluated Price"
                                value={`₹${order.final_price}`}
                            />

                            <InfoCard
                                title="Negotiated Price"
                                value={
                                    order.negotiated_price
                                        ? `₹${order.negotiated_price}`
                                        : "Not Negotiated"
                                }
                            />

                            <InfoCard
                                title="Total Deduction"
                                value={`₹${order.total_deduction}`}
                            />

                            <InfoCard
                                title="Created"
                                value={new Date(
                                    order.created_at
                                ).toLocaleString("en-IN")}
                            />
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                            Device Conditions
                        </h2>

                        <div className="mt-5 grid gap-4">
                            <JsonCard
                                title="Screen Condition"
                                data={order.screen_condition}
                            />

                            <JsonCard
                                title="Body Condition"
                                data={order.body_condition}
                            />

                            <JsonCard
                                title="Functional Issues"
                                data={order.functional_issues}
                            />
                        </div>
                    </div>

                    {/* Admin Notes */}
                    {order.admin_notes && (
                        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                                Admin Notes
                            </h2>

                            <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface-secondary)] p-4">
                                <p className="whitespace-pre-wrap text-sm text-[var(--text-primary)]">
                                    {order.admin_notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right */}
                <div className="flex flex-col gap-6">
                    {/* Order Summary */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                            Order Summary
                        </h2>

                        <div className="mt-5 flex flex-col gap-4">
                            <InfoCard
                                title="Current Status"
                                value={order.status}
                            />

                            <InfoCard
                                title="Final Purchase Price"
                                value={`₹${order.negotiated_price ||
                                    order.final_price
                                    }`}
                            />

                            <InfoCard
                                title="Evaluated Price"
                                value={`₹${order.final_price}`}
                            />
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                            Customer Details
                        </h2>

                        <div className="mt-5 flex flex-col gap-4">
                            <InfoCard
                                title="Name"
                                value={
                                    order.customer_name ||
                                    "N/A"
                                }
                            />

                            <InfoCard
                                title="Email"
                                value={
                                    order.customer_email ||
                                    "N/A"
                                }
                            />

                            <InfoCard
                                title="Phone"
                                value={
                                    order.customer_phone ||
                                    "N/A"
                                }
                            />

                            <InfoCard
                                title="City"
                                value={
                                    order.customer_city ||
                                    "N/A"
                                }
                            />

                            <InfoCard
                                title="State"
                                value={
                                    order.customer_state ||
                                    "N/A"
                                }
                            />

                            <InfoCard
                                title="Pincode"
                                value={
                                    order.customer_pincode ||
                                    "N/A"
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface-secondary)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {title}
            </p>

            <p className="mt-2 break-words text-sm text-[var(--text-primary)]">
                {value}
            </p>
        </div>
    );
}

/* =========================
   JSON CARD
========================= */

function JsonCard({
    title,
    data,
}: {
    title: string;
    data: unknown;
}) {
    return (
        <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface-secondary)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {title}
            </p>

            <pre className="mt-3 overflow-x-auto text-xs text-[var(--text-secondary)]">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}