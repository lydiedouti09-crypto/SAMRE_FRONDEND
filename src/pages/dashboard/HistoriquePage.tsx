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
} from "lucide-react";
import { participationsApi, type Participation } from "@/lib/api";

const STATUT_LABELS: Record<string, { label: string; color: string }> = {
  inscrite: { label: "Inscrit", color: "bg-slate-100 text-slate-700" },
  contrat_accepte: { label: "Contrat accepté", color: "bg-blue-50 text-blue-700" },
  en_cours: { label: "En cours", color: "bg-amber-50 text-amber-700" },
  terminee: { label: "Terminée", color: "bg-emerald-50 text-emerald-700" },
  remuneration_en_attente: { label: "Terminée · Feedback envoyé", color: "bg-emerald-50 text-emerald-700" },
  abandonnee: { label: "Abandonnée", color: "bg-red-50 text-red-700" },
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

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pt-5 pb-24 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <History size={18} className="text-brand-orange" />
              <h1 className="font-display text-lg font-bold text-navy-900">
                Historique des missions
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Retrouvez toutes vos participations, progressions et états de validation.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 size={22} className="animate-spin text-brand-orange" />
          </div>
        ) : participations.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Layers size={22} />
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500">
              Vous n&apos;avez encore aucune mission dans votre historique.
            </p>
            <Link
              href="/dashboard/missions"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
            >
              Découvrir les missions disponibles
              <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {participations.map((p) => {
              const statutInfo = STATUT_LABELS[p.statut] ?? {
                label: p.statut,
                color: "bg-slate-100 text-slate-700",
              };

              const dateAffichee = p.dateCreation
                ? new Date(p.dateCreation).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Récemment";

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
                        📱
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xs font-bold text-navy-900">
                            {p.mission?.titre}
                          </h3>
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statutInfo.color}`}>
                            {statutInfo.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Application : <span className="font-semibold text-slate-700">{p.mission?.application}</span> · {p.mission?.platforme || "Mobile"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs self-end sm:self-auto">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar size={13} />
                        <span>{dateAffichee}</span>
                      </div>

                      <Link
                        href={`/dashboard/missions/${p.mission?.id}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-navy-900 transition hover:bg-navy-900 hover:text-white"
                      >
                        <span>Détails</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Progression & Étapes */}
                  <div className="mt-3 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Étapes validées : <strong className="text-navy-900">{p.etapesCompletees} / {p.etapesTotal}</strong>
                      </span>
                      <span className="font-bold text-brand-orange">
                        {p.progression ?? 0}% accompli
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-orange transition-all"
                        style={{ width: `${p.progression ?? 0}%` }}
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
