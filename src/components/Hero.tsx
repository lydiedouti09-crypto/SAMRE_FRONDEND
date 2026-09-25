import React, { useRef, useEffect, useState } from 'react';
import Link from '@/lib/router';
import { ArrowRight, Sparkles, Smartphone, Briefcase, Play, Pause, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="hero" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          background: #ffffff;
          overflow: hidden;
          min-height: calc(100vh - 84px);
          display: flex;
          align-items: center;
          padding: 3rem 0;
        }

        /* Halo d'ambiance doux aux couleurs de SAMRE (Orange & Bleu) */
        .hero-ambient-glow {
          position: absolute;
          top: -120px;
          right: -80px;
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(56, 189, 248, 0.08) 50%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 3.5rem;
        }

        /* ─── Colonne Gauche : Titres, Badges & Actions ─── */
        .hero-content {
          max-width: 640px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1.15rem;
          border-radius: 9999px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
          font-weight: 700;
          font-size: 0.84rem;
          margin-bottom: 1.35rem;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
        }

        .hero-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(2.3rem, 4.4vw, 3.9rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.12;
          color: #0a1c38;
          margin: 0 0 1.25rem 0;
        }

        .hero-title .highlight-orange {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: clamp(0.98rem, 1.25vw, 1.12rem);
          color: #334155;
          line-height: 1.7;
          margin: 0 0 2rem 0;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.25rem;
        }

        /* Bouton Google Play Store */
        .hero-btn-googleplay {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          padding: 0.6rem 1.35rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          transition: all 0.25s ease;
        }

        .hero-btn-googleplay:hover {
          border-color: #f97316;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.18);
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.9rem 1.8rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          justify-content: center;
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(249, 115, 22, 0.45);
          color: #ffffff;
        }

        .hero-btn-secondary {
          background: #ffffff;
          color: #0a1c38;
          border: 1.5px solid #0a1c38;
          box-shadow: 0 2px 8px rgba(10, 28, 56, 0.08);
        }

        .hero-btn-secondary:hover {
          background: #f8fafc;
          border-color: #f97316;
          color: #f97316;
          transform: translateY(-2px);
        }

        /* Grille des chiffres de réassurance */
        .hero-reassurance-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          max-width: 580px;
        }

        .hero-reassurance-item {
          display: flex;
          flex-direction: column;
        }

        .hero-reassurance-num {
          font-family: 'Outfit', sans-serif;
          font-size: 1.45rem;
          font-weight: 900;
          color: #0a1c38;
          line-height: 1.1;
        }

        .hero-reassurance-label {
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 0.25rem;
          line-height: 1.3;
        }

        /* ─── Colonne Droite : Showcase Vidéo 3D ─── */
        .hero-video-showcase {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-video-card {
          position: relative;
          width: 100%;
          max-width: 540px;
          aspect-ratio: 16 / 10;
          border-radius: 28px;
          overflow: hidden;
          background: #000000;
          box-shadow: 
            0 24px 50px -12px rgba(10, 28, 56, 0.22),
            0 0 0 1px rgba(226, 232, 240, 0.8),
            0 0 45px rgba(249, 115, 22, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .hero-video-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 32px 64px -16px rgba(10, 28, 56, 0.28),
            0 0 0 1px rgba(249, 115, 22, 0.4),
            0 0 60px rgba(249, 115, 22, 0.2);
        }

        .hero-video-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Badge Flottant Haut-Gauche : En direct */
        .video-float-badge-top {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(12px);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }

        /* Badge Flottant Bas-Droit : Conformité Google Play */
        .video-float-badge-bottom {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          color: #0a1c38;
          font-size: 0.74rem;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        /* Bouton Play/Pause discret */
        .video-control-btn {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 10;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0.85;
        }

        .video-control-btn:hover {
          opacity: 1;
          background: #f97316;
          border-color: #f97316;
          transform: scale(1.08);
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .hero-content {
            max-width: 100%;
          }
          .hero-video-card {
            max-width: 100%;
            aspect-ratio: 16 / 9;
          }
        }

        @media (max-width: 640px) {
          .hero-reassurance-grid {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-btn, .hero-btn-googleplay {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* Halo d'ambiance */}
      <div className="hero-ambient-glow" />

      <div className="hero-container">
        <div className="hero-grid">
          {/* Colonne Gauche : Contenu textuel et appels à l'action */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} color="#ea580c" />
              <span>N°1 de l'insertion professionnelle & du test mobile en Afrique</span>
            </div>

            <h1 className="hero-title">
              Propulsez votre <span className="highlight-orange">Carrière</span> et Validez vos <span className="highlight-orange">Applications</span>.
            </h1>

            <p className="hero-desc">
              Samré est la plateforme tout-en-un qui connecte les étudiants aux meilleures offres de stage en entreprise, et résout les 14 jours obligatoires de tests Google Play pour les développeurs grâce à un panel réel et rémunéré.
            </p>

            <div className="hero-actions">
              {/* Bouton Télécharger sur Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.samre.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-googleplay"
                title="Télécharger l'application Samré sur Google Play"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814C3.253 2.19 3 2.793 3 3.593v16.814c0 .8.253 1.403.609 1.779l.092.088 9.42-9.42v-.222L3.701 1.726l-.092.088z" fill="#00D2FF"/>
                  <path d="M16.275 15.997l-3.154-3.154v-.222l3.154-3.154.07.04 3.738 2.124c1.068.606 1.068 1.6 0 2.207l-3.738 2.124-.07.035z" fill="#FFD200"/>
                  <path d="M16.345 15.962L13.12 12.737 3.609 22.247c.353.376.945.422 1.623.036l11.113-6.321" fill="#FF3A44"/>
                  <path d="M16.345 8.038L5.232 1.717c-.678-.386-1.27-.34-1.623.036l9.512 9.51 3.224-3.225" fill="#00E676"/>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                    Télécharger sur
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0a1c38', marginTop: '2px' }}>
                    Google Play
                  </span>
                </div>
              </a>

              {/* Bouton Découvrir les stages & services */}
              <a href="#services" className="hero-btn hero-btn-primary">
                <Briefcase size={18} />
                <span>Découvrir les stages</span>
                <ArrowRight size={16} />
              </a>

              {/* Bouton Espace Testeurs & Développeurs */}
              <Link href="/connexion" className="hero-btn hero-btn-secondary">
                <Smartphone size={18} />
                <span>Espace Testeurs</span>
              </Link>
            </div>

            <div className="hero-reassurance-grid">
              <div className="hero-reassurance-item">
                <span className="hero-reassurance-num">+500</span>
                <span className="hero-reassurance-label">Entreprises & Startups partenaires</span>
              </div>

              <div className="hero-reassurance-item">
                <span className="hero-reassurance-num" style={{ color: '#10b981' }}>99.8%</span>
                <span className="hero-reassurance-label">Taux d'approbation Google Play</span>
              </div>

              <div className="hero-reassurance-item">
                <span className="hero-reassurance-num" style={{ color: '#f97316' }}>100%</span>
                <span className="hero-reassurance-label">Missions rémunérées et vérifiées</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Showcase Vidéo 3D Smartphone SAMRE */}
          <div className="hero-video-showcase">
            <div className="hero-video-card" onClick={togglePlay} title={isPlaying ? 'Cliquer pour mettre en pause' : 'Cliquer pour lire'}>
              {/* Badge supérieur : En direct */}
              <div className="video-float-badge-top">
                <span className="live-dot" />
                <span>Closed Testing 14 Jours</span>
              </div>

              {/* Vidéo 3D Smartphone (Muette, autoPlay, boucle continue) */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/Smartphone_3D_assembly_animation_20260925022334.mp4" type="video/mp4" />
              </video>

              {/* Bouton Play/Pause discret */}
              <button
                type="button"
                className="video-control-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              {/* Badge inférieur : Validation Google Play Console */}
              <div className="video-float-badge-bottom">
                <ShieldCheck size={14} color="#f97316" />
                <span>20 Testeurs Réels Actifs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
