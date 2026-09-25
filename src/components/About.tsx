import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="apropos"
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        borderTop: '1px solid #F1F5F9',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1020px',
          margin: '0 auto',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        {/* Label */}
        <ScrollReveal direction="down" distance={20} duration={0.7}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: '#FFF7ED',
              border: '1px solid #FED7AA',
              color: '#EA580C',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>Notre Vision & Mission</span>
          </div>
        </ScrollReveal>

        {/* Big Heading */}
        <ScrollReveal direction="down" distance={25} duration={0.8} delay={80}>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 800,
              color: '#0A1C38',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Bâtir le pont entre talents africains et succès applicatif mondial
          </h2>
        </ScrollReveal>

        {/* Narrative text */}
        <ScrollReveal direction="fade" distance={20} delay={140} duration={0.85}>
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.4vw, 1.24rem)',
              color: '#475569',
              lineHeight: 1.85,
              maxWidth: '880px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            <strong>SAMRE</strong> est la première plateforme d'accélération d'opportunités unifiée au Togo et en Afrique de l'Ouest.
            Nous permettons aux <strong>étudiants et jeunes talents</strong> de décrocher des stages conventionnés et rémunérés en entreprise,
            tout en apportant aux <strong>développeurs et éditeurs d'applications mobiles</strong> la cohorte de 20 testeurs réels certifiés
            exigée pour franchir les 14 jours de Closed Testing Google Play Console.
          </p>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal direction="up" distance={30} delay={200} duration={0.8}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/inscription')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '1rem 2.5rem',
                borderRadius: '9999px',
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                fontSize: '1.02rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.32)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EA580C';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F97316';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Rejoindre la communauté SAMRE</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '1rem 2.2rem',
                borderRadius: '9999px',
                backgroundColor: '#F8FAFC',
                color: '#0A1C38',
                fontSize: '1.02rem',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #CBD5E1',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
            >
              <span>Contacter l'équipe</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
