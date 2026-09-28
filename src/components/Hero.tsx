import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const [phoneTilt, setPhoneTilt] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateOffset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollOffset(Math.min(window.scrollY * 0.035, 18));
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
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 5,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
    });
  };

  return (
    <section id="hero" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          background: #fffdf9;
          background: 
            radial-gradient(ellipse 55% 75% at 86% 50%, rgba(255, 235, 210, 0.8) 0%, transparent 68%),
            radial-gradient(ellipse 70% 80% at 8% 20%, rgba(255, 248, 238, 0.95) 0%, transparent 72%),
            linear-gradient(135deg, #ffffff 0%, #fffaf3 100%);
          overflow: hidden;
          padding: 2rem 1.25rem 1rem;
        }

        /* Vagues graphiques légères et blanches en arrière-plan */
        .hero-bg-waves {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.75rem;
        }

        /* ─── Disposition 2 Colonnes Harmonieuse (Texte à gauche / Vidéo à droite) ─── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.15fr 0.95fr;
            gap: 3.5rem;
            transform: translateY(-1.5rem);
          }
        }

        /* ─── 1. Colonne Gauche : Titre, Description, Boutons, Badge ─── */
        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          animation: hero-copy-in 0.8s 0.15s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(2.4rem, 4.4vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -0.035em;
          line-height: 1.12;
          color: #0a1c38;
          margin: 0 0 1.25rem 0;
          animation: hero-copy-item-in 0.7s 0.28s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-title-highlight {
          color: #f2811d;
          display: block;
        }

        .hero-desc {
          font-size: clamp(0.98rem, 1.2vw, 1.14rem);
          color: #475569;
          line-height: 1.68;
          margin: 0 0 2.2rem 0;
          max-width: 540px;
          font-weight: 500;
          animation: hero-copy-item-in 0.7s 0.42s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          flex-wrap: wrap;
          animation: hero-copy-item-in 0.7s 0.56s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #0a1c38;
          color: #ffffff;
          padding: 0.95rem 2rem;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.96rem;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(10, 28, 56, 0.35);
          transition: all 0.25s ease;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .hero-btn-dark:hover {
          transform: translateY(-2px);
          background: #122c54;
          box-shadow: 0 14px 32px rgba(10, 28, 56, 0.45);
          color: #ffffff;
        }

        /* Bouton Google Play en blanc éclatant */
        .hero-btn-googleplay {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #ffffff;
          padding: 0.65rem 1.45rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          transition: all 0.25s ease;
        }

        .hero-btn-googleplay:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
          background: #f8fafc;
        }

        /* ─── 2. Colonne Droite : Intégration Naturelle de la Vidéo du Smartphone ─── */
        .hero-video-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          perspective: 1000px;
          animation: hero-phone-in 1s 0.35s both cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-video-wrapper::before {
          content: '';
          position: absolute;
          width: 72px;
          height: 72px;
          left: 3%;
          top: 19%;
          border: 2px solid rgba(242, 129, 29, 0.32);
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-radius: 50%;
          transform: rotate(-24deg);
          animation: hero-orbit 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .hero-video-wrapper::after {
          content: '';
          position: absolute;
          width: 7px;
          height: 7px;
          top: 13%;
          right: 8%;
          border-radius: 50%;
          background: #f2811d;
          box-shadow: 0 0 0 5px rgba(242, 129, 29, 0.1);
          animation: hero-dot-float 3.5s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }

        .hero-effect-layer {
          position: absolute;
          inset: -8% -16% -4% -10%;
          width: 126%;
          height: 112%;
          pointer-events: none;
          overflow: visible;
          z-index: 0;
        }

        .hero-effect-path {
          fill: none;
          stroke: rgba(242, 129, 29, 0.3);
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-dasharray: 8 12;
          animation: hero-line-draw 8s linear infinite;
        }

        .hero-effect-path.secondary {
          stroke: rgba(15, 55, 98, 0.16);
          stroke-width: 1.5;
          stroke-dasharray: 5 16;
          animation-duration: 11s;
          animation-direction: reverse;
        }

        .hero-effect-star {
          fill: #f2811d;
          opacity: 0.65;
          animation: hero-star-pulse 3s ease-in-out infinite;
        }

        .hero-image-aura {
          position: absolute;
          top: 7%;
          right: 1%;
          width: 82%;
          height: 86%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(242, 129, 29, 0.2) 0%, rgba(242, 129, 29, 0.08) 42%, transparent 72%);
          filter: blur(18px);
          animation: hero-aura-pulse 4.8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes hero-orbit {
          0%, 100% { transform: translate(0, 0) rotate(-24deg); }
          50% { transform: translate(10px, -8px) rotate(12deg); }
        }

        @keyframes hero-dot-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.15); }
        }

        @keyframes hero-line-draw {
          to { stroke-dashoffset: -160; }
        }

        @keyframes hero-star-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }

        @keyframes hero-aura-pulse {
          0%, 100% { opacity: 0.55; transform: scale(0.94); }
          50% { opacity: 1; transform: scale(1.04); }
        }

        .hero-video-frame {
          position: relative;
          width: 100%;
          max-width: 440px;
          z-index: 1;
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          border: 0;
          background: transparent;
          transition: transform 0.3s ease;
          transform: translate3d(0, var(--phone-scroll, 0px), 0) rotateX(var(--phone-y, 0deg)) rotateY(var(--phone-x, 0deg));
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-video-frame:hover {
          filter: drop-shadow(0 12px 18px rgba(10, 28, 56, 0.12));
        }

        .hero-video-media {
          width: 100%;
          height: auto;
          max-height: 520px;
          object-fit: cover;
          display: block;
        }

        .hero-image-media {
          width: 100%;
          height: auto;
          max-height: 580px;
          object-fit: contain;
          display: block;
          animation: hero-image-float 5s ease-in-out infinite alternate;
        }

        @keyframes hero-copy-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hero-copy-item-in {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hero-phone-in {
          from { opacity: 0; transform: translate3d(42px, 32px, 0) rotate(5deg) scale(0.94); }
          to { opacity: 1; transform: translate3d(0, 0, 0) rotate(0) scale(1); }
        }

        @keyframes hero-image-float {
          from { transform: translateY(0) rotate(-1deg); }
          to { transform: translateY(-8px) rotate(1deg); }
        }

        @media (max-width: 1023px) {
          .hero-section {
            padding: 1.25rem 0.75rem 0.75rem;
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
          .hero-video-frame {
            max-width: 380px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image-aura,
          .hero-image-media {
            animation: none;
          }
        }
      `}</style>

      {/* Vagues graphiques d'arrière-plan */}
      <svg className="hero-bg-waves" width="100%" height="100%" viewBox="0 0 1440 900" fill="none">
        <path d="M-100 200 C300 100, 600 400, 1500 150" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
        <path d="M-100 350 C400 250, 700 550, 1500 300" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />
        <path d="M-100 500 C350 400, 800 700, 1500 450" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />
      </svg>

      <div className="hero-container">
        <div className="hero-grid">

          {/* ─── 1. COLONNE GAUCHE (TITRE, DESCRIPTION, BOUTONS, CARTE AVATARS) ─── */}
          <div className="hero-left">
            <h1 className="hero-title">
              Propulsez votre Carrière
              <span className="hero-title-highlight">& Validez vos Apps.</span>
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
                  <path d="M3.609 1.814C3.253 2.19 3 2.793 3 3.593v16.814c0 .8.253 1.403.609 1.779l.092.088 9.42-9.42v-.222L3.701 1.726l-.092.088z" fill="#00D2FF"/>
                  <path d="M16.275 15.997l-3.154-3.154v-.222l3.154-3.154.07.04 3.738 2.124c1.068.606 1.068 1.6 0 2.207l-3.738 2.124-.07.035z" fill="#FFD200"/>
                  <path d="M16.345 15.962L13.12 12.737 3.609 22.247c.353.376.945.422 1.623.036l11.113-6.321" fill="#FF3A44"/>
                  <path d="M16.345 8.038L5.232 1.717c-.678-.386-1.27-.34-1.623.036l9.512 9.51 3.224-3.225" fill="#00E676"/>
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

          {/* ─── 2. COLONNE DROITE : INTÉGRATION NATURELLE DU SMARTPHONE & VIDÉO ─── */}
          <div
            className="hero-video-wrapper"
            onMouseMove={handlePhoneMove}
            onMouseLeave={() => setPhoneTilt({ x: 0, y: 0 })}
          >
            <svg className="hero-effect-layer" viewBox="0 0 620 720" aria-hidden="true">
              <path
                className="hero-effect-path"
                d="M35 235 C140 80, 300 80, 455 180 S610 385, 505 510 S260 650, 80 565"
              />
              <path
                className="hero-effect-path secondary"
                d="M90 110 C220 190, 400 110, 530 250 S520 520, 365 625"
              />
              <circle className="hero-effect-star" cx="104" cy="164" r="4" />
              <circle className="hero-effect-star" cx="526" cy="237" r="3" style={{ animationDelay: '0.8s' }} />
              <circle className="hero-effect-star" cx="118" cy="535" r="3" style={{ animationDelay: '1.4s' }} />
            </svg>
            <div className="hero-image-aura" aria-hidden="true" />
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
                alt="Application mobile Samré affichée sur un smartphone"
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
