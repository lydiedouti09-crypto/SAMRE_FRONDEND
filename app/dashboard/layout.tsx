import AuthGuard from "@/components/dashboard/AuthGuard";
import BottomNav from "@/components/dashboard/BottomNav";
import DesktopSidebar from "@/components/dashboard/DesktopSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FB] text-slate-800 lg:flex">
        <DesktopSidebar />
        <main className="w-full flex-1 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </AuthGuard>
  );
}