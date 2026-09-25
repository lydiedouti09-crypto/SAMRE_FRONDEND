import { useState, useEffect } from "react";
import Link, { useRouter } from "@/lib/router";
import Image from "@/components/ui/Image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { authApi } from "@/lib/api";

type Mode = "login" | "signup" | "forgot-password";

/* ========================================================================= */
/* ILLUSTRATIONS VECTORIELLES FIDÈLES AUX IMAGES 4 & 5 FOURNIES PAR L'UTILISATEUR */
/* ========================================================================= */

// 1. Illustration Sign In / Se connecter (Style Image 4 & 5)
function SignInIllustration({ className = "h-40 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Halo d'arrière-plan doux */}
      <ellipse cx="120" cy="155" rx="75" ry="12" fill="#FDE68A" fillOpacity="0.4" />
      <circle cx="175" cy="55" r="4" fill="#F97316" />
      <circle cx="65" cy="75" r="3" fill="#F97316" />
      <path d="M190 70L194 74M194 70L190 74" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 95L54 99M54 95L50 99" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

      {/* Écran d'ordinateur / Dashboard stylisé */}
      <rect x="75" y="60" width="70" height="50" rx="8" fill="#0F172A" />
      <rect x="78" y="63" width="64" height="38" rx="5" fill="#FFFFFF" />
      {/* Header écran */}
      <rect x="82" y="67" width="14" height="4" rx="2" fill="#F97316" />
      <circle cx="136" cy="69" r="1.5" fill="#CBD5E1" />
      <circle cx="132" cy="69" r="1.5" fill="#CBD5E1" />
      {/* Contenu écran (Dashboard barres) */}
      <rect x="82" y="76" width="30" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="82" y="82" width="22" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="82" y="90" width="8" height="8" rx="2" fill="#F97316" />
      <rect x="94" y="86" width="8" height="12" rx="2" fill="#0F172A" />
      <rect x="106" y="80" width="8" height="18" rx="2" fill="#3B82F6" />
      {/* Pied de l'écran */}
      <path d="M104 110L100 125H120L116 110H104Z" fill="#0F172A" />
      <rect x="92" y="125" width="36" height="4" rx="2" fill="#0F172A" />

      {/* Personnage Testeur stylisé (Style Image 5) */}
      {/* Tête */}
      <circle cx="150" cy="58" r="17" fill="#C6865A" />
      {/* Cheveux foncés / Casquette */}
      <path d="M133 55C133 44 140 38 152 38C164 38 169 44 169 55C169 57 165 52 152 52C139 52 133 57 133 55Z" fill="#0F172A" />
      {/* Visière casquette stylisée */}
      <path d="M133 50C130 50 124 53 120 57C130 57 140 55 145 52L133 50Z" fill="#0F172A" />
      {/* Visage profil */}
      <circle cx="140" cy="58" r="2" fill="#0F172A" />
      {/* Buste / Hoodie Bleu Nuit SAMRE */}
      <path d="M125 120C125 96 135 84 150 84C165 84 175 96 175 120H125Z" fill="#0F172A" />
      {/* Bras interagissant */}
      <path d="M138 95L120 108" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
      <circle cx="118" cy="110" r="5" fill="#C6865A" />
    </svg>
  );
}

// 2. Illustration Sign Up / Créer un compte (Style Image 4 & 5)
function SignUpIllustration({ className = "h-40 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Halo d'arrière-plan */}
      <ellipse cx="120" cy="155" rx="75" ry="12" fill="#FFEDD5" fillOpacity="0.5" />
      <circle cx="185" cy="50" r="3.5" fill="#F97316" />
      <circle cx="55" cy="65" r="3" fill="#F97316" />
      <path d="M185 85L189 89M189 85L185 89" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 100L62 104M62 100L58 104" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

      {/* Badge ID / Carte Testeur avec bouton plus (+) */}
      <g transform="translate(48, 60)">
        <rect x="0" y="0" width="38" height="26" rx="6" fill="#0F172A" />
        <rect x="6" y="7" width="12" height="4" rx="2" fill="#FFFFFF" />
        <rect x="6" y="14" width="22" height="3" rx="1.5" fill="#CBD5E1" />
        <circle cx="28" cy="8" r="3" fill="#F97316" />
      </g>
      {/* Pastille badge '+' Orange */}
      <circle cx="152" cy="72" r="10" fill="#F97316" />
      <path d="M152 67V77M147 72H157" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Carte d'accès / Smartphone dans la main */}
      <rect x="150" y="100" width="36" height="22" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      <rect x="156" y="106" width="16" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="156" y="112" width="10" height="3" rx="1.5" fill="#F97316" />

      {/* Personnage Testeur stylisé (Style Image 5) */}
      <circle cx="120" cy="56" r="18" fill="#C6865A" />
      {/* Cheveux / Bonnet */}
      <path d="M102 54C102 42 109 36 122 36C135 36 140 42 140 54C140 57 136 50 122 50C108 50 102 57 102 54Z" fill="#0F172A" />
      <circle cx="114" cy="56" r="2" fill="#0F172A" />
      <circle cx="126" cy="56" r="2" fill="#0F172A" />
      {/* Sourire */}
      <path d="M117 63C118.5 65.5 121.5 65.5 123 63" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
      {/* Buste / Haut Orange SAMRE */}
      <path d="M92 125C92 98 104 86 120 86C136 86 148 98 148 125H92Z" fill="#0F172A" />
    </svg>
  );
}

