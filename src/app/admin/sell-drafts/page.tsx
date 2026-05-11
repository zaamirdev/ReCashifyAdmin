import { updateDraftStatus } from "@/app/actions/updateDraftStatus";
import SellDraftSearch from "@/components/admin/SellDraftSearch";
import AcceptDraftModal from "@/components/admin/AcceptDraftModal";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function SellDraftsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        status?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;

    const statusFilter = params?.status || "pending";
    const search = params?.search || "";

    const result = await db.query(
        `
    SELECT
        sd.id,
        sd.final_price,
        sd.base_price,
        sd.total_deduction,
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
        ($1 = 'all' OR sd.status = $1)

        AND (
            $2 = ''
            OR LOWER(sd.id::text) LIKE LOWER('%' || $2 || '%')
            OR LOWER(b.name) LIKE LOWER('%' || $2 || '%')
            OR LOWER(pm.name) LIKE LOWER('%' || $2 || '%')
            OR LOWER(pv.variant) LIKE LOWER('%' || $2 || '%')
            OR LOWER(u.name) LIKE LOWER('%' || $2 || '%')
            OR LOWER(u.phone) LIKE LOWER('%' || $2 || '%')
        )
    )

    ORDER BY sd.created_at DESC
    `,
        [statusFilter, search]
    );

    const drafts = result.rows;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-[var(--text-primary)]">
                        Sell Drafts
                    </h1>

                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Review submitted customer phone evaluations
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[var(--border-default)]">
                <StatusTab
                    label="Pending"
                    value="pending"
                    active={statusFilter === "pending"}
                />

                <StatusTab
                    label="Accepted"
                    value="accepted"
                    active={statusFilter === "accepted"}
                />

                <StatusTab
                    label="Completed"
                    value="completed"
                    active={statusFilter === "completed"}
                />

                <StatusTab
                    label="Rejected"
                    value="rejected"
                    active={statusFilter === "rejected"}
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

            {/* Draft cards */}
            <div className="grid gap-4">
                {drafts.map((draft) => (
                    <DraftCard
                        key={draft.id}
                        draft={draft}
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
            href={`/admin/sell-drafts?status=${value}`}
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
   DRAFT CARD
========================= */

function DraftCard({
    draft,
}: {
    draft: any;
}) {
    const status =
        draft.status === "accepted"
            ? "Accepted"
            : draft.status === "rejected"
                ? "Rejected"
                : draft.status === "completed"
                    ? "Completed"
                    : "Pending";

    const statusStyles: Record<string, string> = {
        Pending:
            "bg-yellow-50 text-yellow-700",

        Accepted:
            "bg-green-50 text-green-700",

        Rejected:
            "bg-red-50 text-red-700",

        Completed:
            "bg-blue-50 text-blue-700",
    };

    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
            {/* Top section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">
                        {draft.brand_name}{" "}
                        {draft.model_name}
                    </h2>

                    <div className="mt-3 flex flex-col gap-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            {draft.customer_name || "Unknown Customer"}
                        </p>
                    </div>

                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                        Draft ID: {draft.id}
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Created{" "}
                        {new Date(
                            draft.created_at
                        ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
                    >
                        {status}
                    </span>

                    <div>
                        <p className="text-xs text-[var(--text-muted)]">
                            Final Price
                        </p>

                        <p className="text-lg font-semibold text-[var(--text-primary)]">
                            ₹{draft.final_price}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
                <Link
                    href={`/admin/sell-drafts/${draft.id}`}
                    className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                >
                    View Details
                </Link>

                {draft.status === "pending" && (
                    <>
                        <AcceptDraftModal
                            draftId={draft.id}
                            currentPrice={draft.final_price}
                        />

                        <form
                            action={async () => {
                                "use server";

                                await updateDraftStatus(
                                    draft.id,
                                    "rejected"
                                );
                            }}
                        >
                            <button className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">
                                Reject Draft
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}