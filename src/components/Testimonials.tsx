import React, { useRef, useState } from 'react';
import { Quote, MapPin, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  district: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  text: string;
  avatarLetter: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Koffi A. Mensah',
    role: 'Étudiant en Informatique & Testeur',
    district: 'Lomé, Agoè-Nyivé',
    badge: '32 500 F CFA gagnés',
    badgeColor: '#10B981',
    badgeBg: '#ECFDF5',
    text: 'Grâce à SAMRE, j\'ai participé à 2 campagnes de test de 14 jours. Chaque jour, 25 secondes d\'activité sur mon téléphone et j\'ai reçu mes virements T-Money sans aucun retard. En plus, cela m\'a donné un super badge sur mon CV !',
    avatarLetter: 'K',
  },
  {
    id: '2',
    name: 'Arnaud Tossou',
    role: 'Lead Développeur Android — FinTech Togo',
    district: 'Lomé, Déckon',
    badge: 'App validée en 14 jours',
    badgeColor: '#2563EB',
    badgeBg: '#EFF6FF',
    text: 'Nous avions été rejetés deux fois par Google Play Console par manque de testeurs actifs consécutifs. En passant par SAMRE, 20 testeurs togolais ont interagi chaque jour avec des logs irréprochables. Approbation reçue du premier coup !',
    avatarLetter: 'A',
  },
  {
    id: '3',
    name: 'Abla Sophie Lawson',
    role: 'Stagiaire Assistante Marketing',
    district: 'Lomé, Adidogomé',
    badge: 'Stage Décroché • 80 000 F/m',
    badgeColor: '#F97316',
    badgeBg: '#FFF7ED',
    text: 'Trouver un stage rémunéré à Lomé était un vrai parcours du combattant. Sur SAMRE, j\'ai postulé en 1 clic grâce à mon profil certifié. J\'ai passé un entretien 48h plus tard chez une agence partenaire et j\'ai été retenue.',
    avatarLetter: 'S',
  },
  {
    id: '4',
    name: 'Fabrice D. Kodjo',
    role: 'Fondateur de Startup Mobile',
    district: 'Cotonou, Bénin',
    badge: '100% Conformité Google',
    badgeColor: '#10B981',
    badgeBg: '#ECFDF5',
    text: 'La gestion des 20 testeurs Google Play est un cauchemar logistique quand on le fait manuellement. SAMRE automatise le rappel quotidien, le chronométrage et fournit le récapitulatif prêt pour la soumission finale.',
    avatarLetter: 'F',
  },
  {
    id: '5',
    name: 'Yao Emmanuel',
    role: 'Développeur Junior & Stagiaire Web',
    district: 'Lomé, Kégué',
    badge: 'Embauche après stage',
    badgeColor: '#F97316',
    badgeBg: '#FFF7ED',
    text: 'J\'ai commencé comme testeur panéliste, puis j\'ai complété les défis de rigueur. Une entreprise qui cherchait un profil junior m\'a directement contacté via SAMRE. Mon stage de 3 mois vient de déboucher sur un contrat.',
    avatarLetter: 'Y',
  },
  {
    id: '6',
    name: 'Mariam Diop',
    role: 'Éditrice d\'Applications EdTech',
    district: 'Dakar, Sénégal',
    badge: '20 testeurs mobilisés',
    badgeColor: '#2563EB',
    badgeBg: '#EFF6FF',
    text: 'L\'expérience de test était hyper pro : de vrais utilisateurs avec des feedbacks précieux sur l\'ergonomie de notre app éducative. Une solution indispensable pour tous les créateurs d\'applications en Afrique.',
    avatarLetter: 'M',
  },
];

export const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="temoignages"
      style={{
        padding: '5.5rem 0 5rem 0',
        background: '#FFFFFF',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid #F1F5F9',
      }}
    >
      <style>{`
        .testimonials-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 3rem auto;
          padding: 0 1.5rem;
        }

        .testimonials-track-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 1rem 0;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .testimonials-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marqueeScroll 45s linear infinite;
        }

        .testimonials-track.paused {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .testimonial-card {
          width: 380px;
          background: #F8FAFC;
          border-radius: 22px;
          padding: 2rem;
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          position: relative;
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          border-color: #FDBA74;
          box-shadow: 0 12px 24px -10px rgba(249, 115, 22, 0.15);
        }

        @media (max-width: 640px) {
          .testimonial-card {
            width: 300px;
            padding: 1.5rem;
          }
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .control-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: #F8FAFC;
          color: #0A1C38;
          border-color: #CBD5E1;
          transform: scale(1.05);
        }
      `}</style>

      <ScrollReveal direction="down" distance={25}>
        <div className="testimonials-header">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              backgroundColor: '#FFF7ED',
              border: '1px solid #FED7AA',
              color: '#EA580C',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>Retours d'Expérience & Preuve Sociale</span>
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              color: '#0A1C38',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
            }}
          >
            Ils propulsent leurs applications et leurs carrières avec SAMRE
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Découvrez comment étudiants, développeurs et entreprises tirent parti de notre communauté de testeurs et d'opportunités de stage.
          </p>
        </div>
      </ScrollReveal>

      {/* Infinite Marquee Track */}
      <div
        className="testimonials-track-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className={`testimonials-track ${isPaused ? 'paused' : ''}`}
        >
          {duplicatedTestimonials.map((t, idx) => (
            <div key={`${t.id}-${idx}`} className="testimonial-card">
              <div>
                {/* Header: Badge & Quote Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: t.badgeColor,
                      backgroundColor: t.badgeBg,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      border: `1px solid ${t.badgeColor}30`,
                    }}
                  >
                    {t.badge}
                  </span>
                  <Quote size={20} color="#CBD5E1" />
                </div>

                {/* Testimonial Quote */}
                <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  « {t.text} »
                </p>
              </div>

              {/* Author Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#0A1C38',
                    color: '#F97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {t.avatarLetter}
                </div>
                <div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0A1C38' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                    <MapPin size={12} color="#F97316" />
                    <span>{t.district} • {t.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="carousel-controls">
        <button
          type="button"
          className="control-btn"
          onClick={() => handleManualScroll('left')}
          aria-label="Témoignage précédent"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Reprendre le défilement' : 'Mettre en pause'}
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={() => handleManualScroll('right')}
          aria-label="Témoignage suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
