import { useEffect, useState } from "react";
import Link, { useParams, useRouter } from "@/lib/router";
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
  RefreshCw,
  Play,
  Send,
  KeyRound,
  Flame,
} from "lucide-react";
import {
  missionsApi,
  participationsApi,
  etapesApi,
  referencesApi,
  sdkApi,
  feedbackApi,
  getImageUrl,
  getApplicationPlayStoreUrl,
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
  const [copiedDailyCode, setCopiedDailyCode] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [copiedTesterId, setCopiedTesterId] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  // Simulateur de formulaire de l'application testée (Étape 4 du schéma)
  const [simPanelisteId, setSimPanelisteId] = useState("");
  const [simCode, setSimCode] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    success: boolean;
    message: string;
    jour?: number;
    progression?: number;
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

  // Commentaire quotidien optionnel
  const [dailyComment, setDailyComment] = useState("");
  const [dailyRating, setDailyRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sendingDailyComment, setSendingDailyComment] = useState(false);
  const [dailyCommentSent, setDailyCommentSent] = useState(false);

  const [showAllStepsList, setShowAllStepsList] = useState(false);

  const quickTagsList = [
    { label: "🚀 Fluide & Rapide", value: "Fluide & Rapide" },
    { label: "🐛 Bug rencontré", value: "Bug rencontré" },
    { label: "🎨 Beau design", value: "Beau design" },
    { label: "⚠️ Ralentissement", value: "Ralentissement" },
    { label: "💡 Suggestion", value: "Suggestion" },
  ];

  async function loadAll(quiet = false) {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
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

      // Auto-sélectionner l'étape en cours pour ce panéliste
      if (userPart && sorted.length > 0) {
        const completedCount = userPart.etapesCompletees || 0;
        const currentEtape = sorted[completedCount] || sorted[sorted.length - 1];
        setSelectedEtape(currentEtape);
        await loadReferenceForEtape(currentEtape.id, userPart);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement de la mission.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadReferenceForEtape(etapeId: number, userPart?: Participation | null) {
    setLoadingRef(true);
    setValidationResult(null);
    setSimResult(null);
    setInputCode("");
    try {
      const ref = await referencesApi.forEtape(etapeId);
      setCurrentReference(ref);
      if (ref) {
        setSimCode(ref.reference || "");
        setSimPanelisteId(ref.panelisteUid || userPart?.panelisteUid || participation?.panelisteUid || "");
      }
    } catch {
      setCurrentReference(null);
    } finally {
      setLoadingRef(false);
    }
  }

  async function handleValidateViaSdk(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const code = simCode.trim().toUpperCase();
    const panelisteId = simPanelisteId.trim();
    if (!code || !panelisteId) return;

    setSimLoading(true);
    setSimResult(null);
    try {
      const apiKey = currentReference?.apiKey || (mission as any)?.applicationEntity?.apiKey || "";
      const res = await sdkApi.verifyDay({
        apiKey,
        panelisteId,
        code,
      });

      if (res.success) {
        setSimResult({
          success: true,
          message: res.message || "Félicitations ! Votre journée de test a été validée avec succès.",
          jour: res.jour,
          progression: res.progression,
        });
        await loadAll(true);
      } else {
        setSimResult({
          success: false,
          message: res.error || "Code invalide. Vérifiez le code saisi et réessayez.",
        });
      }
    } catch (err) {
      setSimResult({
        success: false,
        message: err instanceof Error ? err.message : "Erreur de communication. Veuillez réessayer.",
      });
    } finally {
      setSimLoading(false);
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
    setDailyComment("");
    setDailyCommentSent(false);
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

  async function handleSendDailyComment(e: React.FormEvent) {
    e.preventDefault();
    if (!participation) return;

    const finalComment = [
      selectedTags.length > 0 ? `[Tags : ${selectedTags.join(", ")}]` : "",
      dailyComment.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    if (!finalComment) return;

    setSendingDailyComment(true);
    try {
      await feedbackApi.create({
        participationId: participation.id,
        note: dailyRating,
        commentaires: finalComment,
        jour: selectedEtape?.ordre || 1,
        isFinal: false,
      });
      setDailyCommentSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi du commentaire.");
    } finally {
      setSendingDailyComment(false);
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
        isFinal: true,
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
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl px-4 py-2.5">
        <div className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/missions")}
            aria-label="Retour"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold text-navy-900 leading-tight">
              {mission.titre}
            </p>
            <p className="text-[11px] text-slate-400">
              Application : {mission.application}
            </p>
          </div>
          {participation && (
            <span className="shrink-0 rounded-full bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 text-[10px] font-bold text-brand-orange">
              Jour {selectedEtape?.ordre || (participation.etapesCompletees || 0) + 1}/12
            </span>
          )}
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto px-3.5 sm:px-6 pt-3.5 space-y-4">
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

          {/* Bouton vers l'application externe (Play Store / APK) */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Application à tester sur votre appareil :</span>
            <a
              href={getApplicationPlayStoreUrl(mission)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-98"
            >
              <Play size={12} fill="currentColor" />
              <span>Installer / Ouvrir sur Google Play</span>
              <ExternalLink size={12} />
            </a>
          </div>
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
            {/* Carte Identifiant Unique Panéliste & Téléchargement (Étape 3 du Protocole) */}
            <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 p-5 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    Votre Identifiant Unique Panéliste
                  </span>
                  <p className="mt-1 text-xs text-slate-600">
                    Cet identifiant relie votre compte à cette application (<strong>{mission.application}</strong>). Vous devez le saisir chaque jour dans le formulaire de l&apos;application testée.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="rounded-xl bg-slate-900 px-4 py-2 font-mono text-sm font-bold text-amber-400 select-all shadow-inner tracking-wider">
                      {participation.panelisteUid || "TST-ATTRIBUÉ"}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (participation.panelisteUid) {
                          navigator.clipboard.writeText(participation.panelisteUid);
                          setCopiedTesterId(true);
                          setTimeout(() => setCopiedTesterId(false), 2500);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                    >
                      {copiedTesterId ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-600">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copier mon identifiant</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-start sm:items-end">
                  <span className="text-[11px] text-slate-500 mb-1.5 font-medium">
                    Application à tester :
                  </span>
                  <a
                    href={getApplicationPlayStoreUrl(mission)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-98"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Installer sur Google Play</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </section>

            {/* 12 Jours - Suivi Quotidien Interactif (Habit Tracker Carousel) */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-brand-orange border border-orange-200/60">
                    <Flame size={13} className="text-brand-orange fill-brand-orange" />
                    <span>Série : {participation.etapesCompletees || 0} jours validés</span>
                  </span>
                </div>
                <span className="font-display text-xs font-bold text-navy-900">
                  {participation.etapesCompletees} / {participation.etapesTotal || etapes.length || 12} étapes ({participation.progression ?? 0}%)
                </span>
              </div>

              {/* Jauge fine avec gradient */}
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-orange to-amber-400 transition-all duration-500"
                  style={{ width: `${participation.progression ?? 0}%` }}
                />
              </div>

              {/* Carrousel horizontal fluide des 12 Jours */}
              <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                {etapes.map((etape, index) => {
                  const isCompletedForUser = index < (participation.etapesCompletees || 0) || etape.statut === "validee";
                  const isCurrent = selectedEtape?.id === etape.id;
                  const isPast = isCompletedForUser;

                  return (
                    <button
                      key={etape.id}
                      type="button"
                      onClick={() => handleSelectEtape(etape)}
                      className={`flex h-12 min-w-12 flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition active:scale-95 ${
                        isCurrent
                          ? "border-2 border-brand-orange bg-white text-brand-orange shadow-md scale-105"
                          : isPast
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-slate-100/90 text-slate-400 hover:bg-slate-200/80"
                      }`}
                    >
                      <span className="text-[9px] uppercase opacity-80">J{etape.ordre}</span>
                      {isPast ? (
                        <Check size={14} strokeWidth={3} />
                      ) : isCurrent ? (
                        <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
                      ) : (
                        <Lock size={12} className="opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bouton pour afficher/masquer la liste détaillée de tous les jours */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAllStepsList(!showAllStepsList)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-navy-900 transition"
                >
                  <span>{showAllStepsList ? "Masquer la liste complète" : "Afficher l'intitulé de toutes les étapes"}</span>
                  <ChevronRight size={13} className={`transform transition-transform ${showAllStepsList ? "rotate-90" : ""}`} />
                </button>
                <span className="text-[10px] text-slate-400">12 jours au total</span>
              </div>

              {showAllStepsList && (
                <div className="mt-2 divide-y divide-slate-100 border-t border-slate-100 pt-1">
                  {etapes.map((etape, index) => {
                    const isCompletedForUser = index < (participation.etapesCompletees || 0) || etape.statut === "validee";
                    const isCurrent = selectedEtape?.id === etape.id;
                    const isPast = isCompletedForUser;

                    return (
                      <div
                        key={etape.id}
                        onClick={() => handleSelectEtape(etape)}
                        className={`flex items-center justify-between py-2 px-2 rounded-xl cursor-pointer transition ${
                          isCurrent ? "bg-orange-50/70 border border-orange-100" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isPast ? (
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                          ) : isCurrent ? (
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-orange text-[8px] font-bold text-white shrink-0">
                              ●
                            </span>
                          ) : (
                            <Circle size={15} className="text-slate-300 shrink-0" />
                          )}
                          <p className={`text-xs font-semibold truncate ${
                            isCurrent ? "text-navy-900" : isPast ? "text-slate-700" : "text-slate-400"
                          }`}>
                            Jour {etape.ordre} — {etape.titre}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold shrink-0 ml-2 ${
                          isPast ? "text-emerald-600" : isCurrent ? "text-brand-orange" : "text-slate-400"
                        }`}>
                          {isPast ? "✓ Validé" : isCurrent ? "● En cours" : "○ À venir"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 3. Bloc de validation de l'étape sélectionnée : Étape 4 du protocole */}
            {selectedEtape && !isCompleted && (() => {
              const etapeIndex = etapes.findIndex((e) => e.id === selectedEtape.id);
              const isDayValidated = etapeIndex < (participation.etapesCompletees || 0) || currentReference?.statut === "validee";

              return (
                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
                  {/* En-tête de l'Étape 4 */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-orange uppercase">
                          Étape 4 : Test quotidien
                        </span>
                        <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 text-[10px] font-semibold">
                          Boucle sur 12 jours
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-base font-bold text-navy-900">
                        Jour {selectedEtape.ordre} / {participation.etapesTotal || etapes.length || 12} — {selectedEtape.titre}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => loadAll(true)}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                        title="Actualiser le statut de validation"
                      >
                        <RefreshCw size={13} className={refreshing ? "animate-spin text-brand-orange" : ""} />
                        <span>{refreshing ? "Vérification..." : "Actualiser"}</span>
                      </button>

                      {isDayValidated ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Jour {selectedEtape.ordre} Validé ✓</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-700">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          <span>En attente de validation</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100">
                    <p className="font-semibold text-navy-900 mb-1">Instructions de la journée :</p>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedEtape.instructions || selectedEtape.description || "Lancez l'application à tester, effectuez les parcours utilisateurs prévus et validez avec votre code unique du jour."}
                    </p>
                  </div>

                  {/* CARTE CODE UNIQUE DU JOUR */}
                  <div className="rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 p-5 text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-400">
                          <KeyRound size={16} />
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          Votre Code de Test du Jour
                        </span>
                      </div>
                      <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                        Jour {selectedEtape.ordre} / {participation.etapesTotal || etapes.length || 12}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-white/80 leading-relaxed">
                      Copiez ce code unique et saisissez-le dans l&apos;application testée pour valider votre session d&apos;aujourd&apos;hui.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white/10 p-3.5 border border-white/15">
                      <div>
                        <span className="text-[10px] text-white/60 uppercase block font-medium">Votre Code du Jour :</span>
                        <span className="font-mono text-xl font-extrabold tracking-widest text-amber-400 select-all">
                          {loadingRef ? "Génération en cours..." : (currentReference?.reference || "7K9P-4MX2")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (currentReference?.reference) {
                              navigator.clipboard.writeText(currentReference.reference);
                              setSimCode(currentReference.reference);
                              setCopiedDailyCode(true);
                              setTimeout(() => setCopiedDailyCode(false), 2000);
                            }
                          }}
                          disabled={!currentReference?.reference}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition shadow-sm active:scale-95 disabled:opacity-50"
                        >
                          {copiedDailyCode ? (
                            <>
                              <Check size={14} className="text-emerald-950" />
                              <span>Copié & Rempli !</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copier le code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-white/70 border-t border-white/10 pt-2.5">
                      <span>Votre Identifiant Testeur :</span>
                      <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                        {participation.panelisteUid || "TST-ATTRIBUÉ"}
                      </span>
                    </div>
                  </div>

                  {/* Étapes simples de validation pour le testeur */}
                  <div className="rounded-2xl border border-slate-100 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/30 p-4">
                    <p className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-brand-orange" />
                      Comment valider votre journée en 3 étapes :
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                      <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 font-bold text-brand-orange text-xs">
                          1
                        </span>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Copier le code</p>
                          <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            Cliquez sur &laquo; Copier le code &raquo; ci-dessus pour récupérer votre code du jour.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs">
                          2
                        </span>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Ouvrir l&apos;application</p>
                          <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            Lancez {mission.application} sur votre smartphone et effectuez le test demandé.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs">
                          3
                        </span>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Valider la journée</p>
                          <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            Saisissez votre code dans l&apos;application ou confirmez-le ci-dessous pour valider.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de téléchargement / ouverture de l'application externe */}
                  <div>
                    <a
                      href={getApplicationPlayStoreUrl(mission)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-98"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Ouvrir l&apos;application testée ({mission.application}) sur Google Play</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Formulaire de validation de la journée */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3.5 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={18} className="text-emerald-600" />
                          <h4 className="font-display text-xs sm:text-sm font-bold text-navy-900">
                            Validation de votre journée de test
                          </h4>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Confirmez votre code pour valider votre journée de test (Jour {selectedEtape.ordre}) :
                        </p>
                      </div>
                      {isDayValidated && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 shrink-0 self-start sm:self-auto">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Jour {selectedEtape.ordre} Validé</span>
                        </span>
                      )}
                    </div>

                    {isDayValidated ? (
                      <>
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                              <CheckCircle2 size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-sm text-emerald-950">
                                Jour {selectedEtape.ordre} validé avec succès !
                              </h5>
                              <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">
                                Votre session de test pour aujourd&apos;hui a été bien validée et enregistrée. Votre progression est mise à jour. Rendez-vous demain pour le jour suivant.
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-emerald-900 pt-2 border-t border-emerald-200/60">
                                <span className="font-medium">
                                  Code validé : <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-950">{currentReference?.reference || simCode}</strong>
                                </span>
                                <span className="font-medium">
                                  Identifiant : <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-950">{simPanelisteId}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bloc Commentaire du Jour (Optionnel - Inspiration ALMA) */}
                        <div className="mt-4 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare size={16} className="text-brand-orange" />
                              <h5 className="text-xs font-bold text-navy-900">
                                Comment s&apos;est passée votre session ?
                              </h5>
                            </div>
                            <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              Optionnel
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500">
                            Votre avis pour ce Jour {selectedEtape.ordre} permet au développeur d&apos;améliorer son application.
                          </p>

                          {dailyCommentSent ? (
                            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                              <span>Merci ! Votre avis sur le Jour {selectedEtape.ordre} a été transmis à l&apos;administrateur.</span>
                            </div>
                          ) : (
                            <form onSubmit={handleSendDailyComment} className="mt-3 space-y-3">
                              {/* Étoiles du jour */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-600">Votre note :</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => setDailyRating(s)}
                                      className="p-1 text-amber-400 hover:scale-110 transition active:scale-95"
                                      title={`${s}/5`}
                                    >
                                      <Star
                                        size={18}
                                        fill={s <= dailyRating ? "currentColor" : "none"}
                                        stroke="currentColor"
                                      />
                                    </button>
                                  ))}
                                  <span className="text-xs font-bold text-slate-700 ml-1">{dailyRating}/5</span>
                                </div>
                              </div>

                              {/* Tags rapides de ressenti (Inspiration ALMA) */}
                              <div>
                                <span className="text-[11px] font-medium text-slate-600 block mb-1.5">
                                  Ressenti rapide (1 clic) :
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {quickTagsList.map((tag) => {
                                    const isSelected = selectedTags.includes(tag.value);
                                    return (
                                      <button
                                        key={tag.value}
                                        type="button"
                                        onClick={() => {
                                          setSelectedTags((prev) =>
                                            isSelected
                                              ? prev.filter((t) => t !== tag.value)
                                              : [...prev, tag.value]
                                          );
                                        }}
                                        className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition active:scale-95 ${
                                          isSelected
                                            ? "bg-brand-orange text-white shadow-xs scale-102"
                                            : "bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300"
                                        }`}
                                      >
                                        {tag.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <textarea
                                rows={2}
                                value={dailyComment}
                                onChange={(e) => setDailyComment(e.target.value)}
                                placeholder="Racontez brièvement comment s'est passé votre test, signalez un bug ou une remarque... (facultatif)"
                                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-navy-900 placeholder:text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none shadow-2xs"
                              />

                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  disabled={sendingDailyComment || (!dailyComment.trim() && selectedTags.length === 0)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition active:scale-95 disabled:opacity-40 shadow-xs"
                                >
                                  {sendingDailyComment ? (
                                    <>
                                      <Loader2 size={13} className="animate-spin" />
                                      <span>Envoi...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send size={12} />
                                      <span>Transmettre mon avis (optionnel)</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </>
                    ) : (
                      <form onSubmit={handleValidateViaSdk} className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Champ 1 : Identifiant Unique Panéliste */}
                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 focus-within:border-brand-orange focus-within:bg-white focus-within:ring-1 focus-within:ring-brand-orange transition shadow-2xs">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Identifiant Testeur
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200/70 text-slate-600 shrink-0">
                                <Users size={15} />
                              </span>
                              <input
                                type="text"
                                value={simPanelisteId}
                                onChange={(e) => setSimPanelisteId(e.target.value.toUpperCase())}
                                placeholder="Ex: TST-353451"
                                className="w-full bg-transparent font-mono text-sm font-bold text-navy-900 placeholder:text-slate-400 focus:outline-none"
                              />
                            </div>
                            <span className="mt-1 block text-[10px] text-slate-400">
                              Votre identifiant personnel de panéliste Samré
                            </span>
                          </div>

                          {/* Champ 2 : Code Unique du Jour (OTP Style) */}
                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 focus-within:border-brand-orange focus-within:bg-white focus-within:ring-1 focus-within:ring-brand-orange transition shadow-2xs">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Code Unique du Jour
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0">
                                <KeyRound size={15} />
                              </span>
                              <input
                                type="text"
                                value={simCode}
                                onChange={(e) => setSimCode(e.target.value.toUpperCase())}
                                placeholder="Ex: FLYP-J01-E02B05"
                                className="w-full bg-transparent font-mono text-sm font-bold tracking-wider text-navy-900 placeholder:text-slate-400 focus:outline-none uppercase"
                              />
                              {currentReference?.reference && simCode !== currentReference.reference && (
                                <button
                                  type="button"
                                  onClick={() => setSimCode(currentReference.reference)}
                                  className="shrink-0 rounded-xl bg-amber-200/80 px-2.5 py-1 text-[10px] font-bold text-amber-950 hover:bg-amber-300 transition active:scale-95"
                                  title="Insérer le code du jour"
                                >
                                  Coller
                                </button>
                              )}
                            </div>
                            <span className="mt-1 block text-[10px] text-slate-400">
                              Le code unique associé à votre journée de test
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={simLoading || !simCode.trim() || !simPanelisteId.trim()}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-3.5 sm:py-4 text-sm font-bold text-white shadow-md shadow-brand-orange/25 transition active:scale-95 hover:bg-orange-600 disabled:opacity-50"
                        >
                          {simLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Validation de votre journée en cours...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={17} />
                              <span>Valider ma journée de test (Jour {selectedEtape.ordre})</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    {/* Résultat de la validation */}
                    {simResult && !isDayValidated && (
                      <div
                        className={`mt-3 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                          simResult.success
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                            : "bg-red-50 text-red-700 border border-red-200/70"
                        }`}
                      >
                        {simResult.success ? (
                          <CheckCircle2 size={17} className="shrink-0 text-emerald-600 mt-0.5" />
                        ) : (
                          <AlertCircle size={17} className="shrink-0 text-red-600 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold">{simResult.message}</p>
                          {simResult.success && (
                            <p className="mt-0.5 text-[11px] text-emerald-700">
                              Progression globale mise à jour : <strong>{simResult.progression}%</strong> ({participation.etapesCompletees}/{participation.etapesTotal || 12} jours complétés).
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            })()}

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

