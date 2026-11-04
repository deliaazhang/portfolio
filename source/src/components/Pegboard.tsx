import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { pegItems, type KeychainVariant, type Mount, type PegItem } from '../data/pegboard'
import { site } from '../data/site'
import { PhotoView } from './PhotoPlaceholder'
import { Matcha } from './Matcha'
import { SectionLabel } from './Projects'
import { lockScroll } from '../lib/scrollLock'

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

const shadow = 'drop-shadow(0 6px 7px rgba(43,42,39,.22)) drop-shadow(0 1px 1px rgba(43,42,39,.15))'

/* ── little pieces of hardware ─────────────────────────── */

function Peg() {
  return (
    <span
      className="absolute left-1/2 top-0 z-10 block h-[clamp(8px,0.9vw,12px)] w-[clamp(8px,0.9vw,12px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#b9c0c8_45%,#7c858f)] shadow-[0_2px_3px_rgba(0,0,0,.3)]"
      aria-hidden
    />
  )
}

function Clothespin() {
  return (
    <svg viewBox="0 0 20 48" className="absolute left-1/2 top-[-11cqw] z-10 w-[11cqw] -translate-x-1/2" aria-hidden>
      <rect x="2" y="0" width="7.5" height="48" rx="2" fill="#e2c49a" />
      <rect x="10.5" y="0" width="7.5" height="48" rx="2" fill="#d6b384" />
      <rect x="1" y="18" width="18" height="6" rx="2" fill="#9aa3ad" />
      <rect x="2" y="0" width="3" height="48" rx="1.5" fill="#fff" opacity=".25" />
    </svg>
  )
}

function PushPin({ color = '#e8b8ad' }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 30" className="absolute left-1/2 top-[-4cqw] z-10 w-[11cqw] max-w-[22px] -translate-x-1/2" aria-hidden>
      <path d="M12 18 L12 29" stroke="#8a929b" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="12" cy="17" rx="8" ry="3" fill={color} />
      <path d="M7 6 Q12 3 17 6 L16 16 Q12 18 8 16Z" fill={color} />
      <ellipse cx="12" cy="5.5" rx="7" ry="3.5" fill={color} />
      <ellipse cx="10" cy="5" rx="3" ry="1.4" fill="#fff" opacity=".6" />
    </svg>
  )
}

function Tape({ tint = 'bg-sage-tint/90' }: { tint?: string }) {
  return <span className={`absolute left-1/2 top-[-5cqw] z-10 h-[12cqw] w-[44cqw] -translate-x-1/2 rotate-[-4deg] ${tint}`} aria-hidden />
}

/* ── the things on the board ───────────────────────────── */

function Polaroid({ item }: { item: Extract<PegItem, { kind: 'polaroid' }> }) {
  return (
    <div className="relative bg-[#fffdf8] p-[6cqw] pb-[24cqw]">
      <div className="aspect-square overflow-hidden">
        <PhotoView photo={item.photo} showTag={false} />
      </div>
      <p className="absolute inset-x-0 bottom-[5cqw] text-center font-mono text-[8.2cqw] leading-none text-ink-soft">{item.caption}</p>
    </div>
  )
}

