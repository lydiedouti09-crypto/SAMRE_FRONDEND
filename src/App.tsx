import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import Preloader from "@/components/Preloader";

// Public Pages
import HomePage from "@/pages/HomePage";
import ConnexionPage from "@/pages/ConnexionPage";
import InscriptionPage from "@/pages/InscriptionPage";
import MotDePasseOubliePage from "@/pages/MotDePasseOubliePage";
import DeveloperIntegrationPage from "@/pages/DeveloperIntegrationPage";
import TestWidget from "@/pages/TestWidget";

// Dashboard Pages
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DashboardAdminPage from "@/pages/dashboard/DashboardAdminPage";
import HistoriquePage from "@/pages/dashboard/HistoriquePage";
import MissionsPage from "@/pages/dashboard/MissionsPage";
import MissionDetailPage from "@/pages/dashboard/MissionDetailPage";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import ProfilPage from "@/pages/dashboard/ProfilPage";

// Admin Pages
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminApplicationsPage from "@/pages/admin/AdminApplicationsPage";
import AdminFeedbacksPage from "@/pages/admin/AdminFeedbacksPage";
import AdminMissionsPage from "@/pages/admin/AdminMissionsPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminParticipationsPage from "@/pages/admin/AdminParticipationsPage";
import AdminTesteursPage from "@/pages/admin/AdminTesteursPage";

export default function App() {
  return (
    <AuthProvider>
      <Preloader>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/mot-de-passe-oublie" element={<MotDePasseOubliePage />} />
          <Route path="/integration/:token" element={<DeveloperIntegrationPage />} />
          <Route path="/widget" element={<TestWidget />} />

          {/* Tester Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="admin" element={<DashboardAdminPage />} />
            <Route path="historique" element={<HistoriquePage />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="missions/:id" element={<MissionDetailPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profil" element={<ProfilPage />} />
          </Route>

          {/* Admin Dedicated Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route index element={<AdminOverviewPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="feedbacks" element={<AdminFeedbacksPage />} />
            <Route path="missions" element={<AdminMissionsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="participations" element={<AdminParticipationsPage />} />
            <Route path="testeurs" element={<AdminTesteursPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Preloader>
    </AuthProvider>
  );
}
