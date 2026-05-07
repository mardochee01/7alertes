interface QueenAvatarProps {
  size?: number;
  className?: string;
}

export function QueenAvatar({ size = 96, className = "" }: QueenAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* ── Fond circulaire ───────────────────────── */}
      <circle cx="50" cy="50" r="50" fill="url(#bg)" />

      {/* ── Robe / épaules ────────────────────────── */}
      <ellipse cx="50" cy="91" rx="28" ry="18" fill="url(#dress)" />
      <ellipse cx="50" cy="85" rx="22" ry="14" fill="url(#dress2)" />
      {/* Col / décolleté */}
      <ellipse cx="50" cy="76" rx="10" ry="6" fill="#F5C9A0" opacity=".9" />

      {/* ── Cou ───────────────────────────────────── */}
      <rect x="44" y="64" width="12" height="14" rx="5" fill="#F5C9A0" />

      {/* ── Visage ────────────────────────────────── */}
      <ellipse cx="50" cy="57" rx="18" ry="20" fill="#F5C9A0" />
      {/* Joues rosées */}
      <ellipse cx="37" cy="60" rx="5" ry="3.5" fill="#F2A0A0" opacity=".35" />
      <ellipse cx="63" cy="60" rx="5" ry="3.5" fill="#F2A0A0" opacity=".35" />

      {/* ── Cheveux ───────────────────────────────── */}
      {/* Masse arrière */}
      <ellipse cx="50" cy="50" rx="21" ry="23" fill="#3D1F0A" />
      {/* Visage par-dessus */}
      <ellipse cx="50" cy="57" rx="18" ry="20" fill="#F5C9A0" />
      {/* Frange */}
      <path d="M32 46 Q36 38 50 37 Q64 38 68 46 Q62 42 50 42 Q38 42 32 46Z" fill="#3D1F0A" />
      {/* Mèches latérales */}
      <path d="M32 48 Q28 55 30 65 Q33 58 35 54Z" fill="#3D1F0A" />
      <path d="M68 48 Q72 55 70 65 Q67 58 65 54Z" fill="#3D1F0A" />

      {/* ── Yeux ──────────────────────────────────── */}
      <ellipse cx="42" cy="56" rx="4" ry="4.5" fill="white" />
      <ellipse cx="58" cy="56" rx="4" ry="4.5" fill="white" />
      <circle cx="43" cy="57" r="2.5" fill="#2C1A0E" />
      <circle cx="59" cy="57" r="2.5" fill="#2C1A0E" />
      {/* Reflet */}
      <circle cx="44" cy="55.5" r="1" fill="white" />
      <circle cx="60" cy="55.5" r="1" fill="white" />
      {/* Sourcils */}
      <path d="M38 51 Q42 49 46 51" stroke="#3D1F0A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M54 51 Q58 49 62 51" stroke="#3D1F0A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cils */}
      <path d="M38 52.5 L36.5 51" stroke="#3D1F0A" strokeWidth="1" strokeLinecap="round"/>
      <path d="M62 52.5 L63.5 51" stroke="#3D1F0A" strokeWidth="1" strokeLinecap="round"/>

      {/* ── Bouche ────────────────────────────────── */}
      <path d="M45 66 Q50 70 55 66" stroke="#C0706A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M46 66 Q50 68 54 66" fill="#E8928C" opacity=".6" />

      {/* ── Nez ───────────────────────────────────── */}
      <path d="M48 60 Q50 63 52 60" stroke="#D4A080" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* ── Couronne 7 pointes ────────────────────── */}
      <g transform="translate(29, 24) scale(0.42)">
        <path
          d="M6 38 L6 28 L13 38 L20 18 L27 38 L35 10 L43 38 L50 5 L57 38 L65 10 L73 38 L80 18 L87 38 L94 28 L94 38 Z"
          fill="url(#crown)"
        />
        {/* Joyaux */}
        <circle cx="6"  cy="28" r="3" fill="#E8C96A" />
        <circle cx="20" cy="18" r="3.5" fill="#C9A84C" />
        <circle cx="35" cy="10" r="4" fill="#E8C96A" />
        <circle cx="50" cy="5"  r="5" fill="#F0D47A" />
        <circle cx="65" cy="10" r="4" fill="#E8C96A" />
        <circle cx="80" cy="18" r="3.5" fill="#C9A84C" />
        <circle cx="94" cy="28" r="3" fill="#E8C96A" />
        {/* Base */}
        <rect x="2" y="37" width="96" height="10" rx="3" fill="url(#crownBase)" />
      </g>

      {/* ── Boucles d'oreilles ────────────────────── */}
      <circle cx="32" cy="62" r="3" fill="#C9A84C" opacity=".9" />
      <circle cx="68" cy="62" r="3" fill="#C9A84C" opacity=".9" />
      <circle cx="32" cy="67" r="2" fill="#E8C96A" opacity=".8" />
      <circle cx="68" cy="67" r="2" fill="#E8C96A" opacity=".8" />

      <defs>
        <radialGradient id="bg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4A0F1A" />
          <stop offset="100%" stopColor="#0F0205" />
        </radialGradient>
        <linearGradient id="dress" x1="50" y1="76" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8A6520" />
        </linearGradient>
        <linearGradient id="dress2" x1="50" y1="74" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8C96A" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id="crown" x1="50" y1="5" x2="50" y2="47" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5E4A0" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id="crownBase" x1="0" y1="0" x2="96" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8882A" />
          <stop offset="50%" stopColor="#E8C96A" />
          <stop offset="100%" stopColor="#A8882A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
