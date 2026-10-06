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
    const dailyRate = parseFloat(String(p.mission?.remuneration || 0));
    const totalDays = p.mission?.applicationEntity?.dureeJoursDefaut || p.etapesTotal || 14;
    return p.statut === "remuneration_payee" || isNaN(dailyRate)
      ? acc
      : acc + dailyRate * totalDays;
  }, 0);

  const totalRemunerationGagnee = participations.reduce((acc, p) => {
    const dailyRate = parseFloat(String(p.mission?.remuneration || 0));
    const completedDays = Math.max(p.etapesCompletees || 0, new Set(p.joursValides || []).size);
    return acc + (isNaN(dailyRate) ? 0 : dailyRate * completedDays);
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
      <div className="block lg:hidden min-h-screen bg-[#F8FAFC] px-4 pt-1 pb-24">
        <div className="max-w-md mx-auto space-y-2.5">
          {/* 1. Header Supérieur Mobile (Logo SAMRE à gauche + Cloche & Avatar à droite) */}
          <div className="flex items-center justify-between pt-1 pb-0.5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/ChatGPT Image 5 oct. 2026, 12_23_50.png"
                alt="Logo SAMRE"
                className="h-9 w-9 object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </Link>

            <div className="flex items-center gap-2">
              {/* Cloche de notifications avec point rouge */}
              <Link
                href="/dashboard/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-2xs border border-slate-100 transition active:scale-95"
              >
                <Bell size={18} className="text-slate-700" />
                {unreadCount > 0 ? (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                ) : (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </Link>

              {/* Avatar Utilisateur */}
              <Link href="/dashboard/profil" className="relative block">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.prenom || "Profil"}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-purple-200 shadow-2xs"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9D5FF] text-[#6B21A8] font-extrabold text-xs ring-2 ring-purple-200 shadow-2xs">
                    {(user?.prenom?.[0] || "P").toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* 2. Salutation Bonjour */}
          <div className="pt-0">
            <h1 className="font-display text-[21px] font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Bonjour, {user?.prenom || user?.nom || "pabougante"}
            </h1>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">
              Voici les tests à réaliser aujourd'hui.
            </p>
          </div>

          {/* 3. Carte Principale de Test Dégradée (Style Épuré sans téléphone 3D) */}
          {(() => {
            const activeMission = active?.mission || missions[0];
            const currentDay = (active?.etapesCompletees ?? 0) + 1;
            const totalDays = active?.etapesTotal || activeMission?.dureEstime ? parseInt(String(activeMission?.dureEstime)) || 14 : 14;
            const progressPercent = active?.progression ?? Math.round((currentDay / totalDays) * 100);
            const appName = activeMission?.application || activeMission?.titre || "SnapClean";
            const appDesc = activeMission?.description || "Application de nettoyage et d'optimisation pour Android";
            const playStoreUrl = getApplicationPlayStoreUrl(activeMission) || "https://play.google.com/store/apps";

            return (
              <div
                className="relative overflow-hidden rounded-[24px] p-4 text-white shadow-[0_12px_32px_-6px_rgba(99,102,241,0.28)]"
                style={{
                  background: 'linear-gradient(135deg, #818CF8 0%, #60A5FA 45%, #93C5FD 100%)',
                }}
              >
                {/* Lueur d'arrière-plan */}
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />

                {/* Ligne Supérieure : Badge Statut + Jours/Progression */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF9C3]/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-[#854D0E] shadow-2xs">
                    <span className="text-[10px]">✨</span>
                    <span>{active ? "En cours" : "Disponible"}</span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold tracking-wide text-white/95">
                      Jour {currentDay} / {totalDays}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1.5 w-16 rounded-full bg-white/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(7, progressPercent))}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white/90">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corps de la carte : Icone App Propre + Titre + Description pleine largeur */}
                <div className="flex items-center gap-3.5 my-3.5">
                  {/* Icone App avec fond blanc arrondi et propre */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm border border-white/60 overflow-hidden">
                    {activeMission?.image ? (
                      <img
                        src={getImageUrl(activeMission.image)}
                        alt={appName}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 font-display text-lg font-black text-white">
                        {appName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[17px] font-extrabold text-white leading-tight truncate">
                      {appName}
                    </h2>
                    <p className="text-[11.5px] text-white/95 leading-snug line-clamp-2 mt-0.5 font-normal">
                      {appDesc}
                    </p>
                  </div>
                </div>

                {/* Boutons d'Action : Google Play + Continuer le test */}
                <div className="flex items-center gap-2 pt-0.5">
                  {/* Bouton Google Play blanc arrondi */}
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white py-2 px-3 text-[11px] font-extrabold text-[#0F172A] shadow-sm transition active:scale-95 hover:bg-slate-50"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3.609 1.814C3.253 2.19 3 2.793 3 3.593v16.814c0 .8.253 1.403.609 1.779l.092.088 9.42-9.42v-.222L3.701 1.726l-.092.088z" fill="#00D2FF" />
                      <path d="M16.275 15.997l-3.154-3.154v-.222l3.154-3.154.07.04 3.738 2.124c1.068.606 1.068 1.6 0 2.207l-3.738 2.124-.07.035z" fill="#FFD200" />
                      <path d="M16.345 15.962L13.12 12.737 3.609 22.247c.353.376.945.422 1.623.036l11.113-6.321" fill="#FF3A44" />
                      <path d="M16.345 8.038L5.232 1.717c-.678-.386-1.27-.34-1.623.036l9.512 9.51 3.224-3.225" fill="#00E676" />
                    </svg>
                    <span>Google Play</span>
                    <ArrowRight size={11} />
                  </a>

                  {/* Bouton Sombre Continuer le test */}
                  <Link
                    href={activeMission ? `/dashboard/missions/${activeMission.id}` : "/dashboard/missions"}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#0B1727] py-2 px-3 text-[11px] font-extrabold text-white shadow-md shadow-slate-950/20 transition active:scale-95 hover:bg-[#1E293B]"
                  >
                    <span>Continuer le test</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* 4. Section "À faire aujourd'hui" (3 étapes guidées façon Maquette) */}
          <div className="space-y-2.5 pt-1">
            <div>
              <h2 className="font-display text-base font-extrabold text-[#0F172A] leading-tight">
                À faire aujourd’hui
              </h2>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                3 étapes pour valider votre mission.
              </p>
            </div>

            {/* Liste des 3 étapes avec pastilles numérotées et ligne de connexion */}
            <div className="relative space-y-3 pt-1">
              {/* Ligne verticale de connexion en arrière-plan */}
              <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-slate-200/80 -z-0" />

              {/* Étape 1 : Ouvrir l'application */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white font-extrabold text-xs shadow-md shadow-amber-500/20 ring-4 ring-[#F8FAFC]">
                  1
                </div>

                <a
                  href={getApplicationPlayStoreUrl(active?.mission || missions[0]) || "https://play.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100 transition active:scale-98 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/70">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                        Ouvrir l’application
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                        Lancez {active?.mission?.application || "SnapClean"} et explorez l'application.
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 shrink-0" />
                </a>
              </div>

              {/* Étape 2 : Réaliser le scénario */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 ring-4 ring-[#F8FAFC]">
                  2
                </div>

                <Link
                  href={active?.mission ? `/dashboard/missions/${active.mission.id}` : "/dashboard/missions"}
                  className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100 transition active:scale-98 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/70 font-display font-extrabold text-base">
                      2
                    </div>
                    <div>
                      <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                        Réaliser le scénario
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                        Suivez les instructions du test.
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 shrink-0" />
                </Link>
              </div>

              {/* Étape 3 : Valider le code du jour */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 ring-4 ring-[#F8FAFC]">
                  3
                </div>

                <Link
                  href={active?.mission ? `/dashboard/missions/${active.mission.id}` : "/dashboard/missions"}
                  className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100 transition active:scale-98 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/70">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                        Valider le code du jour
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                        Entrez le code dans l’application.
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 shrink-0" />
                </Link>
              </div>
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
