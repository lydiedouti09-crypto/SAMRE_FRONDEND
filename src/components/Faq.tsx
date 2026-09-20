import { useState } from "react";
import RevealText from "@/components/RevealText";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "SAMRE est destiné à qui ?",
    a: "Aux étudiants, stagiaires, jeunes professionnels et entreprises souhaitant recruter des talents.",
    color: "border-l-brand-orange",
  },
  {
    q: "Comment trouver un stage ?",
    a: "Créez votre profil sur l'application, renseignez vos compétences et formations, puis parcourez les offres recommandées.",
    color: "border-l-info",
  },
  {
    q: "Comment créer mon profil ?",
    a: "Téléchargez l'application SAMRE et suivez les étapes pour renseigner votre parcours, vos compétences et vos objectifs.",
    color: "border-l-success",
  },
  {
    q: "Les entreprises peuvent-elles publier des offres ?",
    a: "Oui, les entreprises peuvent publier des offres de stage et d'emploi et rechercher des profils correspondant à leurs besoins.",
    color: "border-l-warning",
  },
  {
    q: "Puis-je trouver un stage à l'étranger ?",
    a: "Oui, SAMRE met en avant des stages, programmes et bourses à l'international dans plus de 15 pays.",
    color: "border-l-brand-orange",
  },
  {
    q: "Comment participer aux événements ?",
    a: "Consultez la section Événements de l'application pour vous inscrire aux salons, forums et ateliers professionnels.",
    color: "border-l-info",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-wrap px-6">
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            <HelpCircle size={14} />
            FAQ
          </div>
          <RevealText as="h2" className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Questions <span className="text-gradient">fréquentes</span>
          </RevealText>
          <p className="mt-3 text-slate-500">
            Tout ce que vous devez savoir sur SAMRE
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-xl bg-white shadow-card border-l-4 ${f.color} transition-all duration-300`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-display font-semibold text-navy-900 pr-4">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
