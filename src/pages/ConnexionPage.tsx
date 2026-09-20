import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";

export default function ConnexionPage() {
  useEffect(() => {
    document.title = "Connexion & Inscription — SAMRE";
  }, []);

  return <AuthForm mode="login" />;
}
