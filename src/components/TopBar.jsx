import { motion } from 'framer-motion';
import { Info, Medal, Trophy, Volume2, VolumeX, Zap } from 'lucide-react';
import { BatIcon } from './Icons';
import { ACHIEVEMENTS } from '../lib/gameLogic';

function IconButton({ title, active, onClick, children, badge }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`glass relative grid size-10 place-items-center rounded-xl transition-colors ${
        active ? 'text-emerald-300' : 'text-white/70 hover:text-white'
      }`}
    >
      {children}
      {badge != null && (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold leading-4 text-black">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

export default function TopBar({ settings, setSettings, unlockedCount, onOpen }) {
  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2.5">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/30"
        >
          <BatIcon className="size-7" />
        </motion.div>
        <span className="hidden font-display text-lg tracking-wide sm:inline">
          Cricket<span className="text-emerald-400">Clash</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <IconButton title="Leaderboard" onClick={() => onOpen('leaderboard')}>
          <Trophy className="size-5" />
        </IconButton>
        <IconButton
          title="Achievements"
          onClick={() => onOpen('achievements')}
          badge={`${unlockedCount}/${ACHIEVEMENTS.length}`}
        >
          <Medal className="size-5" />
        </IconButton>
        <IconButton title="How to play" onClick={() => onOpen('help')}>
          <Info className="size-5" />
        </IconButton>
        <IconButton title={settings.quick ? 'Quick play: on' : 'Quick play: off'} active={settings.quick} onClick={() => toggle('quick')}>
          <Zap className="size-5" />
        </IconButton>
        <IconButton title={settings.sound ? 'Mute' : 'Unmute'} active={settings.sound} onClick={() => toggle('sound')}>
          {settings.sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </IconButton>
      </div>
    </header>
  );
}
