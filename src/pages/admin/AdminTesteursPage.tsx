import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "@/lib/router";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Phone,
  Eye,
  X,
  Send,
  Calendar,
  Briefcase,
  UserCheck,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { adminApi, getImageUrl, type User } from "@/lib/api";
import ConfirmModal, { type ConfirmVariant } from "@/components/ui/ConfirmModal";

export default function AdminTesteursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Custom Confirm Modal
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: ConfirmVariant;
    confirmText: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "primary",
    confirmText: "Confirmer",
    onConfirm: async () => {},
  });

  // Profile Modal State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.users();
      setUsers(res || []);
    } catch (err) {
      console.error("Erreur chargement testeurs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  const handleApproveUser = (user: User) => {
    setConfirmConfig({
      isOpen: true,
      title: "Valider le profil testeur",
      message: `Voulez-vous valider officiellement le profil de ${user.prenom} ${user.nom} ? L'utilisateur aura accès aux candidatures de missions.`,
      variant: "success",
      confirmText: "Valider le profil",
      onConfirm: async () => {
        setActionLoadingId(user.id);
        try {
          await adminApi.approveUser(user.id);
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, statut: "actif" } : u))
          );
          if (selectedUser && selectedUser.id === user.id) {
            setSelectedUser({ ...selectedUser, statut: "actif" });
          }
        } catch (err: any) {
          console.error("Erreur validation profil:", err);
        } finally {
          setActionLoadingId(null);
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  const handleToggleSuspend = (user: User) => {
    const isSuspended = user.statut === "suspendu";
    setConfirmConfig({
      isOpen: true,
      title: isSuspended ? "Réactiver le compte" : "Suspendre le compte",
      message: isSuspended
        ? `Voulez-vous réactiver le compte de ${user.prenom} ${user.nom} ?`
        : `Voulez-vous suspendre temporairement le compte de ${user.prenom} ${user.nom} ?`,
      variant: isSuspended ? "success" : "danger",
      confirmText: isSuspended ? "Réactiver" : "Suspendre",
      onConfirm: async () => {
        setActionLoadingId(user.id);
        try {
          if (isSuspended) {
            await adminApi.reactivateUser(user.id);
            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, statut: "actif" } : u))
            );
            if (selectedUser && selectedUser.id === user.id) {
              setSelectedUser({ ...selectedUser, statut: "actif" });
            }
          } else {
            await adminApi.suspendUser(user.id);
            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, statut: "suspendu" } : u))
            );
            if (selectedUser && selectedUser.id === user.id) {
              setSelectedUser({ ...selectedUser, statut: "suspendu" });
            }
          }
        } catch (err) {
          console.error("Erreur suspension:", err);
        } finally {
          setActionLoadingId(null);
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  const filtered = users.filter((u) => {
    const matchesStatus =
      statusFilter === "tous" ||
      (statusFilter === "actif" && (u.statut === "actif" || !u.statut)) ||
      (statusFilter === "en_attente" && u.statut === "en_attente") ||
      (statusFilter === "suspendu" && u.statut === "suspendu");

    const q = search.toLowerCase();
    const matchesSearch =
      (u.nom && u.nom.toLowerCase().includes(q)) ||
      (u.prenom && u.prenom.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.telephone && u.telephone.includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Gestion de la Communauté Testeurs
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
              {users.length} membres
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Consultez les profils, validez les testeurs, surveillez leur progression par journée et gérez les accès aux missions.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 transition shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-brand-orange" : ""} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Bannière Pédagogique du Cycle d'Accréditation */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/80 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-navy-900">
            <Sparkles size={16} className="text-blue-600 shrink-0" />
            <span>Processus d&apos;accréditation SAMRE :</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-medium">
            <span className="rounded-lg bg-white px-2.5 py-1 shadow-xs border border-slate-200">
              1. Inscription
            </span>
            <span className="text-slate-400">→</span>
            <span className="rounded-lg bg-white px-2.5 py-1 shadow-xs border border-slate-200">
              2. Profil renseigné
            </span>
            <span className="text-slate-400">→</span>
            <span className="rounded-lg bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 border border-emerald-200">
              3. Validation par l&apos;Admin ✓
            </span>
            <span className="text-slate-400">→</span>
            <span className="rounded-lg bg-brand-orange/10 text-brand-orange font-bold px-2.5 py-1 border border-brand-orange/20">
              4. Affectation aux missions
            </span>
          </div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-brand-orange focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "tous", label: "Tous les testeurs" },
            { id: "actif", label: "Profils validés (actifs)" },
            { id: "en_attente", label: "En attente de validation" },
            { id: "suspendu", label: "Comptes suspendus" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                statusFilter === f.id
                  ? "bg-navy-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des Testeurs */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange mb-2" />
          <p className="text-xs">Chargement des membres testeurs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
          <Users size={36} className="mx-auto text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-navy-900">Aucun testeur trouvé</h3>
          <p className="mt-1 text-xs text-slate-400">
            {search || statusFilter !== "tous"
              ? "Aucun résultat pour cette recherche."
              : "Aucun testeur n'est encore enregistré sur la plateforme."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Testeur</th>
                  <th className="px-5 py-3.5">Coordonnées</th>
                  <th className="px-5 py-3.5">Statut du Profil</th>
                  <th className="px-5 py-3.5">Missions Actives</th>
                  <th className="px-5 py-3.5">Missions Réussies</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const isActionLoading = actionLoadingId === u.id;
                  const isSuspended = u.statut === "suspendu";
                  const isPending = u.statut === "en_attente";
                  const parts = (u as any).participations || [];

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      {/* Avatar et Nom */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {u.photo ? (
                            <img
                              src={getImageUrl(u.photo)}
                              alt={u.prenom || u.nom || "Testeur"}
                              className="h-9 w-9 shrink-0 rounded-full object-cover border border-slate-200 shadow-2xs"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                              {u.prenom?.[0] || u.nom?.[0] || "T"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-navy-900">
                              {u.prenom} {u.nom}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Inscrit le {(u as any).dateCreation || "Inconnue"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Coordonnées */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail size={12} className="text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                          {u.telephone && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Phone size={11} className="text-slate-400" />
                              <span>{u.telephone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Statut du profil */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isSuspended
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : isPending
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isSuspended ? (
                            <>
                              <ShieldAlert size={11} />
                              Suspendu
                            </>
                          ) : isPending ? (
                            <>
                              <Clock size={11} />
                              En attente de validation
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={11} />
                              Profil Validé
                            </>
                          )}
                        </span>
                      </td>

                      {/* Missions en cours avec jour */}
                      <td className="px-5 py-3.5">
                        {parts.length > 0 ? (
                          <div className="space-y-1">
                            {parts.slice(0, 2).map((p: any) => (
                              <div key={p.id} className="flex items-center gap-1.5">
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-navy-900">
                                  Jour {p.jourActuel}/{p.totalJours}
                                </span>
                                <span className="text-[11px] text-slate-600 truncate max-w-[140px]">
                                  {p.application || p.missionTitre}
                                </span>
                              </div>
                            ))}
                            {parts.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{parts.length - 2} autre(s)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Aucune mission</span>
                        )}
                      </td>

                      {/* Missions Terminées */}
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-emerald-600">
                          {(u as any).missionsTerminees || 0}
                        </span>
                        <span className="text-slate-400 text-[11px]"> validée(s)</span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleApproveUser(u)}
                              disabled={isActionLoading}
                              className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-xs"
                            >
                              Valider le profil
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedUser(u)}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                          >
                            <Eye size={12} />
                            <span>Détails</span>
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(u)}
                            disabled={isActionLoading}
                            className={`rounded-xl border px-2.5 py-1 text-[11px] font-semibold transition ${
                              isSuspended
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                            }`}
                          >
                            {isActionLoading ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : isSuspended ? (
                              "Réactiver"
                            ) : (
                              "Suspendre"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FICHE PROFIL DU TESTEUR - CENTRÉ */}
      {selectedUser && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg my-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Fixe */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
              <div className="flex items-center gap-3">
                {selectedUser.photo ? (
                  <img
                    src={getImageUrl(selectedUser.photo)}
                    alt={selectedUser.prenom || selectedUser.nom || "Testeur"}
                    className="h-12 w-12 rounded-2xl object-cover border border-slate-200 shadow-md shadow-brand-orange/10 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white text-base font-bold shadow-md shadow-brand-orange/20 shrink-0">
                    {selectedUser.prenom?.[0] || selectedUser.nom?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base text-navy-900">
                    {selectedUser.prenom} {selectedUser.nom}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      selectedUser.statut === "suspendu"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : selectedUser.statut === "en_attente"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {selectedUser.statut === "suspendu"
                      ? "Compte suspendu"
                      : selectedUser.statut === "en_attente"
                      ? "En attente de validation profil"
                      : "Profil validé (Actif)"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corps Défilant */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 text-xs">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Informations personnelles
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email :</span>
                  <span className="font-semibold text-navy-900">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Téléphone :</span>
                  <span className="font-semibold text-navy-900">
                    {selectedUser.telephone || "Non renseigné"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Inscrit le :</span>
                  <span className="font-semibold text-navy-900">
                    {(selectedUser as any).dateCreation || "Inconnue"}
                  </span>
                </div>
              </div>

              {/* Missions en cours & Progression */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                    Missions & Progression quotidienne
                  </h4>
                  <Link
                    href="/admin/participations"
                    className="text-[11px] font-bold text-brand-orange hover:underline"
                  >
                    Voir dans le suivi →
                  </Link>
                </div>

                {((selectedUser as any).participations || []).length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {((selectedUser as any).participations || []).map((p: any) => (
                      <div key={p.id} className="py-2 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-navy-900 line-clamp-1">{p.missionTitre}</p>
                          <p className="text-[10px] text-slate-400">{p.application}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Jour {p.jourActuel} / {p.totalJours}
                          </span>
                          <p className="text-[9px] text-slate-400 capitalize mt-0.5">{p.statut}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px] py-1">Aucune mission en cours.</p>
                )}
              </div>

              {/* Raccourci vers Centre de Notifications */}
              <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-900">Envoyer un message direct</p>
                  <p className="text-[11px] text-slate-500">
                    Transmettez une consigne ou une information à ce testeur.
                  </p>
                </div>
                <Link
                  href={`/admin/notifications?user=${selectedUser.id}&name=${encodeURIComponent(
                    `${selectedUser.prenom} ${selectedUser.nom}`
                  )}`}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-orange px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-orange/90 transition shrink-0"
                >
                  <Send size={12} />
                  <span>Écrire</span>
                </Link>
              </div>
            </div>

            {/* Footer Fixe */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                {selectedUser.statut === "en_attente" && (
                  <button
                    type="button"
                    onClick={() => handleApproveUser(selectedUser)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    Valider le profil
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleToggleSuspend(selectedUser)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    selectedUser.statut === "suspendu"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                >
                  {selectedUser.statut === "suspendu" ? "Réactiver le profil" : "Suspendre le profil"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Confirmation Élégant */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        confirmText={confirmConfig.confirmText}
        loading={actionLoadingId !== null}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}
