import { useMemo } from 'react'
import { noise, scatter } from './prototypes/correlation'

const LEVELS = [1, 0.75, 0.5, 0.25]

/** Illustration only: the same correlation drawn at different point opacities. No study data. */
export function OpacityStimuli() {
  const pts = useMemo(() => scatter(noise(100, 42), 0.6), [])
  return (
    <figure className="rounded-[18px] border border-line bg-paper p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LEVELS.map((a) => (
          <div key={a} className="rounded-[12px] border border-line bg-white p-2">
            <svg viewBox="0 0 200 200" className="block w-full" role="img" aria-label={`Scatterplot, correlation 0.6, points at ${a * 100}% opacity`}>
              <line x1="10" y1="190" x2="196" y2="190" stroke="#c9ccd2" />
              <line x1="10" y1="4" x2="10" y2="190" stroke="#c9ccd2" />
              {pts.map(([x, y], k) => (
                <circle key={k} cx={16 + x * 176} cy={184 - y * 176} r="3.2" fill="#111" fillOpacity={a} />
              ))}
            </svg>
            <p className="mt-1 text-center font-mono text-[0.68rem] text-ink-soft">{a * 100}% opacity</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 font-mono text-[0.66rem] text-ink-faint">illustration · every plot has r = 0.6, only the dots change · not study data</figcaption>
    </figure>
  )
}
