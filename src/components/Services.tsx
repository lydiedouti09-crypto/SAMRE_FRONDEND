import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Données Piliers SAMRE ───────────────────────────────────────────────── */
const SAMRE_PILLARS = [
  {
    id: 'stages',
    label: 'Stages & Emplois',
    accent: '#F97316', // Orange SAMRE
    image: '/Investisseuse sur ordinateur.png',
    bigNum: '+500',
    unit: ' offres',
    legend: 'disponibles au Togo, Bénin, Côte d\'Ivoire et dans la sous-région',
    headline: 'Trouvez le stage idéal et démarrez votre carrière en entreprise.',
    description: 'Accédez à des opportunités exclusives auprès d\'entreprises partenaires (banques, startups, télécoms) avec indemnités de stage garanties et postulation en 1 clic.',
    infos: [
      { val: '100% Vérifiées', label: 'entreprises partenaires' },
      { val: '1 Clic', label: 'candidature simplifiée' },
      { val: 'Indemnités', label: 'stages gratifiés' },
    ],
    ctaText: 'Explorer les offres de stage',
    ctaLink: '/inscription',
  },
  {
    id: 'closed-testing',
    label: 'Closed Testing 14J',
    accent: '#38BDF8', // Cyan / Bleu tech
    image: '/samre.jpg',
    bigNum: '14',
    unit: ' jours',
    legend: 'conformité stricte garantie avec les règles Google Play Console',
    headline: '20 testeurs réels certifiés pour valider votre application Android.',
    description: 'Finies les tracasseries et les rejets Google. Nous mobilisons 20 testeurs actifs avec session de 25s/jour, validation par codes uniques horodatés et feedbacks exploitables.',
    infos: [
      { val: '20 Testeurs', label: 'appareils physiques réels' },
      { val: '99.8%', label: 'taux de validation Play Store' },
      { val: 'Automatisé', label: 'suivi jour par jour' },
    ],
    ctaText: 'Lancer un test d\'application',
    ctaLink: '/inscription',
  },
  {
    id: 'missions-remunerees',
    label: 'Missions Rémunérées',
    accent: '#10B981', // Vert émeraude
    image: '/samre2.png',
    bigNum: '100',
    unit: '%',
    legend: 'rémunérées par Mobile Money (T-Money & Flooz)',
    headline: 'Testez des applications mobiles et gagnez de l\'argent chaque jour.',
    description: 'Rejoignez la communauté des panélistes SAMRE. Installez l\'application, testez pendant la durée requise, entrez votre code de validation quotidien et encaissez directement vos gains.',
    infos: [
      { val: 'T-Money & Flooz', label: 'paiements instantanés' },
      { val: '25 sec / jour', label: 'par application testée' },
      { val: '0 F CFA', label: 'adhésion gratuite' },
    ],
    ctaText: 'Devenir testeur rémunéré',
    ctaLink: '/inscription',
  },
  {
    id: 'profil-certifie',
    label: 'Badges & Profil',
    accent: '#F59E0B', // Ambre doré
    image: '/samre4.png',
    bigNum: 'A+',
    unit: ' certifié',
    legend: 'pour valoriser votre rigueur auprès des recruteurs',
    headline: 'Un profil professionnel certifié qui fait la différence.',
    description: 'Chaque mission de test validée et chaque étape réussie améliorent votre score de fiabilité. Décrochez des attestations de stage et des badges d\'excellence vérifiables par QR code.',
    infos: [
      { val: 'QR Code', label: 'attestation infalsifiable' },
      { val: 'Top 5%', label: 'recommandations prioritaires' },
      { val: 'Réseau', label: 'accès direct aux DRH' },
    ],
    ctaText: 'Créer mon profil certifié',
    ctaLink: '/inscription',
  },
] as const;

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const pillar = SAMRE_PILLARS[activeIndex];

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const onScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackH = trackRef.current.offsetHeight;
    const vh = window.innerHeight;
    const raw = -rect.top / (trackH - vh);
    const p = Math.max(0, Math.min(0.9999, raw));
    const newIndex = Math.floor(p * 4);

    setActiveIndex((prev) => {
      if (prev !== newIndex) {
        setContentKey((k) => k + 1);
        if (newIndex > 0) setShowScrollHint(false);
        return newIndex;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const schedule = () => {
      rafRef.current = requestAnimationFrame(() => {
        onScroll();
      });
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  const scrollToSegment = (i: number) => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.offsetTop;
    const trackH = trackRef.current.offsetHeight;
    const vh = window.innerHeight;
    const target = trackTop + ((i + 0.5) / 4) * (trackH - vh);
    window.scrollTo({ top: target, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const shape1Style: React.CSSProperties = {
    position: 'absolute',
    width: 620,
    height: 620,
    borderRadius: '50% 0 50% 50%',
    background: pillar.accent,
    opacity: 0.12,
    top: -180,
    right: -160,
    transition: prefersReduced
      ? 'none'
      : 'background 0.6s ease, transform 0.9s cubic-bezier(.7,0,.2,1)',
    transform: `rotate(${activeIndex * 22}deg) scale(${1 + activeIndex * 0.04})`,
    pointerEvents: 'none',
  };

  const shape2Style: React.CSSProperties = {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '50% 0 50% 50%',
    background: '#F97316',
    opacity: 0.08,
    bottom: -200,
    right: 120,
    transition: prefersReduced ? 'none' : 'transform 0.9s cubic-bezier(.7,0,.2,1)',
    transform: `rotate(${-10 + activeIndex * 18}deg) translateY(${activeIndex * -15}px)`,
    pointerEvents: 'none',
  };

  const contentAnim: React.CSSProperties = prefersReduced
    ? {}
    : {
        animation: 'pillar-enter 0.55s ease forwards',
      };

  return (
    <>
      <style>{`
        @keyframes pillar-enter {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pillar-tab {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
          font-size: clamp(1.8rem, 3.4vw, 2.9rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.18;
          color: rgba(255, 255, 255, 0.28);
          transition: ${prefersReduced ? 'none' : 'color 0.3s, transform 0.3s'};
          transform: translateX(0);
          outline: none;
        }
        .pillar-tab[aria-selected="true"] {
          color: #ffffff;
          transform: translateX(14px);
        }
        .pillar-tab:focus-visible {
          outline: 3px solid var(--pillar-accent, #F97316);
          outline-offset: 4px;
          border-radius: 6px;
        }

        @media (max-width: 820px) {
          .pillar-tab {
            font-size: 1.25rem !important;
            transform: none !important;
            white-space: nowrap !important;
          }
          .pillar-tab[aria-selected="true"] { color: #ffffff !important; }
        }
      `}</style>

      {/* ── Track 400vh ─────────────────────────────────────────────── */}
      <div ref={trackRef} style={{ height: '400vh', position: 'relative' }} id="services">
        {/* ── Sticky panel ────────────────────────────────────────────── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            overflow: 'hidden',
            background: '#0A1C38', // Deep Navy SAMRE
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 'clamp(60px, 8vh, 84px)',
            paddingBottom: 'clamp(1rem, 3vh, 2rem)',
            boxSizing: 'border-box',
            ['--pillar-accent' as string]: pillar.accent,
          }}
        >
          {/* Background image per pillar */}
          {SAMRE_PILLARS.map((p, i) => (
            <img
              key={p.id}
              src={p.image}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: i === activeIndex ? 0.24 : 0,
                transition: prefersReduced ? 'none' : 'opacity 0.9s ease',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          ))}

          {/* Dark gradient overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(to right, #0A1C38 42%, rgba(10,28,56,0.65) 100%)',
                'linear-gradient(to top,   #0A1C38 0%,  rgba(10,28,56,0.0)  55%)',
              ].join(', '),
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Shapes */}
          <div style={shape1Style} aria-hidden="true" />
          <div style={shape2Style} aria-hidden="true" />

          {/* Inner content */}
          <div
            style={{
              width: '100%',
              maxWidth: 1240,
              margin: '0 auto',
              padding: '0 clamp(1.25rem, 4vw, 3rem)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Desktop: 2-col grid | Mobile: 1-col */}
            <div
              className="pillar-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(220px, 28vw, 340px) 1fr',
                gap: 'clamp(2rem, 4vw, 4.5rem)',
                alignItems: 'center',
              }}
            >
              {/* ── LEFT: Tab list ──────────────────────────────────── */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.35)',
                    color: '#FB923C',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '1.25rem',
                  }}
                >
                  <span>Solutions Intégrées</span>
                </div>

                <div
                  role="tablist"
                  aria-label="Piliers SAMRE"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
                  className="pillar-tablist"
                >
                  {SAMRE_PILLARS.map((p, i) => (
                    <button
                      key={p.id}
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-controls="pillar-panel"
                      id={`pillar-tab-${p.id}`}
                      className="pillar-tab"
                      onClick={() => scrollToSegment(i)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Scroll hint */}
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: '0.82rem',
                    color: '#94A3B8',
                    marginTop: '2.5rem',
                    opacity: showScrollHint ? 1 : 0,
                    transition: prefersReduced ? 'none' : 'opacity 0.5s ease',
                    pointerEvents: 'none',
                    letterSpacing: '0.04em',
                  }}
                  className="pillar-hint"
                >
                  Faites défiler pour explorer ↓
                </p>
              </div>

              {/* ── RIGHT: Active content ───────────────────────────── */}
              <div
                id="pillar-panel"
                role="tabpanel"
                aria-labelledby={`pillar-tab-${pillar.id}`}
                aria-live="polite"
                aria-atomic="true"
              >
                <div key={contentKey} style={contentAnim}>
                  {/* Giant number */}
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      fontSize: 'clamp(4.5rem, 11vw, 9.5rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.05em',
                      lineHeight: 0.9,
                      color: pillar.accent,
                      marginBottom: 'clamp(0.3rem, 1vh, 0.6rem)',
                      transition: prefersReduced ? 'none' : 'color 0.4s ease',
                    }}
                  >
                    {pillar.bigNum}
                    <span
                      style={{
                        fontSize: '0.32em',
                        color: '#F8FAFC',
                        letterSpacing: '-0.02em',
                        fontWeight: 700,
                      }}
                    >
                      {pillar.unit}
                    </span>
                  </div>

                  {/* Legend */}
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      fontSize: '0.88rem',
                      color: '#94A3B8',
                      fontWeight: 500,
                      marginBottom: 'clamp(0.8rem, 1.8vh, 1.4rem)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {pillar.legend}
                  </p>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      fontSize: 'clamp(1.35rem, 2.3vw, 2.1rem)',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.025em',
                      lineHeight: 1.25,
                      marginBottom: 'clamp(0.5rem, 1.2vh, 0.85rem)',
                      maxWidth: '38ch',
                    }}
                  >
                    {pillar.headline}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.98rem',
                      color: '#CBD5E1',
                      lineHeight: 1.65,
                      marginBottom: 'clamp(1rem, 2.2vh, 1.8rem)',
                      maxWidth: '46ch',
                    }}
                  >
                    {pillar.description}
                  </p>

                  {/* 3 infos */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                      flexWrap: 'wrap',
                      marginBottom: 'clamp(1.2rem, 2.8vh, 2.2rem)',
                    }}
                  >
                    {pillar.infos.map((info, i) => (
                      <div key={i}>
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                          }}
                        >
                          {info.val}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: '#94A3B8',
                            marginTop: '3px',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {info.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <button
                    type="button"
                    onClick={() => navigate(pillar.ctaLink)}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.9rem 2rem',
                      borderRadius: '999px',
                      background: pillar.accent,
                      color: '#0A1C38',
                      fontWeight: 800,
                      fontSize: '0.98rem',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '-0.01em',
                      boxShadow: `0 8px 24px ${pillar.accent}40`,
                      transition: prefersReduced ? 'none' : 'filter 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!prefersReduced) {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {pillar.ctaText}
                    <span aria-hidden="true" style={{ fontSize: '1.15em', lineHeight: 1 }}>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive styles ─────────────────────────────── */}
      <style>{`
        @media (max-width: 820px) {
          .pillar-grid {
            grid-template-columns: 1fr !important;
            gap: 1.2rem !important;
          }
          .pillar-hint { display: none !important; }
          .pillar-tablist {
            flex-direction: row !important;
            gap: 0.75rem !important;
            overflow-x: auto !important;
            padding-bottom: 0.5rem !important;
            scrollbar-width: none !important;
          }
          .pillar-tablist::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </>
  );
};

export default Services;
