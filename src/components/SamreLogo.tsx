import React from 'react';

interface SamreLogoProps {
  size?: number;
  showTagline?: boolean;
}

export const SamreLogo: React.FC<SamreLogoProps> = ({ size = 48, showTagline = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
      {/* Emblème officiel Samré avec son encart lumineux comme sur la maquette */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size + 10}px`,
          height: `${size + 10}px`,
          borderRadius: '14px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 16px rgba(242, 129, 29, 0.18)',
          border: '1px solid rgba(242, 129, 29, 0.15)',
          flexShrink: 0,
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Samré"
          style={{
            width: `${size - 2}px`,
            height: `${size - 2}px`,
            objectFit: 'contain',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily: 'Outfit, "Plus Jakarta Sans", sans-serif',
            fontWeight: 900,
            fontSize: `${size * 0.38}px`,
            color: '#0a1c38',
            letterSpacing: '-0.025em',
            lineHeight: 1
          }}
        >
          SAMRE
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: `${Math.max(size * 0.18, 10)}px`,
              fontWeight: 800,
              color: '#f2811d',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginTop: '4px',
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
