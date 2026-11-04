import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'

/**
 * A small label that trails the native cursor over anything with `data-cursor="…"`.
 * Mouse only — touch devices never see it.
 */
export function Cursor() {
  const [label, setLabel] = useState<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let px = -1
    let py = -1
    const check = (target: Element | null) => {
      const el = target?.closest?.('[data-cursor]')
      const next = el && !(el as HTMLButtonElement).disabled ? el.getAttribute('data-cursor') : null
      setLabel((prev) => (prev === next ? prev : next))
    }
    const on = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      px = e.clientX
      py = e.clientY
      x.set(px)
      y.set(py)
      check(e.target as Element | null)
    }
    // things move under a still mouse (intro ends, gallery opens…) — re-check periodically
    const tick = window.setInterval(() => {
      if (px >= 0) check(document.elementFromPoint(px, py))
    }, 250)
    const leave = () => setLabel(null)
    window.addEventListener('pointermove', on, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.clearInterval(tick)
      window.removeEventListener('pointermove', on)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-[70]" style={{ x: sx, y: sy }} aria-hidden>
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="ml-4 mt-4 block whitespace-nowrap rounded-full bg-ink px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-paper shadow-lg"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
