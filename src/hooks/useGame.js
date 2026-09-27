import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  ACHIEVEMENTS,
  MODES,
  getResult,
  pickComputerMove,
  randomTarget,
  rollShot,
  streakMultiplier,
} from '../lib/gameLogic';
import { KEYS, getBest, getLastScore, load, recordInnings, save } from '../lib/storage';
import { sound } from '../lib/sound';

function createInnings({ mode, difficulty, best = 0, lastScore = null }) {
  const cfg = MODES[mode];
  return {
    screen: 'playing',
    mode,
    difficulty,
    best,
    lastScore,
    runs: 0,
    wicketsLost: 0,
    maxWickets: cfg.wickets,
    balls: 0,
    maxBalls: cfg.balls ?? null,
    timeLeft: cfg.time ?? null,
    target: mode === 'superover' ? randomTarget(difficulty) : null,
    streak: 0,
    bestStreak: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    fours: 0,
    sixes: 0,
    history: [],
    last: null,
    phase: 'idle', // idle | revealing | result
    pendingMove: null,
    paused: false,
    ended: false,
    endReason: null, // allout | overs | chased | time
    summary: null,
  };
}

const initialState = { ...createInnings({ mode: 'classic', difficulty: 'medium' }), screen: 'home' };

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return createInnings(action);

    case 'REVEAL':
      return { ...state, phase: 'revealing', pendingMove: action.move };

    case 'RESOLVE': {
      if (state.ended || state.screen !== 'playing') return state;
      const { user, comp, shot } = action;
      const result = getResult(user, comp);
      const next = { ...state, balls: state.balls + 1, phase: 'result', pendingMove: null };
      let runs = 0;
      let multiplier = 1;

      if (result === 'win') {
        next.streak = state.streak + 1;
        multiplier = streakMultiplier(next.streak);
        runs = shot.runs * multiplier;
        next.runs = state.runs + runs;
        next.wins = state.wins + 1;
        next.bestStreak = Math.max(state.bestStreak, next.streak);
        if (shot.runs === 4) next.fours = state.fours + 1;
        if (shot.runs === 6) next.sixes = state.sixes + 1;
      } else if (result === 'lose') {
        next.wicketsLost = state.wicketsLost + 1;
        next.losses = state.losses + 1;
        next.streak = 0;
      } else {
        next.ties = state.ties + 1;
      }

      next.last = {
        user,
        comp,
        result,
        runs,
        multiplier,
        shot: result === 'win' ? shot.runs : 0,
        label: result === 'win' ? shot.label : result === 'lose' ? 'OUT!' : 'DOT BALL',
      };
      next.history = [...state.history, next.last];

      const endReason =
        next.wicketsLost >= next.maxWickets
          ? 'allout'
          : next.target !== null && next.runs >= next.target
            ? 'chased'
            : next.maxBalls !== null && next.balls >= next.maxBalls
              ? 'overs'
              : null;
      if (endReason) {
        next.ended = true;
        next.endReason = endReason;
      }
      return next;
    }

    case 'TICK': {
      if (state.screen !== 'playing' || state.paused || state.ended || state.timeLeft === null) {
        return state;
      }
      const timeLeft = state.timeLeft - 1;
      return timeLeft <= 0
        ? { ...state, timeLeft: 0, ended: true, endReason: 'time', phase: 'result', pendingMove: null }
        : { ...state, timeLeft };
    }

    case 'TOGGLE_PAUSE':
      if (state.screen !== 'playing' || state.ended) return state;
      return { ...state, paused: !state.paused };

    case 'FINISH':
      return { ...state, screen: 'over', summary: action.summary };

    case 'HOME':
      return { ...state, screen: 'home', paused: false };

    default:
      return state;
  }
}

export function useGame({ quick, playerName }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const [unlocked, setUnlocked] = useState(() => load(KEYS.achievements, []));
  const unlockedRef = useRef(unlocked);
  const [toasts, setToasts] = useState([]);

  const timers = useRef([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => clearTimers, []);

  const start = useCallback((mode, difficulty) => {
    clearTimers();
    sound.start();
    dispatch({ type: 'START', mode, difficulty, best: getBest(mode), lastScore: getLastScore(mode) });
  }, []);

  const play = useCallback(
    (move) => {
      const s = stateRef.current;
      if (s.screen !== 'playing' || s.phase === 'revealing' || s.paused || s.ended) return;

      const comp = pickComputerMove(s.difficulty, move, s.history);
      const shot = rollShot();
      const result = getResult(move, comp);

      dispatch({ type: 'REVEAL', move });
      stateRef.current = { ...s, phase: 'revealing' }; // lock out double taps before re-render
      sound.click();
      if (!quick) [120, 420, 720].forEach((t, i) => later(() => sound.tick(i), t));

      later(
        () => {
          if (stateRef.current.ended) return;
          dispatch({ type: 'RESOLVE', user: move, comp, shot });
          if (result === 'win') (shot.runs === 6 ? sound.six : sound.win)();
          else if (result === 'lose') sound.out();
          else sound.dot();
        },
        quick ? 250 : 1050,
      );
    },
    [quick],
  );

  const togglePause = useCallback(() => dispatch({ type: 'TOGGLE_PAUSE' }), []);

  const goHome = useCallback(() => {
    clearTimers();
    dispatch({ type: 'HOME' });
  }, []);

  // Countdown clock for Time Attack.
  const hasClock = state.timeLeft !== null;
  useEffect(() => {
    if (state.screen !== 'playing' || !hasClock || state.ended || state.paused) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.screen, hasClock, state.ended, state.paused]);

  useEffect(() => {
    if (state.screen === 'playing' && state.timeLeft !== null && state.timeLeft > 0 && state.timeLeft <= 5) {
      sound.tick(2);
    }
  }, [state.timeLeft, state.screen]);

  // Let the last ball's result land, then save and show the game-over screen.
  useEffect(() => {
    if (!state.ended || state.screen !== 'playing') return;
    const id = setTimeout(() => {
      const s = stateRef.current;
      const summary = recordInnings(s, playerName);
      if (summary.isHighScore || s.endReason === 'chased') sound.fanfare();
      else sound.gameOver();
      dispatch({ type: 'FINISH', summary });
    }, 1600);
    return () => clearTimeout(id);
  }, [state.ended, state.screen, playerName]);

  // Unlock achievements as they happen.
  useEffect(() => {
    if (state.screen !== 'playing') return;
    const fresh = ACHIEVEMENTS.filter((a) => !unlockedRef.current.includes(a.id) && a.check(state));
    if (!fresh.length) return;
    const next = [...unlockedRef.current, ...fresh.map((a) => a.id)];
    unlockedRef.current = next;
    setUnlocked(next);
    save(KEYS.achievements, next);
    sound.achievement();
    setToasts((t) => [...t, ...fresh.map((a) => ({ id: a.id, icon: a.icon, title: a.title, desc: a.desc, key: `${a.id}-${Date.now()}` }))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.balls, state.endReason, state.screen]);

  const dismissToast = useCallback((key) => setToasts((t) => t.filter((x) => x.key !== key)), []);

  const resetUnlocked = useCallback(() => {
    unlockedRef.current = [];
    setUnlocked([]);
  }, []);

  return { state, start, play, togglePause, goHome, unlocked, toasts, dismissToast, resetUnlocked };
}
