import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Connexion & Inscription — SAMRE",
  description: "Connectez-vous ou créez votre compte SAMRE pour accéder à toutes vos opportunités professionnelles.",
};

export default function ConnexionPage() {
  return <AuthForm mode="login" />;
}
