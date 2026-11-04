import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { experience, education } from '../data/resume'
import { site } from '../data/site'
import { SectionLabel } from './Projects'

const ease = [0.2, 0.7, 0.2, 1] as const

/** strap + badge colours per organisation */
const STYLE: Record<string, { strap: string; badge: string; ink: string; short: string }> = {
  'UBC UX Hub': { strap: '#8ea7c6', badge: '#e2e9f2', ink: '#2f4a6e', short: 'UX HUB' },
  'WiDS@UBC': { strap: '#2f4f8f', badge: '#dfe6f3', ink: '#1f3566', short: 'WiDS@UBC' },
  HappyVV: { strap: '#e8b8ad', badge: '#f8e4df', ink: '#7a3f35', short: 'HAPPYVV' },
  'UBC Arts Undergraduate Society': { strap: '#8a5aa8', badge: '#ece3f3', ink: '#4c2f66', short: 'AUS' },
  'UBC Visual Cognition Lab': { strap: '#8fa284', badge: '#e3e9dc', ink: '#3e5236', short: 'VIS COG LAB' },
  'University of British Columbia': { strap: '#d8b35e', badge: '#f6ecd2', ink: '#6b5321', short: 'UBC' },
}
const fallback = { strap: '#9a968c', badge: '#efebe1', ink: '#2b2a27', short: '' }

