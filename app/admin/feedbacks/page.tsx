"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Star,
  RefreshCw,
  Loader2,
  Search,
  ThumbsUp,
  AlertCircle,
  Sparkles,
  User,
  Calendar,
  Smile,
} from "lucide-react";
import { adminApi, type AdminFeedback } from "@/lib/api";

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await adminApi.feedbacks();
      setFeedbacks(res || []);
    } catch (err) {
      console.error("Erreur chargement feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, f) => acc + (f.note || 0), 0) / feedbacks.length
        ).toFixed(1)
      : "0.0";

  const filtered = feedbacks.filter((f) => {
    const matchesRating = ratingFilter === "all" || f.note === ratingFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      (f.testeurNom && f.testeurNom.toLowerCase().includes(q)) ||
      (f.missionTitre && f.missionTitre.toLowerCase().includes(q)) ||
      (f.commentaires && f.commentaires.toLowerCase().includes(q)) ||
      (f.problemes && f.problemes.toLowerCase().includes(q));
    return matchesRating && matchesSearch;
  });

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Feedbacks & Évaluations des Tests
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {feedbacks.length} avis reçus
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Consultez les retours d&apos;expérience, points positifs, anomalies signalées et suggestions des testeurs.
          </p>
        </div>

        <button
          onClick={loadFeedbacks}
          disabled={loading}
          className="flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-brand-orange" : ""} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Cartes Métriques Clés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-200">
            <Star size={24} className="fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Note moyenne globale
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-navy-900">{averageRating}</span>
              <span className="text-xs text-slate-400">/ 5</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <MessageSquare size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Retours analysés
            </span>
            <span className="text-2xl font-bold text-navy-900">{feedbacks.length}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Smile size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Satisfaction testeurs
            </span>
            <span className="text-2xl font-bold text-emerald-600">
              {feedbacks.length > 0
                ? `${Math.round(
                    (feedbacks.filter((f) => f.note >= 4).length / feedbacks.length) * 100
                  )}%`
                : "100%"}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans les avis, testeurs, missions..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRatingFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              ratingFilter === "all"
                ? "bg-navy-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Toutes les notes
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setRatingFilter(stars)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                ratingFilter === stars
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{stars}</span>
              <Star size={12} className="fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Liste des avis */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-100 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <MessageSquare size={36} className="text-slate-300 mb-3" />
          <p className="text-base font-bold text-navy-900">Aucun feedback trouvé</p>
          <p className="text-xs text-slate-400 mt-1">
            Les évaluations soumises par les testeurs apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-3.5 transition hover:shadow-sm"
            >
              {/* En-tête avis */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                    {f.testeurNom ? f.testeurNom[0].toUpperCase() : "T"}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900 text-sm">{f.testeurNom}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{f.missionTitre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < (f.note || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 ml-1">{f.note}/5</span>
                </div>
              </div>

              {/* Contenu de l'avis */}
              <div className="space-y-2.5 text-xs">
                {f.commentaires && (
                  <p className="text-slate-700 italic leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    « {f.commentaires} »
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {f.pointsPositifs && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5">
                      <div className="flex items-center gap-1 font-bold text-emerald-700 mb-0.5">
                        <ThumbsUp size={12} />
                        Points forts
                      </div>
                      <p className="text-emerald-900">{f.pointsPositifs}</p>
                    </div>
                  )}

                  {f.problemes && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-2.5">
                      <div className="flex items-center gap-1 font-bold text-rose-700 mb-0.5">
                        <AlertCircle size={12} />
                        Problèmes signalés
                      </div>
                      <p className="text-rose-900">{f.problemes}</p>
                    </div>
                  )}
                </div>

                {f.ameliorations && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-blue-700 mb-0.5">
                      <Sparkles size={12} />
                      Suggestions d&apos;amélioration
                    </div>
                    <p className="text-blue-900">{f.ameliorations}</p>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  Soumis le {f.dateCreation || "Récemment"}
                </span>
                {f.faciliteUtilisation && (
                  <span>Facilité d&apos;utilisation : {f.faciliteUtilisation}/5</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
