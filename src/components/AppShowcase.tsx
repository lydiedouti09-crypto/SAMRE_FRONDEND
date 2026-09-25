import React, { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import {
  CheckCircle2,
  Smartphone,
  Briefcase,
  Download,
  Check,
  Building2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ShowcaseMode = 'testing' | 'stage';

export const AppShowcase: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ShowcaseMode>('testing');
  const navigate = useNavigate();

  return (
    <section
      id="testing-mobile"
      style={{
        padding: '7.5rem 0 6.5rem 0',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <style>{`
        .sc-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .sc-main-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        /* 3D perspective smartphone container */
        .sc-device-wrapper {
          perspective: 1400px;
          display: flex;
          justifyContent: center;
          align-items: center;
          position: relative;
          padding: 1rem 0;
        }

        /* High-end Android smartphone styling */
        .sc-device {
          width: 100%;
          max-width: 375px;
          margin: 0 auto;
          background: #0B132B;
          border-radius: 46px;
          padding: 10px;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateY(-18deg) rotateX(9deg) rotateZ(3deg);
          box-shadow: 
            -28px 32px 65px -12px rgba(10, 28, 56, 0.35),
            -12px 14px 26px -6px rgba(0, 0, 0, 0.2),
            inset 0 0 0 2px #334155,
            inset 0 0 0 4px #1E293B;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .sc-device:hover {
          transform: rotateY(-8deg) rotateX(4deg) rotateZ(1.5deg) translateY(-8px);
          box-shadow: 
            -32px 40px 75px -12px rgba(10, 28, 56, 0.42),
            -14px 18px 30px -6px rgba(0, 0, 0, 0.25),
            inset 0 0 0 2px #475569,
            inset 0 0 0 4px #1E293B;
        }

        /* Right hardware button */
        .sc-device::before {
          content: '';
          position: absolute;
          right: -4px;
          top: 130px;
          width: 3px;
          height: 52px;
          background: #334155;
          border-radius: 0 3px 3px 0;
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.35);
        }

        .sc-device::after {
          content: '';
          position: absolute;
          right: -4px;
          top: 200px;
          width: 3px;
          height: 38px;
          background: #334155;
          border-radius: 0 3px 3px 0;
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.35);
        }

        /* Smooth ground shadow */
        .sc-shadow {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-40%) rotateY(-18deg);
          width: 350px;
          height: 35px;
          background: radial-gradient(ellipse at center, rgba(10, 28, 56, 0.3) 0%, rgba(10, 28, 56, 0) 72%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(8px);
        }

        /* Screen */
        .sc-screen {
          background: #FFFFFF;
          border-radius: 38px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 640px;
          position: relative;
        }

        /* Glass reflection */
        .sc-glass-reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(125deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 50%);
          border-radius: 38px;
          pointer-events: none;
          z-index: 20;
        }

        /* Status bar with centered camera punch-hole */
        .sc-status-bar {
          padding: 0.85rem 1.35rem 0.55rem 1.35rem;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          background: #FFFFFF;
          border-bottom: 1px solid #F1F5F9;
          position: relative;
          min-height: 42px;
        }

        .sc-punch-hole {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #000000;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5), inset 0 0 2px rgba(255, 255, 255, 0.4);
          z-index: 10;
        }

        /* Mode Selector Buttons */
        .sc-mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.85rem 1.6rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
        }

        .sc-mode-btn.active {
          background: #F97316;
          color: #FFFFFF;
          box-shadow: 0 8px 22px rgba(249, 115, 22, 0.32);
        }

        .sc-mode-btn.inactive {
          background: #FFFFFF;
          color: #475569;
          border-color: #CBD5E1;
        }

        .sc-mode-btn.inactive:hover {
          background: #F1F5F9;
          color: #0A1C38;
        }

        /* 3 Pillar Cards below grid */
        .sc-feature-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 22px;
          padding: 2.25rem 2rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 6px 20px -4px rgba(10, 28, 56, 0.05);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .sc-feature-card:hover {
          transform: translateY(-5px);
          border-color: #FDBA74;
          box-shadow: 0 16px 36px -8px rgba(249, 115, 22, 0.15);
        }

        .sc-feature-bg-icon {
          position: absolute;
          right: -15px;
          bottom: -20px;
          color: #F97316;
          opacity: 0.05;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }

        .sc-feature-card:hover .sc-feature-bg-icon {
          transform: scale(1.1) rotate(-6deg);
          opacity: 0.1;
        }

        @media (max-width: 992px) {
          .sc-main-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
      `}</style>

      <div className="sc-container">
        {/* Main Grid: Storytelling + 3D Smartphone */}
        <div className="sc-main-grid">
          {/* Left Column */}
          <ScrollReveal direction="left" distance={60} duration={0.85}>
            <div>
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
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1.25rem',
                }}
              >
                <span>Application & Closed Testing</span>
              </div>

              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                  fontWeight: 800,
                  color: '#0A1C38',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.5rem',
                }}
              >
                Une expérience mobile fluide : validez en 25s et décrochez votre opportunité
              </h2>

              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.4vw, 1.18rem)',
                  color: '#475569',
                  lineHeight: 1.7,
                  marginBottom: '2.5rem',
                  maxWidth: '620px',
                }}
              >
                Que vous soyez <strong>développeur</strong> voulant franchir le test fermé de 14 jours de Google Play,
                <strong> panéliste</strong> gagnant des revenus via T-Money / Flooz, ou <strong>étudiant</strong> postulant à des stages en entreprise,
                SAMRE centralise tout sur une interface réactive et automatisée.
              </p>

              {/* Mode switch buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <button
                  type="button"
                  className={`sc-mode-btn ${activeMode === 'testing' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveMode('testing')}
                >
                  <Smartphone size={18} />
                  <span>Session Testeur (Google Play 25s)</span>
                </button>

                <button
                  type="button"
                  className={`sc-mode-btn ${activeMode === 'stage' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveMode('stage')}
                >
                  <Briefcase size={18} />
                  <span>Recherche de Stage & Emploi</span>
                </button>
              </div>

              {/* Quick stats highlight */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A1C38' }}>25 sec</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Session de test requise</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>100%</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Gains T-Money / Flooz</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F97316' }}>1 Clic</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Postulation de stage</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: 3D High-Fidelity Smartphone */}
          <ScrollReveal direction="right" distance={60} duration={0.85} delay={100} style={{ width: '100%' }}>
            <div className="sc-device-wrapper">
              <div className="sc-shadow" />
              <div className="sc-device">
                <div className="sc-screen">
                  <div className="sc-glass-reflection" />

                  {/* 1. Android Status Bar */}
                  <div className="sc-status-bar">
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', zIndex: 1 }}>
                      10:25
                    </span>
                    <div className="sc-punch-hole" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', zIndex: 1 }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#334155' }}>5G</span>
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style={{ display: 'block' }}>
                        <rect x="0.5" y="8" width="2" height="2.5" rx="0.5" fill="#0F172A" />
                        <rect x="4" y="5.5" width="2" height="5" rx="0.5" fill="#0F172A" />
                        <rect x="7.5" y="3" width="2" height="7.5" rx="0.5" fill="#0F172A" />
                        <rect x="11" y="0.5" width="2" height="10" rx="0.5" fill="#0F172A" />
                      </svg>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A' }}>98%</span>
                    </div>
                  </div>

                  {/* 2. Push Notification */}
                  <div style={{ padding: '0.85rem 1rem 0.4rem 1rem' }}>
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '0.85rem 1rem',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '6px',
                              backgroundColor: activeMode === 'testing' ? '#0A1C38' : '#F97316',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.68rem',
                              fontWeight: 900,
                            }}
                          >
                            S
                          </div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A' }}>
                            {activeMode === 'testing' ? 'Google Play Closed Testing' : 'Recrutement Entreprise'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>À l'instant</span>
                      </div>

                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.15rem' }}>
                        {activeMode === 'testing'
                          ? 'Étape Validée : + 1 500 FCFA (T-Money)'
                          : 'Candidature Retenue : Entretien FlyPoint'}
                      </div>

                      <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                        {activeMode === 'testing'
                          ? 'Session du jour validée avec succès sur l\'application ZOG-PAY. Vos gains sont crédités.'
                          : 'Votre profil a été présélectionné pour le stage Développeur Web. Indemnité : 75.000 F/mois.'}
                      </p>
                    </div>
                  </div>

                  {/* 3. Screen Body */}
                  <div style={{ padding: '0.75rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Bonjour,</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A' }}>
                          {activeMode === 'testing' ? 'Koffi Mensah' : 'Abla Sophie'}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: activeMode === 'testing' ? '#EFF6FF' : '#FFF7ED',
                          color: activeMode === 'testing' ? '#1E40AF' : '#C2410C',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Check size={12} />
                        {activeMode === 'testing' ? 'Testeur Vérifié A+' : 'Candidat Certifié'}
                      </span>
                    </div>

                    {/* Main Operation Card */}
                    {activeMode === 'testing' ? (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #0A1C38 0%, #1E3A8A 100%)',
                          borderRadius: '20px',
                          padding: '1.35rem',
                          color: '#FFFFFF',
                          boxShadow: '0 8px 24px -4px rgba(10, 28, 56, 0.4)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Jour 4 / 14 en cours
                          </span>
                          <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                            ZOG-J04
                          </span>
                        </div>

                        <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                          25s <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#93C5FD' }}>test complété</span>
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#D1FAE5', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                          <CheckCircle2 size={14} color="#34D399" />
                          <span>Code unique horodaté vérifié avec succès</span>
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#93C5FD', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Solde : 18 500 FCFA</span>
                          <span>Retrait : T-Money</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                          borderRadius: '20px',
                          padding: '1.35rem',
                          color: '#FFFFFF',
                          boxShadow: '0 8px 24px -4px rgba(249, 115, 22, 0.35)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#FED7AA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Stage Développeur Fullstack
                          </span>
                          <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(255, 255, 255, 0.25)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                            Lomé
                          </span>
                        </div>

                        <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                          75 000 <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>FCFA / mois</span>
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                          <Building2 size={14} color="#FFFFFF" />
                          <span>Entreprise Partenaire : FlyPoint Tech</span>
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#FED7AA', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Convention signée</span>
                          <span>Postulation 1-clic</span>
                        </div>
                      </div>
                    )}

                    {/* Recent activity card */}
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '0.85rem', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
                        Activité récente
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Zap size={14} color="#F97316" />
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>
                              {activeMode === 'testing' ? 'Mission FinTech App' : 'Offre Ecobank Togo'}
                            </span>
                          </div>
                          <span style={{ color: '#10B981', fontWeight: 700 }}>
                            {activeMode === 'testing' ? '+ 1 500 F' : 'Consultée'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <ShieldCheck size={14} color="#2563EB" />
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>Badge Rigueur SAMRE</span>
                          </div>
                          <span style={{ color: '#64748B' }}>Niveau Max</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick action button inside screen */}
                    <div
                      style={{
                        marginTop: 'auto',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '12px',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.75rem',
                        color: '#0A1C38',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate('/inscription')}
                    >
                      <span>{activeMode === 'testing' ? 'Accéder à mon espace testeur' : 'Voir toutes les offres de stage'}</span>
                      <ArrowRight size={14} color="#F97316" />
                    </div>
                  </div>

                  {/* Android gesture bar */}
                  <div style={{ padding: '0.55rem 0 0.75rem 0', display: 'flex', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                    <div style={{ width: '90px', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 3 Pillars Cards below the grid */}
        <ScrollReveal direction="up" distance={40} duration={0.8}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Card 1 */}
            <div className="sc-feature-card">
              <Clock className="sc-feature-bg-icon" size={140} />
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#F97316',
                  letterSpacing: '0.08em',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <span>01. RAPIDITÉ & RIGUEUR</span>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0A1C38',
                  lineHeight: 1.25,
                  marginBottom: '0.75rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                25 secondes par jour seulement
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65, margin: 0, position: 'relative', zIndex: 2 }}>
                Les testeurs ouvrent l’application cible, réalisent l’étape du jour, et le chronomètre interne valide automatiquement la session après 25 secondes d’utilisation effective.
              </p>
            </div>

            {/* Card 2 */}
            <div className="sc-feature-card">
              <TrendingUp className="sc-feature-bg-icon" size={140} />
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#10B981',
                  letterSpacing: '0.08em',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <span>02. PAIEMENT MOBILE</span>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0A1C38',
                  lineHeight: 1.25,
                  marginBottom: '0.75rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                T-Money & Flooz instantanés
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65, margin: 0, position: 'relative', zIndex: 2 }}>
                Aucun intermédiaire ni attente : les gains des missions de test ou indemnités de stage sont versés directement sur votre numéro mobile money en toute transparence.
              </p>
            </div>

            {/* Card 3 */}
            <div className="sc-feature-card">
              <ShieldCheck className="sc-feature-bg-icon" size={140} />
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#2563EB',
                  letterSpacing: '0.08em',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <span>03. SÉCURITÉ & AUDIT</span>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0A1C38',
                  lineHeight: 1.25,
                  marginBottom: '0.75rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                Conformité Google Play à 100%
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65, margin: 0, position: 'relative', zIndex: 2 }}>
                Chaque testeur dispose d'un appareil physique distinct (pas d'émulateurs). L'historique d'activité est exportable pour prouver les 14 jours consécutifs à Google Play Console.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AppShowcase;
