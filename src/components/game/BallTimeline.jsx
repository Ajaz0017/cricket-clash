import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function chipStyle(ball) {
  if (ball.result === 'lose') return 'bg-rose-600 text-white';
  if (ball.result === 'tie') return 'bg-white/10 text-white/50';
  if (ball.shot === 6) return 'bg-fuchsia-500 text-white shadow-[0_0_14px_var(--color-fuchsia-500)]';
  if (ball.shot === 4) return 'bg-cyan-400 text-slate-950';
  return 'bg-emerald-500/80 text-slate-950';
}

const chipText = (ball) => (ball.result === 'lose' ? 'W' : ball.result === 'tie' ? '•' : ball.runs);

export default function BallTimeline({ history }) {
  const scroller = useRef(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  }, [history.length]);

  return (
    <div className="glass mt-4 flex items-center gap-3 rounded-2xl px-3 py-2.5">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">This innings</span>
      <div ref={scroller} className="no-scrollbar flex min-h-9 flex-1 items-center gap-1.5 overflow-x-auto">
        {history.length === 0 && <span className="text-xs text-white/30">No balls bowled yet</span>}
        {history.map((ball, i) => (
          <div key={i} className="flex shrink-0 items-center gap-1.5">
            {i > 0 && i % 6 === 0 && <span className="mx-1 h-6 w-px bg-white/20" />}
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className={`grid size-8 place-items-center rounded-full text-xs font-bold ${chipStyle(ball)}`}
            >
              {chipText(ball)}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
