import React, { useState, useEffect } from "react";
import { useRouter } from "@/lib/router";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { authApi, getToken, setAdminToken } from "@/lib/api";

type Mode = "login" | "signup" | "forgot-password";

interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { name: "Togo", code: "TG", dialCode: "+228", flag: "🇹🇬" },
  { name: "Côte d'Ivoire", code: "CI", dialCode: "+225", flag: "🇨🇮" },
  { name: "Bénin", code: "BJ", dialCode: "+229", flag: "🇧🇯" },
  { name: "Sénégal", code: "SN", dialCode: "+221", flag: "🇸🇳" },
  { name: "Cameroun", code: "CM", dialCode: "+237", flag: "🇨🇲" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226", flag: "🇧🇫" },
  { name: "Mali", code: "ML", dialCode: "+223", flag: "🇲🇱" },
  { name: "Guinée", code: "GN", dialCode: "+224", flag: "🇬🇳" },
  { name: "Niger", code: "NE", dialCode: "+227", flag: "🇳🇪" },
  { name: "Gabon", code: "GA", dialCode: "+241", flag: "🇬🇦" },
  { name: "Congo", code: "CG", dialCode: "+242", flag: "🇨🇬" },
  { name: "RD Congo", code: "CD", dialCode: "+243", flag: "🇨🇩" },
  { name: "Ghana", code: "GH", dialCode: "+233", flag: "🇬🇭" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Autre", code: "XX", dialCode: "+", flag: "🌍" },
];

export default function AuthForm({ mode = "login" }: { mode?: Mode }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const isSignup = activeMode === "signup";
  const isForgotPassword = activeMode === "forgot-password";

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [phoneLocal, setPhoneLocal] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // Gestion de la saisie "Nom complet"
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

    if (isSignup) {
      if (!form.prenom) {
        setError("Veuillez saisir votre nom complet.");
        return;
      }
      if (!form.email) {
        setError("L'adresse email est requise.");
        return;
      }
      if (!phoneLocal.trim()) {
        setError("Le numéro de téléphone est obligatoire.");
        return;
      }
      if (!form.password) {
        setError("Le mot de passe est obligatoire.");
        return;
      }
      if (form.password.length < 6) {
        setError("Le mot de passe doit comporter au moins 6 caractères.");
        return;
      }
      if (form.password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
    } else {
      if (!form.email || !form.password) {
        setError("Veuillez renseigner votre email / téléphone et votre mot de passe.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignup) {
        // Formatter le numéro de téléphone complet avec indicatif pays
        const cleanLocal = phoneLocal.trim().replace(/^0+/, "");
        const fullPhone = selectedCountry.dialCode === "+"
          ? `+${cleanLocal}`
          : `${selectedCountry.dialCode} ${cleanLocal}`;

        await register({
          ...form,
          telephone: fullPhone,
          nom: form.nom || form.prenom,
          pays: selectedCountry.name !== "Autre" ? selectedCountry.name : undefined,
        });
        router.push("/dashboard");
      } else {
        const loggedUser = await login(form.email.trim(), form.password);
        if (loggedUser?.role === "admin") {
          setAdminToken(getToken() || "");
          router.replace("/admin");
          return;
        }
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  const currentIllustration = isForgotPassword
    ? "/undraw_forgot-password_nttj.png"
    : isSignup
      ? "/undraw_authentication_1evl.png"
      : "/undraw_biometric-login_v832.png";

  const illustrationAlt = isForgotPassword
    ? "Illustration Mot de passe oublié SAMRE"
    : isSignup
      ? "Illustration Inscription SAMRE"
      : "Illustration Connexion SAMRE";

  return (
    <div className="min-h-[100dvh] w-full bg-white sm:bg-[#F8FAFC] relative font-sans antialiased text-slate-800 flex items-center justify-center py-6 px-4 sm:px-6">
      {/* Conteneur principal parfaitement centré et symétrique */}
      <main className="relative z-10 w-full max-w-[420px] lg:max-w-[1000px] mx-auto min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-w-0">
          
          {/* Panneau gauche PC uniquement */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center p-4">
            <div className="relative w-full max-w-[420px] flex items-center justify-center">
              <img
                key={`pc-${currentIllustration}`}
                src={currentIllustration}
                alt={illustrationAlt}
                className="w-full h-auto max-h-[380px] object-contain transition-transform duration-500 hover:scale-102"
              />
            </div>
          </div>

          {/* Formulaire : Marges gauche et droite strictement identiques */}
          <div className="col-span-12 lg:col-span-6 flex justify-center items-center w-full min-w-0">
            <div className="w-full bg-white sm:rounded-[28px] sm:p-8 sm:shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:border sm:border-slate-100 relative px-3 py-4 sm:px-8 min-w-0">
              
              {/* Illustration mobile */}
              <div className="flex lg:hidden flex-col items-center justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img
                    key={`card-${currentIllustration}`}
                    src={currentIllustration}
                    alt={illustrationAlt}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Titre & Sous-titre */}
              <div className="text-center mb-5">
                <h2 className="font-display text-xl sm:text-2xl font-black text-[#0a1c38] tracking-tight">
                  {isForgotPassword
                    ? "Mot de passe oublié"
                    : isSignup
                      ? "Créez votre compte"
                      : "Bienvenue sur samre"}
                </h2>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {isForgotPassword
                    ? "Entrez votre email pour réinitialiser votre accès."
                    : isSignup
                      ? "Inscrivez-vous pour commencer à utiliser la plateforme"
                      : "Connectez-vous à votre compte pour continuer."}
                </p>
              </div>

              {/* Alerte Erreur */}
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* ─── VUE MOT DE PASSE OUBLIÉ ─── */}
              {isForgotPassword ? (
                <div className="w-full min-w-0">
                  {successMsg ? (
                    <div className="space-y-4 text-center py-2">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
                        <CheckCircle2 size={30} />
                      </div>
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-800">
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
                        className="flex w-full items-center justify-center rounded-xl bg-[#0a1c38] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122c54]"
                      >
                        <span>Retour à la connexion</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4 w-full min-w-0">
                      <div className="w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Entrez votre adresse email"
                          className="w-full block box-border px-4 py-3 rounded-xl bg-[#eef4fb] text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#f2811d]/30"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2811d] to-[#ea580c] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#f2811d]/25 transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
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
                          className="text-xs font-semibold text-slate-500 hover:text-[#0a1c38] transition"
                        >
                          Retour à la connexion
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* ─── FORMULAIRE CONNEXION & INSCRIPTION ─── */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-3.5 w-full min-w-0"
                >
                  {/* Champ Nom complet (Inscription uniquement) */}
                  {isSignup && (
                    <div className="w-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={[form.prenom, form.nom].filter(Boolean).join(" ")}
                        onChange={handleFullNameChange}
                        placeholder="Entrez votre nom complet"
                        className="w-full block box-border px-4 py-3 rounded-xl bg-[#eef4fb] text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#f2811d]/30"
                      />
                    </div>
                  )}

                  {/* Champ Email ou Numéro de téléphone (Connexion) / Email (Inscription) */}
                  <div className="w-full">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isSignup ? "Email" : "Email ou Téléphone"}
                    </label>
                    <input
                      type={isSignup ? "email" : "text"}
                      required
                      autoComplete={isSignup ? "email" : "username"}
                      value={form.email}
                      onChange={update("email")}
                      placeholder={isSignup ? "Entrez votre adresse email" : "Entrez votre email ou numéro"}
                      className="w-full block box-border px-4 py-3 rounded-xl bg-[#eef4fb] text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#f2811d]/30"
                    />
                  </div>

                  {/* Champ Téléphone avec Drapeau & Indicatif (Inscription uniquement) */}
                  {isSignup && (
                    <div className="w-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Téléphone
                      </label>
                      <div className="relative flex items-center w-full rounded-xl bg-[#eef4fb] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#f2811d]/30 transition overflow-hidden">
                        {/* Sélecteur de pays avec vrai drapeau image et indicatif */}
                        <div className="relative flex items-center shrink-0 border-r border-slate-200/80 bg-slate-100/90 hover:bg-slate-200/70 transition px-3 py-2.5 cursor-pointer">
                          <div className="flex items-center gap-2 pointer-events-none">
                            {selectedCountry.code !== "XX" ? (
                              <img
                                src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                                alt={selectedCountry.name}
                                className="w-6 h-4 object-cover rounded-xs shadow-2xs border border-slate-300/80 shrink-0"
                              />
                            ) : (
                              <span className="text-sm leading-none">🌍</span>
                            )}
                            <span className="text-xs font-bold text-slate-800 tracking-tight">
                              {selectedCountry.dialCode}
                            </span>
                            <ChevronDown size={14} className="text-slate-400" />
                          </div>

                          {/* Select natif transparent superposé pour le choix sur mobile et desktop */}
                          <select
                            value={selectedCountry.code}
                            onChange={(e) => {
                              const found = COUNTRY_OPTIONS.find((c) => c.code === e.target.value);
                              if (found) setSelectedCountry(found);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                            title="Sélectionner un pays"
                          >
                            {COUNTRY_OPTIONS.map((c) => (
                              <option key={c.code} value={c.code} className="text-slate-800 bg-white">
                                {c.name} ({c.dialCode})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Numéro local */}
                        <input
                          type="tel"
                          required
                          value={phoneLocal}
                          onChange={(e) => setPhoneLocal(e.target.value)}
                          placeholder="90 00 00 00"
                          className="w-full flex-1 px-3.5 py-3 bg-transparent text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Champ Mot de passe */}
                  <div className="w-full">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isSignup ? "Créer un mot de passe" : "Mot de passe"}
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        value={form.password}
                        onChange={update("password")}
                        placeholder={isSignup ? "Créer un mot de passe (6+ caractères)" : "Entrez votre mot de passe"}
                        className="w-full block box-border px-4 py-3 pr-11 rounded-xl bg-[#eef4fb] text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#f2811d]/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Champ Confirmer le mot de passe (Inscription uniquement) */}
                  {isSignup && (
                    <div className="w-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Confirmer le mot de passe
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmer le mot de passe"
                          className="w-full block box-border px-4 py-3 pr-11 rounded-xl bg-[#eef4fb] text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#f2811d]/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition"
                          aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ligne "Remember me" et "Forgot Password?" (Connexion uniquement) */}
                  {!isSignup && (
                    <div className="flex items-center justify-between gap-1 pt-1 w-full">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-medium text-slate-600 shrink-0">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-[#f2811d] focus:ring-[#f2811d]/20 accent-[#f2811d]"
                        />
                        <span>Se souvenir de moi</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("forgot-password");
                          setError(null);
                        }}
                        className="text-xs font-bold text-[#f2811d] hover:text-[#ea580c] transition shrink-0"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}

                  {/* Bouton CTA */}
                  <div className="pt-2 w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60 ${isSignup
                        ? "bg-gradient-to-r from-[#f2811d] to-[#ea580c] shadow-[#f2811d]/25 hover:brightness-105"
                        : "bg-[#0a1c38] hover:bg-[#122c54] shadow-[#0a1c38]/20"
                        }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Chargement...</span>
                        </>
                      ) : (
                        <span>{isSignup ? "Créer un compte" : "Se connecter"}</span>
                      )}
                    </button>
                  </div>

                  {/* Footer avec lien d'inversion de mode */}
                  <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 mt-4 w-full">
                    {isSignup ? (
                      <span>
                        Vous avez déjà un compte?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMode("login");
                            setError(null);
                          }}
                          className="font-bold text-[#0a1c38] hover:text-[#f2811d] transition underline ml-1"
                        >
                          Connectez-vous
                        </button>
                      </span>
                    ) : (
                      <span>
                        Je n&apos;ai pas de compte?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMode("signup");
                            setError(null);
                          }}
                          className="font-bold text-[#f2811d] hover:text-[#ea580c] transition underline ml-1"
                        >
                          Inscrivez-vous
                        </button>
                      </span>
                    )}
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
