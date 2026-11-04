import { motion } from 'motion/react'
import { site } from '../data/site'

function Items({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2" aria-hidden={hidden || undefined}>
      {site.ticker.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">{t.label}</span>
          <span className="ml-2.5 text-[0.98rem] tracking-[-0.01em] text-ink">{t.text}</span>
          <span className="mx-7 text-[0.7rem] text-sage" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
}

/** A slow "currently" strip between the intro and the projects. Pauses on hover; static with reduced motion. */
export function Ticker() {
  return (
    <motion.section
      aria-label="What Delia is up to"
      className="ticker relative overflow-hidden border-y border-line bg-paper/70 py-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.8 }}
    >
      {/* soft fades at the edges */}
      <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28" aria-hidden />
      <div className="anim-marquee flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2 motion-reduce:px-5">
        <Items />
        <div className="contents motion-reduce:hidden">
          <Items hidden />
        </div>
      </div>
    </motion.section>
  )
}
