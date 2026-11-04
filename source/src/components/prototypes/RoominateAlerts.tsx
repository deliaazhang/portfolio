import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ALERTS = [
  { id: 'quiet', label: 'Quiet down', emoji: '🤫', msg: 'Could we keep it down a little tonight?', icon: 'M4 9v6h4l5 4V5L8 9H4z M16 9l4 6 M20 9l-4 6' },
  { id: 'guests', label: 'No guests', emoji: '👥', msg: 'Heads up: no guests tonight please.', icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20c0-3 3-5 6-5s6 2 6 5 M4 4l16 16' },
  { id: 'dishes', label: 'Clean dishes', emoji: '🍽', msg: 'The dishes are piling up — could someone help?', icon: 'M5 12h14l-2 7H7z M8 12V8a4 4 0 0 1 8 0v4' },
  { id: 'home', label: 'Home now', emoji: '🏠', msg: 'Someone just got home 👋', icon: 'M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-5h4v5' },
]

const PEOPLE = [
  { name: 'Eva', color: '#9c8cf0' },
  { name: 'Mark', color: '#e48aa6' },
  { name: 'Rae', color: '#f0a3d8' },
  { name: 'Sam', color: '#f5c25b' },
]

function MiniPhone({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[min(240px,40vw)] rounded-[34px] bg-[#141518] p-[7px] shadow-[0_24px_40px_-22px_rgba(10,40,30,.6)]">
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#e9ef9a_0%,#a9dfa4_45%,#5fd0c7_100%)]">
          <span className="absolute left-1/2 top-2 z-20 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[#2f5a4c]">{label}</p>
    </div>
  )
}

export function RoominateAlerts() {
  const [tab, setTab] = useState<'alerts' | 'expenses'>('alerts')
  const [anon, setAnon] = useState(true)
  const [inbox, setInbox] = useState<{ key: number; a: (typeof ALERTS)[number]; anon: boolean }[]>([])
  const [flying, setFlying] = useState<number | null>(null)
  const counter = useRef(0)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = (a: (typeof ALERTS)[number]) => {
    const key = ++counter.current
    setFlying(key)
    timers.current.push(
      window.setTimeout(() => {
        setInbox((list) => [{ key, a, anon }, ...list].slice(0, 3))
        setFlying(null)
      }, 650),
    )
  }

  // expenses
  const [split, setSplit] = useState<string[]>(['Eva', 'Mark', 'Rae', 'Sam'])
  const rent = 3789
  const util = 410.24
  const each = split.length ? (rent + util) / split.length : 0

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(140deg,#f4f6d2,#d4ecc4_50%,#bfe8df)] px-4 py-7 font-sans text-[#163a2e] shadow-[0_30px_60px_-36px_rgba(20,60,40,.55)] sm:px-8">
      <div className="mb-6 flex justify-center gap-2">
        {(['alerts', 'expenses'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`rounded-full px-4 py-1.5 text-[0.8rem] font-semibold capitalize transition ${
              tab === t ? 'bg-[#2f8a5c] text-white' : 'bg-white/70 text-[#2f5a4c] hover:bg-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'alerts' ? (
        <div className="relative flex items-start justify-center gap-6 sm:gap-14">
          <MiniPhone label="your phone">
            <div className="px-3 pt-9">
              <p className="text-[0.95rem] font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,.2)]">Hello Eva,</p>
              <p className="text-[0.55rem] text-white/90">Welcome to simpler shared living.</p>
              <p className="mt-3 text-[0.7rem] font-semibold text-white">Quick Alerts</p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {ALERTS.map((a) => (
                  <motion.button
                    key={a.id}
                    type="button"
                    onClick={() => send(a)}
                    whileTap={{ scale: 0.92 }}
                    className="flex flex-col items-center gap-1 rounded-[14px] bg-white p-2 shadow-[0_6px_12px_-8px_rgba(0,0,0,.4)] transition hover:-translate-y-0.5"
                    aria-label={`Send “${a.label}” alert`}
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#163a2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={a.icon} />
                    </svg>
                    <span className="rounded-full bg-[#bfe8c8] px-1.5 py-0.5 text-[0.5rem] font-semibold">
                      {a.label} {a.emoji}
                    </span>
                  </motion.button>
                ))}
              </div>
              <label className="mt-3 flex cursor-pointer items-center justify-between rounded-[12px] bg-white/80 px-2.5 py-2 text-[0.6rem] font-semibold">
                send anonymously
                <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="peer sr-only" />
                <span className={`relative h-4 w-7 rounded-full transition ${anon ? 'bg-[#2f8a5c]' : 'bg-[#b8c4bd]'}`}>
                  <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${anon ? 'left-3.5' : 'left-0.5'}`} />
                </span>
              </label>
            </div>
          </MiniPhone>

          {/* flying alert */}
          <AnimatePresence>
            {flying && (
              <motion.span
                key={flying}
                className="pointer-events-none absolute left-1/2 top-[38%] z-30 grid h-9 w-9 place-items-center rounded-full bg-white text-[1rem] shadow-lg"
                initial={{ x: '-180%', y: 0, scale: 0.6, opacity: 0 }}
                animate={{ x: ['-180%', '-50%', '80%'], y: [0, -60, -110], scale: [0.6, 1, 0.7], opacity: [0, 1, 0] }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
              >
                🔔
              </motion.span>
            )}
          </AnimatePresence>

          <MiniPhone label="mark’s phone">
            <div className="px-2.5 pt-10 text-center">
              <p className="text-[2rem] font-light leading-none text-white">9:41</p>
              <p className="text-[0.55rem] text-white/90">Wednesday</p>
              <ul className="mt-4 space-y-2 text-left">
                <AnimatePresence initial={false}>
                  {inbox.map(({ key, a, anon: isAnon }) => (
                    <motion.li
                      key={key}
                      layout
                      initial={{ opacity: 0, y: -18, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                      className="rounded-[14px] bg-white/90 p-2 shadow-[0_6px_14px_-8px_rgba(0,0,0,.4)] backdrop-blur"
                    >
                      <div className="flex items-center justify-between text-[0.5rem] text-[#557066]">
                        <span className="font-semibold uppercase tracking-wider">roominate</span>
                        <span>now</span>
                      </div>
                      <p className="mt-0.5 text-[0.62rem] font-semibold">
                        {isAnon ? 'A roommate' : 'Eva'} sent “{a.label}” {a.emoji}
                      </p>
                      <p className="text-[0.58rem] leading-snug text-[#3d5a50]">{a.msg}</p>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              {!inbox.length && <p className="mt-6 text-[0.6rem] text-white/90">no alerts yet — tap one on Eva’s phone</p>}
            </div>
          </MiniPhone>
        </div>
      ) : (
        <div className="mx-auto max-w-[560px]">
          <div className="rounded-[22px] bg-white/85 p-5 shadow-[0_12px_30px_-20px_rgba(10,40,30,.5)] sm:p-7">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#557066]">shared expenses · this month</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[16px] bg-[#f6c6c1] p-3">
                <p className="text-[0.75rem] font-semibold text-[#8b3a33]">Rent</p>
                <p className="text-[1.5rem] font-bold text-[#8b3a33]">${rent.toLocaleString()}</p>
              </div>
              <div className="rounded-[16px] bg-[#eef3ea] p-3">
                <p className="text-[0.75rem] font-semibold">Utilities</p>
                <p className="text-[1.5rem] font-bold">${util.toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-6 text-[0.75rem] font-semibold">who’s splitting?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PEOPLE.map((p) => {
                const on = split.includes(p.name)
                return (
                  <button
                    key={p.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSplit((s) => (on ? s.filter((x) => x !== p.name) : [...s, p.name]))}
                    className="rounded-full px-4 py-1.5 text-[0.8rem] font-semibold text-white transition"
                    style={{ background: on ? p.color : '#c8cfca' }}
                  >
                    {p.name}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.75rem] text-[#557066]">each person pays</p>
                <motion.p key={split.length} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[2.2rem] font-bold leading-none">
                  ${each.toFixed(2)}
                </motion.p>
              </div>
              <svg viewBox="0 0 120 64" className="w-[140px]">
                <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#e3ebe5" strokeWidth="12" strokeLinecap="round" />
                <motion.path
                  d="M10 60 A50 50 0 0 1 110 60"
                  fill="none"
                  stroke="url(#rm-g)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ pathLength: split.length / PEOPLE.length || 0.001 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
                <defs>
                  <linearGradient id="rm-g" x1="0" x2="1">
                    <stop offset="0" stopColor="#e64fb0" />
                    <stop offset=".5" stopColor="#f5a623" />
                    <stop offset="1" stopColor="#8fd19e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
