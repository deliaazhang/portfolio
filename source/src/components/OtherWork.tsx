import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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

export function OtherWork() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<Design | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="other-work" className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-8 sm:px-10 md:pt-12">
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
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
          posters and social graphics for Women in Data Science and the Arts Undergraduate Society. click one for a closer look.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
        {designs.map((d, i) => {
          const tilt = TILTS[i % TILTS.length]
          return (
            <motion.li
              key={d.id}
              initial={reduce ? false : { opacity: 0, y: 40, rotate: tilt * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: (i % 4) * 0.08 }}
              whileHover={reduce ? undefined : { rotate: 0, y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <button
                type="button"
                onClick={() => setOpen(d)}
                data-cursor="look closer"
                aria-label={`${d.title}, ${d.kind} for ${d.org}. Open larger`}
                className="group relative block w-full text-left"
              >
                <span className={`absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-[-3deg] ${TAPES[i % TAPES.length]}`} aria-hidden />
                <span className="relative block bg-white p-2 pb-2 shadow-[0_18px_30px_-18px_rgba(43,42,39,.5),0_1px_2px_rgba(43,42,39,.08)] transition-shadow duration-500 group-hover:shadow-[0_28px_40px_-20px_rgba(43,42,39,.55)]">
                  <span className="relative block aspect-[4/5] overflow-hidden bg-paper-2">
                    <img src={d.images[0]} alt={d.alt} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    {d.images.length > 1 && (
                      <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[0.6rem] text-paper backdrop-blur">
                        1/{d.images.length}
                      </span>
                    )}
                  </span>
                </span>
                <span className="mt-3 block px-1">
                  <span className="serif-i block text-[1.3rem] leading-tight text-ink">{d.title}</span>
                  <span className="mt-1 block font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-faint">
                    {d.org === 'Arts Undergraduate Society' ? 'AUS' : d.org} · {d.kind}
                  </span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ul>

      <AnimatePresence>{open && <Lightbox design={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}
