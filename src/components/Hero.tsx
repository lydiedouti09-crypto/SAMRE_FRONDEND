import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section id="hero" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          /* Couleur officielle SAMRÉ : Orange du logo (#f2811d) illuminé et adouci avec du blanc */
          background: #f2811d;
          background: 
            radial-gradient(ellipse 90% 70% at 20% 15%, rgba(255, 255, 255, 0.38) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 85% 85%, rgba(255, 255, 255, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(255, 243, 230, 0.18) 0%, transparent 70%),
            linear-gradient(145deg, #f79a3e 0%, #f2811d 45%, #ea7312 100%);
          overflow: hidden;
          padding-top: 4.5rem;
          padding-bottom: 5rem;
          border-bottom-left-radius: 44px;
          border-bottom-right-radius: 44px;
          box-shadow: 0 25px 50px -15px rgba(242, 129, 29, 0.35);
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
          }
        }

        /* ─── 1. Colonne Gauche : Titre, Description, Boutons, Badge ─── */
        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hero-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(2.4rem, 4.4vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -0.035em;
          line-height: 1.12;
          color: #ffffff;
          margin: 0 0 1.25rem 0;
          text-shadow: 0 3px 20px rgba(10, 28, 56, 0.18);
        }

        .hero-title-highlight {
          color: #ffffff;
          display: block;
        }

        .hero-desc {
          font-size: clamp(0.98rem, 1.2vw, 1.14rem);
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.68;
          margin: 0 0 2.2rem 0;
          max-width: 540px;
          font-weight: 500;
          text-shadow: 0 1px 8px rgba(10, 28, 56, 0.12);
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          flex-wrap: wrap;
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

        /* Carte Flottante Inférieure Gauche avec panélistes */
        .hero-left-card {
          margin-top: 2.5rem;
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        /* ─── 2. Colonne Droite : Intégration Naturelle de la Vidéo du Smartphone ─── */
        .hero-video-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .hero-video-frame {
          position: relative;
          width: 100%;
          max-width: 440px;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(10, 28, 56, 0.35), 0 10px 25px -5px rgba(0, 0, 0, 0.15);
          border: 4px solid rgba(255, 255, 255, 0.35);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          transition: transform 0.3s ease;
        }

        .hero-video-frame:hover {
          transform: translateY(-4px);
        }

        .hero-video-media {
          width: 100%;
          height: auto;
          max-height: 520px;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 1023px) {
          .hero-section {
            padding-top: 3rem;
            padding-bottom: 3.5rem;
            border-bottom-left-radius: 32px;
            border-bottom-right-radius: 32px;
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
          .hero-left-card {
            margin-top: 1.8rem;
          }
          .hero-video-frame {
            max-width: 380px;
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

            {/* Carte Flottante Inférieure Gauche avec panélistes */}
            <div className="hero-left-card">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#0a1c38] text-white flex items-center justify-center text-xs font-bold">
                  S
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                  Z
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  +
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  12 Panélistes Actifs Requis
                </p>
                <p className="text-[10px] text-white/90 font-medium flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Prêts pour votre application Android
                </p>
              </div>
            </div>
          </div>

          {/* ─── 2. COLONNE DROITE : INTÉGRATION NATURELLE DU SMARTPHONE & VIDÉO ─── */}
          <div className="hero-video-wrapper">
            <div className="hero-video-frame">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="hero-video-media"
              >
                <source src="/hero-showcase.mp4" type="video/mp4" />
                <source src="/non_pas_ça_pa_un_fond_blant_un.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
