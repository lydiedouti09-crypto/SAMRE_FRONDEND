import { useEffect, useState } from "react";
import Link from "@/lib/router";
import {
  Loader2,
  ChevronRight,
  Search,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import {
  missionsApi,
  participationsApi,
  getImageUrl,
  type Mission,
  type Participation,
} from "@/lib/api";
import { AppLogoImage } from "@/components/ui/AppLogoImage";

// Couleurs de badges et gradients selon l'application
function getAppBadgeStyle(appName: string) {
  const name = appName.toLowerCase();
  if (name.includes("wave")) {
    return {
      gradient: "from-sky-500 to-cyan-600",
      letter: "W",
      tagColor: "bg-cyan-100 text-cyan-800",
    };
  }
  if (name.includes("djamo")) {
    return {
      gradient: "from-indigo-600 to-blue-700",
      letter: "D",
      tagColor: "bg-indigo-100 text-indigo-800",
    };
  }
  if (name.includes("orange")) {
    return {
      gradient: "from-amber-500 to-orange-600",
      letter: "O",
      tagColor: "bg-orange-100 text-orange-800",
    };
  }
  if (name.includes("flypoint")) {
    return {
      gradient: "from-purple-600 to-indigo-600",
      letter: "F",
      tagColor: "bg-purple-100 text-purple-700",
    };
  }
  if (name.includes("zogbe")) {
    return {
      gradient: "from-sky-600 to-blue-700",
      letter: "Z",
      tagColor: "bg-purple-100 text-purple-700",
    };
  }
  return {
    gradient: "from-slate-700 to-slate-900",
    letter: appName.charAt(0).toUpperCase() || "A",
    tagColor: "bg-slate-100 text-slate-700",
  };
}

function getMissionCategory(m?: Mission): string {
  if (!m) return "Application";
  const text = `${m.titre} ${m.application} ${m.description || ""}`.toLowerCase();
  if (text.includes("wave") || text.includes("orange") || text.includes("moov") || text.includes("paiement") || text.includes("money") || text.includes("transfert")) {
    return "Paiement Mobile";
  }
  if (text.includes("banque") || text.includes("bank") || text.includes("djamo") || text.includes("crédit") || text.includes("prêt") || text.includes("compte") || text.includes("fintech")) {
    return "Fintech & Banque";
  }
  if (text.includes("commerce") || text.includes("boutique") || text.includes("achat") || text.includes("livraison") || text.includes("yassir") || text.includes("commande")) {
    return "E-Commerce";
  }
  return "Utilitaires & Services";
}

export default function MissionsPage() {
  const [tab, setTab] = useState<"available" | "mine">("mine");
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([participationsApi.mine(), missionsApi.list()])
      .then(([p, m]) => {
        setParticipations(p || []);
        setMissions(m || []);
        // Si l'utilisateur n'a pas de participation, afficher 'available' par défaut
        if (p && p.length === 0) {
          setTab("available");
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const joinedIds = new Set(participations.map((p) => p.mission?.id));
  const available = missions.filter((m) => !joinedIds.has(m.id) && m.statut !== "terminee");

  const filteredAvailable = available.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.titre.toLowerCase().includes(q) ||
      (m.application && m.application.toLowerCase().includes(q))
    );
  });

  const filteredParticipations = participations.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const m = p.mission;
    return (
      m?.titre.toLowerCase().includes(q) ||
      (m?.application && m.application.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 text-slate-800">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 1. VUE MOBILE (Uniquement sur écrans mobiles < lg)                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden px-4 pt-4 space-y-5 max-w-md mx-auto">
        <div className="pt-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <Briefcase size={20} />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight text-[#0F172A]">
              Mes missions
            </h1>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1.5 leading-snug">
            Découvrez toutes les applications disponibles et choisissez celle qui vous convient.
          </p>
        </div>

        {/* Onglets Pilules Mobile */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl w-full">
          <button
            onClick={() => setTab("available")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs transition-all ${
              tab === "available"
                ? "bg-white text-navy-900 font-extrabold shadow-xs"
                : "text-slate-600 hover:text-slate-900 font-semibold"
            }`}
          >
            <span>Disponibles</span>
            <span
              className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                tab === "available"
                  ? "bg-brand-orange text-white"
                  : "bg-slate-300/80 text-slate-700"
              }`}
            >
              {available.length}
            </span>
          </button>

          <button
            onClick={() => setTab("mine")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs transition-all ${
              tab === "mine"
                ? "bg-white text-navy-900 font-extrabold shadow-xs"
                : "text-slate-600 hover:text-slate-900 font-semibold"
            }`}
          >
            <span>En cours</span>
            <span
              className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                tab === "mine"
                  ? "bg-brand-orange text-white"
                  : "bg-slate-300/80 text-slate-700"
              }`}
            >
              {participations.length}
            </span>
          </button>
        </div>

        {/* Cartes Mobile Squircle */}
        {loading ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-brand-orange" />
            <p className="text-xs text-slate-400">Chargement des missions...</p>
          </div>
        ) : tab === "available" ? (
          available.length === 0 ? (
            <div className="rounded-[22px] border border-slate-100 bg-white p-8 text-center shadow-2xs">
              <p className="text-xs font-semibold text-slate-500">
                Aucune application disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {available.map((m) => {
                const badge = getAppBadgeStyle(m.application || m.titre);
                const duration = m.dureEstime ? `${m.dureEstime} jours` : "14 jours";
                const appName = m.application || m.titre;

                return (
                  <Link
                    key={m.id}
                    href={`/dashboard/missions/${m.id}`}
                    className="flex items-center justify-between gap-3.5 rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/90 transition active:scale-98 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <AppLogoImage
                        src={m.image}
                        alt={appName}
                        name={appName}
                        className="h-14 w-14 min-w-[56px] rounded-2xl bg-white border border-slate-100 p-1 shadow-2xs"
                        fallbackClassName={`bg-gradient-to-br ${badge.gradient} text-white font-extrabold text-lg`}
                      />

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-[14px] font-extrabold text-[#0F172A] leading-tight truncate">
                            {appName}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6FBF5] px-2 py-0.5 text-[10px] font-bold text-[#0D9488] border border-[#99F6E4]/50">
                            <span>✓</span>
                            <span>Disponible</span>
                          </span>
                        </div>

                        <p className="text-[11px] font-medium text-slate-400 truncate">
                          {getMissionCategory(m)}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <span>📅</span>
                          <span>{duration}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-slate-300 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )
        ) : (
          participations.length === 0 ? (
            <div className="rounded-[22px] border border-slate-100 bg-white p-8 text-center shadow-2xs">
              <p className="text-xs font-semibold text-slate-500">
                Vous n&apos;avez aucune mission en cours.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {participations.map((p) => {
                const m = p.mission;
                if (!m) return null;
                const badge = getAppBadgeStyle(m.application || m.titre);
                const currentDay = (p.etapesCompletees || 0) + 1;
                const totalDays = p.etapesTotal || (m.dureEstime ? parseInt(String(m.dureEstime)) || 14 : 14);
                const appName = m.application || m.titre;

                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/missions/${m.id}`}
                    className="flex items-center justify-between gap-3.5 rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/90 transition active:scale-98 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <AppLogoImage
                        src={m.image}
                        alt={appName}
                        name={appName}
                        className="h-14 w-14 min-w-[56px] rounded-2xl bg-white border border-slate-100 p-1 shadow-2xs"
                        fallbackClassName={`bg-gradient-to-br ${badge.gradient} text-white font-extrabold text-lg`}
                      />

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-[14px] font-extrabold text-[#0F172A] leading-tight truncate">
                            {appName}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6FBF5] px-2 py-0.5 text-[10px] font-bold text-[#0D9488] border border-[#99F6E4]/50">
                            <span>✓</span>
                            <span>En cours</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-700">
                            Jour {currentDay} / {totalDays}
                          </span>
                        </div>

                        <p className="text-[11px] font-medium text-slate-400 truncate">
                          {getMissionCategory(m)}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <span>📅</span>
                          <span>{m.dureEstime ? `${m.dureEstime} jours` : "14 jours"}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-slate-300 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 2. VUE DESKTOP (Harmonisée avec la page Historique)                     */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block max-w-6xl mx-auto px-8 pt-8 pb-16">
        {/* Header Desktop (Titre à gauche avec icône comme Historique, Onglets à droite) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Briefcase size={20} />
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight text-navy-950">
                Missions de test
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Explorez les applications partenaires, suivez les scénarios et validez chaque étape.
            </p>
          </div>

          {/* Onglets Desktop style Image 1 */}
          <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setTab("available")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === "available"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Missions disponibles</span>
              <span
                className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-black ${
                  tab === "available"
                    ? "bg-brand-orange text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {available.length}
              </span>
            </button>

            <button
              onClick={() => setTab("mine")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === "mine"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Mes missions</span>
              <span
                className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-black ${
                  tab === "mine"
                    ? "bg-brand-orange text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {participations.length}
              </span>
            </button>
          </div>
        </div>

        {/* Barre de Recherche Desktop (SANS les catégories entourées en bleu) */}
        <div className="mb-8">
          <div className="relative w-full max-w-xl">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une mission, une application..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-xs focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* Liste Compacte Desktop (1 ligne par application) */}
        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-2">
            <Loader2 size={26} className="animate-spin text-brand-orange" />
            <p className="text-xs text-slate-400">Chargement des missions...</p>
          </div>
        ) : tab === "available" ? (
          filteredAvailable.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
              <p className="text-sm font-medium text-slate-500">
                {searchQuery ? "Aucune mission ne correspond à votre recherche." : "Aucune mission disponible pour le moment."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredAvailable.map((m) => {
                const badge = getAppBadgeStyle(m.application || m.titre);
                const appName = m.application || m.titre;
                const totalSteps = m.dureEstime ? parseInt(String(m.dureEstime)) || 14 : 14;

                return (
                  <div
                    key={m.id}
                    className="group flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3.5 shadow-2xs border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all duration-150"
                  >
                    {/* Gauche : Icône + Titre & Badges */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <AppLogoImage
                        src={m.image}
                        alt={appName}
                        name={appName}
                        className="h-11 w-11 shrink-0 rounded-xl bg-slate-50 border border-slate-200/80 p-1 shadow-2xs"
                        imageClassName="h-full w-full object-contain rounded-lg"
                        fallbackClassName={`bg-gradient-to-br ${badge.gradient} text-white font-extrabold text-sm`}
                        roundedClassName="rounded-lg"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${badge.tagColor}`}>
                            {appName}
                          </span>
                          <h3 className="font-display text-sm font-bold text-[#0F172A] truncate">
                            Tester l&apos;application {appName}
                          </h3>
                          <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            Disponible
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          0 sur {totalSteps} étapes • Nouvelle opportunité
                        </p>
                      </div>
                    </div>

                    {/* Centre : Barre de progression compacte */}
                    <div className="hidden md:flex flex-col gap-1 w-44 shrink-0">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Progression</span>
                        <span>0%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-brand-orange rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>

                    {/* Droite : Bouton d'action */}
                    <div className="shrink-0">
                      <Link
                        href={`/dashboard/missions/${m.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors"
                      >
                        <span>Démarrer le test</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          filteredParticipations.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
              <p className="text-sm font-medium text-slate-500">
                {searchQuery ? "Aucune mission en cours ne correspond à votre recherche." : "Vous n'avez aucune mission en cours actuellement."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredParticipations.map((p) => {
                const m = p.mission;
                if (!m) return null;
                const badge = getAppBadgeStyle(m.application || m.titre);
                const appName = m.application || m.titre;
                const completed = p.etapesCompletees || 0;
                const totalSteps = p.etapesTotal || (m.dureEstime ? parseInt(String(m.dureEstime)) || 14 : 14);
                const progressPct = Math.min(100, Math.round((completed / totalSteps) * 100));

                return (
                  <div
                    key={p.id}
                    className="group flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3.5 shadow-2xs border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all duration-150"
                  >
                    {/* Gauche : Icône + Titre & Badges */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <AppLogoImage
                        src={m.image}
                        alt={appName}
                        name={appName}
                        className="h-11 w-11 shrink-0 rounded-xl bg-slate-50 border border-slate-200/80 p-1 shadow-2xs"
                        imageClassName="h-full w-full object-contain rounded-lg"
                        fallbackClassName={`bg-gradient-to-br ${badge.gradient} text-white font-extrabold text-sm`}
                        roundedClassName="rounded-lg"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${badge.tagColor}`}>
                            {appName}
                          </span>
                          <h3 className="font-display text-sm font-bold text-[#0F172A] truncate">
                            Tester l&apos;application {appName}
                          </h3>
                          <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                            En cours
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {completed} sur {totalSteps} étapes validées • Session active
                        </p>
                      </div>
                    </div>

                    {/* Centre : Barre de progression */}
                    <div className="hidden md:flex flex-col gap-1 w-44 shrink-0">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Progression</span>
                        <span className="text-brand-orange">{progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-orange rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Droite : Bouton d'action */}
                    <div className="shrink-0">
                      <Link
                        href={`/dashboard/missions/${m.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors"
                      >
                        <span>Continuer le test</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
