"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Plus,
  Search,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Key,
  ShieldCheck,
  Users,
  Calendar,
  Layers,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Play,
  Clock,
  Terminal,
  Send,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Link as LinkIcon,
  X,
  FileCode,
  Laptop,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import {
  applicationsApi,
  sdkApi,
  adminApi,
  getImageUrl,
  type ApplicationItem,
  type ApplicationPayload,
  type ApplicationDetail,
} from "@/lib/api";
import ConfirmModal, { type ConfirmVariant } from "@/components/ui/ConfirmModal";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [platformFilter, setPlatformFilter] = useState("tous");

  // Notifications feedback
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  // Modal Create/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [plateforme, setPlateforme] = useState("Android");
  const [version, setVersion] = useState("1.0.0");
  const [lienTelechargement, setLienTelechargement] = useState("");
  const [developpeurNom, setDeveloppeurNom] = useState("");
  const [developpeurEmail, setDeveloppeurEmail] = useState("");
  const [dureeJoursDefaut, setDureeJoursDefaut] = useState(12);
  const [nbMaxPanelistes, setNbMaxPanelistes] = useState(12);
  const [statut, setStatut] = useState("en_attente_integration");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Veuillez sélectionner un fichier image valide (PNG, JPG, WebP, SVG).");
      return;
    }
    try {
      setUploadingLogo(true);
      setErrorMsg("");
      const res = await adminApi.uploadImage(file);
      setLogo(res.url);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors du téléversement du logo.");
    } finally {
      setUploadingLogo(false);
      if (e.target) e.target.value = "";
    }
  };

  // Drawer / Modal SDK Details & Simulator
  const [selectedApp, setSelectedApp] = useState<ApplicationDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [visibleKeyId, setVisibleKeyId] = useState<number | null>(null);
  const [sdkSnippetTab, setSdkSnippetTab] = useState<"flutter" | "kotlin" | "curl">("flutter");

  // Simulator state
  const [simTesterId, setSimTesterId] = useState("");
  const [simCode, setSimCode] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    success: boolean;
    message: string;
    jour?: number;
    progression?: number;
  } | null>(null);

  // Confirm Modal
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

  const loadApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await applicationsApi.list();
      setApps(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de charger les applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadApplications();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setNom("");
    setDescription("");
    setLogo("");
    setPlateforme("Android");
    setVersion("1.0.0");
    setLienTelechargement("");
    setDeveloppeurNom("");
    setDeveloppeurEmail("");
    setDureeJoursDefaut(12);
    setNbMaxPanelistes(12);
    setStatut("en_attente_integration");
    setShowModal(true);
  };

  const handleOpenEditModal = (app: ApplicationItem) => {
    setEditingId(app.id);
    setNom(app.nom);
    setDescription(app.description || "");
    setLogo(app.logo || "");
    setPlateforme(app.plateforme || "Android");
    setVersion(app.version || "1.0.0");
    setLienTelechargement(app.lienTelechargement || "");
    setDeveloppeurNom(app.developpeurNom || "");
    setDeveloppeurEmail(app.developpeurEmail || "");
    setDureeJoursDefaut(app.dureeJoursDefaut || 12);
    setNbMaxPanelistes(app.nbMaxPanelistes || 12);
    setStatut(app.statut || "active");
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setErrorMsg("Le nom de l'application est requis.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload: ApplicationPayload = {
      nom: nom.trim(),
      description: description.trim(),
      logo: logo.trim(),
      plateforme,
      version,
      lienTelechargement: lienTelechargement.trim(),
      developpeurNom: developpeurNom.trim(),
      developpeurEmail: developpeurEmail.trim(),
      dureeJoursDefaut,
      nbMaxPanelistes,
      statut,
    };

    try {
      if (editingId) {
        await applicationsApi.update(editingId, payload);
        setSuccessMsg("Application mise à jour avec succès !");
      } else {
        const res = await applicationsApi.create(payload);
        setSuccessMsg("Nouvelle application enregistrée et clé SDK générée !");
      }
      setShowModal(false);
      await loadApplications();
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSdkDrawer = async (app: ApplicationItem) => {
    try {
      setLoadingDetails(true);
      setSimResult(null);
      setSimTesterId("");
      setSimCode("");
      const details = await applicationsApi.show(app.id);
      setSelectedApp(details);
      if (details.panelistes && details.panelistes.length > 0) {
        setSimTesterId(details.panelistes[0].panelisteUid);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de chargement des détails.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCopy = (text: string, id: number, type: "key" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2500);
    } else {
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  const handleRegenerateKey = (app: ApplicationItem) => {
    setConfirmConfig({
      isOpen: true,
      title: "Régénérer la clé SDK ?",
      message: `Attention : la clé actuelle de « ${app.nom} » deviendra immédiatement invalide. Les applications utilisant l'ancienne clé ne pourront plus valider les tests.`,
      variant: "warning",
      confirmText: "Régénérer",
      onConfirm: async () => {
        try {
          const res = await applicationsApi.regenerateKey(app.id);
          setSuccessMsg(`Nouvelle clé SDK générée pour ${app.nom}`);
          if (selectedApp && selectedApp.id === app.id) {
            setSelectedApp({ ...selectedApp, apiKey: res.apiKey });
          }
          await loadApplications();
        } catch (err: any) {
          setErrorMsg(err.message || "Erreur lors de la régénération.");
        }
      },
    });
  };

  const handleDelete = (app: ApplicationItem) => {
    setConfirmConfig({
      isOpen: true,
      title: "Supprimer cette application ?",
      message: `Êtes-vous sûr de vouloir supprimer définitivement « ${app.nom} » ? Ses missions seront détachées mais conservées.`,
      variant: "danger",
      confirmText: "Supprimer",
      onConfirm: async () => {
        try {
          await applicationsApi.delete(app.id);
          setSuccessMsg(`Application « ${app.nom} » supprimée.`);
          if (selectedApp?.id === app.id) setSelectedApp(null);
          await loadApplications();
        } catch (err: any) {
          setErrorMsg(err.message || "Erreur lors de la suppression.");
        }
      },
    });
  };

  const handleSimulateSdkValidation = async () => {
    if (!selectedApp) return;
    if (!simTesterId.trim() || !simCode.trim()) {
      setSimResult({
        success: false,
        message: "Veuillez renseigner l'identifiant panéliste et le code du jour.",
      });
      return;
    }

    setSimLoading(true);
    setSimResult(null);

    try {
      const res = await sdkApi.verifyDay({
        apiKey: selectedApp.apiKey,
        panelisteId: simTesterId.trim(),
        code: simCode.trim(),
      });
      setSimResult({
        success: res.success,
        message: res.message || "Validation réussie !",
        jour: res.jour,
        progression: res.progression,
      });
      // Recharger les détails pour voir l'impact
      const updated = await applicationsApi.show(selectedApp.id);
      setSelectedApp(updated);
    } catch (err: any) {
      setSimResult({
        success: false,
        message: err.message || "Échec de la validation du code.",
      });
    } finally {
      setSimLoading(false);
    }
  };

  // Filtrage
  const filteredApps = apps.filter((a) => {
    const matchSearch =
      a.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.developpeurNom && a.developpeurNom.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.developpeurEmail && a.developpeurEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === "tous" || a.statut === statusFilter;
    const matchPlatform = platformFilter === "tous" || a.plateforme === platformFilter;

    return matchSearch && matchStatus && matchPlatform;
  });

  const activeCount = apps.filter((a) => a.statut === "active" || a.statut === "en_test").length;
  const totalPanelistes = apps.reduce((acc, a) => acc + (a.nbPanelistes || 0), 0);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case "en_test":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            En Test (12j)
          </span>
        );
      case "en_attente_integration":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            En attente SDK
          </span>
        );
      case "pause":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-500/20">
            En pause
          </span>
        );
      case "archivee":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 border border-rose-500/20">
            Archivée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {st}
          </span>
        );
    }
  };

  const getPlatformIcon = (_plat?: string) => {
    return <Smartphone className="h-4 w-4 text-emerald-600" />;
  };

  const getIntegrationUrl = (token: string) => {
    if (typeof window === "undefined") return `/integration/${token}`;
    return `${window.location.origin}/integration/${token}`;
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* En-tête de la page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20 shadow-sm">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                Gestion des Applications à tester
              </h1>
              <p className="text-sm text-slate-500">
                Configurez les applications clientes, générez les clés d'intégration SDK et suivez les panélistes
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadApplications}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Application
          </button>
        </div>
      </div>

      {/* Messages de retour */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg("")}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
          >
            Fermer
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg("")}
            className="text-rose-700 hover:text-rose-900 text-xs font-semibold"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applications Enregistrées
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {apps.length}
            </span>
            <span className="text-xs text-slate-500">applications</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Prêtes pour les campagnes de test
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              En Test ou Actives
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Play className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-600">
              {activeCount}
            </span>
            <span className="text-xs text-slate-500">en cours</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Intégrations SDK opérationnelles
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Panélistes Mobilisés
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {totalPanelistes}
            </span>
            <span className="text-xs text-slate-500">testeurs assignés</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Validation quotidienne en continu
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Durée Standard
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              12
            </span>
            <span className="text-xs text-slate-500">jours / mission</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Boucle quotidienne automatisée
          </div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, développeur, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
            <span>Plateforme Android</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="tous">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="en_test">En Test</option>
              <option value="en_attente_integration">En attente SDK</option>
              <option value="pause">En pause</option>
              <option value="archivee">Archivée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des Applications */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Chargement des applications à tester...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
            <Smartphone className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Aucune application trouvée
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">
            {apps.length === 0
              ? "Commencez par enregistrer la première application à tester pour générer sa clé SDK d'intégration."
              : "Aucune application ne correspond à vos filtres de recherche."}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Ajouter une application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => {
            const isVisible = visibleKeyId === app.id;
            return (
              <div
                key={app.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-lg hover:border-blue-300"
              >
                <div>
                  {/* Carte Top : Logo réel, Titre, Statut et Plateforme */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {app.logo ? (
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-1.5 shadow-2xs overflow-hidden">
                          <img
                            src={getImageUrl(app.logo)}
                            alt={app.nom}
                            className="h-full w-full object-contain rounded-xl"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xs font-bold text-base tracking-tight">
                          {app.nom.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate tracking-tight">
                          {app.nom}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                            <Smartphone className="h-2.5 w-2.5 text-emerald-600" />
                            {app.plateforme || "Android"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            v{app.version}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">{getStatusBadge(app.statut)}</div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                    {app.description || "Aucune description renseignée pour cette application."}
                  </p>

                  {/* Paramètres Clés : 12j & 12 panélistes */}
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50/80 border border-slate-100 p-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Cycle de test</span>
                      <span className="font-semibold text-slate-800">
                        {app.dureeJoursDefaut || 12} jours
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Panélistes max</span>
                      <span className="font-semibold text-slate-800">
                        {app.nbMaxPanelistes || 12} testeurs
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200/50">
                      <span className="text-slate-400 block text-[10px] font-medium">Missions liées</span>
                      <span className="font-semibold text-blue-600">
                        {app.nbMissions || 0} mission(s)
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200/50">
                      <span className="text-slate-400 block text-[10px] font-medium">Testeurs actifs</span>
                      <span className="font-semibold text-purple-600">
                        {app.nbPanelistes || 0} inscrit(s)
                      </span>
                    </div>
                  </div>

                  {/* Clé SDK Widget - Épuré et compact */}
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-slate-900 px-3 py-2 text-white">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <Key className="h-3 w-3 text-amber-400 shrink-0" />
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">Clé SDK:</span>
                      <code className="font-mono text-[11px] text-slate-200 truncate select-all">
                        {isVisible ? app.apiKey : `${app.apiKey.slice(0, 10)}••••••••••••••••`}
                      </code>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setVisibleKeyId(isVisible ? null : app.id)}
                        className="text-slate-400 hover:text-white transition p-1"
                        title={isVisible ? "Masquer" : "Afficher"}
                      >
                        {isVisible ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(app.apiKey, app.id, "key")}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition px-1.5 py-0.5 rounded hover:bg-slate-800"
                      >
                        {copiedKey === app.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Développeur Contact */}
                  {(app.developpeurNom || app.developpeurEmail) && (
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                      <span>Développeur :</span>
                      <span className="font-medium text-slate-600 truncate max-w-[180px]">
                        {app.developpeurNom || app.developpeurEmail}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions au bas de la carte */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenSdkDrawer(app)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    SDK & Intégration
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        router.push(`/admin/missions?action=new&appId=${app.id}`)
                      }
                      title="Créer une mission pour cette application"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(app)}
                      title="Modifier l'application"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleRegenerateKey(app)}
                      title="Régénérer la clé SDK"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(app)}
                      title="Supprimer"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Créer / Modifier Application */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal Fixe */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    {editingId ? "Modifier l'application" : "Ajouter une application à tester"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configuration générale et génération automatique des clés de validation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="flex flex-col flex-1 overflow-hidden">
              {/* Corps Défilant */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
                {/* Logo / Icône de l'application */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Logo / Icône de l&apos;application
                  </label>
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                    {logo ? (
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
                        <img
                          src={getImageUrl(logo)}
                          alt="Logo preview"
                          className="h-full w-full object-contain rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setLogo("")}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs hover:bg-rose-600 transition"
                          title="Supprimer le logo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-400">
                        <ImageIcon className="h-7 w-7 stroke-1" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          ref={logoInputRef}
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingLogo}
                          onClick={() => logoInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition shadow-2xs disabled:opacity-50"
                        >
                          {uploadingLogo ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                              <span>Téléversement...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5" />
                              <span>Importer une image</span>
                            </>
                          )}
                        </button>
                        {logo && (
                          <span className="text-[11px] text-emerald-600 font-medium">
                            ✓ Logo actif
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        PNG, JPG, WebP ou SVG (taille carrée recommandée).
                      </p>
                      <input
                        type="text"
                        placeholder="Ou saisissez l'URL directe du logo (ex: https://...)"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom de l'application *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: WariPay Mobile"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Plateforme cible
                    </label>
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2 text-sm font-medium text-emerald-950">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-emerald-600" />
                        <span>Android (APK / Google Play)</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full">
                        Unique
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      placeholder="1.0.0"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Durée par défaut (jours)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={dureeJoursDefaut}
                      onChange={(e) => setDureeJoursDefaut(parseInt(e.target.value) || 12)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Max Panélistes
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={nbMaxPanelistes}
                      onChange={(e) => setNbMaxPanelistes(parseInt(e.target.value) || 12)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lien de téléchargement / Accès Panélistes
                  </label>
                  <input
                    type="url"
                    placeholder="https://play.google.com/... ou lien APK / URL"
                    value={lienTelechargement}
                    onChange={(e) => setLienTelechargement(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description de l'application & fonctionnalités à tester
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez brièvement l'application et les points clés à évaluer..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom du développeur / Contact
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Équipe Dev WariPay"
                      value={developpeurNom}
                      onChange={(e) => setDeveloppeurNom(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email développeur (pour envoi du lien)
                    </label>
                    <input
                      type="email"
                      placeholder="dev@client.com"
                      value={developpeurEmail}
                      onChange={(e) => setDeveloppeurEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Statut de l'application
                  </label>
                  <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="en_attente_integration">En attente d'intégration SDK</option>
                    <option value="active">Active (Prête pour les tests)</option>
                    <option value="en_test">En cours de test (Mission active)</option>
                    <option value="pause">En pause</option>
                    <option value="archivee">Archivée</option>
                  </select>
                </div>
              </div>

              {/* Footer Modal Fixe */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 sm:px-8 border-t border-slate-100 bg-slate-50/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Enregistrer les modifications" : "Créer et Générer SDK"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Drawer / Modal Détails & Intégration SDK */}
      {selectedApp && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Drawer */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display">
                    Centre d'Intégration SDK : {selectedApp.nom}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Clés d'accès, snippets d'intégration et simulateur de test en direct
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
              {/* Étape 1 & 2 Rappel schéma */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">
                      Cycle de Test Automatisé Samré ({selectedApp.dureeJoursDefaut || 12} jours / {selectedApp.nbMaxPanelistes || 12} testeurs)
                    </span>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      1. Transmettez la <strong>clé SDK</strong> ou le <strong>lien développeur</strong> à l'équipe technique de l'application à tester.
                      <br />
                      2. Le développeur intègre le formulaire de test dans son application.
                      <br />
                      3. Chaque jour, le serveur Samré génère un code unique pour chaque panéliste. Le testeur le saisit dans l'app testée qui valide automatiquement la journée auprès de Samré.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Clé SDK et Lien unique Développeur */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-amber-500" />
                      Clé d'Intégration SDK (X-App-Key)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedApp.apiKey, selectedApp.id, "key")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {copiedKey === selectedApp.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copiée</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copier la clé</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-2.5 font-mono text-xs text-amber-400 select-all break-all">
                    {selectedApp.apiKey}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <LinkIcon className="h-4 w-4 text-blue-500" />
                      Lien Unique pour le Développeur
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={getIntegrationUrl(selectedApp.tokenIntegration)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ouvrir
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            getIntegrationUrl(selectedApp.tokenIntegration),
                            selectedApp.id,
                            "link"
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {copiedLink === selectedApp.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copier le lien</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-2.5 font-mono text-xs text-blue-300 select-all truncate">
                    {getIntegrationUrl(selectedApp.tokenIntegration)}
                  </div>
                </div>
              </div>

              {/* 2. Snippets de Code Intégration */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-700">
                      Snippet d'Intégration du Formulaire de Test
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-200/80 rounded-lg p-1 text-xs">
                    <button
                      onClick={() => setSdkSnippetTab("flutter")}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        sdkSnippetTab === "flutter"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Flutter / Dart
                    </button>
                    <button
                      onClick={() => setSdkSnippetTab("kotlin")}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        sdkSnippetTab === "kotlin"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Android (Kotlin)
                    </button>
                    <button
                      onClick={() => setSdkSnippetTab("curl")}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        sdkSnippetTab === "curl"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      cURL / CLI
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                  {sdkSnippetTab === "flutter" && (
                    <pre className="text-cyan-300">
{`// 1. Dépendance dans pubspec.yaml :
// dependencies:
//   http: ^1.2.0

import 'dart:convert';
import 'package:http/http.dart' as http;

class SamreSdk {
  static const String _endpoint =
      "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sdk/verify-day";
  static const String _apiKey = "${selectedApp.apiKey}";

  /// Valide la journée de test pour un panéliste Samré
  static Future<Map<String, dynamic>> verifyDay({
    required String panelisteId,
    required String codeDuJour,
  }) async {
    final response = await http.post(
      Uri.parse(_endpoint),
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': _apiKey,
      },
      body: jsonEncode({
        'panelisteId': panelisteId.trim(),
        'code': codeDuJour.trim(),
      }),
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode == 200 && data['success'] == true) {
      // Journée validée avec succès !
      return data;
    } else {
      throw Exception(data['error'] ?? 'Échec de validation Samré');
    }
  }
}`}
                    </pre>
                  )}

                  {sdkSnippetTab === "kotlin" && (
                    <pre className="text-emerald-300">
{`// 1. Dépendances dans build.gradle.kts (Module: app) :
// implementation("com.squareup.okhttp3:okhttp:4.12.0")
// implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

object SamreSdk {
    private const val API_URL =
        "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sdk/verify-day"
    private const val API_KEY = "${selectedApp.apiKey}"
    private val client = OkHttpClient()

    /**
     * Valide la journée de test auprès du serveur central Samré
     */
    suspend fun verifyDay(panelisteId: String, codeDuJour: String): Result<String> =
        withContext(Dispatchers.IO) {
            try {
                val payload = JSONObject().apply {
                    put("panelisteId", panelisteId.trim())
                    put("code", codeDuJour.trim())
                }.toString()

                val body = payload.toRequestBody("application/json; charset=utf-8".toMediaType())
                val request = Request.Builder()
                    .url(API_URL)
                    .addHeader("X-App-Key", API_KEY)
                    .post(body)
                    .build()

                client.newCall(request).execute().use { response ->
                    val resStr = response.body?.string().orEmpty()
                    val json = JSONObject(resStr)

                    if (response.isSuccessful && json.optBoolean("success", false)) {
                        Result.success(json.optString("message", "Journée validée avec succès !"))
                    } else {
                        Result.failure(Exception(json.optString("error", "Code ou panéliste invalide")))
                    }
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
}`}
                    </pre>
                  )}

                  {sdkSnippetTab === "curl" && (
                    <pre className="text-amber-300">
{`# Appel cURL direct de vérification quotidienne
curl -X POST "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sdk/verify-day" \\
  -H "Content-Type: application/json" \\
  -H "X-App-Key: ${selectedApp.apiKey}" \\
  -d '{
    "panelisteId": "TST-XXXXXX",
    "code": "SAMRE-J01-9F3B"
  }'`}
                    </pre>
                  )}
                </div>
              </div>

              {/* 3. Simulateur Interactif en Direct */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-950">
                      Simulateur de Test en Direct (Testez comme l'App)
                    </span>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium">
                    Simule la requête envoyée par l'application testée
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Identifiant Unique Panéliste
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: TST-123456"
                      value={simTesterId}
                      onChange={(e) => setSimTesterId(e.target.value)}
                      className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Code du Jour à Saisir
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: SAMRE-J01-ABCD"
                      value={simCode}
                      onChange={(e) => setSimCode(e.target.value)}
                      className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 uppercase focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleSimulateSdkValidation}
                      disabled={simLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                      {simLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Valider le code
                    </button>
                  </div>
                </div>

                {/* Résultat de simulation */}
                {simResult && (
                  <div
                    className={`mt-4 rounded-xl border p-3 text-xs flex items-start gap-2.5 transition ${
                      simResult.success
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    {simResult.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold">{simResult.message}</span>
                      {simResult.jour && (
                        <div className="text-[11px] mt-0.5 text-emerald-700 font-medium">
                          Jour {simResult.jour} validé • Progression testeur : {simResult.progression}%
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Panélistes assignés à cette application */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-600" />
                  Panélistes Assignés & Progression ({selectedApp.panelistes?.length || 0})
                </h4>

                {selectedApp.panelistes && selectedApp.panelistes.length > 0 ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-slate-500 font-semibold">
                        <tr>
                          <th className="px-4 py-2.5 text-left">Panéliste</th>
                          <th className="px-4 py-2.5 text-left">Identifiant Unique</th>
                          <th className="px-4 py-2.5 text-left">Mission</th>
                          <th className="px-4 py-2.5 text-center">Progression</th>
                          <th className="px-4 py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                        {selectedApp.panelistes.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition">
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {p.nom}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-indigo-600 font-bold">
                              {p.panelisteUid}
                            </td>
                            <td className="px-4 py-2.5 text-slate-500 truncate max-w-[180px]">
                              {p.missionTitre}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className="font-semibold text-slate-900">
                                {p.progression}%
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button
                                onClick={() => {
                                  setSimTesterId(p.panelisteUid);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium text-[11px]"
                              >
                                Tester avec cet ID
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Aucun panéliste inscrit pour le moment. Lancez une mission liée à cette application.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Serveur Central Samré • Intégration SDK v1.0
              </span>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        confirmText={confirmConfig.confirmText}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
}
