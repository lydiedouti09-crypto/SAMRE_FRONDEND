import { useEffect, useState } from "react";
import Link from "@/lib/router";
import {
  Briefcase,
  Users,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  Smartphone,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  Bell,
  ChevronRight,
  ListTodo,
  UserCheck,
  Coins,
} from "lucide-react";
import { adminApi, type AdminMission, type User } from "@/lib/api";

type AdminStats = {
  chercheurs: number;
  chercheursActifs: number;
  chercheursSuspendus: number;
  missions: number;
  missionsDisponibles: number;
  missionsEnCours: number;
  missionsSuspendues: number;
  missionsTerminees: number;
  missionsArchivees: number;
  participations: number;
  participationsEnAttente: number;
  participationsEnCours: number;
  participationsTerminees: number;
  participationsRetards: number;
  participationsAbandons: number;
  feedbacks: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [missions, setMissions] = useState<AdminMission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, uRes] = await Promise.all([
        adminApi.stats(),
        adminApi.missions(),
        adminApi.users(),
      ]);
      setStats(sRes);
      setMissions(mRes || []);
      setUsers(uRes || []);
    } catch (err) {
      console.error("Erreur chargement données admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-7">
      {/* En-tête Principal SAMRE */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Supervision Générale
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Système opérationnel
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Espace unifié d&apos;administration : gestion des missions, des étapes de test, des candidatures et de la communauté SAMRE.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-navy-900 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-brand-orange" : ""} />
            <span>Actualiser</span>
          </button>
          <Link
            href="/admin/missions?create=true"
            className="flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow-sm shadow-brand-orange/25 hover:bg-orange-600 transition"
          >
            <PlusCircle size={15} />
            <span>Nouvelle Mission</span>
          </Link>
        </div>
      </div>

      {/* Alertes d'actions prioritaires */}
      {stats && (stats.participationsEnAttente > 0 || stats.participationsRetards > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.participationsEnAttente > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    {stats.participationsEnAttente} candidature{stats.participationsEnAttente > 1 ? "s" : ""} en attente de décision
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Des testeurs souhaitent participer aux missions et attendent votre validation.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/participations"
                className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition"
              >
                <span>Examiner</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {stats.participationsRetards > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    {stats.participationsRetards} testeur{stats.participationsRetards > 1 ? "s" : ""} en retard
                  </h4>
                  <p className="text-[11px] text-rose-700">
                    Certains participants n&apos;ont pas validé leurs étapes de test dans les délais prévus.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/participations"
                className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition"
              >
                <span>Voir les retards</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Cartes Métriques Clés SAMRE */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Missions */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:border-slate-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Missions Créées
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand-orange">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-navy-900">
              {stats ? stats.missions : missions.length}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {stats?.missionsDisponibles ?? 0} ouvertes
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{stats?.missionsEnCours ?? 0} en cours</span>
            <span>•</span>
            <span>{stats?.missionsTerminees ?? 0} terminées</span>
          </div>
        </div>

        {/* Testeurs */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:border-slate-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Testeurs Inscrits
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-navy-900">
              {stats ? stats.chercheurs : users.length}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {stats?.chercheursActifs ?? 0} actifs
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-600 font-medium">Profils vérifiés</span>
            <span>{stats?.chercheursSuspendus ?? 0} suspendu(s)</span>
          </div>
        </div>

        {/* Participations */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:border-slate-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Candidatures & Tests
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Layers size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-navy-900">
              {stats?.participations ?? 0}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {stats?.participationsEnCours ?? 0} en cours
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-amber-600 font-medium">{stats?.participationsEnAttente ?? 0} en attente</span>
            <span>•</span>
            <span className="text-emerald-600">{stats?.participationsTerminees ?? 0} validées</span>
          </div>
        </div>

        {/* Feedbacks */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:border-slate-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Feedbacks Reçus
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-navy-900">
              {stats?.feedbacks ?? 0}
            </span>
            <span className="text-xs font-bold text-purple-600">avis déposés</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Rapports d&apos;expérience</span>
            <Link href="/admin/feedbacks" className="text-brand-orange hover:underline font-semibold">
              Consulter →
            </Link>
          </div>
        </div>
      </div>

      {/* Raccourcis Modules d'Administration */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Modules d&apos;administration dédiés
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Link
            href="/admin/missions"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-brand-orange/40 hover:shadow-md transition"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-brand-orange group-hover:scale-105 transition">
                <ListTodo size={20} />
              </div>
              <h4 className="mt-3 text-xs font-bold text-navy-900 group-hover:text-brand-orange transition">
                Missions & Programme
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                Créer des missions Android, structurer le protocole de 12 jours et configurer les codes.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-brand-orange pt-2 border-t border-slate-50">
              <span>Gérer ({stats?.missions ?? missions.length})</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/admin/participations"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition">
                <FileCheck size={20} />
              </div>
              <h4 className="mt-3 text-xs font-bold text-navy-900 group-hover:text-emerald-600 transition">
                Candidatures & Suivi
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                Valider les testeurs, suivre les 12 étapes et inspecter les synchronisations en direct.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-emerald-600 pt-2 border-t border-slate-50">
              <span>{stats?.participationsEnAttente ?? 0} en attente</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/admin/testeurs"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-blue-300 hover:shadow-md transition"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition">
                <UserCheck size={20} />
              </div>
              <h4 className="mt-3 text-xs font-bold text-navy-900 group-hover:text-blue-600 transition">
                Gestion des Testeurs
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                Profils de la communauté, coordonnées, assiduité et historique.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-blue-600 pt-2 border-t border-slate-50">
              <span>{stats?.chercheurs ?? users.length} membres</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/admin/feedbacks"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-purple-300 hover:shadow-md transition"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition">
                <MessageSquare size={20} />
              </div>
              <h4 className="mt-3 text-xs font-bold text-navy-900 group-hover:text-purple-600 transition">
                Feedbacks des Tests
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                Notes étoiles, bugs signalés et suggestions d&apos;amélioration.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-purple-600 pt-2 border-t border-slate-50">
              <span>{stats?.feedbacks ?? 0} avis</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* Grille : Dernières missions & Derniers testeurs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Missions Récentes */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Missions récentes</h3>
              <p className="text-xs text-slate-400">Dernières applications configurées</p>
            </div>
            <Link
              href="/admin/missions"
              className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {missions.slice(0, 4).map((m) => {
              const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
              const logoUrl = m.image
                ? m.image.startsWith("http")
                  ? m.image
                  : `${apiBase}${m.image}`
                : null;

              return (
                <div key={m.id} className="flex items-center justify-between py-3 hover:bg-slate-50/50 px-2 rounded-xl transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 font-bold border border-slate-100 overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt={m.application} className="h-full w-full object-cover" />
                      ) : (
                        <Smartphone size={18} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-navy-900 truncate">{m.titre}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-500">{m.application}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-brand-orange font-bold">
                          <Coins size={11} className="text-brand-orange" />
                          {m.remuneration ? `${m.remuneration} FCFA` : "Bénévole"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        m.statut === "disponible"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : m.statut === "en_cours"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {m.statut}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {m.nombreEtapes} étapes · {m.nombreParticipants} inscrits
                    </p>
                  </div>
                </div>
              );
            })}

            {missions.length === 0 && !loading && (
              <div className="py-8 text-center text-xs text-slate-400">
                Aucune mission configurée pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Derniers Testeurs Inscrits */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Testeurs récents</h3>
              <p className="text-xs text-slate-400">Membres de la communauté de test</p>
            </div>
            <Link
              href="/admin/testeurs"
              className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {users.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3 hover:bg-slate-50/50 px-2 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-xs font-bold text-brand-orange">
                    {u.prenom?.[0] || u.nom?.[0] || "T"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">
                      {u.prenom} {u.nom}
                    </h4>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      u.statut === "actif"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {u.statut || "actif"}
                  </span>
                </div>
              </div>
            ))}

            {users.length === 0 && !loading && (
              <div className="py-8 text-center text-xs text-slate-400">
                Aucun testeur enregistré pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
