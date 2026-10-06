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
    <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 lg:hidden">
      <div className="bg-white/95 px-4 pt-2.5 pb-2 border-t border-slate-100/80 shadow-[0_-8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl rounded-t-[26px]">
        <div className="grid grid-cols-4 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-95`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    item.active
                      ? "bg-[#0B2545] text-white shadow-md shadow-slate-900/20"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon size={19} strokeWidth={item.active ? 2.4 : 1.8} fill={item.active ? "currentColor" : "none"} />
                </div>
                <span
                  className={`text-[10px] tracking-tight leading-none ${
                    item.active ? "font-extrabold text-[#0B2545]" : "font-semibold text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Barre indicateur d'accueil iOS (Home indicator) */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1 w-28 rounded-full bg-slate-300/80" />
        </div>
      </div>
    </nav>
  );
}
