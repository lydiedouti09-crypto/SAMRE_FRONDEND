import { useEffect, useState } from "react";
import Link from "@/lib/router";
import {
  Bell,
  CheckCheck,
  CheckCircle,
  Clock,
  Loader2,
  Smartphone,
  ChevronRight,
  Play,
  ExternalLink,
} from "lucide-react";
import {
  notificationsApi,
  participationsApi,
  getApplicationPlayStoreUrl,
  type NotificationItem,
  type Participation,
} from "@/lib/api";

function getCleanNotificationMessage(text: string) {
  if (!text) return "";
  // Retirer l'URL brute et reformuler élégamment
  let cleaned = text
    .replace(/(?:Téléchargez|Installez)\s+l['’]application[^\.\:\n]*\s*:?\s*https?:\/\/[^\s]+/i, "Vous pouvez installer l'application dès maintenant pour commencer votre test.")
    .replace(/\s*:?\s*https?:\/\/[^\s]+/gi, "")
    .trim();
  return cleaned;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  function fetchNotifications() {
    Promise.all([
      notificationsApi.list().catch(() => []),
      participationsApi.mine().catch(() => []),
    ])
      .then(([notifs, parts]) => {
        setNotifications(notifs);
        setParticipations(parts);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function handleMarkAsRead(id: number) {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
      );
    } catch {
      // ignore
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 pt-6 pb-24 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Bell size={20} />
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight text-navy-950">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-orange px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Informations sur vos missions, étapes validées et nouvelles consignes.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-bold text-navy-900 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 size={14} className="animate-spin text-brand-orange" />
              ) : (
                <CheckCheck size={15} className="text-brand-orange" />
              )}
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-brand-orange" />
              <p className="text-xs text-slate-400">Chargement de vos notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-10 text-center shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Bell size={26} />
            </div>
            <h3 className="mt-3 font-display text-sm font-bold text-navy-950">
              Toutes les notifications sont lues
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Vous recevrez ici les invitations aux tests, les validations d'étapes et les annonces importantes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const isAccepted =
                n.titre.toLowerCase().includes("acceptée") ||
                n.message.toLowerCase().includes("acceptée");
              const isGain = n.type === "gain";

              const dateStr = n.dateCreation
                ? new Date(n.dateCreation).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Récemment";

              const cleanMsg = getCleanNotificationMessage(n.message);

              return (
                <div
                  key={n.id}
                  onClick={() => !n.lu && handleMarkAsRead(n.id)}
                  className={`group relative rounded-2xl border p-5 transition-all cursor-pointer ${
                    !n.lu
                      ? "border-brand-orange/40 bg-white shadow-xs ring-1 ring-brand-orange/10"
                      : "border-slate-200/80 bg-white/90 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Icône selon type */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-2xs ${
                        isAccepted
                          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/80"
                          : isGain
                          ? "bg-amber-50 text-brand-orange ring-1 ring-amber-200/80"
                          : "bg-blue-50 text-blue-600 ring-1 ring-blue-200/80"
                      }`}
                    >
                      {isAccepted ? (
                        <CheckCircle size={22} />
                      ) : isGain ? (
                        <Smartphone size={20} />
                      ) : (
                        <Bell size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Ligne titre & statut & date */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-display text-sm font-bold leading-tight ${
                              !n.lu ? "text-navy-950" : "text-slate-700"
                            }`}
                          >
                            {n.titre}
                          </h3>
                          {!n.lu && (
                            <span className="rounded-md bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {dateStr}
                        </span>
                      </div>

                      {/* Corps du message propre (sans URL brute) */}
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">
                        {cleanMsg}
                      </p>

                      {/* Boutons d'action Google Play pour candidature acceptée */}
                      {isAccepted && (() => {
                        const matchedPart =
                          participations.find((p) => {
                            if (!p.mission) return false;
                            return (
                              n.message
                                .toLowerCase()
                                .includes(p.mission.titre.toLowerCase()) ||
                              n.message
                                .toLowerCase()
                                .includes(p.mission.application.toLowerCase())
                            );
                          }) || participations[0];

                        let appName = matchedPart?.mission?.application;
                        if (!appName) {
                          const quoteMatch = n.message.match(/«([^»]+)»/);
                          if (quoteMatch) {
                            const extracted = quoteMatch[1]
                              .replace(/tester\s+l['’]application\s+/i, "")
                              .trim();
                            if (extracted) appName = extracted;
                          }
                        }
                        if (!appName) appName = "l'application";

                        // Récupérer le lien direct du Play Store sans l'afficher en texte brut
                        const urlInMsg = n.message.match(/https?:\/\/[^\s\)\.\,]+/);
                        let playUrl = urlInMsg
                          ? urlInMsg[0]
                          : getApplicationPlayStoreUrl(matchedPart?.mission);
                        if (!playUrl || playUrl === "https://play.google.com/store/apps") {
                          playUrl = `https://play.google.com/store/search?q=${encodeURIComponent(
                            appName !== "l'application" ? appName : "FlyPoint"
                          )}&c=apps`;
                        }

                        return (
                          <div className="mt-3.5 flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100">
                            <a
                              href={playUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-navy-950 shadow-2xs transition hover:bg-slate-50 active:scale-98"
                              title="Installer directement depuis le Play Store"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                <path d="M3.609 1.814C3.253 2.19 3 2.793 3 3.593v16.814c0 .8.253 1.403.609 1.779l.092.088 9.42-9.42v-.222L3.701 1.726l-.092.088z" fill="#00D2FF" />
                                <path d="M16.275 15.997l-3.154-3.154v-.222l3.154-3.154.07.04 3.738 2.124c1.068.606 1.068 1.6 0 2.207l-3.738 2.124-.07.035z" fill="#FFD200" />
                                <path d="M16.345 15.962L13.12 12.737 3.609 22.247c.353.376.945.422 1.623.036l11.113-6.321" fill="#FF3A44" />
                                <path d="M16.345 8.038L5.232 1.717c-.678-.386-1.27-.34-1.623.036l9.512 9.51 3.224-3.225" fill="#00E676" />
                              </svg>
                              <span>Installer {appName} sur Google Play</span>
                              <ExternalLink size={12} className="text-slate-400" />
                            </a>

                            {matchedPart?.mission?.id && (
                              <Link
                                href={`/dashboard/missions/${matchedPart.mission.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-navy-950 shadow-2xs transition hover:bg-slate-50"
                              >
                                <span>Accéder à la mission</span>
                                <ChevronRight size={14} />
                              </Link>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {!n.lu && (
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-brand-orange shrink-0 mt-1 ring-2 ring-white"
                        title="Non lu"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
