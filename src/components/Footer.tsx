import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: '#07152B',
        color: '#CBD5E1',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        fontSize: '0.88rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main Clean Row: Identity & Direct Contact / Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src="/ChatGPT Image 5 oct. 2026, 12_23_50.png"
              alt="Logo SAMRE"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                padding: '3px',
              }}
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

          {/* Contact & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
              <a href="mailto:contact@samre.com" style={{ color: '#CBD5E1', textDecoration: 'none', fontWeight: 500 }}>
                contact@samre.com
              </a>
            </div>

            <Link
              to="/inscription"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#F97316',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                padding: '0.55rem 1.1rem',
                borderRadius: '9999px',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Créer mon compte en 2 minutes</span>
              <ArrowRight size={14} />
            </Link>
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
