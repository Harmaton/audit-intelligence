import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Auditor General Intelligence Platform",
  description:
    "World-class AI-enabled oversight for efficiency, transparency, reconciliation and value realisation across Tanzania.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
            <div className="mx-auto w-full max-w-7xl px-3 py-4 pb-20 sm:px-4 sm:py-6 sm:pb-24 md:px-6 lg:px-8 lg:pb-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
