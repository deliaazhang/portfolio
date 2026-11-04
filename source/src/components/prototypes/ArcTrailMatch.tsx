import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const OPTIONS = ['Facilitation', 'Gear Access', 'Local Knowledge', 'Photography', 'Outreach']

// demo collaborators (the first two appear in the original Figma screens)
const PEOPLE = [
  {
    name: 'Muslim Hikers',
    blurb: 'A growing community bringing Muslims closer to nature through access, belonging and joy outdoors.',
    gives: ['Outreach', 'Local Knowledge'],
    needs: ['Gear Access', 'Photography'],
    hue: '#6f8f84',
  },
  {
    name: 'Keep It Real Collective',
    blurb: 'Storytellers documenting real people on real trails, and the communities behind them.',
    gives: ['Photography', 'Facilitation'],
    needs: ['Outreach', 'Local Knowledge'],
    hue: '#7f8fa6',
  },
  {
    name: 'Academy Trail Mentors',
    blurb: 'Guides from skills clinics who love helping first-timers feel safe and confident.',
    gives: ['Facilitation', 'Gear Access'],
    needs: ['Local Knowledge', 'Photography'],
    hue: '#8c8a74',
  },
  {
    name: 'Sea-to-Sky Grant Crew',
    blurb: 'Recent grant recipients building a youth hiking program along the coast.',
    gives: ['Local Knowledge', 'Gear Access'],
    needs: ['Facilitation', 'Outreach'],
    hue: '#5f7a8c',
  },
]

function Chip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] transition ${
        on ? 'border-[#2f4a52] bg-[#2f4a52] text-white' : 'border-[#9fb3b8] bg-white/70 text-[#2f4a52] hover:border-[#2f4a52]'
      }`}
    >
      {on ? '✓ ' : ''}
      {label}
    </button>
  )
}

export function ArcTrailMatch() {
  const [give, setGive] = useState<string[]>(['Photography'])
  const [need, setNeed] = useState<string[]>(['Local Knowledge'])
  const [matched, setMatched] = useState(false)

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => {
    setMatched(false)
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  }

  const results = useMemo(() => {
    return PEOPLE.map((p) => {
      const theyHelp = p.gives.filter((g) => need.includes(g))
      const youHelp = p.needs.filter((n) => give.includes(n))
      const score = Math.round(((theyHelp.length + youHelp.length) / Math.max(1, need.length + give.length)) * 100)
      return { ...p, theyHelp, youHelp, score: Math.min(98, 40 + score * 0.58) | 0 }
    }).sort((a, b) => b.score - a.score)
  }, [give, need])

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[#e9efef] font-sans text-[#22343a] shadow-[0_30px_60px_-36px_rgba(30,50,60,.55)]">
      {/* misty header */}
      <div className="relative h-[150px] overflow-hidden sm:h-[180px]">
        <img src="screens/arc-land.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05),rgba(233,239,239,1))]" />
        <div className="absolute inset-x-0 top-5 text-center text-white [text-shadow:0_2px_12px_rgba(0,0,0,.35)]">
          <p className="font-serif text-[1.9rem] uppercase tracking-[0.12em] sm:text-[2.3rem]">Arc’Trail</p>
          <p className="text-[0.78rem] opacity-90">You walk further when you walk with others.</p>
        </div>
      </div>

      <div className="grid gap-8 px-5 pb-7 sm:px-8 md:grid-cols-[1fr_1.15fr]">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#557077]">step 1 · your strengths</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <Chip key={o} label={o} on={give.includes(o)} onClick={() => toggle(give, setGive, o)} />
            ))}
          </div>
          <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#557077]">step 2 · where you could use support</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <Chip key={o} label={o} on={need.includes(o)} onClick={() => toggle(need, setNeed, o)} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMatched(true)}
            disabled={!give.length && !need.length}
            className="mt-7 rounded-full bg-[#22343a] px-6 py-3 text-[0.85rem] text-white transition hover:bg-[#2f4a52] disabled:opacity-40"
          >
            find my collaborators →
          </button>
        </div>

        <div className="relative min-h-[300px] min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#557077]">your potential collaborators</p>
          <AnimatePresence mode="wait">
            {!matched ? (
              <motion.div
                key="empty"
                className="mt-3 grid h-[260px] place-items-center rounded-[18px] border border-dashed border-[#9fb3b8] text-center text-[0.85rem] text-[#557077]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>
                  pick a few strengths and needs,
                  <br />
                  then find your people ⛰
                </p>
              </motion.div>
            ) : (
              <motion.ul key="list" className="mt-3 space-y-3" initial="h" animate="s" exit={{ opacity: 0 }} variants={{ s: { transition: { staggerChildren: 0.09 } } }}>
                {results.slice(0, 3).map((r) => (
                  <motion.li
                    key={r.name}
                    variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }}
                    className="flex gap-4 rounded-[18px] bg-white/85 p-3.5 shadow-[0_8px_20px_-14px_rgba(30,50,60,.5)]"
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[0.95rem] font-semibold text-white"
                      style={{ background: `linear-gradient(140deg, ${r.hue}, #c9d6d8)` }}
                    >
                      {r.name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate font-serif text-[1.15rem]">{r.name}</p>
                        <span className="shrink-0 font-mono text-[0.72rem] text-[#2f4a52]">{r.score}% match</span>
                      </div>
                      <p className="mt-0.5 text-[0.78rem] leading-snug text-[#557077]">{r.blurb}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[0.68rem]">
                        {r.theyHelp.map((t) => (
                          <span key={'t' + t} className="rounded-full bg-[#dbe7e3] px-2 py-0.5 text-[#2f5a4c]">
                            helps you with {t.toLowerCase()}
                          </span>
                        ))}
                        {r.youHelp.map((t) => (
                          <span key={'y' + t} className="rounded-full bg-[#e3e3f0] px-2 py-0.5 text-[#3e4a72]">
                            needs your {t.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
