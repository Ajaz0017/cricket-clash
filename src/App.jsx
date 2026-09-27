import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import TopBar from './components/TopBar';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import Toasts from './components/Toasts';
import Confetti from './components/Confetti';
import LeaderboardModal from './components/modals/LeaderboardModal';
import AchievementsModal from './components/modals/AchievementsModal';
import HelpModal from './components/modals/HelpModal';
import { useGame } from './hooks/useGame';
import { usePersistentState } from './hooks/usePersistentState';
import { KEYS } from './lib/storage';
import { setSoundEnabled } from './lib/sound';

export default function App() {
  const [settings, setSettings] = usePersistentState(KEYS.settings, { sound: true, quick: false });
  const [name, setName] = usePersistentState(KEYS.player, '');
  const [prefs, setPrefs] = usePersistentState(KEYS.prefs, { mode: 'classic', difficulty: 'medium' });
  const [modal, setModal] = useState(null);
  const [homeVersion, setHomeVersion] = useState(0);

  const game = useGame({ quick: settings.quick, playerName: name });
  const { state } = game;

  useEffect(() => setSoundEnabled(settings.sound), [settings.sound]);

  const openModal = (which) => {
    // Don't let the clock run while a dialog is open mid-innings.
    if (state.screen === 'playing' && !state.paused && !state.ended) game.togglePause();
    setModal(which);
  };
  const closeModal = useCallback(() => setModal(null), []);

  const onReset = () => {
    game.resetUnlocked();
    setHomeVersion((v) => v + 1);
  };

  const celebrate = state.screen === 'over' && (state.summary?.isHighScore || state.endReason === 'chased');

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Background />
      <TopBar settings={settings} setSettings={setSettings} unlockedCount={game.unlocked.length} onOpen={openModal} />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-12">
        <AnimatePresence mode="wait">
          {state.screen === 'home' && (
            <HomeScreen
              key={`home-${homeVersion}`}
              name={name}
              setName={setName}
              prefs={prefs}
              setPrefs={setPrefs}
              onStart={game.start}
            />
          )}
          {state.screen === 'playing' && (
            <GameScreen
              key="game"
              state={state}
              playerName={name}
              active={!modal}
              onPlay={game.play}
              onPause={game.togglePause}
              onQuit={game.goHome}
            />
          )}
          {state.screen === 'over' && (
            <GameOverScreen
              key="over"
              state={state}
              onRestart={() => game.start(state.mode, state.difficulty)}
              onHome={game.goHome}
            />
          )}
        </AnimatePresence>
      </main>

      {celebrate && <Confetti key={state.summary?.rank ?? 'confetti'} />}
      <Toasts toasts={game.toasts} onDismiss={game.dismissToast} />

      <LeaderboardModal open={modal === 'leaderboard'} onClose={closeModal} onReset={onReset} />
      <AchievementsModal open={modal === 'achievements'} onClose={closeModal} unlocked={game.unlocked} />
      <HelpModal open={modal === 'help'} onClose={closeModal} />

      <footer className="relative z-10 pb-6 text-center text-xs text-white/25">
        Everything is saved in your browser · No sign-up needed
      </footer>
    </div>
  );
}
