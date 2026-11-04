import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useTransform } from 'motion/react'
import { CameraFront } from './CameraFront'
import { Matcha } from './Matcha'
import { usePointer } from '../hooks/usePointer'
import { site } from '../data/site'

/** A synthesized point-and-shoot: two autofocus beeps, then the shutter clack (no audio file needed). */
function playShutter() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const t0 = ctx.currentTime + 0.02
    const beep = (at: number) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 2900
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(0.06, at + 0.005)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07)
      o.connect(g).connect(ctx.destination)
      o.start(at)
      o.stop(at + 0.08)
    }
    const click = (at: number, dur: number, freq: number, vol: number) => {
      const len = Math.floor(ctx.sampleRate * dur)
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.frequency.value = freq
      f.Q.value = 0.9
      const g = ctx.createGain()
      g.gain.value = vol
      src.connect(f).connect(g).connect(ctx.destination)
      src.start(at)
    }
    beep(t0 + 0.2)
    beep(t0 + 0.32)
    click(t0 + 0.8, 0.05, 3200, 0.9) // shutter opens
    click(t0 + 0.88, 0.08, 1500, 0.7) // curtain closes
    window.setTimeout(() => ctx.close(), 2000)
  } catch {
    /* sound is a nice-to-have */
  }
}

type Phase = 'idle' | 'press' | 'focus' | 'flash' | 'dive'

/**
 * Opening scene: a camera and an iced matcha on a desk.
 * Click the camera → shutter press → lens focuses (AF brackets) → flash → dive through the lens.
 */
