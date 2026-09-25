import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Mail, Building2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const PROFILE_TYPES: Record<string, string> = {
  'closed-testing': 'Développeur / Éditeur — Closed Testing 14 Jours Google Play',
  'stage-candidat': 'Étudiant / Jeune Diplômé — Recherche de Stage ou Emploi',
  'testeur': 'Panéliste — Devenir Testeur Rémunéré (T-Money / Flooz)',
  'entreprise': 'Entreprise / DRH — Recrutement de Stagiaires & Talents',
  'autre': 'Autre demande / Partenariat stratégique',
};

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    profileType: 'closed-testing',
    city: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileLabel = PROFILE_TYPES[formData.profileType] || formData.profileType;

    const messageLines = [
      'Bonjour l\'équipe SAMRE,',
      '',
      'Je souhaite vous contacter au sujet de :',
      `👤 Nom & Prénoms : ${formData.fullName}`,
      `📞 Téléphone / WhatsApp : ${formData.phone}`,
      `📍 Ville / Pays : ${formData.city || 'Non précisé'}`,
      `💼 Profil : ${profileLabel}`,
      formData.message ? `📝 Détails : ${formData.message}` : '',
      '',
      '_Message envoyé depuis le site officiel SAMRE_',
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://wa.me/22897317825?text=${encodeURIComponent(messageLines)}`;
    setLastWhatsappUrl(whatsappUrl);
    setIsSubmitted(true);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section
      id="contact"
      style={{
        padding: '6.5rem 0',
        backgroundColor: '#FAFAF9',
        position: 'relative',
        borderTop: '1px solid #E2E8F0',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title Header */}
        <ScrollReveal direction="down" distance={25}>
          <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
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
              <MessageSquare size={14} />
              <span>Contact & Support Dédié</span>
            </div>

            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
                fontWeight: 800,
                color: '#0A1C38',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}
            >
              Parlons de votre projet ou de votre carrière dès aujourd'hui
            </h2>
            <p style={{ fontSize: 'clamp(1.05rem, 1.25vw, 1.2rem)', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              Besoin de lancer 20 testeurs sur votre application, de postuler à un stage rémunéré ou d'établir un partenariat d'entreprise ? Nos équipes vous répondent immédiatement.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Column Left: Coordinates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Siège Central */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Siège Social & Hub Technique
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A1C38', marginTop: '4px' }}>
                    Lomé — Déckon, Togo
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#475569', margin: '6px 0 0 0', lineHeight: 1.5 }}>
                    Boulevard du 13 Janvier, Immeuble Déckon Tech, 01 BP 4580 Lomé
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Téléphone & Ligne Directe WhatsApp
                  </div>
                  <a
                    href="tel:+22897317825"
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0A1C38',
                      textDecoration: 'none',
                      display: 'block',
                      marginTop: '4px',
                    }}
                  >
                    +228 97 31 78 25
                  </a>
                  <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>
                    Support réactif 7j/7 de 08h à 20h GMT
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    color: '#F97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Email Officiel
                  </div>
                  <a
                    href="mailto:contact@samre.com"
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#0A1C38',
                      textDecoration: 'none',
                      display: 'block',
                      marginTop: '4px',
                    }}
                  >
                    contact@samre.com
                  </a>
                </div>
              </div>
            </div>

            {/* Opening hours */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Clock size={22} color="#64748B" />
                <div style={{ fontSize: '0.92rem', color: '#334155' }}>
                  <strong>Horaires Bureaux :</strong> Lundi – Vendredi : 08h00 – 18h00 • Samedi : 08h30 – 13h00
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: Direct Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 30px -4px rgba(10, 28, 56, 0.07)',
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0A1C38',
                marginBottom: '1.5rem',
              }}
            >
              Envoyer un message rapide
            </h3>

            {isSubmitted ? (
              <div
                style={{
                  padding: '2rem',
                  backgroundColor: '#ECFDF5',
                  borderRadius: '16px',
                  border: '1px solid #A7F3D0',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065F46', marginBottom: '0.5rem' }}>
                  Message préparé avec succès !
                </h4>
                <p style={{ fontSize: '0.94rem', color: '#047857', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Si votre application WhatsApp ne s'est pas ouverte automatiquement, cliquez sur le bouton ci-dessous pour démarrer la discussion :
                </p>
                <a
                  href={lastWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.8rem',
                    borderRadius: '999px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
                  }}
                >
                  <MessageSquare size={18} />
                  <span>Ouvrir dans WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0A1C38', marginBottom: '0.4rem' }}>
                    Nom & Prénoms *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Koffi Mensah"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                    onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0A1C38', marginBottom: '0.4rem' }}>
                      Numéro WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+228 90..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                      onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0A1C38', marginBottom: '0.4rem' }}>
                      Ville / Pays
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Lomé, Togo"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                      onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0A1C38', marginBottom: '0.4rem' }}>
                    Vous êtes : *
                  </label>
                  <select
                    value={formData.profileType}
                    onChange={(e) => setFormData({ ...formData, profileType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                  >
                    {Object.entries(PROFILE_TYPES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0A1C38', marginBottom: '0.4rem' }}>
                    Détails de votre demande ou projet
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Précisez votre besoin (ex: nom de l'application, domaine de stage recherché, profil souhaité...)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                    onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    padding: '1rem',
                    borderRadius: '9999px',
                    backgroundColor: '#F97316',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(249, 115, 22, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EA580C')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F97316')}
                >
                  <Send size={18} />
                  <span>Envoyer mon message direct</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
