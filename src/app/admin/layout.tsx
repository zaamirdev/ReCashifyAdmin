import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[var(--bg-app)]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-[var(--border-default)] bg-[var(--bg-surface)]">
                <Sidebar />
            </aside>

            {/* Main content */}
            <div className="ml-64 flex min-h-screen flex-1 flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                    <Header />
                </header>

                {/* Page content */}
                <main className="flex-1 px-6 py-6">
                    <div className="mx-auto max-w-[1280px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
