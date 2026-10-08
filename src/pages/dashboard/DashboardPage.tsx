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
import UserAvatar from "@/components/ui/UserAvatar";

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

  const pending = participations.find((p) => p.statut === "en_attente");

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
        <div className="max-w-md mx-auto space-y-3.5">
          {/* 1. Header Supérieur Mobile (Logo SAMRE + Cloche + Avatar) */}
          <div className="flex items-center justify-between pt-1 pb-0.5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/ChatGPT Image 5 oct. 2026, 12_23_50.png"
                alt="Logo SAMRE"
                className="h-9 w-9 object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </Link>

            <div className="flex items-center gap-2">
              {/* Cloche de notifications */}
              <Link
                href="/dashboard/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-2xs border border-slate-100 transition active:scale-95"
              >
                <Bell size={18} className="text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </Link>

              {/* Avatar Utilisateur sécurisé */}
              <Link href="/dashboard/profil" className="relative block">
                <UserAvatar
                  photo={user?.photo}
                  prenom={user?.prenom}
                  nom={user?.nom}
                  size="sm"
                  ringClassName="ring-2 ring-purple-200 shadow-2xs"
                />
              </Link>
            </div>
          </div>

          {/* 2. Salutation contextualisée */}
          <div className="pt-0">
            <h1 className="font-display text-[21px] font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Bonjour, {user?.prenom || user?.nom || "Testeur"}
            </h1>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">
              {active
                ? "Voici vos tests du jour à valider."
                : pending
                  ? "Votre candidature est en cours d'examen."
                  : "Bienvenue sur votre espace de testeur d'applications."}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CAS 1 : LE TESTEUR A UNE MISSION EN COURS VALIDÉE           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {active && active.mission && (() => {
            const mission = active.mission;
            const currentDay = (active.etapesCompletees ?? 0) + 1;
            const totalDays =
              active.etapesTotal ||
              (mission.dureEstime ? parseInt(String(mission.dureEstime)) || 14 : 14);
            const progressPercent =
              active.progression ?? Math.round((currentDay / totalDays) * 100);
            const appName = mission.application || mission.titre || "Application";
            const appDesc = mission.description || "Mission de test applicatif Android";
            const playStoreUrl = getApplicationPlayStoreUrl(mission);

            return (
              <>
                {/* Carte de la mission en cours */}
                <div
                  className="relative overflow-hidden rounded-[24px] p-4 text-white shadow-[0_12px_32px_-6px_rgba(99,102,241,0.28)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #818CF8 0%, #60A5FA 45%, #93C5FD 100%)",
                  }}
                >
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF9C3]/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-[#854D0E] shadow-2xs">
                      <span className="text-[10px]">✨</span>
                      <span>En cours</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold tracking-wide text-white/95">
                        Jour {currentDay} / {totalDays}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-16 rounded-full bg-white/30 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-white transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(7, progressPercent))}%`,
                            }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-white/90">
                          {progressPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 my-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm border border-white/60 overflow-hidden">
                      {mission.image ? (
                        <img
                          src={getImageUrl(mission.image)}
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

                  <div className="flex items-center gap-2 pt-0.5">
                    <a
                      href={playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white py-2 px-3 text-[11px] font-extrabold text-[#0F172A] shadow-sm transition active:scale-95 hover:bg-slate-50"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M3.609 1.814C3.253 2.19 3 2.793 3 3.593v16.814c0 .8.253 1.403.609 1.779l.092.088 9.42-9.42v-.222L3.701 1.726l-.092.088z" fill="#00D2FF" />
                        <path d="M16.275 15.997l-3.154-3.154v-.222l3.154-3.154.07.04 3.738 2.124c1.068.606 1.068 1.6 0 2.207l-3.738 2.124-.07.035z" fill="#FFD200" />
                        <path d="M16.345 15.962L13.12 12.737 3.609 22.247c.353.376.945.422 1.623.036l11.113-6.321" fill="#FF3A44" />
                        <path d="M16.345 8.038L5.232 1.717c-.678-.386-1.27-.34-1.623.036l9.512 9.51 3.224-3.225" fill="#00E676" />
                      </svg>
                      <span>Google Play</span>
                      <ArrowRight size={11} />
                    </a>

                    <Link
                      href={`/dashboard/missions/${mission.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#0B1727] py-2 px-3 text-[11px] font-extrabold text-white shadow-md shadow-slate-950/20 transition active:scale-95 hover:bg-[#1E293B]"
                    >
                      <span>Continuer le test</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Section "À faire aujourd'hui" */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <h2 className="font-display text-base font-extrabold text-[#0F172A] leading-tight">
                      À faire aujourd’hui
                    </h2>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                      3 étapes pour valider votre journée de test.
                    </p>
                  </div>

                  <div className="relative space-y-3 pt-1">
                    <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-slate-200/80 -z-0" />

                    {/* Étape 1 */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white font-extrabold text-xs shadow-md shadow-amber-500/20 ring-4 ring-[#F8FAFC]">
                        1
                      </div>
                      <a
                        href={playStoreUrl}
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
                              Lancez {appName} et explorez les écrans.
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 shrink-0" />
                      </a>
                    </div>

                    {/* Étape 2 */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 ring-4 ring-[#F8FAFC]">
                        2
                      </div>
                      <Link
                        href={`/dashboard/missions/${mission.id}`}
                        className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100 transition active:scale-98 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/70 font-display font-extrabold text-base">
                            2
                          </div>
                          <div>
                            <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                              Réaliser le scénario du jour
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                              Suivez le parcours de test demandé.
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 shrink-0" />
                      </Link>
                    </div>

                    {/* Étape 3 */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 ring-4 ring-[#F8FAFC]">
                        3
                      </div>
                      <Link
                        href={`/dashboard/missions/${mission.id}`}
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
                              Saisissez le code pour valider votre journée.
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CAS 2 : CANDIDATURE EN ATTENTE D'APPROBATION PAR L'ADMIN     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {!active && pending && pending.mission && (
            <div className="space-y-4">
              {/* Carte Candidature en cours d'examen */}
              <div
                className="relative overflow-hidden rounded-[24px] p-5 text-white shadow-[0_12px_30px_-6px_rgba(245,158,11,0.3)]"
                style={{
                  background:
                    "linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #B45309 100%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[10px] font-extrabold text-white shadow-2xs">
                    <span>⏳ Candidature envoyée</span>
                  </div>
                  <span className="text-[11px] font-bold text-white/90">
                    En attente de validation
                  </span>
                </div>

                <div className="flex items-center gap-3.5 my-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm border border-white/60 overflow-hidden">
                    {pending.mission.image ? (
                      <img
                        src={getImageUrl(pending.mission.image)}
                        alt={pending.mission.titre}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-amber-500 font-display text-lg font-black text-white">
                        {(pending.mission.application || pending.mission.titre || "M").charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[17px] font-extrabold text-white leading-tight truncate">
                      {pending.mission.titre}
                    </h2>
                    <p className="text-[11.5px] text-white/90 leading-snug line-clamp-2 mt-0.5">
                      Rémunération :{" "}
                      <strong className="text-white">
                        {pending.mission.remuneration || "5 000"} FCFA
                      </strong>{" "}
                      pour 14 jours de test.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/95 leading-relaxed bg-black/15 rounded-2xl p-3 backdrop-blur-xs border border-white/10">
                  Votre profil est actuellement en cours d'examen par l'administrateur. Dès son approbation, vos 14 jours de test débuteront automatiquement ici.
                </p>

                <div className="pt-3">
                  <Link
                    href={`/dashboard/missions/${pending.mission.id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-white py-2.5 px-4 text-xs font-extrabold text-amber-900 shadow-sm transition active:scale-95 hover:bg-amber-50"
                  >
                    <span>Voir les détails de la mission</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Prochaines étapes (Style Timeline Stepper Image 2) */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <h2 className="font-display text-base font-extrabold text-[#0F172A] leading-tight">
                    Prochaines étapes
                  </h2>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    Le parcours pour démarrer votre mission.
                  </p>
                </div>

                <div className="relative space-y-3 pt-1">
                  <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-slate-200/80 -z-0" />

                  {/* Étape 1 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white font-extrabold text-xs shadow-md shadow-amber-500/20 ring-4 ring-[#F8FAFC]">
                      1
                    </div>
                    <div className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/70">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                            Examen de votre profil
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            Validation de votre appareil par l&apos;équipe SAMRE.
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 shrink-0" />
                    </div>
                  </div>

                  {/* Étape 2 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 ring-4 ring-[#F8FAFC]">
                      2
                    </div>
                    <div className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/70 font-display font-extrabold text-base">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                            Téléchargement de l&apos;app
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            Lien Play Store et identifiants de test fournis.
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 shrink-0" />
                    </div>
                  </div>

                  {/* Étape 3 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 ring-4 ring-[#F8FAFC]">
                      3
                    </div>
                    <div className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/70">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                            14 jours de tests & Paiement
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            Testez 5 min/jour et recevez vos gains Mobile Money.
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CAS 3 : NOUVEAU TESTEUR (AUCUNE MISSION ACCEPTÉE NI EN COURS) */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {!active && !pending && (
            <div className="space-y-4">
              {/* Carte Hero d'accueil & invitation à postuler (Design Premium avec Téléphone 3D & Récompenses) */}
              <div
                className="relative overflow-hidden rounded-[26px] p-5 text-white shadow-[0_16px_40px_-8px_rgba(11,23,39,0.35)] border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, #0B1727 0%, #0F233E 45%, #0284C7 100%)",
                }}
              >
                {/* Lumières décoratives d'ambiance */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Contenu principal : Texte à gauche + Téléphone 3D & Récompenses à droite */}
                <div className="relative flex items-center justify-between gap-3 mb-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[18px] sm:text-[20px] font-black text-white leading-tight">
                      Prêt pour vos premiers tests rémunérés ?
                    </h2>
                    <p className="text-[11.5px] text-slate-200/90 mt-1.5 leading-relaxed font-medium">
                      Postulez aux applications disponibles, réalisez vos tests quotidiens et recevez vos rémunérations garanties par Mobile Money.
                    </p>
                  </div>

                  {/* Illustration 3D Smartphone & Récompenses flottantes */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-orange-400/15 to-emerald-400/20 rounded-full blur-lg animate-pulse" />
                    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]" fill="none">
                      {/* Smartphone 3D incliné */}
                      <g transform="rotate(14 62 60)">
                        {/* Coque */}
                        <rect x="34" y="14" width="52" height="92" rx="11" fill="#0B132B" stroke="#334155" strokeWidth="2.5" />
                        {/* Écran */}
                        <rect x="37" y="18" width="46" height="84" rx="8" fill="url(#dashPhoneGrad)" />
                        {/* Barre du haut */}
                        <rect x="52" y="20" width="16" height="3" rx="1.5" fill="#1E293B" />

                        {/* Mini UI sur l'écran */}
                        <rect x="41" y="28" width="38" height="20" rx="5" fill="white" fillOpacity="0.18" />
                        <circle cx="48" cy="38" r="4.5" fill="#F97316" />
                        <rect x="55" y="34" width="20" height="3.5" rx="1.75" fill="white" />
                        <rect x="55" y="40" width="14" height="2.5" rx="1.25" fill="#94A3B8" />

                        {/* Barre de progression verte */}
                        <rect x="41" y="53" width="38" height="6.5" rx="3.25" fill="#22C55E" />
                        <rect x="41" y="63" width="30" height="3.5" rx="1.75" fill="white" fillOpacity="0.35" />
                        <rect x="41" y="70" width="34" height="3.5" rx="1.75" fill="white" fillOpacity="0.25" />
                        <rect x="41" y="77" width="22" height="3.5" rx="1.75" fill="white" fillOpacity="0.25" />

                        {/* Home indicator */}
                        <rect x="51" y="96" width="18" height="2.5" rx="1.25" fill="white" fillOpacity="0.6" />
                      </g>

                      {/* Billets de banque flottants */}
                      <g transform="translate(12, 26) rotate(-16)">
                        <rect width="28" height="16" rx="3.5" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
                        <rect x="2" y="2" width="24" height="12" rx="2" fill="#22C55E" />
                        <circle cx="14" cy="8" r="3.5" fill="#15803D" />
                        <text x="14" y="9.8" fontSize="4.5" fontWeight="900" fill="white" textAnchor="middle">FCFA</text>
                      </g>

                      <g transform="translate(74, 18) rotate(20)">
                        <rect width="24" height="14" rx="3" fill="#10B981" stroke="#064E3B" strokeWidth="1" />
                        <rect x="2" y="2" width="20" height="10" rx="2" fill="#34D399" />
                        <circle cx="12" cy="7" r="3" fill="#047857" />
                      </g>

                      {/* Pièces dorées étincelantes */}
                      <g transform="translate(18, 68)">
                        <circle cx="8" cy="8" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                        <circle cx="8" cy="8" r="6" fill="#FBBF24" />
                        <text x="8" y="11" fontSize="9" fontWeight="900" fill="#78350F" textAnchor="middle">✦</text>
                      </g>

                      <g transform="translate(86, 60)">
                        <circle cx="7" cy="7" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                        <circle cx="7" cy="7" r="5" fill="#FDE047" />
                        <text x="7" y="10" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">$</text>
                      </g>

                      {/* Étoiles & Étincelles */}
                      <path d="M22 16 L24 20 L28 22 L24 24 L22 28 L20 24 L16 22 L20 20 Z" fill="#FDE047" />
                      <path d="M102 46 L103.5 49 L106.5 50.5 L103.5 52 L102 55 L100.5 52 L97.5 50.5 L100.5 49 Z" fill="#FDE047" />
                      <path d="M78 88 L79.2 90.2 L81.5 91.5 L79.2 92.8 L78 95 L76.8 92.8 L74.5 91.5 L76.8 90.2 Z" fill="#67E8F9" />

                      <defs>
                        <linearGradient id="dashPhoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1E293B" />
                          <stop offset="60%" stopColor="#0F172A" />
                          <stop offset="100%" stopColor="#0284C7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Bouton d'action principal */}
                <div>
                  <Link
                    href="/dashboard/missions"
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#EA580C] py-3.5 px-5 text-xs font-black text-white shadow-lg shadow-orange-500/35 transition active:scale-95 hover:brightness-105 hover:shadow-orange-500/50"
                  >
                    <span>Explorer les missions disponibles</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Liste des missions ouvertes disponibles réelles */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-display text-base font-extrabold text-[#0F172A] leading-tight">
                    Missions disponibles
                  </h2>
                  <Link
                    href="/dashboard/missions"
                    className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-0.5"
                  >
                    <span>Voir tout</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {available.length > 0 ? (
                  <div className="space-y-2.5">
                    {available.slice(0, 3).map((m) => (
                      <Link
                        key={m.id}
                        href={`/dashboard/missions/${m.id}`}
                        className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100 transition active:scale-98 hover:shadow-md group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-1.5 border border-slate-100 overflow-hidden">
                            {m.image ? (
                              <img
                                src={getImageUrl(m.image)}
                                alt={m.titre}
                                className="h-full w-full object-contain rounded-xl"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 font-display text-base font-extrabold text-white">
                                {(m.application || m.titre || "A").charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-[13px] font-bold text-[#0F172A] truncate group-hover:text-brand-orange transition">
                              {m.titre}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                {m.remuneration ? `${m.remuneration} FCFA` : "Rémunéré"}
                              </span>
                              <span className="text-[10.5px] text-slate-400 font-medium">
                                {m.dureEstime || 14} jours
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pl-2 shrink-0">
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-[#0B1727] group-hover:text-white transition">
                            Postuler
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-6 text-center border border-slate-100 shadow-2xs">
                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <Smartphone size={22} />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Aucune mission ouverte pour le moment
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      De nouvelles applications seront ajoutées très prochainement.
                    </p>
                  </div>
                )}
              </div>

              {/* Guide en 3 étapes : Comment se déroulent vos tests ? (Style Timeline Stepper Image 2) */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <h2 className="font-display text-base font-extrabold text-[#0F172A] leading-tight">
                    Comment se déroulent vos tests ?
                  </h2>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    3 étapes pour démarrer et recevoir vos gains.
                  </p>
                </div>

                <div className="relative space-y-3 pt-1">
                  <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-slate-200/80 -z-0" />

                  {/* Étape 1 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white font-extrabold text-xs shadow-md shadow-amber-500/20 ring-4 ring-[#F8FAFC]">
                      1
                    </div>
                    <Link
                      href="/dashboard/missions"
                      className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100 transition active:scale-98 hover:shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/70">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[13px] font-bold text-[#0F172A] group-hover:text-brand-orange transition">
                            Postuler à une mission
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            Choisissez une application dans le catalogue.
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 shrink-0" />
                    </Link>
                  </div>

                  {/* Étape 2 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 ring-4 ring-[#F8FAFC]">
                      2
                    </div>
                    <div className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/70 font-display font-extrabold text-base">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                            Candidature à l&apos;étude
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            Votre candidature est examinée avant votre participation.
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 shrink-0" />
                    </div>
                  </div>

                  {/* Étape 3 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 ring-4 ring-[#F8FAFC]">
                      3
                    </div>
                    <div className="flex-1 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/70">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <h3 className="font-display text-[13px] font-bold text-[#0F172A]">
                            Testez & Gagnez
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            Réalisez les étapes demandées et recevez votre récompense.
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
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
