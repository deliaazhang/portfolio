import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Project } from '../data/projects'
import { ScatterMorph } from './ScatterMorph'

const SEG = 2800 // ms per shot

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * A preview that behaves like a short product video: full-bleed shots with a
 * slow camera push, an ambient blurred backdrop, and player chrome
 * (segmented progress, play state, timecode). Plays while `playing`.
 */
export function VideoPreview({ project, playing, size = 'card' }: { project: Project; playing: boolean; size?: 'card' | 'hero' }) {
  const reduce = useReducedMotion()
  const live = playing && !reduce
  const { device, screens } = project.preview
  const shots = device === 'viz' ? [0, 1, 2, 3] : screens
  const n = Math.max(1, shots.length)
  const [i, setI] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!live) return
    const a = window.setInterval(() => setI((v) => (v + 1) % n), SEG)
    const b = window.setInterval(() => setElapsed((e) => e + 250), 250)
    return () => {
      window.clearInterval(a)
      window.clearInterval(b)
    }
  }, [live, n])
  useEffect(() => {
    if (!playing) {
      setI(0)
      setElapsed(0)
    }
  }, [playing])

  const src = device === 'viz' ? null : screens[i]
  const next = device === 'viz' ? null : screens[(i + 1) % n]
  const hero = size === 'hero'

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: project.tint }}>
      {/* ambient backdrop */}
      {src ? (
        <AnimatePresence initial={false}>
          <motion.img
            key={'bg' + src}
            src={src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-[42px] saturate-150"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0" style={{ background: project.tint }} />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,.18)_0%,transparent_45%,rgba(10,12,16,.28)_100%)]" />

      {/* the shot */}
      {device === 'viz' ? (
        <ScatterMorph playing={live} hero={hero} />
      ) : device === 'laptop' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative aspect-[16/10] overflow-hidden rounded-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/15 ${hero ? 'w-[80%]' : 'w-[84%]'}`}>
            <AnimatePresence initial={false}>
              <motion.img
                key={src}
                src={src!}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-top"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: live ? 1.14 : 1.02, y: live ? '-3%' : 0 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.6 }, scale: { duration: live ? SEG / 1000 + 0.6 : 0.6, ease: 'linear' }, y: { duration: live ? SEG / 1000 + 0.6 : 0.6, ease: 'linear' } }}
              />
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* next shot waiting behind */}
          <motion.div
            className={`absolute aspect-[9/19.5] overflow-hidden rounded-[22px] opacity-60 ring-[5px] ring-black/80 ${hero ? 'h-[72%]' : 'h-[70%]'}`}
            initial={false}
            animate={{ x: live ? '62%' : '48%', rotate: live ? 8 : 6, scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          >
            <img src={next!} alt="" className="h-full w-full object-cover object-top" draggable={false} />
          </motion.div>
          <div className={`relative z-10 -mt-[6%] aspect-[9/19.5] overflow-hidden rounded-[24px] shadow-[0_30px_60px_-18px_rgba(0,0,0,.65)] ring-[6px] ring-black/90 ${hero ? 'h-[80%]' : 'h-[78%]'}`}>
            <AnimatePresence initial={false}>
              <motion.img
                key={src}
                src={src!}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-top"
                initial={{ opacity: 0, y: '6%' }}
                animate={{ opacity: 1, y: live ? '-4%' : 0, scale: live ? 1.06 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.5 }, y: { duration: live ? SEG / 1000 : 0.5, ease: 'easeInOut' }, scale: { duration: live ? SEG / 1000 : 0.5 } }}
              />
            </AnimatePresence>
            <span className="absolute left-1/2 top-[1.6%] h-[3%] w-[30%] -translate-x-1/2 rounded-full bg-black" aria-hidden />
          </div>
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
        <div className="flex gap-1">
          {Array.from({ length: n }).map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <span
                key={k === i ? `${i}-${live}` : k}
                className="block h-full rounded-full bg-white"
                style={{
                  width: k < i ? '100%' : k === i && live ? undefined : '0%',
                  animation: k === i && live ? `video-fill ${SEG}ms linear forwards` : undefined,
                }}
              />
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[0.62rem] tracking-[0.08em] text-white/85">
          <span className="flex items-center gap-1.5">
            {live ? (
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            )}
            {fmt(elapsed)} / {fmt(n * SEG)}
          </span>
          <span className="rounded-[3px] border border-white/40 px-1 text-[0.55rem]">HD</span>
        </div>
      </div>
    </div>
  )
}
