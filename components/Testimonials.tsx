"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import RevealText from "@/components/RevealText";

const TESTIMONIALS = [
  {
    quote:
      "SAMRE m'a permis de décrocher mon premier stage dans une entreprise internationale. L'accompagnement était exceptionnel et le suivi très professionnel.",
    name: "Kossiwa A.",
    role: "Étudiante en Finance, Université de Lomé",
  },
  {
    quote:
      "Grâce à SAMRE, j'ai trouvé une opportunité qui correspond parfaitement à ma formation. La plateforme est intuitive et les opportunités sont réelles et accessibles.",
    name: "Kodjo M.",
    role: "Ingénieur Informatique",
  },
  {
    quote:
      "J'ai participé à plusieurs séminaires via SAMRE. Ces événements m'ont permis d'élargir mon réseau professionnel de manière significative en très peu de temps.",
    name: "Amédé T.",
    role: "Jeune Entrepreneur",
  },
];

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      tabIndex={0}
      className="mx-3 flex w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-brand-orange/40 sm:w-[400px]"
    >
      <p className="text-sm leading-relaxed text-slate-600">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="font-display text-sm font-semibold text-navy-900">
          {t.name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    try {
      // Track has duplicate list; translate exactly -50% for a seamless infinite marquee
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: "none",
        repeat: -1,
      });

      tweenRef.current = tween;

      return () => {
        tween.kill();
      };
    } catch (_) {
      // Degrade gracefully if GSAP fails
    }
  }, []);

  const pause = () => {
    try {
      tweenRef.current?.pause();
    } catch (_) {}
  };

  const resume = () => {
    try {
      tweenRef.current?.resume();
    } catch (_) {}
  };

  return (
    <section className="overflow-hidden bg-mist py-20 lg:py-24">
      <div className="mx-auto max-w-wrap px-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
          Témoignages
        </div>
        <RevealText
          as="h2"
          className="font-display text-3xl font-bold text-navy-900 sm:text-4xl"
        >
          Ce qu&apos;ils disent de SAMRE
        </RevealText>
      </div>

      <div
        className="mt-12 flex w-max will-change-transform select-none"
        ref={trackRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </section>
  );
}
