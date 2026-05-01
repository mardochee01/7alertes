interface CrownSvgProps {
  id?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CrownSvg({ id = "cg", width = 120, height = 90, className, style }: CrownSvgProps) {
  const gradId = `cg-${id}`;
  const baseId = `cb-${id}`;

  // 7-spike crown — spikes at x: 6, 24, 42, 60, 78, 96, 114
  // Heights decrease from center outward
  // Valleys at y=54 between each spike
  const path =
    "M6 68 " +
    "L6 38 L15 54 " +   // spike 1 + valley
    "L24 22 L33 54 " +  // spike 2 + valley
    "L42 14 L51 54 " +  // spike 3 + valley
    "L60 5 " +          // spike 4 (center, tallest)
    "L69 54 L78 14 " +  // valley + spike 5
    "L87 54 L96 22 " +  // valley + spike 6
    "L105 54 L114 38 " + // valley + spike 7
    "L114 68 Z";

  return (
    <svg width={width} height={height} viewBox="0 0 120 90" fill="none" className={className} style={style}>
      <path d={path} fill={`url(#${gradId})`} />

      {/* Jewel on each spike tip */}
      <circle cx="6"   cy="38" r="3.5" fill="#C9A84C" />
      <circle cx="24"  cy="22" r="4"   fill="#C9A84C" />
      <circle cx="42"  cy="14" r="4.5" fill="#D4B05A" />
      <circle cx="60"  cy="5"  r="6"   fill="#E8C96A" />
      <circle cx="78"  cy="14" r="4.5" fill="#D4B05A" />
      <circle cx="96"  cy="22" r="4"   fill="#C9A84C" />
      <circle cx="114" cy="38" r="3.5" fill="#C9A84C" />

      {/* Base band */}
      <rect x="6" y="67" width="108" height="14" rx="4" fill={`url(#${baseId})`} />

      <defs>
        <linearGradient id={gradId} x1="60" y1="5" x2="60" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F0D47A" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id={baseId} x1="6" y1="68" x2="114" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#A8882A" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#A8882A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
