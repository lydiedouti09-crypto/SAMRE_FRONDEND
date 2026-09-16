"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Smartphone,
  Code2,
  Key,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  ShieldCheck,
  Send,
  ExternalLink,
  Laptop,
  HelpCircle,
  FileCode,
  Sparkles,
} from "lucide-react";
import { sdkApi, type IntegrationInfo } from "@/lib/api";

export default function DeveloperIntegrationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<IntegrationInfo | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState<"flutter" | "kotlin" | "curl">("flutter");

  // Live test on the developer page
  const [testTesterId, setTestTesterId] = useState("");
  const [testCode, setTestCode] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    jour?: number;
    progression?: number;
  } | null>(null);

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

  const handleCopyKey = () => {
    if (!info) return;
    navigator.clipboard.writeText(info.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleRunTest = async () => {
    if (!info) return;
    if (!testTesterId.trim() || !testCode.trim()) {
      setTestResult({
        success: false,
        message: "Veuillez indiquer un ID panéliste et le code du jour.",
      });
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      const res = await sdkApi.verifyDay({
        apiKey: info.apiKey,
        panelisteId: testTesterId.trim(),
        code: testCode.trim(),
      });
      setTestResult({
        success: res.success,
        message: res.message || "Code validé avec succès !",
        jour: res.jour,
        progression: res.progression,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Échec de validation du code.",
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400 font-medium">
            Chargement de la documentation d'intégration...
          </p>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
        <div className="max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
          <h2 className="text-lg font-bold text-white font-display">Lien invalide</h2>
          <p className="mt-2 text-sm text-slate-400">
            {error || "Ce portail d'intégration est inaccessible ou le jeton est invalide."}
          </p>
        </div>
      </div>
    );
  }

  const app = info.application;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-lg font-display">
                  Samré DevPortal
                </span>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                  SDK v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Guide d'intégration & Spécifications API</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Serveur Central Connecté
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Banner Hero App */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg font-bold text-2xl">
                {app.nom.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-white font-display">
                    {app.nom}
                  </h1>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300 font-mono">
                    v{app.version}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 font-medium border border-emerald-500/20">
                    Android (APK / Play Store)
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {app.description ||
                    "Cette application fait l'objet d'une campagne de test panéliste sur Samré. Intégrez le formulaire ci-dessous pour permettre la validation automatique."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Durée du protocole : <strong>{app.dureeJours || 12} jours</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                    Panélistes prévus : <strong>{app.nbMaxPanelistes || 12} testeurs</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Clé API SDK Box */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 sm:min-w-[320px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                Votre Clé Secrète SDK (X-App-Key)
              </span>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-900 px-3 py-2 border border-slate-800">
                <code className="font-mono text-xs text-amber-300 select-all truncate">
                  {info.apiKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="shrink-0 text-slate-400 hover:text-white transition"
                  title="Copier la clé"
                >
                  {copiedKey ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-500 leading-normal">
                À inclure dans le header HTTP <code>X-App-Key</code> de chaque requête de validation.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Étapes du protocole */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-display">
            Fonctionnement du Protocole de Test Quotidien
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Intégration du formulaire</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Créez une vue ou boîte de dialogue « Espace Testeur Samré » dans votre application contenant 2 champs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Saisie par le panéliste</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Le testeur lit son <strong>Identifiant Unique</strong> et son <strong>Code du Jour</strong> sur Samré et les saisit dans votre app.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Vérification en direct</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Votre app contacte l'API Samré qui vérifie instantanément l'authenticité du code pour le jour en cours.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-bold text-sm mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Validation du jour</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                La journée est validée dans la base de données Samré. L'opération se répète chaque jour pendant {app.dureeJours || 12} jours.
              </p>
            </div>
          </div>
        </div>

        {/* Snippets d'Intégration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-display">
                Exemple de Code Prêt à Copier
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 text-xs border border-slate-800">
              <button
                onClick={() => setActiveTab("flutter")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === "flutter"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Flutter / Dart
              </button>
              <button
                onClick={() => setActiveTab("kotlin")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === "kotlin"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Android (Kotlin)
              </button>
              <button
                onClick={() => setActiveTab("curl")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === "curl"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                cURL / Terminal
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-950 font-mono text-xs overflow-x-auto">
            {activeTab === "flutter" && (
              <pre className="text-cyan-300 leading-relaxed">
{`// 1. Ajouter dans votre pubspec.yaml :
// dependencies:
//   http: ^1.2.0

import 'dart:convert';
import 'package:http/http.dart' as http;

class SamreSdk {
  static const String _endpoint =
      "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sdk/verify-day";
  static const String _apiKey = "${info.apiKey}";

  /// Vérifie et valide le jour de test pour un panéliste
  static Future<Map<String, dynamic>> verifyDay({
    required String panelisteId,
    required String codeDuJour,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(_endpoint),
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': _apiKey,
        },
        body: jsonEncode({
          'panelisteId': panelisteId.trim(),
          'code': codeDuJour.trim(),
        }),
      );

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode == 200 && data['success'] == true) {
        // Journée validée avec succès !
        return {
          'success': true,
          'message': data['message'] ?? 'Journée validée',
          'jour': data['jour'],
          'progression': data['progression'],
        };
      } else {
        return {
          'success': false,
          'error': data['error'] ?? 'Échec de validation Samré',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Impossible de joindre le serveur central Samré',
      };
    }
  }
}`}
              </pre>
            )}

            {activeTab === "kotlin" && (
              <pre className="text-emerald-300 leading-relaxed">
{`// 1. Dépendances dans build.gradle.kts (Module: app) :
// implementation("com.squareup.okhttp3:okhttp:4.12.0")
// implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

object SamreSdk {
    private const val API_URL =
        "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sdk/verify-day"
    private const val API_KEY = "${info.apiKey}"
    private val client = OkHttpClient()

    /**
     * Valide le jour de test auprès du serveur central Samré
     */
    suspend fun verifyDay(panelisteId: String, codeDuJour: String): Result<String> =
        withContext(Dispatchers.IO) {
            try {
                val payload = JSONObject().apply {
                    put("panelisteId", panelisteId.trim())
                    put("code", codeDuJour.trim())
                }.toString()

                val body = payload.toRequestBody("application/json; charset=utf-8".toMediaType())
                val request = Request.Builder()
                    .url(API_URL)
                    .addHeader("X-App-Key", API_KEY)
                    .post(body)
                    .build()

                client.newCall(request).execute().use { response ->
                    val resStr = response.body?.string().orEmpty()
                    val json = JSONObject(resStr)

                    if (response.isSuccessful && json.optBoolean("success", false)) {
                        Result.success(json.optString("message", "Journée validée avec succès !"))
                    } else {
                        Result.failure(Exception(json.optString("error", "Code ou panéliste invalide")))
                    }
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
}`}
              </pre>
            )}

            {activeTab === "curl" && (
              <pre className="text-amber-300 leading-relaxed">
{`# Appel HTTP direct POST vers l'endpoint de vérification
curl -X POST "${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sdk/verify-day" \\
  -H "Content-Type: application/json" \\
  -H "X-App-Key: ${info.apiKey}" \\
  -d '{
    "panelisteId": "TST-XXXXXX",
    "code": "SAMRE-J01-9F3B"
  }'`}
              </pre>
            )}
          </div>
        </div>

        {/* Simulateur Direct pour le Développeur */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Testeur d'Intégration en Direct (Sandbox)
              </h2>
              <p className="text-xs text-slate-400">
                Testez un appel réel dès maintenant pour vous assurer que vos identifiants fonctionnent
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Identifiant Panéliste
              </label>
              <input
                type="text"
                placeholder="ex: TST-123456"
                value={testTesterId}
                onChange={(e) => setTestTesterId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Code Unique du Jour
              </label>
              <input
                type="text"
                placeholder="ex: SAMRE-J01-XXXX"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white uppercase focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRunTest}
                disabled={testLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {testLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Envoyer le test
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`mt-4 rounded-xl border p-4 text-xs flex items-start gap-3 transition ${
                testResult.success
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-sm block">{testResult.message}</span>
                {testResult.jour && (
                  <span className="mt-1 block text-slate-400">
                    Jour validé : <strong>Jour {testResult.jour}</strong> • Progression :{" "}
                    <strong>{testResult.progression}%</strong>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        Portail Technique Développeur Samré • Connecté à l'API centrale
      </footer>
    </div>
  );
}
