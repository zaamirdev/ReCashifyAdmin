import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ReCashify Admin",
    template: "%s · ReCashify Admin",
  },
  description:
    "Admin panel for managing products, variants, orders, and users in ReCashify.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "bg-[var(--bg-app)]",
          "text-[var(--text-primary)]",
        ].join(" ")}
      >
        {/* Global notifications (Shopify-style top-right) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-sm)",
            },
          }}
        />

        {children}
      </body>
    </html>
  );
}