function Photocard({ item }: { item: Extract<PegItem, { kind: 'photocard' }> }) {
  const [a, b] = item.colors
  return (
    <div className="relative pt-[8cqw]">
      {/* ring through the toploader hole */}
      <span className="absolute left-1/2 top-[-4cqw] h-[16cqw] w-[16cqw] -translate-x-1/2 rounded-full border-[2.4cqw] border-[#b9c0c8]" aria-hidden />
      <div className="relative aspect-[60/86] rounded-[5cqw] border border-white/90 bg-white/45 p-[6cqw] pt-[12cqw] shadow-[inset_0_0_0_1px_rgba(255,255,255,.5)]">
        <span className="absolute left-1/2 top-[4cqw] h-[5cqw] w-[24cqw] -translate-x-1/2 rounded-full bg-[#e9e6dd]" aria-hidden />
        <div className="relative h-full overflow-hidden rounded-[5cqw]" style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}>
          <svg viewBox="0 0 60 80" className="absolute inset-x-0 bottom-0 w-full" aria-hidden>
            <circle cx="30" cy="36" r="13" fill="#fff" opacity=".55" />
            <path d="M6 80 Q8 54 30 52 Q52 54 54 80Z" fill="#fff" opacity=".55" />
          </svg>
          <p className="absolute inset-x-0 bottom-[5cqw] text-center font-mono text-[8cqw] uppercase tracking-wider text-ink/70">{item.member}</p>
        </div>
        {/* glare + stickers */}
        <span className="pointer-events-none absolute inset-y-[6cqw] left-[12cqw] w-[10cqw] -skew-x-12 bg-white/40" aria-hidden />
        <span className="absolute right-[-4cqw] top-[22cqw] rotate-12 text-[18cqw] leading-none text-[#e98aa5]" aria-hidden>♥</span>
        <span className="absolute bottom-[8cqw] left-[-3cqw] -rotate-12 text-[14cqw] leading-none text-[#f2c46d]" aria-hidden>★</span>
      </div>
    </div>
  )
}

function Lightstick({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 260 90" className="w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="ls-handle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#e6e8ec" />
          <stop offset="1" stopColor="#c3c8cf" />
        </linearGradient>
        <radialGradient id="ls-head" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor={lit ? '#fff4fb' : '#ffffff'} />
          <stop offset=".6" stopColor={lit ? '#f7a8cf' : '#eef0f4'} />
          <stop offset="1" stopColor={lit ? '#d98bd8' : '#d6dae1'} />
        </radialGradient>
      </defs>
      {/* the two pegs it rests on */}
      <circle cx="58" cy="60" r="5.5" fill="#9aa3ad" />
      <circle cx="140" cy="60" r="5.5" fill="#9aa3ad" />
      {/* wrist strap */}
      <path d="M14 50 C 4 70, 14 88, 30 82 C 40 78, 34 62, 26 54" fill="none" stroke="#b9a6e3" strokeWidth="4" strokeLinecap="round" />
      <rect x="10" y="34" width="160" height="21" rx="10" fill="url(#ls-handle)" stroke="#aeb4bc" />
      <rect x="18" y="37" width="140" height="4" rx="2" fill="#fff" opacity=".9" />
      <circle cx="104" cy="45" r="4.5" fill={lit ? '#f7a8cf' : '#c3c8cf'} stroke="#9aa3ad" />
      <rect x="166" y="30" width="18" height="29" rx="5" fill="#d6dae1" stroke="#aeb4bc" />
      {lit && <circle cx="216" cy="44" r="56" fill="#f7a8cf" opacity=".28" style={{ filter: 'blur(14px)' }} />}
      <circle cx="216" cy="44" r="36" fill="url(#ls-head)" stroke="#c9ced6" />
      <path
        d="M216 62 C 200 50 196 40 203 33 C 208 28 214 30 216 36 C 218 30 224 28 229 33 C 236 40 232 50 216 62Z"
        fill={lit ? '#ffffff' : '#e8b8ad'}
        opacity={lit ? 0.95 : 0.8}
      />
      <ellipse cx="204" cy="26" rx="10" ry="5" fill="#fff" opacity=".8" transform="rotate(-25 204 26)" />
    </svg>
  )
}

