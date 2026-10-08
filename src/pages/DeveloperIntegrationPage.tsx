import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Terminal,
  Play,
  Trash2,
  Smartphone,
  Calendar,
  Users,
} from "lucide-react";
import { sdkApi, getImageUrl, type IntegrationInfo } from "@/lib/api";
import SamreLogo from "@/components/SamreLogo";

export default function DeveloperIntegrationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<IntegrationInfo | null>(null);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedRun, setCopiedRun] = useState(false);
  const [copiedRemove, setCopiedRemoveCommand] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchInfo = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await sdkApi.getIntegrationInfo(token);
        setInfo(data);
      } catch (err: any) {
        setError(err.message || "Lien d'intégration introuvable ou expiré.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFB] text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#FB682E]" />
          <p className="text-sm font-medium text-slate-500">
            Chargement de l&apos;intégration...
          </p>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFB] p-4 text-slate-900">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-display">Lien Invalide ou Expiré</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {error || "Ce lien d'intégration est inaccessible ou le jeton est incorrect."}
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FB682E] text-white text-xs font-bold shadow-md hover:bg-[#e05620] transition"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const app = info.application;
  
  // URL de l'API automatique (serveur actuel en prod ou variable d'environnement)
  const apiUrl =
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
      ? window.location.origin
      : (import.meta.env.VITE_API_URL || "http://localhost:8000");

  const installCommand = `npx github:lydiedouti09-crypto/samre-cli#main inject --token=${info.tokenIntegration} --api-url=${apiUrl}`;
  const runCommand = `flutter run`;
  const removeCommand = `npx github:lydiedouti09-crypto/samre-cli#main remove`;

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* ── HEADER SIMPLE ──────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="transition hover:opacity-90">
            <SamreLogo size={32} showTagline={false} />
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Campagne Active
          </span>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL ÉPURÉ ─────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12 sm:px-6 space-y-8">
        
        {/* TITRE & PRÉSENTATION */}
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Intégration du SDK Samré
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Suivez ces 3 étapes simples pour installer et tester le module dans votre projet Flutter.
          </p>
        </div>

        {/* RÉCAPITULATIF DE L'APPLICATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {app.logo ? (
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xs overflow-hidden">
                <img
                  src={getImageUrl(app.logo)}
                  alt={app.nom}
                  className="h-full w-full object-contain rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".fallback-initials");
                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                  }}
                />
                <div className="fallback-initials hidden absolute inset-0 h-full w-full items-center justify-center bg-gradient-to-tr from-[#FB682E] to-amber-500 text-white font-extrabold text-base">
                  {app.nom.slice(0, 2).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FB682E] to-amber-500 text-white font-extrabold text-base shadow-xs">
                {app.nom.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {app.nom}
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Flutter
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Application en phase de test</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-600 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-around sm:justify-end">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#FB682E]" />
              <span><strong>{app.dureeJours || 14} jours</strong> de test</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-600" />
              <span><strong>{app.nbMaxPanelistes || 12} testeurs</strong></span>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 1 : INSTALLATION ──────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FB682E] text-white text-xs font-bold shadow-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Installation (Injection automatique)
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ouvrez un terminal à la <strong>racine de votre projet Flutter</strong> et exécutez la commande suivante :
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 sm:p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto py-1 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#FB682E] shrink-0" />
                <span className="select-all font-semibold break-all">{installCommand}</span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(installCommand, setCopiedInstall)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#FB682E] hover:bg-[#e05620] px-3.5 py-2 text-xs font-bold text-white transition active:scale-95 shadow-xs"
              >
                {copiedInstall ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedInstall ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            ✨ Cette commande injecte automatiquement le SDK dans <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">lib/</code> sans modifier manuellement votre code.
          </p>
        </div>

        {/* ── ÉTAPE 2 : LANCEMENT & TEST ──────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Lancement et Test
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Lancez simplement votre application pour vous assurer qu&apos;elle démarre correctement :
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 sm:p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-xs sm:text-sm text-cyan-300 font-bold overflow-x-auto py-1 flex items-center gap-2">
                <Play className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="select-all">{runCommand}</span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(runCommand, setCopiedRun)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition active:scale-95"
              >
                {copiedRun ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedRun ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            📱 Le module s&apos;affichera discrètement pendant la navigation des panélistes pour valider leurs sessions quotidiennes.
          </p>
        </div>

        {/* ── ÉTAPE 3 : DÉSINSTALLATION (FIN DE CAMPAGNE) ──────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-bold shadow-xs">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Désinstallation (Fin de campagne)
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            À la fin des {app.dureeJours || 14} jours de test validés par Google Play, retirez le module en une seule commande pour restaurer votre code d&apos;origine :
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 sm:p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-xs sm:text-sm text-amber-300 font-bold overflow-x-auto py-1 flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="select-all break-all">{removeCommand}</span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(removeCommand, setCopiedRemoveCommand)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition active:scale-95"
              >
                {copiedRemove ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedRemove ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            🧹 Cette commande supprime le SDK injecté et restaure votre code exactement comme avant.
          </p>
        </div>

      </main>

      {/* ── FOOTER SIMPLE ──────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-3xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SAMRÉ Global • Support Développeur</p>
          <Link to="/" className="text-slate-600 hover:text-[#FB682E] transition font-medium">
            Retour à l&apos;accueil
          </Link>
        </div>
      </footer>
    </div>
  );
}
