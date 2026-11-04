import { motion, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'
import { Doodle, type DoodleName } from './Doodles'

const NOTES: { bg: string; edge: string; pin: string; doodle: DoodleName; rotate: number; lift: string }[] = [
  { bg: '#fbeaa5', edge: '#f1d77a', pin: '#e8b8ad', doodle: 'bulb', rotate: -2.5, lift: 'lg:mt-2' },
  { bg: '#f8d3d6', edge: '#efb6bc', pin: '#8ea7c6', doodle: 'pencil', rotate: 2, lift: 'lg:mt-14' },
  { bg: '#d3e4f4', edge: '#b4cee8', pin: '#f2c46d', doodle: 'brain', rotate: -1.5, lift: 'lg:mt-0' },
  { bg: '#d9ecc8', edge: '#bddaa5', pin: '#e8b8ad', doodle: 'gear', rotate: 2.5, lift: 'lg:mt-12' },
]

function Pin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 30" className="absolute left-1/2 top-[-14px] z-10 w-[22px] -translate-x-1/2 drop-shadow-[0_3px_2px_rgba(0,0,0,.25)]" aria-hidden>
      <path d="M12 18 L12 29" stroke="#8a929b" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="12" cy="17" rx="8" ry="3" fill={color} />
      <path d="M7 6 Q12 3 17 6 L16 16 Q12 18 8 16Z" fill={color} />
      <ellipse cx="12" cy="5.5" rx="7" ry="3.5" fill={color} />
      <ellipse cx="10" cy="5" rx="3" ry="1.4" fill="#fff" opacity=".6" />
    </svg>
  )
}

/** The design process as typed post-it notes pinned to a pegboard. */
export function ProcessBoard({ project }: { project: Project }) {
  const reduce = useReducedMotion()
  const steps = project.process.steps

  return (
    <div
      className="relative overflow-hidden rounded-[18px] border-[clamp(6px,0.9vw,12px)] border-[#d9cdb9] bg-[#dfe5d6] px-5 pb-12 pt-10 shadow-[0_40px_60px_-36px_rgba(43,42,39,.55),inset_0_2px_6px_rgba(0,0,0,.08)] sm:px-8 lg:px-10"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 42%, rgba(55,66,48,.42) 0 2.1px, transparent 2.6px), radial-gradient(circle at 50% 58%, rgba(255,255,255,.55) 0 2.1px, transparent 2.6px)',
        backgroundSize: '26px 26px',
      }}
    >
      {/* corner screws */}
      {['left-2 top-2', 'right-2 top-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((c) => (
        <span key={c} className={`absolute ${c} h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#a7afb8)]`} aria-hidden />
      ))}

      {/* index card header */}
      <motion.div
        className="relative mb-12 inline-block -rotate-1 bg-[#fffdf6] bg-[repeating-linear-gradient(180deg,transparent_0_27px,rgba(142,167,198,.45)_27px_28px)] px-6 pb-4 pt-5 shadow-[0_10px_18px_-10px_rgba(43,42,39,.45)]"
        initial={reduce ? false : { opacity: 0, y: -14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
      >
        <span className="absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 rotate-2 bg-sage-tint/90" aria-hidden />
        <span className="absolute inset-y-0 left-4 w-px bg-blush" aria-hidden />
        <p className="pl-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-faint">{project.title}</p>
        <p className="serif-i pl-3 text-[2rem] leading-[1.1] text-ink">design process</p>
      </motion.div>

      <ol className="relative grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const n = NOTES[i % NOTES.length]
          return (
            <motion.li
              key={s.title}
              className={`relative ${n.lift}`}
              initial={reduce ? false : { opacity: 0, y: -30, rotate: n.rotate + 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: n.rotate }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 160, damping: 13, delay: i * 0.12 }}
              whileHover={reduce ? undefined : { rotate: 0, y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
              style={{ transformOrigin: '50% 0%' }}
            >
              <Pin color={n.pin} />
              <div
                className="relative min-h-[220px] px-5 pb-6 pt-6 shadow-[0_18px_22px_-14px_rgba(43,42,39,.5),0_2px_3px_rgba(43,42,39,.12)]"
                style={{
                  background: `linear-gradient(170deg, ${n.bg} 0%, ${n.bg} 78%, ${n.edge} 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 100% 92%, 90% 100%, 0 100%)',
                }}
              >
                {/* folded corner */}
                <span
                  className="absolute bottom-0 right-0 h-[8%] w-[10%] min-h-[18px] min-w-[18px]"
                  style={{ background: `linear-gradient(135deg, ${n.edge} 0%, rgba(0,0,0,.12) 100%)` }}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.7rem] text-ink/55">step 0{i + 1}</p>
                    <p className="serif-i mt-0.5 text-[1.9rem] leading-none text-ink">{s.title}</p>
                  </div>
                  <Doodle name={n.doodle} size={40} draw={false} className="shrink-0 text-ink/60" />
                </div>
                <ul className="mt-4 space-y-2.5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-[0.92rem] leading-snug text-ink/85">
                      <span className="shrink-0 text-ink/45" aria-hidden>
                        ↳
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              {/* dashed arrow to the next note (desktop) */}
              {i < steps.length - 1 && (
                <svg
                  viewBox="0 0 60 30"
                  className="pointer-events-none absolute -right-[42px] top-[42%] hidden w-[48px] text-ink/45 lg:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="3 4"
                  aria-hidden
                >
                  <path d={i % 2 ? 'M4 6 Q30 2 52 20' : 'M4 24 Q30 30 52 10'} />
                  <path d={i % 2 ? 'M44 20 L52 20 L50 12' : 'M44 10 L52 10 L50 18'} strokeDasharray="0" />
                </svg>
              )}
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
