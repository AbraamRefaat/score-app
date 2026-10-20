import React from 'react';

interface MatchPlusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export const MatchPlusLogo: React.FC<MatchPlusLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  animate = false,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const dim = iconDimensions[size];
  const textSize = textSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric Emblem */}
      <div className={`relative ${dim} shrink-0 group`}>
        {/* Luminous athletic ambient aura */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#7ec815]/30 to-[#38bdf8]/20 rounded-2xl blur-[6px] opacity-75 group-hover:opacity-100 transition-opacity"></div>

        {/* Custom SVG Sports Shield & Electric Plus Mark */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full relative drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
            animate ? 'animate-[pulse_3s_ease-in-out_infinite]' : 'group-hover:scale-105'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Hexagon Surface Gradient */}
            <linearGradient id="shieldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#070a10" />
            </linearGradient>

            {/* Neon Green Glow Gradient */}
            <linearGradient id="neonGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>

            {/* Border Metallic Sheen */}
            <linearGradient id="metalStroke" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7ec815" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7ec815" />
            </linearGradient>

            {/* Filter for glowing neon element */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#7ec815" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Rounded Athletic Stadium Shield Body */}
          <path
            d="M50 6 L86 24 C86 24 92 65 50 94 C8 65 14 24 14 24 L50 6 Z"
            fill="url(#shieldGrad)"
            stroke="url(#metalStroke)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Subtle Football / Pitch Curvature Lines inside shield */}
          <path
            d="M26 36 C38 48 62 48 74 36"
            stroke="#ffffff"
            strokeOpacity="0.12"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M32 72 C42 60 58 60 68 72"
            stroke="#ffffff"
            strokeOpacity="0.12"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="16" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />

          {/* Dynamic Speed Wings forming Stylized Arabic 'م' & Match Energy */}
          <path
            d="M30 45 C30 35 40 28 50 28 C60 28 70 35 70 45 C70 54 62 61 50 61 C45 61 40 59 36 55 L28 65"
            stroke="url(#neonGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowEffect)"
          />

          {/* High-Impact Electric '+' Symbol anchored at top-right of the logo */}
          <g filter="url(#glowEffect)">
            {/* Horizontal bar of Plus */}
            <rect x="56" y="38" width="22" height="6" rx="3" fill="#ffffff" />
            {/* Vertical bar of Plus */}
            <rect x="64" y="30" width="6" height="22" rx="3" fill="#ffffff" />
          </g>

          {/* Core Energy Pivot Spot */}
          <circle cx="50" cy="44" r="3.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div dir="ltr" className="flex items-center gap-1.5 leading-none">
          {/* Neon Plus with athletic slant */}
          <span className={`font-black text-[#7ec815] font-sans tracking-tight leading-none ${textSize}`}>
            +
          </span>
          {/* Bold Arabic Brand Name with modern typography */}
          <span className={`font-black text-white tracking-normal font-sans leading-none ${textSize}`}>
            ماتش
          </span>
        </div>
      )}
    </div>
  );
};
