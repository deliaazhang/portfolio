import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { noise, scatter } from './prototypes/correlation'

const STEPS = [0.3, 0.6, 0.9, 0.6]

/** A scatterplot whose correlation slowly changes while `playing`. */
export function ScatterMorph({ playing, hero = false }: { playing: boolean; hero?: boolean }) {
  const reduce = useReducedMotion()
  const base = useMemo(() => noise(90, 7), [])
  const [i, setI] = useState(1)
  useEffect(() => {
    if (!playing || reduce) return
    const t = window.setInterval(() => setI((v) => (v + 1) % STEPS.length), 1500)
    return () => window.clearInterval(t)
  }, [playing, reduce])
  const rho = STEPS[i]
  const pts = useMemo(() => scatter(base, rho), [base, rho])
  const W = 300
  const H = 220
  const pad = 22

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`relative rounded-[14px] bg-white/90 p-3 shadow-[0_24px_40px_-26px_rgba(30,50,90,.5)] ${hero ? 'w-[62%]' : 'w-[78%]'}`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Scatterplot with correlation ${rho.toFixed(1)}`}>
          <line x1={pad} y1={H - pad} x2={W - 8} y2={H - pad} stroke="#c9ccd2" strokeWidth="1" />
          <line x1={pad} y1={8} x2={pad} y2={H - pad} stroke="#c9ccd2" strokeWidth="1" />
          {pts.map(([x, y], k) => (
            <motion.circle
              key={k}
              r={3.2}
              fill="#1c5cab"
              fillOpacity={0.75}
              initial={false}
              animate={{ cx: pad + 6 + x * (W - pad - 22), cy: H - pad - 6 - y * (H - pad - 22) }}
              transition={{ type: 'spring', stiffness: 60, damping: 14, mass: 0.6 }}
            />
          ))}
        </svg>
        <motion.span
          key={rho}
          className="absolute right-4 top-3 rounded-full bg-[#e9eef8] px-2.5 py-1 font-mono text-[0.68rem] text-[#1c5cab]"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          r = {rho.toFixed(2)}
        </motion.span>
      </div>
    </div>
  )
}
