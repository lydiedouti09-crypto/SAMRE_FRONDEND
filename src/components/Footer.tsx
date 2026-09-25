import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#07152B',
        color: '#CBD5E1',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        fontSize: '0.88rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Column 1: Identity & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img
                src="/logo.png"
                alt="Logo SAMRE"
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF' }}>
                  SAMRE
                </div>
                <div style={{ fontSize: '0.72rem', color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Stages & Closed Testing 14J
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              La plateforme technologique de référence en Afrique de l'Ouest pour connecter les talents aux stages rémunérés en entreprise et garantir la conformité Google Play Console aux développeurs d'applications mobiles.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8', fontSize: '0.82rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Conforme aux exigences Google Play 2026</span>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '1.25rem', fontWeight: 700 }}>
              Nos Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="#services" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Closed Testing Google Play 14 Jours
                </a>
              </li>
              <li>
                <a href="#services" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Recherche de Stages & Emplois Rémunérés
                </a>
              </li>
              <li>
                <a href="#testing-mobile" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Missions de Testeur Panéliste (25s)
                </a>
              </li>
              <li>
                <a href="#services" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Badges & Profils Étudiants Certifiés
                </a>
              </li>
              <li>
                <Link to="/connexion" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Espace Entreprise & Recruteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hubs & Réseau */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '1.25rem', fontWeight: 700 }}>
              Hubs & Universités Partenaires
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="#agences" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  🇹🇬 Lomé — Siège & Direction Générale
                </a>
              </li>
              <li>
                <a href="#agences" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  🇧🇯 Cotonou — Pôle Académique & Epitech
                </a>
              </li>
              <li>
                <a href="#agences" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  🇨🇮 Abidjan — Hub FinTech & Mobile
                </a>
              </li>
              <li>
                <a href="#agences" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  🇸🇳 Dakar — Pôle UEMOA Tech Hub
                </a>
              </li>
              <li>
                <a href="#agences" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  🌍 Partenariats Internationaux & Remote
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '1.25rem', fontWeight: 700 }}>
              Siège Social & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <MapPin size={18} color="#F97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Bd. du 13 Janvier, Immeuble Déckon, Lomé, Togo</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Phone size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <a href="tel:+22897317825" style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
                    +228 97 31 78 25
                  </a>
                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}> (WhatsApp / Mobile)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Mail size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <a href="mailto:contact@samre.com" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  contact@samre.com
                </a>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <Link
                  to="/inscription"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: '#F97316',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                  }}
                >
                  <span>Créer mon compte en 2 minutes</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#64748B',
          }}
        >
          <div>
            © {new Date().getFullYear()} SAMRE Global Technologies. Tous droits réservés.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="#apropos" style={{ color: '#64748B', textDecoration: 'none' }}>
              Conditions Générales d'Utilisation
            </a>
            <a href="#apropos" style={{ color: '#64748B', textDecoration: 'none' }}>
              Politique de Confidentialité
            </a>
            <a href="#contact" style={{ color: '#64748B', textDecoration: 'none' }}>
              Mentions Légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
