"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  Smartphone,
  Wallet,
  CheckCircle2,
  Search,
  Bell,
  Star,
  ArrowRight,
  Sparkles,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  missionsApi,
  participationsApi,
  notificationsApi,
  referencesApi,
  getImageUrl,
  type Mission,
  type Participation,
  type NotificationItem,
  type DailyCodeInfo,
} from "@/lib/api";
import DesktopDashboard from "@/components/dashboard/DesktopDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dailyCode, setDailyCode] = useState<DailyCodeInfo | null>(null);
  const [copiedMobile, setCopiedMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres mobile
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(15);

  function handleCopyMobile(codeToCopy: string) {
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    setCopiedMobile(true);
    setTimeout(() => setCopiedMobile(false), 2000);
  }

  useEffect(() => {
    Promise.all([
      participationsApi.mine(),
      missionsApi.list(),
      notificationsApi.list().catch(() => []),
      referencesApi.getDailyCode().catch(() => null),
    ])
      .then(([parts, miss, notifs, code]) => {
        setParticipations(parts);
        setMissions(miss);
        setNotifications(notifs);
        setDailyCode(code);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Erreur de chargement.")
      )
      .finally(() => setLoading(false));
  }, []);

  const active = participations.find(
    (p) => p.statut === "en_cours" || p.statut === "contrat_accepte"
  );

  const joinedIds = new Set(participations.map((p) => p.mission?.id));
  const available = missions.filter(
    (m) => !joinedIds.has(m.id) && m.statut !== "terminee"
  );

  const joursValides = participations.reduce(
    (sum, p) => sum + (p.etapesCompletees ?? 0),
    0
  );

  const unreadCount = notifications.filter((n) => !n.lu).length;

  const categories = ["Toutes", "Fintech", "Mobile", "UI/UX", "Paiement"];

  const daysList = [
    { day: "Dim", date: 13 },
    { day: "Lun", date: 14 },
    { day: "Mar", date: 15 },
    { day: "Mer", date: 16 },
    { day: "Jeu", date: 17 },
    { day: "Ven", date: 18 },
    { day: "Sam", date: 19 },
  ];

  // Filtrage des missions
  const filteredAvailable = available.filter((m) => {
    const matchSearch =
      m.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.application.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "Toutes" ||
      m.titre.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      m.description.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 size={26} className="animate-spin text-brand-orange" />
        <span className="text-xs font-semibold text-slate-400">
          Chargement de votre espace testeur...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* ======================================================== */}
      {/* =================== VERSION MOBILE ==================== */}
      {/* ======================================================== */}
      <div className="block lg:hidden min-h-screen bg-[#F8F9FB] px-4 pt-6 pb-28">
        {/* Top App Bar (Inspirée de la maquette Mobile Image 2) */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/profil" className="relative block group">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.prenom || "Profil"}
                  className="h-12 w-12 rounded-2xl object-cover border-2 border-white shadow-md shadow-navy-950/10"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-navy-900 to-navy-800 font-display text-base font-bold text-white shadow-md shadow-navy-950/10">
                  {(user?.prenom?.[0] || "T").toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </Link>
            <div>
              <p className="text-xs text-slate-400 font-medium">Bonjour 👋</p>
              <h2 className="font-display text-base font-bold text-navy-900 leading-tight">
                {user?.prenom} {user?.nom}
              </h2>
            </div>
          </div>

          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition hover:text-navy-900"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* Barre de Recherche */}
        <div className="relative mt-2">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher une mission, application..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-11 pr-4 text-xs font-medium text-navy-900 placeholder:text-slate-400 shadow-xs focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>

        {/* Calendrier Hebdomadaire en Pilules (Inspiré de l'Image 2) */}
        <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
          {daysList.map((d) => {
            const isSelected = selectedDay === d.date;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className={`flex flex-col items-center justify-center rounded-2xl px-3 py-2.5 transition-all ${
                  isSelected
                    ? "bg-brand-orange text-white shadow-md shadow-brand-orange/25 scale-105"
                    : "bg-white text-slate-600 border border-slate-100 shadow-xs"
                }`}
              >
                <span className="text-[10px] font-medium opacity-80">{d.day}</span>
                <span className="mt-0.5 font-display text-sm font-bold">
                  {d.date}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pilules de Catégories */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isCat = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  isCat
                    ? "bg-navy-900 text-white shadow-xs"
                    : "bg-white text-slate-500 border border-slate-100 hover:text-navy-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3.5 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Mission active (Upcoming Schedule / Hero Card) */}
        {active && (
          <div className="mt-5 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 p-5 text-white shadow-lg shadow-navy-950/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 rounded-full bg-brand-orange/20 px-3 py-1 text-[11px] font-bold text-brand-orange">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
                Mission active
              </span>
              <span className="text-xs text-white/70 font-medium">
                {active.etapesCompletees}/{active.etapesTotal} étapes
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-1.5 backdrop-blur-sm border border-white/20 overflow-hidden">
                {active.mission?.image ? (
                  <img
                    src={getImageUrl(active.mission.image)}
                    alt={active.mission.application}
                    className="h-full w-full object-contain rounded-xl"
                  />
                ) : (
                  <span className="font-bold text-white text-base">
                    {active.mission?.application?.charAt(0).toUpperCase() || "A"}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-bold leading-snug truncate">
                  {active.mission?.titre}
                </h3>
                <p className="text-xs text-white/70 truncate">
                  <span className="font-semibold text-white">{active.mission?.application}</span> · <span className="text-white/60">{active.mission?.dureEstime || "3 jours"}</span>
                </p>
              </div>
            </div>

            {/* Jauge de progression */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-white/70 font-medium mb-1">
                <span>Progression</span>
                <span>{active.progression ?? 0}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-brand-orange transition-all duration-500"
                  style={{ width: `${active.progression ?? 0}%` }}
                />
              </div>
            </div>

            <Link
              href={`/dashboard/missions/${active.mission?.id}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-bold text-navy-900 shadow-sm transition active:scale-98"
            >
              <span>Continuer la mission</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {/* Carte Code du jour Mobile */}
        <div className="mt-4 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/20 to-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <KeyRound size={15} />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Code du jour (Missions)
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {dailyCode?.hasActiveMission ? `Jour ${dailyCode.jour}` : "Aujourd'hui"}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="font-mono text-base font-extrabold tracking-wider text-navy-900 select-all">
              {dailyCode?.code || "SAM-XXXXXX"}
            </span>
            <button
              type="button"
              onClick={() => handleCopyMobile(dailyCode?.code || "")}
              disabled={!dailyCode?.code}
              className="flex items-center gap-1 rounded-lg border border-indigo-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs transition active:scale-95 disabled:opacity-50"
            >
              {copiedMobile ? (
                <>
                  <Check size={12} className="text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copié</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            {dailyCode?.hasActiveMission && dailyCode.application
              ? `Code pour valider ${dailyCode.application} aujourd'hui`
              : "Code testeur quotidien • Renouvelé chaque jour"}
          </p>
        </div>

        {/* 2 Cartes de Métriques de test */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles size={14} className="text-brand-orange" />
              <span className="text-[11px] font-semibold">Missions rejointes</span>
            </div>
            <p className="mt-1 font-display text-base font-bold text-navy-900">
              {participations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-[11px] font-semibold">Étapes validées</span>
            </div>
            <p className="mt-1 font-display text-base font-bold text-navy-900">
              {joursValides}
            </p>
          </div>
        </div>

        {/* Section Missions disponibles (Grille façon Image 2) */}
        <div className="mt-5">
          <div className="flex items-center justify-between pb-2.5">
            <h3 className="font-display text-xs font-bold text-navy-900">
              Missions disponibles ({filteredAvailable.length})
            </h3>
            <Link
              href="/dashboard/missions"
              className="text-[11px] font-semibold text-brand-orange"
            >
              Tout voir
            </Link>
          </div>

          {filteredAvailable.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-xs">
              <p className="text-xs text-slate-400 font-medium">
                Aucune mission ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredAvailable.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/80 p-1 shadow-xs overflow-hidden">
                      {m.image ? (
                        <img
                          src={getImageUrl(m.image)}
                          alt={m.application}
                          className="h-full w-full object-contain rounded-lg"
                        />
                      ) : (
                        <span className="font-bold text-navy-900 text-xs">
                          {m.application?.charAt(0).toUpperCase() || "A"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <span className="rounded bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 font-bold text-emerald-700">
                          Android
                        </span>
                        <span className="text-slate-300">·</span>
                        <span>{m.dureEstime || `${m.duree || 3}j`}</span>
                      </div>
                      <h4 className="mt-0.5 truncate font-display text-xs font-bold text-navy-900">
                        {m.titre}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {m.application}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-[11px] text-slate-400">
                      Scénarios guidés
                    </span>
                    <Link
                      href={`/dashboard/missions/${m.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold text-navy-900 transition hover:bg-navy-900 hover:text-white"
                    >
                      <span>Participer</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* =================== VERSION PC ========================= */}
      {/* ======================================================== */}
      <div className="hidden lg:block w-full">
        <DesktopDashboard
          prenom={user?.prenom}
          nom={user?.nom}
          email={user?.email}
          photo={user?.photo}
          active={active}
          available={available}
          participations={participations}
          notifications={notifications}
          etapesValidees={joursValides}
          dailyCode={dailyCode}
        />
      </div>
    </>
  );
}
