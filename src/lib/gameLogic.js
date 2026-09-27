// Core rules — same concept as the original game:
// Bat beats Ball, Ball beats Stump, Stump beats Bat.

export const MOVES = ['bat', 'ball', 'stump'];

export const MOVE_INFO = {
  bat: {
    label: 'Bat',
    beats: 'ball',
    keys: ['1', 'b'],
    accent: 'from-amber-400 to-orange-600',
    ring: 'ring-orange-400/70',
  },
  ball: {
    label: 'Ball',
    beats: 'stump',
    keys: ['2', 'l'],
    accent: 'from-rose-400 to-red-600',
    ring: 'ring-rose-400/70',
  },
  stump: {
    label: 'Stump',
    beats: 'bat',
    keys: ['3', 's'],
    accent: 'from-sky-400 to-indigo-600',
    ring: 'ring-sky-400/70',
  },
};

export const randomMove = () => MOVES[Math.floor(Math.random() * MOVES.length)];

export const moveThatBeats = (move) => MOVES.find((m) => MOVE_INFO[m].beats === move);

export function getResult(user, comp) {
  if (user === comp) return 'tie';
  return MOVE_INFO[user].beats === comp ? 'win' : 'lose';
}

// Guesses the player's next move from what usually follows their last move,
// blended with their recent favourite moves.
function predictNextMove(history) {
  const moves = history.map((h) => h.user);
  const last = moves[moves.length - 1];
  const counts = { bat: 0, ball: 0, stump: 0 };
  for (let i = 0; i < moves.length - 1; i++) {
    if (moves[i] === last) counts[moves[i + 1]] += 2;
  }
  moves.slice(-8).forEach((m) => (counts[m] += 1));
  return MOVES.reduce((a, b) => (counts[b] > counts[a] ? b : a));
}

export function pickComputerMove(difficulty, userMove, history) {
  const r = Math.random();
  // Easy: the bowler sometimes serves up a gift.
  if (difficulty === 'easy' && r < 0.3) return MOVE_INFO[userMove].beats;
  // Hard: the bowler reads your patterns (never peeks at the current move).
  if (difficulty === 'hard' && history.length >= 3 && r < 0.6) {
    return moveThatBeats(predictNextMove(history));
  }
  return randomMove();
}

const SHOTS = [
  { runs: 1, label: 'SINGLE', weight: 30 },
  { runs: 2, label: 'DOUBLE', weight: 22 },
  { runs: 3, label: 'THREE!', weight: 8 },
  { runs: 4, label: 'FOUR!', weight: 25 },
  { runs: 6, label: 'SIX!', weight: 15 },
];
const TOTAL_WEIGHT = SHOTS.reduce((sum, s) => sum + s.weight, 0);

export function rollShot() {
  let n = Math.random() * TOTAL_WEIGHT;
  for (const shot of SHOTS) {
    n -= shot.weight;
    if (n < 0) return shot;
  }
  return SHOTS[0];
}

export const streakMultiplier = (streak) => (streak >= 5 ? 3 : streak >= 3 ? 2 : 1);

export const MODES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    tagline: 'Survive & score',
    desc: '5 wickets in hand. Score as many runs as you can before you are all out.',
    wickets: 5,
  },
  time: {
    id: 'time',
    name: 'Time Attack',
    tagline: '60 second blitz',
    desc: 'Score big before the clock hits zero. 5 wickets in hand.',
    wickets: 5,
    time: 60,
  },
  superover: {
    id: 'superover',
    name: 'Super Over',
    tagline: 'Chase the target',
    desc: '6 balls, 3 wickets. Chase down the target to win the match.',
    wickets: 3,
    balls: 6,
  },
};
export const MODE_IDS = Object.keys(MODES);

export const DIFFICULTIES = {
  easy: { name: 'Easy', desc: 'Lenient bowler', target: [6, 10] },
  medium: { name: 'Medium', desc: 'Pure luck', target: [8, 12] },
  hard: { name: 'Hard', desc: 'Reads your patterns', target: [10, 15] },
};

export function randomTarget(difficulty) {
  const [min, max] = DIFFICULTIES[difficulty].target;
  return min + Math.floor(Math.random() * (max - min + 1));
}

export const formatOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

export const strikeRate = (runs, balls) => (balls ? ((runs / balls) * 100).toFixed(1) : '0.0');

export const ACHIEVEMENTS = [
  { id: 'off_the_mark', icon: '🏏', title: 'Off the Mark', desc: 'Win your first ball.', check: (s) => s.wins >= 1 },
  { id: 'hat_trick', icon: '🎩', title: 'Hat-trick', desc: 'Win 3 balls in a row.', check: (s) => s.streak >= 3 },
  { id: 'on_fire', icon: '🔥', title: 'On Fire', desc: 'Win 5 balls in a row.', check: (s) => s.streak >= 5 },
  { id: 'maximum', icon: '🚀', title: 'Maximum!', desc: 'Hit a six.', check: (s) => s.last?.shot === 6 },
  { id: 'monster', icon: '💥', title: 'Monster Hit', desc: 'Score 12+ runs off a single ball.', check: (s) => s.last?.runs >= 12 },
  { id: 'fifty', icon: '⭐', title: 'Half Century', desc: 'Score 50 runs in one innings.', check: (s) => s.runs >= 50 },
  { id: 'century', icon: '💯', title: 'Century', desc: 'Score 100 runs in one innings.', check: (s) => s.runs >= 100 },
  { id: 'chase_master', icon: '🏆', title: 'Chase Master', desc: 'Win a Super Over.', check: (s) => s.endReason === 'chased' },
  { id: 'beat_clock', icon: '⏱️', title: 'Beat the Clock', desc: 'Survive a full Time Attack.', check: (s) => s.endReason === 'time' },
  { id: 'mind_reader', icon: '🧠', title: 'Mind Reader', desc: 'Score 30+ runs on Hard.', check: (s) => s.difficulty === 'hard' && s.runs >= 30 },
];
