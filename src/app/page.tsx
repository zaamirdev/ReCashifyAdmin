"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold">
        ReCashify Admin Panel 🚀
      </h1>

      <button
        onClick={() => router.push("/admin/dashboard")}
        className="rounded bg-white px-6 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
      >
        Go to Admin Dashboard
      </button>
    </div>
  );
}
