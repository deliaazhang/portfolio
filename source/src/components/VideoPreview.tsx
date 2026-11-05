import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'
import { ScatterMorph } from './ScatterMorph'

const SEG = 3000 // ms per shot

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** where the tap / click lands before each screen change (as % of the screen) */
const SPOTS = [
  [70, 34],
  [32, 58],
  [62, 72],
  [40, 30],
  [55, 50],
  [78, 62],
  [28, 44],
]

const URLS: Record<string, string> = {
  arctrail: 'arctrail.ca/collaborations',
}

/** a soft tap ripple that fires shortly before the screen changes */
function Ripple({ i, live, finger, dur = SEG }: { i: number; live: boolean; finger: boolean; dur?: number }) {
  if (!live) return null
  const [x, y] = SPOTS[i % SPOTS.length]
  return (
    <motion.span
      key={`r${i}`}
      className={`pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full ${finger ? 'h-[12%] w-[22%] bg-white/55' : 'h-7 w-7 border-2 border-white/90'}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: [0.3, 1, 1.25], opacity: [0, 0.85, 0] }}
      transition={{ duration: 0.6, delay: dur / 1000 - 0.75 }}
    />
  )
}

/** a screen that scrolls from top to bottom while it's showing, if it's taller than the frame */
function ScrollShot({ src, of, live, dur }: { src: string; of: number; live: boolean; dur: number }) {
  if (of <= 0.1) {
    return <img src={src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover object-top" />
  }
  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      className="absolute inset-x-0 top-0 h-auto w-full"
      initial={{ y: '0%' }}
      animate={{ y: live ? `-${of * 100}%` : '0%' }}
      transition={{ duration: live ? (dur - 1500) / 1000 : 0.4, delay: live ? 0.7 : 0, ease: [0.45, 0.05, 0.25, 1] }}
    />
  )
}

/** mouse cursor that glides to the next click spot */
function Cursor({ i, live }: { i: number; live: boolean }) {
  if (!live) return null
  const [x, y] = SPOTS[i % SPOTS.length]
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-30"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ duration: 1.4, delay: 0.6, ease: [0.45, 0, 0.2, 1] }}
    >
      <svg width="15" height="19" viewBox="0 0 16 20" className="-translate-x-[2px] -translate-y-[2px] drop-shadow-[0_2px_3px_rgba(0,0,0,.35)]" aria-hidden>
        <path d="M1 1 L1 16 L5 12 L8 19 L11 17.5 L8 11 L14 11 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

/**
 * A preview that plays like a short product video of the real screens:
 * the device moves as one piece, screens change with a native-feeling
 * transition after a tap or click, and player chrome shows progress.
 */
export function VideoPreview({ project, playing, size = 'card' }: { project: Project; playing: boolean; size?: 'card' | 'hero' }) {
  const reduce = useReducedMotion()
  const live = playing && !reduce
  const { device, screens } = project.preview
  const shots = device === 'viz' ? [0, 1, 2, 3] : screens
  const n = Math.max(1, shots.length)
  const [i, setI] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  // measure each screen so tall pages can scroll and stay on screen longer
  const [ratios, setRatios] = useState<Record<string, number>>({})
  useEffect(() => {
    if (device === 'viz') return
    screens.forEach((u) => {
      const im = new Image()
      im.onload = () => setRatios((r) => (r[u] ? r : { ...r, [u]: im.naturalHeight / im.naturalWidth }))
      im.src = u
    })
  }, [device, screens])
  const frameRatio = device === 'laptop' ? 10 / 16 : 19.5 / 9
  const overflow = (u?: string | null) => (u && ratios[u] ? Math.max(0, 1 - frameRatio / ratios[u]) : 0)
  const durOf = (k: number) => (device !== 'viz' && overflow(screens[k]) > 0.1 ? 5200 : SEG)
  const total = Array.from({ length: n }).reduce<number>((t, _, k) => t + durOf(k), 0)

  useEffect(() => {
    if (!live) return
    const a = window.setTimeout(() => setI((v) => (v + 1) % n), durOf(i))
    return () => window.clearTimeout(a)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, n, i, ratios])
  useEffect(() => {
    if (!live) return
    const b = window.setInterval(() => setElapsed((e) => e + 250), 250)
    return () => window.clearInterval(b)
  }, [live])
  useEffect(() => {
    if (!playing) {
      setI(0)
      setElapsed(0)
    }
  }, [playing])

  const src = device === 'viz' ? null : screens[i]
  const next = device === 'viz' ? null : screens[(i + 1) % n]
  const hero = size === 'hero'
  // gentle hand-held camera drift for the whole device
  const drift = live
    ? { y: [0, -6, 0, 4, 0], rotate: device === 'phones' ? [-1.2, 0.8, -0.6, 1, -1.2] : [0, 0, 0, 0, 0], scale: 1.03 }
    : { y: 0, rotate: 0, scale: 1 }
  const driftT = live ? { duration: 9, repeat: Infinity, ease: 'easeInOut' as const, scale: { duration: 1.2 } } : { duration: 0.6 }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: project.tint }}>
      {/* ambient backdrop from the current screen */}
      {src && (
        <AnimatePresence initial={false}>
          <motion.img
            key={'bg' + src}
            src={src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-[42px] saturate-150"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        </AnimatePresence>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(255,255,255,.22)_0%,transparent_48%,rgba(10,12,16,.26)_100%)]" />

      {device === 'viz' ? (
        <ScatterMorph playing={live} hero={hero} />
      ) : device === 'laptop' ? (
        <div className="absolute inset-0 flex items-center justify-center pb-[5%]">
          <motion.div
            className={`overflow-hidden rounded-[12px] bg-[#f4f4f5] shadow-[0_34px_70px_-24px_rgba(0,0,0,.55),0_0_0_1px_rgba(255,255,255,.25)] ${hero ? 'w-[78%]' : 'w-[82%]'}`}
            animate={drift}
            transition={driftT}
          >
            {/* browser bar (skipped when the screenshot already has one) */}
            {URLS[project.slug] && <div className="flex items-center gap-1.5 border-b border-black/5 bg-white/95 px-3 py-2">
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
              ))}
              <span className="mx-auto truncate rounded-full bg-black/[.05] px-4 py-0.5 text-center font-mono text-[9px] text-black/45">
                {URLS[project.slug]}
              </span>
              <span className="w-8" />
            </div>}
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <AnimatePresence initial={false}>
                <motion.div
                  key={src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: '3%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <ScrollShot src={src!} of={overflow(src)} live={live} dur={durOf(i)} />
                </motion.div>
              </AnimatePresence>
              <Cursor i={i} live={live} />
              <Ripple i={i} live={live} finger={false} dur={durOf(i)} />
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pb-[6%]">
          <motion.div className={`relative aspect-[9/19.5] ${hero ? 'h-[80%]' : 'h-[78%]'}`} animate={drift} transition={driftT}>
            {/* next screen waiting behind, moving with the main phone */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-[22px] opacity-55 ring-[5px] ring-black/80"
              initial={false}
              animate={{ x: live ? '58%' : '44%', rotate: live ? 9 : 6, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={'n' + next}
                  src={next!}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </AnimatePresence>
            </motion.div>
            {/* the phone: frame and screen are one piece */}
            <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-black shadow-[0_30px_60px_-18px_rgba(0,0,0,.6)] ring-[6px] ring-black/90">
              <AnimatePresence initial={false}>
                <motion.div
                  key={src}
                  className="absolute inset-0 bg-white"
                  initial={{ x: '100%' }}
                  animate={{ x: '0%' }}
                  exit={{ x: '-28%', opacity: 0.4 }}
                  transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                >
                  <ScrollShot src={src!} of={overflow(src)} live={live} dur={durOf(i)} />
                </motion.div>
              </AnimatePresence>
              <Ripple i={i} live={live} finger dur={durOf(i)} />
              <span className="absolute left-1/2 top-[1.6%] z-10 h-[3%] w-[30%] -translate-x-1/2 rounded-full bg-black" aria-hidden />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.14),transparent_35%)]" aria-hidden />
            </div>
          </motion.div>
        </div>
      )}

      {/* poster state: play button */}
      <AnimatePresence>
        {!live && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white ring-1 ring-white/40 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.25 }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      {/* player chrome */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-10">
        <div className="flex gap-1">
          {Array.from({ length: n }).map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <span
                key={k === i ? `${i}-${live}` : k}
                className="block h-full rounded-full bg-white"
                style={{
                  width: k < i ? '100%' : k === i && live ? undefined : '0%',
                  animation: k === i && live ? `video-fill ${durOf(k)}ms linear forwards` : undefined,
                }}
              />
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[0.62rem] tracking-[0.08em] text-white/85">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
              {live ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5z" />}
            </svg>
            {fmt(elapsed % total)} / {fmt(total)}
          </span>
          <span className="rounded-[3px] border border-white/40 px-1 text-[0.55rem]">HD</span>
        </div>
      </div>
    </div>
  )
}
