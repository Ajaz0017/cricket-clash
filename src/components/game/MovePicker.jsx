import { motion } from 'framer-motion';
import { MoveIcon } from '../Icons';
import { MOVES, MOVE_INFO } from '../../lib/gameLogic';

export default function MovePicker({ disabled, pending, onPlay }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3 md:mt-6 md:gap-5">
      {MOVES.map((move, i) => {
        const info = MOVE_INFO[move];
        const selected = pending === move;
        return (
          <motion.button
            key={move}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={disabled ? undefined : { y: -8 }}
            whileTap={disabled ? undefined : { scale: 0.93 }}
            onClick={() => onPlay(move)}
            disabled={disabled}
            aria-label={`Play ${info.label}`}
            className={`group relative overflow-hidden rounded-3xl border bg-white/[0.04] p-3 text-center backdrop-blur-xl transition-[opacity,border-color] md:p-6 ${
              selected ? `border-transparent ring-2 ${info.ring}` : 'border-white/10 hover:border-white/25'
            } ${disabled && !selected ? 'opacity-40' : ''}`}
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${info.accent} transition-opacity duration-300 ${
                selected ? 'opacity-25' : 'opacity-0 group-hover:opacity-15'
              }`}
            />
            <MoveIcon
              move={move}
              className="relative mx-auto size-14 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 md:size-20"
            />
            <div className="relative mt-2 font-display text-base md:text-xl">{info.label}</div>
            <div className="relative text-[10px] text-white/50 md:text-xs">beats {MOVE_INFO[info.beats].label}</div>
            <kbd className="absolute right-3 top-3 hidden rounded-md border border-white/15 bg-black/30 px-1.5 font-sans text-[10px] text-white/50 md:block">
              {i + 1}
            </kbd>
          </motion.button>
        );
      })}
    </div>
  );
}
