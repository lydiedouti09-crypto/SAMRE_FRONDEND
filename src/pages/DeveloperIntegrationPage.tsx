import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Code2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
  Download,
  ChevronDown,
  ChevronUp,
  Globe,
  Server,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Terminal,
  RefreshCw,
} from "lucide-react";
import { sdkApi, type IntegrationInfo } from "@/lib/api";
import SamreLogo from "@/components/SamreLogo";

export default function DeveloperIntegrationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<IntegrationInfo | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedRemoveCommand, setCopiedRemoveCommand] = useState(false);
  const [showManualCode, setShowManualCode] = useState(false);
  const [activeSection, setActiveSection] = useState("installation");

  // Configuration de l'URL API (Localhost vs Externe / Ngrok)
  const [apiMode, setApiMode] = useState<"local" | "remote">(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return "remote";
    }
    return "local";
  });

  const [customApiUrl, setCustomApiUrl] = useState<string>(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return window.location.origin;
    }
    return import.meta.env.VITE_API_URL || "http://localhost:8000";
  });

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

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFB] text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#FB682E]" />
          <p className="text-sm font-medium text-slate-500">
            Chargement de la documentation technique...
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
            {error || "Ce portail d'intégration est inaccessible ou le jeton de sécurité est incorrect."}
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FB682E] text-white text-xs font-bold shadow-md hover:bg-[#e05620] transition"
            >
              Retour à l&apos;accueil Samré
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const app = info.application;
  const activeApiUrl = customApiUrl.trim() || (import.meta.env.VITE_API_URL ?? "http://localhost:8000");
  const cliCommand = `npx github:lydiedouti09-crypto/samre-cli#main inject --token=${info.tokenIntegration} --api-url=${activeApiUrl}`;
  const cliRemoveCommand = `npx github:lydiedouti09-crypto/samre-cli remove`;

  // Code Flutter autonome au cas où le dev préfère une intégration manuelle
  const flutterCode = `// ==============================================================================
// 📱 MODULE OFFICIEL SAMRÉ TEST PROTOCOL (Flutter)
// Ce module gère la preuve de présence Google Play et le dialogue anti-triche
// ==============================================================================
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SamreConfig {
  static const String apiKey = "${info.apiKey}";
  static const String baseUrl = "${activeApiUrl}";
  static const int requiredUsageSeconds = 25;
}

// Pour le code complet généré avec l'observateur intelligent, 
// utilisez la commande automatique recommandée :
// npx github:lydiedouti09-crypto/samre-cli#main inject --token=${info.tokenIntegration}`;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-slate-800 font-sans selection:bg-[#FB682E]/20 selection:text-[#FB682E]">
      {/* ── TOP HEADER MINIMALISTE & ÉPURÉ ──────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="transition hover:opacity-90">
              <SamreLogo size={36} showTagline={false} />
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Documentation SDK
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Campagne Active
            </span>
          </div>
        </div>
      </header>

      {/* ── CORPS PRINCIPAL : SIDEBAR + DOCUMENTATION (STYLE TASTESKILL) ── */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* ── SIDEBAR GAUCHE : "SUR CETTE PAGE" ────────────────────────── */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 space-y-6">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Sur cette page
                </p>
                <nav className="mt-4 space-y-1 text-sm font-medium">
                  <a
                    href="#installation"
                    onClick={() => setActiveSection("installation")}
                    className={`block py-1.5 pl-3 transition rounded-r-md ${
                      activeSection === "installation"
                        ? "border-l-2 border-[#FB682E] font-bold text-slate-900 bg-orange-50/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Installation
                  </a>
                  <a
                    href="#reseau"
                    onClick={() => setActiveSection("reseau")}
                    className={`block py-1.5 pl-3 transition rounded-r-md ${
                      activeSection === "reseau"
                        ? "border-l-2 border-[#FB682E] font-bold text-slate-900 bg-orange-50/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Mode Réseau (Local / Ngrok)
                  </a>
                  <a
                    href="#lancement"
                    onClick={() => setActiveSection("lancement")}
                    className={`block py-1.5 pl-3 transition rounded-r-md ${
                      activeSection === "lancement"
                        ? "border-l-2 border-[#FB682E] font-bold text-slate-900 bg-orange-50/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Lancement & Test
                  </a>
                  <a
                    href="#anti-triche"
                    onClick={() => setActiveSection("anti-triche")}
                    className={`block py-1.5 pl-3 transition rounded-r-md ${
                      activeSection === "anti-triche"
                        ? "border-l-2 border-[#FB682E] font-bold text-slate-900 bg-orange-50/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Protocole Anti-Triche
                  </a>
                  <a
                    href="#desinstallation"
                    onClick={() => setActiveSection("desinstallation")}
                    className={`block py-1.5 pl-3 transition rounded-r-md ${
                      activeSection === "desinstallation"
                        ? "border-l-2 border-[#FB682E] font-bold text-slate-900 bg-orange-50/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Désinstallation
                  </a>
                  <a
                    href="#manuel"
                    onClick={() => setActiveSection("manuel")}
                    className={`block py-1.5 pl-3 transition rounded-r-md ${
                      activeSection === "manuel"
                        ? "border-l-2 border-[#FB682E] font-bold text-slate-900 bg-orange-50/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Code Dart Manuel
                  </a>
                </nav>
              </div>

              {/* Fiche d'application compacte en rappel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FB682E] text-white font-bold text-sm shadow-xs">
                    {app.nom.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{app.nom}</p>
                    <p className="text-[11px] text-slate-500 font-mono">v{app.version} • Flutter</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Panélistes</span>
                  <span className="font-bold text-slate-900">{app.nbMaxPanelistes || 12} testeurs</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Durée test</span>
                  <span className="font-bold text-slate-900">{app.dureeJours || 12} jours</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── CONTENU PRINCIPAL : DOCUMENTATION TECHNIQUE ──────────────── */}
          <main className="lg:col-span-9 space-y-12">
            
            {/* EN-TÊTE PRINCIPAL (STYLE COMMENCER . DE TASTESKILL) */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/70 px-3 py-1 text-xs font-bold text-[#FB682E]">
                <span className="h-2 w-2 rounded-full bg-[#FB682E]" />
                DOCUMENTATION OFFICIELLE
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 font-display">
                Commencer .
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                Installez le SDK Samré dans votre projet Flutter, assurez automatiquement la preuve de présence Google Play de vos 12 panélistes et préservez l&apos;intégrité de votre code d&apos;origine.
              </p>
            </div>

            {/* BANDEAU RÉCAPITULATIF APPLICATION */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FB682E] to-amber-500 text-white font-black text-lg shadow-sm">
                  {app.nom.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-slate-900">{app.nom}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
                      v{app.version}
                    </span>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                      Flutter
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Campagne Google Play : <strong>{app.dureeJours || 12} jours consécutifs</strong> • <strong>{app.nbMaxPanelistes || 12} panélistes affectés</strong>
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Prêt pour injection
              </span>
            </div>

            {/* ── SECTION 1 : INSTALLATION ───────────────────────────────── */}
            <section id="installation" className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Installation
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                L&apos;installation par défaut utilise l&apos;injecteur automatique direct via GitHub. Le script crée le module <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800 border border-slate-200">lib/samre_sdk.dart</code> et branche l&apos;observateur dans <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800 border border-slate-200">lib/main.dart</code> en toute sécurité.
              </p>

              {/* COMMANDE CODE BLOCK (STYLE TASTESKILL CLI) */}
              <div className="relative rounded-2xl border border-slate-200 bg-slate-900 p-4 sm:p-5 shadow-sm text-white">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-[#FB682E]" />
                    <span className="font-mono">Terminal (Racine de votre projet Flutter)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">npx / zero dépendance globale</span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto py-1">
                    <span className="text-slate-500 mr-2 select-none">$</span>
                    <span className="select-all font-semibold">{cliCommand}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(cliCommand);
                      setCopiedCommand(true);
                      setTimeout(() => setCopiedCommand(false), 2000);
                    }}
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FB682E] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#e05620] transition active:scale-95"
                  >
                    {copiedCommand ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedCommand ? "Copié !" : "Copier la commande"}</span>
                  </button>
                </div>
              </div>

              {/* 3 piliers de sécurité */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Zéro code manuel</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Apparition anti-triche</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Sauvegarde lib/main.dart</span>
                </div>
              </div>
            </section>

            {/* ── SECTION 2 : CONFIGURATION DU RÉSEAU (LOCAL VS NGROK) ────── */}
            <section id="reseau" className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Mode Réseau : Localhost vs Testeur Extérieur (Ngrok)
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Choisissez selon votre contexte de test. Si vous testez sur un <strong>vrai smartphone</strong> ou qu&apos;une <strong>personne extérieure</strong> utilise l&apos;application, votre backend local doit être accessible via une adresse publique HTTPS.
              </p>

              {/* SÉLECTEUR DE MODE INTERACTIF */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setApiMode("local");
                      setCustomApiUrl("http://localhost:8000");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      apiMode === "local"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Server className="h-3.5 w-3.5" />
                    <span>Émulateur PC (Localhost:8000)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApiMode("remote");
                      if (customApiUrl.includes("localhost")) {
                        setCustomApiUrl("https://poise-magnitude-define.ngrok-free.dev");
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      apiMode === "remote"
                        ? "bg-[#FB682E] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Vrai Smartphone / Testeur Extérieur (Ngrok)</span>
                  </button>
                </div>

                {/* CHAMP D'URL PUBLIQUE NGROK */}
                {apiMode === "remote" ? (
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      URL Publique de votre Backend (Ngrok / Localtunnel / Serveur) :
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customApiUrl}
                        onChange={(e) => setCustomApiUrl(e.target.value)}
                        placeholder="https://votre-tunnel.ngrok-free.dev"
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-[#FB682E] focus:outline-none shadow-2xs"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      💡 <em>Conseil :</em> Pour obtenir cette URL gratuite en 10 secondes, tapez <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] border border-orange-200 text-slate-800">ngrok http 8000</code> dans un terminal de votre ordinateur.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    💡 Le mode <strong>Localhost</strong> fonctionne uniquement si vous lancez l&apos;application sur le même PC que votre serveur web (émulateur Android Studio ou Chrome).
                  </p>
                )}
              </div>
            </section>

            {/* ── SECTION 3 : LANCEMENT DE L'APPLICATION ─────────────────── */}
            <section id="lancement" className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Lancement & Test dans votre Application
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Une fois la commande d&apos;injection exécutée, compilez et lancez simplement votre application Flutter :
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white font-mono text-xs sm:text-sm">
                <span className="text-slate-500 mr-2">$</span>
                <span className="text-cyan-300 font-bold select-all">flutter run</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#FB682E]" />
                  Ce qui se passe dans l&apos;application :
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
                  <li>L&apos;application démarre normalement sans aucun changement visible sur l&apos;écran d&apos;accueil.</li>
                  <li>Lorsque le testeur navigue et explore les différentes pages de votre application, un bouton discret <strong>« Valider le test »</strong> apparaît.</li>
                  <li>Le testeur clique dessus, entre son identifiant panéliste (ex: <code>TST-65CE12</code>) et son code du jour.</li>
                  <li>Dès que la journée est validée, le formulaire disparaît totalement jusqu&apos;au lendemain !</li>
                </ul>
              </div>
            </section>

            {/* ── SECTION 4 : PROTOCOLE ANTI-TRICHE INTÉGRÉ ──────────────── */}
            <section id="anti-triche" className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  4
                </div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Protocole Anti-Triche Google Play Intégré
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Pour garantir à Google que vos 12 panélistes utilisent réellement l&apos;application chaque jour pendant 14 jours, Samré intègre 3 verrous automatiques :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
                  <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                    🚫
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Interdit sur l&apos;Accueil</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Le formulaire ne s&apos;affiche jamais sur le Splash Screen ou la page initiale pour forcer l&apos;utilisateur à naviguer.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    🎲
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Apparition Aléatoire</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    L&apos;emplacement et l&apos;instant d&apos;apparition varient selon les sessions et les sous-pages visitées.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🔒
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Verrou Quotidien Unique</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Une seule validation acceptée par 24h. Une fois le code entré, le composant s&apos;éteint jusqu&apos;au jour suivant.
                  </p>
                </div>
              </div>
            </section>

            {/* ── SECTION 5 : DÉSINSTALLATION POST-CAMPAGNE ──────────────── */}
            <section id="desinstallation" className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  5
                </div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Désinstallation (Fin de Campagne)
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Une fois les 14 jours de tests validés par la console Google Play, retirez le module en une fraction de seconde pour retrouver votre code 100% propre :
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white font-mono text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 mr-2 select-none">$</span>
                  <span className="text-amber-300 font-bold select-all">{cliRemoveCommand}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(cliRemoveCommand);
                    setCopiedRemoveCommand(true);
                    setTimeout(() => setCopiedRemoveCommand(false), 2000);
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition"
                >
                  {copiedRemoveCommand ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedRemoveCommand ? "Copié !" : "Copier"}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Cette commande supprime <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">lib/samre_sdk.dart</code> et restaure automatiquement <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">lib/main.dart</code> à son état initial exact.
              </p>
            </section>

            {/* ── SECTION 6 : CODE DART MANUEL (OPTIONNEL) ───────────────── */}
            <section id="manuel" className="pt-4 border-t border-slate-200">
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setShowManualCode(!showManualCode)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-[#FB682E]" />
                    <span>Intégration Manuelle Dart (Sans utiliser le CLI)</span>
                  </div>
                  {showManualCode ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>

                {showManualCode && (
                  <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/60">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Fichier : <strong>lib/samre_sdk.dart</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(flutterCode)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                        >
                          {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedCode ? "Copié !" : "Copier le code"}</span>
                        </button>
                      </div>
                    </div>

                    <pre className="p-4 bg-slate-900 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto max-h-[300px]">
                      {flutterCode}
                    </pre>
                  </div>
                )}
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── FOOTER ÉPURÉ ──────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SAMRÉ Global. Plateforme de mise en conformité Google Play.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <Link to="/" className="hover:text-[#FB682E] transition">Accueil</Link>
            <span>•</span>
            <a href="https://github.com/lydiedouti09-crypto/samre-cli" target="_blank" rel="noopener noreferrer" className="hover:text-[#FB682E] transition inline-flex items-center gap-1">
              <span>GitHub CLI</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
