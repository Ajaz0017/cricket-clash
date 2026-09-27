import { useMemo } from 'react';
import { motion } from 'framer-motion';

const ORBS = [
  { className: 'left-[-10%] top-[-10%] size-[26rem] bg-emerald-500/20', x: [0, 60, 0], y: [0, 40, 0], duration: 18 },
  { className: 'right-[-15%] top-[20%] size-[30rem] bg-cyan-500/15', x: [0, -50, 0], y: [0, 60, 0], duration: 22 },
  { className: 'bottom-[-20%] left-[20%] size-[28rem] bg-lime-400/10', x: [0, 40, 0], y: [0, -40, 0], duration: 20 },
];

export default function Background() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="bg-stadium absolute inset-0" />
      <div className="bg-grid absolute inset-0 opacity-[0.05]" />

      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          animate={{ x: orb.x, y: orb.y }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Stadium floodlight beams */}
      <div className="absolute -top-20 left-[8%] h-[70vh] w-40 rotate-[20deg] bg-linear-to-b from-white/10 to-transparent blur-2xl" />
      <div className="absolute -top-20 right-[8%] h-[70vh] w-40 -rotate-[20deg] bg-linear-to-b from-white/10 to-transparent blur-2xl" />

      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -30] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
