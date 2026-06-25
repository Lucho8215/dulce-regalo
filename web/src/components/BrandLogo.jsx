import React from 'react';

// ─────────────────────────────────────────────────────────────────
// ANIMACIONES CSS inyectadas como <style> dentro del componente
// Para cambiar la animación de las letras → editar "caerLetra"
// Para cambiar el brillo del tagline     → editar "shimmerRed"
// Para cambiar el flotado del tagline    → editar "floatTag"
// ─────────────────────────────────────────────────────────────────
const TAGLINE_ANIM = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

/* Brillo que se desliza de izquierda a derecha en "Detalles con amor" */
@keyframes shimmerRed {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Flotado suave arriba/abajo + leve rotación del tagline */
@keyframes floatTag {
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  50%       { transform: translateY(-3px) rotate(0.5deg); }
}

/* Letras de "Dulce Regalo" caen del cielo con rebote al aterrizar */
@keyframes caerLetra {
  0%   { transform: translateY(-80px) scaleY(0.6); opacity: 0; }   /* inicio arriba invisible */
  60%  { transform: translateY(6px)   scaleY(1.1); opacity: 1; }   /* rebote hacia abajo */
  75%  { transform: translateY(-4px)  scaleY(0.95); }              /* rebote hacia arriba */
  88%  { transform: translateY(3px)   scaleY(1.04); }              /* segundo rebote */
  100% { transform: translateY(0px)   scaleY(1);    opacity: 1; }  /* posición final */
}
`;

// ─────────────────────────────────────────────────────────────────
// ÍCONO SVG — caja de regalo con lazo y corazón
// Para cambiar colores del ícono editar los gradientes aquí abajo:
//   boxGrad  → color del cuerpo de la caja
//   lidGrad  → color de la tapa
//   ribbonGrad → color de la cinta
// ─────────────────────────────────────────────────────────────────
const LogoIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Gradiente del cuerpo de la caja */}
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF69B4" />
        <stop offset="100%" stopColor="#FF1493" />
      </linearGradient>
      {/* Gradiente de la tapa */}
      <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB6C1" />
        <stop offset="100%" stopColor="#FF69B4" />
      </linearGradient>
      {/* Gradiente de la cinta/lazo */}
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffe4f0" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="58" rx="18" ry="3" fill="#FF69B4" opacity="0.15" />  {/* sombra inferior */}
    <rect x="10" y="30" width="44" height="26" rx="4" fill="url(#boxGrad)" />  {/* cuerpo caja */}
    <rect x="8" y="24" width="48" height="10" rx="3" fill="url(#lidGrad)" />   {/* tapa caja */}
    <rect x="29" y="30" width="6" height="26" fill="url(#ribbonGrad)" opacity="0.85" />  {/* cinta vertical */}
    <rect x="8" y="27" width="48" height="4" fill="url(#ribbonGrad)" opacity="0.85" />   {/* cinta horizontal tapa */}
    <path d="M32 24 C24 14 12 12 14 20 C16 26 26 24 32 24Z" fill="#FF1493" opacity="0.9" />  {/* lazo izquierdo */}
    <path d="M32 24 C40 14 52 12 50 20 C48 26 38 24 32 24Z" fill="#FF1493" opacity="0.9" />  {/* lazo derecho */}
    <circle cx="32" cy="24" r="4" fill="#FF69B4" />           {/* centro del lazo */}
    <circle cx="32" cy="24" r="2.5" fill="#fff" opacity="0.6" /> {/* brillo centro lazo */}
    <path d="M32 48 C32 48 24 42 24 38 C24 35.5 26 34 28 34 C30 34 31.5 35.5 32 36 C32.5 35.5 34 34 36 34 C38 34 40 35.5 40 38 C40 42 32 48 32 48Z" fill="white" opacity="0.9" />  {/* corazón */}
    {/* Destellos decorativos alrededor */}
    <circle cx="52" cy="18" r="1.5" fill="#FF69B4" opacity="0.7" />
    <circle cx="12" cy="15" r="1" fill="#FFB6C1" opacity="0.8" />
    <path d="M56 28 L57.5 25 L59 28 L56 28Z" fill="#FF69B4" opacity="0.5" />
    <path d="M6 32 L7 29.5 L8 32 L6 32Z" fill="#FFB6C1" opacity="0.5" />
    <circle cx="55" cy="22" r="0.8" fill="#FF1493" opacity="0.6" />
    <circle cx="9" cy="22" r="0.8" fill="#FF1493" opacity="0.6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL BrandLogo
// Props:
//   size       → 'sm' | 'md' | 'lg'  (tamaño del logo)
//   showTagline → true | false         (muestra/oculta "Detalles con amor")
//   linkTo     → ruta del link        (null = sin link)
//
// Para cambiar tamaños → editar el objeto "sizes" abajo
// Para cambiar colores de letras → editar el array "colors"
// ─────────────────────────────────────────────────────────────────
const BrandLogo = ({ size = 'md', showTagline = true, linkTo = '/' }) => {

  // Tamaños por variante: ícono SVG, fuente título, fuente tagline, espacio entre ícono y texto
  // Para hacer el logo más grande/pequeño → cambiar los valores aquí
  const sizes = {
    sm: { icon: 38,  title: '2.1rem',  tagline: '0.82rem', gap: '10px' },
    md: { icon: 54,  title: '3.2rem',  tagline: '0.96rem', gap: '13px' },  // ← usado en el Header
    lg: { icon: 68,  title: '3.8rem',  tagline: '1.1rem',  gap: '15px' },  // ← usado en el Footer
  };

  const s = sizes[size] || sizes.md;

  // Colores de cada letra de "Dulce Regalo" (índice = posición de la letra)
  // Para cambiar un color → editar el color en la posición correspondiente
  // D=0  u=1  l=2  c=3  e=4  (espacio=5)  R=6  e=7  g=8  a=9  l=10  o=11
  const colors = ['#E91E8C','#FF5722','#FFC107','#4CAF50','#E91E8C','#E91E8C','#2196F3','#FF5722','#9C27B0','#E91E8C','#FF5722','#4CAF50'];

  const content = (
    <>
      {/* Inyectamos las animaciones CSS en el DOM */}
      <style>{TAGLINE_ANIM}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
        {/* Ícono de caja de regalo */}
        <LogoIcon size={s.icon} />

        <div style={{ lineHeight: 1 }}>

          {/* ── Título "Dulce Regalo" ──
              fontWeight: 500 = delgado. Cambiar a 700/900 para más grueso.
              Cada letra cae del cielo con la animación "caerLetra"
              animationDelay escalonado → cada letra cae 0.09s después de la anterior */}
          <div style={{
            fontFamily: '"Modak", "Fredoka One", cursive', // fuente display redondeada
            fontSize: s.title,
            fontWeight: 500,           // ← para más grueso cambiar a 700 o 900
            letterSpacing: '0.04em',   // ← espaciado entre letras
            lineHeight: 1.1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))', // sombra sutil
          }}>
            {['D','u','l','c','e',' ','R','e','g','a','l','o'].map((letter, i) => (
              <span
                key={i}
                style={{
                  color: letter === ' ' ? 'transparent' : colors[i], // espacio invisible
                  display: 'inline-block',
                  width: letter === ' ' ? '0.28em' : 'auto', // ancho del espacio entre palabras
                  animation: letter !== ' ' ? 'caerLetra 0.7s cubic-bezier(0.22,1,0.36,1) both' : 'none',
                  animationDelay: `${i * 0.09}s`, // ← cambiar 0.09 para más/menos velocidad en cascada
                  opacity: 0, // empieza invisible, la animación lo muestra
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          {/* ── Tagline "Detalles con amor" ──
              Fuente: Great Vibes (caligrafía delgada de Google Fonts)
              Efecto: gradiente rojo que brilla de izquierda a derecha (shimmerRed)
                    + flotado suave arriba/abajo (floatTag)
              Para cambiar el texto → editar el string abajo
              Para cambiar los colores del brillo → editar el "background" linear-gradient */}
          {showTagline && (
            <div style={{
              fontFamily: '"Great Vibes", cursive', // ← fuente caligráfica delgada
              fontSize: `calc(${s.tagline} * 1.9)`, // ← 1.9× el tagline base para que sea visible
              fontWeight: 400,           // ← 400 = delgado. No subir para mantener el look script
              letterSpacing: '0.05em',
              marginTop: '2px',
              lineHeight: 1,
              // Gradiente rojo-rosa que hace el efecto shimmer
              background: 'linear-gradient(90deg, #c0392b 0%, #ff6b6b 25%, #e91e8c 50%, #ff6b6b 75%, #c0392b 100%)',
              backgroundSize: '200% auto', // tamaño doble para que el shimmer se desplace
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', // hace el texto transparente para ver el gradiente
              backgroundClip: 'text',
              // shimmerRed 3.5s = velocidad del brillo | floatTag 4s = velocidad del flotado
              animation: 'shimmerRed 3.5s linear infinite, floatTag 4s ease-in-out infinite',
              display: 'inline-block',
            }}>
              Detalles con amor
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Si no hay linkTo, devolvemos solo el contenido sin envolver en <a>
  if (!linkTo) return content;

  return (
    <a href={linkTo} style={{ textDecoration: 'none' }}>
      {content}
    </a>
  );
};

export { LogoIcon };
export default BrandLogo;
