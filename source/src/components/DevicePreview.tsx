import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'

/* ── device frames ─────────────────────────────────────── */

export function Laptop({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-[3.2%/5%] bg-[linear-gradient(180deg,#2a2c31,#16171a)] p-[1.6%] pb-[2.4%] shadow-[0_30px_50px_-28px_rgba(20,22,30,.6)]">
        <span className="absolute left-1/2 top-[0.7%] z-10 h-[2.2%] w-[14%] -translate-x-1/2 rounded-b-[6px] bg-[#16171a]" aria-hidden />
        <div className="relative aspect-[16/10.2] overflow-hidden rounded-[0.8%] bg-black">{children}</div>
      </div>
      {/* base */}
      <div className="relative mx-[-6%] h-0 pb-[3.4%]">
        <div className="absolute inset-0 rounded-b-[40%_100%] bg-[linear-gradient(180deg,#3a3c42,#202125)] shadow-[0_18px_24px_-14px_rgba(20,22,30,.55)]" />
        <span className="absolute left-1/2 top-0 h-[40%] w-[16%] -translate-x-1/2 rounded-b-[8px] bg-[#16171a]" aria-hidden />
      </div>
    </div>
  )
}

export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[15%/7.2%] bg-[linear-gradient(160deg,#3a3c42,#141518)] p-[3.6%] shadow-[0_26px_40px_-22px_rgba(20,22,30,.6)] ${className}`}
    >
      <div className="relative aspect-[9/19.4] overflow-hidden rounded-[12%/5.6%] bg-black">
        {children}
        <span className="absolute left-1/2 top-[1.6%] z-10 h-[3.4%] w-[32%] -translate-x-1/2 rounded-full bg-black" aria-hidden />
      </div>
    </div>
  )
}

/* ── a screen that plays through images like a screen recording ─── */

function useTicker(playing: boolean, length: number, interval: number, offset = 0) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!playing || length < 2) return
    let t: number
    const start = window.setTimeout(() => {
      setI((v) => (v + 1) % length)
      t = window.setInterval(() => setI((v) => (v + 1) % length), interval)
    }, offset + interval * 0.6)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(t)
    }
  }, [playing, length, interval, offset])
  // reset to first frame when stopped
  useEffect(() => {
    if (!playing) setI(0)
  }, [playing])
  return i
}

// where the fake cursor / finger "clicks" before each transition (as % of the screen)
const HOTSPOTS = [
  [72, 30],
  [38, 62],
  [64, 74],
  [30, 38],
  [56, 52],
  [80, 64],
]

function Reel({
  screens,
  playing,
  interval,
  offset = 0,
  pointer,
  label,
}: {
  screens: string[]
  playing: boolean
  interval: number
  offset?: number
  pointer: 'cursor' | 'tap' | 'none'
  label: string
}) {
  const reduce = useReducedMotion()
  const live = playing && !reduce
  const i = useTicker(live, screens.length, interval, offset)
  const [hx, hy] = HOTSPOTS[i % HOTSPOTS.length]

  return (
    <div className="absolute inset-0" aria-label={label} role="img">
      <AnimatePresence initial={false}>
        <motion.img
          key={screens[i]}
          src={screens[i]}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top"
          initial={{ opacity: 0, scale: 1.04, y: '2%' }}
          animate={{ opacity: 1, scale: live ? 1.06 : 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.45 },
            y: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
            scale: { duration: live ? interval / 1000 + 0.6 : 0.4, ease: 'linear' },
          }}
        />
      </AnimatePresence>

      {live && pointer === 'cursor' && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-20"
          initial={false}
          animate={{ left: `${hx}%`, top: `${hy}%` }}
          transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" className="-translate-x-[2px] -translate-y-[2px] drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]">
            <path d="M1 1 L1 16 L5 12 L8 19 L11 17.5 L8 11 L14 11 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <motion.span
            key={i}
            className="absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.2], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.6, delay: interval / 1000 - 0.75 }}
          />
        </motion.div>
      )}
      {live && pointer === 'tap' && (
        <motion.span
          key={`tap-${i}`}
          className="pointer-events-none absolute z-20 h-[14%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60"
          style={{ left: `${hx}%`, top: `${hy}%` }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, 1, 1.2], opacity: [0, 0.75, 0] }}
          transition={{ duration: 0.7, delay: interval / 1000 - 0.8 }}
        />
      )}
    </div>
  )
}

