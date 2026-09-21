import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  MapPin,
  LogOut,
  Save,
  Loader2,
  Edit2,
  X,
  Camera,
  Bell,
  ChevronRight,
  History,
  CreditCard,
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { profileApi, type User } from "@/lib/api";

const PAYS_LIST = [
  "Côte d'Ivoire",
  "Sénégal",
  "Togo",
  "Bénin",
  "Cameroun",
  "Burkina Faso",
  "Mali",
  "Guinée",
  "Niger",
  "Gabon",
  "Congo",
  "RD Congo",
  "France",
  "Autre",
];

export default function ProfilPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(user || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Modals
  const [editing, setEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Formulaire d'édition
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [genre, setGenre] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    profileApi
      .show()
      .then((data) => {
        setProfile(data);
        setNom(data.nom || "");
        setPrenom(data.prenom || "");
        setTelephone(data.telephone || "");
        setPays(data.pays || "");
        setVille(data.ville || "");
        setGenre(data.genre || "");
      })
      .catch(() => {
        if (user) {
          setNom(user.nom || "");
          setPrenom(user.prenom || "");
          setTelephone(user.telephone || "");
          setPays(user.pays || "");
          setVille(user.ville || "");
          setGenre(user.genre || "");
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Gestion du téléversement de photo
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }

    setUploadingPhoto(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        try {
          const updated = await profileApi.update({ photo: dataUrl });
          setProfile(updated);
          updateUser(updated);
          setSuccessMsg("Photo de profil mise à jour !");
          setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Erreur lors de l'enregistrement de la photo."
          );
        } finally {
          setUploadingPhoto(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Suppression de la photo
  async function handleRemovePhoto() {
    setUploadingPhoto(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await profileApi.update({ photo: "" });
      setProfile(updated);
      updateUser(updated);
      setSuccessMsg("Photo de profil supprimée.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setErrorMsg("Erreur lors de la suppression de la photo.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  // Enregistrement des modifications
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updated = await profileApi.update({
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        pays: pays.trim(),
        ville: ville.trim(),
        genre: genre.trim(),
      });
      setProfile(updated);
      updateUser(updated);
      setEditing(false);
      setSuccessMsg("Profil mis à jour avec succès !");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour."
      );
    } finally {
      setSaving(false);
    }
  }

  const initials = (
    (profile?.prenom?.[0] || user?.prenom?.[0] || "T") +
    (profile?.nom?.[0] || user?.nom?.[0] || "S")
  ).toUpperCase();

  const currentPhoto = profile?.photo || user?.photo;
  const fullName = `${profile?.prenom || user?.prenom || "Testeur"} ${
    profile?.nom || user?.nom || ""
  }`.trim();
  const email = profile?.email || user?.email || "";

  return (
    <div className="relative min-h-screen bg-[#F8F9FB] pb-28 text-slate-800">
      {/* ── 1. Top Sky-Blue Gradient Header (comme Image 5) ── */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE]/70 to-[#F8F9FB] pointer-events-none" />

      <div className="relative max-w-md mx-auto px-4 pt-6">
        {/* Navigation Bar / Titre & Cloche */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mon Profil
          </h1>
          <Link
            to="/dashboard/notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs border border-slate-100 text-slate-700 hover:bg-slate-50 transition active:scale-95"
            title="Notifications"
          >
            <Bell size={18} />
          </Link>
        </div>

        {/* Messages Toast d'alerte */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-3 text-xs font-semibold text-emerald-800 shadow-xs animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-xs font-semibold text-red-800 shadow-xs animate-in fade-in">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── 2. Profile Identity Row (Avatar + Edit Button) ── */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Avatar Circle */}
            <div className="relative">
              {uploadingPhoto ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-sky-100 text-sky-600 shadow-md">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={fullName}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md bg-white"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-sky-400 to-indigo-500 text-2xl font-bold text-white shadow-md">
                  {initials}
                </div>
              )}

              {/* Camera Action Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-xs transition hover:bg-brand-orange hover:scale-110 active:scale-95 disabled:opacity-50"
                title="Changer la photo de profil"
              >
                <Camera size={11} />
              </button>
            </div>
          </div>

          {/* Edit Pill Button (Exactement comme dans l'Image 5) */}
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full bg-white/90 border border-slate-200/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 active:scale-95 mt-1"
          >
            <Edit2 size={12} className="text-slate-500" />
            <span>Modifier</span>
          </button>
        </div>

        {/* User Name & Email */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {fullName}
          </h2>
          <p className="text-xs font-normal text-slate-500 mt-0.5">{email}</p>

          {/* Quick photo remove option if custom photo exists */}
          {currentPhoto && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={uploadingPhoto}
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 transition"
            >
              <Trash2 size={10} />
              <span>Supprimer la photo</span>
            </button>
          )}
        </div>

        {/* ── 3. Section Account (comme Image 5) ── */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-slate-800 px-1 mb-2.5">
            Compte
          </h3>

          <div className="rounded-3xl bg-white border border-slate-100/90 shadow-xs overflow-hidden divide-y divide-slate-100/70">
            {/* Item 1: Informations Personnelles */}
            <button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                  <UserIcon size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Informations personnelles
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {profile?.telephone || "Ajouter un téléphone"} ·{" "}
                    {profile?.ville || profile?.pays || "Localisation"}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </button>

            {/* Item 2: Historique des missions */}
            <button
              onClick={() => navigate("/dashboard/historique")}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                  <History size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Historique des missions
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Consulter vos participations et gains
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* ── 4. Section Setting (comme Image 5) ── */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 px-1 mb-2.5">
            Paramètres
          </h3>

          <div className="rounded-3xl bg-white border border-slate-100/90 shadow-xs overflow-hidden divide-y divide-slate-100/70">
            {/* Notification Preferences */}
            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                  <Bell size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  Préférences de notifications
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </button>

            {/* Privacy & Security */}
            <button
              onClick={() => setShowSecurityModal(true)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                  <Lock size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  Confidentialité & Sécurité
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </button>

            {/* Log Out Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-red-50/50 transition text-left active:bg-red-100/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500 shrink-0">
                  <LogOut size={16} />
                </div>
                <span className="text-xs font-bold text-red-600">
                  Se déconnecter
                </span>
              </div>
              <ChevronRight size={16} className="text-red-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL 1 : Édition Informations Personnelles ── */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Modifier mes coordonnées
                </h3>
                <p className="text-xs text-slate-500">
                  Mettez à jour vos informations de testeur
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Phone size={13} />
                  </span>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pays de résidence
                  </label>
                  <select
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {PAYS_LIST.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Ex: Abidjan"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white"
                >
                  <option value="">Sélectionnez votre genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Non précisé">Non précisé</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2 : Moyens de paiement & Retraits ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Moyens de paiement
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Réception des rémunérations de test
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                    W
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Wave Money</p>
                    <p className="text-[11px] text-slate-500">
                      {profile?.telephone || "Numéro associé à votre compte"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
                  Disponible
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                    OM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Orange Money
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {profile?.telephone || "Numéro associé à votre compte"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
                  Disponible
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-yellow-50/60 border border-yellow-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-xs flex items-center justify-center">
                    MTN
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      MTN / Moov Money
                    </p>
                    <p className="text-[11px] text-slate-500">Afrique de l'Ouest & Centrale</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100/80 px-2 py-0.5 rounded-full">
                  Disponible
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              💡 Les paiements sont envoyés automatiquement sur votre numéro de téléphone dès la validation complète des 14 jours de test.
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3 : Confidentialité & Sécurité ── */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Sécurité & Confidentialité
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Protection de votre compte
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50">
                <p className="font-bold text-slate-800 mb-1">
                  Chiffrement de bout en bout
                </p>
                <p className="text-[11px] text-slate-500">
                  Toutes vos validations de jours et feedbacks envoyés aux développeurs sont sécurisés via tokens JWT cryptographiques.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50">
                <p className="font-bold text-slate-800 mb-1">
                  Données personnelles
                </p>
                <p className="text-[11px] text-slate-500">
                  Votre identité réelle et coordonnées bancaires ne sont jamais partagées avec les développeurs tiers.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition hover:bg-slate-800"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4 : Statut Panéliste ── */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="text-center py-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-100 flex items-center justify-center mb-3">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Panéliste Actif SAMRE
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Votre compte est qualifié pour participer aux programmes de test officiel de 14 jours sur Google Play Store.
              </p>
            </div>

            <div className="mt-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-emerald-800 text-xs">
              <p className="font-bold mb-0.5">Avantages du statut vérifié :</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-700">
                <li>Accès prioritaire aux nouvelles missions publiées</li>
                <li>Rémunération garantie après les 14 validations journalières</li>
                <li>Support technique dédié</li>
              </ul>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5 : Confirmation de Déconnexion ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center mb-3">
              <LogOut size={22} />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Déconnexion
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Êtes-vous sûr de vouloir vous déconnecter de votre espace testeur ?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

