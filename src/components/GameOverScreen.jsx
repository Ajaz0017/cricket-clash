import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, House, Medal, RotateCcw } from 'lucide-react';
import { MODES, formatOvers, strikeRate } from '../lib/gameLogic';

function headline(state) {
  const { summary, endReason, mode } = state;
  if (mode === 'superover') {
    if (endReason === 'chased') {
      const balls = state.maxBalls - state.balls;
      const wkts = state.maxWickets - state.wicketsLost;
      return {
        title: 'Target Chased!',
        sub: `Won by ${wkts} wicket${wkts === 1 ? '' : 's'} with ${balls} ball${balls === 1 ? '' : 's'} to spare`,
        good: true,
      };
    }
    const short = state.target - state.runs;
    return short === 1
      ? { title: 'Match Tied!', sub: 'Scores level. So close!', good: false }
      : { title: 'Chase Failed', sub: `Fell short by ${short - 1} run${short - 1 === 1 ? '' : 's'}`, good: false };
  }
  if (summary?.isHighScore) return { title: 'New High Score!', sub: `Previous best was ${summary.prevBest}`, good: true };
  return {
    title: endReason === 'time' ? "Time's Up!" : 'All Out!',
    sub: summary?.prevBest ? `Your best: ${summary.prevBest}` : 'Every legend starts somewhere.',
    good: false,
  };
}

function Stat({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center"
    >
      <div className="font-display text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</div>
    </motion.div>
  );
}

export default function GameOverScreen({ state, onRestart, onHome }) {
  const { title, sub, good } = headline(state);

  useEffect(() => {
    const onKey = (e) => e.key === 'Enter' && onRestart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onRestart]);

  const stats = [
    ['Balls', state.balls],
    ['Strike rate', strikeRate(state.runs, state.balls)],
    ['Best streak', state.bestStreak],
    ['Won / Dot / Out', `${state.wins}/${state.ties}/${state.losses}`],
    ['Fours', state.fours],
    ['Sixes', state.sixes],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      className="mx-auto max-w-xl pt-4 md:pt-10"
    >
      <div className="glass relative overflow-hidden rounded-3xl p-6 text-center md:p-8">
        <div
          className={`absolute -top-32 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl ${
            good ? 'bg-amber-400/25' : 'bg-rose-500/20'
          }`}
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className={`relative mx-auto grid size-16 place-items-center rounded-2xl ${
            good ? 'bg-linear-to-br from-amber-300 to-orange-500 text-slate-950' : 'bg-white/10 text-white/70'
          }`}
        >
          {good ? <Crown className="size-8" /> : <Medal className="size-8" />}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`relative mt-4 font-display text-4xl md:text-5xl ${good ? 'text-gradient' : ''}`}
        >
          {title}
        </motion.h2>
        <p className="relative mt-1 text-white/55">{sub}</p>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 14 }}
          className="relative mt-6"
        >
          <div className="font-display text-7xl md:text-8xl">
            {state.runs}
            <span className="text-4xl text-white/35 md:text-5xl">/{state.wicketsLost}</span>
          </div>
          <div className="mt-1 text-sm text-white/50">
            {formatOvers(state.balls)} overs · {MODES[state.mode].name} · <span className="capitalize">{state.difficulty}</span>
            {state.target !== null && ` · Target ${state.target}`}
          </div>
          {state.summary?.rank && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Medal className="size-3.5" /> #{state.summary.rank} on your leaderboard
            </div>
          )}
        </motion.div>

        <div className="relative mt-6 grid grid-cols-3 gap-2">
          {stats.map(([label, value], i) => (
            <Stat key={label} label={label} value={value} delay={0.4 + i * 0.05} />
          ))}
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-400 to-cyan-400 py-3.5 font-display text-slate-950 shadow-lg shadow-emerald-500/30"
          >
            <RotateCcw className="size-4" /> Play again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onHome}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 py-3.5 font-display text-white/85 transition-colors hover:bg-white/10"
          >
            <House className="size-4" /> Main menu
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
