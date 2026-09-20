import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Bell,
  Send,
  Users,
  Briefcase,
  User,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
} from "lucide-react";
import {
  adminApi,
  type AdminMission,
  type AdminNotification,
  type User as UserType,
} from "@/lib/api";

function AdminNotificationsContent() {
  const [searchParams] = useSearchParams();

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [missions, setMissions] = useState<AdminMission[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [target, setTarget] = useState<"all" | "mission" | "user">("all");
  const [selectedMissionId, setSelectedMissionId] = useState<number | "">("");
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "alerte" | "succes" | "rappel">("info");
  const [sending, setSending] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; success: boolean } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifsRes, missionsRes, usersRes] = await Promise.all([
        adminApi.notifications(),
        adminApi.missions(),
        adminApi.users(),
      ]);
      setNotifications(notifsRes || []);
      setMissions(missionsRes || []);
      setUsers(usersRes || []);

      // Check query param for preselected user
      const userParam = searchParams.get("user");
      if (userParam) {
        setTarget("user");
        setSelectedUserId(Number(userParam));
        const nameParam = searchParams.get("name");
        if (nameParam) {
          setTitre(`Message pour ${decodeURIComponent(nameParam)}`);
        }
      }
    } catch (err) {
      console.error("Erreur chargement notifications admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (!titre.trim() || !message.trim()) {
      setFeedbackMsg({ text: "Veuillez remplir le titre et le message.", success: false });
      return;
    }

    if (target === "mission" && !selectedMissionId) {
      setFeedbackMsg({ text: "Veuillez sélectionner une mission cible.", success: false });
      return;
    }

    if (target === "user" && !selectedUserId) {
      setFeedbackMsg({ text: "Veuillez sélectionner un utilisateur cible.", success: false });
      return;
    }

    setSending(true);
    try {
      const targetId =
        target === "mission"
          ? Number(selectedMissionId)
          : target === "user"
          ? Number(selectedUserId)
          : undefined;

      const res = await adminApi.sendNotification({
        target,
        targetId,
        titre: titre.trim(),
        message: message.trim(),
        type,
      });

      setFeedbackMsg({
        text: `Notification transmise avec succès à ${res.destinataires} testeur(s) !`,
        success: true,
      });

      setTitre("");
      setMessage("");

      // Recharger l'historique
      const updated = await adminApi.notifications();
      setNotifications(updated || []);
    } catch (err: any) {
      setFeedbackMsg({
        text: err?.message || "Erreur lors de l'envoi de la notification.",
        success: false,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Centre de Notifications & Messages
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              Diffusion ciblée
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Envoyez des consignes, alertes ou rappels à un testeur spécifique, aux participants d&apos;une mission ou à l&apos;ensemble de la communauté.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-brand-orange" : ""} />
          <span>Actualiser</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Formulaire de composition (5 colonnes) */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Send size={16} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-navy-900">Composer un message</h2>
                <p className="text-[11px] text-slate-400">Diffusion instantanée aux testeurs</p>
              </div>
            </div>

            {feedbackMsg && (
              <div
                className={`rounded-xl p-3 text-xs font-medium border ${
                  feedbackMsg.success
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              {/* Cible */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Destinataires cibles
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTarget("all")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                      target === "all"
                        ? "border-navy-900 bg-navy-900 text-white font-bold"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Users size={16} className="mb-1" />
                    <span>Tous ({users.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTarget("mission")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                      target === "mission"
                        ? "border-navy-900 bg-navy-900 text-white font-bold"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Briefcase size={16} className="mb-1" />
                    <span>Par mission</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTarget("user")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                      target === "user"
                        ? "border-navy-900 bg-navy-900 text-white font-bold"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <User size={16} className="mb-1" />
                    <span>1 testeur</span>
                  </button>
                </div>
              </div>

              {/* Sélection Mission si cible mission */}
              {target === "mission" && (
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Sélectionnez la mission concernée
                  </label>
                  <select
                    value={selectedMissionId}
                    onChange={(e) => setSelectedMissionId(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-brand-orange"
                  >
                    <option value="">-- Choisir une mission --</option>
                    {missions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.titre} ({m.nombreParticipants || 0} participants)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sélection Testeur si cible utilisateur */}
              {target === "user" && (
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Sélectionnez le testeur
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-brand-orange"
                  >
                    <option value="">-- Choisir un utilisateur --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.prenom} {u.nom} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type de notification */}
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Type d&apos;annonce</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "info", label: "Info", color: "text-blue-600 bg-blue-50" },
                    { id: "alerte", label: "Alerte", color: "text-rose-600 bg-rose-50" },
                    { id: "succes", label: "Succès", color: "text-emerald-600 bg-emerald-50" },
                    { id: "rappel", label: "Rappel", color: "text-amber-600 bg-amber-50" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`py-1.5 rounded-lg text-center font-bold transition border ${
                        type === t.id
                          ? "border-navy-900 bg-navy-900 text-white"
                          : `border-slate-200 ${t.color}`
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Titre de l&apos;information *</label>
                <input
                  type="text"
                  required
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Mise à jour requise pour l'étape 2"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-brand-orange"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Message détaillé *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Rédigez les détails de l'instruction, le rappel de date limite ou la consigne..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-brand-orange leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-xs font-bold text-white shadow-sm hover:bg-brand-orange/90 transition disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Diffuser la notification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Historique des notifications diffusées (7 colonnes) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-slate-500" />
                <h3 className="font-bold text-sm text-navy-900">Historique des notifications envoyées</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                {notifications.length} message{notifications.length > 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="flex h-56 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-brand-orange" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">
                Aucune notification envoyée pour le moment.
              </p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs space-y-1.5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            notif.type === "alerte"
                              ? "bg-rose-500"
                              : notif.type === "succes"
                              ? "bg-emerald-500"
                              : notif.type === "rappel"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <p className="font-bold text-navy-900">{notif.titre}</p>
                      </div>

                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Calendar size={11} />
                        {notif.dateCreation || "Récemment"}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-[11px] pl-4">{notif.message}</p>

                    <div className="pl-4 pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/70">
                      <span>
                        Destinataire :{" "}
                        <strong className="text-slate-600 font-semibold">
                          {notif.destinataireNom || "Global"}
                        </strong>
                      </span>
                      {notif.destinataireEmail && (
                        <span>({notif.destinataireEmail})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminNotificationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Chargement des notifications...</div>}>
      <AdminNotificationsContent />
    </Suspense>
  );
}
