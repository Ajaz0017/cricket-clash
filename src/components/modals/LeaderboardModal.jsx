import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Trophy } from 'lucide-react';
import Modal from '../Modal';
import { MODES } from '../../lib/gameLogic';
import { getLeaderboard, resetProgress } from '../../lib/storage';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardModal({ open, onClose, onReset }) {
  const [tab, setTab] = useState('classic');
  const [confirming, setConfirming] = useState(false);
  const [, setVersion] = useState(0);

  const rows = getLeaderboard()
    .filter((e) => e.mode === tab)
    .sort((a, b) => b.runs - a.runs || a.balls - b.balls);

  const reset = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetProgress();
    onReset();
    setConfirming(false);
    setVersion((v) => v + 1);
  };

  return (
    <Modal open={open} onClose={onClose} title="Leaderboard" icon={<Trophy className="size-5 text-amber-300" />}>
      <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-black/30 p-1">
        {Object.values(MODES).map((m) => (
          <button key={m.id} onClick={() => setTab(m.id)} className="relative rounded-xl py-2 text-sm font-semibold">
            {tab === m.id && (
              <motion.span layoutId="lb-tab" className="absolute inset-0 rounded-xl bg-white/15" />
            )}
            <span className={`relative ${tab === m.id ? 'text-white' : 'text-white/55'}`}>{m.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm text-white/40">
            No innings yet. Go set a score!
          </div>
        )}
        {rows.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              i === 0 ? 'border-amber-300/40 bg-amber-300/10' : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <span className="w-7 text-center font-display text-lg text-white/60">{MEDALS[i] ?? i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{e.name}</div>
              <div className="text-xs capitalize text-white/45">
                {e.difficulty} · {e.balls} balls · {new Date(e.date).toLocaleDateString()}
                {e.mode === 'superover' && (e.won ? ' · Won' : ' · Lost')}
              </div>
            </div>
            <div className="font-display text-2xl text-emerald-300">
              {e.runs}
              <span className="text-sm text-white/35">/{e.wickets ?? 0}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={reset}
        onBlur={() => setConfirming(false)}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold transition ${
          confirming ? 'border-rose-500 bg-rose-500/20 text-rose-300' : 'border-white/10 text-white/50 hover:text-white'
        }`}
      >
        <Trash2 className="size-4" />
        {confirming ? 'Tap again to erase all progress' : 'Reset all progress'}
      </button>
    </Modal>
  );
}
