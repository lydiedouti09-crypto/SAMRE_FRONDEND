"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Plus, History, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/dashboard";
  const isMissions = pathname.startsWith("/dashboard/missions");
  const isHistorique = pathname.startsWith("/dashboard/historique");
  const isProfil = pathname.startsWith("/dashboard/profil");

  return (
    <nav className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 lg:hidden">
      <div className="flex items-center justify-between rounded-full border border-slate-100 bg-white/95 px-5 py-2 shadow-xl shadow-slate-200/60 backdrop-blur-lg">
        {/* Accueil */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            isHome ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home size={21} strokeWidth={isHome ? 2.5 : 1.8} />
          <span className="text-[10px]">Accueil</span>
        </Link>

        {/* Missions */}
        <Link
          href="/dashboard/missions"
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            isMissions ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Briefcase size={21} strokeWidth={isMissions ? 2.5 : 1.8} />
          <span className="text-[10px]">Missions</span>
        </Link>

        {/* Bouton Central Flottant (Inspiré de l'Image 2) */}
        <Link
          href="/dashboard/missions"
          className="flex h-11 w-11 -translate-y-2 items-center justify-center rounded-full bg-navy-950 text-white shadow-lg shadow-navy-950/25 transition hover:scale-105 active:scale-95"
          title="Nouvelle mission"
        >
          <Plus size={22} strokeWidth={2.6} className="text-brand-orange" />
        </Link>

        {/* Historique */}
        <Link
          href="/dashboard/historique"
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            isHistorique
              ? "text-brand-orange font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <History size={20} strokeWidth={isHistorique ? 2.5 : 1.8} />
          <span className="text-[10px]">Historique</span>
        </Link>

        {/* Profil */}
        <Link
          href="/dashboard/profil"
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            isProfil ? "text-brand-orange font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User size={21} strokeWidth={isProfil ? 2.5 : 1.8} />
          <span className="text-[10px]">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
