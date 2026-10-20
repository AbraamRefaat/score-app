import React, { useState } from 'react';

interface ClubBadgeProps {
  teamId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CLUB_OFFICIAL_CRESTS: Record<string, string> = {
  ahly: 'https://images.fotmob.com/image_resources/logo/teamlogo/8500.png',
  zamalek: 'https://images.fotmob.com/image_resources/logo/teamlogo/9721.png',
  pyramids: 'https://images.fotmob.com/image_resources/logo/teamlogo/992451.png',
  modern_sport: 'https://images.fotmob.com/image_resources/logo/teamlogo/1118225.png',
  realmadrid: 'https://images.fotmob.com/image_resources/logo/teamlogo/8633.png',
  mancity: 'https://images.fotmob.com/image_resources/logo/teamlogo/8456.png',
  liverpool: 'https://images.fotmob.com/image_resources/logo/teamlogo/8650.png',
  arsenal: 'https://images.fotmob.com/image_resources/logo/teamlogo/9825.png',
  barcelona: 'https://images.fotmob.com/image_resources/logo/teamlogo/8634.png',
  bayern: 'https://images.fotmob.com/image_resources/logo/teamlogo/9823.png',
  alhilal: 'https://images.fotmob.com/image_resources/logo/teamlogo/10202.png',
  alnassr: 'https://images.fotmob.com/image_resources/logo/teamlogo/9979.png',
};

const TOURNAMENT_OFFICIAL_LOGOS: Record<string, string> = {
  egy_pl: 'https://images.fotmob.com/image_resources/logo/leaguelogo/181.png',
  ucl: 'https://images.fotmob.com/image_resources/logo/leaguelogo/42.png',
  epl: 'https://images.fotmob.com/image_resources/logo/leaguelogo/47.png',
  laliga: 'https://images.fotmob.com/image_resources/logo/leaguelogo/87.png',
  saudi_pro: 'https://images.fotmob.com/image_resources/logo/leaguelogo/536.png',
};

export const ClubBadge: React.FC<ClubBadgeProps> = ({ teamId, size = 'md', className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dim = sizeClasses[size] || sizeClasses.md;
  const officialLogo = CLUB_OFFICIAL_CRESTS[teamId];

  if (officialLogo && !imgFailed) {
    return (
      <div className={`${dim} shrink-0 relative flex items-center justify-center p-0.5 ${className}`}>
        <img
          src={officialLogo}
          alt={teamId}
          onError={() => setImgFailed(true)}
          loading="lazy"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105"
        />
      </div>
    );
  }

  switch (teamId) {
    case 'ahly':
      // Al Ahly SC: Red shield with stylized eagle and championship stars
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
            {/* Shield Body */}
            <path
              d="M50 5 L88 18 V65 C88 95 50 115 50 115 C50 115 12 95 12 65 V18 Z"
              fill="#c6161d"
              stroke="#eab308"
              strokeWidth="3.5"
            />
            {/* Inner Gold Frame */}
            <path
              d="M50 12 L82 23 V63 C82 88 50 105 50 105 C50 105 18 88 18 63 V23 Z"
              fill="#991016"
            />
            {/* Top Stars */}
            <g fill="#eab308">
              <polygon points="32,19 34,24 39,24 35,27 37,32 32,29 27,32 29,27 25,24 30,24" />
              <polygon points="44,16 46,21 51,21 47,24 49,29 44,26 39,29 41,24 37,21 42,21" />
              <polygon points="56,16 58,21 63,21 59,24 61,29 56,26 51,29 53,24 49,21 54,21" />
              <polygon points="68,19 70,24 75,24 71,27 73,32 68,29 63,32 65,27 61,24 66,24" />
            </g>
            {/* Black Eagle Silhouette */}
            <path
              d="M50 38 C42 42 35 48 26 52 C31 58 38 61 44 63 C40 68 36 74 38 82 C43 78 47 74 50 71 C53 74 57 78 62 82 C64 74 60 68 56 63 C62 61 69 58 74 52 C65 48 58 42 50 38 Z"
              fill="#111827"
              stroke="#eab308"
              strokeWidth="1.5"
            />
            {/* Eagle Gold Eye */}
            <circle cx="50" cy="46" r="2.5" fill="#eab308" />
            {/* 1907 banner */}
            <rect x="34" y="90" width="32" height="11" rx="3" fill="#111827" />
            <text x="50" y="98.5" fill="#eab308" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1907</text>
          </svg>
        </div>
      );

    case 'zamalek':
      // Zamalek SC: White shield with two red stripes and red archer
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
            {/* White Shield */}
            <path
              d="M50 5 L88 18 V65 C88 95 50 115 50 115 C50 115 12 95 12 65 V18 Z"
              fill="#ffffff"
              stroke="#dc2626"
              strokeWidth="4"
            />
            {/* Two Iconic Red Horizontal Stripes */}
            <line x1="16" y1="42" x2="84" y2="42" stroke="#dc2626" strokeWidth="6" />
            <line x1="18" y1="56" x2="82" y2="56" stroke="#dc2626" strokeWidth="6" />
            {/* Red Pharaonic Archer */}
            <g fill="#dc2626" stroke="#dc2626">
              {/* Bow */}
              <path d="M42 66 C42 66 36 78 42 90" fill="none" strokeWidth="3" strokeLinecap="round" />
              {/* Arrow */}
              <line x1="36" y1="78" x2="68" y2="78" strokeWidth="2.5" />
              <polygon points="68,78 62,75 62,81" fill="#dc2626" />
              {/* Archer Body */}
              <circle cx="48" cy="72" r="3.5" />
              <line x1="48" y1="75" x2="52" y2="85" strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="85" x2="46" y2="95" strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="85" x2="58" y2="95" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Top Text / 1911 */}
            <text x="50" y="30" fill="#dc2626" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">ZAMALEK</text>
            <text x="50" y="106" fill="#111827" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1911</text>
          </svg>
        </div>
      );

