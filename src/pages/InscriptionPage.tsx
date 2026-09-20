import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";

export default function InscriptionPage() {
  useEffect(() => {
    document.title = "Inscription — SAMRE";
  }, []);

  return <AuthForm mode="signup" />;
}
