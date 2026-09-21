import { useState, useEffect } from "react";
import Link, { useRouter } from "@/lib/router";
import {
  Smartphone,
  Users,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  Star,
  Check,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { authApi } from "@/lib/api";

type Mode = "login" | "signup" | "forgot-password";

// Composants Avatars vectoriels haute précision inspirés de la maquette
function AvatarTester1({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#2563EB" fillOpacity="0.3" />
      <circle cx="50" cy="50" r="46" fill="#1E3A8A" />
      {/* Peau & visage */}
      <circle cx="50" cy="42" r="18" fill="#C6865A" />
      {/* Cheveux */}
      <path d="M32 38C32 26 38 20 50 20C62 20 68 26 68 38C68 40 66 34 50 34C34 34 32 40 32 38Z" fill="#18181B" />
      {/* Yeux & sourire */}
      <circle cx="43" cy="42" r="2" fill="#18181B" />
      <circle cx="57" cy="42" r="2" fill="#18181B" />
      <path d="M46 48C47.5 50.5 52.5 50.5 54 48" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      {/* Hoodie bleu */}
      <path d="M22 88C22 70 34 62 50 62C66 62 78 70 78 88" fill="#2563EB" />
      <path d="M42 62L50 74L58 62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function AvatarTester2({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#F59E0B" fillOpacity="0.3" />
      <circle cx="50" cy="50" r="46" fill="#78350F" />
      {/* Cheveux frisés volumineux */}
      <circle cx="50" cy="38" r="24" fill="#1C1917" />
      <circle cx="34" cy="36" r="12" fill="#1C1917" />
      <circle cx="66" cy="36" r="12" fill="#1C1917" />
      {/* Visage */}
      <circle cx="50" cy="44" r="17" fill="#93532C" />
      {/* Yeux & sourire */}
      <circle cx="43" cy="44" r="2" fill="#1C1917" />
      <circle cx="57" cy="44" r="2" fill="#1C1917" />
      <path d="M46 51C47.5 53.5 52.5 53.5 54 51" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {/* Haut moutarde / orange */}
      <path d="M22 88C22 70 34 64 50 64C66 64 78 70 78 88" fill="#F59E0B" />
    </svg>
  );
}

function AvatarTester3({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#3B82F6" fillOpacity="0.3" />
      <circle cx="50" cy="50" r="46" fill="#1E293B" />
      {/* Visage */}
      <circle cx="50" cy="43" r="17" fill="#D49A6A" />
      {/* Cheveux courts */}
      <path d="M33 38C33 25 40 22 50 22C60 22 67 25 67 38C67 34 62 30 50 30C38 30 33 34 33 38Z" fill="#292524" />
      {/* Lunettes */}
      <rect x="37" y="38" width="10" height="8" rx="2" stroke="#1C1917" strokeWidth="2" fill="none" />
      <rect x="53" y="38" width="10" height="8" rx="2" stroke="#1C1917" strokeWidth="2" fill="none" />
      <line x1="47" y1="42" x2="53" y2="42" stroke="#1C1917" strokeWidth="2" />
      <circle cx="42" cy="42" r="1.5" fill="#1C1917" />
      <circle cx="58" cy="42" r="1.5" fill="#1C1917" />
      {/* Sourire */}
      <path d="M46 50C47.5 52 52.5 52 54 50" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      {/* Pull bleu foncé */}
      <path d="M22 88C22 71 34 64 50 64C66 64 78 71 78 88" fill="#1D4ED8" />
    </svg>
  );
}

export default function AuthForm({ mode = "login" }: { mode?: Mode }) {
  const router = useRouter();
  const { login, register, logout } = useAuth();
  const { adminLogin } = useAdminAuth();
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const isSignup = activeMode === "signup";
  const isForgotPassword = activeMode === "forgot-password";

  // Mettre à jour l'état si la prop change
  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const emailTrimmed = forgotEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(emailTrimmed);
      setSuccessMsg(
        res.message ||
          "Un nouveau mot de passe temporaire a été envoyé à votre adresse email avec succès."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Aucun compte n'a été trouvé avec cette adresse email."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError(null);

    if (isSignup && (!form.nom || !form.prenom)) {
      setError("Nom et prénom sont requis.");
      return;
    }
    if (!form.email || !form.password) {
      setError("Email et mot de passe sont requis.");
      return;
    }
    if (isSignup && form.password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await register(form);
        router.push("/dashboard");
      } else {
        try {
          await adminLogin(form.email, form.password);
          router.replace("/admin");
          return;
        } catch {
          // Si ce ne sont pas des identifiants admin, le même formulaire sert au membre.
        }

        const loggedUser = await login(form.email, form.password);
        if (loggedUser?.role === "admin") {
          logout("/connexion");
          setError("Impossible d'ouvrir la session administrateur.");
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#e9eef3] font-sans antialiased text-slate-100 flex items-start justify-center px-0 py-0 sm:items-center sm:bg-[#071933] sm:p-6 lg:p-10">
      {/* Halos lumineux d'ambiance inspirés de la maquette */}
      <div className="pointer-events-none absolute -top-28 -right-28 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-brand-orange/20 to-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-brand-orange/25 via-blue-700/20 to-transparent blur-[140px]" />
      
      {/* Anneau décoratif orange en haut à droite (comme sur la maquette) */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full border-[3px] border-brand-orange/60 opacity-70 blur-[0.5px]" />
      <div className="pointer-events-none absolute -top-8 -right-8 h-48 w-48 rounded-full border border-blue-400/20" />

      {/* Grille de points (Dot grid) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#93C5FD 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Conteneur principal plein écran façon split-screen moderne */}
      <div className="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 gap-0 sm:gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
        
        {/* ========================================================================= */}
        {/* SECTION GAUCHE : HERO & VISUEL SMARTPHONE AVEC PANÉLISTES (55%) */}
        {/* ========================================================================= */}
        <div className="order-1 lg:order-none lg:col-span-7 flex flex-col justify-between space-y-4 bg-[#071933] px-4 pb-8 pt-5 sm:bg-transparent sm:px-0 sm:py-0 lg:-translate-y-4">
          
          {/* Logo SAMRE + Tagline en haut à gauche */}
          <div className="hidden sm:block">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-md ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                <img
                  src="/logo.png"
                  alt="SAMRE Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                  SAMRE
                </span>
                <span className="text-[11px] sm:text-xs font-medium tracking-wide text-blue-200/90">
                  Testez &middot; Donnez votre avis &middot; Faites la diff&eacute;rence
                </span>
              </div>
            </Link>
          </div>

          {/* Titre Principal & Description */}
          <div className="hidden sm:block max-w-2xl space-y-3.5">
            <h1 className="font-display text-3xl font-extrabold leading-[1.18] tracking-tight text-white sm:text-4xl xl:text-5xl">
              Des tests r&eacute;els pour de{" "}
              <span className="text-brand-orange drop-shadow-sm">
                meilleures applications
              </span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100/80 max-w-xl leading-relaxed">
              Rejoignez notre communaut&eacute; de testeurs et contribuez &agrave; am&eacute;liorer
              les applications de demain.
            </p>
          </div>

          {/* Composition Visuelle Centrale : Smartphone 3D & Panélistes Flottants */}
          <div className="relative mx-auto flex h-[205px] w-full max-w-xl items-center justify-center overflow-hidden py-2 sm:h-auto sm:overflow-visible sm:py-6">
            
            {/* Anneaux lumineux au sol (Socle circulaire sous le téléphone) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-72 w-72 sm:h-80 sm:w-80 rounded-full border border-blue-400/25 animate-glow-pulse" />
              <div className="absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full border border-blue-300/35 bg-blue-600/10 shadow-[0_0_60px_rgba(37,99,235,0.35)]" />
              <div className="absolute h-40 w-40 rounded-full border border-blue-400/40" />
            </div>

            {/* Téléphone central flottant avec l'interface */}
            <div className="relative z-10 w-[200px] sm:w-[220px] rounded-[36px] border-[6px] border-[#132C52] bg-[#0A1A33] p-2 shadow-2xl shadow-black/80 ring-1 ring-blue-400/30 transition-transform duration-500 hover:scale-[1.02]">
              {/* Écran du smartphone */}
              <div className="flex h-[205px] flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1C4E8C] to-[#123668] p-3 text-white sm:h-[400px]">
                {/* Barre de statut supérieure */}
                <div className="flex items-center justify-between text-[9px] text-blue-200 px-1 pt-1 font-semibold">
                  <span>09:41</span>
                  <div className="h-2 w-8 rounded-full bg-slate-900/60" />
                  <span>100%</span>
                </div>

                {/* Contenu de l'écran (Interface app testée) */}
                <div className="mt-3 space-y-2.5 flex-1">
                  {/* Image Hero dans l'app */}
                  <div className="relative h-24 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/20 blur-sm" />
                    <Smartphone className="h-8 w-8 text-white/90 drop-shadow-md animate-float" />
                  </div>

                  {/* Lignes de skeleton/contenu UI */}
                  <div className="space-y-1.5 px-1 pt-1">
                    <div className="h-2.5 w-3/4 rounded-full bg-white/40" />
                    <div className="h-2 w-1/2 rounded-full bg-white/20" />
                  </div>

                  {/* Carte intermédiaire */}
                  <div className="rounded-xl bg-white/10 p-2 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-md bg-brand-orange/80 flex items-center justify-center text-[9px] font-bold text-white">
                        ✓
                      </div>
                      <span className="text-[10px] text-blue-100 font-medium">Test du Jour</span>
                    </div>
                    <span className="text-[9px] text-brand-orange font-bold">Actif</span>
                  </div>
                </div>

                {/* Bouton bleu d'action principale en bas du téléphone */}
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="w-full rounded-xl bg-blue-500 py-2 flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Check className="h-4 w-4 text-white stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* AVATARS FLOTTANTS CONNECTÉS (Panélistes de la communauté) */}
            
            {/* Avatar 1 : En haut (Garçon en hoodie bleu) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-hero-float">
              <div className="rounded-full p-1 bg-[#0A1F3C] ring-2 ring-blue-400 shadow-xl shadow-blue-900/50">
                <AvatarTester1 className="h-12 w-12 sm:h-14 sm:w-14" />
              </div>
              <div className="h-6 w-[2px] bg-gradient-to-b from-blue-400 to-transparent" />
            </div>

            {/* Avatar 2 : À gauche (Femme haut moutarde) */}
            <div className="absolute top-1/2 -left-3 sm:left-4 -translate-y-1/2 z-20 flex items-center animate-hero-float-slow">
              <div className="rounded-full p-1 bg-[#0A1F3C] ring-2 ring-brand-orange/80 shadow-xl shadow-brand-orange/20">
                <AvatarTester2 className="h-11 w-11 sm:h-13 sm:w-13" />
              </div>
            </div>

            {/* Avatar 3 : En bas à gauche (Homme avec lunettes) */}
            <div className="absolute bottom-2 left-10 sm:left-14 z-20 flex flex-col items-center animate-hero-float">
              <div className="rounded-full p-1 bg-[#0A1F3C] ring-2 ring-blue-400 shadow-xl shadow-blue-900/50">
                <AvatarTester3 className="h-11 w-11 sm:h-13 sm:w-13" />
              </div>
            </div>

            {/* BADGES FLOTTANTS DU DESIGN (Étoiles, Sécurité, Message) */}
            
            {/* Badge Sécurité Shield (à gauche du smartphone) */}
            <div className="absolute top-28 left-16 sm:left-24 z-20 rounded-2xl bg-blue-500 p-2.5 text-white shadow-xl shadow-blue-500/40 border border-blue-300/40 animate-float">
              <ShieldCheck className="h-5 w-5" />
            </div>

            {/* Badge Message / Check (à droite du smartphone) */}
            <div className="absolute top-1/2 -right-1 sm:right-6 -translate-y-1/2 z-20 rounded-2xl bg-blue-500 p-2.5 text-white shadow-xl shadow-blue-500/40 border border-blue-300/40 animate-hero-float">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>

            {/* Carte Avis & Étoiles (en bas à droite du smartphone) */}
            <div className="absolute bottom-4 -right-4 sm:right-2 z-20 rounded-2xl bg-white p-3 sm:p-3.5 shadow-2xl shadow-black/60 text-slate-800 border border-slate-100 flex flex-col gap-1.5 animate-hero-float-slow">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <Star size={14} className="fill-amber-400 text-amber-400" />
              </div>
              <div className="h-2 w-20 rounded-full bg-blue-600" />
            </div>

            {/* Pastille orange flottante décorative */}
            <div className="absolute top-10 right-10 h-3.5 w-3.5 rounded-full bg-brand-orange shadow-[0_0_12px_rgba(242,129,29,0.9)] animate-pulse" />
          </div>

          {/* 3 Cartouches caractéristiques avec icônes rondes */}
        </div>

        {/* ========================================================================= */}
        {/* SECTION DROITE : CARTE BLANCHE FLOTTANTE AVEC FORMULAIRE (45%) */}
        {/* ========================================================================= */}
        <div className="relative z-20 order-2 -mt-10 flex items-start justify-center px-3 pb-5 lg:order-none lg:col-span-5 lg:mt-0 lg:px-0 lg:pb-0 lg:items-center">
          <div className="w-full max-w-[440px] rounded-[28px] border border-white/80 bg-white p-5 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition-all duration-300 sm:rounded-[32px] sm:p-9 sm:shadow-2xl sm:shadow-black/40">
            
            {/* Logo SAMRE en haut de la carte blanche */}
            <div className="mb-4 flex items-center justify-center sm:mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <img
                  src="/logo.png"
                  alt="SAMRE Logo"
                  className="h-9 w-9 object-contain"
                />
                <span className="font-display text-2xl font-black tracking-tight text-navy-950">
                  SAMRE
                </span>
              </Link>
            </div>

            {/* VUE 1 : MOT DE PASSE OUBLIÉ */}
            {isForgotPassword ? (
              <div>
                <div className="mb-6 text-left">
                  <h2 className="font-display text-2xl font-extrabold text-navy-950">
                    Mot de passe oubli&eacute; ?
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Saisissez votre adresse e-mail pour recevoir vos instructions de r&eacute;initialisation.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
                    {error}
                  </div>
                )}

                {successMsg ? (
                  <div className="space-y-4 text-center py-2">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={30} />
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs sm:text-sm text-emerald-800">
                      <p className="font-semibold">{successMsg}</p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Consultez votre bo&icirc;te mail pour acc&eacute;der &agrave; votre nouveau mot de passe.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("login");
                        setError(null);
                        setSuccessMsg(null);
                        router.push("/connexion");
                      }}
                      className="flex w-full items-center justify-center rounded-xl bg-navy-950 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-navy-900"
                    >
                      Retour &agrave; la connexion
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        Adresse e-mail
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Mail size={18} />
                        </div>
                        <input
                          id="forgot-email"
                          type="email"
                          required
                          autoComplete="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full rounded-xl border border-slate-200 bg-[#F0F5FA] py-3 pl-11 pr-4 text-sm text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-navy-900 hover:shadow-lg disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <span>Envoyer le mot de passe</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("login");
                          setError(null);
                          router.push("/connexion");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-navy-950"
                      >
                        <ArrowLeft size={14} />
                        Retour &agrave; la connexion
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* VUE 2 : CONNEXION OU INSCRIPTION */
              <>
                <div className="mb-6 text-left">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
                    {isSignup ? "Bienvenue !" : "Bonjour !"}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {isSignup
                      ? "Rejoignez notre communaut\u00e9 de testeurs et commencez vos missions."
                      : "Connectez-vous \u00e0 votre compte pour acc\u00e9der \u00e0 votre espace et \u00e0 vos missions."}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-4"
                >
                  {isSignup && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="prenom"
                          className="mb-1.5 block text-xs font-bold text-slate-700"
                        >
                          Pr&eacute;nom
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <User size={16} />
                          </div>
                          <input
                            id="prenom"
                            type="text"
                            autoComplete="given-name"
                            value={form.prenom}
                            onChange={update("prenom")}
                            placeholder="Jean"
                            className="w-full rounded-xl border border-slate-200 bg-[#F0F5FA] py-3 pl-10 pr-3 text-sm text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="nom"
                          className="mb-1.5 block text-xs font-bold text-slate-700"
                        >
                          Nom
                        </label>
                        <input
                          id="nom"
                          type="text"
                          autoComplete="family-name"
                          value={form.nom}
                          onChange={update("nom")}
                          placeholder="Dupont"
                          className="w-full rounded-xl border border-slate-200 bg-[#F0F5FA] py-3 px-3.5 text-sm text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15"
                        />
                      </div>
                    </div>
                  )}

                  {/* Adresse email avec icône Mail */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="votre@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-[#F0F5FA] py-3 pl-11 pr-4 text-sm text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15"
                      />
                    </div>
                  </div>

                  {isSignup && (
                    <div>
                      <label
                        htmlFor="telephone"
                        className="mb-1.5 block text-xs font-bold text-slate-700"
                      >
                        Num&eacute;ro de t&eacute;l&eacute;phone
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Phone size={17} />
                        </div>
                        <input
                          id="telephone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={form.telephone}
                          onChange={update("telephone")}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full rounded-xl border border-slate-200 bg-[#F0F5FA] py-3 pl-11 pr-4 text-sm text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mot de passe avec icône Lock et toggle Eye */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-xs font-bold text-slate-700"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock size={18} />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        value={form.password}
                        onChange={update("password")}
                        placeholder="Votre mot de passe"
                        className="w-full rounded-xl border border-slate-200 bg-[#F0F5FA] py-3 pl-11 pr-11 text-sm text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Lien Mot de passe oublié (affiché uniquement en mode connexion) */}
                  {!isSignup && (
                    <div className="flex justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("forgot-password");
                          setError(null);
                          setSuccessMsg(null);
                          if (form.email) setForgotEmail(form.email);
                          router.push("/mot-de-passe-oublie");
                        }}
                        className="text-xs font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                      >
                        Mot de passe oubli&eacute; ?
                      </button>
                    </div>
                  )}

                  {/* Bouton principal de soumission */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] py-3.5 text-sm font-bold text-white shadow-lg shadow-navy-950/20 transition-all duration-200 hover:bg-[#061B31] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Chargement...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isSignup ? "S'inscrire" : "Se connecter"}
                        </span>
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Séparateur "OU" avec lignes douces */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-full border-t border-slate-200" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ou
                  </span>
                </div>

                {/* Lien bascule Connexion / Inscription */}
                <div className="text-center text-xs sm:text-sm text-slate-600">
                  {isSignup ? (
                    <p>
                      Vous avez d&eacute;j&agrave; un compte ?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("login");
                          setError(null);
                          router.push("/connexion");
                        }}
                        className="font-bold text-brand-orange transition hover:text-brand-orange-dark hover:underline"
                      >
                        Se connecter
                      </button>
                    </p>
                  ) : (
                    <p>
                      Pas encore de compte ?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("signup");
                          setError(null);
                          router.push("/inscription");
                        }}
                        className="font-bold text-brand-orange transition hover:text-brand-orange-dark hover:underline"
                      >
                        S&apos;inscrire
                      </button>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
