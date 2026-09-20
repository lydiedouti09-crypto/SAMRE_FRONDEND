import RevealText from "@/components/RevealText";
import {
  GraduationCap,
  Search,
  Target,
  FileText,
  Star,
  Globe2,
  Award,
  CalendarDays,
  LineChart,
  ArrowRight,
} from "lucide-react";

const points = [
  { icon: Search, label: "Trouver des stages et emplois", color: "text-info", bg: "bg-info-light" },
  { icon: Target, label: "Recevoir des recommandations adaptées au profil", color: "text-brand-orange", bg: "bg-brand-orange-light" },
  { icon: FileText, label: "Créer et gérer son CV", color: "text-success", bg: "bg-success-light" },
  { icon: Star, label: "Mettre en avant ses compétences", color: "text-warning", bg: "bg-warning-light" },
  { icon: Globe2, label: "Découvrir des opportunités à l'international", color: "text-info", bg: "bg-info-light" },
  { icon: Award, label: "Découvrir des opportunités de bourses", color: "text-brand-orange", bg: "bg-brand-orange-light" },
  { icon: CalendarDays, label: "Participer à des événements professionnels", color: "text-success", bg: "bg-success-light" },
  { icon: LineChart, label: "Suivre son parcours professionnel", color: "text-warning", bg: "bg-warning-light" },
];

export default function ForCandidates() {
  return (
    <section id="candidats" className="bg-white py-20 lg:py-24">
      <div className="mx-auto grid max-w-wrap grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            <GraduationCap size={14} />
            Pour les candidats
          </div>
          <RevealText as="h2" className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Boostez votre parcours
            <br />
            <span className="text-gradient">professionnel</span>
          </RevealText>
          <p className="mt-4 max-w-md text-slate-500 leading-relaxed">
            Trouvez des stages, des emplois et des opportunités qui
            correspondent à votre profil. Développez vos compétences et
            préparez votre avenir.
          </p>

          <a
            href="#telecharger"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-800 hover:shadow-lg hover:-translate-y-0.5"
          >
            Télécharger l&apos;application
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {points.map(({ icon: Icon, label, color, bg }, i) => (
            <div
              key={label}
              className="card-hover flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </span>
              <span className="text-sm font-medium text-navy-900 leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
