import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { CameraBack } from './CameraBack'
import { Keychain } from './Keychain'
import { LcdOsd } from './Lcd'
import { PhotoView } from './PhotoPlaceholder'
import { photos } from '../data/photos'
import { lockScroll } from '../lib/scrollLock'
import type { GalleryOrigin } from '../lib/gallery'

/**
 * The camera, up close: flip through photos on its LCD.
 * Arrow keys, the on-camera d-pad, the arrow buttons, thumbnails, or swipe.
 */
export function CameraGallery({
  origin,
  startIndex = 0,
  onClose,
}: {
  origin: GalleryOrigin
  startIndex?: number
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(startIndex)
  const [dir, setDir] = useState(1)
  const [shots, setShots] = useState(0)
  const [pressed, setPressed] = useState<'left' | 'right' | null>(null)
  const [showNote, setShowNote] = useState(true)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pressTimer = useRef<number | undefined>(undefined)
  const total = photos.length
  const photo = photos[index]

  const go = useCallback(
    (delta: number) => {
      setDir(delta)
      setIndex((i) => (i + delta + total) % total)
      setShots((s) => s + 1)
      setPressed(delta < 0 ? 'left' : 'right')
      window.clearTimeout(pressTimer.current)
      pressTimer.current = window.setTimeout(() => setPressed(null), 180)
    },
    [total],
  )
  const jump = (i: number) => {
    if (i === index) return
    setDir(i > index ? 1 : -1)
    setIndex(i)
    setShots((s) => s + 1)
  }

  // scroll lock + focus management
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const unlock = lockScroll()
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 50)
    return () => {
      unlock()
      window.clearTimeout(t)
      window.clearTimeout(pressTimer.current)
      prev?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [go, onClose])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 40 || info.velocity.x > 400) go(-1)
  }

  const screen = (
    <motion.div
      className="absolute inset-0 touch-pan-y"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={photo.id}
          className="absolute inset-0"
          custom={dir}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * 14}%`, scale: 1.04 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <PhotoView photo={photo} showTag={false} />
        </motion.div>
      </AnimatePresence>

      {/* shutter blink between shots */}
      {shots > 0 && !reduce && (
        <div key={shots} className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-black"
            style={{ originY: 0 }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.26, ease: [0.6, 0, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
            style={{ originY: 1 }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.26, ease: [0.6, 0, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />
        </div>
      )}
      <LcdOsd index={index} total={total} date={photo.date} footer={photo.location ? `◉ ${photo.location}` : undefined} />
    </motion.div>
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Delia's camera — photo gallery"
    >
      {/* backdrop */}
      <motion.div
        className="graph-paper absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />

      <motion.header
        className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-10 sm:py-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.15 }}
      >
        <p className="mono-label text-ink-soft">
          camera roll <span className="text-ink-faint">— {total} little memories</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="mono-label group flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-ink transition hover:border-ink"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span> back
          <span className="hidden text-ink-faint sm:inline">(esc)</span>
        </button>
      </motion.header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-4">
        <div className="relative" style={{ width: 'min(780px, 92vw, calc((100svh - 300px) * 1.54))' }}>
          <motion.div
            layoutId={origin === 'hero' ? 'camera' : undefined}
            initial={origin === 'hero' ? undefined : { opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={origin === 'hero' ? undefined : { opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 140, damping: 22 }}
            className="relative"
          >
            <CameraBack
              screen={screen}
              pressedSide={pressed}
              controls={{ onPrev: () => go(-1), onNext: () => go(1), onOk: () => setShowNote((s) => !s) }}
            />
            <Keychain />
          </motion.div>

          {/* message notification */}
          <div className="mt-5 min-h-[92px] md:absolute md:-right-10 md:-top-14 md:mt-0 md:w-[300px] lg:-right-24" aria-live="polite">
            <AnimatePresence mode="wait">
              {showNote && (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: -14, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26, delay: reduce ? 0 : 0.28 }}
                  className="flex gap-3 rounded-[20px] border border-white/80 bg-white/80 p-3 pr-4 shadow-[0_12px_40px_-12px_rgba(43,42,39,.35),0_2px_6px_rgba(43,42,39,.06)] backdrop-blur-xl"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-tint">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#5f7356" strokeWidth="1.6" aria-hidden>
                      <rect x="3" y="7" width="18" height="13" rx="3" />
                      <circle cx="12" cy="13.5" r="3.5" />
                      <path d="M8 7 L9.5 4.5 H14.5 L16 7" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[0.85rem] font-semibold text-ink">delia</span>
                      <span className="font-mono text-[0.65rem] text-ink-faint">now</span>
                    </div>
                    <p className="mt-0.5 text-[0.92rem] leading-snug text-ink">{photo.caption}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* controls */}
        <motion.div
          className="mt-4 flex w-full max-w-[780px] items-center justify-center gap-3 md:mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-paper font-mono text-ink transition hover:-translate-x-0.5 hover:border-ink"
          >
            ←
          </button>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 py-1">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => jump(i)}
                aria-label={`Show photo ${i + 1}: ${p.alt}`}
                aria-current={i === index}
                className={`h-9 w-12 shrink-0 overflow-hidden rounded-[5px] transition sm:h-10 sm:w-14 ${
                  i === index ? 'opacity-100 ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'opacity-50 hover:opacity-90'
                }`}
              >
                <PhotoView photo={p} showTag={false} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-paper font-mono text-ink transition hover:translate-x-0.5 hover:border-ink"
          >
            →
          </button>
        </motion.div>
        <p className="mono-label mt-3 hidden text-center text-[0.62rem] text-ink-faint sm:block">
          ← → keys · swipe the screen · or press the d-pad · ok toggles the note
        </p>
      </div>
    </motion.div>
  )
}
