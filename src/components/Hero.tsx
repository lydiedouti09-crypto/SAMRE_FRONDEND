import FloatingDevices from "@/components/FloatingDevices";
import ParallaxImage from "@/components/ParallaxImage";
import { Award, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-[600px] overflow-hidden lg:min-h-[700px]"
    >
      {/* Parallax background photo */}
      <ParallaxImage src="/smartphone.png" speed={0.1} />

      {/* Overlay gradient — fondu progressif pour intégrer les phones */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-900/50 to-transparent" />
      <div className="absolute inset-0 bg-navy-900/30" />

      <div className="relative z-10 mx-auto max-w-wrap px-6 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Texte — gauche */}
          <div className="max-w-xl animate-fade-in lg:w-[520px] lg:flex-shrink-0">
            <h1 className="max-w-[520px] font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">
              Trouvez votre
              <br />
              opportunité.
              <br />
              <span className="text-brand-orange">
                Construisez votre
                <br />
                avenir.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
              Première plateforme digitale génératrice des opportunités d&apos;emploi pour les jeunes. SAMRE accompagne les étudiants et jeunes professionnels dans leur
              recherche de stage, d&apos;emploi et leur développement professionnel.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#candidats"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5"
              >
                Je suis candidat
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#entreprises"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-navy-900"
              >
                <Award size={16} />
                Je suis une entreprise
              </a>
            </div>
          </div>

          {/* Vidéo 3D — téléphones flottants */}
          <div className="pointer-events-none order-last h-[360px] w-full lg:absolute lg:right-[-10px] lg:top-1/2 lg:order-none lg:block lg:h-auto lg:w-auto lg:-translate-y-1/2 xl:right-2">
            <FloatingDevices />
          </div>
        </div>
      </div>
    </section>
  );
}
