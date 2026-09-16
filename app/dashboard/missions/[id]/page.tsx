"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Star,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Users,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  missionsApi,
  participationsApi,
  etapesApi,
  referencesApi,
  feedbackApi,
  getImageUrl,
  type Mission,
  type Participation,
  type Etape,
  type Reference,
} from "@/lib/api";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = Number(params.id);

  const [mission, setMission] = useState<Mission | null>(null);
  const [participation, setParticipation] = useState<Participation | null>(null);
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Étape sélectionnée pour test & validation
  const [selectedEtape, setSelectedEtape] = useState<Etape | null>(null);
  const [currentReference, setCurrentReference] = useState<Reference | null>(null);
  const [loadingRef, setLoadingRef] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  // Inscription & Contrat
  const [contratAccepte, setContratAccepte] = useState(false);
  const [joining, setJoining] = useState(false);
  const [starting, setStarting] = useState(false);

  // Feedback Form State
  const [note, setNote] = useState<number>(5);
  const [facilite, setFacilite] = useState<string>("Facile");
  const [pointsPositifs, setPointsPositifs] = useState("");
  const [problemes, setProblemes] = useState("");
  const [difficultes, setDifficultes] = useState("");
  const [ameliorations, setAmeliorations] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  async function loadAll() {
    try {
      const [m, parts, eta] = await Promise.all([
        missionsApi.show(missionId),
        participationsApi.mine(),
        etapesApi.byMission(missionId).catch(() => [] as Etape[]),
      ]);
      setMission(m);
      const userPart = parts.find((p) => p.mission?.id === missionId) ?? null;
      setParticipation(userPart);

      const sorted = eta.sort((a, b) => a.ordre - b.ordre);
      setEtapes(sorted);

      // Auto-sélectionner l'étape en cours
      if (userPart && sorted.length > 0) {
        const firstUncompleted = sorted.find((e) => e.statut !== "validee") || sorted[0];
        setSelectedEtape(firstUncompleted);
        loadReferenceForEtape(firstUncompleted.id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement de la mission.");
    } finally {
      setLoading(false);
    }
  }

  async function loadReferenceForEtape(etapeId: number) {
    setLoadingRef(true);
    setValidationResult(null);
    setInputCode("");
    try {
      const ref = await referencesApi.forEtape(etapeId);
      setCurrentReference(ref);
    } catch {
      setCurrentReference(null);
    } finally {
      setLoadingRef(false);
    }
  }

  useEffect(() => {
    if (!Number.isNaN(missionId)) {
      loadAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId]);

  async function handleJoin() {
    setJoining(true);
    setError(null);
    try {
      await participationsApi.join(missionId, contratAccepte);
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de soumettre votre candidature.");
    } finally {
      setJoining(false);
    }
  }

  async function handleStartTest() {
    if (!participation) return;
    setStarting(true);
    setError(null);
    try {
      await participationsApi.start(participation.id);
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de démarrer la mission de test.");
    } finally {
      setStarting(false);
    }
  }

  function handleSelectEtape(etape: Etape) {
    setSelectedEtape(etape);
    loadReferenceForEtape(etape.id);
  }

  function handleCopyReference() {
    if (!currentReference?.reference) return;
    navigator.clipboard.writeText(currentReference.reference);
    setInputCode(currentReference.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleValidateEtape() {
    if (!selectedEtape || !inputCode.trim()) return;
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await referencesApi.validate(selectedEtape.id, inputCode.trim());
      if (res.valid) {
        setValidationResult({
          valid: true,
          message: "Étape validée avec succès !",
        });
        await loadAll();
      } else {
        setValidationResult({
          valid: false,
          message: "Référence incorrecte. Vérifiez le code et réessayez.",
        });
      }
    } catch (e) {
      setValidationResult({
        valid: false,
        message: e instanceof Error ? e.message : "Erreur lors de la validation.",
      });
    } finally {
      setValidating(false);
    }
  }

  async function handleSendFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!participation) return;
    setSendingFeedback(true);
    try {
      await feedbackApi.create({
        participationId: participation.id,
        note,
        faciliteUtilisation: facilite,
        pointsPositifs: pointsPositifs.trim() || undefined,
        problemes: problemes.trim() || undefined,
        difficultes: difficultes.trim() || undefined,
        ameliorations: ameliorations.trim() || undefined,
        commentaires: commentaires.trim() || undefined,
      });
      setFeedbackSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi du feedback.");
    } finally {
      setSendingFeedback(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 size={24} className="animate-spin text-brand-orange" />
        <span className="text-xs text-slate-400">Chargement de la mission...</span>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="px-5 pt-10 text-center">
        <p className="text-sm text-slate-500">{error ?? "Mission introuvable."}</p>
        <Link href="/dashboard/missions" className="mt-4 inline-block text-xs font-bold text-brand-orange">
          Retour aux missions
        </Link>
      </div>
    );
  }

  const isCompleted =
    participation &&
    (participation.statut === "terminee" ||
      participation.statut === "remuneration_en_attente" ||
      participation.progression === 100 ||
      (etapes.length > 0 && etapes.every((e) => e.statut === "validee")));

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* En-tête de navigation */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-md">
        <button
          onClick={() => router.push("/dashboard/missions")}
          aria-label="Retour"
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-navy-900">
            {mission.titre}
          </p>
          <p className="text-[11px] text-slate-400">
            Application : {mission.application}
          </p>
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Présentation de la mission */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-xs overflow-hidden">
              {mission.image ? (
                <img
                  src={getImageUrl(mission.image)}
                  alt={mission.application}
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-brand-orange/10 font-bold text-brand-orange text-lg">
                  {mission.application?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-base font-bold text-navy-900 leading-tight">
                {mission.titre}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Application : <span className="font-semibold text-navy-900">{mission.application}</span>
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                  <Smartphone size={13} className="text-emerald-600" />
                  <span>Android uniquement</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/60">
                  <Clock size={13} className="text-amber-500" />
                  <span>{mission.dureEstime || `${mission.duree || 3} jours`}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200/80">
                  <Users size={13} className="text-slate-500" />
                  <span>Objectif : {mission.nombreParticipantsSouhaites || 20} testeurs</span>
                </span>
                {mission.versionApplication && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200/60">
                    <span>v{mission.versionApplication}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-600">
            {mission.description}
          </p>

          {mission.objectif && (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
              <span className="font-semibold text-navy-900">Objectif du test : </span>
              {mission.objectif}
            </div>
          )}

          {/* Bouton vers l'application externe (si déjà accepté/en cours) */}
          {mission.lienApplication && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Lien direct vers l&apos;application :</span>
              <a
                href={mission.lienApplication}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-navy-800"
              >
                <span>Ouvrir l&apos;application (Play Store / APK)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </section>

        {/* 1. Écran de Candidature (si pas encore postulé) */}
        {!participation && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <h3 className="font-display text-sm font-bold text-navy-900">
              Conditions de participation & Candidature
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              L&apos;accès aux missions de test est soumis à la validation préalable de votre profil par l&apos;administrateur.
            </p>

            <div className="mt-3 space-y-2 rounded-xl bg-[#FBFBFC] p-3 text-xs text-slate-600 border border-slate-100">
              <p>• Vous devez posséder un appareil compatible <strong>Android</strong>.</p>
              <p>• Vous vous engagez à effectuer l&apos;ensemble des tâches prévues chaque jour.</p>
              <p>• Chaque étape doit être validée avec le code de référence officiel.</p>
            </div>

            {mission.conditionsParticipation && (
              <div className="mt-3 rounded-xl bg-amber-50/60 p-3 text-xs text-slate-700 border border-amber-200/50">
                <p className="font-semibold text-amber-900 mb-1">Contrat de mission :</p>
                <p className="whitespace-pre-line text-[11px] text-slate-600 leading-relaxed font-mono">
                  {mission.conditionsParticipation}
                </p>
              </div>
            )}

            <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={contratAccepte}
                onChange={(e) => setContratAccepte(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand-orange"
              />
              <span className="text-xs leading-relaxed text-slate-600">
                J&apos;accepte les conditions de test et postule à cette mission. Je comprends que l&apos;administrateur doit accepter mon profil avant le démarrage.
              </span>
            </label>

            <button
              onClick={handleJoin}
              disabled={!contratAccepte || joining}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-orange-600 disabled:opacity-50"
            >
              {joining && <Loader2 size={15} className="animate-spin" />}
              <span>Postuler à cette mission</span>
            </button>
          </section>
        )}

        {/* 2. État : Candidature en attente de validation */}
        {participation && (participation.statut === "en_attente" || participation.statut === "inscrite") && (
          <section className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6 shadow-xs text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-3">
              <Clock size={24} className="animate-pulse" />
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800 border border-amber-300/60">
              Candidature en attente de validation
            </span>
            <h3 className="mt-3 font-display text-base font-bold text-navy-900">
              Votre candidature est en cours d&apos;examen par l&apos;administrateur
            </h3>
            <p className="mt-2 text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              Votre demande a bien été transmise. L&apos;administrateur de SAMRE vérifie vos informations afin de vous affecter à cette mission de test.
            </p>
            <div className="mt-4 rounded-xl bg-white p-3.5 border border-amber-200/60 text-[11px] text-slate-600 text-left max-w-lg mx-auto space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-navy-900">
                <Lock size={14} className="text-amber-600" />
                <span>Étapes et codes secrets verrouillés</span>
              </div>
              <p>
                Dès que l&apos;administrateur valide votre accès, vous recevrez une notification et vous pourrez cliquer sur <strong>« Commencer le test »</strong>.
              </p>
            </div>
          </section>
        )}

        {/* 3. État : Candidature refusée */}
        {participation && participation.statut === "refusee" && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-xs text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3">
              <AlertCircle size={24} />
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold text-rose-800 border border-rose-300/60">
              Candidature non retenue
            </span>
            <h3 className="mt-3 font-display text-base font-bold text-navy-900">
              Votre candidature n&apos;a pas été retenue pour cette mission
            </h3>
            <p className="mt-2 text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              Le nombre maximum de testeurs a été atteint ou votre profil ne correspondait pas aux besoins de cette campagne. Vous pouvez postuler à d&apos;autres missions.
            </p>
            <Link
              href="/dashboard/missions"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-navy-800 transition"
            >
              <span>Voir d&apos;autres missions disponibles</span>
              <ChevronRight size={13} />
            </Link>
          </section>
        )}

        {/* 4. État : Candidature acceptée -> Bouton Démarrer le test */}
        {participation && participation.statut === "acceptee" && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-xs text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 size={26} />
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-300/60">
              Candidature acceptée par l&apos;administrateur 🎉
            </span>
            <h3 className="mt-3 font-display text-base font-bold text-navy-900">
              Félicitations, vous pouvez débuter votre mission de test !
            </h3>
            <p className="mt-2 text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              Votre profil a été validé. Cliquez sur le bouton ci-dessous pour débloquer votre premier jour de test et vos codes de référence.
            </p>
            <button
              onClick={handleStartTest}
              disabled={starting}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              {starting && <Loader2 size={15} className="animate-spin" />}
              <span>Commencer la mission</span>
              <ChevronRight size={14} />
            </button>
          </section>
        )}

        {/* 5. Suivi de progression & Test actif (uniquement si en cours ou terminée) */}
        {participation && (participation.statut === "en_cours" || participation.statut === "contrat_accepte" || participation.statut === "terminee") && (
          <>
            {/* Barre d'avancement globale */}
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Progression du test
                  </p>
                  <p className="font-display text-base font-bold text-navy-900">
                    Étape {participation.etapesCompletees} / {participation.etapesTotal || etapes.length}
                  </p>
                </div>
                <span className="font-display text-lg font-bold text-brand-orange">
                  {participation.progression ?? 0} %
                </span>
              </div>

              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-orange transition-all duration-500"
                  style={{ width: `${participation.progression ?? 0}%` }}
                />
              </div>

              {/* Liste des statuts des étapes demandée */}
              <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100 pt-2">
                {etapes.map((etape, index) => {
                  const done = etape.statut === "validee";
                  const isCurrent = selectedEtape?.id === etape.id;
                  const isPast = done;
                  const isUpcoming = !done && !isCurrent;

                  return (
                    <div
                      key={etape.id}
                      onClick={() => handleSelectEtape(etape)}
                      className={`flex items-center justify-between py-2.5 px-2 rounded-xl cursor-pointer transition ${
                        isCurrent
                          ? "bg-orange-50/70 border border-orange-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isPast ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : isCurrent ? (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white shrink-0">
                            ●
                          </span>
                        ) : (
                          <Circle size={16} className="text-slate-300 shrink-0" />
                        )}

                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${
                            isCurrent ? "text-navy-900" : isPast ? "text-slate-700" : "text-slate-400"
                          }`}>
                            Étape {index + 1} — {etape.titre}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold shrink-0 ml-2 ${
                        isPast
                          ? "text-emerald-600"
                          : isCurrent
                          ? "text-brand-orange"
                          : "text-slate-400"
                      }`}>
                        {isPast ? "✓ Terminée" : isCurrent ? "● En cours" : "○ À venir"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Bloc de validation de l'étape sélectionnée */}
            {selectedEtape && !isCompleted && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange uppercase">
                      Étape {selectedEtape.ordre}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-bold text-navy-900">
                      {selectedEtape.titre}
                    </h3>
                  </div>
                  {selectedEtape.statut === "validee" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle size={14} />
                      Validée
                    </span>
                  )}
                </div>

                {/* Instructions de l'étape */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instructions :
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl">
                    {selectedEtape.instructions || selectedEtape.description || "Effectuez le scénario décrit dans l'application."}
                  </p>
                </div>

                {/* Bouton pour aller vers l'application externe */}
                {mission.lienApplication && (
                  <div className="mt-4">
                    <a
                      href={mission.lienApplication}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-navy-900"
                    >
                      <Smartphone size={15} className="text-brand-orange" />
                      <span>Tester l&apos;application externe</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {/* INTERFACE POUR EXPLIQUER LE CODE (Demande explicite de l'utilisateur) */}
                <div className="mt-5 rounded-xl border border-slate-200/70 bg-[#FBFBFC] p-4">
                  <h4 className="font-display text-xs font-bold text-navy-900">
                    Validez cette étape
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Pour confirmer que vous avez effectué l&apos;action demandée dans l&apos;application, utilisez la référence fournie pour cette étape.
                  </p>

                  <ol className="mt-3 space-y-1.5 text-[11px] text-slate-600 list-decimal list-inside bg-white p-3 rounded-lg border border-slate-100">
                    <li>Ouvrez l&apos;application externe.</li>
                    <li>Suivez les instructions de la mission.</li>
                    <li>Effectuez l&apos;action demandée.</li>
                    <li>Utilisez la référence lorsque l&apos;application vous la demande.</li>
                    <li>Revenez sur SAMRE.</li>
                    <li>Entrez la référence pour valider votre étape.</li>
                  </ol>

                  {/* Référence fournie par le backend */}
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Votre référence pour cette étape :
                    </p>

                    {loadingRef ? (
                      <div className="mt-2 flex items-center justify-center py-3">
                        <Loader2 size={16} className="animate-spin text-brand-orange" />
                      </div>
                    ) : currentReference ? (
                      <div className="mt-1.5 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-2.5 text-white">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Code officiel</span>
                          <span className="font-mono text-sm font-bold tracking-widest text-brand-orange">
                            {currentReference.reference}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyReference}
                          className="flex items-center gap-1.5 rounded-lg bg-brand-orange/20 border border-brand-orange/40 px-3 py-1.5 text-[11px] font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-white"
                        >
                          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          <span>{copied ? "Copié & Inséré !" : "Copier & Remplir"}</span>
                        </button>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400 italic">
                        Aucune référence requise pour cette étape.
                      </p>
                    )}
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      💡 C&apos;est ce code officiel ci-dessus que vous devez saisir dans le champ ci-dessous pour valider l&apos;étape.
                    </p>
                  </div>

                  {/* Champ de saisie de la référence */}
                  <div className="mt-4">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Entrez votre référence
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder="Ex: WA-087C6F"
                        autoCapitalize="characters"
                        disabled={selectedEtape.statut === "validee"}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-bold tracking-wider text-navy-900 placeholder:text-slate-400 placeholder:font-normal focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange disabled:bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={handleValidateEtape}
                        disabled={validating || !inputCode.trim() || selectedEtape.statut === "validee"}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-orange-600 disabled:opacity-50"
                      >
                        {validating ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <span>Valider l&apos;étape</span>
                        )}
                      </button>
                    </div>

                    {/* Messages de validation */}
                    {validationResult && (
                      <div
                        className={`mt-2.5 flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium ${
                          validationResult.valid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {validationResult.valid ? (
                          <CheckCircle2 size={15} className="shrink-0" />
                        ) : (
                          <AlertCircle size={15} className="shrink-0" />
                        )}
                        <span>{validationResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* 4. FEEDBACK À LA FIN (Demande explicite de l'utilisateur) */}
            {isCompleted && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                {feedbackSent ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <CheckCircle size={26} />
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-navy-900">
                      Merci pour votre feedback !
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Vos réponses ont été enregistrées avec succès. Votre participation à ce test est complète.
                    </p>
                    <Link
                      href="/dashboard/missions"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
                    >
                      <span>Retourner aux missions</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSendFeedback} className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                        Mission terminée 🎉
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold text-navy-900">
                        Donnez votre feedback de testeur
                      </h3>
                      <p className="text-xs text-slate-500">
                        Votre retour d&apos;expérience permet aux équipes d&apos;améliorer l&apos;application.
                      </p>
                    </div>

                    {/* Note globale (1 à 5 étoiles) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Note globale de l&apos;application :
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNote(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition"
                          >
                            <Star
                              size={22}
                              fill={star <= note ? "currentColor" : "none"}
                              stroke="currentColor"
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-navy-900 ml-2">{note} / 5</span>
                      </div>
                    </div>

                    {/* Facilité d'utilisation */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Facilité d&apos;utilisation :
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["Très facile", "Facile", "Moyenne", "Difficile"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFacilite(level)}
                            className={`rounded-xl py-1.5 text-xs font-medium border transition ${
                              facilite === level
                                ? "bg-navy-900 text-white border-navy-900"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Points positifs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Points positifs :
                      </label>
                      <textarea
                        rows={2}
                        value={pointsPositifs}
                        onChange={(e) => setPointsPositifs(e.target.value)}
                        placeholder="Ce qui a bien fonctionné, les aspects agréables..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>

                    {/* Problèmes rencontrés */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Problèmes rencontrés :
                      </label>
                      <textarea
                        rows={2}
                        value={problemes}
                        onChange={(e) => setProblemes(e.target.value)}
                        placeholder="Bugs, plantages, lenteurs constatées..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>

                    {/* Difficultés */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Difficultés ou incompréhensions :
                      </label>
                      <textarea
                        rows={2}
                        value={difficultes}
                        onChange={(e) => setDifficultes(e.target.value)}
                        placeholder="Textes peu clairs, étapes difficiles à trouver..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>

                    {/* Suggestions d'amélioration */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Suggestions d&apos;amélioration :
                      </label>
                      <textarea
                        rows={2}
                        value={ameliorations}
                        onChange={(e) => setAmeliorations(e.target.value)}
                        placeholder="Fonctionnalités souhaitées, modifications recommandées..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>

                    {/* Commentaire général */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Commentaire général :
                      </label>
                      <textarea
                        rows={2}
                        value={commentaires}
                        onChange={(e) => setCommentaires(e.target.value)}
                        placeholder="Remarques supplémentaires..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sendingFeedback}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-orange-600 disabled:opacity-50"
                    >
                      {sendingFeedback && <Loader2 size={15} className="animate-spin" />}
                      <span>Envoyer mon feedback</span>
                    </button>
                  </form>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

