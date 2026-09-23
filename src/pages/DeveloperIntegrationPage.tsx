import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Smartphone,
  Code2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
  Download,
  CheckSquare,
  Wifi,
  Battery,
  Signal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { sdkApi, type IntegrationInfo } from "@/lib/api";

export default function DeveloperIntegrationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<IntegrationInfo | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [showManualCode, setShowManualCode] = useState(false);

  // Simulateur dans le smartphone virtuel
  const [phoneTesterId, setPhoneTesterId] = useState("TST-7A8B9C");
  const [phoneCode, setPhoneCode] = useState("7K9P-4MX2");
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
  const cliCommand = apiUrl.includes("localhost")
    ? `npx samre-cli inject --token=${info.tokenIntegration}`
    : `npx samre-cli inject --token=${info.tokenIntegration} --api-url=${apiUrl}`;
  const cliRemoveCommand = `npx samre-cli remove`;

  // Code Flutter autonome prêt à l'emploi si le développeur préfère l'ajouter manuellement
  const flutterCode = `// =================================================================
// SDK Samré Mobile pour Flutter (Version Autonome)
// Fichier : lib/samre_sdk.dart
// Dépendance dans pubspec.yaml :
//   dependencies:
//     http: ^1.2.0
// =================================================================
import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SamreConfig {
  static const String apiUrl = "${apiUrl}";
  static const String apiKey = "${info.apiKey}";
  static const String appId = "${app.id}";
}

/// Overlay automatique avec compteur anti-triche de 25 secondes
class SamreOverlay extends StatefulWidget {
  final Widget child;
  const SamreOverlay({Key? key, required this.child}) : super(key: key);

  @override
  State<SamreOverlay> createState() => _SamreOverlayState();
}

class _SamreOverlayState extends State<SamreOverlay> {
  int _secondsRemaining = 25;
  bool _canSubmit = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_secondsRemaining > 1) {
        setState(() => _secondsRemaining--);
      } else {
        setState(() {
          _secondsRemaining = 0;
          _canSubmit = true;
        });
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _openValidationDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => const SamreValidationDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        Positioned(
          bottom: 24,
          right: 20,
          child: Material(
            elevation: 8,
            borderRadius: BorderRadius.circular(24),
            color: _canSubmit ? const Color(0xFF2563EB) : Colors.black.withOpacity(0.7),
            child: InkWell(
              borderRadius: BorderRadius.circular(24),
              onTap: _canSubmit ? _openValidationDialog : null,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _canSubmit ? Icons.verified_user : Icons.timer_outlined,
                      color: Colors.white,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _canSubmit ? 'Valider Journée' : 'Test en cours (\${_secondsRemaining}s)',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// Dialogue de saisie du code du jour
class SamreValidationDialog extends StatefulWidget {
  const SamreValidationDialog({Key? key}) : super(key: key);

  @override
  State<SamreValidationDialog> createState() => _SamreValidationDialogState();
}

class _SamreValidationDialogState extends State<SamreValidationDialog> {
  final _uidCtrl = TextEditingController();
  final _codeCtrl = TextEditingController();
  bool _loading = false;
  String? _message;
  bool _success = false;

  Future<void> _verify() async {
    final uid = _uidCtrl.text.trim();
    final code = _codeCtrl.text.trim().toUpperCase();
    if (uid.isEmpty || code.isEmpty) return;

    setState(() {
      _loading = true;
      _message = null;
    });

    try {
      final res = await http.post(
        Uri.parse('\${SamreConfig.apiUrl}/api/v1/sdk/verify-code'),
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': SamreConfig.apiKey,
        },
        body: jsonEncode({
          'apiKey': SamreConfig.apiKey,
          'panelisteUid': uid,
          'code': code,
          'deviceId': 'flutter_device',
        }),
      );

      final data = jsonDecode(res.body) as Map<String, dynamic>;
      if (res.statusCode == 200 && data['success'] == true) {
        setState(() {
          _success = true;
          _message = data['message'] ?? 'Journée validée avec succès !';
        });
      } else {
        setState(() {
          _success = false;
          _message = data['message'] ?? (data['error'] ?? 'Code ou panéliste invalide.');
        });
      }
    } catch (e) {
      setState(() {
        _success = false;
        _message = 'Erreur de connexion au serveur Samré.';
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: const Color(0xFF0F172A),
      title: const Row(
        children: [
          Icon(Icons.stars_rounded, color: Color(0xFF38BDF8), size: 24),
          SizedBox(width: 8),
          Text('Validation Samré', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Saisissez votre Identifiant Panéliste et votre Code du Jour :',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _uidCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Identifiant Panéliste',
                labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                hintText: 'Ex: TST-7A8B9C',
                hintStyle: const TextStyle(color: Color(0xFF64748B)),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _codeCtrl,
              textCapitalization: TextCapitalization.characters,
              style: const TextStyle(color: Colors.white, letterSpacing: 2, fontWeight: FontWeight.bold),
              decoration: InputDecoration(
                labelText: 'Code Unique du Jour',
                labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                hintText: 'Ex: 7K9P-4MX2',
                hintStyle: const TextStyle(color: Color(0xFF64748B), letterSpacing: 0),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            if (_message != null) ...[
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _success ? const Color(0xFF065F46).withOpacity(0.3) : const Color(0xFF991B1B).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: _success ? const Color(0xFF10B981) : const Color(0xFFEF4444)),
                ),
                child: Text(
                  _message!,
                  style: TextStyle(color: _success ? const Color(0xFF34D399) : const Color(0xFFF87171), fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Fermer', style: TextStyle(color: Color(0xFF94A3B8))),
        ),
        ElevatedButton(
          onPressed: _loading ? null : _verify,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF2563EB),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          child: _loading
              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
              : const Text('Valider', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}`;

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
        {/* Banner Application Simplifiée */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg font-bold text-xl">
                {app.nom.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-white font-display">
                    {app.nom}
                  </h1>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300 font-mono">
                    v{app.version}
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400 font-medium border border-blue-500/20">
                    Flutter
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Campagne Google Play : <strong>{app.dureeJours || 12} jours</strong></span>
                  <span>•</span>
                  <span><strong>{app.nbMaxPanelistes || 12} panélistes</strong></span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Prêt pour injection
            </span>
          </div>
        </div>

        {/* Section Double Colonne : L'essentiel à gauche | Smartphone Mockup à droite */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Colonne Gauche : Les 2 seules étapes du développeur (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Étape 1 : La commande unique */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                  1
                </span>
                <span>Exécutez cette commande à la racine de votre projet Flutter :</span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-3 pl-4">
                <code className="text-xs sm:text-sm text-emerald-400 font-mono select-all truncate">
                  {cliCommand}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(cliCommand);
                    setCopiedCommand(true);
                    setTimeout(() => setCopiedCommand(false), 2000);
                  }}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                >
                  {copiedCommand ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedCommand ? "Copié !" : "Copier la commande"}
                </button>
              </div>

              {/* 3 garanties rapides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zéro code manuel</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Overlay actif après 25s</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Sauvegarde auto créée</span>
                </div>
              </div>
            </div>

            {/* Étape 2 : Lancer l'app */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-black text-xs">
                  2
                </span>
                <span>Lancez votre application pour tester :</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 pl-4">
                <code className="text-xs font-mono text-cyan-300 select-all">
                  flutter run
                </code>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                👉 Un bouton discret <strong>&quot;Test en cours&quot;</strong> apparaît sur votre écran. Après <strong>25 secondes</strong> d&apos;utilisation, il passera en <strong>&quot;Valider Journée&quot;</strong> pour permettre au testeur de saisir son code du jour.
              </p>
            </div>

            {/* Étape 3 : Retrait post-campagne */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-300 block">Désinstallation propre (après les 12 jours) :</span>
                <span className="text-slate-500 text-[11px]">Restaure votre application dans son état d&apos;origine sans résidu.</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-amber-300 text-xs shrink-0 select-all">
                <code>{cliRemoveCommand}</code>
              </div>
            </div>

            {/* Accordéon repliable : Code Flutter manuel (Optionnel) */}
            <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowManualCode(!showManualCode)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-400" />
                  <span>Vous préférez intégrer le code Dart manuellement sans le CLI ? (Optionnel)</span>
                </div>
                {showManualCode ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showManualCode && (
                <div className="border-t border-slate-800 p-4 space-y-3 bg-slate-950">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Fichier : lib/samre_sdk.dart</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(flutterCode)}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedCode ? "Copié !" : "Copier le code"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadFile("samre_sdk.dart", flutterCode)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="h-3 w-3" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 bg-slate-900/80 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-[350px]">
                    {flutterCode}
                  </pre>
                </div>
              )}
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
                      placeholder="Ex: TST-7A8B9C"
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
                      placeholder="Ex: 7K9P-4MX2"
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
