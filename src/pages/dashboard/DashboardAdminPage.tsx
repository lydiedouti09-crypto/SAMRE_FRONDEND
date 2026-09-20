import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
    </div>
  );
}
