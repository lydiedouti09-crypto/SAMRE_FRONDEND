"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield, Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminUser, adminLoading, adminLogin } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si l'administrateur est déjà authentifié, rediriger directement vers /admin
  useEffect(() => {
    if (!adminLoading && adminUser && adminUser.role === "admin") {
      router.replace("/admin");
    }
  }, [adminUser, adminLoading, router]);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Veuillez saisir l'identifiant administrateur et le mot de passe.");
      return;
    }

    setSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Identifiants invalides ou service d'authentification indisponible."
      );
      setSubmitting(false);
    }
  }


  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070D18] px-4 py-12 text-slate-100 selection:bg-brand-orange selection:text-white">
      {/* Halos de lumière d'arrière-plan */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* En-tête branding Admin */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="group mb-4 flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F1C33] p-2 ring-1 ring-white/15 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="SAMRE Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  samré
                </span>
                <span className="rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-400">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Système Central d&apos;Administration</p>
            </div>
          </Link>
        </div>

        {/* Carte de connexion Administrateur */}
        <div className="rounded-3xl border border-slate-800/80 bg-[#0B1528]/95 p-7 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-9">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/60 text-brand-orange shadow-inner">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">
                Portail Administrateur
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Authentification sécurisée réservée aux gestionnaires.
              </p>
            </div>
          </div>

          {/* Bandeau d'avertissement de sécurité */}
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200/90">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
            <p className="leading-relaxed">
              Accès strictement restreint. Les connexions et actions sont auditées en temps réel.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-xs font-medium text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Identifiant Administrateur
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@samre.com"
                  className="w-full rounded-xl border border-slate-700 bg-[#131F37] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Mot de passe sécurisé
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-[#131F37] px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:shadow-xl hover:shadow-brand-orange/35 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Vérification des droits...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  S&apos;authentifier sur la console admin
                </>
              )}
            </button>
          </form>

          {/* Séparateur & Liens */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <div className="flex flex-col gap-2.5 text-center text-xs text-slate-400">
              <Link
                href="/connexion"
                className="transition hover:text-brand-orange hover:underline"
              >
                Vous êtes candidat ou entreprise ? Accédez à l&apos;espace membre
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1 text-slate-500 transition hover:text-slate-300"
              >
                <ArrowLeft size={13} />
                Retour au site public SAMRE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
