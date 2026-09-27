import { useId } from 'react';

const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, '');

export function BatIcon({ className = '' }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-blade`} x1="0" x2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <g transform="rotate(35 32 32)">
        <rect x="29" y="1" width="6" height="19" rx="3" fill="#1f2937" />
        <rect x="29" y="5" width="6" height="2" fill="#ef4444" />
        <rect x="29" y="10" width="6" height="2" fill="#ef4444" />
        <rect x="29" y="15" width="6" height="2" fill="#ef4444" />
        <path
          d="M24 19h16a2 2 0 0 1 2 2v35a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7V21a2 2 0 0 1 2-2z"
          fill={`url(#${id}-blade)`}
        />
        <path d="M32 23v35" stroke="#b45309" strokeWidth="1.5" opacity="0.45" />
      </g>
    </svg>
  );
}

export function BallIcon({ className = '' }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-ball`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fca5a5" />
          <stop offset="0.5" stopColor="#dc2626" />
          <stop offset="1" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill={`url(#${id}-ball)`} />
      <path d="M19 13c9 12 9 26 0 38" stroke="#fef2f2" strokeWidth="1.6" fill="none" strokeDasharray="2 2.5" />
      <path d="M45 13c-9 12-9 26 0 38" stroke="#fef2f2" strokeWidth="1.6" fill="none" strokeDasharray="2 2.5" />
      <ellipse cx="24" cy="21" rx="6" ry="3.5" fill="#fff" opacity="0.25" transform="rotate(-30 24 21)" />
    </svg>
  );
}

export function StumpIcon({ className = '' }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" x2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="1" stopColor="#d6b27a" />
        </linearGradient>
      </defs>
      {[18, 30, 42].map((x) => (
        <rect key={x} x={x} y="14" width="5" height="44" rx="2.5" fill={`url(#${id}-wood)`} />
      ))}
      <rect x="16" y="9.5" width="14" height="3.5" rx="1.75" fill="#f59e0b" />
      <rect x="33" y="9.5" width="14" height="3.5" rx="1.75" fill="#f59e0b" />
      <rect x="10" y="57" width="44" height="3" rx="1.5" fill="#10b981" opacity="0.5" />
    </svg>
  );
}

const ICONS = { bat: BatIcon, ball: BallIcon, stump: StumpIcon };

export function MoveIcon({ move, className }) {
  const Icon = ICONS[move];
  return Icon ? <Icon className={className} /> : null;
}
