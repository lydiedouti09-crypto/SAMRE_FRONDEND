import { useEffect, useState } from "react";
import Link from "@/lib/router";
import {
  History,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Smartphone,
  Award,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { participationsApi, type Participation } from "@/lib/api";

const STATUT_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  inscrite: {
    label: "Inscrite",
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  contrat_accepte: {
    label: "Acceptée · À démarrer",
    bg: "bg-sky-50 border border-sky-200/80",
    text: "text-sky-800",
    dot: "bg-sky-500",
  },
  en_cours: {
    label: "Test en cours",
    bg: "bg-amber-50 border border-amber-200/80",
    text: "text-amber-800",
    dot: "bg-amber-500 animate-pulse",
  },
  terminee: {
    label: "Mission terminée",
    bg: "bg-emerald-50 border border-emerald-200/80",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  remuneration_en_attente: {
    label: "Terminée · Récompense en cours",
    bg: "bg-emerald-50 border border-emerald-200/80",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  abandonnee: {
    label: "Abandonnée",
    bg: "bg-rose-50 border border-rose-200/80",
    text: "text-rose-700",
    dot: "bg-rose-400",
  },
};

export default function HistoriquePage() {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    participationsApi
      .mine()
      .then((data) => setParticipations(data))
      .catch(() => setParticipations([]))
      .finally(() => setLoading(false));
  }, []);

  const totalEtapes = participations.reduce((acc, p) => acc + (p.etapesCompletees || 0), 0);
  const termineesCount = participations.filter((p) => p.statut === "terminee" || p.statut === "remuneration_en_attente").length;
  const enCoursCount = participations.filter((p) => p.statut === "en_cours" || p.statut === "contrat_accepte").length;

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 pt-6 pb-24 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <History size={20} />
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight text-navy-950">
                Historique des tests
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Suivi détaillé de vos participations, étapes validées et états de rémunération.
            </p>
          </div>
        </div>

        {/* Cartes résumé / Statistiques utiles */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Missions suivies
            </span>
            <p className="mt-1 font-display text-xl sm:text-2xl font-black text-navy-950">
              {participations.length}
            </p>
            <span className="text-[11px] text-slate-500">au total</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Étapes validées
            </span>
            <p className="mt-1 font-display text-xl sm:text-2xl font-black text-brand-orange">
              {totalEtapes}
            </p>
            <span className="text-[11px] text-slate-500">jours validés</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              En cours d'activité
            </span>
            <p className="mt-1 font-display text-xl sm:text-2xl font-black text-emerald-600">
              {enCoursCount}
            </p>
            <span className="text-[11px] text-slate-500">
              {termineesCount} terminée{termineesCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200/60 bg-white">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-brand-orange" />
              <p className="text-xs text-slate-400">Chargement de votre historique...</p>
            </div>
          </div>
        ) : participations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-10 text-center shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Layers size={26} />
            </div>
            <h3 className="mt-3 font-display text-sm font-bold text-navy-950">
              Aucune mission enregistrée
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Vous n&apos;avez encore rejoint aucune mission de test. Découvrez les applications en attente de testeurs.
            </p>
            <Link
              href="/dashboard/missions"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-950 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-orange"
            >
              <span>Explorer les missions</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {participations.map((p) => {
              const cfg = STATUT_CONFIG[p.statut] || STATUT_CONFIG.inscrite;
              const dateStr = p.dateCreation
                ? new Date(p.dateCreation).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Récemment";

              const appName = p.mission?.application || p.mission?.titre || "Application";
              const platform = p.mission?.platforme || "Android";

              return (
                <div
                  key={p.id}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Colonne gauche : Application et Titre */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-slate-800 text-white shadow-xs">
                        <Smartphone size={22} className="text-amber-400" />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-black text-white ring-2 ring-white">
                          ✓
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-sm font-bold text-navy-950 truncate">
                            {p.mission?.titre}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${cfg.bg} ${cfg.text}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>
                            App : <strong className="text-navy-900 font-semibold">{appName}</strong>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {platform}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite : Date & Bouton d'action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar size={14} />
                        <span>Rejoint le {dateStr}</span>
                      </div>

                      <Link
                        href={`/dashboard/missions/${p.mission?.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-navy-950 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-brand-orange active:scale-98"
                      >
                        <span>Détails</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Barre de Progression élégante avec détails des champs */}
                  <div className="mt-4 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        Étapes validées :{" "}
                        <strong className="text-navy-950 font-bold">
                          {p.etapesCompletees || 0} / {p.etapesTotal || 1}
                        </strong>
                      </span>
                      <span className="font-bold text-brand-orange">
                        {p.progression ?? 0}% accompli
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-orange to-amber-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, p.progression ?? 0))}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