function Lanyard({ x, i }: { x: (typeof experience)[number]; i: number }) {
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const s = STYLE[x.org] ?? fallback
  const tilt = [-2, 1.5, -1, 2, -1.5, 1, -2.5][i % 7]

  return (
    <motion.li
      className="relative flex flex-col items-center"
      initial={reduce ? false : { opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 140, damping: 14, delay: (i % 4) * 0.08 }}
    >
      {/* hook */}
      <span className="relative z-10 h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#9aa3ad_55%,#6f7882)] shadow-[0_2px_3px_rgba(0,0,0,.3)]" aria-hidden />
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${x.role} at ${x.org}, ${x.when}. ${flipped ? 'Show front' : 'Flip for details'}`}
        data-cursor={flipped ? 'flip back' : 'flip it'}
        className="group relative -mt-1.5 block w-full max-w-[200px] cursor-pointer"
        style={{ transformOrigin: '50% 0%', rotate: tilt }}
        whileHover={reduce ? undefined : { rotate: [tilt, tilt + 6, tilt - 4, tilt + 2, tilt], transition: { duration: 1.4, ease: 'easeInOut' } }}
      >
        {/* strap: two ribbons meeting at a clip */}
        <svg viewBox="0 0 100 74" className="mx-auto block w-[64%]" aria-hidden>
          <path d="M50 0 L22 64 L34 64 L50 14 L66 64 L78 64 Z" fill={s.strap} />
          <path d="M50 0 L22 64 L28 64 L50 8 Z" fill="#fff" opacity=".18" />
          <rect x="36" y="58" width="28" height="12" rx="3" fill="#b9c0c8" stroke="#8a929b" />
          <rect x="45" y="68" width="10" height="6" rx="2" fill="#8a929b" />
        </svg>

        {/* badge with a flip */}
        <div className="relative -mt-1 [perspective:900px]">
          <motion.div
            className="relative aspect-[5/7] w-full [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 20 }}
          >
            {/* front */}
            <div
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[12px] border border-white/70 p-4 shadow-[0_18px_28px_-16px_rgba(43,42,39,.55),0_1px_2px_rgba(43,42,39,.1)] [backface-visibility:hidden]"
              style={{ background: s.badge, color: s.ink }}
            >
              <span className="mx-auto h-1.5 w-10 rounded-full bg-black/15" aria-hidden />
              <p className="mt-3 font-mono text-[0.6rem] font-medium uppercase tracking-[0.2em]" style={{ color: s.strap === '#d8b35e' ? s.ink : s.strap }}>
                {s.short || x.org}
              </p>
              <div className="mt-3 aspect-square w-[46%] overflow-hidden rounded-[8px] bg-white/70 ring-2 ring-white/80" aria-hidden>
                <img src="photos/delia.webp" alt="" className="h-full w-full origin-[56%_30%] scale-[2.2] object-cover" loading="lazy" draggable={false} />
              </div>
              <p className="mt-auto text-[0.62rem] uppercase tracking-[0.16em] opacity-60">{site.name}</p>
              <p className="mt-1 text-[1.02rem] font-medium leading-tight">{x.role}</p>
              <p className="mt-2 font-mono text-[0.6rem] tracking-wide opacity-70">{x.when}</p>
              <span className="pointer-events-none absolute inset-y-0 right-3 w-4 -skew-x-12 bg-white/30" aria-hidden />
            </div>
            {/* back */}
            <div
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[12px] border border-white/70 bg-[#fffdf6] p-4 text-ink shadow-[0_18px_28px_-16px_rgba(43,42,39,.55)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <span className="mx-auto h-1.5 w-10 rounded-full bg-black/10" aria-hidden />
              <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-faint">{x.org}</p>
              <p className="mt-2 text-[0.8rem] leading-snug text-ink-soft">{x.summary}</p>
              <p className="mt-auto pt-2 font-mono text-[0.58rem] text-ink-faint">tap to flip back ↺</p>
            </div>
          </motion.div>
        </div>
      </motion.button>
    </motion.li>
  )
}

/** Student card + boarding pass for school and study abroad. */
function SchoolCards() {
  const reduce = useReducedMotion()
  const [ubc, upf] = education
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
      {ubc && (
        <motion.div
          className="relative w-[min(100%,340px)] -rotate-2 overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#1f3a6e,#2f5a9e)] p-5 text-white shadow-[0_24px_40px_-24px_rgba(20,30,60,.7)]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          whileHover={reduce ? undefined : { rotate: 0, y: -4 }}
        >
          <div className="flex items-start justify-between">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-80">student card</p>
            <span className="h-6 w-9 rounded-[4px] bg-[linear-gradient(135deg,#f3d58a,#c9a24c)]" aria-hidden />
          </div>
          <p className="mt-4 text-[1.15rem] font-medium leading-tight">{ubc.school}</p>
          <p className="mt-1 text-[0.82rem] leading-snug opacity-85">{ubc.detail.split(' · ')[0]}</p>
          <div className="mt-4 flex items-end justify-between font-mono text-[0.62rem] tracking-wide opacity-80">
            <span>{site.name.toUpperCase()}</span>
            <span>{ubc.when}</span>
          </div>
        </motion.div>
      )}
      {upf && (
        <motion.div
          className="relative flex w-[min(100%,380px)] rotate-[1.5deg] overflow-hidden rounded-[12px] bg-[#fffdf6] text-ink shadow-[0_24px_40px_-24px_rgba(43,42,39,.55)]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          whileHover={reduce ? undefined : { rotate: 0, y: -4 }}
        >
          <div className="flex-1 border-r-2 border-dashed border-line p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">boarding pass · study abroad</p>
            <div className="mt-3 flex items-center gap-3 font-mono text-[1.3rem] font-medium tracking-wide">
              YVR <span className="text-[0.9rem] text-sky-deep">✈</span> BCN
            </div>
            <p className="mt-2 text-[0.85rem] leading-snug text-ink-soft">{upf.school} · business + product management</p>
            <p className="mt-3 font-mono text-[0.62rem] tracking-wide text-ink-faint">{upf.when}</p>
          </div>
          <div className="flex w-[76px] flex-col items-center justify-center gap-2 bg-sky-tint/60 p-2">
            <span className="h-14 w-10 bg-[repeating-linear-gradient(90deg,#4f6d94_0_2px,transparent_2px_4px,#4f6d94_4px_5px,transparent_5px_8px)]" aria-hidden />
            <span className="font-mono text-[0.55rem] text-sky-deep">SEAT 1A</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function Lanyards() {
  return (
    <section id="experience" className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-16 sm:px-10 md:pt-24">
      <SectionLabel index="03">where i’ve been</SectionLabel>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="display text-[clamp(2.4rem,5.5vw,5rem)]">
          a few <span className="serif-i">lanyards</span> later
        </h2>
        <p className="max-w-sm font-mono text-[0.75rem] leading-relaxed text-ink-soft">
          the teams i’ve been part of. <span className="text-ink-faint">hover to swing, click to flip one over.</span>
        </p>
      </div>

      {/* rail */}
      <div className="relative mt-12">
        <div className="absolute inset-x-0 top-[5px] hidden h-[3px] rounded-full bg-[linear-gradient(180deg,#c8ced6,#8a929b)] xl:block" aria-hidden />
        <ul className="relative grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 xl:gap-x-4">
          {experience.map((x, i) => (
            <Lanyard key={x.org + x.role} x={x} i={i} />
          ))}
        </ul>
      </div>

      <div className="mt-20">
        <SchoolCards />
      </div>

      <div className="mt-14 flex justify-center">
        <a
          href={site.resume}
          target="_blank"
          rel="noreferrer"
          className="mono-label group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-paper transition hover:bg-ink-soft"
        >
          see my full résumé
          <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
            ↗
          </span>
        </a>
      </div>
    </section>
  )
}
