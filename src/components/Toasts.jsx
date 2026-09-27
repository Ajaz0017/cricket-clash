import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.key), 3500);
    return () => clearTimeout(id);
  }, [toast.key, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 360, damping: 26 }}
      onClick={() => onDismiss(toast.key)}
      className="pointer-events-auto flex w-72 cursor-pointer items-center gap-3 rounded-2xl border border-amber-300/30 bg-slate-900/90 p-3 shadow-xl shadow-amber-500/10 backdrop-blur-xl"
    >
      <motion.div
        initial={{ rotate: -30, scale: 0.5 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.1 }}
        className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-amber-300/30 to-orange-500/20 text-2xl"
      >
        {toast.icon}
      </motion.div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Achievement unlocked</div>
        <div className="truncate font-semibold">{toast.title}</div>
        <div className="truncate text-xs text-white/50">{toast.desc}</div>
      </div>
    </motion.div>
  );
}

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-4 md:items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.key} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
