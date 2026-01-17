import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 text-black ml-64 min-h-screen bg-gray-100">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
