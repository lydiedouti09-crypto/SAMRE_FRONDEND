import { User as UserIcon, Bell, Camera, Sparkles, ChevronRight, Play, ExternalLink } from "lucide-react";
import Link from "@/lib/router";
import type { NotificationItem } from "@/lib/api";

type Props = {
  prenom?: string;
  nom?: string;
  email?: string;
  photo?: string;
  notifications: NotificationItem[];
};

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
          className="font-bold text-emerald-600 underline hover:text-emerald-700 break-all inline-flex items-center gap-0.5 mx-0.5"
        >
          <span>{part}</span>
          <ExternalLink size={9} className="inline shrink-0" />
        </a>
      );
    }
    return part;
  });
}

export default function DesktopActivityPanel({
  prenom,
  nom,
  email,
  photo,
  notifications,
}: Props) {
  const fullName = [prenom, nom].filter(Boolean).join(" ") || "Testeur Samré";
  const initials = (prenom?.[0] || "") + (nom?.[0] || "S");

  return (
    <div className="flex w-72 shrink-0 flex-col gap-4 xl:w-80">
      {/* Profil Card Compact */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            {photo ? (
              <img
                src={photo}
                alt={fullName}
                className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md shadow-navy-950/10"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-navy-900 via-navy-800 to-brand-orange text-lg font-bold text-white shadow-md shadow-navy-950/10">
                {initials.toUpperCase()}
              </div>
            )}
            <Link
              href="/dashboard/profil"
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-navy-900 text-white shadow-xs transition hover:bg-brand-orange"
              title="Changer de photo"
            >
              <Camera size={10} />
            </Link>
          </div>

          <h3 className="mt-3 font-display text-base font-bold text-navy-900">
            {fullName}
          </h3>

          {email && (
            <p className="mt-1 text-[11px] text-slate-400 truncate max-w-[200px]">
              {email}
            </p>
          )}

          <div className="mt-4 flex w-full items-center justify-center pt-3 border-t border-slate-100">
            <Link
              href="/dashboard/profil"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <UserIcon size={13} />
              <span>Gérer le profil</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications & Activity */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-brand-orange" />
            <h4 className="font-display text-xs font-bold text-navy-900">
              Notifications récentes
            </h4>
          </div>
          <Link
            href="/dashboard/notifications"
            className="flex items-center gap-0.5 text-[11px] font-semibold text-brand-orange hover:underline"
          >
            <span>Voir tout</span>
            <ChevronRight size={12} />
          </Link>
        </div>

        {notifications.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-400">
            Aucune notification récente.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.slice(0, 3).map((n) => {
              const isMission = n.type === "mission";
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition ${
                    !n.lu ? "bg-orange-50/70 border border-orange-100" : "bg-slate-50/70"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                      isMission
                        ? "bg-amber-100 text-brand-orange"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isMission ? "📱" : "🔔"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy-900 leading-tight text-[11px]">
                      {n.titre}
                    </p>
                    <p className="mt-0.5 text-slate-500 leading-relaxed text-[10px]">
                      {renderMessageWithLinks(n.message)}
                    </p>
                    {n.titre.toLowerCase().includes("acceptée") && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Link
                          href="/dashboard/missions"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
                        >
                          <Play size={9} fill="currentColor" />
                          <span>Lien & Fiche mission</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comment ça marche - Guide express */}
      <div className="rounded-2xl border border-slate-100 bg-navy-950 p-4 text-white shadow-sm">
        <div className="flex items-center gap-1.5 text-brand-orange">
          <Sparkles size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Comment ça marche ?
          </span>
        </div>
        <p className="mt-1.5 text-xs font-semibold text-white">
          3 étapes pour valider vos tests :
        </p>
        <div className="mt-3 flex flex-col gap-2.5 text-[11px] text-white/80">
          <div className="flex items-start gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white">
              1
            </span>
            <span>Rejoignez une mission et acceptez les conditions.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white">
              2
            </span>
            <span>Réalisez le test dans l&apos;application externe.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white">
              3
            </span>
            <span>Entrez la référence sur SAMRE pour valider.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
