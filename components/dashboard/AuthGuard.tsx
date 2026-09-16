"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/connexion");
      } else if (user.role === "admin") {
        // L'administrateur ne doit jamais être affiché comme un testeur dans l'espace testeur
        router.replace("/admin");
      }
    }
  }, [loading, user, router]);

  if (loading || !user || user.role === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <Loader2 size={24} className="animate-spin text-brand-orange" />
      </div>
    );
  }

  return <>{children}</>;
}
