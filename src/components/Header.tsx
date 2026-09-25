import React, { useState, useRef, useEffect } from 'react';
import Link from '@/lib/router';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Smartphone,
  MessageSquare,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';
import SamreLogo from '@/components/SamreLogo';

interface HeaderProps {
  onOpenPreApproval?: () => void;
}

const ALL_SECTION_IDS = [
  'hero',
  'services',
  'testing-mobile',
  'agences',
  'apropos',
  'temoignages',
  'faq',
  'contact',
];

export const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>('hero');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualSetRef = useRef<boolean>(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    const updateActive = () => {
      if (manualSetRef.current) return;
      if (visibleSections.size === 0) return;
      let bestId = 'hero';
      let bestRatio = 0;
      visibleSections.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      setActiveLink(bestId);
    };

    ALL_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }
            updateActive();
          });
        },
        {
          rootMargin: '-10% 0px -60% 0px',
          threshold: [0, 0.1, 0.25, 0.5, 1.0],
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (id: string) => {
    setActiveLink(id);
    manualSetRef.current = true;
    setTimeout(() => {
      manualSetRef.current = false;
    }, 1200);
  };

  const primaryNavItems: { id: string; label: string; href: string }[] = [
    { id: 'hero', label: 'Accueil', href: '#' },
    { id: 'services', label: 'Nos services', href: '#services' },
    { id: 'agences', label: 'Agences', href: '#agences' },
    { id: 'apropos', label: 'À propos', href: '#apropos' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  const dropdownItems = [
    {
      id: 'testing-mobile',
      label: 'Missions de Test Rémunérées',
      description: 'Gagnez des revenus en testant des apps 25s/jour',
      icon: Smartphone,
      href: '#testing-mobile',
    },
    {
      id: 'temoignages',
      label: 'Témoignages & Réussites',
      description: 'Retours d\'expérience de nos stagiaires et devs',
      icon: MessageSquare,
      href: '#temoignages',
    },
    {
      id: 'faq',
      label: 'Foire Aux Questions',
      description: 'Tout comprendre sur les stages et le testing',
      icon: HelpCircle,
      href: '#faq',
    },
  ];

  const isDropdownItemActive = dropdownItems.some((item) => activeLink === item.id);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 2px 12px -2px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Barre Principale de Navigation */}
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '84px',
          gap: '1rem',
        }}
      >
        {/* Logo SAMRE officiel style Medad */}
        <Link
          href="#hero"
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <SamreLogo size={42} />
        </Link>

        {/* Liens Centraux Desktop */}
        <nav
          className="desktop-menu"
          style={{ alignItems: 'center', gap: 'clamp(0.8rem, 1.4vw, 1.6rem)' }}
        >
          {primaryNavItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              style={{
                fontWeight: activeLink === item.id ? 700 : 500,
                fontSize: '0.92rem',
                color: activeLink === item.id ? '#f97316' : '#334155',
                padding: '0.5rem 0',
                position: 'relative',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f97316')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = activeLink === item.id ? '#f97316' : '#334155')
              }
            >
              <span>{item.label}</span>
              {activeLink === item.id && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: '#f97316',
                    borderRadius: '2px',
                  }}
                />
              )}
            </a>
          ))}

          {/* Menu Déroulant Découvrir */}
          <div
            ref={dropdownRef}
            style={{ position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: isDropdownItemActive ? '#fff7ed' : 'transparent',
                border: isDropdownItemActive ? '1px solid #fed7aa' : '1px solid transparent',
                borderRadius: '999px',
                padding: '0.4rem 0.75rem',
                fontWeight: isDropdownItemActive ? 700 : 500,
                fontSize: '0.92rem',
                color: isDropdownItemActive ? '#ea580c' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isDropdownItemActive) e.currentTarget.style.color = '#f97316';
              }}
              onMouseLeave={(e) => {
                if (!isDropdownItemActive) e.currentTarget.style.color = '#334155';
              }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span>Découvrir</span>
              <ChevronDown
                size={15}
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '-20px',
                  width: '320px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '0.5rem',
                  boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.12)',
                  border: '1px solid #f1f5f9',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                {dropdownItems.map((subItem) => {
                  const Icon = subItem.icon;
                  const isCurrent = activeLink === subItem.id;
                  return (
                    <a
                      key={subItem.id}
                      href={subItem.href}
                      onClick={() => {
                        handleNavClick(subItem.id);
                        setDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        backgroundColor: isCurrent ? '#fff7ed' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = isCurrent ? '#fff7ed' : 'transparent')
                      }
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          backgroundColor: isCurrent ? '#ffedd5' : '#fff7ed',
                          color: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a1c38' }}>
                          {subItem.label}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          {subItem.description}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Boutons d'Action Droite (Connexion & Inscription) */}
        <div className="desktop-actions" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/connexion"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '999px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0a1c38',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <LogIn size={15} color="#64748b" />
            <span>Se connecter</span>
          </Link>

          <Link
            href="/inscription"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.4rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px -2px rgba(249, 115, 22, 0.35)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px -2px rgba(249, 115, 22, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px -2px rgba(249, 115, 22, 0.35)';
            }}
          >
            <UserPlus size={15} />
            <span>Rejoindre Samré</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Toggle Menu Mobile */}
        <div className="mobile-toggle" style={{ alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Link
            href="/connexion"
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0a1c38',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
            }}
          >
            Connexion
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#0a1c38',
              cursor: 'pointer',
            }}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '84px 0 0 0',
            backgroundColor: 'rgba(10, 28, 56, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 99,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              maxHeight: 'calc(100vh - 90px)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Liens Principaux Mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
              {primaryNavItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: activeLink === item.id ? '#f97316' : '#1e293b',
                    backgroundColor: activeLink === item.id ? '#fff7ed' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} color={activeLink === item.id ? '#f97316' : '#94a3b8'} />
                </a>
              ))}
            </div>

            {/* Rubriques Complémentaires Mobile */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem',
                  paddingLeft: '0.5rem',
                }}
              >
                Services Spécialisés
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {dropdownItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        handleNavClick(item.id);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 0.85rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#334155',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#fff7ed',
                          color: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0a1c38' }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          {item.description}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CTAs Mobiles */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href="/inscription"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px -2px rgba(249, 115, 22, 0.35)',
                }}
              >
                <UserPlus size={16} />
                <span>Rejoindre la communauté</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-menu {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .desktop-menu {
            display: none !important;
          }
          .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
