import { useState } from 'react'

/**
 * JND by base correlation for each opacity condition.
 * Data: one participant's session summary (opacity_2025-07-08 summary.csv).
 * Colours: ordinal blue ramp for opacity (validated), orange for the mixed condition.
 */
type Row = { base: number; jnd: number; converged: boolean; trials: number; rt: number }
type Series = { id: string; label: string; color: string; dash?: string; rows: Row[] }

export const SERIES: Series[] = [
  {
    id: '25', label: '25% opacity', color: '#86b6ef',
    rows: [
      { base: 0.3, jnd: 0.183, converged: false, trials: 52, rt: 826 },
      { base: 0.6, jnd: 0.097, converged: true, trials: 36, rt: 660 },
      { base: 0.9, jnd: 0.044, converged: true, trials: 44, rt: 676 },
    ],
  },
  {
    id: '50', label: '50% opacity', color: '#3987e5',
    rows: [
      { base: 0.3, jnd: 0.149, converged: false, trials: 52, rt: 947 },
      { base: 0.6, jnd: 0.125, converged: true, trials: 35, rt: 776 },
      { base: 0.9, jnd: 0.055, converged: true, trials: 24, rt: 1220 },
    ],
  },
  {
    id: '75', label: '75% opacity', color: '#1c5cab',
    rows: [
      { base: 0.3, jnd: 0.242, converged: false, trials: 52, rt: 1264 },
      { base: 0.6, jnd: 0.286, converged: false, trials: 52, rt: 2484 },
      { base: 0.9, jnd: 0.043, converged: true, trials: 33, rt: 667 },
    ],
  },
  {
    id: '100', label: '100% opacity', color: '#0d366b',
    rows: [
      { base: 0.3, jnd: 0.137, converged: true, trials: 24, rt: 966 },
      { base: 0.6, jnd: 0.148, converged: true, trials: 48, rt: 729 },
      { base: 0.9, jnd: 0.051, converged: true, trials: 26, rt: 721 },
    ],
  },
  {
    id: 'mix', label: 'mixed opacity', color: '#eb6834', dash: '5 4',
    rows: [
      { base: 0.3, jnd: 0.23, converged: true, trials: 47, rt: 646 },
      { base: 0.6, jnd: 0.143, converged: true, trials: 24, rt: 661 },
      { base: 0.9, jnd: 0.055, converged: true, trials: 25, rt: 644 },
    ],
  },
]

const W = 560
const H = 300
const M = { l: 46, r: 16, t: 14, b: 40 }
const xs = [0.3, 0.6, 0.9]
const X = (b: number) => M.l + ((b - 0.3) / 0.6) * (W - M.l - M.r)
const Y = (v: number) => M.t + (1 - v / 0.3) * (H - M.t - M.b)

