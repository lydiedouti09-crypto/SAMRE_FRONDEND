import React from 'react';

interface SamreLogoProps {
  size?: number;
  showTagline?: boolean;
}

export const SamreLogo: React.FC<SamreLogoProps> = ({ size = 58, showTagline = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
      <img
        src="/ChatGPT Image 5 oct. 2026, 12_23_50.png"
        alt="Logo SAMRE"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          flexShrink: 0,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily: 'Outfit, "Plus Jakarta Sans", sans-serif',
            fontWeight: 900,
            fontSize: `${size * 0.48}px`,
            color: '#0a1c38',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          SAMRE
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: `${Math.max(size * 0.2, 10)}px`,
              fontWeight: 800,
              color: '#f2811d',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginTop: '4px',
              lineHeight: 1,
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
