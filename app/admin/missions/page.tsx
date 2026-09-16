"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Key,
  Smartphone,
  Calendar,
  Layers,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Edit3,
  Archive,
  PauseCircle,
  PlayCircle,
  Clock,
  FileText,
  DollarSign,
  ListTodo,
  CheckSquare,
  Search,
  Upload,
  ArrowRight,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import {
  adminApi,
  applicationsApi,
  type AdminMission,
  type MissionPayload,
  type ApplicationItem,
} from "@/lib/api";
import ConfirmModal, { type ConfirmVariant } from "@/components/ui/ConfirmModal";

type TodoStep = {
  jour: number;
  ordre: number;
  titre: string;
  instruction: string;
  besoinReference: boolean;
  referenceCode: string;
  resultatAttendu: string;
  dureeEstimee: string;
};

export default function AdminMissionsPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [missions, setMissions] = useState<AdminMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State (Create / Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "programme">("general");
  const [selectedDayTab, setSelectedDayTab] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
    variant: "danger",
    confirmText: "Supprimer",
    onConfirm: async () => {},
  });

  // Form Fields
  const [registeredApps, setRegisteredApps] = useState<ApplicationItem[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [titre, setTitre] = useState("");
  const [application, setApplication] = useState("");
  const [versionApplication, setVersionApplication] = useState("1.0.0");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [lienApplication, setLienApplication] = useState("");
  const [dureEstime, setDureEstime] = useState("12 jours");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [remuneration, setRemuneration] = useState("5000");
  const [nombreParticipantsSouhaites, setNombreParticipantsSouhaites] = useState(12);
  const [description, setDescription] = useState("");
  const [objectif, setObjectif] = useState("");
  const [conditionsParticipation, setConditionsParticipation] = useState(
    "1. Le testeur s'engage à effectuer l'ensemble des tâches quotidiennes prévues dans le programme.\n2. Chaque étape nécessitant une référence doit être validée avant 23h59 le jour même.\n3. Toute tentative de falsification ou de partage des identifiants entraîne la résiliation immédiate de la mission sans indemnité."
  );
  const [statut, setStatut] = useState("disponible");
  const [etapes, setEtapes] = useState<TodoStep[]>([
    {
      jour: 1,
      ordre: 1,
      titre: "Téléchargement & Création de compte",
      instruction: "Installez l'application via le lien officiel, créez un compte avec vos identifiants réels.",
      besoinReference: true,
      referenceCode: "SAMRE-J1-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      resultatAttendu: "Capture d'écran du profil créé",
      dureeEstimee: "20 min",
    },
    {
      jour: 1,
      ordre: 2,
      titre: "Exploration du menu principal",
      instruction: "Parcourez les différents onglets de navigation et testez la recherche.",
      besoinReference: false,
      referenceCode: "",
      resultatAttendu: "Vérifier la fluidité",
      dureeEstimee: "15 min",
    },
    {
      jour: 2,
      ordre: 1,
      titre: "Test de parcours transactionnel",
      instruction: "Effectuez une simulation d'opération dans l'application et saisissez la référence demandée.",
      besoinReference: true,
      referenceCode: "SAMRE-J2-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      resultatAttendu: "Validation du code de sécurité",
      dureeEstimee: "30 min",
    },
  ]);

  const loadMissions = async () => {
    setLoading(true);
    try {
      const [resMissions, resApps] = await Promise.allSettled([
        adminApi.missions(),
        applicationsApi.list(),
      ]);
      if (resMissions.status === "fulfilled") setMissions(resMissions.value || []);
      if (resApps.status === "fulfilled") setRegisteredApps(resApps.value || []);
    } catch (err) {
      console.error("Erreur chargement missions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadMissions();
  }, []);

  useEffect(() => {
    if (!mounted || registeredApps.length === 0) return;
    const appIdParam = searchParams.get("appId");
    if (appIdParam) {
      const targetApp = registeredApps.find((a) => a.id === parseInt(appIdParam));
      if (targetApp) {
        openCreateModal(targetApp);
        return;
      }
    }
    if (searchParams.get("create") === "true") {
      openCreateModal();
    }
  }, [searchParams, mounted, registeredApps]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setErrorMsg("");
    try {
      const res = await adminApi.uploadImage(file);
      if (res.url) {
        setImage(res.url);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de l'upload de l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = (initialApp?: ApplicationItem | unknown) => {
    setEditingId(null);
    if (initialApp && typeof initialApp === "object" && "nom" in initialApp) {
      const app = initialApp as ApplicationItem;
      setSelectedAppId(app.id);
      setTitre(`Campagne de Test - ${app.nom}`);
      setApplication(app.nom);
      setVersionApplication(app.version || "1.0.0");
      setImage(app.logo || "");
      setLienApplication(app.lienTelechargement || "");
      setDureEstime(`${app.dureeJoursDefaut || 12} jours`);
      setNombreParticipantsSouhaites(app.nbMaxPanelistes || 12);
      setDescription(app.description || "Mission d'évaluation et de test sur application mobile.");
      setObjectif("Tester les fonctionnalités clés et valider le cycle quotidien sur 12 jours.");
    } else {
      setSelectedAppId(null);
      setTitre("");
      setApplication("");
      setVersionApplication("1.0.0");
      setImage("");
      setLienApplication("");
      setDureEstime("12 jours");
      setNombreParticipantsSouhaites(12);
      setDescription("");
      setObjectif("");
    }
    setDateDebut(new Date().toISOString().split("T")[0]);
    const dFin = new Date();
    dFin.setDate(dFin.getDate() + 12);
    setDateFin(dFin.toISOString().split("T")[0]);
    setRemuneration("5000");
    setStatut("disponible");
    setEtapes([
      {
        jour: 1,
        ordre: 1,
        titre: "Téléchargement & Exploration",
        instruction: "Téléchargez l'application et parcourez l'écran de bienvenue.",
        besoinReference: true,
        referenceCode: "SAMRE-J1-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
        resultatAttendu: "Validation de l'ouverture",
        dureeEstimee: "25 min",
      },
    ]);
    setSelectedDayTab(1);
    setModalTab("general");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  const openEditModal = (m: AdminMission) => {
    setEditingId(m.id);
    setSelectedAppId(m.applicationId || null);
    setTitre(m.titre);
    setApplication(m.application);
    setVersionApplication(m.versionApplication || "1.0.0");
    setImage(m.image || "");
    setLienApplication(m.lienApplication || "");
    setDureEstime(m.dureEstime || "12 jours");
    setDateDebut(m.dateDebut || "");
    setDateFin(m.dateFin || "");
    setRemuneration(m.remuneration || "0");
    setNombreParticipantsSouhaites((m as any).nombreParticipantsSouhaites || 12);
    setDescription(m.description || "");
    setObjectif(m.objectif || "");
    setConditionsParticipation(m.conditionsParticipation || "");
    setStatut(m.statut || "disponible");

    if (m.etapes && m.etapes.length > 0) {
      setEtapes(
        m.etapes.map((e) => ({
          jour: e.jour || 1,
          ordre: e.ordre || 1,
          titre: e.titre,
          instruction: e.instruction || "",
          besoinReference: e.besoinReference,
          referenceCode: e.codeReference || "",
          resultatAttendu: e.resultatAttendu || "Validé",
          dureeEstimee: e.dureeEstimee || "30 min",
        }))
      );
    } else {
      setEtapes([
        {
          jour: 1,
          ordre: 1,
          titre: "Étape initiale",
          instruction: "Suivez les consignes de test.",
          besoinReference: true,
          referenceCode: "SAMRE-J1-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
          resultatAttendu: "Validé",
          dureeEstimee: "30 min",
        },
      ]);
    }
    setSelectedDayTab(1);
    setModalTab("general");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  const maxJourInForm = Math.max(1, ...etapes.map((e) => e.jour));

  const addDay = () => {
    const nextDay = maxJourInForm + 1;
    setEtapes((prev) => [
      ...prev,
      {
        jour: nextDay,
        ordre: 1,
        titre: `Tâche du Jour ${nextDay}`,
        instruction: "Décrivez les instructions spécifiques à cette journée de travail.",
        besoinReference: true,
        referenceCode: `SAMRE-J${nextDay}-` + Math.random().toString(36).substring(2, 6).toUpperCase(),
        resultatAttendu: "Étape du jour validée",
        dureeEstimee: "30 min",
      },
    ]);
    setSelectedDayTab(nextDay);
  };

  const addTaskToDay = (jour: number) => {
    const currentDayTasks = etapes.filter((e) => e.jour === jour);
    const nextOrdre = currentDayTasks.length + 1;
    setEtapes((prev) => [
      ...prev,
      {
        jour,
        ordre: nextOrdre,
        titre: `Nouvelle tâche ${jour}.${nextOrdre}`,
        instruction: "Détaillez les actions attendues par le testeur.",
        besoinReference: true,
        referenceCode: `SAMRE-J${jour}-` + Math.random().toString(36).substring(2, 6).toUpperCase(),
        resultatAttendu: "Validation opérationnelle",
        dureeEstimee: "20 min",
      },
    ]);
  };

  const removeTask = (indexToRemove: number) => {
    if (etapes.length <= 1) {
      alert("Une mission doit comporter au moins une tâche.");
      return;
    }
    setEtapes((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const updateTask = (index: number, field: keyof TodoStep, value: any) => {
    setEtapes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveMission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    const payload: MissionPayload = {
      titre: titre.trim(),
      application: application.trim(),
      applicationId: selectedAppId || undefined,
      versionApplication: versionApplication.trim(),
      platforme: "Android",
      image: image.trim() || null,
      lienApplication: lienApplication.trim(),
      dureEstime: dureEstime.trim(),
      remuneration,
      nombreParticipantsSouhaites: Number(nombreParticipantsSouhaites) || 12,
      description: description.trim(),
      objectif: objectif.trim(),
      conditionsParticipation: conditionsParticipation.trim(),
      statut,
      dateDebut,
      dateFin,
      etapes,
    };

    try {
      if (editingId) {
        await adminApi.updateMission(editingId, payload);
        setSuccessMsg("Mission mise à jour avec succès !");
      } else {
        await adminApi.createMission(payload);
        setSuccessMsg("Mission créée et publiée avec succès !");
      }
      await loadMissions();
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, newStatut: string) => {
    try {
      await adminApi.changeMissionStatus(id, newStatut);
      await loadMissions();
    } catch (err: any) {
      alert("Erreur lors du changement de statut: " + err.message);
    }
  };

  const handleDelete = (id: number, titre: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Supprimer la mission",
      message: `Voulez-vous supprimer définitivement la mission « ${titre} » et toutes ses données associées (tâches, participations) ? Cette action est irréversible.`,
      variant: "danger",
      confirmText: "Supprimer définitivement",
      onConfirm: async () => {
        try {
          await adminApi.deleteMission(id);
          await loadMissions();
        } catch (err: any) {
          console.error("Erreur suppression:", err);
        } finally {
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  // Filtrage des missions
  const filteredMissions = missions.filter((m) => {
    const matchStatus = statusFilter === "tous" || m.statut === statusFilter;
    const matchQuery =
      searchQuery === "" ||
      m.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.application.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Missions & Programme de Test
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
              <Smartphone size={12} />
              Android
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Configurez les applications Android à tester, les contrats et le programme de test structuré jour par jour avec codes de validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadMissions}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-brand-orange" : ""} />
            <span>Actualiser</span>
          </button>
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-sm shadow-brand-orange/25 hover:bg-brand-orange/90 transition"
          >
            <Plus size={15} />
            <span>Créer une mission</span>
          </button>
        </div>
      </div>

      {/* Barre de Filtres & Recherche */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre de mission ou application..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-brand-orange focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "tous", label: "Toutes" },
            { id: "disponible", label: "Disponibles" },
            { id: "en_cours", label: "En cours" },
            { id: "suspendue", label: "Suspendues" },
            { id: "terminee", label: "Terminées" },
            { id: "archivee", label: "Archivées" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                statusFilter === f.id
                  ? "bg-navy-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des Missions */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange mb-2" />
          <p className="text-xs">Chargement du catalogue des missions...</p>
        </div>
      ) : filteredMissions.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
          <Smartphone size={36} className="mx-auto text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-navy-900">Aucune mission trouvée</h3>
          <p className="mt-1 text-xs text-slate-400">
            {searchQuery || statusFilter !== "tous"
              ? "Aucune mission ne correspond à vos filtres actuels."
              : "Créez votre première mission de test Android pour commencer."}
          </p>
          <button
            onClick={() => openCreateModal()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-orange/90 transition"
          >
            <Plus size={14} />
            <span>Créer une mission</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMissions.map((m) => {
            const isExpanded = expandedId === m.id;

            // Groupement des étapes par jour
            const daysMap: Record<number, typeof m.etapes> = {};
            (m.etapes || []).forEach((e) => {
              const j = e.jour || 1;
              if (!daysMap[j]) daysMap[j] = [];
              daysMap[j].push(e);
            });
            const sortedDays = Object.keys(daysMap)
              .map(Number)
              .sort((a, b) => a - b);

            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const logoUrl = m.image
              ? m.image.startsWith("http")
                ? m.image
                : `${apiBase}${m.image}`
              : null;

            return (
              <div
                key={m.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition hover:border-slate-200"
              >
                {/* Ligne principale */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Bloc Info */}
                    <div className="flex items-start gap-4">
                      {/* Vignette Logo App */}
                      <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-xs">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={m.application}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Smartphone size={24} className="text-brand-orange" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-navy-900">{m.titre}</h3>
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <Smartphone size={10} />
                            Android
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              m.statut === "disponible"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : m.statut === "en_cours"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : m.statut === "suspendue"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : m.statut === "terminee"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {m.statut === "disponible"
                              ? "Disponible (ouverte)"
                              : m.statut === "en_cours"
                              ? "En cours de test"
                              : m.statut === "suspendue"
                              ? "Suspendue"
                              : m.statut === "terminee"
                              ? "Terminée"
                              : m.statut === "archivee"
                              ? "Archivée"
                              : m.statut}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          App: <strong className="text-navy-900 font-semibold">{m.application}</strong> (v{m.versionApplication || "1.0.0"}) • <strong className="text-navy-900 font-semibold">{m.nombreParticipants || 0} / {m.nombreParticipantsSouhaites || 20}</strong> testeurs requis
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Clock size={13} className="text-slate-400" />
                            Programme: {sortedDays.length || 1} jour{sortedDays.length > 1 ? "s" : ""} ({m.nombreEtapes || 0} tâches) • {m.dureEstime}
                          </span>
                          {m.dateDebut && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={13} className="text-slate-400" />
                              Du {m.dateDebut} au {m.dateFin || "..."}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                            <DollarSign size={13} />
                            {m.remuneration ? `${m.remuneration} FCFA` : "Gratuit"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions sur la mission */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 lg:border-t-0 lg:pt-0">
                      {/* Bascule de statut rapide */}
                      {m.statut !== "disponible" && (
                        <button
                          onClick={() => handleStatusChange(m.id, "disponible")}
                          title="Publier la mission"
                          className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          <PlayCircle size={14} />
                          <span>Publier</span>
                        </button>
                      )}

                      {m.statut === "disponible" && (
                        <button
                          onClick={() => handleStatusChange(m.id, "suspendue")}
                          title="Suspendre la mission"
                          className="flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                        >
                          <PauseCircle size={14} />
                          <span>Suspendre</span>
                        </button>
                      )}

                      {m.statut !== "terminee" && (
                        <button
                          onClick={() => handleStatusChange(m.id, "terminee")}
                          title="Clôturer la mission"
                          className="flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                        >
                          <CheckCircle2 size={14} />
                          <span>Terminer</span>
                        </button>
                      )}

                      {m.statut !== "archivee" && (
                        <button
                          onClick={() => handleStatusChange(m.id, "archivee")}
                          title="Archiver la mission"
                          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                          <Archive size={14} />
                          <span>Archiver</span>
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(m)}
                        title="Modifier le contenu & Programme"
                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-slate-50 transition shadow-xs"
                      >
                        <Edit3 size={14} />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => handleDelete(m.id, m.titre)}
                        title="Supprimer la mission"
                        className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 transition"
                      >
                        <Trash2 size={15} />
                      </button>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : m.id)}
                        className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                      >
                        <ListTodo size={14} />
                        <span>{isExpanded ? "Masquer le programme" : "Voir le programme"}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section dépliante : Programme par journée */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Programme Quotidien des Journées de Test (Android)
                      </h4>
                      {m.lienApplication && (
                        <a
                          href={m.lienApplication}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-orange hover:underline font-medium"
                        >
                          <ExternalLink size={12} />
                          Ouvrir le lien de l&apos;application (Google Play / APK)
                        </a>
                      )}
                    </div>

                    {/* Conditions et Contrat */}
                    {m.conditionsParticipation && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-bold text-navy-900 mb-1">
                          <FileText size={14} className="text-brand-orange" />
                          Conditions & Contrat d&apos;engagement requis :
                        </div>
                        <p className="whitespace-pre-line text-slate-500 leading-relaxed">
                          {m.conditionsParticipation}
                        </p>
                      </div>
                    )}

                    {/* Grille des journées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedDays.map((jour) => {
                        const tasks = daysMap[jour] || [];
                        return (
                          <div
                            key={jour}
                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                              <span className="font-bold text-xs uppercase tracking-wider text-brand-orange">
                                Jour {jour}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                {tasks.length} tâche{tasks.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="space-y-3 flex-1">
                              {tasks.map((t, idx) => (
                                <div
                                  key={t.id || idx}
                                  className="rounded-lg bg-slate-50/70 p-2.5 text-xs border border-slate-100 space-y-1.5"
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <h5 className="font-bold text-navy-900 line-clamp-1">
                                      {t.ordre}. {t.titre}
                                    </h5>
                                    {t.dureeEstimee && (
                                      <span className="text-[10px] text-slate-400 shrink-0">
                                        {t.dureeEstimee}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                    {t.instruction}
                                  </p>
                                  {t.besoinReference && (
                                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-brand-orange pt-1 border-t border-slate-100">
                                      <Key size={12} />
                                      <span>Code attendu : {t.codeReference || "Non configuré"}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CRÉATION / ÉDITION DE MISSION - PARFAITEMENT CENTRÉ VIA PORTAL */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal Fixe */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 bg-white shrink-0">
              <div>
                <h2 className="font-bold text-lg text-navy-900">
                  {editingId ? "Modifier la mission" : "Créer une nouvelle mission de test"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Application Android, contrat et programme quotidien de test.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Onglets du Modal */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-6 sm:px-8 pt-3 pb-0 bg-slate-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setModalTab("general")}
                className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                  modalTab === "general"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                1. Détails de l&apos;App & Contrat
              </button>
              <button
                type="button"
                onClick={() => setModalTab("programme")}
                className={`pb-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                  modalTab === "programme"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ListTodo size={14} />
                2. Programme de test ({maxJourInForm} j / {etapes.length} tâches)
              </button>
            </div>

            {/* Alertes erreurs / succès */}
            {errorMsg && (
              <div className="mx-6 sm:mx-8 mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 shrink-0">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mx-6 sm:mx-8 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 shrink-0">
                {successMsg}
              </div>
            )}

            {/* Formulaire avec scroll interne */}
            <form onSubmit={handleSaveMission} className="flex-1 overflow-y-auto flex flex-col">
              <div className="flex-1 p-6 sm:p-8 space-y-4">
                {modalTab === "general" ? (
                  <div className="space-y-4">
                    {/* Logo de l'application - Bien centré */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col items-center text-center">
                      <label className="block text-xs font-bold text-slate-800 mb-3">
                        Logo / Image de l&apos;application
                      </label>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-lg">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shadow-sm">
                          {image ? (
                            <img
                              src={
                                image.startsWith("http")
                                  ? image
                                  : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${image}`
                              }
                              alt="Logo preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Smartphone size={28} className="text-slate-400" />
                          )}
                          {uploadingImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                              <Loader2 size={18} className="animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2.5 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-navy-900 transition">
                              <Upload size={14} className="text-brand-orange" />
                              <span>{uploadingImage ? "Téléversement..." : "Téléverser un logo"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                              />
                            </label>
                            {image && (
                              <button
                                type="button"
                                onClick={() => setImage("")}
                                className="text-xs font-medium text-rose-500 hover:underline"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Ou collez une URL directe d'image (ex: https://...)"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-brand-orange text-center sm:text-left"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Titre de la mission *
                        </label>
                        <input
                          type="text"
                          required
                          value={titre}
                          onChange={(e) => setTitre(e.target.value)}
                          placeholder="Ex: Test du parcours de paiement Wave"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Sélectionner une Application Enregistrée (Recommandé)
                          </label>
                          <select
                            value={selectedAppId || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                setSelectedAppId(null);
                              } else {
                                const found = registeredApps.find((a) => a.id === parseInt(val));
                                if (found) {
                                  setSelectedAppId(found.id);
                                  setApplication(found.nom);
                                  setVersionApplication(found.version || "1.0.0");
                                  setLienApplication(found.lienTelechargement || "");
                                  setDureEstime(`${found.dureeJoursDefaut || 12} jours`);
                                  setNombreParticipantsSouhaites(found.nbMaxPanelistes || 12);
                                  if (found.logo) setImage(found.logo);
                                  if (!titre.trim()) setTitre(`Campagne de Test - ${found.nom}`);
                                }
                              }
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange text-slate-800"
                          >
                            <option value="">-- Choisir une application enregistrée --</option>
                            {registeredApps.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.nom} ({a.plateforme} v{a.version}) • Clé SDK liée
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nom de l'application affiché *
                          </label>
                          <input
                            type="text"
                            required
                            value={application}
                            onChange={(e) => setApplication(e.target.value)}
                            placeholder="Ex: Wave CI, Yassir, Moov Money"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                          />
                          {selectedAppId && (
                            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              Clé SDK liée & cycle quotidien sur {dureEstime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Plateforme Android Exclusive */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Plateforme supportée
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs font-bold text-emerald-800">
                          <Smartphone size={16} className="text-emerald-600 shrink-0" />
                          <span>Android</span>
                        </div>
                      </div>

                      {/* Nombre de testeurs requis */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Testeurs requis *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            required
                            value={nombreParticipantsSouhaites}
                            onChange={(e) => setNombreParticipantsSouhaites(parseInt(e.target.value) || 1)}
                            placeholder="Ex: 50"
                            className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2.5 text-xs outline-none focus:border-brand-orange font-semibold text-slate-800"
                          />
                          <Users size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Version de l&apos;App
                        </label>
                        <input
                          type="text"
                          value={versionApplication}
                          onChange={(e) => setVersionApplication(e.target.value)}
                          placeholder="Ex: 1.0.0 ou Beta 2"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Rémunération (FCFA)
                        </label>
                        <input
                          type="number"
                          value={remuneration}
                          onChange={(e) => setRemuneration(e.target.value)}
                          placeholder="Ex: 5000"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lien Google Play Store ou APK (Android) *
                      </label>
                      <input
                        type="url"
                        required
                        value={lienApplication}
                        onChange={(e) => setLienApplication(e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=... ou lien direct APK"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Durée de la mission
                        </label>
                        <input
                          type="text"
                          value={dureEstime}
                          onChange={(e) => setDureEstime(e.target.value)}
                          placeholder="Ex: 14 jours"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Date de début
                        </label>
                        <input
                          type="date"
                          value={dateDebut}
                          onChange={(e) => setDateDebut(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          value={dateFin}
                          onChange={(e) => setDateFin(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-brand-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description de la mission
                      </label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Expliquez brièvement le contexte et le but de ce test..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Objectifs principaux du test
                      </label>
                      <input
                        type="text"
                        value={objectif}
                        onChange={(e) => setObjectif(e.target.value)}
                        placeholder="Ex: Valider la fluidité de la commande et la réception du SMS"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Conditions & Contrat d&apos;engagement du testeur
                      </label>
                      <textarea
                        rows={3}
                        value={conditionsParticipation}
                        onChange={(e) => setConditionsParticipation(e.target.value)}
                        placeholder="Clauses et obligations que le testeur doit obligatoirement accepter avant de commencer..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-brand-orange font-mono"
                      />
                    </div>

                    {/* Bouton Suivant vers le Programme Jour par Jour */}
                    <div className="pt-2 flex justify-start">
                      <button
                        type="button"
                        onClick={() => setModalTab("programme")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                      >
                        <span>Suivant : Configurer le programme jour par jour</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ONGLET 2 : PROGRAMME JOUR PAR JOUR */
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Programme de Test Quotidien (Jour par Jour)
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Configurez les journées de travail (Jour 1, Jour 2...). Les codes secrets sont générés automatiquement par algorithme.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addDay}
                        className="flex items-center gap-1.5 rounded-xl bg-brand-orange/10 px-3 py-1.5 text-xs font-bold text-brand-orange hover:bg-brand-orange/20 transition shrink-0"
                      >
                        <Plus size={13} />
                        <span>Ajouter un jour au programme</span>
                      </button>
                    </div>

                    {/* Sélecteur de jour */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {Array.from({ length: maxJourInForm }, (_, i) => i + 1).map((j) => {
                        const countForDay = etapes.filter((e) => e.jour === j).length;
                        return (
                          <button
                            key={j}
                            type="button"
                            onClick={() => setSelectedDayTab(j)}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                              selectedDayTab === j
                                ? "bg-navy-900 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            <span>Jour {j}</span>
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[9px] ${
                                selectedDayTab === j
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {countForDay}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Tâches du jour sélectionné */}
                    <div className="space-y-4">
                      {etapes
                        .map((task, originalIndex) => ({ task, originalIndex }))
                        .filter(({ task }) => task.jour === selectedDayTab)
                        .map(({ task, originalIndex }, localIdx) => (
                          <div
                            key={originalIndex}
                            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-navy-900">
                                Tâche {task.ordre || localIdx + 1} du Jour {selectedDayTab}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeTask(originalIndex)}
                                className="text-slate-400 hover:text-rose-500 transition p-1"
                                title="Supprimer cette tâche"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Titre de la tâche *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={task.titre}
                                  onChange={(e) =>
                                    updateTask(originalIndex, "titre", e.target.value)
                                  }
                                  placeholder="Ex: Installer l'application et créer un compte"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand-orange"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Durée estimée de l&apos;action
                                </label>
                                <input
                                  type="text"
                                  value={task.dureeEstimee}
                                  onChange={(e) =>
                                    updateTask(originalIndex, "dureeEstimee", e.target.value)
                                  }
                                  placeholder="Ex: 20 min"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand-orange"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Consignes / Instructions détaillées *
                              </label>
                              <textarea
                                rows={2}
                                required
                                value={task.instruction}
                                onChange={(e) =>
                                  updateTask(originalIndex, "instruction", e.target.value)
                                }
                                placeholder="Détaillez précisément ce que le testeur doit faire sur l'application Android..."
                                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-brand-orange"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Résultat attendu / Preuve
                              </label>
                              <input
                                type="text"
                                value={task.resultatAttendu}
                                onChange={(e) =>
                                  updateTask(originalIndex, "resultatAttendu", e.target.value)
                                }
                                placeholder="Ex: Capture d'écran du paiement réussi ou code secret validé"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-brand-orange"
                              />
                            </div>

                            {/* Section Code de validation automatique */}
                            <div className="rounded-xl border border-slate-100 bg-white p-3 space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={task.besoinReference}
                                  onChange={(e) =>
                                    updateTask(originalIndex, "besoinReference", e.target.checked)
                                  }
                                  className="h-4 w-4 rounded text-brand-orange focus:ring-brand-orange"
                                />
                                <span className="text-xs font-bold text-slate-700">
                                  Cette tâche nécessite une référence secrète de validation
                                </span>
                              </label>

                              {task.besoinReference && (
                                <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                  <div className="flex-1 flex items-center gap-2">
                                    <Key size={14} className="text-brand-orange shrink-0" />
                                    <input
                                      type="text"
                                      value={task.referenceCode}
                                      onChange={(e) =>
                                        updateTask(originalIndex, "referenceCode", e.target.value)
                                      }
                                      placeholder="Ex: SAMRE-J1-XXXX"
                                      className="w-full font-mono font-bold text-xs uppercase rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 text-navy-900 outline-none focus:border-brand-orange"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateTask(
                                        originalIndex,
                                        "referenceCode",
                                        `SAMRE-J${task.jour}-` + Math.random().toString(36).substring(2, 6).toUpperCase()
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition shrink-0"
                                  >
                                    <RefreshCw size={11} />
                                    <span>Générer un code automatique</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                      <button
                        type="button"
                        onClick={() => addTaskToDay(selectedDayTab)}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-xs font-bold text-slate-600 hover:border-brand-orange hover:text-brand-orange transition"
                      >
                        <Plus size={14} />
                        <span>Ajouter une tâche au Jour {selectedDayTab}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pied de Page Modal Fixe */}
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
                <span className="text-[11px] text-slate-400">
                  {etapes.length} tâche{etapes.length > 1 ? "s" : ""} répartie{etapes.length > 1 ? "s" : ""} sur {maxJourInForm} jour{maxJourInForm > 1 ? "s" : ""}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-orange/90 transition disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {editingId ? "Enregistrer les modifications" : "Créer et publier la mission"}
                  </button>
                </div>
              </div>
            </form>
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
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}
