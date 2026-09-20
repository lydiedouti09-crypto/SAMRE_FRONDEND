import { useEffect, useState } from "react";
import Link from "@/lib/router";
import {
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Loader2,
  Sparkles,
  Smartphone,
  Globe,
  ExternalLink,
  Users,
} from "lucide-react";
import {
  missionsApi,
  participationsApi,
  getImageUrl,
  type Mission,
  type Participation,
} from "@/lib/api";

const STATUT_LABELS: Record<string, string> = {
  en_attente: "Candidature en attente",
  acceptee: "Candidature acceptée",
  refusee: "Candidature non retenue",
  inscrite: "Inscrite",
  contrat_accepte: "Contrat accepté",
  en_cours: "En cours de test",
  terminee: "Terminée",
  abandonnee: "Abandonnée",
};

// Couleurs de badges et gradients selon l'application
function getAppBadgeStyle(appName: string) {
  const name = appName.toLowerCase();
  if (name.includes("wave")) {
    return {
      gradient: "from-sky-500 to-cyan-600",
      textColor: "text-sky-700",
      bgColor: "bg-sky-50 border-sky-200/70",
      letter: "W",
    };
  }
  if (name.includes("djamo")) {
    return {
      gradient: "from-indigo-600 to-blue-700",
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-50 border-indigo-200/70",
      letter: "D",
    };
  }
  if (name.includes("orange")) {
    return {
      gradient: "from-amber-500 to-orange-600",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50 border-orange-200/70",
      letter: "O",
    };
  }
  if (name.includes("samre") || name.includes("samré")) {
    return {
      gradient: "from-navy-900 to-slate-800",
      textColor: "text-navy-900",
      bgColor: "bg-slate-100 border-slate-200",
      letter: "S",
    };
  }
  return {
    gradient: "from-violet-600 to-indigo-600",
    textColor: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200/70",
    letter: appName.charAt(0).toUpperCase() || "A",
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
  const [tab, setTab] = useState<"available" | "mine">("available");
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");

  useEffect(() => {
    Promise.all([participationsApi.mine(), missionsApi.list()])
      .then(([p, m]) => {
        setParticipations(p);
        setMissions(m);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const joinedIds = new Set(participations.map((p) => p.mission?.id));
  const available = missions.filter((m) => !joinedIds.has(m.id));

  const filterMission = (m?: Mission) => {
    if (!m) return false;
    const matchSearch =
      m.titre.toLowerCase().includes(search.toLowerCase()) ||
      m.application.toLowerCase().includes(search.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(search.toLowerCase());

    const category = getMissionCategory(m);
    const matchCategory =
      selectedCategory === "Toutes" || category === selectedCategory;

    return matchSearch && matchCategory;
  };

  const filteredAvailable = available.filter(filterMission);
  const filteredMine = participations.filter((p) => filterMission(p.mission));

  const categories = [
    "Toutes",
    "Fintech & Banque",
    "Paiement Mobile",
    "E-Commerce",
    "Utilitaires & Services",
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 pt-5 pb-24 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête avec navigation d'onglets épurée */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Missions de test
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Explorez les applications partenaires, suivez les scénarios et validez chaque étape.
            </p>
          </div>

          {/* Onglets pilules modernes */}
          <div className="inline-flex rounded-xl bg-slate-200/70 p-1 self-start md:self-auto">
            <button
              onClick={() => setTab("available")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                tab === "available"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              <span>Missions disponibles</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tab === "available"
                    ? "bg-brand-orange text-white"
                    : "bg-slate-300/70 text-slate-700"
                }`}
              >
                {available.length}
              </span>
            </button>

            <button
              onClick={() => setTab("mine")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                tab === "mine"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              <span>Mes missions</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tab === "mine"
                    ? "bg-brand-orange text-white"
                    : "bg-slate-300/70 text-slate-700"
                }`}
              >
                {participations.length}
              </span>
            </button>
          </div>
        </div>

        {/* Barre de recherche et filtres modernes */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher une mission, une application..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50/70 py-2 pl-9 pr-3 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-orange transition"
            />
          </div>

          {/* Filtres Catégories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-navy-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-100 bg-white">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-brand-orange" />
              <p className="text-xs text-slate-400">Chargement des missions...</p>
            </div>
          </div>
        ) : tab === "available" ? (
          filteredAvailable.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-2xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand-orange mb-3">
                <Smartphone size={22} />
              </div>
              <h3 className="text-sm font-bold text-navy-900">
                Aucune mission disponible pour le moment
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                {search
                  ? "Aucune mission ne correspond à vos critères de recherche."
                  : "Vous avez déjà rejoint toutes les missions actuellement ouvertes au test."}
              </p>
            </div>
          ) : (
            /* Grille de cartes missions au design SaaS épuré */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredAvailable.map((m) => {
                const badge = getAppBadgeStyle(m.application);
                return (
                  <div
                    key={m.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-md"
                  >
                    <div>
                      {/* Ligne du haut : Logo stylé & Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-xs overflow-hidden">
                            {m.image ? (
                              <img
                                src={getImageUrl(m.image)}
                                alt={m.application}
                                className="h-full w-full object-contain rounded-xl"
                              />
                            ) : (
                              <div
                                className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br ${badge.gradient} text-white font-bold text-base`}
                              >
                                {badge.letter}
                              </div>
                            )}
                          </div>
                          <div>
                            <span
                              className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.bgColor} ${badge.textColor}`}
                            >
                              {m.application}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-medium text-slate-500">
                                {getMissionCategory(m)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tag de statut discret */}
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Ouvert</span>
                        </span>
                      </div>

                      {/* Titre & Description */}
                      <h3 className="mt-3.5 text-sm font-bold text-navy-900 group-hover:text-brand-orange transition line-clamp-1">
                        {m.titre}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {m.description || "Participez au test utilisateur de cette application."}
                      </p>

                      {/* Métriques / Badges d'information */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-100">
                          <Clock size={12} className="text-slate-400" />
                          <span>{m.dureEstime || "3 jours"}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-100">
                          <Users size={12} className="text-slate-400" />
                          <span>{m.nombreParticipantsSouhaites || 20} testeurs</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-100">
                          <Layers size={12} className="text-slate-400" />
                          <span>{m.etapes?.length ? `${m.etapes.length} étapes` : "3 étapes"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'action élégant */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100">
                      <Link
                        href={`/dashboard/missions/${m.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-2.5 text-xs font-bold text-white transition-all group-hover:bg-brand-orange shadow-xs"
                      >
                        <span>Participer au test</span>
                        <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Vue Mes missions en cours */
          filteredMine.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-2xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-sm font-bold text-navy-900">
                Vous n&apos;avez aucune mission active
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Sélectionnez une mission parmi les tests disponibles pour commencer dès maintenant.
              </p>
              <button
                onClick={() => setTab("available")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-orange/90 transition"
              >
                <span>Explorer les missions disponibles</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMine.map((p) => {
                const badge = getAppBadgeStyle(p.mission?.application || "");
                return (
                  <div
                    key={p.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-slate-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-xs overflow-hidden">
                            {p.mission?.image ? (
                              <img
                                src={getImageUrl(p.mission.image)}
                                alt={p.mission.application}
                                className="h-full w-full object-contain rounded-xl"
                              />
                            ) : (
                              <div
                                className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br ${badge.gradient} text-white font-bold text-base`}
                              >
                                {badge.letter}
                              </div>
                            )}
                          </div>
                          <div>
                            <span
                              className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.bgColor} ${badge.textColor}`}
                            >
                              {p.mission?.application}
                            </span>
                            <h3 className="mt-0.5 text-sm font-bold text-navy-900 line-clamp-1">
                              {p.mission?.titre}
                            </h3>
                          </div>
                        </div>

                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border whitespace-nowrap ${
                          p.statut === "en_attente"
                            ? "bg-amber-50 text-amber-700 border-amber-200/60"
                            : p.statut === "acceptee"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : p.statut === "refusee"
                            ? "bg-rose-50 text-rose-700 border-rose-200/60"
                            : "bg-blue-50 text-blue-600 border-blue-200/60"
                        }`}>
                          {STATUT_LABELS[p.statut] ?? p.statut}
                        </span>
                      </div>

                      {/* Jauge de progression stylée */}
                      <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-600">Progression du test</span>
                          <span className="font-bold text-navy-900">{p.progression ?? 0}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-orange to-amber-500 transition-all duration-500"
                            style={{ width: `${p.progression ?? 0}%` }}
                          />
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500">
                          {p.etapesCompletees ?? 0} sur {p.etapesTotal ?? 0} étapes validées
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {p.statut === "en_attente"
                          ? "En attente admin"
                          : p.statut === "acceptee"
                          ? "Accepté"
                          : p.statut === "terminee"
                          ? "Test achevé"
                          : "Session en cours"}
                      </span>
                      <Link
                        href={`/dashboard/missions/${p.mission?.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition ${
                          p.statut === "en_attente"
                            ? "bg-amber-600 hover:bg-amber-700"
                            : p.statut === "acceptee"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-brand-orange hover:bg-brand-orange/90"
                        }`}
                      >
                        <span>
                          {p.statut === "en_attente"
                            ? "Voir candidature"
                            : p.statut === "acceptee"
                            ? "Commencer le test"
                            : "Continuer le test"}
                        </span>
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
