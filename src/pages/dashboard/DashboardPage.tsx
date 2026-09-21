import { useEffect, useState } from "react";
import Link from "@/lib/router";
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
  Play,
  ExternalLink,
  Flame,
  Lock,
  Check,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  missionsApi,
  participationsApi,
  notificationsApi,
  referencesApi,
  getImageUrl,
  getApplicationPlayStoreUrl,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres mobile
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [missionTab, setMissionTab] = useState<"toutes" | "en_cours" | "disponibles">("toutes");

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

  const completedCount = participations.filter(
    (p) => p.statut === "terminee"
  ).length;

  const totalRemunerationEstimee = participations.reduce((acc, p) => {
    if (p.statut === "refusee" || p.statut === "abandonnee") return acc;
    const rem = parseFloat(String(p.mission?.remuneration || 0));
    return acc + (isNaN(rem) ? 0 : rem);
  }, 0);

  const totalRemunerationGagnee = participations.reduce((acc, p) => {
    if (p.statut === "terminee" || p.statut === "remuneration_payee") {
      const rem = parseFloat(String(p.mission?.remuneration || 0));
      return acc + (isNaN(rem) ? 0 : rem);
    }
    return acc;
  }, 0);

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

  // Filtrage combiné par onglet & recherche pour le mobile (Inspiration Image 4)
  const displayMissions = missions.filter((m) => {
    const isJoined = joinedIds.has(m.id);
    if (missionTab === "en_cours" && !isJoined) return false;
    if (missionTab === "disponibles" && isJoined) return false;
    const matchSearch =
      m.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.application.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "Toutes" ||
      m.titre.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(selectedCategory.toLowerCase());
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
      <div className="block lg:hidden min-h-screen bg-[#F8F9FB] px-4 pt-5 pb-28">
        <div className="max-w-md mx-auto space-y-4">
          {/* Top Bar (Inspiration Image 4 : Hello Mickel, Dashboard) */}
          <div className="flex items-center justify-between pb-0.5">
            <div>
              <p className="text-xs text-slate-400 font-medium">Bonjour 👋</p>
              <h1 className="font-display text-lg font-extrabold text-navy-900 leading-tight">
                {user?.prenom} {user?.nom}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/notifications"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-2xs transition active:scale-95 hover:bg-slate-50"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white shadow-xs">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link href="/dashboard/profil" className="relative block">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.prenom || "Profil"}
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white shadow-sm">
                    {(user?.prenom?.[0] || "T").toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
              </Link>
            </div>
          </div>

          {/* Carte Rémunération & Performances (Inspiration Dribbble Image 4 : Earnings Card) */}
          <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-b from-[#DCEAFE] via-[#EFF6FF] to-white p-4.5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900/70">
                  Tableau de Bord
                </span>
                <h2 className="font-display text-xl font-extrabold text-navy-900 leading-none mt-0.5">
                  Rémunération
                </h2>
              </div>
              <span className="rounded-full bg-white/80 border border-blue-200/80 px-2.5 py-1 text-[11px] font-bold text-blue-900 shadow-2xs">
                {participations.length} test{participations.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Grille 2x2 façon Image 4 */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Gains validés (Available) */}
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Validé</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Wallet size={13} />
                  </span>
                </div>
                <p className="mt-1.5 font-display text-base font-extrabold text-navy-900">
                  {totalRemunerationGagnee.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-slate-500">FCFA</span>
                </p>
              </div>

              {/* 2. Gains en attente (Pending) */}
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">À débloquer</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Lock size={13} />
                  </span>
                </div>
                <p className="mt-1.5 font-display text-base font-extrabold text-navy-900">
                  {totalRemunerationEstimee.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-slate-500">FCFA</span>
                </p>
              </div>

              {/* 3. Étapes validées */}
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Étapes</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <CheckCircle2 size={13} />
                  </span>
                </div>
                <p className="mt-1.5 font-display text-base font-extrabold text-navy-900">
                  {active ? `${active.etapesCompletees || 0}/${active.etapesTotal || 12}` : `${joursValides}`} <span className="text-[10px] font-normal text-slate-500">jours</span>
                </p>
              </div>

              {/* 4. Série active */}
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Série</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-brand-orange">
                    <Flame size={13} className="fill-brand-orange" />
                  </span>
                </div>
                <p className="mt-1.5 font-display text-base font-extrabold text-brand-orange">
                  {Math.max(1, joursValides)} <span className="text-[10px] font-normal text-slate-500">jours</span>
                </p>
              </div>
            </div>

            {/* Test actif (Intégration épurée sans bloc sombre massif) */}
            {active ? (
              <div className="rounded-2xl border border-blue-100 bg-white/95 p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">
                    Test actif · Jour {(active.etapesCompletees ?? 0) + 1} sur {active.etapesTotal || 12}
                  </span>
                  <span className="text-[11px] font-bold text-navy-900">
                    {active.progression ?? 0}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 p-1 overflow-hidden">
                    {active.mission?.image ? (
                      <img
                        src={getImageUrl(active.mission.image)}
                        alt={active.mission.application}
                        className="h-full w-full object-contain rounded-lg"
                      />
                    ) : (
                      <span className="font-bold text-navy-900 text-xs">
                        {active.mission?.application?.charAt(0).toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xs font-bold text-navy-900 truncate">
                      {active.mission?.titre}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {active.mission?.application} · <span className="text-emerald-600 font-semibold">Android</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={getApplicationPlayStoreUrl(active.mission)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-[11px] font-bold text-white transition active:scale-95 hover:bg-emerald-700 shadow-2xs"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Google Play</span>
                  </a>

                  <Link
                    href={`/dashboard/missions/${active.mission?.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-[11px] font-bold text-white transition active:scale-95 hover:bg-blue-700 shadow-2xs"
                  >
                    <span>Tester Jour {(active.etapesCompletees ?? 0) + 1}</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/dashboard/missions"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition active:scale-95 hover:bg-blue-700"
              >
                <span>Rejoindre une mission de test</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>

          {/* Section Missions & Activités (Inspiration Dribbble Image 4 : Transactions & Tabs) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-navy-900">
                Missions
              </h3>
              <Link
                href="/dashboard/missions"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Tout voir
              </Link>
            </div>

            {/* Onglets segmentés façon Image 4 ("All", "Earnings", "Withdrawals") */}
            <div className="grid grid-cols-3 rounded-2xl bg-slate-200/70 p-1 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setMissionTab("toutes")}
                className={`py-1.5 rounded-xl transition ${
                  missionTab === "toutes" ? "bg-white text-navy-900 shadow-2xs" : "hover:text-navy-900"
                }`}
              >
                Toutes
              </button>
              <button
                type="button"
                onClick={() => setMissionTab("en_cours")}
                className={`py-1.5 rounded-xl transition ${
                  missionTab === "en_cours" ? "bg-white text-navy-900 shadow-2xs" : "hover:text-navy-900"
                }`}
              >
                Mes tests ({participations.length})
              </button>
              <button
                type="button"
                onClick={() => setMissionTab("disponibles")}
                className={`py-1.5 rounded-xl transition ${
                  missionTab === "disponibles" ? "bg-white text-navy-900 shadow-2xs" : "hover:text-navy-900"
                }`}
              >
                Disponibles ({available.length})
              </button>
            </div>

            {/* Barre de recherche discrète */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Rechercher une mission, application..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200/80 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-navy-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Liste des cartes façon transactions */}
            <div className="space-y-2.5">
              {displayMissions.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-xs text-slate-400">
                  Aucune mission ne correspond à vos critères.
                </div>
              ) : (
                displayMissions.map((m) => {
                  const isJoined = joinedIds.has(m.id);
                  const part = participations.find((p) => p.mission?.id === m.id);

                  return (
                    <Link
                      key={m.id}
                      href={`/dashboard/missions/${m.id}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-2xs transition active:scale-98 hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/70 p-1 overflow-hidden">
                          {m.image ? (
                            <img
                              src={getImageUrl(m.image)}
                              alt={m.application}
                              className="h-full w-full object-contain rounded-xl"
                            />
                          ) : (
                            <span className="font-bold text-navy-900 text-xs">
                              {m.application?.charAt(0).toUpperCase() || "A"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display text-xs font-bold text-navy-900 truncate">
                            {m.titre}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {m.application} · <span className="text-slate-500 font-medium">{m.dureEstime || "12j"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right ml-2">
                        <span className="font-display text-xs font-bold text-emerald-600 block">
                          +{parseFloat(String(m.remuneration || 0)).toLocaleString("fr-FR")} FCFA
                        </span>
                        <span className={`text-[10px] font-bold ${
                          isJoined ? "text-blue-600" : "text-slate-400"
                        }`}>
                          {isJoined ? (part?.progression ? `${part.progression}%` : "En cours") : "Participer >"}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
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
