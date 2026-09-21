import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Rémen — Manajemen Catering",
  description: "Pembukuan, invoicing, dan profit per project untuk usaha catering.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-bg text-[15px] pb-16">
        <TopBar />
        <main className="max-w-3xl mx-auto px-4 py-5">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
