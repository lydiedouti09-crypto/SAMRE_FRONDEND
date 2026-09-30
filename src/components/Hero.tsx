import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Smartphone, Briefcase, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  const [phoneTilt, setPhoneTilt] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateOffset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollOffset(Math.min(window.scrollY * 0.03, 16));
      });
    };

    window.addEventListener('scroll', updateOffset, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateOffset);
      cancelAnimationFrame(frame);
    };
  }, []);

  const handlePhoneMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPhoneTilt({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 6,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * -6,
    });
  };

  return (
    <section id="hero" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          background: #ffffff;
          background: 
            radial-gradient(ellipse 65% 55% at 85% 42%, rgba(242, 129, 29, 0.12) 0%, transparent 68%),
            radial-gradient(circle at 10% 25%, rgba(10, 28, 56, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 45% 85%, rgba(56, 189, 248, 0.05) 0%, transparent 55%),
            linear-gradient(180deg, #ffffff 0%, #fafafc 100%);
          overflow: hidden;
          padding-top: 3.5rem;
          padding-bottom: 2.5rem;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.75rem;
        }

        /* ─── Disposition 2 Colonnes Harmonieuse (Style Campty) ─── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.12fr 0.88fr;
            gap: 3.5rem;
            align-items: center;
          }
        }

        /* ─── 1. Colonne Gauche : Titre avec Pinceau Orange, Description, Boutons ─── */
        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          position: relative;
          z-index: 3;
          animation: hero-copy-in 0.8s 0.15s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Doodle Ressort / Spirale au-dessus du titre (Style Campty) */
        .hero-doodle-swirl {
          position: absolute;
          top: -2.2rem;
          left: 1rem;
          width: 52px;
          height: 52px;
          pointer-events: none;
          opacity: 0.85;
          animation: hero-swirl-float 4s ease-in-out infinite alternate;
        }

        .hero-title {
          font-family: 'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif;
          font-size: clamp(2.6rem, 4.6vw, 4.2rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #0a1c38;
          margin: 0 0 1.4rem 0;
        }

        /* Conteneur avec soulignement feutre/pinceau orange comme "A Good Way!" sur Campty */
        .hero-brush-wrap {
          position: relative;
          display: inline-block;
          white-space: nowrap;
          color: #0a1c38;
        }

        .hero-brush-svg {
          position: absolute;
          left: -4%;
          bottom: -8px;
          width: 108%;
          height: 16px;
          pointer-events: none;
          z-index: -1;
        }

        .hero-desc {
          font-size: clamp(1rem, 1.22vw, 1.16rem);
          color: #64748b;
          line-height: 1.7;
          margin: 0 0 2.2rem 0;
          max-width: 520px;
          font-weight: 450;
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        /* Bouton Sombre Arrondi Campty */
        .hero-btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #0a1c38;
          color: #ffffff;
          padding: 1rem 2.2rem;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.98rem;
          text-decoration: none;
          box-shadow: 0 12px 28px -4px rgba(10, 28, 56, 0.35);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn-dark:hover {
          transform: translateY(-2px);
          background: #f2811d;
          box-shadow: 0 14px 32px rgba(242, 129, 29, 0.4);
          color: #ffffff;
        }

        /* Bouton Google Play Blanc Épuré */
        .hero-btn-googleplay {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.68rem 1.45rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
        }

        .hero-btn-googleplay:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
          background: #f8fafc;
        }

        /* Micro-badge de réassurance sous les boutons */
        .hero-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.45rem 0.95rem;
          background: rgba(242, 129, 29, 0.08);
          border: 1px solid rgba(242, 129, 29, 0.2);
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #ea580c;
        }

        /* ─── 2. Colonne Droite : L'Image de la Main avec Doodles Flottants Style Campty ─── */
        .hero-video-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          perspective: 1200px;
          animation: hero-phone-in 1s 0.25s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Lueur radiale douce derrière la main */
        .hero-image-aura {
          position: absolute;
          top: 8%;
          right: 2%;
          width: 90%;
          height: 90%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(242, 129, 29, 0.16) 0%, rgba(242, 129, 29, 0.05) 45%, transparent 72%);
          filter: blur(28px);
          pointer-events: none;
          z-index: 0;
        }

        /* Doodles vectoriels flottants autour du smartphone (exactement comme sur Campty) */
        .hero-effect-layer {
          position: absolute;
          inset: -12% -18% -8% -14%;
          width: 132%;
          height: 120%;
          pointer-events: none;
          overflow: visible;
          z-index: 0;
        }

        .hero-doodle-loop {
          fill: none;
          stroke: #38bdf8;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.75;
          animation: hero-doodle-pulse 6s ease-in-out infinite alternate;
        }

        .hero-doodle-orange {
          fill: none;
          stroke: #f2811d;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 6 10;
          opacity: 0.6;
          animation: hero-doodle-dash 10s linear infinite;
        }

        /* Petit nuage décoratif flottant en haut à droite du téléphone comme sur Campty */
        .hero-floating-cloud {
          position: absolute;
          top: 10%;
          right: 4%;
          background: #ffffff;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          box-shadow: 0 10px 25px -4px rgba(10, 28, 56, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.76rem;
          font-weight: 800;
          color: #0a1c38;
          z-index: 3;
          animation: hero-cloud-float 4.2s ease-in-out infinite alternate;
        }

        .hero-video-frame {
          position: relative;
          width: 100%;
          max-width: 440px;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: translate3d(0, var(--phone-scroll, 0px), 0) rotateX(var(--phone-y, 0deg)) rotateY(var(--phone-x, 0deg));
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-image-media {
          width: 100%;
          height: auto;
          max-height: 600px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 20px 35px rgba(10, 28, 56, 0.12));
          animation: hero-image-float 5s ease-in-out infinite alternate;
        }

        /* ─── 3. BANNIÈRE DE STATISTIQUES EN BAS DU HERO (STYLE EXACT DU BANDEAU BLEU CAMPTY) ─── */
        .hero-stats-ribbon {
          width: 100%;
          background: #0a1c38;
          background: linear-gradient(135deg, #0a1c38 0%, #122c54 100%);
          border-radius: 28px;
          padding: 1.8rem 2.5rem;
          color: #ffffff;
          box-shadow: 0 20px 45px -10px rgba(10, 28, 56, 0.25);
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 768px) {
          .hero-stats-ribbon {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            padding: 2.2rem 3rem;
          }
        }

        .hero-stat-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          position: relative;
        }

        @media (min-width: 768px) {
          .hero-stat-item:not(:last-child)::after {
            content: '';
            position: absolute;
            right: -1rem;
            top: 20%;
            height: 60%;
            width: 1px;
            background: rgba(255, 255, 255, 0.15);
          }
        }

        .hero-stat-number {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 2.8vw, 2.8rem);
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 0.15rem;
          letter-spacing: -0.03em;
        }

        .hero-stat-number span.accent {
          color: #f2811d;
        }

        .hero-stat-label {
          font-size: 0.86rem;
          font-weight: 600;
          color: #94a3b8;
          margin-top: 0.4rem;
          line-height: 1.35;
        }

        /* ─── Animations ─── */
        @keyframes hero-copy-in {
  0% {
    opacity: 0;
    transform: translate3d(-55px, 20px, 0);
  }

  70% {
    opacity: 1;
    transform: translate3d(5px, -2px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

        @keyframes hero-phone-in {
  0% {
    opacity: 0;
    transform:
      translate3d(100px, 60px, 0)
      rotate(6deg)
      scale(0.82);
  }

  55% {
    opacity: 1;
    transform:
      translate3d(-8px, -5px, 0)
      rotate(-1deg)
      scale(1.03);
  }

  75% {
    transform:
      translate3d(3px, 2px, 0)
      rotate(0.5deg)
      scale(0.99);
  }

  100% {
    opacity: 1;
    transform:
      translate3d(0, 0, 0)
      rotate(0deg)
      scale(1);
  }
}

        @keyframes hero-image-float {
          from { transform: translateY(0) rotate(-0.5deg); }
          to { transform: translateY(-10px) rotate(0.8deg); }
        }

        @keyframes hero-swirl-float {
          from { transform: translateY(0) rotate(-6deg); }
          to { transform: translateY(-6px) rotate(4deg); }
        }

        @keyframes hero-cloud-float {
          from { transform: translateY(0); }
          to { transform: translateY(-7px); }
        }

        @keyframes hero-doodle-in {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-20deg);
  }

  100% {
    opacity: 0.75;
    transform: scale(1) rotate(0deg);
  }
}  
  @keyframes hero-stage-in {
  0% {
    opacity: 0;
    transform: translateY(35px) scale(0.96);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
  .hero-container {
  animation: hero-stage-in 1s both cubic-bezier(0.16, 1, 0.3, 1);
}
        .hero-effect-layer {
          animation:
            hero-doodle-in 1s 0.45s both
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes hero-doodle-dash {
          to { stroke-dashoffset: -120; }
        }

        @media (max-width: 1023px) {
          .hero-section {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
          .hero-left {
            align-items: center;
            text-align: center;
          }
          .hero-actions-row {
            justify-content: center;
          }
          .hero-desc {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-doodle-swirl {
            display: none;
          }
          .hero-video-frame {
            max-width: 380px;
          }
        }
      `}</style>

      <div className="hero-container">
        <div className="hero-grid">

          {/* ─── 1. COLONNE GAUCHE (TITRE, PINCEAU SOULIGNÉ, BOUTONS) ─── */}
          <div className="hero-left">
            {/* Doodle Ressort / Spirale Style Campty */}
            <svg className="hero-doodle-swirl" viewBox="0 0 54 54" fill="none" aria-hidden="true">
              <path
                d="M10 40C14 22 24 10 34 20C42 28 32 40 24 36C16 32 28 14 46 22"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M44 14L48 21L41 23" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" />
            </svg>

            <h1 className="hero-title">
              Propulsez votre <br />
              Carrière & <br />
              <span className="hero-brush-wrap">
                <span>Validez vos Apps !</span>
                {/* Coup de pinceau / soulignement feutre orange comme sur Campty */}
                <svg className="hero-brush-svg" viewBox="0 0 280 20" fill="none" preserveAspectRatio="none">
                  <path
                    d="M4 14 C65 4, 185 3, 276 9 C195 18, 95 17, 16 17.5"
                    stroke="#f2811d"
                    strokeWidth="4.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="hero-desc">
              Samré connecte les étudiants aux meilleures offres de stage en entreprise, et résout les 14 jours obligatoires de tests Google Play pour les développeurs grâce à un panel réel et rémunéré.
            </p>

            <div className="hero-actions-row">
              <a href="/inscription" className="hero-btn-dark">
                <span>Commencer maintenant</span>
                <ArrowRight size={17} />
              </a>

              {/* Bouton Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.samre.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-googleplay"
                title="Télécharger l'application Samré sur Google Play"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814C3.253 2.19 3 2.793 3 3.593v16.814c0 .8.253 1.403.609 1.779l.092.088 9.42-9.42v-.222L3.701 1.726l-.092.088z" fill="#00D2FF" />
                  <path d="M16.275 15.997l-3.154-3.154v-.222l3.154-3.154.07.04 3.738 2.124c1.068.606 1.068 1.6 0 2.207l-3.738 2.124-.07.035z" fill="#FFD200" />
                  <path d="M16.345 15.962L13.12 12.737 3.609 22.247c.353.376.945.422 1.623.036l11.113-6.321" fill="#FF3A44" />
                  <path d="M16.345 8.038L5.232 1.717c-.678-.386-1.27-.34-1.623.036l9.512 9.51 3.224-3.225" fill="#00E676" />
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
                  <span style={{ fontSize: '8px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                    Télécharger sur
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0a1c38', marginTop: '2px' }}>
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* ─── 2. COLONNE DROITE : SMARTPHONE TENU EN MAIN AVEC DOODLES (STYLE CAMPTY) ─── */}
          <div
            className="hero-video-wrapper"
            onMouseMove={handlePhoneMove}
            onMouseLeave={() => setPhoneTilt({ x: 0, y: 0 })}
          >
            {/* Lueur radiale douce */}
            <div className="hero-image-aura" aria-hidden="true" />

            {/* Doodles vectoriels fins (courbes et étoiles comme sur Campty) */}
            <svg className="hero-effect-layer" viewBox="0 0 620 720" aria-hidden="true">
              {/* Courbe bleue orbitale */}
              <path
                className="hero-doodle-loop"
                d="M40 260 C150 90, 320 80, 480 190 S620 410, 490 530 S240 660, 70 560"
              />
              {/* Trait pointillé orange */}
              <path
                className="hero-doodle-orange"
                d="M95 125 C235 205, 415 125, 545 265 S525 540, 360 640"
              />
              <circle cx="112" cy="180" r="4.5" fill="#f2811d" opacity="0.75" />
              <circle cx="538" cy="245" r="3.5" fill="#38bdf8" opacity="0.8" />
              <circle cx="125" cy="545" r="3" fill="#f2811d" opacity="0.6" />
            </svg>
            <div
              className="hero-video-frame"
              style={{
                '--phone-x': `${phoneTilt.x}deg`,
                '--phone-y': `${phoneTilt.y}deg`,
                '--phone-scroll': `${scrollOffset}px`,
              } as React.CSSProperties}
            >
              <img
                src="/ChatGPT%20Image%2028%20sept.%202026,%2000_26_33.png"
                alt="Application mobile Samré tenue en main"
                className="hero-image-media"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
