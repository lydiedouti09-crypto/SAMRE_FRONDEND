"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Award,
  Activity,
  Layers,
  Sparkles,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import {
  getImageUrl,
  type Mission,
  type Participation,
  type NotificationItem,
  type DailyCodeInfo,
} from "@/lib/api";
import DesktopActivityPanel from "./DesktopActivityPanel";

type Props = {
  prenom?: string;
  nom?: string;
  email?: string;
  photo?: string;
  active?: Participation;
  available: Mission[];
  participations: Participation[];
  notifications: NotificationItem[];
  etapesValidees: number;
  dailyCode?: DailyCodeInfo | null;
};

export default function DesktopDashboard({
  prenom,
  nom,
  email,
  photo,
  active,
  available,
  participations,
  notifications,
  etapesValidees,
  dailyCode,
}: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopyDailyCode(codeToCopy: string) {
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const today = new Date();
  const dateFormatted = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const progression = active?.progression ?? 0;
  const completedCount = participations.filter(
    (p) => p.statut === "terminee"
  ).length;

  const totalEtapes = participations.reduce(
    (acc, p) => acc + (p.etapesTotal || 0),
    0
  );
  const completionRate =
    totalEtapes > 0 ? Math.round((etapesValidees / totalEtapes) * 100) : 0;

  return (
    <div className="flex flex-col gap-5 px-5 py-4 lg:flex-row">
      {/* Colonne Principale */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header Salutations & Date */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-navy-900 xl:text-2xl">
              Bonjour, {prenom || "Testeur"} 👋
            </h1>
            <p className="text-xs text-slate-500">
              Votre espace de test applicatif. Suivez vos scénarios et validez chaque étape.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs sm:self-auto">
            <Calendar size={14} className="text-brand-orange" />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* 3 Cartes Métriques Compactes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Card 1: Missions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-brand-orange">
                <Award size={18} />
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                {active ? "1 en cours" : "Disponible"}
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Missions de test
            </p>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold text-navy-900">
                {participations.length}
              </span>
              <span className="text-[11px] text-slate-500">
                ({completedCount} terminée{completedCount > 1 ? "s" : ""})
              </span>
            </div>
          </div>

          {/* Card 2: Étapes validées */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CheckCircle2 size={18} />
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                {active ? `${progression}% validé` : "En attente"}
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Étapes validées
            </p>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold text-navy-900">
                {etapesValidees}
              </span>
              <span className="text-[11px] text-slate-500">
                sur {totalEtapes || etapesValidees} au total
              </span>
            </div>
          </div>

          {/* Card 3: Code du jour pour les missions */}
          <div className="rounded-2xl border border-indigo-100/70 bg-gradient-to-br from-white via-indigo-50/25 to-white p-4 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
                <KeyRound size={18} />
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {dailyCode?.hasActiveMission ? `Jour ${dailyCode.jour}` : "Code du jour"}
              </span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Code du jour
            </p>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="font-mono text-base font-extrabold tracking-wider text-navy-900 select-all sm:text-lg">
                  {dailyCode?.code || "SAM-CHARGEMENT"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyDailyCode(dailyCode?.code || "")}
                disabled={!dailyCode?.code}
                className="flex items-center gap-1 rounded-lg border border-indigo-200/80 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 shadow-2xs transition hover:bg-indigo-50 active:scale-95 disabled:opacity-50"
                title="Copier le code du jour"
              >
                {copied ? (
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
            <p className="mt-1 text-[10px] text-slate-400 truncate">
              {dailyCode?.hasActiveMission && dailyCode.application
                ? `Pour valider ${dailyCode.application} aujourd'hui`
                : "Renouvelé chaque jour automatiquement"}
            </p>
          </div>
        </div>

        {/* Graphique de Performance Compact */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-navy-900">
                Activité & rythme des tests
              </h3>
              <p className="text-[11px] text-slate-400">
                Suivi hebdomadaire des étapes validées par vos tests applicatifs
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1 text-[11px]">
              <span className="rounded-md bg-white px-2.5 py-0.5 font-semibold text-navy-900 shadow-xs">
                Cette semaine
              </span>
              <span className="px-2 py-0.5 text-slate-400">Semaine dernière</span>
            </div>
          </div>

          {/* SVG Smooth Curve Graph Compact */}
          <div className="relative h-36 w-full overflow-hidden">
            <svg
              className="h-full w-full"
              viewBox="0 0 700 140"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="25" x2="700" y2="25" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="0" y1="65" x2="700" y2="65" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="0" y1="105" x2="700" y2="105" stroke="#F1F5F9" strokeDasharray="3 3" />

              <path
                d="M 0 110 C 120 100, 200 80, 320 85 C 440 95, 520 60, 700 55 L 700 140 L 0 140 Z"
                fill="url(#blueGradient)"
              />
              <path
                d="M 0 110 C 120 100, 200 80, 320 85 C 440 95, 520 60, 700 55"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="2"
              />

              <path
                d="M 0 95 C 140 85, 240 30, 360 40 C 480 50, 560 15, 700 25 L 700 140 L 0 140 Z"
                fill="url(#curveGradient)"
              />
              <path
                d="M 0 95 C 140 85, 240 30, 360 40 C 480 50, 560 15, 700 25"
                fill="none"
                stroke="#F97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <circle cx="360" cy="40" r="5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>

            <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-xl bg-navy-950/95 px-3 py-1.5 text-[11px] text-white shadow-lg backdrop-blur-md">
              <span className="font-semibold text-brand-orange">Aujourd&apos;hui : </span>
              <span>Étape 2 Wave validée ✓</span>
            </div>
          </div>

          <div className="mt-1 flex justify-between px-1 text-[10px] font-medium text-slate-400">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span className="font-bold text-navy-900">Jeu (Aujourd&apos;hui)</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>
        </div>

        {/* Mission en cours */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-display text-sm font-bold text-navy-900">
              Mission active en cours
            </h3>
            {active && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-orange">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
                En cours de test
              </span>
            )}
          </div>

          {active ? (
            <div className="rounded-xl border border-slate-100 bg-[#FBFBFC] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-xs overflow-hidden">
                    {active.mission?.image ? (
                      <img
                        src={getImageUrl(active.mission.image)}
                        alt={active.mission.application}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-brand-orange/10 font-bold text-brand-orange text-base">
                        {active.mission?.application?.charAt(0).toUpperCase() || "A"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy-900">
                      {active.mission?.titre}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Application :{" "}
                      <span className="font-semibold text-navy-900">
                        {active.mission?.application || "Android"}
                      </span>{" "}
                      · Durée estimée :{" "}
                      <span className="font-medium text-slate-600">
                        {active.mission?.dureEstime || "3 jours"}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/missions/${active.mission?.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-navy-800"
                >
                  Continuer le test
                  <ChevronRight size={13} />
                </Link>
              </div>

              {/* Progress Bar & Details */}
              <div className="mt-3 border-t border-slate-200/60 pt-3">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-500">
                    Étape {active.etapesCompletees} sur {active.etapesTotal} complétées
                  </span>
                  <span className="font-bold text-brand-orange">
                    {progression}% accompli
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-brand-orange transition-all duration-500"
                    style={{ width: `${progression}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-xs font-medium text-slate-500">
                Vous n&apos;avez aucune mission active pour l&apos;instant.
              </p>
              <Link
                href="/dashboard/missions"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
              >
                Rejoindre une mission disponible
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Missions recommandées & disponibles */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-navy-900">
                Missions disponibles
              </h3>
              <p className="text-[11px] text-slate-400">
                Sélectionnez une application pour débuter vos scénarios de test
              </p>
            </div>
            <Link
              href="/dashboard/missions"
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Voir tout ({available.length})
            </Link>
          </div>

          {available.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              Toutes les missions ouvertes sont actuellement complètes.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {available.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-[#FBFBFC] p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/80 p-1 shadow-xs overflow-hidden">
                        {m.image ? (
                          <img
                            src={getImageUrl(m.image)}
                            alt={m.application}
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg bg-brand-orange/10 font-bold text-brand-orange text-xs">
                            {m.application?.charAt(0).toUpperCase() || "A"}
                          </div>
                        )}
                      </div>
                      <span className="rounded-md bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        App Mobile
                      </span>
                    </div>

                    <h4 className="mt-2.5 font-display text-xs font-bold text-navy-900 group-hover:text-brand-orange transition-colors line-clamp-1">
                      {m.titre}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2 text-[11px]">
                    <span className="text-slate-400">
                      {m.dureEstime || `${m.duree || 3} jours`} • {m.nombreParticipantsSouhaites || 20} testeurs
                    </span>
                    <Link
                      href={`/dashboard/missions/${m.id}`}
                      className="inline-flex items-center gap-1 font-bold text-navy-900 group-hover:text-brand-orange transition"
                    >
                      Détails
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panneau Latéral Droit Compact */}
      <DesktopActivityPanel
        prenom={prenom}
        nom={nom}
        email={email}
        photo={photo}
        notifications={notifications}
      />
    </div>
  );
}