export function Entrance({ onEnter, onSkip }: { onEnter: () => void; onSkip: () => void }) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [hover, setHover] = useState(false)
  const [lens, setLens] = useState<{ x: number; y: number; r: number } | null>(null)
  const lensRef = useRef<SVGCircleElement>(null)
  const timers = useRef<number[]>([])
  const { x: px, y: py } = usePointer()

  const camX = useTransform(px, (v) => v * 16)
  const camY = useTransform(py, (v) => v * 10)
  const camRY = useTransform(px, (v) => v * 9)
  const camRX = useTransform(py, (v) => v * -6)
  const cupX = useTransform(px, (v) => v * 8)
  const cupY = useTransform(py, (v) => v * 5)
  const deskX = useTransform(px, (v) => v * 4)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

  const enter = () => {
    playShutter()
    if (phase !== 'idle') return
    if (reduce) {
      onSkip()
      return
    }
    setPhase('press')
    at(180, () => setPhase('focus'))
    at(820, () => setPhase('flash'))
    at(1000, () => {
      const r = lensRef.current?.getBoundingClientRect()
      if (r) setLens({ x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 })
      setPhase('dive')
    })
    at(1650, onEnter)
  }

  const busy = phase !== 'idle'
  const coverR = Math.hypot(window.innerWidth, window.innerHeight)

  return (
    <motion.section
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-paper"
      variants={{
        exit: (mode: 'camera' | 'skip') => ({ opacity: 0, transition: { duration: mode === 'skip' ? 0.5 : 0 } }),
      }}
      exit="exit"
      aria-label="Welcome"
    >
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,.9),rgba(247,245,239,0)_60%)]" />

      <header className="relative z-10 flex items-start justify-between px-5 pt-5 sm:px-10 sm:pt-8">
        <p className="mono-label text-ink-soft">delia zhang · portfolio</p>
        <p className="mono-label text-ink-faint">
          <span className="font-cn tracking-[0.3em] normal-case">{site.chineseName}</span> · ’26
        </p>
      </header>

      <div className="relative flex flex-1 items-center justify-center px-4">
        <div className="relative flex w-full max-w-[860px] items-end justify-center">
          {/* desk surface */}
          <motion.div
            className="absolute bottom-[-4%] left-1/2 -ml-[56%] h-[46%] w-[112%] rounded-[48px] bg-[linear-gradient(180deg,#efeadf_0%,#e9e3d6_70%,#e2dccd_100%)] shadow-[0_30px_60px_-30px_rgba(43,42,39,.25),inset_0_2px_0_rgba(255,255,255,.7)]"
            style={{ x: deskX, rotateX: 64, transformPerspective: 1200, transformOrigin: '50% 100%' }}
            aria-hidden
          />

          {/* camera */}
          <motion.div className="relative z-10 w-[min(470px,64vw)]" style={{ x: camX, y: camY, rotateX: camRX, rotateY: camRY, transformPerspective: 1000 }}>
            <div className={busy ? '' : 'anim-float'}>
              <motion.button
                type="button"
                onClick={enter}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                onFocus={() => setHover(true)}
                onBlur={() => setHover(false)}
                disabled={busy}
                data-cursor="click to enter"
                aria-label="Enter Delia's portfolio — click the camera"
                className="relative block w-full cursor-pointer rounded-[32px] disabled:cursor-default"
                animate={
                  phase === 'press'
                    ? { y: 3, rotate: 0, scale: 0.985 }
                    : phase === 'focus' || phase === 'flash'
                      ? { y: -4, rotate: 0, scale: 1.04 }
                      : hover
                        ? { y: -10, rotate: -2.5, scale: 1.01 }
                        : { y: 0, rotate: 0, scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <CameraFront
                  ref={lensRef}
                  hovered={hover}
                  pressed={phase === 'press'}
                  focusing={phase === 'focus' || phase === 'flash'}
                  className="w-full"
                />
                {/* AF brackets */}
                {(phase === 'focus' || phase === 'flash') && (
                  <motion.div
                    className="pointer-events-none absolute"
                    style={{ left: '54%', top: '56%', width: '32%', aspectRatio: '1', x: '-50%', y: '-50%' }}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0, 1, 0.4, 1] }}
                    transition={{ duration: 0.45 }}
                  >
                    {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(
                      (c) => (
                        <span key={c} className={`absolute h-[22%] w-[22%] border-[#7be07b] ${c}`} />
                      ),
                    )}
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* handwritten note */}
            <motion.div
              className="pointer-events-none absolute -bottom-16 left-[6%] flex items-start gap-2 text-ink-soft sm:-bottom-20"
              animate={{ opacity: busy ? 0 : hover ? 1 : 0.75, y: hover ? -2 : 0 }}
            >
              <svg width="34" height="44" viewBox="0 0 34 44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="mt-[-30px]">
                <path d="M8 2 C 4 14, 6 26, 18 34" />
                <path d="M11 35 L18 34 L17 27" />
              </svg>
              <span className="pt-4 font-mono text-[0.95rem] sm:text-base">click to enter</span>
            </motion.div>
          </motion.div>

          {/* matcha */}
          <motion.div className="relative z-0 -ml-[3%] mb-[1%] w-[min(150px,19vw)]" style={{ x: cupX, y: cupY }}>
            <Matcha className="w-full" />
          </motion.div>
        </div>
      </div>

      <footer className="relative z-10 flex items-end justify-between gap-4 px-5 pb-5 sm:px-10 sm:pb-8">
        <p className="mono-label max-w-[60%] text-ink-faint">( a few of my favourite things )</p>
        <button type="button" onClick={onSkip} className="mono-label link-draw text-ink-soft hover:text-ink">
          skip intro →
        </button>
      </footer>

      {/* flash */}
      {(phase === 'flash' || phase === 'dive') && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration: 0.45, times: [0, 0.2, 1] }}
        />
      )}

      {/* dive through the lens */}
      {phase === 'dive' && lens && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle,#1e2640_0%,#0b0e19_40%,#050609_100%)]"
          initial={{ clipPath: `circle(${lens.r}px at ${lens.x}px ${lens.y}px)` }}
          animate={{ clipPath: `circle(${coverR}px at ${lens.x}px ${lens.y}px)` }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        />
      )}
    </motion.section>
  )
}
