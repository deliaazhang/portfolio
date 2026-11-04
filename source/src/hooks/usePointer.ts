import { useEffect } from 'react'
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/** Normalised mouse position (-1 … 1) as springy motion values. No re-renders. */
export function usePointer(config = { stiffness: 70, damping: 18, mass: 0.6 }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, config)
  const sy = useSpring(y, config)

  useEffect(() => {
    if (reduce) return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    const on = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1)
      y.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [reduce, x, y])

  return { x: sx, y: sy }
}
