import AuthGuard from "@/components/dashboard/AuthGuard";
import BottomNav from "@/components/dashboard/BottomNav";
import DesktopSidebar from "@/components/dashboard/DesktopSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Link, { usePathname } from "@/lib/router";

export default function DashboardLayout() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/dashboard/missions")) return "Missions de Test";
    if (pathname.includes("/dashboard/historique")) return "Historique des Tests";
    if (pathname.includes("/dashboard/notifications")) return "Notifications";
    if (pathname.includes("/dashboard/profil")) return "Mon Profil";
    return "Tableau de Bord";
  };

  const userInitials =
    ((user?.prenom?.[0] || "") + (user?.nom?.[0] || "")).toUpperCase() || "PA";
  const userDisplayName =
    [user?.prenom, user?.nom].filter(Boolean).join(" ") || "Testeur Samré";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F4F7FC] text-slate-800 lg:flex">
        {/* Trait Vertical : Barre latérale SAMRE */}
        <DesktopSidebar />

        {/* Zone Principale avec Trait Horizontal de Navigation */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Trait Horizontal : Barre supérieure épurée */}
          <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-slate-200/90 bg-white px-6 shadow-2xs lg:flex">
            {/* Titre de section à gauche */}
            <div className="flex items-center gap-3">
              <h2 className="font-display text-sm font-bold tracking-tight text-navy-900">
                {getPageTitle()}
              </h2>
            </div>

            {/* Profil utilisateur à droite avec photo de profil */}
            <Link
              href="/dashboard/profil"
              className="flex items-center gap-3 group hover:opacity-95 transition"
              title="Accéder à mon profil"
            >
              <div className="text-right">
                <p className="text-xs font-bold text-navy-900 leading-tight group-hover:text-brand-orange transition">
                  {userDisplayName}
                </p>
              </div>
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={userDisplayName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-orange/30 shadow-xs group-hover:ring-brand-orange transition"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-xs font-black text-white shadow-xs ring-2 ring-brand-orange/20">
                  {userInitials}
                </div>
              )}
            </Link>
          </header>

          {/* Contenu principal */}
          <main className="w-full flex-1 pb-24 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomNav />
    </AuthGuard>
  );
}