// 3. Illustration Forgot Password / Mot de passe oublié (Style Image 4)
function ForgotPasswordIllustration({ className = "h-40 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="155" rx="75" ry="12" fill="#E0F2FE" fillOpacity="0.5" />
      <circle cx="180" cy="50" r="3.5" fill="#F97316" />
      <circle cx="50" cy="70" r="3" fill="#F97316" />
      <path d="M185 80L189 84M189 80L185 84" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

      {/* Ordinateur portable avec clé de récupération */}
      <rect x="85" y="85" width="70" height="42" rx="6" fill="#0F172A" />
      <rect x="88" y="88" width="64" height="34" rx="4" fill="#FFFFFF" />
      {/* Symbole Cadenas au centre de l'écran */}
      <rect x="114" y="103" width="12" height="10" rx="2.5" fill="#F97316" />
      <path d="M117 103V99C117 97.5 118.5 96 120 96C121.5 96 123 97.5 123 99V103" stroke="#F97316" strokeWidth="2" fill="none" />
      {/* Base du clavier */}
      <path d="M75 127L82 127L158 127L165 127C168 127 169 129 166 131L156 135H84L74 131C71 129 72 127 75 127Z" fill="#CBD5E1" />

      {/* Personnage penché sur le laptop */}
      <circle cx="145" cy="55" r="16" fill="#C6865A" />
      <path d="M130 52C130 40 137 34 148 34C159 34 164 40 164 52C164 55 160 48 148 48C136 48 130 55 130 52Z" fill="#0F172A" />
      <circle cx="139" cy="55" r="2" fill="#0F172A" />
      <path d="M128 115C128 92 138 82 152 82C166 82 174 92 174 115H128Z" fill="#0F172A" />
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

  // Gestion de la saisie "Nom complet" pour séparer nom et prénom proprement
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const full = e.target.value;
    const parts = full.trim().split(" ");
    if (parts.length > 1) {
      setForm((f) => ({
        ...f,
        prenom: parts[0],
        nom: parts.slice(1).join(" "),
      }));
    } else {
      setForm((f) => ({
        ...f,
        prenom: full,
        nom: "",
      }));
    }
  };

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
          "Un nouveau mot de passe a été envoyé à votre adresse email avec succès."
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

    if (isSignup && (!form.prenom || !form.nom)) {
      if (!form.prenom) {
        setError("Veuillez saisir votre nom complet.");
        return;
      }
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
        // Enregistrement d'un nouveau panéliste
        await register({
          ...form,
          nom: form.nom || form.prenom,
        });
        router.push("/dashboard");
      } else {
        // Tentative de connexion (Admin puis Testeur)
        try {
          await adminLogin(form.email, form.password);
          router.replace("/admin");
          return;
        } catch {
          // Si ce n'est pas un admin, connexion en tant que testeur standard
        }

        const loggedUser = await login(form.email, form.password);
        if (loggedUser?.role === "admin") {
          logout("/connexion");
          setError("Impossible d'ouvrir la session administrateur ici.");
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
    <div className="min-h-screen w-full bg-[#F4F7FC] lg:grid lg:grid-cols-12 font-sans antialiased text-slate-800">
      {/* Panneau latéral gauche pour la version PC Desktop */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-[#0A1C38] text-white flex-col justify-between p-10 xl:p-14 relative overflow-hidden border-r border-slate-800/80">
        {/* Cercles d'ambiance en arrière-plan */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        {/* Logo officiel SAMRE avec /logo.png */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-xs ring-1 ring-white/15 transition group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Samré Logo"
                width={40}
                height={40}
                className="h-9 w-9 object-contain drop-shadow-xs"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-wider text-white">
                SAMRE
              </span>
              <span className="text-[11px] text-slate-400">
                Plateforme de test applicatif
              </span>
            </div>
          </Link>
        </div>

        {/* Illustration & Texte d'engagement sur PC */}
        <div className="relative z-10 my-auto py-8">
          <div className="mb-6 flex justify-center">
            {isForgotPassword ? (
              <ForgotPasswordIllustration className="h-48 xl:h-56 w-auto drop-shadow-lg" />
            ) : isSignup ? (
              <SignUpIllustration className="h-48 xl:h-56 w-auto drop-shadow-lg" />
            ) : (
              <SignInIllustration className="h-48 xl:h-56 w-auto drop-shadow-lg" />
            )}
          </div>

          <h1 className="font-display text-2xl xl:text-3xl font-black text-white tracking-tight leading-snug">
            {isForgotPassword
              ? "Récupération sécurisée de votre accès testeur"
              : isSignup
              ? "Rejoignez le réseau d'élite des testeurs applicatifs"
              : "Validez vos tests et suivez vos gains en direct"}
          </h1>

          <p className="mt-3 text-xs xl:text-sm text-slate-300 leading-relaxed">
            {isForgotPassword
              ? "Indiquez votre adresse email enregistrée pour recevoir un mot de passe temporaire ou vos consignes de réinitialisation."
              : isSignup
              ? "Accédez aux missions exclusives, validez les étapes prévues chaque jour et débloquez vos récompenses financières en toute transparence."
              : "Connectez-vous pour continuer vos campagnes actives, soumettre vos codes de validation quotidienne et consulter vos statistiques."}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                <CheckCircle2 size={13} />
              </div>
              <span>Protocoles de test guidés pas à pas</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                <CheckCircle2 size={13} />
              </div>
              <span>Suivi automatisé des étapes quotidiennes</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                <CheckCircle2 size={13} />
              </div>
              <span>Rémunération garantie pour chaque campagne validée</span>
            </div>
          </div>
        </div>

        {/* Pied de page du panneau gauche */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-400">
          <span>© 2026 SAMRE Global</span>
          <span>Espace Officiel Testeurs & Admins</span>
        </div>
      </div>

      {/* Colonne droite : Formulaire centré et spacieux adapté au PC & Mobile */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 min-h-screen">
        {/* En-tête mobile (visible uniquement sur mobile) */}
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xs ring-1 ring-slate-200">
            <Image
              src="/logo.png"
              alt="SAMRE Logo"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-black tracking-wider text-navy-950">
              SAMRE
            </span>
            <span className="text-[10px] text-slate-400">Plateforme de test</span>
          </div>
        </div>

        {/* Carte Formulaire principale */}
        <div className="w-full max-w-[480px] rounded-[32px] bg-white p-7 sm:p-10 shadow-xl shadow-slate-200/70 border border-slate-100 flex flex-col">
          {/* Logo discret en haut de la carte sur PC */}
          <div className="hidden lg:flex items-center justify-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="SAMRE Logo"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
            />
            <span className="font-display text-base font-black tracking-wider text-navy-950">
              SAMRE
            </span>
          </div>

          {/* Onglets de sélection rapides Connexion / Inscription si non en mode mot de passe oublié */}
          {!isForgotPassword && (
            <div className="flex w-full rounded-2xl bg-slate-100/90 p-1 text-xs font-bold text-slate-500 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("login");
                  setError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition ${
                  !isSignup
                    ? "bg-white text-navy-950 shadow-2xs font-extrabold"
                    : "hover:text-navy-900"
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("signup");
                  setError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition ${
                  isSignup
                    ? "bg-white text-navy-950 shadow-2xs font-extrabold"
                    : "hover:text-navy-900"
                }`}
              >
                Créer un compte
              </button>
            </div>
          )}

          {/* Illustration sur mobile uniquement (sur PC elle est déjà dans le panneau gauche) */}
          <div className="my-2 flex items-center justify-center lg:hidden">
            {isForgotPassword ? (
              <ForgotPasswordIllustration className="h-28 w-auto" />
            ) : isSignup ? (
              <SignUpIllustration className="h-28 w-auto" />
            ) : (
              <SignInIllustration className="h-28 w-auto" />
            )}
          </div>

          {/* Titre et sous-titre */}
          <div className="text-center w-full mb-6">
            <h2 className="font-display text-2xl font-black text-navy-950 tracking-tight">
              {isForgotPassword
                ? "Mot de passe oublié ?"
                : isSignup
                ? "Créer un compte"
                : "Se connecter"}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {isForgotPassword
                ? "Entrez votre adresse e-mail pour recevoir vos instructions de réinitialisation."
                : isSignup
                ? "Rejoignez le panel SAMRE et commencez à tester des applications dès aujourd'hui."
                : "Entrez vos identifiants pour accéder à votre espace testeur."}
            </p>
          </div>

          {/* Alerte Erreur */}
          {error && (
            <div className="mb-5 w-full rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VUE MOT DE PASSE OUBLIÉ */}
          {/* ========================================================================= */}
          {isForgotPassword ? (
            <div className="w-full">
              {successMsg ? (
                <div className="space-y-4 text-center py-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={26} />
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800">
                    <p className="font-bold">{successMsg}</p>
                    <p className="mt-1 text-[11px] text-emerald-700">
                      Vérifiez votre boîte de réception ainsi que vos courriers indésirables.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode("login");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="flex w-full items-center justify-center rounded-2xl bg-navy-950 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-navy-900"
                  >
                    <span>Retour à la connexion</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3.5 w-full">
                  <div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-xs text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-brand-orange focus:bg-white focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-3.5 text-xs font-bold text-white shadow-md shadow-brand-orange/25 transition hover:bg-orange-600 active:scale-98 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <span>Envoyer les instructions</span>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("login");
                        setError(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition"
                    >
                      <ArrowLeft size={13} />
                      <span>Retour à la connexion</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* FORMULAIRE CONNEXION & INSCRIPTION (Fidèle à Image 4 & 5) */
            /* ========================================================================= */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-3.5 w-full"
            >
              {/* Champ Nom complet (Seulement pour l'inscription) */}
              {isSignup && (
                <div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User size={17} />
                    </div>
                    <input
                      type="text"
                      required
                      value={[form.prenom, form.nom].filter(Boolean).join(" ")}
                      onChange={handleFullNameChange}
                      placeholder="Nom complet"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-xs text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-brand-orange focus:bg-white focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>
              )}

              {/* Champ Adresse Email */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="vous@exemple.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-xs text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-brand-orange focus:bg-white focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    value={form.password}
                    onChange={update("password")}
                    placeholder={isSignup ? "8 caractères minimum" : "••••••••"}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-11 text-xs text-navy-950 placeholder:text-slate-400 outline-none transition focus:border-brand-orange focus:bg-white focus:ring-1 focus:ring-brand-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-navy-900 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Lien Mot de passe oublié (En mode connexion seulement) */}
              {!isSignup && (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode("forgot-password");
                      setError(null);
                    }}
                    className="text-xs font-bold text-brand-orange hover:underline transition"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Mention CGU en mode inscription */}
              {isSignup && (
                <p className="text-[11px] text-slate-400 leading-tight">
                  En vous inscrivant, vous acceptez les Conditions d&apos;utilisation et la Politique de confidentialité.
                </p>
              )}

              {/* Bouton d'action principal */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold text-white shadow-md transition active:scale-98 disabled:opacity-60 ${
                  isSignup
                    ? "bg-brand-orange shadow-brand-orange/25 hover:bg-orange-600"
                    : "bg-navy-950 hover:bg-navy-900"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Chargement...</span>
                  </>
                ) : (
                  <span>{isSignup ? "Créer mon compte" : "Se connecter"}</span>
                )}
              </button>

              {/* Pied de carte : Inversion de mode */}
              <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 mt-4">
                {isSignup ? (
                  <span>
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("login");
                        setError(null);
                      }}
                      className="font-bold text-brand-orange hover:underline ml-1"
                    >
                      Se connecter
                    </button>
                  </span>
                ) : (
                  <span>
                    Pas encore de compte ?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("signup");
                        setError(null);
                      }}
                      className="font-bold text-brand-orange hover:underline ml-1"
                    >
                      Créer un compte
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
