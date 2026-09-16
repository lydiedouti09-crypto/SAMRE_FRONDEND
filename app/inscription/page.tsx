import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Inscription — SAMRE",
  description: "Créez votre compte SAMRE et découvrez toutes les opportunités de stages et d'emplois.",
};

export default function InscriptionPage() {
  return <AuthForm mode="signup" />;
}
