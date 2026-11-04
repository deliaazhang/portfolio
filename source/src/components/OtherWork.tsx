import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { designs, type Design } from '../data/designs'
import { SectionLabel } from './Projects'
import { lockScroll } from '../lib/scrollLock'

const TILTS = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.2]
const TAPES = ['bg-sage-tint/90', 'bg-blush/60', 'bg-sky-tint/90']

function Lightbox({ design, onClose }: { design: Design; onClose: () => void }) {
  const [i, setI] = useState(0)
  const n = design.images.length
  const closeRef = useRef<HTMLButtonElement>(null)
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n])

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const unlock = lockScroll()
    closeRef.current?.focus({ preventScroll: true })
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', on)
    return () => {
      unlock()
      window.removeEventListener('keydown', on)
      prev?.focus?.({ preventScroll: true })
    }
  }, [onClose, go])

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={design.title}>
      <motion.div className="absolute inset-0 bg-paper/90 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.figure
        className="relative flex max-h-full w-full max-w-[560px] flex-col"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="relative overflow-hidden rounded-[14px] bg-white p-2 shadow-[0_30px_60px_-24px_rgba(43,42,39,.5)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={design.images[i]}
              src={design.images[i]}
              alt={`${design.alt}${n > 1 ? ` (slide ${i + 1} of ${n})` : ''}`}
              className="mx-auto block max-h-[72svh] w-auto rounded-[8px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            />
          </AnimatePresence>
          {n > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 font-mono text-ink shadow transition hover:bg-white">
                ←
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 font-mono text-ink shadow transition hover:bg-white">
                →
              </button>
            </>
          )}
        </div>
        <figcaption className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="serif-i text-[1.8rem] leading-none text-ink">{design.title}</p>
            <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft">
              {design.org} · {design.kind}
              {n > 1 && ` · ${i + 1}/${n}`}
            </p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="mono-label rounded-full border border-line bg-paper px-4 py-2 text-ink transition hover:border-ink">
            close ✕
          </button>
        </figcaption>
      </motion.figure>
    </motion.div>
  )
}

function Poster({ d, i }: { d: Design; i: number }) {
  return (
    <span className="relative block bg-white p-[5px] shadow-[0_14px_24px_-14px_rgba(43,42,39,.55),0_1px_2px_rgba(43,42,39,.1)]">
      <span className={`absolute -top-2 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rotate-[-3deg] ${TAPES[i % TAPES.length]}`} aria-hidden />
      <span className="relative block aspect-[4/5] overflow-hidden bg-paper-2">
        <img src={d.images[0]} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
        {d.images.length > 1 && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-ink/70 px-1.5 py-px font-mono text-[0.55rem] text-paper">1/{d.images.length}</span>
        )}
      </span>
    </span>
  )
}

function Row({ onOpen, copy = false }: { onOpen: (d: Design) => void; copy?: boolean }) {
  return (
    <ul className={`flex shrink-0 items-start gap-8 pr-8 sm:gap-10 sm:pr-10 ${copy ? 'motion-reduce:hidden' : ''}`} aria-hidden={copy || undefined}>
      {designs.map((d, i) => (
        <li key={d.id} className="w-[150px] shrink-0 sm:w-[190px]">
          <button
            type="button"
            onClick={() => onOpen(d)}
            tabIndex={copy ? -1 : undefined}
            data-cursor="look closer"
            aria-label={`${d.title}, ${d.kind} for ${d.org}. Open larger`}
            className="group block w-full text-left transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-2 hover:rotate-0 focus-visible:-translate-y-2"
            style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
          >
            <Poster d={d} i={i} />
            <span className="serif-i mt-3 block text-[1.1rem] leading-tight text-ink">{d.title}</span>
            <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
              {d.org === 'Arts Undergraduate Society' ? 'AUS' : d.org}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Posters drifting past like the "currently" ticker. Pauses on hover; scrollable list with reduced motion. */
function PosterTicker({ onOpen }: { onOpen: (d: Design) => void }) {
  return (
    <div className="ticker relative -mx-5 overflow-hidden py-6 motion-reduce:overflow-x-auto sm:-mx-10">
      <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-paper to-transparent sm:w-24" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-paper to-transparent sm:w-24" aria-hidden />
      <div className="anim-marquee flex w-max px-5 motion-reduce:px-5 sm:px-10" style={{ animationDuration: '70s' }}>
        <Row onOpen={onOpen} />
        <Row onOpen={onOpen} copy />
      </div>
    </div>
  )
}

export function OtherWork() {
  const [open, setOpen] = useState<Design | null>(null)
  const close = useCallback(() => setOpen(null), [])
  
  return (
    <section id="other-work" className="relative mx-auto max-w-[1440px] overflow-x-clip px-5 pb-8 pt-8 sm:px-10 md:pt-12">
      <div className="mb-6 flex flex-col gap-6 md:mb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="02">graphic design</SectionLabel>
          <motion.h2
            className="display mt-6 text-[clamp(2.4rem,5.5vw,5rem)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Other things <span className="serif-i">I’ve made</span>
          </motion.h2>
        </div>
        <p className="max-w-xs font-mono text-[0.78rem] leading-relaxed text-ink-soft">
          posters and social graphics for Women in Data Science and the Arts Undergraduate Society.{' '}
          <span className="[@media(pointer:coarse)]:hidden">hover to pause, click to look closer.</span>
          <span className="hidden [@media(pointer:coarse)]:inline">tap a poster to look closer.</span>
        </p>
      </div>

      <PosterTicker onOpen={setOpen} />

      <AnimatePresence>{open && <Lightbox design={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}
