import Image from "next/image";
import { Instagram, Twitter, Facebook, Linkedin, Youtube, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Candidats", href: "#candidats" },
  { label: "Entreprises", href: "#entreprises" },
  { label: "Événements", href: "#evenements" },
];

const resources = [
  { label: "Conseils & guides", href: "#ressources" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: Facebook, label: "Facebook" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 pt-16 text-slate-300">
      <div className="mx-auto max-w-wrap px-6">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
              <Image src="/logo.png" alt="SAMRE Logo" width={32} height={32} className="object-contain" />
              <span>SAMRE</span>
            </div>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Connecter les talents aux opportunités professionnelles en Afrique et dans le monde.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-all duration-200 hover:bg-brand-orange/20 hover:text-brand-orange"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Liens rapides
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm transition-colors hover:text-brand-orange">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ressources
            </h4>
            <ul className="space-y-2.5">
              {resources.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm transition-colors hover:text-brand-orange">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Newsletter
            </h4>
            <p className="mb-3 text-sm text-slate-400">
              Recevez nos dernières opportunités et conseils.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orange-dark px-3.5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-brand-orange/20"
                aria-label="S'abonner"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <span>© 2026 SAMRE. Tous droits réservés.</span>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-brand-orange">
              Conditions d&apos;utilisation
            </a>
            <a href="#" className="transition hover:text-brand-orange">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
