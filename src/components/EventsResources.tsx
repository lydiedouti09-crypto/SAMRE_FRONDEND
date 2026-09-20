import Image from "@/components/ui/Image";
import RevealText from "@/components/RevealText";
import { Calendar, MapPin, ArrowRight, BookOpen } from "lucide-react";

const featuredEvents = [
  {
    tag: "Séminaire",
    badgeColor: "bg-brand-orange",
    title: "Forum Emploi & Carrières 2026",
    date: "18 Oct 2026",
    location: "Lomé, Togo",
    image: "/event-seminaire.jpg",
  },
  {
    tag: "Compétition",
    badgeColor: "bg-indigo-600",
    title: "Hackathon Innovation Jeunesse",
    date: "05 Nov 2026",
    location: "Lomé, Togo",
    image: "/event-hackathon.jpg",
  },
  {
    tag: "Networking",
    badgeColor: "bg-emerald-500",
    title: "Soirée Professionnelle SAMRE",
    date: "22 Nov 2026",
    location: "Lomé, Togo",
    image: "/event-networking.jpg",
  },
];

const articles = [
  { title: "Comment décrocher son premier stage ?", tag: "GUIDE" },
  { title: "Comment faire un bon CV ?", tag: "CV" },
  { title: "5 erreurs à éviter pendant un entretien", tag: "ENTRETIEN" },
  { title: "Stratégies pour décrocher un stage international", tag: "STRATÉGIE" },
  { title: "Comment préparer une candidature pour une bourse ?", tag: "BOURSE" },
  { title: "Comment réussir son premier jour en entreprise ?", tag: "CONSEIL" },
];

export default function EventsResources() {
  return (
    <>
      {/* Events Section - Dark theme matching the reference design */}
      <section id="evenements" className="relative overflow-hidden bg-navy-950 py-20 lg:py-24 text-white">
        {/* Subtle ambient lighting glows */}
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-info/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-wrap px-6">
          {/* Header */}
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-block font-display text-xs font-bold uppercase tracking-widest text-brand-orange">
                ÉVÉNEMENTS
              </span>
              <RevealText
                as="h2"
                className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-[2.65rem] leading-tight"
              >
                Agenda des événements
              </RevealText>
            </div>

            <a
              href="#telecharger"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Tous les événements &rarr;
            </a>
          </div>

          {/* 3 Event Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredEvents.map((evt, i) => (
              <div
                key={i}
                className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0d1d33] shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl"
              >
                {/* Image container with floating category badge */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-900">
                  <Image
                    src={evt.image}
                    alt={evt.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle fade to card body */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1d33] via-transparent to-black/30" />

                  {/* Category Badge */}
                  <span
                    className={`absolute left-4 top-4 rounded-full ${evt.badgeColor} px-3.5 py-1 text-xs font-semibold text-white shadow-md`}
                  >
                    {evt.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <h3 className="font-display text-base sm:text-lg font-bold text-white transition-colors duration-300 group-hover:text-brand-orange leading-snug">
                    {evt.title}
                  </h3>

                  <div className="mt-5 flex items-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-sky-400" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-rose-400" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources / Conseils Section */}
      <section id="ressources" className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-wrap px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-info-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-info">
            <BookOpen size={14} />
            Conseils & ressources
          </div>
          <RevealText as="h2" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Conseils & Stratégies
            <br />
            <span className="text-gradient">Internationales</span>
          </RevealText>
          <p className="mt-3 max-w-md text-slate-500">
            Guides d&apos;experts pour réussir votre mobilité professionnelle et vos stages à l&apos;étranger.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {articles.map((a, i) => (
              <a
                key={i}
                href="#"
                className="card-hover group flex items-center justify-between rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="badge badge-orange">{a.tag}</span>
                  <span className="text-sm font-medium text-navy-900">{a.title}</span>
                </div>
                <span className="text-sm font-semibold text-brand-orange opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Lire le guide <ArrowRight size={14} className="inline" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
