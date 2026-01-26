export default function Header() {
    return (
        <div className="flex h-14 items-center justify-between px-6">
            {/* Page title */}
            <h1 className="text-sm font-semibold text-[var(--text-primary)]">
                {/* Admin Panel */}
            </h1>

            {/* Right actions (user / future actions) */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-secondary)]">
                    Admin
                </span>
            </div>
        </div>
    );
}
