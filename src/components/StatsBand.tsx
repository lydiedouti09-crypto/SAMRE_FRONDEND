import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: '10', label: 'Agences partenaires' },
  { value: '1K+', label: 'Talents accompagnés' },
  { value: '8K', label: 'Tests réalisés' },
  { value: '4.2', label: 'Satisfaction moyenne' },
];

export default function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`stats-band ${isVisible ? 'is-visible' : ''}`} aria-label="Chiffres clés Samré">
      <style>{`
        .stats-band {
          position: relative;
          z-index: 3;
          margin: -1.5rem auto -112px;
          max-width: 1180px;
          padding: 2.5rem 2rem;
          color: #ffffff;
          background: linear-gradient(135deg, #0a1c38 0%, #123762 100%);
          border-radius: 24px;
          box-shadow: 0 24px 50px rgba(10, 28, 56, 0.2);
          opacity: 0;
          transform: translateY(32px);
          clip-path: inset(100% 0 0 0 round 24px);
          transition: opacity 0.85s ease, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stats-band.is-visible {
          opacity: 1;
          transform: translateY(0);
          clip-path: inset(0 0 0 0 round 24px);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .stats-item {
          padding: 0.5rem 1.25rem;
          text-align: center;
          border-right: 1px solid rgba(255, 255, 255, 0.16);
        }
        .stats-item:last-child { border-right: 0; }
        .stats-value { display: block; color: #ffffff; font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; line-height: 1; }
        .stats-label { display: block; margin-top: 0.65rem; color: rgba(255,255,255,0.7); font-size: 0.78rem; font-weight: 600; }
        @media (max-width: 700px) {
          .stats-band { margin: -0.75rem 0.75rem -88px; padding: 1.5rem 0.75rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); row-gap: 1rem; }
          .stats-item:nth-child(2) { border-right: 0; }
          .stats-item:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,0.16); padding-bottom: 1rem; }
        }
      `}</style>
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div className="stats-item" key={stat.label}>
            <span className="stats-value">{stat.value}</span>
            <span className="stats-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}