import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const CONCERNS = ['Acne', 'Redness or rashes', 'Dryness and cracking', 'Bumpy texture', 'Hyperpigmentation', 'Fine lines']

type Step = { step: string; product: string; why: string; budget: string; splurge: string }

// routine building blocks (illustrative — not medical advice)
const BASE: Step[] = [{ step: 'Cleanse', product: 'Gentle gel cleanser', why: 'A low-pH wash that won’t strip your barrier.', budget: '$12', splurge: '$34' }]
const BY_CONCERN: Record<string, Step> = {
  Acne: { step: 'Tone', product: 'CosRx BHA Blackhead Power Liquid', why: 'Salicylic acid to clear blackheads and control oil.', budget: '$15.75', splurge: '$15.75' },
  'Redness or rashes': { step: 'Soothe', product: 'Centella calming serum', why: 'Cica helps calm visible redness.', budget: '$14', splurge: '$48' },
  'Dryness and cracking': { step: 'Hydrate', product: 'Hyaluronic acid serum', why: 'Pulls moisture in, layered on damp skin.', budget: '$11', splurge: '$42' },
  'Bumpy texture': { step: 'Exfoliate (2×/week)', product: 'Lactic acid treatment', why: 'Gentle AHA for smoother texture.', budget: '$13', splurge: '$52' },
  Hyperpigmentation: { step: 'Brighten', product: 'Niacinamide + vitamin C serum', why: 'Fades dark spots over time.', budget: '$10', splurge: '$58' },
  'Fine lines': { step: 'Night treatment', product: 'Gentle retinal', why: 'Start slow: two nights a week.', budget: '$16', splurge: '$64' },
}
const END: Step[] = [
  { step: 'Moisturize', product: 'Barrier cream', why: 'Locks everything in.', budget: '$15', splurge: '$45' },
  { step: 'Protect', product: 'SPF 50 sunscreen', why: 'Every morning, even when it’s cloudy.', budget: '$17', splurge: '$40' },
]

const sage = '#7e9e74'

