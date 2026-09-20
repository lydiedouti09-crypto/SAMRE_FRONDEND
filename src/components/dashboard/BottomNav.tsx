import { useEffect, useState } from "react";
import Link, { usePathname } from "@/lib/router";
import { Home, Briefcase, Bell, History, User } from "lucide-react";
import { notificationsApi } from "@/lib/api";

export default function BottomNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const isHome = pathname === "/dashboard";
  const isMissions = pathname.startsWith("/dashboard/missions");
  const isNotifications = pathname.startsWith("/dashboard/notifications");
  const isHistorique = pathname.startsWith("/dashboard/historique");
  const isProfil = pathname.startsWith("/dashboard/profil");

  useEffect(() => {
    notificationsApi
      .list()
      .then((items) => {
        setUnreadCount(items.filter((n) => !n.lu).length);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <nav className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 lg:hidden">
      <div className="grid grid-cols-5 items-center rounded-full border border-slate-100 bg-white/95 px-2 py-1.5 shadow-xl shadow-slate-200/60 backdrop-blur-lg">
        {/* Accueil */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition ${
            isHome ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} />
          <span className="text-[10px] leading-tight">Accueil</span>
        </Link>

        {/* Missions */}
        <Link
          href="/dashboard/missions"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition ${
            isMissions ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Briefcase size={20} strokeWidth={isMissions ? 2.5 : 1.8} />
          <span className="text-[10px] leading-tight">Missions</span>
        </Link>

        {/* Notifications (remplace le bouton + inutile) */}
        <Link
          href="/dashboard/notifications"
          className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition ${
            isNotifications ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <Bell size={20} strokeWidth={isNotifications ? 2.5 : 1.8} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[9px] font-bold text-white shadow-2xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">Notifs</span>
        </Link>

        {/* Historique */}
        <Link
          href="/dashboard/historique"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition ${
            isHistorique
              ? "text-brand-orange font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <History size={20} strokeWidth={isHistorique ? 2.5 : 1.8} />
          <span className="text-[10px] leading-tight">Historique</span>
        </Link>

        {/* Profil */}
        <Link
          href="/dashboard/profil"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-2xl transition ${
            isProfil ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User size={20} strokeWidth={isProfil ? 2.5 : 1.8} />
          <span className="text-[10px] leading-tight">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
