"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  History,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutGrid },
  { href: "/dashboard/missions", label: "Missions", icon: Briefcase },
  { href: "/dashboard/historique", label: "Historique", icon: History },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profil", label: "Mon Profil", icon: User },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-100 bg-white px-4 py-5 lg:flex">
      {/* Brand logo */}
      <Link href="/dashboard" className="mb-4 flex items-center gap-2.5 px-2 group">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition group-hover:scale-105">
          <Image
            src="/logo.png"
            alt="Samré Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain drop-shadow-xs"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg font-bold tracking-tight text-navy-900">
            samré
          </span>
          <span className="text-[10px] text-slate-400">Plateforme de test</span>
        </div>
      </Link>

      {/* Mode Prévisualisation Admin */}
      {user?.role === "admin" && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-gradient-to-b from-rose-50/90 to-rose-50/40 p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-700">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Vue Testeur
              </span>
            </div>
            <span className="rounded-md border border-rose-300/80 bg-white px-1.5 py-0.5 text-[9px] font-bold text-rose-600 shadow-2xs">
              ADMIN
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600 leading-tight">
            Vous naviguez dans l&apos;espace testeur en mode prévisualisation.
          </p>
          <Link
            href="/admin"
            className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition active:scale-95"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            <span>Retour à l&apos;Admin</span>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Menu Principal
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                active
                  ? "bg-navy-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-navy-900"
              }`}
            >
              <Icon
                size={17}
                className={
                  active
                    ? "text-brand-orange"
                    : "text-slate-400 transition group-hover:text-navy-900"
                }
                strokeWidth={active ? 2.3 : 1.8}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Box Conseil / Règles */}
      <div className="mt-auto rounded-xl border border-slate-100 bg-[#FBFBFC] p-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-navy-900">
          <ShieldCheck size={15} className="text-emerald-600" />
          <span className="text-[11px] font-semibold">Guide de validation</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          Suivez chaque consigne puis validez l&apos;étape avec le code fourni pour débloquer la suite.
        </p>
      </div>

      {/* Profil utilisateur en bas de sidebar */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-2.5 min-w-0 flex-1 group hover:opacity-90 transition pr-1"
        >
          {user?.photo ? (
            <img
              src={user.photo}
              alt={user.prenom || "Profil"}
              className="h-8 w-8 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-navy-900 to-brand-orange text-[11px] font-bold text-white shrink-0 shadow-2xs">
              {((user?.prenom?.[0] || "T") + (user?.nom?.[0] || "")).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-navy-900 truncate leading-tight">
                {user?.prenom} {user?.nom}
              </p>
              {user?.role === "admin" && (
                <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[9px] font-bold text-rose-600 border border-rose-500/20">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
          </div>
        </Link>
        <button
          onClick={logout}
          title="Se déconnecter"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition shrink-0"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}