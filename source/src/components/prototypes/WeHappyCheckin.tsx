import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/** A small version of the 城市打卡 (city check-in) site: pick a city, check in at its spots. */
const CITIES = [
  {
    id: 'shanghai', zh: '上海', en: 'Shanghai',
    spots: [
      { zh: '外滩', en: 'The Bund', note: '上海最具代表性的景点之一' },
      { zh: '东方明珠', en: 'Oriental Pearl Tower', note: '上海的象征' },
      { zh: '豫园', en: 'Yu Garden', note: '古典园林与繁华商圈' },
      { zh: '新天地', en: 'Xintiandi', note: '石库门建筑群改造的时尚地标' },
    ],
  },
  {
    id: 'beijing', zh: '北京', en: 'Beijing',
    spots: [
      { zh: '故宫', en: 'Forbidden City', note: '明清两代的皇家宫殿' },
      { zh: '天坛', en: 'Temple of Heaven', note: '古代祭天建筑群' },
      { zh: '南锣鼓巷', en: 'Nanluoguxiang', note: '老北京胡同' },
    ],
  },
  {
    id: 'chengdu', zh: '成都', en: 'Chengdu',
    spots: [
      { zh: '宽窄巷子', en: 'Kuanzhai Alley', note: '老成都的慢生活' },
      { zh: '大熊猫基地', en: 'Panda Base', note: '看熊猫的最佳去处' },
      { zh: '锦里', en: 'Jinli Street', note: '小吃与古街' },
    ],
  },
]

const BLUE = '#2f7de1'

export function WeHappyCheckin() {
  const [city, setCity] = useState(CITIES[0].id)
  const [done, setDone] = useState<Record<string, boolean>>({ 'shanghai-0': true })
  const [stamp, setStamp] = useState<string | null>(null)
  const c = CITIES.find((x) => x.id === city)!
  const count = (id: string) => CITIES.find((x) => x.id === id)!.spots.filter((_, i) => done[`${id}-${i}`]).length

  const check = (i: number) => {
    const key = `${city}-${i}`
    if (done[key]) return
    setDone((d) => ({ ...d, [key]: true }))
    setStamp(key)
    window.setTimeout(() => setStamp(null), 1100)
  }

  return (
    <div className="overflow-hidden rounded-[22px] bg-[#f5f7fb] font-sans text-[#1b2433] shadow-[0_30px_60px_-36px_rgba(20,40,90,.5)]">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-[#e3e8f0] bg-white px-5 py-3">
        <p className="flex items-center gap-2 text-[0.92rem] font-semibold">
          <span className="h-3.5 w-3.5 rotate-45 rounded-[3px]" style={{ background: BLUE }} /> 城市打卡活动
        </p>
        <p className="font-mono text-[0.7rem] text-[#6b778a]">my progress · {Object.values(done).filter(Boolean).length} check-ins</p>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-[200px_minmax(0,1fr)] md:p-6">
        {/* cities */}
        <div>
          <p className="text-[1.1rem] font-bold">选择城市</p>
          <p className="text-[0.75rem] text-[#6b778a]">choose your next destination</p>
          <ul className="mt-3 flex gap-2 md:flex-col">
            {CITIES.map((x) => {
              const n = count(x.id)
              const on = x.id === city
              return (
                <li key={x.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setCity(x.id)}
                    aria-pressed={on}
                    className={`w-full rounded-[12px] border px-3 py-2.5 text-left transition ${on ? 'border-transparent text-white' : 'border-[#e3e8f0] bg-white hover:border-[#b9cbe6]'}`}
                    style={on ? { background: BLUE } : undefined}
                  >
                    <span className="block text-[0.95rem] font-semibold">
                      {x.zh} <span className={`text-[0.72rem] font-normal ${on ? 'text-white/80' : 'text-[#6b778a]'}`}>{x.en}</span>
                    </span>
                    <span className={`mt-1 block font-mono text-[0.62rem] ${on ? 'text-white/85' : 'text-[#6b778a]'}`}>
                      已打卡 {n}/{x.spots.length}
                    </span>
                    <span className={`mt-1.5 block h-1 overflow-hidden rounded-full ${on ? 'bg-white/30' : 'bg-[#e3e8f0]'}`}>
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ background: on ? '#fff' : BLUE }}
                        initial={false}
                        animate={{ width: `${(n / x.spots.length) * 100}%` }}
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* spots */}
        <div className="min-w-0">
          <p className="font-mono text-[0.66rem] text-[#6b778a]">Home / {c.zh}</p>
          <p className="text-[1.25rem] font-bold">城市打卡点</p>
          <ul className="mt-3 space-y-2.5">
            {c.spots.map((s, i) => {
              const key = `${city}-${i}`
              const on = !!done[key]
              return (
                <li key={key} className="relative flex items-center gap-3 rounded-[14px] border border-[#e3e8f0] bg-white p-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] text-[1.1rem] font-bold text-white" style={{ background: `linear-gradient(140deg, ${BLUE}, #8fb7ef)` }}>
                    {s.zh[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.95rem] font-semibold">
                      {s.zh} <span className="text-[0.75rem] font-normal text-[#6b778a]">{s.en}</span>
                    </p>
                    <p className="truncate text-[0.75rem] text-[#6b778a]">{s.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => check(i)}
                    disabled={on}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.75rem] font-semibold transition ${on ? 'bg-[#e4f6ec] text-[#1f8a4c]' : 'text-white hover:brightness-110'}`}
                    style={on ? undefined : { background: BLUE }}
                  >
                    {on ? '✓ 已打卡' : '去打卡'}
                  </button>
                  <AnimatePresence>
                    {stamp === key && (
                      <motion.span
                        className="pointer-events-none absolute right-20 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border-[3px] font-bold"
                        style={{ borderColor: '#e8344e', color: '#e8344e' }}
                        initial={{ scale: 2, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      >
                        打卡
                      </motion.span>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
