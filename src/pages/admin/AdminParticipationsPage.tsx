import { useEffect, useState, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
  Layers,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  Smartphone,
  Calendar,
  User,
  Check,
  X,
  AlertTriangle,
  FileText,
  Key,
  Eye,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { adminApi, getImageUrl, type AdminParticipation, type ParticipationDetail } from "@/lib/api";
import ConfirmModal, { type ConfirmVariant } from "@/components/ui/ConfirmModal";

function AdminParticipationsContent() {
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get("status");

  const [participations, setParticipations] = useState<AdminParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(urlStatus || "tous");
  const [mounted, setMounted] = useState(false);

  // Inspection Modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectDetail, setInspectDetail] = useState<ParticipationDetail | null>(null);

  // Custom Confirm Modal
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: ConfirmVariant;
    confirmText: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "primary",
    confirmText: "Confirmer",
    onConfirm: async () => {},
  });

  // Action Loading State
  const [actionId, setActionId] = useState<number | null>(null);

  const fetchParticipations = async () => {
    setLoading(true);
    try {
      const res = await adminApi.participations();
      setParticipations(res || []);
    } catch (err) {
      console.error("Erreur participations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchParticipations();
  }, []);

  useEffect(() => {
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  const handleAccept = (id: number, testeurNom: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Accepter la candidature",
      message: `Voulez-vous accepter la candidature de ${testeurNom} pour cette mission ? Le testeur pourra démarrer ses scénarios.`,
      variant: "success",
      confirmText: "Accepter la candidature",
      onConfirm: async () => {
        setActionId(id);
        try {
          await adminApi.acceptParticipation(id);
          setParticipations((prev) =>
            prev.map((p) => (p.id === id ? { ...p, statut: "acceptee" } : p))
          );
        } catch (err) {
          console.error("Erreur acceptation:", err);
        } finally {
          setActionId(null);
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  const handleRefuse = (id: number, testeurNom: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Refuser la candidature",
      message: `Voulez-vous refuser la candidature de ${testeurNom} pour cette mission ?`,
      variant: "danger",
      confirmText: "Refuser",
      onConfirm: async () => {
        setActionId(id);
        try {
          await adminApi.refuseParticipation(id);
          setParticipations((prev) =>
            prev.map((p) => (p.id === id ? { ...p, statut: "refusee" } : p))
          );
        } catch (err) {
          console.error("Erreur refus:", err);
        } finally {
          setActionId(null);
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await adminApi.updateParticipationStatus(id, newStatus);
      setParticipations((prev) =>
        prev.map((p) => (p.id === id ? { ...p, statut: newStatus } : p))
      );
      if (inspectDetail && inspectDetail.id === id) {
        setInspectDetail({ ...inspectDetail, statut: newStatus });
      }
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  const handleInspect = async (id: number) => {
    setInspectModalOpen(true);
    setInspectLoading(true);
    setInspectDetail(null);
    try {
      const res = await adminApi.participationDetails(id);
      setInspectDetail(res);
    } catch (err) {
      console.error("Erreur détails participation:", err);
    } finally {
      setInspectLoading(false);
    }
  };

  const filtered = participations.filter((p) => {
    const matchesStatus =
      statusFilter === "tous" ||
      p.statut === statusFilter ||
      (statusFilter === "en_cours" &&
        ["en_cours", "acceptee", "commencee"].includes(p.statut)) ||
      (statusFilter === "en_attente" &&
        ["en_attente", "postule"].includes(p.statut)) ||
      (statusFilter === "en_retard" &&
        ["en_retard", "retard"].includes(p.statut)) ||
      (statusFilter === "terminee" &&
        ["terminee", "remuneration_payee"].includes(p.statut)) ||
      (statusFilter === "abandonnee" &&
        ["abandonnee", "abandon"].includes(p.statut));

    const q = search.toLowerCase();
    const matchesSearch =
      (p.testeurNom && p.testeurNom.toLowerCase().includes(q)) ||
      (p.testeurEmail && p.testeurEmail.toLowerCase().includes(q)) ||
      (p.missionTitre && p.missionTitre.toLowerCase().includes(q)) ||
      (p.application && p.application.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Candidatures & Suivi des Participations
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {participations.length} test{participations.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Validez les candidatures des testeurs, surveillez leur avancement jour par jour et vérifiez les codes saisis.
          </p>
        </div>

        <button
          onClick={fetchParticipations}
          disabled={loading}
          className="flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-brand-orange" : ""} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par testeur, email, mission..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "tous", label: "Toutes" },
            { id: "en_attente", label: "En attente" },
            { id: "en_cours", label: "En cours" },
            { id: "en_retard", label: "En retard" },
            { id: "terminee", label: "Terminées" },
            { id: "abandonnee", label: "Abandons" },
            { id: "refusee", label: "Refusées" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des participations */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-100 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Layers size={36} className="text-slate-300 mb-3" />
          <p className="text-base font-bold text-navy-900">Aucune participation trouvée</p>
          <p className="text-xs text-slate-400 mt-1">
            Les candidatures et suivis des testeurs apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Testeur</th>
                  <th className="px-5 py-3.5">Mission Android</th>
                  <th className="px-5 py-3.5">Progression Quotidienne</th>
                  <th className="px-5 py-3.5">Statut actuel</th>
                  <th className="px-5 py-3.5">Contrat</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const isPending = p.statut === "en_attente" || p.statut === "postule";
                  const isInProgress = p.statut === "en_cours" || p.statut === "acceptee" || p.statut === "commencee";
                  const isLate = p.statut === "en_retard" || p.statut === "retard";
                  const isFinished = p.statut === "terminee" || p.statut === "remuneration_payee";
                  const isAbandoned = p.statut === "abandonnee" || p.statut === "abandon";
                  const isRefused = p.statut === "refusee";

                  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
                  const logoUrl = p.image
                    ? p.image.startsWith("http")
                      ? p.image
                      : `${apiBase}${p.image}`
                    : null;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      {/* Testeur */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.testeurPhoto ? (
                            <img
                              src={getImageUrl(p.testeurPhoto)}
                              alt={p.testeurNom}
                              className="h-9 w-9 shrink-0 rounded-full object-cover border border-slate-200 shadow-2xs"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                              {p.testeurNom ? p.testeurNom[0].toUpperCase() : "T"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-navy-900">{p.testeurNom}</p>
                            <p className="text-[11px] text-slate-400">{p.testeurEmail}</p>
                            {p.testeurTelephone && (
                              <p className="text-[10px] text-slate-400">{p.testeurTelephone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mission */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                            {logoUrl ? (
                              <img src={logoUrl} alt={p.application} className="h-full w-full object-cover" />
                            ) : (
                              <Smartphone size={14} className="text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-navy-900 line-clamp-1">{p.missionTitre}</p>
                            <p className="text-[11px] text-slate-400">App: {p.application}</p>
                          </div>
                        </div>
                      </td>

                      {/* Progression Quotidienne */}
                      <td className="px-5 py-3.5 min-w-[190px]">
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                            <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-bold">
                              Jour {p.jourActuel || 1} / {p.totalJours || 1} {isFinished ? "✓" : ""}
                            </span>
                            <span className="text-slate-500 font-medium">
                              {p.etapesCompletees} / {p.etapesTotal || 1} tâches
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFinished
                                  ? "bg-emerald-500"
                                  : isLate
                                  ? "bg-rose-500"
                                  : "bg-brand-orange"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, p.progression))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Statut Badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold ${
                            isPending
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : isInProgress
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : isLate
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : isFinished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isAbandoned
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : isRefused
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isPending && <Clock size={12} />}
                          {isInProgress && <CheckCircle2 size={12} />}
                          {isLate && <AlertTriangle size={12} />}
                          {isFinished && <Check size={12} />}
                          {isPending
                            ? "Candidature en attente"
                            : isInProgress
                            ? "En cours de test"
                            : isLate
                            ? "En retard"
                            : isFinished
                            ? "Test validé & terminé"
                            : isAbandoned
                            ? "Abandonné"
                            : isRefused
                            ? "Refusé"
                            : p.statut}
                        </span>
                      </td>

                      {/* Contrat */}
                      <td className="px-5 py-3.5">
                        {p.contratAccepte ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <ShieldCheck size={13} />
                            Accepté
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            Non signé
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleAccept(p.id, p.testeurNom)}
                                disabled={actionId === p.id}
                                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                              >
                                <Check size={12} />
                                <span>Accepter</span>
                              </button>
                              <button
                                onClick={() => handleRefuse(p.id, p.testeurNom)}
                                disabled={actionId === p.id}
                                className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 transition"
                              >
                                <X size={12} />
                                <span>Refuser</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleInspect(p.id)}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                          >
                            <Eye size={12} />
                            <span>Inspecter les étapes</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL INSPECTION DES RÉFÉRENCES ET VALIDATION - PARFAITEMENT CENTRÉ */}
      {inspectModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Fixe */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 bg-white shrink-0">
              <div>
                <h3 className="font-bold text-lg text-navy-900">
                  Validation des Étapes & Références Soumises
                </h3>
                <p className="text-xs text-slate-500">
                  Vérifiez les codes attendus et les réponses saisies par le testeur pour chaque journée.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {inspectLoading ? (
              <div className="flex h-56 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
              </div>
            ) : !inspectDetail ? (
              <p className="p-8 text-center text-xs text-slate-500">
                Impossible de charger les détails de cette participation.
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
                {/* Résumé Testeur & Mission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs">
                  <div className="flex items-start gap-3">
                    {inspectDetail.testeur.photo ? (
                      <img
                        src={getImageUrl(inspectDetail.testeur.photo)}
                        alt={inspectDetail.testeur.nom}
                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200 shadow-2xs mt-0.5"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange mt-0.5">
                        {inspectDetail.testeur.nom ? inspectDetail.testeur.nom[0].toUpperCase() : "T"}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Profil du testeur
                      </span>
                      <p className="font-bold text-navy-900 text-sm">{inspectDetail.testeur.nom}</p>
                      <p className="text-slate-500">{inspectDetail.testeur.email}</p>
                      {inspectDetail.testeur.telephone && (
                        <p className="text-slate-500">{inspectDetail.testeur.telephone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Mission concernée
                    </span>
                    <p className="font-bold text-navy-900 text-sm">{inspectDetail.mission.titre}</p>
                    <p className="text-slate-500">App: {inspectDetail.mission.application}</p>
                    <p className="text-slate-500">
                      Statut: <strong>{inspectDetail.statut}</strong> • Progression:{" "}
                      <strong>{inspectDetail.progression}%</strong>
                    </p>
                  </div>
                </div>

                {/* Changement de statut manuel */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-xs">
                  <span className="font-bold text-slate-700">Modifier le statut de la participation :</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["en_cours", "en_retard", "terminee", "abandonnee"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(inspectDetail.id, st)}
                        className={`rounded-xl px-3 py-1 text-[11px] font-semibold transition ${
                          inspectDetail.statut === st
                            ? "bg-brand-orange text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st === "en_cours"
                          ? "En cours"
                          : st === "en_retard"
                          ? "En retard"
                          : st === "terminee"
                          ? "Terminée ✓"
                          : "Abandonnée"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Liste des étapes et des codes saisis */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Détail des étapes & Codes de validation
                  </h4>

                  {inspectDetail.etapes.length === 0 ? (
                    <p className="text-xs text-slate-400">Aucune étape enregistrée pour cette mission.</p>
                  ) : (
                    <div className="space-y-3">
                      {inspectDetail.etapes.map((step) => {
                        const isMatch =
                          step.referenceAttendue &&
                          step.referenceSaisie &&
                          step.referenceAttendue.trim().toUpperCase() ===
                            step.referenceSaisie.trim().toUpperCase();

                        const isValidated = step.statutValidation === "validee";
                        const isSubmitted = !!step.referenceSaisie;

                        return (
                          <div
                            key={step.id}
                            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="rounded-md bg-navy-900 px-2 py-0.5 text-[10px] font-bold text-white">
                                  Jour {step.jour}
                                </span>
                                <p className="font-bold text-xs text-navy-900">{step.titre}</p>
                              </div>

                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  isValidated || isMatch
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : isSubmitted
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {isValidated || isMatch
                                  ? "Validé"
                                  : isSubmitted
                                  ? "En attente vérif"
                                  : "Non soumis"}
                              </span>
                            </div>

                            {step.instruction && (
                              <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                                {step.instruction}
                              </p>
                            )}

                            {/* Données de référence */}
                            {step.besoinReference ? (
                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                                    Code attendu (configuré)
                                  </span>
                                  <code className="rounded bg-white px-2 py-1 font-mono font-bold text-brand-orange border border-slate-200 inline-block">
                                    {step.referenceAttendue || "Aucun code fixé"}
                                  </code>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                                    Code saisi par le testeur
                                  </span>
                                  {step.referenceSaisie ? (
                                    <div className="flex items-center gap-1.5">
                                      <code className="rounded bg-white px-2 py-1 font-mono font-bold text-navy-900 border border-slate-200 inline-block">
                                        {step.referenceSaisie}
                                      </code>
                                      {isMatch ? (
                                        <CheckCircle2 size={15} className="text-emerald-500" />
                                      ) : (
                                        <AlertCircle size={15} className="text-rose-500" />
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-slate-400 italic">
                                      Pas encore saisi
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 text-[11px] text-slate-400">
                                Cette étape ne nécessite pas de code de référence.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pied de page fixe */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="rounded-xl bg-navy-900 px-5 py-2 text-xs font-bold text-white hover:bg-navy-800 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Confirmation Élégant */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        confirmText={confirmConfig.confirmText}
        loading={actionId !== null}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}

export default function AdminParticipationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Chargement...</div>}>
      <AdminParticipationsContent />
    </Suspense>
  );
}
