import { useEffect, useState, useRef } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users as GenderIcon,
  LogOut,
  Save,
  Loader2,
  Edit2,
  X,
  Camera,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(user || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Mode édition des coordonnées
  const [editing, setEditing] = useState(false);
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
          setSuccessMsg("Photo de profil mise à jour avec succès !");
          setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'enregistrement de la photo.");
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

  // Enregistrement des modifications textes
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
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    ((profile?.prenom?.[0] || user?.prenom?.[0] || "T") +
      (profile?.nom?.[0] || user?.nom?.[0] || "S")).toUpperCase();

  const currentPhoto = profile?.photo || user?.photo;

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Header Carte Profil avec Gestion Photo */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar avec déclencheur de photo */}
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {uploadingPhoto ? (
                  <div className="flex h-18 w-18 items-center justify-center rounded-2xl border-2 border-brand-orange/30 bg-orange-50 text-brand-orange shadow-sm">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                ) : currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={profile?.prenom || "Profil"}
                    className="h-18 w-18 rounded-2xl object-cover border-2 border-white shadow-md shadow-navy-950/10"
                  />
                ) : (
                  <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-tr from-navy-900 via-navy-800 to-brand-orange text-2xl font-bold text-white shadow-md shadow-navy-950/10">
                    {initials}
                  </div>
                )}

                {/* Bouton Caméra superposé */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-navy-900 text-white shadow-xs transition hover:bg-brand-orange hover:scale-105 active:scale-95 disabled:opacity-50"
                  title="Téléverser une photo de profil"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div>
                <h1 className="font-display text-lg font-bold text-navy-900">
                  {profile?.prenom || user?.prenom} {profile?.nom || user?.nom}
                </h1>
                <p className="text-xs text-slate-400">{profile?.email || user?.email}</p>
                
                {/* Actions Photo rapides */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="text-[11px] font-semibold text-brand-orange transition hover:underline"
                  >
                    {currentPhoto ? "Changer la photo" : "Ajouter une photo"}
                  </button>
                  {currentPhoto && (
                    <>
                      <span className="text-slate-200">·</span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={uploadingPhoto}
                        className="text-[11px] font-semibold text-red-500 transition hover:underline"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 self-start sm:self-auto"
              >
                <Edit2 size={13} className="text-brand-orange" />
                <span>Modifier les infos</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications de succès ou d'erreur */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-700">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Formulaire d'édition OU Affichage des informations */}
        {editing ? (
          <form onSubmit={handleSave} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-sm font-bold text-navy-900">
                Modifier mes informations personnelles
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
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
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+225 07 00 00 00 00"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pays de résidence
                </label>
                <select
                  value={pays}
                  onChange={(e) => setPays(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white"
                >
                  <option value="">Sélectionnez votre pays</option>
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
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-navy-900 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white"
                >
                  <option value="">Sélectionnez votre genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Non précisé">Non précisé</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-brand-orange px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm divide-y divide-slate-100">
            <div className="flex items-center gap-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shrink-0">
                <UserIcon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Nom complet
                </p>
                <p className="text-xs font-bold text-navy-900 mt-0.5">
                  {profile?.prenom || user?.prenom} {profile?.nom || user?.nom}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shrink-0">
                <Mail size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Adresse e-mail
                </p>
                <p className="text-xs font-bold text-navy-900 truncate mt-0.5">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shrink-0">
                <Phone size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Téléphone
                </p>
                <p className="text-xs font-bold text-navy-900 mt-0.5">
                  {profile?.telephone || user?.telephone || "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shrink-0">
                <Globe size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Pays de résidence
                </p>
                <p className={`text-xs font-bold mt-0.5 ${profile?.pays || user?.pays ? "text-navy-900" : "text-slate-400 italic font-normal"}`}>
                  {profile?.pays || user?.pays || "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Ville
                </p>
                <p className={`text-xs font-bold mt-0.5 ${profile?.ville || user?.ville ? "text-navy-900" : "text-slate-400 italic font-normal"}`}>
                  {profile?.ville || user?.ville || "Non renseignée"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 shrink-0">
                <GenderIcon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Genre
                </p>
                <p className={`text-xs font-bold mt-0.5 ${profile?.genre || user?.genre ? "text-navy-900" : "text-slate-400 italic font-normal"}`}>
                  {profile?.genre || user?.genre || "Non précisé"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bouton de déconnexion */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white py-3 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            <LogOut size={15} />
            <span>Se déconnecter de SAMRE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