    case 'realmadrid':
      // Real Madrid: Crown with golden circle, blue/purple sash and MFC monogram
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
            {/* Royal Crown */}
            <g fill="#f59e0b" stroke="#d97706" strokeWidth="1">
              <path d="M28 26 L32 14 L42 22 L50 8 L58 22 L68 14 L72 26 Z" />
              <circle cx="50" cy="7" r="3" fill="#dc2626" />
              <rect x="27" y="24" width="46" height="5" rx="2" fill="#d97706" />
            </g>
            {/* Circular Shield */}
            <circle cx="50" cy="65" r="38" fill="#ffffff" stroke="#f59e0b" strokeWidth="5" />
            {/* Purple Diagonal Sash */}
            <path d="M22 45 L78 85 L72 95 L16 55 Z" fill="#6366f1" opacity="0.9" />
            {/* Monogram stylized M C F */}
            <text x="50" y="74" fill="#f59e0b" fontSize="26" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">M</text>
          </svg>
        </div>
      );

    case 'mancity':
      // Manchester City: Sky blue circle, golden ship, red rose
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#6ba4b8" stroke="#1c2c5b" strokeWidth="5" />
            <circle cx="50" cy="50" r="38" fill="#ffffff" />
            {/* Inner Shield */}
            <path d="M30 30 H70 V55 C70 68 50 78 50 78 C50 78 30 68 30 55 Z" fill="#6ba4b8" />
            {/* Golden Sailing Ship */}
            <path d="M35 44 H65 L60 50 H40 Z M48 34 H52 V44 H48 Z M40 37 H46 V44 H40 Z" fill="#f59e0b" />
            {/* Red Rose */}
            <circle cx="50" cy="63" r="5" fill="#dc2626" />
          </svg>
        </div>
      );

    case 'liverpool':
      // Liverpool: Red shield with Liver Bird
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
            {/* Shankly gates top flames */}
            <g fill="#16a34a">
              <path d="M25 15 C25 8 35 12 35 6 C35 12 45 8 45 15 Z" />
              <path d="M55 15 C55 8 65 12 65 6 C65 12 75 8 75 15 Z" />
            </g>
            {/* Red Shield */}
            <path
              d="M50 18 L84 26 V68 C84 94 50 114 50 114 C50 114 16 94 16 68 V26 Z"
              fill="#c8102e"
              stroke="#00b2a9"
              strokeWidth="3.5"
            />
            {/* Liver Bird Silhouette in Gold */}
            <g fill="#f59e0b">
              <path d="M50 42 C46 44 44 48 44 54 C40 56 36 62 38 70 C42 68 46 68 50 72 C52 68 56 68 60 66 C62 58 58 52 54 50 C54 46 52 42 50 42 Z" />
              {/* Seaweed in beak */}
              <path d="M44 48 L38 46 M38 46 L36 50 M38 46 L35 44" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            {/* L.F.C. text */}
            <text x="50" y="88" fill="#f59e0b" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">L.F.C.</text>
          </svg>
        </div>
      );

    case 'arsenal':
      // Arsenal: Red shield with cannon
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
            <path
              d="M50 5 L88 18 V68 C88 96 50 115 50 115 C50 115 12 96 12 68 V18 Z"
              fill="#db0007"
              stroke="#023474"
              strokeWidth="4"
            />
            {/* Inner Gold Border */}
            <path
              d="M50 12 L82 23 V66 C82 90 50 107 50 107 C50 107 18 90 18 66 V23 Z"
              fill="none"
              stroke="#9c824a"
              strokeWidth="2"
            />
            {/* Top Arsenal text */}
            <text x="50" y="36" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">ARSENAL</text>
            {/* Golden Cannon pointing right */}
            <g fill="#9c824a">
              <rect x="28" y="58" width="38" height="9" rx="3" transform="rotate(-6 47 62)" />
              <circle cx="42" cy="74" r="11" fill="#9c824a" stroke="#023474" strokeWidth="2.5" />
              <circle cx="42" cy="74" r="4" fill="#023474" />
              <polygon points="66,54 75,53 74,62 65,63" />
            </g>
          </svg>
        </div>
      );

    case 'barcelona':
      // FC Barcelona: Blaugrana shield, St George Cross, Senyera
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md">
            {/* Gold Outlined Shield */}
            <path
              d="M15 15 H85 V50 C85 80 50 105 50 105 C50 105 15 80 15 50 Z"
              fill="#ffffff"
              stroke="#edbb00"
              strokeWidth="4"
            />
            {/* Top Left: St George Cross */}
            <rect x="17" y="17" width="32" height="30" fill="#ffffff" />
            <line x1="33" y1="17" x2="33" y2="47" stroke="#dc2626" strokeWidth="6" />
            <line x1="17" y1="32" x2="49" y2="32" stroke="#dc2626" strokeWidth="6" />
            {/* Top Right: Senyera yellow/red stripes */}
            <rect x="51" y="17" width="32" height="30" fill="#edbb00" />
            <line x1="57" y1="17" x2="57" y2="47" stroke="#dc2626" strokeWidth="4" />
            <line x1="65" y1="17" x2="65" y2="47" stroke="#dc2626" strokeWidth="4" />
            <line x1="73" y1="17" x2="73" y2="47" stroke="#dc2626" strokeWidth="4" />
            {/* Middle Gold Belt */}
            <rect x="17" y="47" width="66" height="8" fill="#edbb00" />
            {/* Bottom Blaugrana Stripes */}
            <path
              d="M17 55 H83 V58 C83 78 50 101 50 101 C50 101 17 78 17 58 Z"
              fill="#004d98"
            />
            <path d="M30 55 H42 V95 C36 90 30 84 30 75 Z" fill="#a50044" />
            <path d="M58 55 H70 V75 C70 84 64 90 58 95 Z" fill="#a50044" />
            {/* Ball in Center */}
            <circle cx="50" cy="74" r="7" fill="#edbb00" stroke="#111827" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'bayern':
      // Bayern Munich: Red ring with Bavarian diamonds
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#dc2626" stroke="#0066b2" strokeWidth="4" />
            <circle cx="50" cy="50" r="32" fill="#ffffff" />
            {/* Bavarian Diamonds Pattern */}
            <g clipPath="url(#bayern-clip)">
              <rect x="22" y="22" width="56" height="56" fill="#0066b2" />
              <polygon points="35,25 50,38 35,51 20,38" fill="#ffffff" />
              <polygon points="65,25 80,38 65,51 50,38" fill="#ffffff" />
              <polygon points="50,51 65,64 50,77 35,64" fill="#ffffff" />
              <polygon points="20,51 35,64 20,77 5,64" fill="#ffffff" />
            </g>
            <text x="50" y="16" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">FC BAYERN</text>
            <text x="50" y="91" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">MÜNCHEN</text>
          </svg>
        </div>
      );

    case 'alhilal':
      // Al Hilal SFC: Blue shield with crescent
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md">
            <path
              d="M50 5 L88 18 V65 C88 92 50 108 50 108 C50 108 12 92 12 65 V18 Z"
              fill="#002d72"
              stroke="#ffffff"
              strokeWidth="3"
            />
            {/* Crescent Moon */}
            <path
              d="M52 28 C38 28 26 40 26 55 C26 70 38 82 52 82 C44 76 38 66 38 55 C38 44 44 34 52 28 Z"
              fill="#ffffff"
            />
            {/* Football inside crescent */}
            <circle cx="56" cy="55" r="10" fill="#ffffff" />
            <circle cx="56" cy="55" r="7" fill="#002d72" />
            <text x="50" y="100" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">AL HILAL</text>
          </svg>
        </div>
      );

    case 'alnassr':
      // Al Nassr: Yellow & Blue with Royal Crown
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md">
            <path
              d="M50 5 L88 18 V65 C88 92 50 108 50 108 C50 108 12 92 12 65 V18 Z"
              fill="#facc15"
              stroke="#1e3a8a"
              strokeWidth="4"
            />
            {/* Royal Crown top */}
            <path d="M35 34 L40 22 L50 28 L60 22 L65 34 Z" fill="#1e3a8a" />
            {/* Arabic 'ن' letter or monogram */}
            <circle cx="50" cy="62" r="18" fill="none" stroke="#1e3a8a" strokeWidth="5" />
            <circle cx="50" cy="52" r="4" fill="#1e3a8a" />
            <text x="50" y="98" fill="#1e3a8a" fontSize="9" fontWeight="900" textAnchor="middle">AL NASSR</text>
          </svg>
        </div>
      );

    case 'pyramids':
      // Pyramids FC: Dark blue shield with pyramids
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md">
            <path
              d="M50 5 L88 18 V65 C88 92 50 108 50 108 C50 108 12 92 12 65 V18 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="3.5"
            />
            {/* Pyramids Geometry */}
            <polygon points="50,30 25,75 75,75" fill="#0284c7" opacity="0.9" />
            <polygon points="50,30 50,75 75,75" fill="#38bdf8" opacity="0.8" />
            <polygon points="65,45 45,82 85,82" fill="#0369a1" opacity="0.8" />
            <text x="50" y="98" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">PYRAMIDS FC</text>
          </svg>
        </div>
      );

    case 'lakers':
      // LA Lakers: Purple & Gold Basketball
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="44" fill="#552583" />
            <circle cx="50" cy="50" r="38" fill="#fdb927" stroke="#552583" strokeWidth="3" />
            <path d="M12 50 H88 M50 12 V88" stroke="#552583" strokeWidth="2.5" />
            <path d="M22 26 C36 36 36 64 22 74 M78 26 C64 36 64 64 78 74" fill="none" stroke="#552583" strokeWidth="2.5" />
            <text x="50" y="56" fill="#552583" fontSize="13" fontWeight="900" textAnchor="middle" fontStyle="italic">LAKERS</text>
          </svg>
        </div>
      );

    case 'celtics':
      // Boston Celtics: Lucky Clover
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#007a33" stroke="#ba9653" strokeWidth="3.5" />
            {/* 3-Leaf Clover */}
            <g fill="#ffffff">
              <circle cx="50" cy="38" r="14" />
              <circle cx="38" cy="54" r="14" />
              <circle cx="62" cy="54" r="14" />
              <path d="M47 56 C47 70 42 78 38 82" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      );

    default:
      // Fallback clean athletic shield
      return (
        <div className={`${dim} shrink-0 rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-white text-xs font-bold border border-neutral-600 shadow ${className}`}>
          {teamId.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};

interface TournamentBadgeProps {
  tournamentId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TournamentBadge: React.FC<TournamentBadgeProps> = ({ tournamentId, size = 'md', className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const officialLogo = TOURNAMENT_OFFICIAL_LOGOS[tournamentId];

  if (officialLogo && !imgFailed) {
    return (
      <div className={`${dim} shrink-0 relative flex items-center justify-center p-0.5 ${className}`}>
        <img
          src={officialLogo}
          alt={tournamentId}
          onError={() => setImgFailed(true)}
          loading="lazy"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        />
      </div>
    );
  }

  switch (tournamentId) {
    case 'egy_pl':
      // Egyptian Premier League Shield
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <circle cx="40" cy="40" r="36" fill="#1e293b" stroke="#eab308" strokeWidth="2.5" />
            {/* Egyptian Flag colors in arc */}
            <path d="M12 40 A28 28 0 0 1 68 40" stroke="#dc2626" strokeWidth="4" fill="none" />
            <path d="M12 40 A28 28 0 0 0 68 40" stroke="#111827" strokeWidth="4" fill="none" />
            {/* Golden Eagle in Center */}
            <polygon points="40,24 45,34 54,34 47,40 50,50 40,44 30,50 33,40 26,34 35,34" fill="#eab308" />
            <text x="40" y="66" fill="#eab308" fontSize="8" fontWeight="bold" textAnchor="middle">EPL</text>
          </svg>
        </div>
      );

    case 'ucl':
      // UEFA Champions League Starball
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <circle cx="40" cy="40" r="37" fill="#001438" stroke="#3b82f6" strokeWidth="2" />
            <g fill="#ffffff">
              {/* Starball stars */}
              <polygon points="40,14 42,21 49,21 43,25 45,32 40,27 35,32 37,25 31,21 38,21" />
              <polygon points="22,32 24,39 31,39 25,43 27,50 22,45 17,50 19,43 13,39 20,39" />
              <polygon points="58,32 60,39 67,39 61,43 63,50 58,45 53,50 55,43 49,39 56,39" />
              <polygon points="30,56 32,63 39,63 33,67 35,74 30,69 25,74 27,67 21,63 28,63" />
              <polygon points="50,56 52,63 59,63 53,67 55,74 50,69 45,74 47,67 41,63 48,63" />
            </g>
          </svg>
        </div>
      );

    case 'epl':
      // Premier League Crowned Lion
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#38003c" />
            {/* Crowned Lion in Cyan */}
            <g fill="#00ff87">
              <path d="M40 18 L43 24 L48 22 L46 28 L52 30 L45 36 C48 42 46 50 40 56 C34 50 32 42 35 36 L28 30 L34 28 L32 22 L37 24 Z" />
              <circle cx="40" cy="40" r="3" fill="#38003c" />
            </g>
            <text x="40" y="70" fill="#00ff87" fontSize="8" fontWeight="900" textAnchor="middle">PREMIER</text>
          </svg>
        </div>
      );

    case 'laliga':
      // La Liga Modern Icon
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#111827" stroke="#ff4b44" strokeWidth="2" />
            <path d="M26 24 V56 H54" stroke="#ff4b44" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M38 34 V56 H54" stroke="#ff4b44" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          </svg>
        </div>
      );

    case 'nba':
      // NBA Silhouette
      return (
        <div className={`${dim} shrink-0 relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 50 80" className="w-full h-full drop-shadow">
            <rect width="50" height="80" rx="10" fill="#1d428a" />
            <rect x="25" width="25" height="80" rx="0" fill="#c8102e" />
            {/* White Dribbler Silhouette */}
            <path d="M22 18 C24 16 26 18 26 22 C26 26 22 28 20 30 L28 42 L24 64 L16 46 L20 38 L14 44 L10 40 Z" fill="#ffffff" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`${dim} shrink-0 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 font-bold border border-neutral-700`}>
          🏆
        </div>
      );
  }
};
