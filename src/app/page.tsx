"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-semibold">
              ReCashify Admin
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Manage products, variants, orders, and users
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="mt-2 inline-flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
