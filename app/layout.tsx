import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import Preloader from "@/components/Preloader";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "SAMRE — Connecter les talents aux opportunités",
  description:
    "SAMRE accompagne les étudiants et jeunes professionnels dans leur recherche de stage, d'emploi et leur développement professionnel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${sora.variable} font-sans bg-white`}>
        <AuthProvider>
          <Preloader>{children}</Preloader>
        </AuthProvider>
      </body>
    </html>
  );
}
