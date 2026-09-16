"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle2,
  LogOut,
  Shield,
  ArrowUpRight,
  Loader2,
  MessageSquare,
  Bell,
  ListTodo,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const adminNav = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications à tester", icon: Smartphone, exact: false },
  { href: "/admin/missions", label: "Missions & Programme", icon: ListTodo, exact: false },
  { href: "/admin/participations", label: "Candidatures & Suivi", icon: CheckCircle2, exact: false },
  { href: "/admin/testeurs", label: "Gestion Testeurs", icon: Users, exact: false },
  { href: "/admin/feedbacks", label: "Feedbacks des Tests", icon: MessageSquare, exact: false },
  { href: "/admin/notifications", label: "Centre Notifications", icon: Bell, exact: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  const handleAdminLogout = () => {
    logout("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          <p className="text-sm text-slate-400">Chargement de l&apos;espace administration...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans antialiased text-slate-800">
      {/* Sidebar Admin Autonome */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0B1528] text-white lg:flex">
        {/* Header Branding */}
        <div className="p-5 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/60 p-1.5 ring-1 ring-white/10">
              <Image
                src="/logo.png"
                alt="Samré Admin"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  samré
                </span>
                <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Portail Administrateur</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Gestion Globale
          </p>
          {adminNav.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/20"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-white" : "text-slate-400 group-hover:text-white"}
                  strokeWidth={active ? 2.3 : 1.8}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Profil Admin & Déconnexion */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">
                {user.prenom?.[0] || user.nom?.[0] || "A"}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-white">
                  {user.prenom} {user.nom}
                </p>
                <p className="truncate text-[10px] text-slate-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              title="Déconnexion"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header Mobile */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Samré Logo" width={28} height={28} />
            <span className="font-bold text-navy-900">samré ADMIN</span>
          </div>
          <button onClick={handleAdminLogout} className="text-xs font-semibold text-rose-500 hover:underline">
            Déconnexion
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
