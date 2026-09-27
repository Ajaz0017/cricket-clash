import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Target, Timer, Trophy } from 'lucide-react';
import { MODES, formatOvers, streakMultiplier, strikeRate } from '../../lib/gameLogic';

function Card({ children, className = '' }) {
  return <div className={`glass rounded-2xl p-3 md:p-4 ${className}`}>{children}</div>;
}

function Label({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 md:text-xs">
      {Icon && <Icon className="size-3.5" />}
      {children}
    </div>
  );
}

function Bar({ value, className }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className={`h-full rounded-full ${className}`}
        animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

function streakHint(streak) {
  if (streak < 3) return `${3 - streak} more for x2 runs`;
  if (streak < 5) return `${5 - streak} more for x3 runs`;
  return 'Max multiplier!';
}

function ModeCard({ state }) {
  if (state.mode === 'time') {
    const low = state.timeLeft <= 10;
    return (
      <Card>
        <Label icon={Timer}>Time left</Label>
        <motion.div
          animate={low ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, repeat: low ? Infinity : 0 }}
          className={`mt-1 font-display text-3xl md:text-4xl ${low ? 'text-rose-400' : ''}`}
        >
          {state.timeLeft}s
        </motion.div>
        <Bar value={state.timeLeft / MODES.time.time} className={low ? 'bg-rose-500' : 'bg-cyan-400'} />
      </Card>
    );
  }

  if (state.mode === 'superover') {
    const need = Math.max(0, state.target - state.runs);
    const left = state.maxBalls - state.balls;
    return (
      <Card>
        <Label icon={Target}>Target {state.target}</Label>
        <div className="mt-1 font-display text-3xl md:text-4xl">
          {need}
          <span className="ml-1 text-sm font-sans font-medium text-white/50">needed</span>
        </div>
        <div className="text-xs text-white/50">
          off {left} ball{left === 1 ? '' : 's'}
        </div>
        <Bar value={state.runs / state.target} className="bg-amber-400" />
      </Card>
    );
  }

  const beating = state.best > 0 && state.runs > state.best;
  return (
    <Card>
      <Label icon={Trophy}>Best</Label>
      <div className="mt-1 flex items-center gap-2 font-display text-3xl md:text-4xl">
        {Math.max(state.best, state.runs)}
        {beating && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-amber-400 px-2 py-0.5 font-sans text-[10px] font-bold text-black"
          >
            NEW
          </motion.span>
        )}
      </div>
      <div className="mt-1 text-xs text-white/50">Last score: {state.lastScore ?? '—'}</div>
    </Card>
  );
}

export default function Hud({ state }) {
  const mult = streakMultiplier(state.streak);
  const hot = state.streak >= 3;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <Label>Score</Label>
        <div className="mt-1 flex items-baseline font-display text-3xl md:text-4xl">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state.runs}
              initial={{ y: -18, opacity: 0, scale: 1.4 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0 }}
              className="inline-block text-emerald-300"
            >
              {state.runs}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/35">/{state.wicketsLost}</span>
        </div>
        <div className="mt-1 text-xs text-white/50">
          {formatOvers(state.balls)} ov · SR {strikeRate(state.runs, state.balls)}
        </div>
      </Card>

      <Card>
        <Label>Wickets</Label>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {Array.from({ length: state.maxWickets }, (_, i) => {
            const lost = i < state.wicketsLost;
            return (
              <motion.span
                key={`${i}-${lost}`}
                initial={lost ? { scale: 1.8 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className={`size-4 rounded-full border md:size-5 ${
                  lost
                    ? 'border-rose-400/50 bg-rose-500/70'
                    : 'border-emerald-300/50 bg-emerald-400 shadow-[0_0_10px_var(--color-emerald-400)]'
                }`}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-white/50">
          {state.maxWickets - state.wicketsLost} of {state.maxWickets} remaining
        </div>
      </Card>

      <Card className={hot ? 'border-orange-400/40' : ''}>
        <Label>Streak</Label>
        <div className="mt-1 flex items-center gap-2">
          <motion.span
            animate={hot ? { scale: [1, 1.25, 1], rotate: [0, -8, 0] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: hot ? Infinity : 0 }}
          >
            <Flame
              className={`size-7 ${
                state.streak >= 5 ? 'fill-fuchsia-500/40 text-fuchsia-400' : hot ? 'fill-orange-500/40 text-orange-400' : 'text-white/25'
              }`}
            />
          </motion.span>
          <span className="font-display text-3xl md:text-4xl">{state.streak}</span>
          {mult > 1 && (
            <motion.span
              key={mult}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-300"
            >
              x{mult}
            </motion.span>
          )}
        </div>
        <div className="mt-1 text-xs text-white/50">{streakHint(state.streak)}</div>
      </Card>

      <ModeCard state={state} />
    </div>
  );
}
