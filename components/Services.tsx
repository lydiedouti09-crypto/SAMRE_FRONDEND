import { BarChart3, Star, Globe2, MessageSquare, ArrowRight, Zap } from "lucide-react";

const services = [
  {
    icon: BarChart3,
    title: "Sondages",
    desc: "Donnez votre avis",
    badge: "AVIS",
    badgeColor: "badge-blue",
    iconBg: "bg-info-light",
    iconColor: "text-info",
  },
  {
    icon: Star,
    title: "Demande spéciale",
    desc: "Assistance sur mesure",
    badge: "VIP",
    badgeColor: "badge-orange",
    iconBg: "bg-brand-orange-light",
    iconColor: "text-brand-orange",
  },
  {
    icon: Globe2,
    title: "Stage international",
    desc: "Opportunités monde",
    badge: "GLOBAL",
    badgeColor: "badge-green",
    iconBg: "bg-success-light",
    iconColor: "text-success",
  },
  {
    icon: MessageSquare,
    title: "Suivi de stage",
    desc: "Progression & étapes",
    badge: "STAGE",
    badgeColor: "badge-orange",
    iconBg: "bg-brand-orange-light",
    iconColor: "text-brand-orange",
  },
];

export default function Services() {
  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-wrap px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-orange">
              <Zap size={14} />
              Accès rapide
            </div>
            <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Services & Démarches
            </h2>
          </div>
          <a
            href="#candidats"
            className="hidden items-center gap-1.5 rounded-full bg-brand-orange-light px-4 py-2 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-white sm:inline-flex"
          >
            <Zap size={14} />
            Accès rapide
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, desc, badge, badgeColor, iconBg, iconColor }, i) => (
            <div
              key={title}
              className="card-hover group cursor-pointer rounded-2xl bg-white p-6 shadow-card"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-3 ${iconBg}`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <span className={`badge ${badgeColor}`}>{badge}</span>
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-navy-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-orange opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                En savoir plus <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