function Ticket({ item }: { item: Extract<PegItem, { kind: 'ticket' }> }) {
  return (
    <div className="relative flex aspect-[2.6/1] overflow-hidden rounded-[2cqw] bg-[#e2e9f2] text-sky-deep">
      <div className="flex flex-1 flex-col justify-between border-r-[0.8cqw] border-dashed border-sky/60 p-[4cqw]">
        <p className="font-mono text-[3.6cqw] uppercase tracking-[0.2em] opacity-70">admit one</p>
        <p className="serif-i text-[9cqw] leading-none text-ink">{item.event}</p>
        <p className="font-mono text-[3.4cqw] tracking-[0.12em]">{item.detail}</p>
        <p className="font-mono text-[3.4cqw] tracking-[0.12em] text-ink-soft">{item.seat}</p>
      </div>
      <div className="flex w-[24%] flex-col items-center justify-center gap-[2cqw] p-[2cqw]">
        <span className="h-[60%] w-[70%] bg-[repeating-linear-gradient(90deg,#4f6d94_0_1.2cqw,transparent_1.2cqw_2cqw,#4f6d94_2cqw_2.6cqw,transparent_2.6cqw_3.6cqw)]" />
        <span className="font-mono text-[3cqw]">No. 0412</span>
      </div>
      <span className="absolute right-[24%] top-0 h-[5cqw] w-[5cqw] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#cfd7c4]" />
      <span className="absolute bottom-0 right-[24%] h-[5cqw] w-[5cqw] translate-x-1/2 translate-y-1/2 rounded-full bg-[#cfd7c4]" />
    </div>
  )
}

function Keychain({ variant }: { variant: KeychainVariant }) {
  return (
    <svg viewBox="0 0 60 150" className="w-full overflow-visible" aria-hidden>
      <circle cx="30" cy="10" r="8" fill="none" stroke="#b0b8c1" strokeWidth="2.6" />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx="30" cy={22 + i * 3.4} r="1.6" fill="#c3c9d0" stroke="#8a94a0" strokeWidth=".4" />
      ))}
      {variant === 'matcha' && (
        <g>
          <path d="M14 52 L19 120 Q20 126 26 126 L34 126 Q40 126 41 120 L46 52Z" fill="#fff" fillOpacity=".55" stroke="#fff" strokeWidth="2" />
          <path d="M16 72 L19 120 Q20 126 26 126 L34 126 Q40 126 41 120 L44 72 Q30 66 16 72Z" fill="#a9bb6c" />
          <path d="M18 100 L19 120 Q20 126 26 126 L34 126 Q40 126 41 120 L42 100Z" fill="#f4f1e6" opacity=".9" />
          <path d="M36 54 L42 34" stroke="#8ea7c6" strokeWidth="4" strokeLinecap="round" />
          <rect x="22" y="76" width="9" height="9" rx="2" fill="#fff" opacity=".6" />
          <ellipse cx="30" cy="52" rx="16" ry="3" fill="#fff" opacity=".7" />
        </g>
      )}
      {variant === 'camera' && (
        <g>
          <rect x="4" y="56" width="52" height="36" rx="8" fill="#c9d4e1" stroke="#8fa0b4" />
          <rect x="38" y="51" width="12" height="6" rx="2" fill="#b0bccb" />
          <rect x="9" y="61" width="12" height="7" rx="2" fill="#f2f5f8" />
          <circle cx="32" cy="75" r="12" fill="#e9edf2" stroke="#8f9aa7" />
          <circle cx="32" cy="75" r="8" fill="#1b2030" />
          <circle cx="29" cy="72" r="2.4" fill="#fff" opacity=".8" />
          <path d="M30 44 L30 56" stroke="#7f9472" strokeWidth="2" />
        </g>
      )}
      {variant === 'bear' && (
        <g>
          <circle cx="16" cy="56" r="7" fill="#b98a66" />
          <circle cx="44" cy="56" r="7" fill="#b98a66" />
          <ellipse cx="30" cy="106" rx="20" ry="22" fill="#c99b75" />
          <circle cx="30" cy="70" r="20" fill="#c99b75" />
          <ellipse cx="30" cy="77" rx="9" ry="7" fill="#f1dcc6" />
          <circle cx="23" cy="67" r="2.2" fill="#2b2a27" />
          <circle cx="37" cy="67" r="2.2" fill="#2b2a27" />
          <ellipse cx="30" cy="74" rx="3" ry="2" fill="#2b2a27" />
          <circle cx="18" cy="75" r="3" fill="#e8b8ad" opacity=".8" />
          <circle cx="42" cy="75" r="3" fill="#e8b8ad" opacity=".8" />
          <path d="M22 92 Q30 98 38 92" stroke="#e8b8ad" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      )}
      {variant === 'nametag' && (
        <g>
          <rect x="12" y="46" width="36" height="96" rx="12" fill="#b4c6a8" stroke="#6d8262" strokeOpacity=".5" />
          <rect x="16" y="50" width="6" height="84" rx="3" fill="#fff" opacity=".4" />
          <circle cx="30" cy="54" r="3" fill="#f7f5ef" />
          {site.chineseName.split('').map((ch, i) => (
            <text key={i} x="30" y={80 + i * 22} textAnchor="middle" fontFamily="Noto Serif SC, serif" fontSize="17" fill="#2f3a2a">
              {ch}
            </text>
          ))}
        </g>
      )}
    </svg>
  )
}

