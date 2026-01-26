export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Page header */}
            <div>
                <h1 className="text-base font-semibold text-[var(--text-primary)]">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Overview of your store activity
                </p>
            </div>

            {/* Analytics cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Orders"
                    value="1,248"
                    meta="All time"
                />
                <StatCard
                    title="Pending Orders"
                    value="37"
                    meta="Awaiting action"
                />
                <StatCard
                    title="Sell Requests"
                    value="412"
                    meta="Submitted"
                />
                <StatCard
                    title="Pending Sell Drafts"
                    value="19"
                    meta="Incomplete"
                />
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Products"
                    value="86"
                    meta="Active listings"
                />
                <StatCard
                    title="Active Variants"
                    value="214"
                    meta="Across all products"
                />
                <StatCard
                    title="Users"
                    value="3,092"
                    meta="Registered"
                />
            </div>

            {/* Placeholder sections (future charts / tables) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PlaceholderPanel title="Orders over time" />
                <PlaceholderPanel title="Recent activity" />
            </div>
        </div>
    );
}

/* =========================
   INTERNAL COMPONENTS
   (local on purpose for now)
   ========================= */

function StatCard({
    title,
    value,
    meta,
}: {
    title: string;
    value: string;
    meta: string;
}) {
    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="flex flex-col gap-1">
                <span className="text-sm text-[var(--text-secondary)]">
                    {title}
                </span>
                <span className="text-2xl font-semibold text-[var(--text-primary)]">
                    {value}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                    {meta}
                </span>
            </div>
        </div>
    );
}

function PlaceholderPanel({ title }: { title: string }) {
    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="flex h-64 flex-col gap-2">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    {title}
                </h2>
                <div className="flex flex-1 items-center justify-center rounded border border-dashed border-[var(--border-default)] text-sm text-[var(--text-muted)]">
                    Chart / table will appear here
                </div>
            </div>
        </div>
    );
}
