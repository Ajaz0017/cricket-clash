import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Swords, Target, Timer, User } from 'lucide-react';
import { MoveIcon } from './Icons';
import { DIFFICULTIES, MODES, MOVES, MOVE_INFO } from '../lib/gameLogic';
import { getBest, getLastScore, getStats } from '../lib/storage';

const MODE_ICONS = { classic: Swords, time: Timer, superover: Target };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

function StatPill({ label, value }) {
  return (
    <div className="glass rounded-2xl px-3 py-2.5 text-center">
      <div className="font-display text-xl md:text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</div>
    </div>
  );
}

export default function HomeScreen({ name, setName, prefs, setPrefs, onStart }) {
  const stats = useMemo(getStats, []);
  const best = useMemo(() => getBest(prefs.mode), [prefs.mode]);
  const last = useMemo(() => getLastScore(prefs.mode), [prefs.mode]);
  const winRate = stats.balls ? Math.round((stats.wins / stats.balls) * 100) : 0;

  const submit = (e) => {
    e.preventDefault();
    onStart(prefs.mode, prefs.difficulty);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="grid items-center gap-8 pt-4 md:grid-cols-[1.1fr_1fr] md:gap-10 md:pt-10"
    >
      {/* Hero */}
      <div className="text-center md:text-left">
        <motion.div
          variants={item}
          className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white/70"
        >
          <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
          Bat · Ball · Stump
        </motion.div>

        <motion.h1 variants={item} className="mt-5 font-display text-6xl leading-[0.95] md:text-8xl">
          <span className="block">CRICKET</span>
          <span className="text-gradient block">CLASH</span>
        </motion.h1>

        <motion.p variants={item} className="mx-auto mt-5 max-w-md text-white/60 md:mx-0">
          The classic Bat-Ball-Stump showdown, reimagined. Outsmart the bowler, build streaks, smash sixes and
          climb the leaderboard.
        </motion.p>

        <motion.div variants={item} className="mt-8 flex justify-center gap-4 md:justify-start">
          {MOVES.map((m, i) => (
            <motion.div
              key={m}
              animate={{ y: [0, -12, 0], rotate: [0, i % 2 ? 6 : -6, 0] }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              className="glass grid size-20 place-items-center rounded-2xl md:size-24"
            >
              <MoveIcon move={m} className="size-12 md:size-14" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-5 flex flex-wrap justify-center gap-2 text-xs md:justify-start">
          {MOVES.map((m) => (
            <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">
              <b className="text-white">{MOVE_INFO[m].label}</b> beats {MOVE_INFO[MOVE_INFO[m].beats].label}
            </span>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-8 grid grid-cols-4 gap-2">
          <StatPill label="Best" value={best} />
          <StatPill label="Last" value={last ?? '—'} />
          <StatPill label="Games" value={stats.games} />
          <StatPill label="Win %" value={`${winRate}%`} />
        </motion.div>
      </div>

      {/* Setup card */}
      <motion.form
        variants={item}
        onSubmit={submit}
        className="glass relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-black/40 md:p-7"
      >
        <div className="absolute -right-24 -top-24 size-56 rounded-full bg-emerald-500/20 blur-3xl" />

        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50" htmlFor="player">
          Player name
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3 focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20">
          <User className="size-4 text-white/40" />
          <input
            id="player"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            placeholder="Enter your name"
            className="w-full bg-transparent py-3 outline-none placeholder:text-white/30"
          />
        </div>

        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Game mode</div>
        <div className="mt-2 grid gap-2">
          {Object.values(MODES).map((mode) => {
            const Icon = MODE_ICONS[mode.id];
            const selected = prefs.mode === mode.id;
            return (
              <motion.button
                type="button"
                key={mode.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPrefs((p) => ({ ...p, mode: mode.id }))}
                className={`relative flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  selected ? 'border-emerald-400/60' : 'border-white/10 hover:border-white/25'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="mode-highlight"
                    className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/20 to-cyan-500/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative grid size-10 shrink-0 place-items-center rounded-xl ${
                    selected ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="relative min-w-0">
                  <span className="flex items-center gap-2 font-semibold">
                    {mode.name}
                    <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-300/80">
                      {mode.tagline}
                    </span>
                  </span>
                  <span className="block text-xs text-white/50">{mode.desc}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Difficulty</div>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-black/30 p-1">
          {Object.entries(DIFFICULTIES).map(([id, d]) => {
            const selected = prefs.difficulty === id;
            return (
              <button
                type="button"
                key={id}
                onClick={() => setPrefs((p) => ({ ...p, difficulty: id }))}
                className="relative rounded-xl px-2 py-2 text-center"
              >
                {selected && (
                  <motion.span
                    layoutId="difficulty-pill"
                    className="absolute inset-0 rounded-xl bg-white/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative block text-sm font-semibold ${selected ? 'text-white' : 'text-white/60'}`}>
                  {d.name}
                </span>
                <span className="relative block text-[10px] text-white/40">{d.desc}</span>
              </button>
            );
          })}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 py-4 font-display text-lg text-slate-950 shadow-lg shadow-emerald-500/30"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40 blur-md" />
          <Play className="relative size-5 fill-current" />
          <span className="relative">Start Innings</span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
