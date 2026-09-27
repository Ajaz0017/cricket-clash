import { motion } from 'framer-motion';
import { Lock, Medal } from 'lucide-react';
import Modal from '../Modal';
import { ACHIEVEMENTS } from '../../lib/gameLogic';

export default function AchievementsModal({ open, onClose, unlocked }) {
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <Modal open={open} onClose={onClose} title="Achievements" icon={<Medal className="size-5 text-amber-300" />}>
      <div className="flex items-center justify-between text-sm text-white/60">
        <span>
          {unlocked.length} of {ACHIEVEMENTS.length} unlocked
        </span>
        <span className="font-semibold text-amber-300">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-amber-300 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((a, i) => {
          const done = unlocked.includes(a.id);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`relative rounded-2xl border p-3 ${
                done ? 'border-amber-300/40 bg-amber-300/10' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className={`text-2xl ${done ? '' : 'opacity-30 grayscale'}`}>{a.icon}</div>
              <div className={`mt-1 text-sm font-semibold ${done ? '' : 'text-white/50'}`}>{a.title}</div>
              <div className="text-xs text-white/45">{a.desc}</div>
              {!done && <Lock className="absolute right-3 top-3 size-3.5 text-white/30" />}
            </motion.div>
          );
        })}
      </div>
    </Modal>
  );
}
