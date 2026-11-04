import type { ReactNode } from 'react'
import { motion, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion/react'
import { CameraBack } from './CameraBack'
import { Keychain } from './Keychain'
import { LcdOsd } from './Lcd'
import { usePointer } from '../hooks/usePointer'
import { useGallery } from '../lib/gallery'
import { photos } from '../data/photos'
import { site } from '../data/site'

const ease = [0.2, 0.7, 0.2, 1] as const

function Line({ children, delay, className = '' }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <span className={`-mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** The hero camera's screen: your photo, or your hand-drawn portrait. */
export function HeroScreen() {
  return (
    <div className="relative h-full w-full bg-[#efece3]">
      {site.heroPhoto ? (
        <img src={site.heroPhoto} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <div className="graph-paper flex h-full w-full items-end justify-center">
          <img src={site.portrait} alt="" className="h-[96%] w-auto object-contain" draggable={false} />
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),transparent_26%,transparent_70%,rgba(0,0,0,.35))]" />
      <LcdOsd
        index={0}
        total={photos.length}
        footer={<span className="anim-blink">PRESS ▸ TO VIEW</span>}
      />
    </div>
  )
}

export function Hero({ delay, cameraAway }: { delay: number; cameraAway: boolean }) {
  const reduce = useReducedMotion()
  const gallery = useGallery()
  const { x: px, y: py } = usePointer()

  const rotY = useTransform(px, (v) => v * 12)
  const rotX = useTransform(py, (v) => v * -8)
  const tx = useTransform(px, (v) => v * 10)
  const vel = useVelocity(px)
  const swing = useSpring(
    useTransform(vel, (v) => Math.max(-28, Math.min(28, -v * 7))),
    { stiffness: 50, damping: 5, mass: 0.8 },
  )

  const d = (n: number) => (reduce ? 0 : delay + n)

  return (
    <section id="top" className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-8 pt-28 sm:px-10 md:pt-32">
      <div className="grid flex-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-6">
        {/* intro */}
        <div className="relative z-10 md:col-span-7">
          <motion.p
            className="mb-5 font-mono text-[0.95rem] text-ink-soft sm:mb-7 sm:text-base"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: d(0) }}
          >
            hi, i'm delia!
          </motion.p>

          <h1 className="display text-[clamp(3.3rem,9vw,9.4rem)] text-ink">
            <Line delay={d(0.08)}>I notice the</Line>
            <Line delay={d(0.2)} className="md:whitespace-nowrap">
              <span className="serif-i text-[1.12em] leading-[0.85] tracking-[-0.03em]">little things.</span>
            </Line>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: d(0.5), ease }}
            className="mt-8 max-w-[30rem] sm:mt-10"
          >
            <p className="text-[1.08rem] leading-relaxed text-ink-soft sm:text-[1.2rem]">
              Through design and data, I explore the world around me and find meaning in the little things.
            </p>
            <p className="mt-5 font-mono text-[0.78rem] tracking-wide text-ink-soft">
              ux/ui designer · cognitive systems + data science @ ubc
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.78rem] tracking-wide text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" /> design
              </span>
              <span className="text-ink-faint">+</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky" /> data
              </span>
              <span className="text-ink-faint">=</span>
              <span className="serif-i text-[1.05rem] tracking-normal text-ink">understanding people</span>
            </p>
          </motion.div>
        </div>

        {/* camera */}
        <motion.div
          className="relative md:col-span-5"
          initial={{ opacity: 0, y: 30, rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: d(0.3), ease }}
        >
          <div className="relative mx-auto w-[min(92%,560px)] md:ml-auto md:mr-0">

            {/* reserves space while the camera is "away" in the gallery */}
            <div className="aspect-[400/260] w-full" aria-hidden />

            {!cameraAway && (
              <motion.div layoutId="camera" className="absolute inset-0" transition={{ type: 'spring', stiffness: 140, damping: 22 }}>
                <motion.button
                  type="button"
                  onClick={() => gallery.open('hero', 0)}
                  data-cursor="open my camera"
                  aria-label="Open my camera to browse photos and little memories"
                  className="group relative block h-full w-full cursor-pointer rounded-[28px]"
                  style={{ rotateX: rotX, rotateY: rotY, x: tx, transformPerspective: 1100 }}
                  whileHover={{ y: -8, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <CameraBack screen={<HeroScreen />} />
                  <Keychain swing={swing} />
                </motion.button>
              </motion.div>
            )}

            <motion.p
              className="mt-8 text-right font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint"
              animate={{ opacity: cameraAway ? 0 : 1 }}
            >
              fig. 01 — my camera, full of little memories
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* tiny Chinese detail */}
      <motion.div
        className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d(1), duration: 1 }}
        aria-hidden
      >
        <span className="font-cn text-sm text-ink-faint [writing-mode:vertical-rl]">小事</span>
        <span className="h-10 w-px bg-line" />
      </motion.div>

      <motion.a
        href="#work"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('work')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
        }}
        className="mono-label mx-auto mt-6 flex flex-col items-center gap-2 text-ink-faint transition-colors hover:text-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d(1.1) }}
      >
        scroll
        <span className="anim-nudge text-base">↓</span>
      </motion.a>
    </section>
  )
}
