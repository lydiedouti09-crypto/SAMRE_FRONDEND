import RevealText from "@/components/RevealText";
import ParallaxImage from "@/components/ParallaxImage";
import { Globe2, Plane, Repeat, MessageSquareText, FileEdit, GraduationCap, ArrowRight, MapPin } from "lucide-react";

const points = [
  { icon: Plane, label: "Stages à l'étranger", color: "text-info", bg: "bg-info-light" },
  { icon: Globe2, label: "Programmes internationaux", color: "text-success", bg: "bg-success-light" },
  { icon: Repeat, label: "Possibilités de mobilité", color: "text-brand-orange", bg: "bg-brand-orange-light" },
  { icon: MessageSquareText, label: "Conseils pour candidater à l'étranger", color: "text-warning", bg: "bg-warning-light" },
  { icon: FileEdit, label: "Préparation du CV et des entretiens", color: "text-info", bg: "bg-info-light" },
  { icon: GraduationCap, label: "Informations sur les bourses", color: "text-success", bg: "bg-success-light" },
];

const countries = ["France", "Canada", "Maroc", "Sénégal", "Côte d'Ivoire", "Belgique", "Allemagne", "USA"];

export default function International() {
  return (
    <section id="international" className="relative overflow-hidden bg-navy-950 py-20 lg:py-24 text-white">
      {/* Subtle parallax photography in the background */}
      <ParallaxImage src="/samre.jpg" speed={0.15} className="opacity-10 pointer-events-none mix-blend-luminosity" />

      <div className="relative z-10 mx-auto grid max-w-wrap grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            <Globe2 size={14} />
            Opportunités internationales
          </div>
          <RevealText as="h2" className="font-display text-3xl font-bold sm:text-4xl">
            Et si votre prochain stage
            <br />
            était à <span className="text-brand-orange">l&apos;international</span> ?
          </RevealText>
          <p className="mt-4 max-w-md text-slate-300 leading-relaxed">
            Explorez des opportunités de stage dans le monde entier et donnez
            une nouvelle dimension à votre parcours.
          </p>

          {/* Countries chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {countries.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-brand-orange/50 hover:bg-brand-orange/10 hover:text-brand-orange cursor-pointer"
              >
                <MapPin size={10} />
                {c}
              </span>
            ))}
          </div>

          <a
            href="#ressources"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5"
          >
            Découvrir les opportunités
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {points.map(({ icon: Icon, label, color, bg }, i) => (
            <div
              key={label}
              className="card-hover group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </span>
              <span className="text-sm text-slate-200 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-48 w-48 rounded-full bg-info/10 blur-3xl" />
    </section>
  );
}