/* ── the composed preview for each project ─────────────── */

export function ProjectPreview({
  project,
  playing,
  size = 'card',
}: {
  project: Project
  playing: boolean
  size?: 'card' | 'hero'
}) {
  const { preview, title } = project
  const hero = size === 'hero'

  if (preview.device === 'laptop') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className={hero ? 'w-[78%]' : 'w-[74%]'}
          animate={{ y: playing ? -6 : 0, rotateX: playing ? 0 : 6 }}
          style={{ transformPerspective: 1200 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <Laptop>
            <Reel screens={preview.screens} playing={playing} interval={2300} pointer="cursor" label={`${title} screens`} />
          </Laptop>
        </motion.div>
        {preview.extras?.map((src, k) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            draggable={false}
            className={`absolute rounded-[6px] shadow-[0_18px_30px_-14px_rgba(10,20,50,.55)] ${hero ? 'w-[17%]' : 'w-[19%]'}`}
            style={{ right: k === 0 ? '4%' : 'auto', left: k === 1 ? '4%' : 'auto', bottom: k === 0 ? '9%' : 'auto', top: k === 1 ? '12%' : 'auto' }}
            initial={false}
            animate={{ y: playing ? (k ? -8 : 8) : 0, rotate: playing ? (k ? -9 : 8) : k ? -4 : 4, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 110, damping: 14 }}
          />
        ))}
      </div>
    )
  }

  // three phones, the middle one playing
  const s = preview.screens
  const rot = (n: number) => s.slice(n).concat(s.slice(0, n))
  const left = rot(2)
  const right = rot(4)
  const mid = s
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className={`absolute ${hero ? 'w-[18%]' : 'w-[24%]'}`}
        initial={false}
        animate={{ x: playing ? '-118%' : '-92%', rotate: playing ? -10 : -6, y: playing ? 10 : 14 }}
        transition={{ type: 'spring', stiffness: 110, damping: 16 }}
      >
        <Phone>
          <Reel screens={left} playing={playing} interval={2600} offset={900} pointer="none" label="" />
        </Phone>
      </motion.div>
      <motion.div
        className={`absolute ${hero ? 'w-[18%]' : 'w-[24%]'}`}
        initial={false}
        animate={{ x: playing ? '118%' : '92%', rotate: playing ? 10 : 6, y: playing ? 10 : 14 }}
        transition={{ type: 'spring', stiffness: 110, damping: 16 }}
      >
        <Phone>
          <Reel screens={right} playing={playing} interval={2600} offset={1700} pointer="none" label="" />
        </Phone>
      </motion.div>
      <motion.div
        className={`relative z-10 ${hero ? 'w-[22%]' : 'w-[29%]'}`}
        initial={false}
        animate={{ y: playing ? -8 : 0, scale: playing ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      >
        <Phone>
          <Reel screens={mid} playing={playing} interval={2100} pointer="tap" label={`${title} screens`} />
        </Phone>
      </motion.div>
    </div>
  )
}

/** Plays while hovered on desktop; on touch screens, plays while the card is centred in view. */
export function usePreviewPlaying() {
  const ref = useRef<HTMLElement | null>(null)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const [coarse] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (!coarse || !ref.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '-30% 0px -30% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [coarse])

  return {
    ref,
    playing: coarse ? visible : hover,
    bind: {
      onPointerEnter: (e: PointerEvent) => e.pointerType === 'mouse' && setHover(true),
      onPointerLeave: (e: PointerEvent) => e.pointerType === 'mouse' && setHover(false),
      onFocus: () => setHover(true),
      onBlur: () => setHover(false),
    },
  }
}
