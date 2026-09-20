import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";

export default function MotDePasseOubliePage() {
  useEffect(() => {
    document.title = "Mot de passe oublié — SAMRE";
  }, []);

  return <AuthForm mode="forgot-password" />;
}
