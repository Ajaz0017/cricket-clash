import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { House, Pause, Play } from 'lucide-react';
import Hud from './game/Hud';
import Arena from './game/Arena';
import BallTimeline from './game/BallTimeline';
import MovePicker from './game/MovePicker';
import { MODES, MOVES, MOVE_INFO } from '../lib/gameLogic';

const FLASH = { win: 'bg-emerald-400', lose: 'bg-rose-600', tie: 'bg-amber-300' };

function PauseOverlay({ onResume, onQuit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        className="glass w-full max-w-xs rounded-3xl p-6 text-center"
      >
        <div className="font-display text-3xl">Paused</div>
        <p className="mt-1 text-sm text-white/50">Take a breather. The bowler will wait.</p>
        <button
          onClick={onResume}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          <Play className="size-4 fill-current" /> Resume
        </button>
        <button
          onClick={onQuit}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-3 font-semibold text-white/80 transition hover:bg-white/10"
        >
          <House className="size-4" /> Quit to menu
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function GameScreen({ state, playerName, active, onPlay, onPause, onQuit }) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.repeat || e.target.tagName === 'INPUT') return;
      const key = e.key.toLowerCase();
      if (key === 'p' || key === 'escape') {
        onPause();
        return;
      }
      if (state.paused) return;
      const move = MOVES.find((m) => MOVE_INFO[m].keys.includes(key));
      if (move) onPlay(move);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, state, onPlay, onPause]);

  const locked = state.phase === 'revealing' || state.paused || state.ended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
      className="pt-2"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            {MODES[state.mode].name}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-white/70">
            {state.difficulty}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPause}
            disabled={state.ended}
            className="glass flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white/80 transition hover:text-white disabled:opacity-40"
          >
            <Pause className="size-3.5" /> Pause
          </button>
          <button
            onClick={onQuit}
            className="glass flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white/80 transition hover:text-white"
          >
            <House className="size-3.5" /> Quit
          </button>
        </div>
      </div>

      <Hud state={state} />
      <Arena state={state} playerName={playerName} />
      <BallTimeline history={state.history} />
      <MovePicker disabled={locked} pending={state.pendingMove} onPlay={onPlay} />

      <p className="mt-4 hidden text-center text-xs text-white/35 md:block">
        Shortcuts: <kbd className="text-white/60">1</kbd>/<kbd className="text-white/60">B</kbd> Bat ·{' '}
        <kbd className="text-white/60">2</kbd>/<kbd className="text-white/60">L</kbd> Ball ·{' '}
        <kbd className="text-white/60">3</kbd>/<kbd className="text-white/60">S</kbd> Stump ·{' '}
        <kbd className="text-white/60">P</kbd> Pause
      </p>

      {/* Full-screen colour flash on every result */}
      {state.last && state.phase === 'result' && (
        <motion.div
          key={`flash-${state.balls}`}
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`pointer-events-none fixed inset-0 z-30 ${FLASH[state.last.result]}`}
        />
      )}

      <AnimatePresence>{state.paused && <PauseOverlay onResume={onPause} onQuit={onQuit} />}</AnimatePresence>
    </motion.div>
  );
}
