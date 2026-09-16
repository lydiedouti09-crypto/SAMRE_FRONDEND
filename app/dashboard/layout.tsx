"use client";

import AuthGuard from "@/components/dashboard/AuthGuard";
import BottomNav from "@/components/dashboard/BottomNav";
import DesktopSidebar from "@/components/dashboard/DesktopSidebar";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

function AdminMobilePreviewBanner() {
  const { user } = useAuth();
  if (user?.role !== "admin") return null;

  return (
    <div className="flex lg:hidden items-center justify-between bg-rose-600 px-4 py-2 text-white text-xs font-medium sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Shield size={14} />
        <span>Mode Prévisualisation Admin</span>
      </div>
      <Link
        href="/admin"
        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition"
      >
        <ArrowLeft size={12} />
        <span>Retour Admin</span>
      </Link>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminMobilePreviewBanner />
      <div className="min-h-screen bg-[#F8F9FB] text-slate-800 lg:flex">
        <DesktopSidebar />
        <main className="w-full flex-1 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </AuthGuard>
  );
}