export function JndChart() {
  const [hover, setHover] = useState<{ s: Series; r: Row } | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const [table, setTable] = useState(false)

  return (
    <figure className="rounded-[18px] border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <figcaption>
          <p className="text-[1rem] font-medium text-ink">Just-noticeable difference by base correlation</p>
          <p className="mt-0.5 font-mono text-[0.66rem] text-ink-faint">one session · lower = sharper discrimination · hollow = staircase didn’t converge</p>
        </figcaption>
        <button
          type="button"
          onClick={() => setTable((t) => !t)}
          className="rounded-full border border-line px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-soft transition hover:border-ink hover:text-ink"
        >
          {table ? 'show chart' : 'view as table'}
        </button>
      </div>

      {/* legend */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {SERIES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onPointerEnter={() => setFocus(s.id)}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus(s.id)}
              onBlur={() => setFocus(null)}
              className="flex items-center gap-1.5 font-mono text-[0.68rem] text-ink-soft"
            >
              <svg width="18" height="8" aria-hidden>
                <line x1="1" y1="4" x2="17" y2="4" stroke={s.color} strokeWidth="2" strokeDasharray={s.dash} strokeLinecap="round" />
              </svg>
              {s.label}
            </button>
          </li>
        ))}
      </ul>

      {table ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-[0.85rem] tabular-nums">
            <thead className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-faint">
              <tr>
                <th className="py-2 pr-3 font-normal">condition</th>
                {xs.map((b) => (
                  <th key={b} className="py-2 pr-3 font-normal">r = {b}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SERIES.map((s) => (
                <tr key={s.id} className="border-t border-line text-ink">
                  <td className="py-2 pr-3 text-ink-soft">{s.label}</td>
                  {s.rows.map((r) => (
                    <td key={r.base} className="py-2 pr-3">
                      {r.jnd.toFixed(3)}
                      {!r.converged && <span className="text-ink-faint">*</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 font-mono text-[0.64rem] text-ink-faint">* staircase did not converge within 52 trials</p>
        </div>
      ) : (
        <div className="relative mt-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" role="img" aria-label="Line chart of JND falling from about 0.14–0.24 at r = 0.3 to about 0.05 at r = 0.9 for every opacity condition">
            {[0, 0.1, 0.2, 0.3].map((v) => (
              <g key={v}>
                <line x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} stroke="var(--color-line)" strokeWidth="1" />
                <text x={M.l - 8} y={Y(v) + 4} textAnchor="end" className="fill-[var(--color-ink-faint)] font-mono text-[11px]">
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
            {xs.map((b) => (
              <text key={b} x={X(b)} y={H - M.b + 20} textAnchor="middle" className="fill-[var(--color-ink-soft)] font-mono text-[11px]">
                r = {b}
              </text>
            ))}
            <text x={M.l} y={H - 4} className="fill-[var(--color-ink-faint)] font-mono text-[10px]">base correlation</text>
            <text x={10} y={M.t + 4} className="fill-[var(--color-ink-faint)] font-mono text-[10px]" transform={`rotate(-90 10 ${M.t + 4})`} textAnchor="end">
              JND
            </text>

            {SERIES.map((s) => {
              const dim = focus && focus !== s.id
              return (
                <g key={s.id} opacity={dim ? 0.18 : 1} style={{ transition: 'opacity .2s' }}>
                  <polyline
                    points={s.rows.map((r) => `${X(r.base)},${Y(r.jnd)}`).join(' ')}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeDasharray={s.dash}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {s.rows.map((r) => (
                    <g key={r.base}>
                      <circle
                        cx={X(r.base)}
                        cy={Y(r.jnd)}
                        r="5"
                        fill={r.converged ? s.color : 'var(--color-paper)'}
                        stroke={r.converged ? 'var(--color-paper)' : s.color}
                        strokeWidth="2"
                      />
                      <circle
                        cx={X(r.base)}
                        cy={Y(r.jnd)}
                        r="13"
                        fill="transparent"
                        onPointerEnter={() => setHover({ s, r })}
                        onPointerLeave={() => setHover(null)}
                      />
                    </g>
                  ))}
                </g>
              )
            })}
          </svg>
          {hover && (
            <div
              className="pointer-events-none absolute z-10 w-max -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-[10px] border border-line bg-paper px-3 py-2 shadow-[0_10px_24px_-12px_rgba(43,42,39,.4)]"
              style={{ left: `${(X(hover.r.base) / W) * 100}%`, top: `${(Y(hover.r.jnd) / H) * 100}%` }}
            >
              <p className="flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-faint">
                <span className="h-2 w-2 rounded-full" style={{ background: hover.s.color }} />
                {hover.s.label} · r = {hover.r.base}
              </p>
              <p className="mt-0.5 text-[0.95rem] tabular-nums text-ink">JND {hover.r.jnd.toFixed(3)}</p>
              <p className="font-mono text-[0.64rem] tabular-nums text-ink-soft">
                {hover.r.trials} trials · {Math.round(hover.r.rt)} ms avg · {hover.r.converged ? 'converged' : 'did not converge'}
              </p>
            </div>
          )}
        </div>
      )}
    </figure>
  )
}
