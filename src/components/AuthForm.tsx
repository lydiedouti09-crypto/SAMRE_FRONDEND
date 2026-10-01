import React, { useState, useEffect } from "react";
import { useRouter } from "@/lib/router";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { authApi, getToken, setAdminToken } from "@/lib/api";

type Mode = "login" | "signup" | "forgot-password";

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
  const [rememberMe, setRememberMe] = useState(true);
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
        await register({
          ...form,
          nom: form.nom || form.prenom,
        });
        router.push("/dashboard");
      } else {
        const loggedUser = await login(form.email, form.password);
        if (loggedUser?.role === "admin") {
          // Si un administrateur se connecte via cette page, on configure son token admin et on le redirige vers l'administration
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

  // Image 1 pour connexion, Image 2 pour inscription, Image 3 pour mot de passe oublié
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
    <div className="h-screen w-full bg-[#fdfdfd] relative overflow-hidden font-sans antialiased text-slate-800 flex items-center justify-center p-4">

      {/* ─── TOUCHE SAMRÉ : HALOS D'AMBIANCE CHAUDE (ORANGE & BLEU NUIT) EN ARRIÈRE-PLAN ─── */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#f2811d]/14 to-[#fed7aa]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-28 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[#38bdf8]/12 via-[#f2811d]/8 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-[400px] w-[400px] rounded-full bg-[#0a1c38]/6 blur-3xl" />

      {/* ─── CONTENU PRINCIPAL : ADAPTÉ PC (2 COLONNES) ET MOBILE (1 COLONNE CENTRÉE) ─── */}
      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-2 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* PANNEAU GAUCHE PC : ILLUSTRATION FONDUE NATURELLEMENT DANS LE BLANC  */}
          {/* (Visible sur PC / Masqué sur Mobile pour garder le format compact)   */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center p-4">
            <div className="relative w-full max-w-[460px] flex items-center justify-center">
              <img
                key={`pc-${currentIllustration}`}
                src={currentIllustration}
                alt={illustrationAlt}
                className="w-full h-auto max-h-[390px] object-contain transition-transform duration-500 hover:scale-102"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* PANNEAU DROIT (PC) / CARTE CENTRÉE (MOBILE)                           */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="col-span-12 lg:col-span-6 flex justify-center items-center">
            <div className="w-full max-w-[420px] bg-white rounded-[28px] p-5 sm:p-6 shadow-xl shadow-slate-200/70 border border-slate-100/90 relative">

              {/* 1. Illustration intégrée : Visible UNIQUEMENT sur mobile, masquée sur PC */}
              <div className="flex lg:hidden flex-col items-center justify-center mb-3">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center p-2">
                  {/* Aura douce orange & bleue */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f2811d]/12 via-white to-blue-500/8 blur-md pointer-events-none" />
                  <img
                    key={`card-${currentIllustration}`}
                    src={currentIllustration}
                    alt={illustrationAlt}
                    className="relative z-10 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
              </div>

              {/* 2. Titre & Sous-titre */}
              <div className="text-center mb-4">
                <h2 className="font-display text-xl sm:text-2xl font-black text-[#0a1c38] tracking-tight">
                  {isForgotPassword
                    ? "Mot de passe oublié"
                    : isSignup
                      ? "Créez votre compte"
                      : "Bienvenue sur samre"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isForgotPassword
                    ? "Entrez votre email pour réinitialiser votre accès."
                    : isSignup
                      ? "Inscrivez-vous pour commencer à utiliser la platforme"
                      : "Connectez-vous à votre compte pour continuer."}
                </p>
              </div>

              {/* Alerte Erreur */}
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ─── VUE MOT DE PASSE OUBLIÉ ─── */}
              {isForgotPassword ? (
                <div className="w-full">
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
                        className="flex w-full items-center justify-center rounded-full bg-[#0a1c38] py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122c54]"
                      >
                        <span>Retour à la connexion</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4 w-full">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 pl-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Entrez votre adresse email"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:border-[#f2811d] focus:ring-4 focus:ring-[#f2811d]/12 shadow-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f2811d] to-[#ea580c] py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#f2811d]/25 transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
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
                /* ─── FORMULAIRE CONNEXION & INSCRIPTION SANS LES BOUTONS GOOGLE/RESEAUX ─── */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-3 w-full"
                >
                  {/* Champ Nom complet (Inscription uniquement) */}
                  {isSignup && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 pl-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={[form.prenom, form.nom].filter(Boolean).join(" ")}
                        onChange={handleFullNameChange}
                        placeholder="Entrez votre nom complet"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:border-[#f2811d] focus:ring-4 focus:ring-[#f2811d]/12 shadow-xs"
                      />
                    </div>
                  )}

                  {/* Champ Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 pl-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="Entrez votre adresse email"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:border-[#f2811d] focus:ring-4 focus:ring-[#f2811d]/12 shadow-xs"
                    />
                  </div>

                  {/* Champ Téléphone (Inscription uniquement - pour Mobile Money T-Money & Flooz) */}
                  {isSignup && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 pl-1 flex items-center justify-between">
                        <span>Téléphone</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.telephone}
                        onChange={update("telephone")}
                        placeholder="+228 90 00 00 00"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:border-[#f2811d] focus:ring-4 focus:ring-[#f2811d]/12 shadow-xs"
                      />
                    </div>
                  )}

                  {/* Champ Mot de passe */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 pl-1">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        value={form.password}
                        onChange={update("password")}
                        placeholder={isSignup ? "Créez un mot de passe (6+ caractères)" : "Entrez votre mot de passe"}
                        className="w-full px-3.5 py-2.5 pr-11 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 outline-none transition focus:border-[#f2811d] focus:ring-4 focus:ring-[#f2811d]/12 shadow-xs"
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

                  {/* Ligne "Remember me" et "Forgot Password?" (Connexion uniquement) */}
                  {!isSignup && (
                    <div className="flex items-center justify-between pt-0.5 px-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-600">
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
                        className="text-xs font-bold text-[#f2811d] hover:text-[#ea580c] transition"
                      >
                        Mot de passe oublié?
                      </button>
                    </div>
                  )}

                  {/* Bouton CTA plein avec touche SAMRÉ */}
                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-md active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60 ${isSignup
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

                  {/* Footer avec lien d'inversion de mode (SANS LES TRUCS GOOGLE) */}
                  <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 mt-3">
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
