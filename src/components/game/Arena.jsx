import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { MoveIcon } from '../Icons';
import { DIFFICULTIES, MOVES, MOVE_INFO } from '../../lib/gameLogic';

const STATUS_STYLES = {
  win: 'border-emerald-400/70 shadow-[0_0_40px_-5px_var(--color-emerald-500)]',
  lose: 'border-rose-500/60 opacity-70',
  tie: 'border-amber-400/60',
};

function CyclingIcon({ className }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % MOVES.length), 90);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 0.35, repeat: Infinity }} className="opacity-70 blur-[1px]">
      <MoveIcon move={MOVES[i]} className={className} />
    </motion.div>
  );
}

function PlayerCard({ label, sub, move, status, cycling, bounce, revealKey }) {
  const iconClass = 'size-20 md:size-28';
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 md:gap-3">
      <div className="text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 md:text-xs">{label}</div>
        <div className="max-w-[9rem] truncate text-sm font-semibold md:text-base">{sub}</div>
      </div>
      <motion.div
        key={revealKey}
        initial={status === 'win' ? { scale: 0.9 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        className={`relative grid aspect-square w-full max-w-[190px] place-items-center rounded-3xl border-2 bg-white/[0.04] transition-[border-color,opacity,box-shadow] duration-300 ${
          STATUS_STYLES[status] ?? 'border-white/10'
        }`}
      >
        {status === 'win' && (
          <div className="absolute inset-0 rounded-3xl bg-radial from-emerald-400/25 to-transparent to-70%" />
        )}
        <AnimatePresence mode="popLayout">
          {cycling ? (
            <CyclingIcon key="cycling" className={iconClass} />
          ) : move ? (
            <motion.div
              key={`${move}-${revealKey}`}
              initial={{ scale: 0, rotate: -40 }}
              animate={bounce ? { scale: 1, rotate: 0, y: [0, -14, 0] } : { scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={
                bounce
                  ? { y: { duration: 0.35, repeat: Infinity }, default: { type: 'spring', stiffness: 400, damping: 14 } }
                  : { type: 'spring', stiffness: 400, damping: 14 }
              }
            >
              <MoveIcon move={move} className={iconClass} />
            </motion.div>
          ) : (
            <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-6xl text-white/15">
              ?
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="h-6 text-sm font-semibold text-white/80">{move && !cycling ? MOVE_INFO[move].label : ''}</div>
    </div>
  );
}

function ResultBanner({ state }) {
  const { phase, last } = state;
  const color = { win: 'text-emerald-300', lose: 'text-rose-400', tie: 'text-amber-300' };

  let sub = '';
  if (last) {
    const u = MOVE_INFO[last.user].label;
    const c = MOVE_INFO[last.comp].label;
    if (last.result === 'win') {
      sub = `+${last.runs} run${last.runs === 1 ? '' : 's'}${last.multiplier > 1 ? ` · x${last.multiplier} streak bonus` : ''} · ${u} beats ${c}`;
    } else if (last.result === 'lose') {
      sub = `${c} beats ${u} · Wicket down`;
    } else {
      sub = `Both played ${u} · No run`;
    }
  }

  return (
    <div className="mt-4 flex min-h-24 items-center justify-center text-center md:mt-6">
      <AnimatePresence mode="wait">
        {phase === 'revealing' ? (
          <motion.p
            key="revealing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-display text-lg tracking-wider text-white/70"
          >
            Bowler running in
            {[0, 1, 2].map((i) => (
              <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}>
                .
              </motion.span>
            ))}
          </motion.p>
        ) : last && phase === 'result' ? (
          <motion.div
            key={`result-${state.balls}`}
            initial={{ scale: 0.3, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 14 }}
          >
            <div className={`glow-text font-display text-5xl md:text-6xl ${color[last.result]}`}>{last.label}</div>
            <div className="mt-1 text-sm text-white/60">{sub}</div>
          </motion.div>
        ) : (
          <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/50">
            Pick <b className="text-white">Bat</b>, <b className="text-white">Ball</b> or <b className="text-white">Stump</b> to
            face the next delivery
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Arena({ state, playerName }) {
  const controls = useAnimationControls();
  const { phase, last, pendingMove, balls } = state;

  useEffect(() => {
    if (phase !== 'result' || !last) return;
    if (last.result === 'lose') {
      controls.start({ x: [0, -14, 14, -10, 10, -4, 0], transition: { duration: 0.5 } });
    } else if (last.result === 'win' && last.shot === 6) {
      controls.start({ scale: [1, 1.03, 1], transition: { duration: 0.4 } });
    }
  }, [balls, phase, last, controls]);

  const revealing = phase === 'revealing';
  const showResult = phase === 'result' && last;
  const userStatus = showResult ? last.result : null;
  const compStatus = showResult ? { win: 'lose', lose: 'win', tie: 'tie' }[last.result] : null;

  return (
    <motion.section animate={controls} className="glass relative mt-4 overflow-hidden rounded-3xl p-4 md:mt-6 md:p-8">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-emerald-500/10 to-transparent" />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
        <PlayerCard
          label="You"
          sub={playerName?.trim() || 'Player'}
          move={revealing ? pendingMove : showResult ? last.user : null}
          status={userStatus}
          bounce={revealing}
          revealKey={balls}
        />

        <motion.div
          animate={revealing ? { rotate: 360, scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
          transition={revealing ? { rotate: { duration: 1, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.5, repeat: Infinity } } : {}}
          className="grid size-12 place-items-center rounded-full bg-linear-to-br from-emerald-400 to-cyan-500 font-display text-sm text-slate-950 shadow-lg shadow-cyan-500/30 md:size-16 md:text-lg"
        >
          VS
        </motion.div>

        <PlayerCard
          label="Computer"
          sub={`${DIFFICULTIES[state.difficulty].name} bowler`}
          move={showResult ? last.comp : null}
          status={compStatus}
          cycling={revealing}
          revealKey={balls}
        />
      </div>

      <ResultBanner state={state} />
    </motion.section>
  );
}
