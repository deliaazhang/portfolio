import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { noise, scatter } from './correlation'

const OPACITIES = [
  { label: '100%', a: 1 },
  { label: '75%', a: 0.75 },
  { label: '50%', a: 0.5 },
  { label: '25%', a: 0.25 },
]
const BASE = 0.6
const TRIALS = 12

function Plot({ seed, rho, alpha, onPick, label, disabled }: { seed: number; rho: number; alpha: number; onPick: () => void; label: string; disabled: boolean }) {
  const pts = useMemo(() => scatter(noise(100, seed), rho), [seed, rho])
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      aria-label={`Choose the ${label} plot`}
      className="group relative w-full rounded-[14px] border border-[#d3def0] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#2a78d6] hover:shadow-[0_14px_24px_-16px_rgba(30,60,120,.45)] disabled:pointer-events-none"
    >
      <svg viewBox="0 0 200 200" className="block w-full" aria-hidden>
        <line x1="10" y1="190" x2="196" y2="190" stroke="#c9ccd2" />
        <line x1="10" y1="4" x2="10" y2="190" stroke="#c9ccd2" />
        {pts.map(([x, y], k) => (
          <circle key={k} cx={16 + x * 176} cy={184 - y * 176} r="3" fill="#111" fillOpacity={alpha} />
        ))}
      </svg>
      <span className="mt-2 block text-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#4a5568] group-hover:text-[#1c5cab]">{label}</span>
    </button>
  )
}

/** A mini JND task: which of two scatterplots looks more correlated? A simple staircase adapts the difference. */
export function CorrelationTask() {
  const [alpha, setAlpha] = useState(1)
  const [trial, setTrial] = useState(0)
  const [delta, setDelta] = useState(0.2)
  const [history, setHistory] = useState<{ delta: number; correct: boolean }[]>([])
  const [feedback, setFeedback] = useState<null | boolean>(null)
  const seed = 1000 + trial * 17
  const higherLeft = useMemo(() => ((seed * 9301 + 49297) % 233280) / 233280 > 0.5, [seed])
  const done = trial >= TRIALS
  const left = higherLeft ? Math.min(0.98, BASE + delta) : BASE
  const right = higherLeft ? BASE : Math.min(0.98, BASE + delta)

  const pick = (side: 'left' | 'right') => {
    const correct = (side === 'left') === higherLeft
    setFeedback(correct)
    setHistory((h) => [...h, { delta, correct }])
    // 2-down-1-up-ish: shrink on correct, grow on wrong
    setDelta((d) => (correct ? Math.max(0.02, d * 0.75) : Math.min(0.35, d * 1.4)))
    window.setTimeout(() => {
      setFeedback(null)
      setTrial((t) => t + 1)
    }, 550)
  }

  const reset = (a = alpha) => {
    setAlpha(a)
    setTrial(0)
    setDelta(0.2)
    setHistory([])
    setFeedback(null)
  }

  const last = history.slice(-6)
  const jnd = last.length ? last.reduce((s, h) => s + h.delta, 0) / last.length : delta
  const accuracy = history.length ? Math.round((history.filter((h) => h.correct).length / history.length) * 100) : 0

  return (
    <div className="rounded-[22px] bg-[linear-gradient(150deg,#f4f7fc,#e4ebf7)] p-5 font-sans text-[#1d2a3e] shadow-[0_30px_60px_-36px_rgba(30,50,90,.5)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#4a5568]">point opacity</span>
          {OPACITIES.map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={alpha === o.a}
              onClick={() => reset(o.a)}
              className={`rounded-full px-3 py-1 text-[0.78rem] transition ${alpha === o.a ? 'bg-[#1c5cab] text-white' : 'bg-white text-[#1d2a3e] hover:bg-[#dbe6f6]'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[0.72rem] text-[#4a5568]">
          trial {Math.min(trial + 1, TRIALS)} / {TRIALS}
        </p>
      </div>

      {!done ? (
        <>
          <p className="mt-5 text-center text-[1.05rem]">Which plot looks <strong>more correlated</strong>?</p>
          <div className="relative mx-auto mt-4 grid max-w-[560px] grid-cols-2 gap-4">
            <Plot seed={seed} rho={left} alpha={alpha} onPick={() => pick('left')} label="left" disabled={feedback !== null} />
            <Plot seed={seed + 5} rho={right} alpha={alpha} onPick={() => pick('right')} label="right" disabled={feedback !== null} />
            {feedback !== null && (
              <motion.span
                className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 font-mono text-[0.8rem] text-white shadow-lg ${feedback ? 'bg-[#1baf7a]' : 'bg-[#e34948]'}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {feedback ? '✓ correct' : '✕ not quite'}
              </motion.span>
            )}
          </div>
          <p className="mt-4 text-center font-mono text-[0.7rem] text-[#4a5568]">
            current difference in r: {delta.toFixed(2)} · it shrinks when you’re right, grows when you’re not
          </p>
        </>
      ) : (
        <motion.div className="mx-auto mt-6 max-w-[460px] text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#4a5568]">your estimate at r = {BASE}</p>
          <p className="mt-2 text-[3rem] font-semibold leading-none tabular-nums text-[#1c5cab]">JND ≈ {jnd.toFixed(2)}</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[#3b4a63]">
            You could tell correlations apart when they differed by about {jnd.toFixed(2)} ({accuracy}% correct overall). Try another
            opacity to see if see-through dots change your score.
          </p>
          <button type="button" onClick={() => reset()} className="mt-5 rounded-full bg-[#1d2a3e] px-5 py-2.5 text-[0.85rem] text-white">
            ↺ run it again
          </button>
        </motion.div>
      )}
      <p className="mt-6 text-center font-mono text-[0.65rem] text-[#6b7a90]">A simplified demo of the discrimination (JND) task. Not the lab’s experiment code.</p>
    </div>
  )
}
