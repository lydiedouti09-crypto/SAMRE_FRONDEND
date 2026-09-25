import React, { useState } from 'react';
import { Plus, Minus, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FaqItem {
  id: string;
  category: 'testing' | 'stage' | 'paiement' | 'general';
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    category: 'testing',
    question: 'Comment SAMRE garantit-il la conformité des 14 jours exigée par Google Play ?',
    answer:
      'Google exige au minimum 20 testeurs uniques utilisant activement l\'application pendant 14 jours consécutifs. SAMRE mobilise une cohorte de testeurs vérifiés avec appareils physiques distincts (pas d\'émulateurs). Chaque jour, chaque testeur ouvre l\'application pendant au moins 25 secondes et soumet un code d\'authentification unique horodaté (ex: SAM-J02). Les rapports d\'activité sont directement exportables pour votre dossier Google Play Console.',
  },
  {
    id: '2',
    category: 'stage',
    question: 'Comment postuler à une offre de stage ou d\'emploi sur SAMRE ?',
    answer:
      'Il vous suffit de créer votre compte candidat, de renseigner vos compétences et d\'importer votre CV. Une fois votre profil complété, vous pouvez postuler en 1 clic à toutes les offres de nos entreprises partenaires (banques, agences digitales, startups). Si votre profil dispose de badges de testeur certifié, votre candidature est mise en tête de liste.',
  },
  {
    id: '3',
    category: 'paiement',
    question: 'Comment et quand les testeurs sont-ils payés ?',
    answer:
      'Chaque mission de test validée génère des récompenses en FCFA. Dès qu\'un cycle de test est complété ou qu\'une étape est validée, vous pouvez demander le retrait immédiat de vos gains via T-Money (Togocom) ou Moov Money (Flooz). Le virement est instantané et sans frais cachés.',
  },
  {
    id: '4',
    category: 'testing',
    question: 'Je suis développeur : en combien de temps ma cohorte de testeurs est-elle opérationnelle ?',
    answer:
      'Dès la soumission de votre lien Google Play (version fermée ou lien de groupe de test), notre algorithme attribue 20 testeurs qualifiés sous 2 heures. La campagne de 14 jours démarre dès le lendemain matin et vous pouvez suivre les statistiques de connexion en temps réel sur votre tableau de bord.',
  },
  {
    id: '5',
    category: 'stage',
    question: 'Les stages proposés sur SAMRE sont-ils tous rémunérés ?',
    answer:
      'Oui, SAMRE signe une charte avec toutes les entreprises partenaires pour garantir une indemnité de stage légale et décente (généralement entre 50 000 et 100 000 FCFA/mois selon le niveau). De plus, une convention de stage officielle est établie pour votre université.',
  },
  {
    id: '6',
    category: 'general',
    question: 'L\'inscription sur la plateforme SAMRE est-elle payante ?',
    answer:
      'Non, l\'inscription est 100% gratuite pour les testeurs et les étudiants candidats. Pour les développeurs et entreprises, SAMRE propose des forfaits transparents pour le recrutement de testeurs ou la publication d\'offres de stages premium.',
  },
  {
    id: '7',
    category: 'paiement',
    question: 'Que se passe-t-il si un testeur rate un jour de test ?',
    answer:
      'Pour éviter tout risque d\'invalidation par Google Play, SAMRE prévoit une réserve automatique de 2 à 4 testeurs suppléants pour chaque campagne. Si un testeur est indisponible, un suppléant prend immédiatement le relais pour garantir les 20 sessions quotidiennes requises.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Toutes les questions' },
  { id: 'testing', label: 'Closed Testing 14 Jours' },
  { id: 'stage', label: 'Stages & Recrutement' },
  { id: 'paiement', label: 'Paiements T-Money / Flooz' },
  { id: 'general', label: 'Adhésion & Fonctionnement' },
];

export const Faq: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '1': true,
    '2': false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="faq"
      style={{
        backgroundColor: '#FFFFFF',
        padding: '5.5rem 0 4.5rem 0',
        position: 'relative',
        borderTop: '1px solid #F1F5F9',
      }}
    >
      <style>{`
        .faq-wrap {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .faq-cat-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.65rem 1.25rem;
          border-radius: 9999px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .faq-cat-btn:hover {
          background: #F8FAFC;
          color: #0A1C38;
          border-color: #CBD5E1;
        }

        .faq-cat-btn.active {
          background: #0A1C38;
          color: #FFFFFF;
          border-color: #0A1C38;
          box-shadow: 0 4px 14px rgba(10, 28, 56, 0.2);
        }

        .faq-item-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          margin-bottom: 1rem;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .faq-item-card:hover {
          border-color: #FDBA74;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
        }

        .faq-question-btn {
          width: 100%;
          text-align: left;
          padding: 1.35rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0A1C38;
        }

        .faq-answer-wrap {
          padding: 0 1.5rem 1.35rem 1.5rem;
          color: #475569;
          font-size: 0.96rem;
          line-height: 1.7;
        }
      `}</style>

      <div className="faq-wrap">
        {/* Title */}
        <ScrollReveal direction="down" distance={20}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '1rem',
              }}
            >
              <HelpCircle size={14} />
              <span>Questions Fréquentes</span>
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
              Tout ce que vous devez savoir sur SAMRE
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              Des réponses claires sur le protocole de test Google Play 14 jours, les candidatures de stage et les paiements mobiles.
            </p>
          </div>
        </ScrollReveal>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Rechercher une question (Google Play, T-Money, stage, délais...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.95rem 1.25rem 0.95rem 3.2rem',
              borderRadius: '9999px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.96rem',
              outline: 'none',
              boxSizing: 'border-box',
              color: '#0A1C38',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#F97316')}
            onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2.5rem', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`faq-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div key={faq.id} className="faq-item-card">
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isOpen ? '#FFF7ED' : '#F1F5F9',
                        color: isOpen ? '#EA580C' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-wrap">
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
              Aucune question ne correspond à votre recherche.
            </div>
          )}
        </div>

        {/* Reassurance Footer */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '2rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A1C38' }}>
            Vous avez une question spécifique ou un projet sur mesure ?
          </div>
          <p style={{ fontSize: '0.94rem', color: '#64748B', margin: 0, maxWidth: '600px' }}>
            Nos équipes techniques et conseillers stages vous répondent instantanément par WhatsApp ou directement par email.
          </p>
          <a
            href="https://wa.me/22897317825?text=Bonjour%20SAMRE,%20j'ai%20une%20question%20spécifique"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.8rem',
              borderRadius: '999px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.92rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
            }}
          >
            <MessageSquare size={16} />
            <span>Poser ma question sur WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faq;
