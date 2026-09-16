"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { clearToken } from "@/lib/api";

type Mode = "login" | "signup";

export default function AuthForm({ mode = "login" }: { mode?: Mode }) {
  const router = useRouter();
  const { login, register, logout } = useAuth();
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const isSignup = activeMode === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit() {
    setError(null);

    const emailTrimmed = form.email.trim().toLowerCase();

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

    // Empêcher l'administrateur de se connecter sur l'espace utilisateur
    if (!isSignup && emailTrimmed === "[EMAIL_ADDRESS]") {
      setError("Compte introuvable");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await register(form);
        router.push("/dashboard");
      } else {
        const loggedUser = await login(form.email, form.password);
        if (loggedUser?.role === "admin") {
          // Révocation immédiate de la session pour l'espace utilisateur
          clearToken();
          logout("/connexion");
          setError("Compte introuvable");
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20";

  return (
    <div className="flex min-h-screen flex-col justify-center bg-mist px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        {/* Logo SAMRE */}
        <Link href="/" className="mb-8 flex items-center justify-center">
          <span className="font-display text-2xl font-bold tracking-tight text-navy-900">
            SAMRE
          </span>
        </Link>

        {/* Card principale */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-navy-900">
              {isSignup ? "Créer un compte" : "Bienvenue sur SAMRE"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {isSignup
                ? "Rejoignez la plateforme et accédez aux opportunités professionnelles."
                : "Connectez-vous pour accéder à votre espace et à vos opportunités."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-700">
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
                  <label htmlFor="prenom" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    autoComplete="given-name"
                    value={form.prenom}
                    onChange={update("prenom")}
                    placeholder="Koffi"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="nom" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Nom
                  </label>
                  <input
                    id="nom"
                    type="text"
                    autoComplete="family-name"
                    value={form.nom}
                    onChange={update("nom")}
                    placeholder="Ama"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email professionnel ou personnel
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={update("email")}
                placeholder="vous@exemple.com"
                className={inputClass}
              />
            </div>

            {isSignup && (
              <div>
                <label htmlFor="telephone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Numéro de téléphone
                </label>
                <input
                  id="telephone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.telephone}
                  onChange={update("telephone")}
                  placeholder="+228 97 31 78 25"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Mot de passe
                </label>
                {!isSignup && (
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs text-slate-500 underline transition hover:text-brand-orange"
                  >
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder={isSignup ? "6 caractères minimum" : "••••••••"}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3.5 text-sm font-semibold text-white shadow-md shadow-navy-900/10 transition-all hover:bg-navy-800 hover:shadow-lg disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isSignup ? "Créer mon compte" : "Se connecter"}
            </button>
          </form>

          {/* Bascule en bas de carte */}
          <div className="mt-6 text-center text-sm text-slate-500">
            {isSignup ? (
              <p>
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("login");
                    setError(null);
                  }}
                  className="font-semibold text-brand-orange transition hover:underline"
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
                  }}
                  className="font-semibold text-brand-orange transition hover:underline"
                >
                  S&apos;inscrire
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
