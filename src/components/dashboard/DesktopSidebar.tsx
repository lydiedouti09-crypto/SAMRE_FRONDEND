import Link, { usePathname } from "@/lib/router";
import Image from "@/components/ui/Image";
import {
  LayoutDashboard,
  Briefcase,
  History,
  Bell,
  User,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/missions", label: "Missions", icon: Briefcase, exact: false },
  { href: "/dashboard/historique", label: "Historique", icon: History, exact: false },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: false },
  { href: "/dashboard/profil", label: "Mon Profil", icon: User, exact: false },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white px-3.5 py-4 text-slate-800 lg:flex">
      {/* Brand logo SAMRE officiel */}
      <div className="mb-6 flex items-center justify-between px-2 pt-1 border-b border-slate-100 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-200/80 transition group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Samré Logo"
              width={36}
              height={36}
              className="h-8 w-8 object-contain drop-shadow-xs"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-black tracking-wider text-navy-950">
              SAMRE
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Plateforme de test</span>
          </div>
        </Link>
        <button
          type="button"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          title="Réduire le menu"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Navigation principale */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Principal
        </p>
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                active
                  ? "bg-navy-950 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy-950"
              }`}
            >
              <Icon
                size={18}
                className={active ? "text-white" : "text-slate-400 group-hover:text-navy-900"}
                strokeWidth={active ? 2.3 : 1.8}
              />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profil utilisateur & Déconnexion au bas de la barre latérale */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between px-1">
          <Link
            href="/dashboard/profil"
            className="flex items-center gap-2.5 min-w-0 flex-1 group hover:opacity-90 transition pr-1"
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.prenom || "Profil"}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white shrink-0 shadow-2xs">
                {((user?.prenom?.[0] || "T") + (user?.nom?.[0] || "")).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-navy-950 truncate leading-tight group-hover:text-brand-orange transition">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}