function Postcard({ item }: { item: Extract<PegItem, { kind: 'postcard' }> }) {
  return (
    <div className="relative bg-[#fffdf8] p-[4cqw]">
      <div className="relative aspect-[3/2] overflow-hidden">
        <PhotoView photo={item.photo} showTag={false} />
        <p className="absolute bottom-[4cqw] left-[5cqw] text-white [text-shadow:0_1px_4px_rgba(0,0,0,.35)]">
          <span className="block font-mono text-[4.4cqw] uppercase tracking-[0.2em]">greetings from</span>
          <span className="serif-i block text-[12cqw] leading-none">{item.from}</span>
        </p>
        <span className="absolute right-[4cqw] top-[4cqw] grid h-[18cqw] w-[15cqw] place-items-center border-[1cqw] border-dotted border-white bg-blush/90 font-mono text-[4cqw] text-white">
          ✈
        </span>
      </div>
    </div>
  )
}

function NoteCard({ item }: { item: Extract<PegItem, { kind: 'note' }> }) {
  return (
    <div className="relative bg-[#fffdf6] bg-[repeating-linear-gradient(180deg,transparent_0_11cqw,rgba(142,167,198,.45)_11cqw_11.6cqw)] px-[8cqw] pb-[7cqw] pt-[8cqw]">
      <span className="absolute inset-y-0 left-[6cqw] w-px bg-blush" aria-hidden />
      <p className="pl-[3cqw] font-mono text-[5cqw] uppercase tracking-[0.14em] text-ink-faint">{item.heading}</p>
      <ul className="mt-[2cqw] pl-[3cqw]">
        {item.lines.map((l) => (
          <li key={l} className="font-mono text-[6.2cqw] leading-[11.6cqw] text-ink">
            · {l}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Album({ item }: { item: Extract<PegItem, { kind: 'album' }> }) {
  const [a, b] = item.colors
  return (
    <div className="relative pt-[14cqw]">
      {/* CD peeking out */}
      <span className="absolute left-[38%] top-0 aspect-square w-[64%] rounded-full bg-[conic-gradient(from_40deg,#e9edf2,#f6e8f3,#e2f0ea,#e9edf2)] shadow-[inset_0_0_0_16cqw_rgba(255,255,255,.0)]" aria-hidden>
        <span className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfd7c4]" />
      </span>
      <div className="relative aspect-square p-[8cqw]" style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}>
        <p className="serif-i text-[16cqw] leading-none text-ink">{item.name}</p>
        <p className="absolute bottom-[7cqw] left-[8cqw] font-mono text-[6cqw] uppercase tracking-[0.18em] text-ink/70">{item.artist}</p>
        <span className="absolute inset-y-0 right-0 w-[6cqw] bg-white/30" aria-hidden />
      </div>
    </div>
  )
}

function Plush() {
  return (
    <svg viewBox="0 0 100 100" className="w-full overflow-visible" aria-hidden>
      <circle cx="24" cy="18" r="11" fill="#e9dccb" />
      <circle cx="76" cy="18" r="11" fill="#e9dccb" />
      <circle cx="24" cy="18" r="5" fill="#f3c9d6" />
      <circle cx="76" cy="18" r="5" fill="#f3c9d6" />
      <ellipse cx="50" cy="78" rx="34" ry="22" fill="#f1e7da" />
      <circle cx="50" cy="40" r="30" fill="#f1e7da" />
      <circle cx="40" cy="38" r="3" fill="#2b2a27" />
      <circle cx="60" cy="38" r="3" fill="#2b2a27" />
      <path d="M46 46 Q50 50 54 46" stroke="#2b2a27" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="46" r="4.5" fill="#f3c9d6" opacity=".85" />
      <circle cx="68" cy="46" r="4.5" fill="#f3c9d6" opacity=".85" />
      <ellipse cx="26" cy="92" rx="10" ry="7" fill="#e9dccb" />
      <ellipse cx="74" cy="92" rx="10" ry="7" fill="#e9dccb" />
      <path d="M40 68 L50 74 L60 68 L58 80 L42 80Z" fill="#a9bb6c" opacity=".8" />
    </svg>
  )
}

function Frame({ item }: { item: Extract<PegItem, { kind: 'frame' }> }) {
  return (
    <div className="relative rounded-[2cqw] bg-[linear-gradient(145deg,#d8b48a,#b88d63)] p-[8cqw]">
      <div className="bg-[#fffdf8] p-[4cqw]">
        <div className="aspect-[4/5] overflow-hidden">
          <PhotoView photo={item.photo} showTag={false} />
        </div>
      </div>
    </div>
  )
}

export function ItemArt({ item, lit = false }: { item: PegItem; lit?: boolean }) {
  switch (item.kind) {
    case 'polaroid':
      return <Polaroid item={item} />
    case 'photocard':
      return <Photocard item={item} />
    case 'lightstick':
      return <Lightstick lit={lit} />
    case 'ticket':
      return <Ticket item={item} />
    case 'keychain':
      return <Keychain variant={item.variant} />
    case 'postcard':
      return <Postcard item={item} />
    case 'note':
      return <NoteCard item={item} />
    case 'album':
      return <Album item={item} />
    case 'plush':
      return <Plush />
    case 'frame':
      return <Frame item={item} />
    case 'matcha':
      return <Matcha className="w-full" />
  }
}

/* ── placement + motion ────────────────────────────────── */

const anchorClass: Record<Mount, string> = {
  hang: '-translate-x-1/2',
  clip: '-translate-x-1/2',
  pin: '-translate-x-1/2 -translate-y-[12%]',
  tape: '-translate-x-1/2 -translate-y-[8%]',
  stand: '-translate-x-1/2 -translate-y-full',
  rest: '-translate-x-1/2 -translate-y-1/2',
}
const swings = (m: Mount) => m === 'hang' || m === 'clip'

function BoardItem({
  item,
  i,
  desktop,
  show,
  lit,
  onOpen,
}: {
  item: PegItem
  i: number
  desktop: boolean
  show: boolean
  lit: boolean
  onOpen: (item: PegItem) => void
}) {
  const reduce = useReducedMotion()
  const pos = desktop ? item.d : item.m
  if (!pos) return null
  const r = item.rotate ?? 0
  const swing = swings(item.mount)
  const origin = item.mount === 'stand' ? '50% 100%' : swing ? '50% 0%' : '50% 30%'
  const isStick = item.kind === 'lightstick'

  return (
    <div
      className={`absolute ${anchorClass[item.mount]}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pos.w}%`, zIndex: item.mount === 'clip' ? 3 : 2 }}
    >
      {item.mount === 'hang' && <Peg />}
      <motion.button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={isStick ? `${item.title} — turn ${lit ? 'off' : 'on'}` : `${item.title} — look closer`}
        aria-pressed={isStick ? lit : undefined}
        data-cursor={isStick ? (lit ? 'turn off' : 'turn on') : 'look closer'}
        className="@container relative block w-full cursor-pointer text-left"
        style={{ transformOrigin: origin, filter: shadow }}
        initial={reduce ? false : { opacity: 0, y: -18, rotate: swing ? r + 9 : r }}
        animate={show ? { opacity: 1, y: 0, rotate: r } : undefined}
        transition={{
          opacity: { duration: 0.3, delay: i * 0.05 },
          y: { type: 'spring', stiffness: 260, damping: 18, delay: i * 0.05 },
          rotate: { type: 'spring', stiffness: 90, damping: swing ? 5 : 20, delay: i * 0.05 },
        }}
        whileHover={
          reduce
            ? undefined
            : swing
              ? { rotate: [r, r + 7, r - 5, r + 2.5, r], transition: { duration: 1.3, ease: 'easeInOut' } }
              : { y: -5, scale: 1.035, rotate: r * 0.4, transition: { type: 'spring', stiffness: 300, damping: 18 } }
        }
        whileTap={{ scale: 0.97 }}
      >
        {item.mount === 'clip' && <Clothespin />}
        {item.mount === 'pin' && <PushPin color={item.kind === 'ticket' ? '#8ea7c6' : '#e8b8ad'} />}
        {item.mount === 'tape' && <Tape tint={i % 2 ? 'bg-blush/70' : 'bg-sage-tint/90'} />}
        <ItemArt item={item} lit={lit} />
      </motion.button>
    </div>
  )
}

/** Twine running through every clipped item, sagging between them. */
function Twine({ items, desktop }: { items: PegItem[]; desktop: boolean }) {
  const pts = items
    .filter((it) => it.mount === 'clip')
    .map((it) => (desktop ? it.d : it.m))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .sort((a, b) => a.x - b.x)
  if (!pts.length) return null
  const first = pts[0]
  const last = pts[pts.length - 1]
  const all = [
    { x: Math.max(first.x - first.w * 0.95, 1.5), y: first.y - 2 },
    ...pts.map((p) => ({ x: p.x, y: p.y })),
    { x: Math.min(last.x + last.w * 0.95, 98.5), y: last.y - 2 },
  ]
  let d = `M${all[0].x} ${all[0].y}`
  for (let k = 1; k < all.length; k++) {
    const a = all[k - 1]
    const b = all[k]
    d += ` Q${(a.x + b.x) / 2} ${Math.max(a.y, b.y) + (desktop ? 2.4 : 1.2)} ${b.x} ${b.y}`
  }
  const ends = [all[0], all[all.length - 1]]
  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[2] h-full w-full" aria-hidden>
        <path d={d} fill="none" stroke="#a88a6a" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="#d9c3a5" strokeWidth="0.6" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
      </svg>
      {ends.map((e, k) => (
        <span key={k} className="absolute" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
          <Peg />
        </span>
      ))}
    </>
  )
}

/* ── detail card ───────────────────────────────────────── */

function DetailCard({ item, onClose }: { item: PegItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const unlock = lockScroll()
    closeRef.current?.focus({ preventScroll: true })
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', on)
    return () => {
      unlock()
      window.removeEventListener('keydown', on)
      prev?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  const photo = 'photo' in item ? item.photo : null
  const artWidth: Partial<Record<PegItem['kind'], string>> = {
    photocard: 'w-[46%]', keychain: 'w-[24%]', plush: 'w-[40%]', album: 'w-[56%]', matcha: 'w-[28%]', ticket: 'w-full', note: 'w-[70%]',
  }

  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center p-5" role="dialog" aria-modal="true" aria-label={item.title}>
      <motion.div
        className="absolute inset-0 bg-paper/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="graph-paper relative max-h-[90svh] w-full max-w-[400px] overflow-y-auto rounded-[6px] p-7 shadow-[0_30px_60px_-24px_rgba(43,42,39,.45)]"
        initial={{ opacity: 0, y: 30, rotate: -4, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
        exit={{ opacity: 0, y: 20, rotate: 2, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-sage-tint/90" aria-hidden />
        <p className="mono-label text-[0.62rem] text-ink-faint">off the pegboard</p>
        <h3 className="serif-i mt-2 text-[2.4rem] leading-none text-ink">{item.title}</h3>
        <div className="my-6 flex justify-center">
          {photo ? (
            <div className="w-[80%] rotate-2 bg-white p-2 pb-8 shadow-[0_12px_24px_-12px_rgba(0,0,0,.35)]">
              <div className="aspect-[4/3] overflow-hidden">
                <PhotoView photo={photo} />
              </div>
            </div>
          ) : (
            <div className={`@container ${artWidth[item.kind] ?? 'w-[60%]'}`} style={{ filter: shadow }}>
              <ItemArt item={item} lit />
            </div>
          )}
        </div>
        <p className="font-mono text-[0.92rem] leading-relaxed text-ink-soft">{item.note}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="mono-label mt-6 rounded-full border border-line bg-paper px-4 py-2 text-ink transition hover:border-ink"
        >
          close ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ── section ───────────────────────────────────────────── */

export function Pegboard() {
  const desktop = useMedia('(min-width: 900px)')
  const boardRef = useRef<HTMLDivElement>(null)
  const show = useInView(boardRef, { once: true, amount: 0.2 })
  const [lit, setLit] = useState(false)
  const [open, setOpen] = useState<PegItem | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const stick = pegItems.find((p) => p.kind === 'lightstick')
  const stickPos = stick ? (desktop ? stick.d : stick.m) : null

  const onOpen = (item: PegItem) => {
    if (item.kind === 'lightstick') setLit((l) => !l)
    else setOpen(item)
  }

  return (
    <section id="little-things" className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-16 sm:px-10 md:pt-24">
      <SectionLabel index="02">the little things</SectionLabel>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.h2
          className="display text-[clamp(2.6rem,6vw,5.6rem)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
        >
          a little more <span className="serif-i">about me</span> <span className="text-blush">♡</span>
        </motion.h2>
        <div className="max-w-sm">
          <p className="text-[1.05rem] leading-relaxed text-ink-soft">
            there’s more to me than design and data. here are some of the little things that make me, me.
          </p>
          <p className="mt-3 font-mono text-[0.7rem] tracking-wide text-ink-faint">
            {desktop ? 'hover & click' : 'tap'} anything on the board · try the lightstick
          </p>
        </div>
      </div>

      {/* the board */}
      <div className="relative mx-auto mt-12 max-w-[1240px] md:mt-16">
        <div
          ref={boardRef}
          className={`relative w-full rounded-[18px] border-[clamp(6px,0.9vw,12px)] border-[#d9cdb9] bg-[#dfe5d6] shadow-[0_40px_60px_-36px_rgba(43,42,39,.55),inset_0_2px_6px_rgba(0,0,0,.08)] ${
            desktop ? 'aspect-[16/10]' : 'aspect-[1/2]'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 42%, rgba(55,66,48,.42) 0 2.1px, transparent 2.6px), radial-gradient(circle at 50% 58%, rgba(255,255,255,.55) 0 2.1px, transparent 2.6px)',
            backgroundSize: '26px 26px',
          }}
        >
          {/* ambient glow when the lightstick is on */}
          <AnimatePresence>
            {lit && stickPos && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-[1] rounded-[10px]"
                style={{ background: `radial-gradient(circle at ${stickPos.x + stickPos.w * 0.35}% ${stickPos.y}%, rgba(247,168,207,.45), transparent 45%)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          {/* shelf */}
          <div
            className="absolute z-[1] h-[2.2%] rounded-[3px] bg-[linear-gradient(180deg,#e3cfae,#c9a97f)] shadow-[0_10px_14px_-8px_rgba(43,42,39,.45)]"
            style={desktop ? { left: '52%', right: '2.5%', top: '91.5%' } : { left: '56%', right: '3%', top: '96.8%' }}
            aria-hidden
          />

          <Twine items={pegItems} desktop={desktop} />
          {pegItems.map((item, i) => (
            <BoardItem key={item.id} item={item} i={i} desktop={desktop} show={show} lit={lit} onOpen={onOpen} />
          ))}

          {/* corner screws */}
          {['left-2 top-2', 'right-2 top-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((c) => (
            <span key={c} className={`absolute ${c} h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#a7afb8)]`} aria-hidden />
          ))}
        </div>
        <p className="mt-4 text-right font-mono text-[0.75rem] text-ink-faint sm:text-[0.82rem]">my corner of the internet (and my room)</p>
      </div>

      <AnimatePresence>{open && <DetailCard item={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}
