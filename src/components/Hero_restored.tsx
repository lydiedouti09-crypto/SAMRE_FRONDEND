import React, { useState, useEffect } from 'react';
import Link from '@/lib/router';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Smartphone, Briefcase, ShieldCheck } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  alt: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 0,
    image: '/samre.jpg',
    alt: 'Étudiants et professionnels collaborant sur la plateforme Samré',
  },
  {
    id: 1,
    image: '/Investisseuse sur ordinateur.png',
    alt: 'Développeur ou recruteur pilotant une campagne de test et de recrutement',
  },
  {
    id: 2,
    image: '/samre2.png',
    alt: 'Séances de tests applicatifs mobiles et opportunités tech',
  },
  {
    id: 3,
    image: '/samre4.png',
    alt: 'Jeunes talents et stagiaires valorisant leurs compétences sur smartphone',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section
      id="hero"
      className="hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        .hero-section {
          position: relative;
          background: #ffffff;
          overflow: hidden;
          min-height: calc(100vh - 84px);
          display: flex;
          align-items: center;
        }

        .hero-slides-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .hero-slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          opacity: 0;
          transform: scale(1.04);
          transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out;
        }

        .hero-slide-bg.active {
          opacity: 1;
          transform: scale(1);
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.98) 42%,
            rgba(255, 255, 255, 0.88) 56%,
            rgba(255, 255, 255, 0.35) 75%,
            rgba(255, 255, 255, 0) 90%
          );
        }

        .hero-text-container {
          position: relative;
          z-index: 3;
          width: 100%;
          padding: 4.5rem 1.5rem;
        }

        .hero-text-content {
          max-width: 660px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
          font-weight: 700;
          font-size: 0.84rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 1px 3px rgba(249, 115, 22, 0.1);
        }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.4rem, 4.8vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.14;
          color: #0a1c38;
          margin: 0 0 1.25rem 0;
        }

        .hero-title .highlight-orange {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          color: #334155;
          line-height: 1.7;
          margin: 0 0 2.25rem 0;
          max-width: 560px;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.95rem 2rem;
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

        .hero-reassurance-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
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
          font-size: 1.35rem;
          font-weight: 900;
          color: #0a1c38;
          line-height: 1.1;
        }

        .hero-reassurance-label {
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 0.2rem;
        }

        .hero-controls {
          position: absolute;
          bottom: 2rem;
          right: 3rem;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0.9rem;
          border-radius: 9999px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .hero-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #ffffff;
          color: #0a1c38;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .hero-arrow-btn:hover {
          background: #f97316;
          color: #ffffff;
        }

        .hero-dots {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }

        .hero-dot.active {
          width: 22px;
          border-radius: 9999px;
          background: #f97316;
        }

        @media (max-width: 991px) {
          .hero-gradient-overlay {
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.96) 0%,
              rgba(255, 255, 255, 0.92) 50%,
              rgba(255, 255, 255, 0.75) 100%
            );
          }
          .hero-controls {
            right: 1.5rem;
            bottom: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .hero-reassurance-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}</style>

      {/* Diapositives en arrière-plan */}
      <div className="hero-slides-wrapper">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide-bg ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url("${slide.image}")` }}
            role="img"
            aria-label={slide.alt}
          />
        ))}
      </div>

      {/* Dégradé de lisibilité avant-plan */}
      <div className="hero-gradient-overlay" />

      {/* Contenu textuel interactif */}
      <div className="container hero-text-container">
        <div className="hero-text-content">
          <div className="hero-badge">
            <Sparkles size={14} color="#ea580c" />
            <span>N°1 de l'insertion professionnelle & du test mobile en Afrique</span>
          </div>

          <h1 className="hero-title">
            Propulsez votre <span className="highlight-orange">Carrière</span> et Validez vos <span className="highlight-orange">Applications</span>.
          </h1>

          <p className="hero-desc">
            Samré est la plateforme tout-en-un qui connecte les étudiants aux meilleures offres de stage en entreprise, et résout les 14 jours obligatoires de tests Google Play pour les développeurs grâce à un panel réel et rémunéré.
          </p>

          <div className="hero-actions">
            <a href="#services" className="hero-btn hero-btn-primary">
              <Briefcase size={18} />
              <span>Découvrir les stages & services</span>
              <ArrowRight size={16} />
            </a>

            <Link href="/connexion" className="hero-btn hero-btn-secondary">
              <Smartphone size={18} />
              <span>Espace Testeurs & Développeurs</span>
            </Link>
          </div>

          <div className="hero-reassurance-grid">
            <div className="hero-reassurance-item">
              <span className="hero-reassurance-num">+500</span>
              <span className="hero-reassurance-label">Entreprises & Startups partenaires</span>
            </div>

            <div className="hero-reassurance-item">
              <span className="hero-reassurance-num" style={{ color: '#10b981' }}>99.8%</span>
              <span className="hero-reassurance-label">Taux d'approbation Google Play Console</span>
            </div>

            <div className="hero-reassurance-item">
              <span className="hero-reassurance-num" style={{ color: '#f97316' }}>100%</span>
              <span className="hero-reassurance-label">Missions rémunérées et vérifiées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles du Diaporama */}
      <div className="hero-controls">
        <button
          type="button"
          onClick={handlePrev}
          className="hero-arrow-btn"
          aria-label="Image précédente"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="hero-dots">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="hero-arrow-btn"
          aria-label="Image suivante"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
