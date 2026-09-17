import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié — SAMRE",
  description: "Réinitialisez votre mot de passe pour accéder à votre compte SAMRE.",
};

export default function MotDePasseOubliePage() {
  return <AuthForm mode="forgot-password" />;
}
