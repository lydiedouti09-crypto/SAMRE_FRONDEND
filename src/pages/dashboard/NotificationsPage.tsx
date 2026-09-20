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

function renderMessageWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, idx) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-bold text-emerald-600 underline hover:text-emerald-700 break-all inline-flex items-center gap-0.5 mx-1"
        >
          <span>{part}</span>
          <ExternalLink size={10} className="inline shrink-0" />
        </a>
      );
    }
    return part;
  });
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
    <div className="min-h-screen bg-[#F8F9FB] px-4 pt-5 pb-24 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-brand-orange" />
              <h1 className="font-display text-lg font-bold text-navy-900">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Informations sur vos missions, étapes validées et nouvelles consignes.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 size={13} className="animate-spin text-brand-orange" />
              ) : (
                <CheckCheck size={14} className="text-brand-orange" />
              )}
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 size={22} className="animate-spin text-brand-orange" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Bell size={22} />
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500">
              Aucune notification pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => {
              const isMission = n.type === "mission";
              const isGain = n.type === "gain";

              const dateStr = n.dateCreation
                ? new Date(n.dateCreation).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Récemment";

              return (
                <div
                  key={n.id}
                  onClick={() => !n.lu && handleMarkAsRead(n.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition cursor-pointer ${
                    !n.lu
                      ? "border-orange-200 bg-white shadow-xs"
                      : "border-slate-100 bg-white/70"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${
                      isMission
                        ? "bg-amber-100 text-brand-orange"
                        : isGain
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isMission ? "📱" : isGain ? "✓" : "🔔"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-xs font-bold leading-tight ${!n.lu ? "text-navy-900" : "text-slate-600"}`}>
                        {n.titre}
                      </h3>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {dateStr}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {renderMessageWithLinks(n.message)}
                    </p>

                    {/* Boutons d'action Google Play pour candidature acceptée */}
                    {(n.titre.toLowerCase().includes("acceptée") || n.message.toLowerCase().includes("acceptée")) && (() => {
                      const matchedPart = participations.find((p) => {
                        if (!p.mission) return false;
                        return (
                          n.message.toLowerCase().includes(p.mission.titre.toLowerCase()) ||
                          n.message.toLowerCase().includes(p.mission.application.toLowerCase())
                        );
                      }) || participations[0];

                      let appName = matchedPart?.mission?.application;
                      if (!appName) {
                        const quoteMatch = n.message.match(/«([^»]+)»/);
                        if (quoteMatch) {
                          const extracted = quoteMatch[1].replace(/tester\s+l['’]application\s+/i, "").trim();
                          if (extracted) appName = extracted;
                        }
                      }
                      if (!appName) appName = "l'application";

                      // Extraire un lien direct dans le message s'il existe
                      const urlInMsg = n.message.match(/https?:\/\/[^\s\)\.\,]+/);
                      let playUrl = urlInMsg ? urlInMsg[0] : getApplicationPlayStoreUrl(matchedPart?.mission);
                      if (!playUrl || playUrl === "https://play.google.com/store/apps") {
                        playUrl = `https://play.google.com/store/search?q=${encodeURIComponent(appName !== "l'application" ? appName : "FlyPoint")}&c=apps`;
                      }

                      return (
                        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100">
                          <a
                            href={playUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-98"
                            title="Ouvrir la fiche de l'application sur Google Play Store"
                          >
                            <Play size={12} fill="currentColor" />
                            <span>Installer {appName} sur Google Play</span>
                            <ExternalLink size={11} />
                          </a>

                          {matchedPart?.mission?.id && (
                            <Link
                              href={`/dashboard/missions/${matchedPart.mission.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
                            >
                              <span>Accéder à la mission</span>
                              <ChevronRight size={13} />
                            </Link>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {!n.lu && (
                    <span className="h-2 w-2 rounded-full bg-brand-orange shrink-0 mt-1.5" title="Non lu" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
