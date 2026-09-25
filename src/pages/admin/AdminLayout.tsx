import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Link, { usePathname, useRouter } from "@/lib/router";
import Image from "@/components/ui/Image";
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  LogOut,
  Loader2,
  MessageSquare,
  Bell,
  ListTodo,
  Smartphone,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth-context";

const adminNav = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Projets de test (Apps)", icon: Smartphone, exact: false },
  { href: "/admin/missions", label: "Missions & Programme", icon: ListTodo, exact: false },
  { href: "/admin/participations", label: "Candidatures & Suivi", icon: CheckCircle2, exact: false },
  { href: "/admin/testeurs", label: "Gestion Testeurs", icon: Users, exact: false },
  { href: "/admin/feedbacks", label: "Feedbacks des Tests", icon: MessageSquare, exact: false },
  { href: "/admin/notifications", label: "Centre Notifications", icon: Bell, exact: false },
];

function AdminLayoutInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, adminLoading, adminLogout } = useAdminAuth();

  const isLoginPage =
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname.startsWith("/admin/login");

  useEffect(() => {
    if (isLoginPage) return;
    if (!adminLoading && (!adminUser || adminUser.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [adminUser, adminLoading, router, isLoginPage]);

  if (isLoginPage) {
    return <Outlet />;
  }

  if (adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          <p className="text-sm text-slate-400">Chargement de l'espace administration...</p>
        </div>
      </div>
    );
  }

  if (!adminUser || adminUser.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans antialiased text-slate-800">
      {/* Sidebar Admin SAMRE */}
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
                <span className="rounded-md bg-brand-orange/20 px-1.5 py-0.5 text-[10px] font-bold text-brand-orange border border-brand-orange/30">
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-xs font-bold text-brand-orange">
                {adminUser.prenom?.[0] || adminUser.nom?.[0] || "A"}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-white">
                  {adminUser.prenom} {adminUser.nom}
                </p>
                <p className="truncate text-[10px] text-slate-400">{adminUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => adminLogout()}
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
          <button onClick={() => adminLogout()} className="text-xs font-semibold text-rose-500 hover:underline">
            Déconnexion
          </button>
        </header>

        {/* Trait Horizontal Desktop : Barre supérieure avec délimitation nette */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-2xs lg:flex">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-sm font-bold tracking-tight text-navy-900">
              Tableau de Bord
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-navy-900 leading-tight">
                {adminUser.prenom} {adminUser.nom || "Admin"}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">
                Super Admin
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white shadow-2xs">
              {(adminUser.prenom?.[0] || "A").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner />
    </AdminAuthProvider>
  );
}