export function SkintellectFlow() {
  const [stage, setStage] = useState<'concerns' | 'scan' | 'routine'>('concerns')
  const [picked, setPicked] = useState<string[]>(['Acne', 'Hyperpigmentation'])
  const [budget, setBudget] = useState(true)
  const [progress, setProgress] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    if (stage !== 'scan') return
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2600)
      setProgress(p)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else setStage('routine')
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [stage])

  const routine = [...BASE, ...picked.map((c) => BY_CONCERN[c]).filter(Boolean), ...END]
  const total = routine.reduce((s, r) => s + parseFloat((budget ? r.budget : r.splurge).slice(1)), 0)

  const stepsUI = [
    ['concerns', '1 · tell us about your skin'],
    ['scan', '2 · quick face scan'],
    ['routine', '3 · your routine'],
  ] as const

  return (
    <div className="relative grid items-center gap-8 overflow-hidden rounded-[22px] bg-[linear-gradient(150deg,#f1f2ea,#dfe6d6_60%,#cdd9c2)] px-5 py-8 font-sans text-[#1d241b] shadow-[0_30px_60px_-36px_rgba(40,60,30,.5)] sm:px-10 md:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <p className="font-serif text-[2.4rem] leading-none text-[#1d241b]">skintellect</p>
        <ol className="mt-6 space-y-2">
          {stepsUI.map(([k, label]) => (
            <li key={k} className={`flex items-center gap-3 text-[0.9rem] transition ${stage === k ? 'text-[#1d241b]' : 'text-[#7c8775]'}`}>
              <span className="h-2 w-2 rounded-full transition" style={{ background: stage === k ? sage : '#c3ccbb' }} />
              {label}
            </li>
          ))}
        </ol>
        <div className="mt-7 flex items-center gap-3 rounded-[14px] bg-white/70 px-4 py-3 text-[0.85rem]">
          <span className="flex-1">budget-friendly picks</span>
          <button
            type="button"
            role="switch"
            aria-checked={budget}
            onClick={() => setBudget((b) => !b)}
            className={`relative h-6 w-11 rounded-full transition ${budget ? '' : 'bg-[#c3ccbb]'}`}
            style={budget ? { background: sage } : undefined}
          >
            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${budget ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        {stage === 'routine' && (
          <button type="button" onClick={() => setStage('concerns')} className="mt-4 text-[0.8rem] text-[#55624f] underline underline-offset-4">
            ↺ start over
          </button>
        )}
        <p className="mt-6 max-w-xs text-[0.72rem] leading-relaxed text-[#6d7866]">Prototype demo — product suggestions are illustrative.</p>
      </div>

      {/* phone */}
      <div className="mx-auto w-[min(300px,78vw)] rounded-[42px] bg-[#141518] p-[8px] shadow-[0_30px_50px_-24px_rgba(20,30,15,.6)]">
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[35px] bg-white">
          <span className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
          <AnimatePresence mode="wait">
            {stage === 'concerns' && (
              <motion.div key="c" className="absolute inset-0 flex flex-col px-5 pb-6 pt-12" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
                <p className="text-[1.15rem] font-bold leading-tight">What are your skin concerns?</p>
                <div className="mt-4 flex-1 space-y-2">
                  {CONCERNS.map((c) => {
                    const on = picked.includes(c)
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c]))}
                        className="w-full rounded-full py-2.5 text-[0.82rem] text-white shadow-[0_4px_8px_-4px_rgba(0,0,0,.3)] transition active:scale-[.98]"
                        style={{ background: on ? '#5f7f56' : '#a7bf9d' }}
                      >
                        {on ? '✓ ' : ''}
                        {c}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProgress(0)
                    setStage('scan')
                  }}
                  className="mt-3 rounded-full bg-[#1d241b] py-3 text-[0.85rem] text-white"
                >
                  continue to scan →
                </button>
              </motion.div>
            )}

            {stage === 'scan' && (
              <motion.div key="s" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <img src="screens/skin-face.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),transparent_30%,transparent_70%,rgba(0,0,0,.45))]" />
                <p className="absolute inset-x-0 top-12 text-center text-[1rem] font-bold text-white">Scanning your face…</p>
                {/* frame corners */}
                <div className="absolute inset-x-[14%] top-[24%] h-[48%]">
                  {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
                    <span key={c} className={`absolute h-7 w-7 rounded-[4px] border-white ${c}`} />
                  ))}
                  <motion.span
                    className="absolute inset-x-0 h-[2px] bg-[#c9f0b5] shadow-[0_0_12px_3px_rgba(201,240,181,.8)]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {[
                    [30, 38],
                    [66, 36],
                    [50, 60],
                    [38, 78],
                  ].map(([x, y], k) => (
                    <motion.span
                      key={k}
                      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                      transition={{ delay: 0.4 + k * 0.4 }}
                    />
                  ))}
                </div>
                <div className="absolute inset-x-6 bottom-10">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
                    <div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <p className="mt-2 text-center font-mono text-[0.65rem] text-white/90">analysing texture, tone & hydration · {Math.round(progress * 100)}%</p>
                </div>
              </motion.div>
            )}

            {stage === 'routine' && (
              <motion.div key="r" className="no-scrollbar absolute inset-0 overflow-y-auto px-5 pb-6 pt-12" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[1.1rem] font-bold leading-tight">Let’s get you started with your routine.</p>
                <p className="mt-1 text-[0.68rem] text-[#55624f]">You’re never alone on this journey — we’re here every step of the way.</p>
                <motion.ul className="mt-4 space-y-2.5" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.08 } } }}>
                  {routine.map((r, i) => (
                    <motion.li key={r.step + r.product} variants={{ h: { opacity: 0, y: 12 }, s: { opacity: 1, y: 0 } }} className="rounded-[14px] border border-[#e3e8dd] p-2.5">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[0.72rem] font-bold">
                          Step {i + 1}: {r.step}
                        </p>
                        <motion.span key={String(budget)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[0.65rem]" style={{ color: '#5f7f56' }}>
                          {budget ? r.budget : r.splurge}
                        </motion.span>
                      </div>
                      <p className="text-[0.7rem]">{r.product}</p>
                      <p className="text-[0.6rem] leading-snug text-[#6d7866]">{r.why}</p>
                    </motion.li>
                  ))}
                </motion.ul>
                <p className="mt-4 rounded-[12px] bg-[#eef2e9] p-2.5 text-center text-[0.72rem]">
                  routine total · <strong>${total.toFixed(2)} CAD</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
