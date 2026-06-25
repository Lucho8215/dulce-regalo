import React from 'react';
import { Link } from 'react-router-dom';

// Logo SVG profesional de Dulce Regalo
const LogoIcon = ({ size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF69B4" />
        <stop offset="100%" stopColor="#FF1493" />
      </linearGradient>
      <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB6C1" />
        <stop offset="100%" stopColor="#FF69B4" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffe4f0" stopOpacity="0.9" />
      </linearGradient>
    </defs>

    {/* Sombra suave */}
    <ellipse cx="32" cy="58" rx="18" ry="3" fill="#FF69B4" opacity="0.15" />

    {/* Cuerpo de la caja */}
    <rect x="10" y="30" width="44" height="26" rx="4" fill="url(#boxGrad)" />

    {/* Tapa de la caja */}
    <rect x="8" y="24" width="48" height="10" rx="3" fill="url(#lidGrad)" />

    {/* Cinta vertical en la caja */}
    <rect x="29" y="30" width="6" height="26" fill="url(#ribbonGrad)" opacity="0.85" />

    {/* Cinta horizontal en la tapa */}
    <rect x="8" y="27" width="48" height="4" fill="url(#ribbonGrad)" opacity="0.85" />

    {/* Lazo izquierdo */}
    <path d="M32 24 C24 14 12 12 14 20 C16 26 26 24 32 24Z" fill="#FF1493" opacity="0.9" />
    {/* Lazo derecho */}
    <path d="M32 24 C40 14 52 12 50 20 C48 26 38 24 32 24Z" fill="#FF1493" opacity="0.9" />
    {/* Centro del lazo */}
    <circle cx="32" cy="24" r="4" fill="#FF69B4" />
    <circle cx="32" cy="24" r="2.5" fill="#fff" opacity="0.6" />

    {/* Corazón en la caja */}
    <path
      d="M32 48 C32 48 24 42 24 38 C24 35.5 26 34 28 34 C30 34 31.5 35.5 32 36 C32.5 35.5 34 34 36 34 C38 34 40 35.5 40 38 C40 42 32 48 32 48Z"
      fill="white"
      opacity="0.9"
    />

    {/* Destellos decorativos */}
    <circle cx="52" cy="18" r="1.5" fill="#FF69B4" opacity="0.7" />
    <circle cx="12" cy="15" r="1" fill="#FFB6C1" opacity="0.8" />
    <path d="M56 28 L57.5 25 L59 28 L56 28Z" fill="#FF69B4" opacity="0.5" />
    <path d="M6 32 L7 29.5 L8 32 L6 32Z" fill="#FFB6C1" opacity="0.5" />
    <circle cx="55" cy="22" r="0.8" fill="#FF1493" opacity="0.6" />
    <circle cx="9" cy="22" r="0.8" fill="#FF1493" opacity="0.6" />
  </svg>
);

const BrandLogo = ({ size = 'md', showTagline = true, linkTo = '/' }) => {
  const sizes = {
    sm: { icon: 38,  title: '2rem',   tagline: '0.68rem', gap: '10px' },
    md: { icon: 54,  title: '3rem',   tagline: '0.8rem',  gap: '13px' },
    lg: { icon: 68,  title: '3.6rem', tagline: '0.92rem', gap: '15px' },
  };

  const s = sizes[size] || sizes.md;

  const colors = ['#E91E8C','#FF5722','#FFC107','#4CAF50','#E91E8C','#E91E8C','#2196F3','#FF5722','#9C27B0','#E91E8C','#FF5722','#4CAF50'];

  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <LogoIcon size={s.icon} />
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: '"Modak", "Fredoka One", cursive',
          fontSize: s.title,
          fontWeight: 900,
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))',
        }}>
          {['D','u','l','c','e',' ','R','e','g','a','l','o'].map((letter, i) => (
            <span
              key={i}
              style={{
                color: letter === ' ' ? 'transparent' : colors[i],
                display: 'inline-block',
                width: letter === ' ' ? '0.28em' : 'auto',
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        {showTagline && (
          <div style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: s.tagline,
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#E91E8C',
            opacity: 0.9,
            letterSpacing: '0.15em',
            marginTop: '3px',
          }}>
            Detalles con amor
          </div>
        )}
      </div>
    </div>
  );

  if (!linkTo) return content;

  return (
    <a href={linkTo} style={{ textDecoration: 'none' }}>
      {content}
    </a>
  );
};

export { LogoIcon };
export default BrandLogo;
