import Link, { usePathname } from "@/lib/router";
import { Home, Briefcase, History, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/dashboard";
  const isMissions = pathname.startsWith("/dashboard/missions");
  const isHistorique = pathname.startsWith("/dashboard/historique");
  const isProfil = pathname.startsWith("/dashboard/profil");

  const navItems = [
    { label: "Accueil", href: "/dashboard", active: isHome, icon: Home },
    { label: "Missions", href: "/dashboard/missions", active: isMissions, icon: Briefcase },
    { label: "Historique", href: "/dashboard/historique", active: isHistorique, icon: History },
    { label: "Profil", href: "/dashboard/profil", active: isProfil, icon: User },
  ];

  return (
    <nav className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 lg:hidden">
      <div className="grid grid-cols-4 items-center rounded-3xl border border-slate-200/80 bg-white/95 px-2 py-2 shadow-2xl shadow-navy-950/15 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
                item.active
                  ? "text-brand-orange font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                  item.active ? "bg-orange-50 text-brand-orange scale-110" : ""
                }`}
              >
                <Icon size={19} strokeWidth={item.active ? 2.5 : 1.9} />
              </div>
              <span
                className={`text-[10px] leading-tight ${
                  item.active ? "font-bold text-navy-900" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {item.active && (
                <span className="h-1 w-1 rounded-full bg-brand-orange mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

