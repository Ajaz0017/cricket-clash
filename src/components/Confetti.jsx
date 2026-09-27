import { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#34d399', '#22d3ee', '#a3e635', '#fbbf24', '#f472b6', '#f87171', '#ffffff'];

export default function Confetti({ count = 90 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 200,
        rotate: (Math.random() - 0.5) * 900,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 2,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        round: Math.random() > 0.7,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? '9999px' : '2px',
          }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '105vh', x: p.drift, rotate: p.rotate, opacity: [1, 1, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
