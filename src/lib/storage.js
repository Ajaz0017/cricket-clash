// Everything is stored in the browser — no backend or database.
import { MODE_IDS } from './gameLogic';

export const KEYS = {
  leaderboard: 'cc.leaderboard',
  lastScore: 'cc.lastScore',
  achievements: 'cc.achievements',
  stats: 'cc.stats',
  settings: 'cc.settings',
  player: 'cc.player',
  prefs: 'cc.prefs',
};

export const DEFAULT_STATS = {
  games: 0,
  runs: 0,
  balls: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  fours: 0,
  sixes: 0,
  bestStreak: 0,
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — the game still works, it just won't remember.
  }
}

export const getLeaderboard = () => load(KEYS.leaderboard, []);

export const getBest = (mode) =>
  getLeaderboard()
    .filter((e) => e.mode === mode)
    .reduce((best, e) => Math.max(best, e.runs), 0);

export const getLastScore = (mode) => load(KEYS.lastScore, {})[mode] ?? null;

export const getStats = () => ({ ...DEFAULT_STATS, ...load(KEYS.stats, {}) });

const byScore = (a, b) => b.runs - a.runs || a.balls - b.balls || a.id - b.id;

// Saves a finished innings and returns what the game-over screen needs.
export function recordInnings(s, name) {
  const board = getLeaderboard();
  const prevBest = getBest(s.mode);
  const entry = {
    id: Date.now(),
    name: name?.trim() || 'Player',
    runs: s.runs,
    wickets: s.wicketsLost,
    balls: s.balls,
    mode: s.mode,
    difficulty: s.difficulty,
    won: s.endReason === 'chased',
    date: new Date().toISOString(),
  };

  const trimmed = MODE_IDS.flatMap((mode) =>
    [...board, entry]
      .filter((e) => e.mode === mode)
      .sort(byScore)
      .slice(0, 10),
  );
  save(KEYS.leaderboard, trimmed);
  const rank = trimmed.filter((e) => e.mode === s.mode).findIndex((e) => e.id === entry.id);

  save(KEYS.lastScore, { ...load(KEYS.lastScore, {}), [s.mode]: s.runs });

  const stats = getStats();
  save(KEYS.stats, {
    games: stats.games + 1,
    runs: stats.runs + s.runs,
    balls: stats.balls + s.balls,
    wins: stats.wins + s.wins,
    losses: stats.losses + s.losses,
    ties: stats.ties + s.ties,
    fours: stats.fours + s.fours,
    sixes: stats.sixes + s.sixes,
    bestStreak: Math.max(stats.bestStreak, s.bestStreak),
  });

  return {
    prevBest,
    isHighScore: s.runs > prevBest,
    rank: rank >= 0 ? rank + 1 : null,
  };
}

export function resetProgress() {
  [KEYS.leaderboard, KEYS.lastScore, KEYS.achievements, KEYS.stats].forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}
