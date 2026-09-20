import RevealText from "@/components/RevealText";
import { Building2, Megaphone, Inbox, SearchCheck, CalendarCheck, Users, ArrowRight } from "lucide-react";

const points = [
  { icon: Megaphone, label: "Publier des offres de stage", color: "text-brand-orange", bg: "bg-brand-orange-light" },
  { icon: Megaphone, label: "Publier des offres d'emploi", color: "text-info", bg: "bg-info-light" },
  { icon: Inbox, label: "Recevoir des candidatures", color: "text-success", bg: "bg-success-light" },
  { icon: SearchCheck, label: "Rechercher des profils correspondant à vos besoins", color: "text-warning", bg: "bg-warning-light" },
  { icon: CalendarCheck, label: "Participer à des événements professionnels", color: "text-brand-orange", bg: "bg-brand-orange-light" },
  { icon: Users, label: "Identifier de jeunes talents", color: "text-info", bg: "bg-info-light" },
];

export default function ForCompanies() {
  return (
    <section id="entreprises" className="bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-wrap px-6">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-900/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-700">
            <Building2 size={14} />
            Pour les entreprises
          </div>
          <RevealText as="h2" className="max-w-lg font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Trouvez les talents dont votre
            <br />
            <span className="text-gradient">entreprise a besoin</span>
          </RevealText>
          <p className="mt-4 max-w-xl text-slate-500 leading-relaxed">
            Publiez vos offres, rencontrez des profils qualifiés et contribuez à
            la formation de la nouvelle génération de talents.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon: Icon, label, color, bg }, i) => (
            <div
              key={label + i}
              className="card-hover group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={20} className={color} />
              </span>
              <span className="text-sm font-medium text-navy-900">{label}</span>
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-800 hover:shadow-lg hover:-translate-y-0.5"
        >
          Rejoindre SAMRE en tant qu&apos;entreprise
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
