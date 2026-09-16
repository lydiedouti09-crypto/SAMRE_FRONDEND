import Image from "next/image";
import RevealText from "@/components/RevealText";

export default function About() {
  return (
    <section id="apropos" className="relative overflow-hidden bg-navy-950 py-20 lg:py-28 text-white">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-info/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-wrap px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-6">
            <span className="mb-3 inline-block font-display text-xs font-bold uppercase tracking-widest text-brand-orange">
              À PROPOS
            </span>

            <RevealText
              as="h2"
              className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.65rem]"
            >
              Une startup togolaise
              <br />
              au service de la jeunesse
            </RevealText>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              <p>
                SAMRE est une startup opérant dans les domaines du travail, de l&apos;emploi et de
                l&apos;insertion professionnelle. Nos activités incluent la gestion des ressources
                humaines, le recrutement, la communication et le placement étudiant.
              </p>
              <p>
                Nous travaillons sur les problèmes des entreprises et connectons ces défis avec des
                étudiants selon leurs parcours académiques, créant une synergie unique entre les
                talents émergents et les besoins du marché.
              </p>
            </div>

            {/* Bottom 3 pillars */}
            <div className="mt-10 flex flex-wrap items-start gap-8 sm:gap-12 border-t border-white/10 pt-8">
              <div>
                <p className="font-display text-xl font-bold text-brand-orange sm:text-2xl">
                  Startup
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  TOGOLAISE
                </p>
              </div>

              <div>
                <p className="font-display text-xl font-bold text-brand-orange sm:text-2xl">
                  Emploi
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  NOTRE DOMAINE
                </p>
              </div>

              <div>
                <p className="font-display text-xl font-bold text-brand-orange sm:text-2xl">
                  Jeunesse
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  NOTRE CŒUR
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Image with floating 2020 badge */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Photo Card */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl sm:aspect-[16/11]">
                <Image
                  src="/a-propos.jpg"
                  alt="Jeune professionnel togolais SAMRE"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  priority={false}
                />
              </div>

              {/* Floating Orange Badge "2020 - Fondée à Lomé, Togo" */}
              <div className="absolute -bottom-5 right-2 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-orange-dark px-6 py-4 shadow-xl shadow-brand-orange/30 sm:-bottom-6 sm:right-6 sm:px-8 sm:py-5">
                <p className="font-display text-3xl font-extrabold text-white sm:text-4xl leading-none">
                  2020
                </p>
                <p className="mt-1 text-xs font-medium text-white/90 sm:text-sm">
                  Fondée à Lomé, Togo
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
