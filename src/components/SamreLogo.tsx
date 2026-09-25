import React from 'react';

interface SamreLogoProps {
  size?: number;
  showTagline?: boolean;
}

export const SamreLogo: React.FC<SamreLogoProps> = ({ size = 42, showTagline = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      {/* Emblème officiel Samré sans boîte grise ni bordure */}
      <img
        src="/logo.png"
        alt="Logo Samré"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 6px rgba(249, 115, 22, 0.2))'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily: 'Outfit, "Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            fontSize: '1.45rem',
            color: '#0a1c38',
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}
        >
          SAMRE
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#f97316',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '3px',
              lineHeight: 1
            }}
          >
            STAGES & TESTS
          </span>
        )}
      </div>
    </div>
  );
};

export default SamreLogo;
