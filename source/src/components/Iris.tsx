import { useMemo } from 'react'
import { motion } from 'motion/react'

/**
 * Full-screen aperture that opens from the centre, revealing the page beneath.
 * Starts fully dark so it picks up exactly where the lens-dive ended.
 */
export function Iris({ onDone }: { onDone: () => void }) {
  const { w, h, hex, blades } = useMemo(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    const R = Math.hypot(w, h) * 0.62
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2
      return [Math.cos(a) * R, Math.sin(a) * R] as const
    })
    const hex = pts.map((p) => p.join(',')).join(' ')
    // blade edges: extend each side of the hexagon outward past the next vertex
    const blades = pts.map((p, i) => {
      const prev = pts[(i + 5) % 6]
      const dx = p[0] - prev[0]
      const dy = p[1] - prev[1]
      return `M${p[0]},${p[1]} L${p[0] + dx * 2.5},${p[1] + dy * 2.5}`
    })
    return { w, h, hex, blades }
  }, [])

  const anim = {
    initial: { scale: 0.001, rotate: -70 },
    animate: { scale: 1, rotate: 0 },
    transition: { duration: 1.05, ease: [0.65, 0, 0.25, 1] as const },
  }

  return (
    <motion.svg
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 1.25, times: [0, 0.82, 1] }}
      onAnimationComplete={onDone}
      aria-hidden
    >
      <defs>
        <mask id="iris-mask" maskUnits="userSpaceOnUse" x={-w} y={-h} width={w * 2} height={h * 2}>
          <rect x={-w} y={-h} width={w * 2} height={h * 2} fill="#fff" />
          <motion.polygon points={hex} fill="#000" {...anim} />
        </mask>
      </defs>
      <rect x={-w} y={-h} width={w * 2} height={h * 2} fill="#0a0c12" mask="url(#iris-mask)" />
      <motion.g {...anim}>
        {blades.map((d, i) => (
          <path key={i} d={d} stroke="#2b3248" strokeWidth={2} fill="none" vectorEffect="non-scaling-stroke" />
        ))}
      </motion.g>
    </motion.svg>
  )
}
