import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "@/lib/router";
import {
  Smartphone,
  Plus,
  Search,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
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
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Link as LinkIcon,
  X,
  Upload,
  Image as ImageIcon,
  Table as TableIcon,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  applicationsApi,
  adminApi,
  getImageUrl,
  type ApplicationItem,
  type ApplicationPayload,
  type DailySdkPage,
} from "@/lib/api";
import ConfirmModal, { type ConfirmVariant } from "@/components/ui/ConfirmModal";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [platformFilter, setPlatformFilter] = useState("tous");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Notifications feedback
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  // Modal Create/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal Succès - Lien Unique Développeur Généré (Étape 1 du protocole)
  const [createdProjectLink, setCreatedProjectLink] = useState<{
    nom: string;
    tokenIntegration: string;
  } | null>(null);
  const [copiedSuccessLink, setCopiedSuccessLink] = useState(false);

  // Form Fields
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [plateforme, setPlateforme] = useState("Android");
  const [version, setVersion] = useState("1.0.0");
  const [lienTelechargement, setLienTelechargement] = useState("");
  const [developpeurNom, setDeveloppeurNom] = useState("");
  const [developpeurEmail, setDeveloppeurEmail] = useState("");
  const [dureeJoursDefaut, setDureeJoursDefaut] = useState(14);
  const [nbMaxPanelistes, setNbMaxPanelistes] = useState(12);
  const [statut, setStatut] = useState("en_attente_integration");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [dailyPagesApp, setDailyPagesApp] = useState<ApplicationItem | null>(null);
  const [dailyPageDrafts, setDailyPageDrafts] = useState<DailySdkPage[]>([]);
  const [selectedDailyDay, setSelectedDailyDay] = useState(1);
  const [savingDailyPages, setSavingDailyPages] = useState(false);
  const [uploadingDailyImage, setUploadingDailyImage] = useState(false);
  const [dailyPagesError, setDailyPagesError] = useState("");
  const dailyImageInputRef = useRef<HTMLInputElement>(null);

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

  const handleOpenDailyPages = (app: ApplicationItem) => {
    setDailyPagesApp(app);
    setDailyPageDrafts(app.dailyPages || []);
    setSelectedDailyDay(1);
    setDailyPagesError("");
  };

  const updateSelectedDailyPage = (
    field: Exclude<keyof DailySdkPage, "day">,
    value: string
  ) => {
    setDailyPageDrafts((current) => {
      const existing = current.find((page) => page.day === selectedDailyDay);
      const base: DailySdkPage = existing || {
        day: selectedDailyDay,
        title: "",
        body: "",
        imageUrl: "",
        buttonLabel: "Continuer",
      };
      const updated = { ...base, [field]: value };
      return existing
        ? current.map((page) => page.day === selectedDailyDay ? updated : page)
        : [...current, updated];
    });
  };

  const handleDailyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setDailyPagesError("Veuillez sélectionner un fichier image valide.");
      return;
    }
    try {
      setUploadingDailyImage(true);
      setDailyPagesError("");
      const result = await adminApi.uploadImage(file);
      updateSelectedDailyPage("imageUrl", result.url);
    } catch (err) {
      setDailyPagesError(err instanceof Error ? err.message : "Échec du téléversement de l’image.");
    } finally {
      setUploadingDailyImage(false);
      e.currentTarget.value = "";
    }
  };

  const handleSaveDailyPages = async () => {
    if (!dailyPagesApp) return;

    const configuredPages = dailyPageDrafts.filter((page) =>
      page.title.trim() || page.body.trim() || page.imageUrl.trim()
    );
    if (configuredPages.some((page) => !page.title.trim())) {
      setDailyPagesError("Chaque écran configuré doit avoir un titre.");
      return;
    }

    const payload = configuredPages.map((page) => ({
      ...page,
      title: page.title.trim(),
      body: page.body.trim(),
      imageUrl: page.imageUrl.trim(),
      buttonLabel: page.buttonLabel.trim() || "Continuer",
    }));

    try {
      setSavingDailyPages(true);
      setDailyPagesError("");
      await applicationsApi.updateDailyPages(dailyPagesApp.id, payload);
      setApps((current) => current.map((app) =>
        app.id === dailyPagesApp.id ? { ...app, dailyPages: payload } : app
      ));
      setSuccessMsg(`Écrans quotidiens enregistrés pour ${dailyPagesApp.nom}.`);
      setDailyPagesApp(null);
    } catch (err) {
      setDailyPagesError(err instanceof Error ? err.message : "Impossible d’enregistrer les écrans quotidiens.");
    } finally {
      setSavingDailyPages(false);
    }
  };

  const [copiedLink, setCopiedLink] = useState<number | null>(null);

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
    setDureeJoursDefaut(14);
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
    setDureeJoursDefaut(app.dureeJoursDefaut || 14);
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
      dureeJoursDefaut,
      nbMaxPanelistes,
      statut,
    };

    try {
      if (editingId) {
        await applicationsApi.update(editingId, payload);
        setSuccessMsg("Projet de test mis à jour avec succès !");
        setShowModal(false);
      } else {
        const res = await applicationsApi.create(payload);
        setShowModal(false);
        setCreatedProjectLink({
          nom: payload.nom,
          tokenIntegration: res.tokenIntegration,
        });
      }
      await loadApplications();
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
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
          await loadApplications();
        } catch (err: any) {
          setErrorMsg(err.message || "Erreur lors de la suppression.");
        }
      },
    });
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

  // Réinitialiser la pagination lors d'un filtre ou recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

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
            En Test (14j)
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

  const selectedDailyPage = dailyPageDrafts.find((page) => page.day === selectedDailyDay) || {
    day: selectedDailyDay,
    title: "",
    body: "",
    imageUrl: "",
    buttonLabel: "Continuer",
  };
  const dailyPageDays = dailyPagesApp
    ? Array.from({ length: Math.max(1, Math.min(60, dailyPagesApp.dureeJoursDefaut || 14)) }, (_, index) => index + 1)
    : [];

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
                Projets de Test (Applications à tester)
              </h1>
              <p className="text-sm text-slate-500">
                Saisissez les informations de l&apos;application (durée 14 jours, 12 panélistes) et obtenez le lien unique à transmettre au développeur
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadApplications}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-60 whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition hover:shadow-md whitespace-nowrap"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Nouveau Projet de Test</span>
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
            className="w-full rounded-xl border border-slate-200 pl-10 pr-9 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
              title="Effacer la recherche"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200/60">
            {filteredApps.length} projet{filteredApps.length > 1 ? "s" : ""}
          </span>

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

          {/* Commutateur de Vue (Tableau dense par défaut / Grille compacte) */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === "table"
                  ? "bg-white text-blue-700 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Vue Tableau (Haute densité pour de nombreuses applications)"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Tableau</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === "grid"
                  ? "bg-white text-blue-700 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Vue Grille compacte"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grille</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste / Grille des Applications */}
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
              ? "Commencez par enregistrer la première application à tester pour générer son lien unique d'intégration."
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
      ) : viewMode === "table" ? (
        /* VUE TABLEAU (DESIGN COMPACT, MODERNE & EXTENSIBLE JUSQU'À 100+ APPS) */
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Application</th>
                    <th className="px-5 py-3.5">Statut</th>
                    <th className="px-5 py-3.5">Cycle & Panélistes</th>
                    <th className="px-5 py-3.5">Missions & Inscrits</th>
                    <th className="px-5 py-3.5">Lien Développeur</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedApps.map((app) => {
                    const isCopied = copiedLink === app.id;
                    const devUrl = getIntegrationUrl(app.tokenIntegration);

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        {/* Application (Logo + Nom + Version + Description) */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {app.logo ? (
                              <div
                                className="relative flex h-10 w-10 min-w-[40px] max-w-[40px] shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-1 shadow-2xs overflow-hidden"
                                style={{ width: "40px", height: "40px", minWidth: "40px", maxWidth: "40px" }}
                              >
                                <img
                                  src={getImageUrl(app.logo)}
                                  alt={app.nom}
                                  className="h-full w-full object-contain rounded-lg"
                                  style={{ width: "100%", height: "100%", maxWidth: "36px", maxHeight: "36px", objectFit: "contain" }}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xs font-bold text-xs tracking-tight">
                                {app.nom.slice(0, 2).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  onClick={() => handleOpenEditModal(app)}
                                  className="font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer text-sm truncate max-w-[200px]"
                                  title={app.nom}
                                >
                                  {app.nom}
                                </span>
                                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60 font-semibold">
                                  v{app.version}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                                {app.description || (app.developpeurNom ? `Développeur: ${app.developpeurNom}` : "Projet d'évaluation de test")}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Statut */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {getStatusBadge(app.statut)}
                        </td>

                        {/* Paramètres de test : 14j / 12 testeurs */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <span className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-lg text-slate-700">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {app.dureeJoursDefaut || 14} jours
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-lg text-slate-700">
                              <Users className="h-3 w-3 text-slate-400" />
                              {app.nbMaxPanelistes || 12} testeurs
                            </span>
                          </div>
                        </td>

                        {/* Missions liées & Testeurs actifs */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {app.nbMissions || 0} mission(s)
                            </span>
                            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              {app.nbPanelistes || 0} inscrit(s)
                            </span>
                          </div>
                        </td>

                        {/* Lien Unique Développeur */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleCopy(devUrl, app.id, "link")}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition border shadow-2xs ${
                              isCopied
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-300"
                                : "bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200 hover:border-blue-200"
                            }`}
                            title={`Copier le lien : ${devUrl}`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span className="font-bold text-emerald-700">Lien copié !</span>
                              </>
                            ) : (
                              <>
                                <LinkIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                <span>Copier le lien unique</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions Rapides */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenDailyPages(app)}
                              title="Configurer les écrans affichés chaque jour"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition"
                            >
                              <Calendar className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/missions?action=new&appId=${app.id}`)}
                              title="Créer une mission pour cette application"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(app)}
                              title="Modifier l'application"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRegenerateKey(app)}
                              title="Régénérer le token / clé"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(app)}
                              title="Supprimer l'application"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

          {/* Contrôles de Pagination pour Haute Densité (jusqu'à 100+ apps) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-slate-500">
            <div>
              Affichage de{" "}
              <span className="font-semibold text-slate-800">{startIndex + 1}</span> à{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(startIndex + itemsPerPage, filteredApps.length)}
              </span>{" "}
              sur <span className="font-semibold text-slate-800">{filteredApps.length}</span> application(s)
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Par page :</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
                    title="Page précédente"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <span className="px-2 font-medium text-slate-700">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
                    title="Page suivante"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VUE GRILLE COMPACTE (ALTERNATIVE ÉLÉGANTE, NON ENCOMBRANTE) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedApps.map((app) => {
              const isCopied = copiedLink === app.id;
              const devUrl = getIntegrationUrl(app.tokenIntegration);

              return (
                <div
                  key={app.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-blue-300"
                >
                  <div>
                    {/* Header : Logo, Nom, Version, Statut */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {app.logo ? (
                          <div
                            className="relative flex h-10 w-10 min-w-[40px] max-w-[40px] shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-1 shadow-2xs overflow-hidden"
                            style={{ width: "40px", height: "40px", minWidth: "40px", maxWidth: "40px" }}
                          >
                            <img
                              src={getImageUrl(app.logo)}
                              alt={app.nom}
                              className="h-full w-full object-contain rounded-lg"
                              style={{ width: "100%", height: "100%", maxWidth: "36px", maxHeight: "36px", objectFit: "contain" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xs font-bold text-xs tracking-tight">
                            {app.nom.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3
                            onClick={() => handleOpenEditModal(app)}
                            className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate cursor-pointer"
                            title={app.nom}
                          >
                            {app.nom}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded font-semibold">
                              v{app.version}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400">
                              {app.dureeJoursDefaut || 14}j • {app.nbMaxPanelistes || 12} max
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(app.statut)}</div>
                    </div>

                    {/* Stats rapides */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <span>
                        Missions: <strong className="text-blue-600">{app.nbMissions || 0}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        Inscrits: <strong className="text-purple-600">{app.nbPanelistes || 0}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Barre d'action basse : Copie du lien développeur + Outils */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(devUrl, app.id, "link")}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                        isCopied
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200/80"
                      }`}
                      title={`Copier le lien : ${devUrl}`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-3 w-3 text-blue-600" />
                          <span>Copier le lien</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenDailyPages(app)}
                        title="Configurer les écrans quotidiens"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/missions?action=new&appId=${app.id}`)}
                        title="Créer une mission"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(app)}
                        title="Modifier"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
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

          {/* Pagination pour Grille */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-slate-500">
            <div>
              Affichage de <span className="font-semibold text-slate-800">{startIndex + 1}</span> à{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(startIndex + itemsPerPage, filteredApps.length)}
              </span>{" "}
              sur <span className="font-semibold text-slate-800">{filteredApps.length}</span> application(s)
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
                  title="Page précédente"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <span className="px-2 font-medium text-slate-700">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
                  title="Page suivante"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de configuration des écrans affichés par jour */}
      {dailyPagesApp && mounted && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-navy-950/80 p-3 sm:p-6 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-pages-title"
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="daily-pages-title" className="font-display text-base font-bold text-slate-900">
                    Écrans quotidiens
                  </h2>
                  <p className="text-xs text-slate-500">{dailyPagesApp.nom}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDailyPagesApp(null)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
              <p className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-relaxed text-blue-900">
                Le Jour 1 commence à la première ouverture du SDK sur chaque appareil. L’écran configuré s’affiche en plein écran une fois ce jour-là, puis le bouton « Continuer » retourne à l’application.
              </p>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Jour de test</label>
                  <span className="text-[11px] text-slate-500">
                    {dailyPageDrafts.filter((page) => page.title.trim()).length} écran(s) configuré(s)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                  {dailyPageDays.map((day) => {
                    const configured = dailyPageDrafts.some((page) => page.day === day && page.title.trim());
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDailyDay(day)}
                        className={`relative rounded-xl border px-2 py-2 text-xs font-bold transition ${
                          selectedDailyDay === day
                            ? "border-violet-700 bg-violet-700 text-white shadow-sm"
                            : configured
                            ? "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        J{day}
                        {configured && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
                <div>
                  <label htmlFor="daily-page-title" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Titre de la page · Jour {selectedDailyDay}
                  </label>
                  <input
                    id="daily-page-title"
                    type="text"
                    maxLength={120}
                    value={selectedDailyPage.title}
                    onChange={(event) => updateSelectedDailyPage("title", event.target.value)}
                    placeholder="Ex. Bienvenue dans votre espace testeur"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
                  />
                </div>

                <div>
                  <label htmlFor="daily-page-body" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Texte et consignes
                  </label>
                  <textarea
                    id="daily-page-body"
                    rows={4}
                    maxLength={2000}
                    value={selectedDailyPage.body}
                    onChange={(event) => updateSelectedDailyPage("body", event.target.value)}
                    placeholder="Expliquez ce que le testeur doit consulter ou essayer aujourd’hui."
                    className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Image de la page (facultative)</label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    {selectedDailyPage.imageUrl ? (
                      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={getImageUrl(selectedDailyPage.imageUrl)}
                          alt={`Aperçu de l’écran du Jour ${selectedDailyDay}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => updateSelectedDailyPage("imageUrl", "")}
                          title="Retirer l’image"
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 shadow-sm hover:text-rose-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                        <ImageIcon className="h-7 w-7 stroke-1" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        ref={dailyImageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleDailyImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingDailyImage}
                        onClick={() => dailyImageInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                      >
                        {uploadingDailyImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingDailyImage ? "Import en cours…" : "Importer une image"}
                      </button>
                      <input
                        type="url"
                        value={selectedDailyPage.imageUrl}
                        onChange={(event) => updateSelectedDailyPage("imageUrl", event.target.value)}
                        placeholder="Ou collez une URL HTTPS"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="daily-page-button" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Texte du bouton de retour
                  </label>
                  <input
                    id="daily-page-button"
                    type="text"
                    maxLength={50}
                    value={selectedDailyPage.buttonLabel}
                    onChange={(event) => updateSelectedDailyPage("buttonLabel", event.target.value)}
                    placeholder="Continuer"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              {!selectedDailyPage.title && !selectedDailyPage.body && !selectedDailyPage.imageUrl && (
                <p className="text-xs text-slate-500">Aucun écran n’est configuré pour ce jour. Le SDK laissera l’application s’ouvrir normalement.</p>
              )}
              {dailyPagesError && (
                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {dailyPagesError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={() => {
                  setDailyPageDrafts((current) => current.filter((page) => page.day !== selectedDailyDay));
                  setDailyPagesError("");
                }}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Effacer ce jour
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDailyPagesApp(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveDailyPages}
                  disabled={savingDailyPages || uploadingDailyImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:opacity-60"
                >
                  {savingDailyPages && <Loader2 className="h-4 w-4 animate-spin" />}
                  Enregistrer les jours
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
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
                    {editingId ? "Modifier le projet de test" : "Nouveau projet de test"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingId
                      ? "Mise à jour des informations de l'application à tester"
                      : "Étape 1 : Saisissez les informations de l'application. Le serveur central génèrera le lien unique."}
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
                      onChange={(e) => setDureeJoursDefaut(parseInt(e.target.value) || 14)}
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

                <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Lien unique généré automatiquement :</strong> En validant ce formulaire, le serveur central génère un <strong>lien unique</strong> dédié à ce projet de test. Vous pourrez le copier et le transmettre au développeur par le moyen de votre choix (WhatsApp, email, message direct).
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
                    <option value="en_attente_integration">En attente d'intégration</option>
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
                  {editingId ? "Enregistrer les modifications" : "Créer le projet & Générer le lien unique"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Succès : Lien Unique Développeur Généré (Étape 1 du protocole) */}
      {createdProjectLink && mounted && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold font-display text-slate-900">
              Projet de test créé avec succès !
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Le serveur central a généré le <strong>lien unique</strong> pour l&apos;application <strong>« {createdProjectLink.nom} »</strong>.
            </p>

            {/* Cadre du lien unique à copier */}
            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
                  Lien unique pour le développeur
                </span>
                <span className="text-[10px] text-blue-600 font-medium">À copier & transmettre</span>
              </div>

              <div className="rounded-xl bg-white border border-blue-200/80 p-3 font-mono text-xs text-blue-900 select-all break-all shadow-2xs">
                {getIntegrationUrl(createdProjectLink.tokenIntegration)}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getIntegrationUrl(createdProjectLink.tokenIntegration));
                    setCopiedSuccessLink(true);
                    setTimeout(() => setCopiedSuccessLink(false), 3000);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  {copiedSuccessLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      <span>Lien copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copier le lien unique</span>
                    </>
                  )}
                </button>

                <a
                  href={getIntegrationUrl(createdProjectLink.tokenIntegration)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  title="Ouvrir dans un nouvel onglet pour vérifier"
                >
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                  <span>Tester</span>
                </a>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 leading-normal">
              Vous pouvez maintenant envoyer ce lien au développeur par <strong>WhatsApp, e-mail ou tout autre moyen</strong>.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setCreatedProjectLink(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
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
