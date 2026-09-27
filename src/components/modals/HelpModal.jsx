import { Info } from 'lucide-react';
import Modal from '../Modal';
import { MoveIcon } from '../Icons';
import { DIFFICULTIES, MODES, MOVES, MOVE_INFO } from '../../lib/gameLogic';

function Section({ title, children }) {
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">{title}</h3>
      {children}
    </section>
  );
}

export default function HelpModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="How to play" icon={<Info className="size-5 text-cyan-300" />}>
      <Section title="The rules">
        <div className="grid grid-cols-3 gap-2">
          {MOVES.map((m) => (
            <div key={m} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <MoveIcon move={m} className="mx-auto size-10" />
              <div className="mt-1 text-sm font-semibold">{MOVE_INFO[m].label}</div>
              <div className="text-[11px] text-white/50">beats {MOVE_INFO[MOVE_INFO[m].beats].label}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-white/60">
          Pick a move, the computer picks one too. Same move is a dot ball.
        </p>
      </Section>

      <Section title="Scoring">
        <ul className="space-y-1.5 text-sm text-white/70">
          <li>🏏 <b>Win the ball</b> and you score 1, 2, 3, 4 or 6 runs.</li>
          <li>☝️ <b>Lose the ball</b> and you are OUT, losing a wicket.</li>
          <li>🔥 <b>3 wins in a row</b> doubles your runs, <b>5 in a row</b> triples them.</li>
        </ul>
      </Section>

      <Section title="Modes">
        <ul className="space-y-1.5 text-sm text-white/70">
          {Object.values(MODES).map((m) => (
            <li key={m.id}>
              <b className="text-white">{m.name}:</b> {m.desc}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Difficulty">
        <ul className="space-y-1.5 text-sm text-white/70">
          {Object.entries(DIFFICULTIES).map(([id, d]) => (
            <li key={id}>
              <b className="text-white">{d.name}:</b> {d.desc}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Keyboard">
        <p className="text-sm text-white/70">
          <b>1</b>/<b>B</b> Bat · <b>2</b>/<b>L</b> Ball · <b>3</b>/<b>S</b> Stump · <b>P</b> Pause · <b>Enter</b> Play again
        </p>
        <p className="mt-1 text-sm text-white/50">Turn on ⚡ Quick play in the top bar to skip the reveal animation.</p>
      </Section>
    </Modal>
  );
}
