import { useRef, useState, type PointerEvent } from 'react'

const PAIRS = [
  { id: 'entrance', label: 'entrance', sketch: 'site/sketch-entrance.webp', built: 'site/entrance.webp' },
  { id: 'hero', label: 'hero', sketch: 'site/sketch-hero.webp', built: 'site/hero.webp' },
  { id: 'camera', label: 'camera gallery', sketch: 'site/sketch-camera.webp', built: 'site/gallery.webp' },
  { id: 'projects', label: 'projects', sketch: 'site/sketch-projects.webp', built: 'site/projects.webp' },
  { id: 'about', label: 'about me', sketch: 'site/sketch-about.webp', built: 'site/pegboard.webp' },
]

/** Drag the handle to wipe between Delia's sketch and the finished page. */
export function SketchCompare() {
  const [id, setId] = useState(PAIRS[1].id)
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef(false)
  const pair = PAIRS.find((p) => p.id === id)!

  const move = (e: PointerEvent) => {
    if (!drag.current || !box.current) return
    const r = box.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)))
  }

  return (
    <div className="rounded-[22px] border border-line bg-paper-2/60 p-4 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === id}
            onClick={() => {
              setId(p.id)
              setPos(50)
            }}
            className={`rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition ${
              p.id === id ? 'bg-ink text-paper' : 'border border-line bg-paper text-ink-soft hover:border-ink'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        ref={box}
        className="relative mt-4 aspect-[16/10] touch-none select-none overflow-hidden rounded-[14px] bg-white shadow-[0_24px_50px_-30px_rgba(43,42,39,.5)]"
        onPointerDown={(e) => {
          drag.current = true
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
          move(e)
        }}
        onPointerMove={move}
        onPointerUp={() => (drag.current = false)}
        onPointerCancel={() => (drag.current = false)}
      >
        {/* finished page underneath */}
        <img src={pair.built} alt={`Finished ${pair.label}`} className="absolute inset-0 h-full w-full object-cover object-top" draggable={false} />
        {/* sketch on top, clipped by the handle */}
        <div className="absolute inset-0 bg-white" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={pair.sketch} alt={`Sketch of the ${pair.label}`} className="h-full w-full object-contain p-4" draggable={false} />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-soft shadow-sm">
          sketch
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper shadow-sm">
          built
        </span>
        {/* handle */}
        <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${pos}%` }}>
          <button
            type="button"
            aria-label="Drag to compare sketch and built page"
            className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-ink font-mono text-[0.8rem] text-paper shadow-lg"
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setPos((v) => Math.max(0, v - 5))
              if (e.key === 'ArrowRight') setPos((v) => Math.min(100, v + 5))
            }}
          >
            ⟷
          </button>
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[0.68rem] text-ink-faint">drag the handle (or use ← →) to wipe from my sketch to the finished page</p>
    </div>
  )
}
