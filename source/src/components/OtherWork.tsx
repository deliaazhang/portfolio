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

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return w
}

// stable little offsets so the pile looks hand-stacked
const jitter = (i: number, amp: number) => {
  const v = Math.sin(i * 12.9898 + amp * 78.233) * 43758.5453
  return v - Math.floor(v)
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

/** Desktop: a stacked pile that fans out while hovered (or focused). */
function Pile({ onOpen }: { onOpen: (d: Design) => void }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const W = useWidth(ref)
  const [spread, setSpread] = useState(false)
  const [hot, setHot] = useState<number | null>(null)
  const leave = useRef<number | undefined>(undefined)
  const n = designs.length
  const cw = Math.max(130, Math.min(190, W * 0.15))
  const ch = cw * 1.25 + 10
  const H = ch + 110

  const place = (i: number) => {
    if (!spread) {
      return {
        x: W / 2 - cw / 2 + (jitter(i, 1) - 0.5) * 70,
        y: 40 + (jitter(i, 2) - 0.5) * 26,
        rotate: (jitter(i, 3) - 0.5) * 22,
        scale: 1,
      }
    }
    const t = n > 1 ? i / (n - 1) : 0.5
    const span = W - cw
    const lift = hot === i ? -26 : 0
    return {
      x: t * span,
      y: 44 + Math.pow(t - 0.5, 2) * 120 + lift,
      rotate: (t - 0.5) * 18 * (hot === i ? 0.3 : 1),
      scale: hot === i ? 1.1 : 1,
    }
  }

  const open = () => {
    window.clearTimeout(leave.current)
    setSpread(true)
  }
  const shut = () => {
    leave.current = window.setTimeout(() => {
      setSpread(false)
      setHot(null)
    }, 220)
  }
  useEffect(() => () => window.clearTimeout(leave.current), [])

  const label = hot !== null ? designs[hot] : null

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[1120px]"
      style={{ height: H }}
      onPointerEnter={open}
      onPointerLeave={shut}
      onFocus={open}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) shut()
      }}
    >
      {W > 0 &&
        designs.map((d, i) => (
          <motion.button
            key={d.id}
            type="button"
            onClick={() => onOpen(d)}
            onPointerEnter={() => spread && setHot(i)}
            onPointerLeave={() => setHot((h) => (h === i ? null : h))}
            onFocus={() => setHot(i)}
            data-cursor={spread ? 'look closer' : 'spread them out'}
            aria-label={`${d.title}, ${d.kind} for ${d.org}. Open larger`}
            className="absolute left-0 top-0 block"
            style={{ width: cw, zIndex: hot === i ? 50 : spread ? i + 1 : n - i }}
            initial={false}
            animate={place(i)}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 20, mass: 0.7, delay: spread && hot === null ? i * 0.015 : 0 }}
          >
            <Poster d={d} i={i} />
          </motion.button>
        ))}

      {/* caption for the poster under the cursor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-12 flex-col items-center justify-end text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          {label ? (
            <motion.p key={label.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <span className="serif-i text-[1.35rem] text-ink">{label.title}</span>
              <span className="ml-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-faint">
                {label.org === 'Arts Undergraduate Society' ? 'AUS' : label.org} · {label.kind}
              </span>
            </motion.p>
          ) : (
            <motion.p key={spread ? 'pick' : 'hint'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-[0.7rem] tracking-wide text-ink-faint">
              {spread ? 'click a poster for a closer look' : `hover the pile · ${n} posters`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Touch / narrow screens: a swipeable row. */
function Strip({ onOpen }: { onOpen: (d: Design) => void }) {
  return (
    <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 pt-4 sm:-mx-10 sm:px-10">
      {designs.map((d, i) => (
        <li key={d.id} className="w-[42vw] max-w-[200px] shrink-0 snap-start" style={{ rotate: `${TILTS[i % TILTS.length] * 0.6}deg` }}>
          <button type="button" onClick={() => onOpen(d)} aria-label={`${d.title}, ${d.kind} for ${d.org}. Open larger`} className="block w-full text-left">
            <Poster d={d} i={i} />
            <span className="serif-i mt-2.5 block text-[1.05rem] leading-tight text-ink">{d.title}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function OtherWork() {
  const [open, setOpen] = useState<Design | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const fan = useMedia('(min-width: 768px) and (pointer: fine)')

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
          posters and social graphics for Women in Data Science and the Arts Undergraduate Society.
        </p>
      </div>

      {fan ? <Pile onOpen={setOpen} /> : <Strip onOpen={setOpen} />}

      <AnimatePresence>{open && <Lightbox design={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}
