import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Send,
  ExternalLink,
  FileCode,
  Sparkles,
  Download,
  Layers,
  CheckSquare,
  ArrowRight,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import { sdkApi, type IntegrationInfo } from "@/lib/api";

export default function DeveloperIntegrationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<IntegrationInfo | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"flutter" | "kotlin" | "react-native" | "curl">("flutter");

  // Simulateur dans le smartphone virtuel
  const [phoneTesterId, setPhoneTesterId] = useState("TST-849201");
  const [phoneCode, setPhoneCode] = useState("SAMRE-J01-ABCD");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneResult, setPhoneResult] = useState<{
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    if (!phoneTesterId.trim() || !phoneCode.trim()) {
      setPhoneResult({
        success: false,
        message: "Veuillez saisir votre identifiant panéliste et le code du jour.",
      });
      return;
    }

    setPhoneLoading(true);
    setPhoneResult(null);

    try {
      const res = await sdkApi.verifyDay({
        apiKey: info.apiKey,
        panelisteId: phoneTesterId.trim(),
        code: phoneCode.trim(),
      });
      setPhoneResult({
        success: res.success,
        message: res.message || "Journée validée avec succès !",
        jour: res.jour,
        progression: res.progression,
      });
    } catch (err: any) {
      setPhoneResult({
        success: false,
        message: err.message || "Code incorrect ou panéliste non reconnu.",
      });
    } finally {
      setPhoneLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400 font-medium">
            Chargement de l&apos;espace développeur...
          </p>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
        <div className="max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-8 text-center shadow-2xl">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-white font-display">Lien Invalide ou Expiré</h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {error || "Ce portail d'intégration est inaccessible ou le jeton de sécurité est incorrect."}
          </p>
        </div>
      </div>
    );
  }

  const app = info.application;
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  // Code snippets
  const flutterCode = `// =================================================================
// 1. Ajouter dans pubspec.yaml :
// dependencies:
//   http: ^1.2.0
//
// 2. Créer le fichier lib/samre_test_screen.dart :
// =================================================================
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SamreTestScreen extends StatefulWidget {
  final String apiKey;
  const SamreTestScreen({
    Key? key,
    this.apiKey = "${info.apiKey}",
  }) : super(key: key);

  @override
  State<SamreTestScreen> createState() => _SamreTestScreenState();
}

class _SamreTestScreenState extends State<SamreTestScreen> {
  final _panelisteIdController = TextEditingController();
  final _codeController = TextEditingController();
  bool _isLoading = false;
  String? _statusMessage;
  bool _isSuccess = false;

  Future<void> _validateDay() async {
    final panelisteId = _panelisteIdController.text.trim();
    final code = _codeController.text.trim();

    if (panelisteId.isEmpty || code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _statusMessage = null;
    });

    try {
      final response = await http.post(
        Uri.parse('${apiUrl}/api/sdk/verify-day'),
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': widget.apiKey,
        },
        body: jsonEncode({
          'panelisteId': panelisteId,
          'code': code,
        }),
      );

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _isSuccess = true;
          _statusMessage = data['message'] ?? 'Journée validée avec succès !';
        });
      } else {
        setState(() {
          _isSuccess = false;
          _statusMessage = data['error'] ?? 'Code ou panéliste invalide.';
        });
      }
    } catch (e) {
      setState(() {
        _isSuccess = false;
        _statusMessage = 'Erreur de connexion au serveur Samré.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Espace Testeur Samré'),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Validation Quotidienne de Test',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              'Saisissez votre Identifiant Panéliste et le Code du Jour reçu sur Samré.',
              style: TextStyle(color: Colors.grey, fontSize: 13),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _panelisteIdController,
              decoration: const InputDecoration(
                labelText: 'Identifiant Unique Panéliste',
                hintText: 'Ex: TST-123456',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _codeController,
              textCapitalization: TextCapitalization.characters,
              decoration: const InputDecoration(
                labelText: 'Code Unique du Jour',
                hintText: 'Ex: SAMRE-J01-9F3B',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock_outline),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _validateDay,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Valider ma journée de test', style: TextStyle(fontSize: 15)),
            ),
            if (_statusMessage != null) ...[
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _isSuccess ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _isSuccess ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                  ),
                ),
                child: Text(
                  _statusMessage!,
                  style: TextStyle(
                    color: _isSuccess ? const Color(0xFF065F46) : const Color(0xFF991B1B),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// 3. Pour ouvrir cette page dans votre application :
// Navigator.push(
//   context,
//   MaterialPageRoute(builder: (context) => const SamreTestScreen()),
// );`;

  const kotlinCode = `// =================================================================
// 1. Dans build.gradle.kts (Module: app) :
// dependencies {
//     implementation("com.squareup.okhttp3:okhttp:4.12.0")
//     implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
// }
// =================================================================
package com.example.app.samre

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class SamreTestActivity : AppCompatActivity() {

    private val apiKey = "${info.apiKey}"
    private val endpoint = "${apiUrl}/api/sdk/verify-day"
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Créez votre vue XML ou compose contenant les 2 champs et le bouton
        val btnValidate = findViewById<Button>(R.id.btnValidate)
        val etTesterId = findViewById<EditText>(R.id.etTesterId)
        val etCode = findViewById<EditText>(R.id.etCode)
        val tvResult = findViewById<TextView>(R.id.tvResult)

        btnValidate.setOnClickListener {
            val testerId = etTesterId.text.toString().trim()
            val code = etCode.text.toString().trim()

            lifecycleScope.launch {
                btnValidate.isEnabled = false
                try {
                    val result = withContext(Dispatchers.IO) {
                        val json = JSONObject().apply {
                            put("panelisteId", testerId)
                            put("code", code)
                        }
                        val body = json.toString().toRequestBody("application/json".toMediaType())
                        val req = Request.Builder()
                            .url(endpoint)
                            .addHeader("X-App-Key", apiKey)
                            .post(body)
                            .build()
                        client.newCall(req).execute().use { it.body?.string() }
                    }
                    val jsonRes = JSONObject(result ?: "{}")
                    if (jsonRes.optBoolean("success", false)) {
                        tvResult.text = jsonRes.optString("message", "Journée validée !")
                    } else {
                        tvResult.text = jsonRes.optString("error", "Échec de validation")
                    }
                } catch (e: Exception) {
                    tvResult.text = "Erreur de connexion au serveur Samré"
                } finally {
                    btnValidate.isEnabled = true
                }
            }
        }
    }
}`;

  const reactNativeCode = `// =================================================================
// Formulaire de test Samré pour React Native
// =================================================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';

export function SamreTestModal() {
  const [testerId, setTesterId] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!testerId || !code) {
      Alert.alert('Champs requis', 'Veuillez saisir votre ID et le code du jour');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('${apiUrl}/api/sdk/verify-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': '${info.apiKey}',
        },
        body: JSON.stringify({ panelisteId: testerId, code: code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage(data.message || 'Journée validée avec succès !');
      } else {
        setStatusMessage(data.error || 'Code invalide');
      }
    } catch (e) {
      setStatusMessage('Erreur de connexion avec Samré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Testeur Samré</Text>
      <TextInput
        placeholder="Identifiant Panéliste (ex: TST-123456)"
        value={testerId}
        onChangeText={setTesterId}
        style={styles.input}
      />
      <TextInput
        placeholder="Code du Jour (ex: SAMRE-J01-ABCD)"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        style={styles.input}
      />
      <TouchableOpacity style={styles.btn} onPress={handleValidate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Valider la journée</Text>}
      </TouchableOpacity>
      {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  status: { marginTop: 12, fontWeight: '600', textAlign: 'center' },
});`;

  const curlCode = `# Test direct en ligne de commande (cURL)
curl -X POST "${apiUrl}/api/sdk/verify-day" \\
  -H "Content-Type: application/json" \\
  -H "X-App-Key: ${info.apiKey}" \\
  -d '{
    "panelisteId": "TST-849201",
    "code": "SAMRE-J01-ABCD"
  }'`;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30 shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-lg font-display">
                  Portail Développeur Samré
                </span>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                  Étape 2 : Intégration
                </span>
              </div>
              <p className="text-xs text-slate-400">Guide pour intégrer le formulaire de test dans votre application</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Prête
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
        {/* Banner Hero App */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg font-bold text-2xl">
                {app.nom.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-white font-display">
                    Projet : {app.nom}
                  </h1>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300 font-mono">
                    v{app.version}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 font-medium border border-emerald-500/20">
                    Android
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {app.description ||
                    "Cette application fait l'objet d'une campagne de test panéliste sur Samré. Intégrez le composant ci-dessous pour créer la page contenant le formulaire de test."}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Protocole : <strong>{app.dureeJours || 12} jours</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                    Panélistes : <strong>{app.nbMaxPanelistes || 12} testeurs</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Clé d'intégration */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4 shrink-0 lg:max-w-xs w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                Votre Clé d&apos;Intégration (X-App-Key)
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
              <p className="mt-2 text-[10px] text-slate-500">
                Déjà pré-configurée dans les snippets de code ci-dessous.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Étapes du protocole Étape 2 */}
        <div className="rounded-3xl border border-blue-500/20 bg-blue-950/20 p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h2 className="text-base font-bold text-white font-display">
              Étape 2 du protocole : Intégration dans votre application
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs leading-relaxed text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs mb-2">
                1
              </span>
              <h3 className="font-bold text-white text-sm">Où mettre le package / snippet ?</h3>
              <p className="mt-1 text-slate-400">
                Ajoutez la dépendance HTTP dans votre fichier de config (ex: <code>pubspec.yaml</code> pour Flutter, <code>build.gradle</code> pour Android) et collez le composant <code>SamreTestScreen</code> dans votre projet.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs mb-2">
                2
              </span>
              <h3 className="font-bold text-white text-sm">Où mettre la clé d&apos;intégration ?</h3>
              <p className="mt-1 text-slate-400">
                Votre clé unique <code>{info.apiKey.slice(0, 14)}...</code> est déjà insérée dans le code fourni. Vous n&apos;avez qu&apos;à l&apos;importer.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs mb-2">
                3
              </span>
              <h3 className="font-bold text-white text-sm">Résultat dans votre app</h3>
              <p className="mt-1 text-slate-400">
                <strong>Cela crée une page contenant un formulaire de test.</strong> Les panélistes pourront y saisir leur identifiant et leur code quotidien pour valider chaque jour.
              </p>
            </div>
          </div>
        </div>

        {/* Section Double Colonne : Code à gauche | Smartphone Mockup à droite */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Colonne Gauche : Code et composants (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              {/* Tabs de sélection */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-3">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Composant & Formulaire Prêt à l&apos;emploi
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 text-xs border border-slate-800">
                  <button
                    onClick={() => setActiveTab("flutter")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeTab === "flutter"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Flutter (Dart)
                  </button>
                  <button
                    onClick={() => setActiveTab("kotlin")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeTab === "kotlin"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Android (Kotlin)
                  </button>
                  <button
                    onClick={() => setActiveTab("react-native")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeTab === "react-native"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    React Native
                  </button>
                  <button
                    onClick={() => setActiveTab("curl")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeTab === "curl"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    API / cURL
                  </button>
                </div>
              </div>

              {/* Barre d'action rapide : Copier / Télécharger */}
              <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-950/60 px-5 py-2 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {activeTab === "flutter" && "Fichier : lib/samre_test_screen.dart"}
                  {activeTab === "kotlin" && "Fichier : SamreTestActivity.kt"}
                  {activeTab === "react-native" && "Fichier : SamreTestModal.tsx"}
                  {activeTab === "curl" && "Requête HTTP direct"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const code =
                        activeTab === "flutter"
                          ? flutterCode
                          : activeTab === "kotlin"
                          ? kotlinCode
                          : activeTab === "react-native"
                          ? reactNativeCode
                          : curlCode;
                      handleCopyCode(code);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Code copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copier tout le code</span>
                      </>
                    )}
                  </button>

                  {activeTab !== "curl" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "flutter") handleDownloadFile("samre_test_screen.dart", flutterCode);
                        if (activeTab === "kotlin") handleDownloadFile("SamreTestActivity.kt", kotlinCode);
                        if (activeTab === "react-native") handleDownloadFile("SamreTestModal.tsx", reactNativeCode);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      <Download className="h-3 w-3" />
                      <span>Télécharger</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Code affiché */}
              <div className="p-5 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[560px] leading-relaxed">
                {activeTab === "flutter" && (
                  <pre className="text-cyan-300">{flutterCode}</pre>
                )}
                {activeTab === "kotlin" && (
                  <pre className="text-emerald-300">{kotlinCode}</pre>
                )}
                {activeTab === "react-native" && (
                  <pre className="text-purple-300">{reactNativeCode}</pre>
                )}
                {activeTab === "curl" && (
                  <pre className="text-amber-300">{curlCode}</pre>
                )}
              </div>
            </div>
          </div>

          {/* Colonne Droite : Smartphone Virtuel avec formulaire (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start">
            <div className="w-full text-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
                <Smartphone className="h-4 w-4 text-blue-400" />
                Application testée avec formulaire (Aperçu direct)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Voici exactement ce que le composant affiche dans votre application
              </p>
            </div>

            {/* Smartphone Frame (Mockup Réaliste) */}
            <div className="relative w-[320px] rounded-[42px] border-[8px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* Dynamic Island / Speaker */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-4 w-28 rounded-full bg-slate-950 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-slate-900 mr-2" />
                <div className="h-1.5 w-8 rounded-full bg-slate-800" />
              </div>

              {/* Smartphone Status Bar */}
              <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[10px] text-slate-400 bg-slate-900 font-medium">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="h-3 w-3" />
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Screen Content : Formulaire de test Samré */}
              <div className="bg-white min-h-[500px] text-slate-900 flex flex-col justify-between">
                {/* App Bar interne */}
                <div className="bg-[#0F172A] px-4 py-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                      S
                    </div>
                    <span className="font-bold text-xs">Espace Testeur Samré</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                    Actif
                  </span>
                </div>

                {/* Formulaire réel dans l'app */}
                <form onSubmit={handlePhoneSubmit} className="p-4 space-y-3.5 flex-1">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Validation Quotidienne
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Application : <strong>{app.nom}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Identifiant Panéliste *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: TST-123456"
                      value={phoneTesterId}
                      onChange={(e) => setPhoneTesterId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Code Unique du Jour *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: SAMRE-J01-9F3B"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={phoneLoading}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {phoneLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckSquare className="h-3.5 w-3.5" />
                    )}
                    <span>Valider ma journée de test</span>
                  </button>

                  {/* Résultat visuel en direct sur l'écran du smartphone */}
                  {phoneResult && (
                    <div
                      className={`rounded-xl border p-2.5 text-[11px] leading-tight transition ${
                        phoneResult.success
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-rose-200 bg-rose-50 text-rose-900"
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        {phoneResult.success ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{phoneResult.message}</p>
                          {phoneResult.jour && (
                            <p className="mt-0.5 text-[10px] text-emerald-700">
                              Jour {phoneResult.jour} validé • Progression : {phoneResult.progression}%
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-[10px] text-slate-500 leading-normal">
                    💡 <em>Simulation en direct :</em> Les panélistes Samré entreront chaque jour leur code ici pour faire progresser leur test.
                  </div>
                </form>

                {/* Home Indicator en bas du smartphone */}
                <div className="py-2 flex justify-center bg-white">
                  <div className="h-1 w-24 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        Portail Technique Développeur Samré • Intégration du formulaire de test
      </footer>
    </div>
  );
}
