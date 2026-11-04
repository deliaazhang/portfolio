import { useEffect, useRef, useState } from 'react'

/**
 * "no wifi? no problem." A tiny endless runner: an iced matcha hops over ice cubes.
 * Click / tap the game to start. Space, ↑ or tap to jump. Esc to pause.
 */

const H = 170
const GROUND = 140
const GRAVITY = 0.0028 // px per ms²
const JUMP = -0.82 // px per ms
const CUP = { w: 26, h: 34, x: 56 }

type Obstacle = { x: number; w: number; h: number; kind: 'cube' | 'double' | 'tall' }
type Cloud = { x: number; y: number; s: number }

const css = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

function readBest() {
  try {
    return Number(localStorage.getItem('matcha-run-best') || 0)
  } catch {
    return 0
  }
}
function saveBest(v: number) {
  try {
    localStorage.setItem('matcha-run-best', String(v))
  } catch {
    /* private mode */
  }
}

export function MatchaRun() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const statusRef = useRef(status)
  statusRef.current = status

  const game = useRef({
    w: 600,
    y: GROUND - CUP.h,
    vy: 0,
    speed: 0.32,
    dist: 0,
    obstacles: [] as Obstacle[],
    clouds: [] as Cloud[],
    nextGap: 500,
    t: 0,
    squash: 0,
  })

  const reset = () => {
    const g = game.current
    g.y = GROUND - CUP.h
    g.vy = 0
    g.speed = 0.32
    g.dist = 0
    g.obstacles = []
    g.nextGap = 420
    g.squash = 0
    setScore(0)
  }

  const jump = () => {
    const g = game.current
    if (g.y >= GROUND - CUP.h - 0.5) {
      g.vy = JUMP
      g.squash = 1
    }
  }

  const press = () => {
    const s = statusRef.current
    if (s === 'idle' || s === 'over') {
      reset()
      setStatus('running')
      jump()
    } else if (s === 'paused') setStatus('running')
    else jump()
  }

  // size canvas to container
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = wrap.clientWidth
      game.current.w = w
      canvas.width = w * dpr
      canvas.height = H * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${H}px`
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!game.current.clouds.length) {
        game.current.clouds = Array.from({ length: 4 }, (_, i) => ({ x: (w / 4) * i + 40, y: 18 + ((i * 37) % 40), s: 0.7 + (i % 3) * 0.2 }))
      }
      draw()
    }
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    fit()
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keyboard while the game is in play and on screen
  useEffect(() => {
    if (status !== 'running' && status !== 'paused' && status !== 'over') return
    const on = (e: KeyboardEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        press()
      } else if (e.key === 'Escape' && statusRef.current === 'running') setStatus('paused')
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // pause when scrolled away
  useEffect(() => {
    if (!wrapRef.current) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && statusRef.current === 'running') setStatus('paused')
    })
    io.observe(wrapRef.current)
    return () => io.disconnect()
  }, [])

  // game loop
  useEffect(() => {
    if (status !== 'running') {
      draw()
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(34, now - last)
      last = now
      const g = game.current
      g.t += dt
      g.speed = Math.min(0.75, 0.32 + g.dist / 90000)
      g.dist += g.speed * dt

      // physics
      g.vy += GRAVITY * dt
      g.y = Math.min(GROUND - CUP.h, g.y + g.vy * dt)
      if (g.y >= GROUND - CUP.h) g.vy = 0
      g.squash = Math.max(0, g.squash - dt / 260)

      // obstacles
      for (const o of g.obstacles) o.x -= g.speed * dt
      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10)
      g.nextGap -= g.speed * dt
      if (g.nextGap <= 0) {
        const r = Math.random()
        const kind: Obstacle['kind'] = r < 0.55 ? 'cube' : r < 0.82 ? 'double' : 'tall'
        const dims = kind === 'cube' ? { w: 20, h: 20 } : kind === 'double' ? { w: 42, h: 20 } : { w: 20, h: 38 }
        g.obstacles.push({ x: g.w + 10, kind, ...dims })
        g.nextGap = 260 + Math.random() * 320 + g.speed * 260
      }
      for (const c of g.clouds) {
        c.x -= g.speed * dt * 0.15 * c.s
        if (c.x < -60) c.x = g.w + Math.random() * 80
      }

      // collision (forgiving hitbox)
      const cx = CUP.x + 4
      const cw = CUP.w - 8
      const cy = g.y + 6
      const hit = g.obstacles.some((o) => cx < o.x + o.w - 3 && cx + cw > o.x + 3 && cy + CUP.h - 8 > GROUND - o.h + 2)

      const sc = Math.floor(g.dist / 40)
      setScore(sc)
      draw()
      if (hit) {
        setStatus('over')
        setBest((b) => {
          const nb = Math.max(b, sc)
          if (nb > b) saveBest(nb)
          return nb
        })
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  function draw() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const g = game.current
    const ink = css('--color-ink', '#2b2a27')
    const faint = css('--color-ink-faint', '#9a968c')
    const matcha = css('--color-matcha', '#a9bb6c')
    const sky = css('--color-sky', '#8ea7c6')
    ctx.clearRect(0, 0, g.w, H)

    // clouds
    ctx.strokeStyle = faint
    ctx.lineWidth = 1.4
    for (const c of g.clouds) {
      ctx.beginPath()
      ctx.ellipse(c.x, c.y + 6, 18 * c.s, 6 * c.s, 0, 0, Math.PI * 2)
      ctx.moveTo(c.x + 10 * c.s, c.y + 2)
      ctx.ellipse(c.x - 2, c.y + 1, 10 * c.s, 7 * c.s, 0, Math.PI, 0)
      ctx.stroke()
    }

    // ground with little dashes that scroll
    ctx.strokeStyle = ink
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, GROUND + 0.5)
    ctx.lineTo(g.w, GROUND + 0.5)
    ctx.stroke()
    ctx.strokeStyle = faint
    const off = g.dist % 46
    for (let x = -off; x < g.w; x += 46) {
      ctx.beginPath()
      ctx.moveTo(x, GROUND + 9)
      ctx.lineTo(x + 8, GROUND + 9)
      ctx.moveTo(x + 24, GROUND + 15)
      ctx.lineTo(x + 28, GROUND + 15)
      ctx.stroke()
    }

    // ice cubes
    for (const o of g.obstacles) {
      const blocks = o.kind === 'double' ? 2 : 1
      const bw = o.w / blocks
      for (let i = 0; i < blocks; i++) {
        const x = o.x + i * bw + (i ? 2 : 0)
        const w = bw - (i ? 2 : 0)
        const y = GROUND - o.h
        ctx.fillStyle = 'rgba(142,167,198,0.28)'
        ctx.strokeStyle = sky
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.roundRect(x, y, w, o.h, 4)
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.beginPath()
        ctx.moveTo(x + 4, y + 5)
        ctx.lineTo(x + 4, y + Math.min(11, o.h - 5))
        ctx.stroke()
      }
    }

    // the matcha cup (squashes a little on take-off)
    const s = g.squash
    const w = CUP.w * (1 + s * 0.12)
    const h = CUP.h * (1 - s * 0.12)
    const x = CUP.x - (w - CUP.w) / 2
    const y = g.y + (CUP.h - h)
    // straw
    ctx.strokeStyle = sky
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x + w * 0.62, y + 4)
    ctx.lineTo(x + w * 0.8, y - 9)
    ctx.stroke()
    // cup body
    const cup = new Path2D()
    cup.moveTo(x, y + 3)
    cup.lineTo(x + w, y + 3)
    cup.lineTo(x + w - 4, y + h)
    cup.lineTo(x + 4, y + h)
    cup.closePath()
    ctx.save()
    ctx.clip(cup)
    ctx.fillStyle = matcha
    ctx.fillRect(x, y + h * 0.28, w, h)
    ctx.fillStyle = '#f4f1e6'
    ctx.fillRect(x, y + h * 0.72, w, h)
    ctx.restore()
    ctx.strokeStyle = ink
    ctx.lineWidth = 1.6
    ctx.lineCap = 'butt'
    ctx.stroke(cup)
    // lid
    ctx.beginPath()
    ctx.moveTo(x - 2, y + 3)
    ctx.lineTo(x + w + 2, y + 3)
    ctx.stroke()
    // face
    ctx.fillStyle = ink
    const dead = statusRef.current === 'over'
    if (dead) {
      ctx.lineWidth = 1.3
      for (const ex of [x + w * 0.33, x + w * 0.62]) {
        ctx.beginPath()
        ctx.moveTo(ex - 2, y + h * 0.48 - 2)
        ctx.lineTo(ex + 2, y + h * 0.48 + 2)
        ctx.moveTo(ex + 2, y + h * 0.48 - 2)
        ctx.lineTo(ex - 2, y + h * 0.48 + 2)
        ctx.stroke()
      }
    } else {
      ctx.beginPath()
      ctx.arc(x + w * 0.33, y + h * 0.48, 1.6, 0, Math.PI * 2)
      ctx.arc(x + w * 0.62, y + h * 0.48, 1.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = ink
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(x + w * 0.475, y + h * 0.55, 2.6, 0.15 * Math.PI, 0.85 * Math.PI)
      ctx.stroke()
    }
    // blush
    ctx.fillStyle = 'rgba(232,184,173,0.8)'
    ctx.beginPath()
    ctx.arc(x + w * 0.2, y + h * 0.58, 2, 0, Math.PI * 2)
    ctx.arc(x + w * 0.76, y + h * 0.58, 2, 0, Math.PI * 2)
    ctx.fill()
    // shadow
    const lift = GROUND - CUP.h - g.y
    ctx.fillStyle = `rgba(43,42,39,${0.16 - Math.min(0.1, lift / 600)})`
    ctx.beginPath()
    ctx.ellipse(CUP.x + CUP.w / 2, GROUND + 2, 13 - Math.min(6, lift / 14), 2.4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  const pad = (n: number) => String(n).padStart(5, '0')

  return (
    <div className="mt-16">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint">
          no wifi? no problem. <span className="normal-case tracking-normal text-ink-soft">— help the matcha dodge the ice</span>
        </p>
        <p className="font-mono text-[0.72rem] tabular-nums tracking-[0.12em] text-ink-soft" aria-live="off">
          HI {pad(best)} &nbsp; {pad(score)}
        </p>
      </div>
      <div
        ref={wrapRef}
        role="button"
        tabIndex={0}
        aria-label={status === 'running' ? 'Matcha run game. Press space to jump.' : 'Play the matcha run game. Press space or tap to start.'}
        onPointerDown={(e) => {
          e.preventDefault()
          press()
        }}
        onKeyDown={(e) => {
          if (statusRef.current === 'idle' && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault()
            press()
          }
        }}
        className="relative cursor-pointer touch-manipulation select-none overflow-hidden rounded-[14px] border border-line bg-paper/70"
        data-cursor={status === 'running' ? 'jump!' : 'play'}
      >
        <canvas ref={canvasRef} className="block" aria-hidden />
        {status !== 'running' && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="rounded-full bg-paper/90 px-4 py-2 text-center font-mono text-[0.72rem] tracking-wide text-ink-soft shadow-[0_6px_16px_-10px_rgba(43,42,39,.5)]">
              {status === 'idle' && 'click or press space to play · space / ↑ / tap to jump'}
              {status === 'paused' && 'paused · click or press space to keep going'}
              {status === 'over' && `spilled! score ${score} · click or press space to try again`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
