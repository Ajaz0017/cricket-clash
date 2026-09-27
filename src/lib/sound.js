// Tiny synthesized sound effects via the Web Audio API — no audio files needed.

let ctx = null;
let enabled = true;

export const setSoundEnabled = (value) => {
  enabled = value;
};

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, { dur = 0.12, type = 'sine', vol = 0.12, delay = 0, slide = null } = {}) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// Short filtered noise burst — sounds like leather on willow.
function crack(vol = 0.35) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const len = Math.floor(c.sampleRate * 0.08);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  src.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = 1800;
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

const arpeggio = (notes, opts = {}) =>
  notes.forEach((f, i) => tone(f, { type: 'triangle', dur: 0.16, ...opts, delay: (opts.delay ?? 0) + i * (opts.step ?? 0.07) }));

export const sound = {
  click: () => tone(520, { dur: 0.06, type: 'triangle', vol: 0.08 }),
  tick: (i = 0) => tone(600 + i * 120, { dur: 0.07, type: 'square', vol: 0.04 }),
  start: () => arpeggio([392, 523, 659], { step: 0.08 }),
  win: () => {
    crack();
    arpeggio([523, 659, 784], { delay: 0.05 });
  },
  six: () => {
    crack(0.5);
    arpeggio([523, 659, 784, 1047], { delay: 0.05 });
    tone(1568, { dur: 0.45, delay: 0.38, vol: 0.07 });
  },
  out: () => {
    tone(320, { dur: 0.5, type: 'sawtooth', vol: 0.07, slide: 80 });
    tone(160, { dur: 0.3, type: 'square', vol: 0.05, delay: 0.05 });
  },
  dot: () => {
    tone(380, { dur: 0.1 });
    tone(330, { dur: 0.12, delay: 0.1 });
  },
  achievement: () => arpeggio([880, 1175, 1568], { dur: 0.2, step: 0.09, vol: 0.08, type: 'sine' }),
  fanfare: () => arpeggio([523, 659, 784, 1047, 784, 1047], { dur: 0.22, step: 0.12, vol: 0.1 }),
  gameOver: () => arpeggio([523, 440, 349, 262], { dur: 0.28, step: 0.16, vol: 0.09, type: 'sine' }),
};
