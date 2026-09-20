import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type Status = "idle" | "loading" | "success" | "error";

export default function TestWidget() {
  const [params] = useSearchParams();
  const apiKey = params.get("apiKey") ?? "";

  const [panelisteId, setPanelisteId] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Validation SAMRE";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!panelisteId.trim() || !code.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/sdk/verify-day`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Key": apiKey,
        },
        body: JSON.stringify({
          panelisteId: panelisteId.trim(),
          code: code.trim().toUpperCase(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.valid !== false) {
        setStatus("success");
        setMessage(data.message ?? "Jour validé avec succès.");
      } else {
        setStatus("error");
        setMessage(data.message ?? data.error ?? "Code incorrect ou expiré.");
      }
    } catch {
      setStatus("error");
      setMessage("Impossible de contacter le serveur SAMRE.");
    }
  }

  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-6 text-center">
        <p className="text-sm text-slate-500">
          Clé d&apos;application manquante. Ce widget doit être ouvert avec un
          paramètre <code className="rounded bg-slate-100 px-1">apiKey</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-mist px-5 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy-900 to-brand-orange text-xs font-bold text-white">
            S
          </span>
          <span className="font-display text-base font-bold text-navy-900">
            SAMRE — Validation du jour
          </span>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {status === "success" ? (
            <div className="flex flex-col items-center py-4 text-center">
              <CheckCircle2 size={40} className="text-emerald-500" />
              <p className="mt-3 font-display text-base font-semibold text-navy-900">
                {message}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Vous pouvez fermer cette fenêtre.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="panelisteId"
                  className="mb-1.5 block text-sm font-medium text-navy-900"
                >
                  Identifiant panéliste
                </label>
                <input
                  id="panelisteId"
                  type="text"
                  value={panelisteId}
                  onChange={(e) => setPanelisteId(e.target.value.toUpperCase())}
                  placeholder="TST-XXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-center font-mono text-sm tracking-wide outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="mb-1.5 block text-sm font-medium text-navy-900"
                >
                  Code du jour
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="SAMR-J01-XXXX"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-center font-mono text-sm tracking-wide outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              {status === "error" && (
                <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <XCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {status === "loading" && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Valider le jour
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
