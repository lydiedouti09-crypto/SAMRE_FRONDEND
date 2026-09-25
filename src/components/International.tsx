import React, { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import {
  MapPin,
  Building2,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Phone,
  MessageCircle,
  Check,
} from 'lucide-react';

interface HubItem {
  id: string;
  name: string;
  country: string;
  flag: string;
  type: 'headquarter' | 'hub' | 'international';
  tag: string;
  address: string;
  universities: string[];
  companies: string[];
  activeTesters: string;
  description: string;
  contactPhone: string;
  highlightStat: string;
  highlightLabel: string;
}

const HUBS: HubItem[] = [
  {
    id: 'lome',
    name: 'Lomé — Siège & Hub Principal',
    country: 'Togo',
    flag: '🇹🇬',
    type: 'headquarter',
    tag: 'Siège Central',
    address: 'Boulevard du 13 Janvier, Quartier Déckon, Lomé, Togo',
    universities: ['Université de Lomé (FDS, CIC)', 'ESIBA RKM', 'IAEC Togo', 'ESGIS Lomé'],
    companies: ['FlyPoint Tech', 'Orabank Togo', 'T-Money / Togocom', 'Moov Africa'],
    activeTesters: '+ 520 testeurs certifiés',
    description:
      'Coordination des campagnes de Closed Testing 14 jours, validation des partenariats universitaires et centralisation des conventions de stage au Togo.',
    contactPhone: '+228 97 31 78 25',
    highlightStat: '99.8%',
    highlightLabel: 'Taux de succès Google Play',
  },
  {
    id: 'abidjan',
    name: 'Abidjan — Hub FinTech & Startups',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    type: 'hub',
    tag: 'Hub Régional',
    address: 'Cocody Riviera Palmeraie, Abidjan, Côte d\'Ivoire',
    universities: ['INP-HB Yamoussoukro', 'Université FHB Cocody', 'ESATIC Abidjan'],
    companies: ['Wave Côte d\'Ivoire', 'Orange Fab', 'Djamo CI', 'Startups FinTech'],
    activeTesters: '+ 640 testeurs certifiés',
    description:
      'Réseau d\'ingénieurs et testeurs mobiles hautement qualifiés pour les applications bancaires et FinTech exigeantes.',
    contactPhone: '+225 07 00 00 00 00',
    highlightStat: '+120',
    highlightLabel: 'Stages rémunérés / an',
  },
  {
    id: 'cotonou',
    name: 'Cotonou — Pôle Numérique & Epitech',
    country: 'Bénin',
    flag: '🇧🇯',
    type: 'hub',
    tag: 'Hub Académique',
    address: 'Boulevard Saint-Michel, Haie Vive, Cotonou, Bénin',
    universities: ['Epitech Bénin', 'Sèmè City', 'UAC Abomey-Calavi (EPAC)'],
    companies: ['Open SI', 'FedaPay', 'Startups Cotonou Tech'],
    activeTesters: '+ 380 testeurs certifiés',
    description:
      'Partenariat privilégié avec les écoles de code et incubateurs d\'Abomey-Calavi et Cotonou pour les profils développeurs juniors.',
    contactPhone: '+229 90 00 00 00',
    highlightStat: '48h',
    highlightLabel: 'Délai moyen de recrutement',
  },
  {
    id: 'dakar',
    name: 'Dakar — Pôle UEMOA Tech Hub',
    country: 'Sénégal',
    flag: '🇸🇳',
    type: 'hub',
    tag: 'Hub Ouest-Africain',
    address: 'Point E, Avenue Cheikh Anta Diop, Dakar, Sénégal',
    universities: ['ESP Dakar', 'UCAD', 'ISI Dakar', 'Sup\'Info Sénégal'],
    companies: ['Sonatel Orange', 'Wave Sénégal', 'Hubs de Dakar'],
    activeTesters: '+ 410 testeurs certifiés',
    description:
      'Bassin de talents tech et éditeurs d\'applications ciblant le marché francophone d\'Afrique de l\'Ouest.',
    contactPhone: '+221 77 00 00 00',
    highlightStat: '100%',
    highlightLabel: 'Appareils physiques certifiés',
  },
  {
    id: 'international',
    name: 'Europe & Diaspora — Partenaires & Éditeurs',
    country: 'International',
    flag: '🌍',
    type: 'international',
    tag: 'Mobilité & Éditeurs',
    address: 'Paris (France) • Bruxelles (Belgique) • Montréal (Canada)',
    universities: ['Programmes d\'échange France/Afrique', 'Bourses de mobilité', 'Stages Remote'],
    companies: ['Éditeurs SaaS Européens', 'Agences Mobile Paris', 'Studios de jeux indépendants'],
    activeTesters: '+ 850 développeurs accompagnés',
    description:
      'Mise en relation pour les stages à distance, mobilités académiques et accompagnement d\'éditeurs internationaux pour leurs tests Google Play.',
    contactPhone: '+33 1 00 00 00 00',
    highlightStat: 'Top 5%',
    highlightLabel: 'Visibilité internationale',
  },
];

export const International: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<HubItem>(HUBS[0]);

  return (
    <section
      id="agences"
      style={{
        padding: '6.5rem 0 6rem 0',
        backgroundColor: '#FAFAF9',
        position: 'relative',
        borderTop: '1px solid #E2E8F0',
      }}
    >
      <style>{`
        .hub-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hub-tabs-bar {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          overflow-x: auto;
          padding-bottom: 0.75rem;
          margin-bottom: 2.25rem;
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }

        .hub-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.75rem 1.35rem;
          border-radius: 9999px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #334155;
          font-weight: 700;
          font-size: 0.92rem;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          flex-shrink: 0;
        }

        .hub-tab-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          color: #0A1C38;
          transform: translateY(-2px);
        }

        .hub-tab-btn.active {
          background: #0A1C38;
          color: #FFFFFF;
          border-color: #0A1C38;
          box-shadow: 0 6px 18px rgba(10, 28, 56, 0.25);
          transform: translateY(-2px);
        }

        .hub-tab-tag {
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .hub-tab-btn.active .hub-tab-tag {
          background: rgba(249, 115, 22, 0.35);
          color: #FDBA74;
        }

        .hub-tab-btn:not(.active) .hub-tab-tag {
          background: #F1F5F9;
          color: #64748B;
        }

        .hub-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2.5rem;
          align-items: stretch;
        }

        @media (max-width: 900px) {
          .hub-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="hub-container">
        {/* Title Header */}
        <ScrollReveal direction="down" distance={25}>
          <div style={{ maxWidth: '820px', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1D4ED8',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
              }}
            >
              <Users size={14} />
              <span>Réseau & Écosystème Régional</span>
            </div>

            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)',
                fontWeight: 800,
                color: '#0A1C38',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}
            >
              Un réseau connecté aux campus et aux meilleures entreprises
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 1.25vw, 1.15rem)', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              SAMRE mobilise une communauté vérifiée de testeurs et d'étudiants répartis sur Lomé, Cotonou, Abidjan et Dakar, en partenariat avec les facultés et les entreprises leaders.
            </p>
          </div>
        </ScrollReveal>

        {/* Horizontal Hub Pill Tabs */}
        <div className="hub-tabs-bar">
          {HUBS.map((hub) => (
            <button
              key={hub.id}
              type="button"
              className={`hub-tab-btn ${selectedHub.id === hub.id ? 'active' : ''}`}
              onClick={() => setSelectedHub(hub)}
            >
              <span>{hub.flag}</span>
              <span>{hub.name.split('—')[0].trim()}</span>
              <span className="hub-tab-tag">{hub.tag}</span>
            </button>
          ))}
        </div>

        {/* 2-Column Dashboard */}
        <div className="hub-grid">
          {/* Column Left: Detailed Information of Selected Hub */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 30px -6px rgba(10, 28, 56, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Badge & Name */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    backgroundColor: '#FFF7ED',
                    color: '#EA580C',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    border: '1px solid #FED7AA',
                  }}
                >
                  {selectedHub.tag}
                </span>

                <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} />
                  {selectedHub.activeTesters}
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#0A1C38',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                {selectedHub.flag} {selectedHub.name}
              </h3>

              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
                {selectedHub.description}
              </p>

              {/* Address card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1.1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '2rem',
                }}
              >
                <MapPin size={20} color="#F97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Adresse & Coordonnées
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>
                    {selectedHub.address}
                  </div>
                </div>
              </div>

              {/* Universities & Companies Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Universities */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <GraduationCap size={18} color="#2563EB" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0A1C38' }}>
                      Écoles & Universités
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedHub.universities.map((uni, i) => (
                      <li key={i} style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#F97316' }} />
                        {uni}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Companies */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Building2 size={18} color="#10B981" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0A1C38' }}>
                      Entreprises & Recruteurs
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedHub.companies.map((comp, i) => (
                      <li key={i} style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Direct contact action */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
              <a
                href={`https://wa.me/22897317825?text=Bonjour%20SAMRE,%20je%20souhaite%20des%20renseignements%20sur%20le%20hub%20de%20${encodeURIComponent(selectedHub.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '999px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                }}
              >
                <MessageCircle size={16} />
                <span>Contacter le hub sur WhatsApp</span>
              </a>

              <a
                href="tel:+22897317825"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '999px',
                  backgroundColor: '#F8FAFC',
                  color: '#334155',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid #CBD5E1',
                }}
              >
                <Phone size={16} />
                <span>Appel direct</span>
              </a>
            </div>
          </div>

          {/* Column Right: Visual Infographic & Stats */}
          <div
            style={{
              backgroundColor: '#0A1C38',
              borderRadius: '24px',
              padding: '2.5rem',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px -6px rgba(10, 28, 56, 0.25)',
            }}
          >
            {/* Background glowing gradients */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F97316', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>
                <Sparkles size={16} />
                <span>Performance & Impact Terrain</span>
              </div>

              {/* Big Metric Display */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: 'clamp(3.5rem, 6vw, 4.8rem)', fontWeight: 800, color: '#F97316', lineHeight: 1 }}>
                  {selectedHub.highlightStat}
                </div>
                <div style={{ fontSize: '1rem', color: '#E2E8F0', fontWeight: 600, marginTop: '0.5rem' }}>
                  {selectedHub.highlightLabel}
                </div>
              </div>

              {/* Feature Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} color="#F97316" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Appareils réels audités & géolocalisés
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                      Chaque testeur de la région utilise son smartphone personnel avec suivi d'IP et d'opérateur réel.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} color="#10B981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Paiements directs T-Money & Flooz
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                      Les indemnités et récompenses de missions sont envoyées en monnaie locale sans frais bancaires.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} color="#38BDF8" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Conventions universitaires valides
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                      Les stages proposés respectent le calendrier académique et s'accompagnent de rapports officiels.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Call to action link */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#F97316',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                }}
              >
                <span>Proposer un partenariat universitaire ou entreprise</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default International;
