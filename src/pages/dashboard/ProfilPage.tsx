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
  Crown,
  Wallet,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { profileApi, participationsApi, getImageUrl, type User, type Participation } from "@/lib/api";
import UserAvatar from "@/components/ui/UserAvatar";

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
  const [participations, setParticipations] = useState<Participation[]>([]);
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
    Promise.all([
      profileApi.show().catch(() => user || null),
      participationsApi.mine().catch(() => []),
    ])
      .then(([data, parts]) => {
        if (data) {
          setProfile(data);
          setNom(data.nom || "");
          setPrenom(data.prenom || "");
          setTelephone(data.telephone || "");
          setPays(data.pays || "");
          setVille(data.ville || "");
          setGenre(data.genre || "");
        }
        setParticipations(parts || []);
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

  // Calcul dynamique des gains et points réels
  const totalRemunerationGagnee = participations.reduce((acc, p) => {
    const dailyRate = parseFloat(String(p.mission?.remuneration || 0));
    const completedDays = Math.max(p.etapesCompletees || 0, new Set(p.joursValides || []).size);
    return acc + (isNaN(dailyRate) ? 0 : dailyRate * completedDays);
  }, 0);

  const totalJoursValides = participations.reduce(
    (sum, p) => sum + (p.etapesCompletees ?? 0),
    0
  );
  const currentPts = (totalJoursValides * 20) + 120;
  const maxPts = 500;
  const ptsProgress = Math.min(100, Math.round((currentPts / maxPts) * 100));

  return (
    <div className="relative min-h-screen bg-[#F8F9FB] pb-28 text-slate-800">
      {/* Messages Toast d'alerte */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-white/95 p-3 text-xs font-semibold text-emerald-800 shadow-lg animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-red-200/80 bg-white/95 p-3 text-xs font-semibold text-red-800 shadow-lg animate-in fade-in">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 1. VUE MOBILE (Uniquement sur écrans mobiles < lg)                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* En-tête Dégradé Bleu Ciel & Orange SAMRE */}
        <div
          className="absolute top-0 inset-x-0 h-64 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #38BDF8 0%, #60A5FA 30%, #FDBA74 75%, #F97316 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-[#F8F9FB]" />
        </div>

        <div className="relative max-w-md mx-auto px-4 pt-8">
          {/* Profile Identity Mobile */}
          <div className="flex flex-col items-center text-center mb-4 pt-3">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {uploadingPhoto ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/80 text-blue-600 shadow-lg">
                  <Loader2 size={26} className="animate-spin" />
                </div>
              ) : (
                <UserAvatar
                  photo={currentPhoto}
                  name={fullName}
                  prenom={profile?.prenom || user?.prenom}
                  nom={profile?.nom || user?.nom}
                  size="xl"
                  ringClassName="border-4 border-white shadow-lg"
                />
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0B1727] text-white shadow-xs transition hover:bg-brand-orange active:scale-95"
                title="Changer la photo de profil"
              >
                <Camera size={13} />
              </button>
            </div>

            <h1 className="font-display text-[22px] font-extrabold text-[#0F172A] tracking-tight mt-4 leading-tight">
              {fullName || user?.prenom || user?.nom || "Mon Compte"}
            </h1>
            <p className="text-[12px] font-medium text-slate-600 mt-1">
              {email || user?.email || ""}
            </p>
          </div>

          {/* Liste des Options Mobile (abaissée significativement) */}
          <div className="mt-8 rounded-[24px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-slate-100 mb-5">
            <button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60">
                  <UserIcon size={17} />
                </div>
                <span className="font-display text-[13px] font-bold text-[#0F172A]">
                  Mon profil
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
            </button>

            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60">
                  <Bell size={17} />
                </div>
                <span className="font-display text-[13px] font-bold text-[#0F172A]">
                  Notifications
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
            </button>

            <button
              onClick={() => setShowStatusModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition text-left active:bg-slate-100/60"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60">
                  <HelpCircle size={17} />
                </div>
                <span className="font-display text-[13px] font-bold text-[#0F172A]">
                  Aide & support
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] py-3.5 px-4 text-xs font-extrabold text-[#EF4444] transition active:scale-98 hover:bg-red-100/80 shadow-2xs mb-8"
          >
            <LogOut size={16} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 2. VUE DESKTOP (Structure identique à la version mobile avec menu)      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block max-w-xl mx-auto px-6 pt-10 pb-16">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {/* Identity Desktop : Avatar, Nom & Email */}
          <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100">
            <div className="relative mb-3.5">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {uploadingPhoto ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-50 bg-slate-50 text-blue-600 shadow-md">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                <UserAvatar
                  photo={currentPhoto}
                  name={fullName}
                  prenom={profile?.prenom || user?.prenom}
                  nom={profile?.nom || user?.nom}
                  size="xl"
                  ringClassName="border-4 border-slate-50 shadow-md"
                />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0F172A] text-white shadow-xs transition hover:bg-brand-orange active:scale-95"
                title="Changer la photo de profil"
              >
                <Camera size={13} />
              </button>
            </div>

            <h1 className="font-display text-2xl font-black text-[#0F172A] tracking-tight">
              {fullName || user?.prenom || user?.nom || "Mon Compte"}
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {email || user?.email || ""}
            </p>
          </div>

          {/* Menu des options (Mon profil, Notifications, Aide & support) */}
          <div className="py-3 divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-between py-4 px-2 hover:bg-slate-50/80 rounded-2xl transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60 group-hover:scale-105 transition">
                  <UserIcon size={18} />
                </div>
                <div>
                  <span className="font-display text-sm font-bold text-[#0F172A]">
                    Mon profil
                  </span>
                  <p className="text-[11px] text-slate-400">Modifier mes informations personnelles</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/notifications")}
              className="w-full flex items-center justify-between py-4 px-2 hover:bg-slate-50/80 rounded-2xl transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60 group-hover:scale-105 transition">
                  <Bell size={18} />
                </div>
                <div>
                  <span className="font-display text-sm font-bold text-[#0F172A]">
                    Notifications
                  </span>
                  <p className="text-[11px] text-slate-400">Consulter mes alertes et messages</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition" />
            </button>

            <button
              type="button"
              onClick={() => setShowStatusModal(true)}
              className="w-full flex items-center justify-between py-4 px-2 hover:bg-slate-50/80 rounded-2xl transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60 group-hover:scale-105 transition">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <span className="font-display text-sm font-bold text-[#0F172A]">
                    Aide &amp; support
                  </span>
                  <p className="text-[11px] text-slate-400">Statut panéliste et assistance</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition" />
            </button>
          </div>

          {/* Bouton Se Déconnecter en bas */}
          <div className="pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] py-3.5 px-4 text-xs font-extrabold text-[#EF4444] transition hover:bg-red-100/80 active:scale-98 shadow-2xs"
            >
              <LogOut size={16} />
              <span>Se déconnecter</span>
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

