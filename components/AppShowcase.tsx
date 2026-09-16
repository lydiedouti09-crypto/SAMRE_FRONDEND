import Image from "next/image";
import RevealText from "@/components/RevealText";
import { Smartphone, Download, ArrowRight, Check } from "lucide-react";

const features = [
  "Recherchez des offres de stage et d'emploi",
  "Gérez votre profil professionnel",
  "Suivez vos candidatures en temps réel",
  "Participez à des événements",
  "Accédez à des conseils personnalisés",
  "Connectez-vous avec des entreprises",
];

export default function AppShowcase() {
  return (
    <section id="application" className="relative overflow-hidden bg-surface py-20 lg:py-24">
      <div className="mx-auto grid max-w-wrap grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        {/* Phone mockups image */}
        <div className="order-2 flex items-center justify-center lg:order-1">
          <div className="relative w-full max-w-[560px] transition-transform duration-700 hover:scale-[1.02]">
            <Image
              src="/samre2.png"
              alt="Application SAMRE — Écrans mobiles"
              width={1000}
              height={680}
              className="h-auto w-full object-contain drop-shadow-2xl"
              priority={false}
            />
          </div>
        </div>

        {/* Text content */}
        <div className="order-1 lg:order-2">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            <Smartphone size={14} />
            L&apos;application SAMRE
          </div>
          <RevealText as="h2" className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Tout votre parcours dans
            <br />
            <span className="text-gradient">une seule application.</span>
          </RevealText>
          <p className="mt-4 max-w-md text-slate-500 leading-relaxed">
            Recherchez des offres, gérez votre profil, suivez vos candidatures
            et bien plus encore — le tout depuis votre smartphone.
          </p>

          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light">
                  <Check size={12} className="text-success" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-800 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Download size={16} />
              Google Play
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-navy-900 px-6 py-3 text-sm font-semibold text-navy-900 transition-all duration-300 hover:bg-navy-900 hover:text-white"
            >
              <Download size={16} />
              App Store
            </a>
          </div>
        </div>
      </div>

      {/* Background deco */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
    </section>
  );
}
