import type { ReactNode } from 'react'

/** On-screen display overlay for the camera LCD — scales with the screen via container units. */
export function LcdOsd({
  index,
  total,
  date,
  footer,
}: {
  index: number
  total: number
  date?: string
  footer?: ReactNode
}) {
  const pad = (n: number) => String(n).padStart(3, '0')
  return (
    <div className="pointer-events-none absolute inset-0 @container font-mono text-white">
      <div className="absolute inset-x-[3cqw] top-[2.5cqw] flex items-center justify-between text-[4.2cqw] leading-none [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
        <span className="flex items-center gap-[1.5cqw]">
          <span className="text-[#9fe39f]">▶</span>
          {pad(index + 1)}/{pad(total)}
        </span>
        <span className="flex items-center gap-[1.2cqw]">
          <span className="opacity-80">3M</span>
          {/* battery */}
          <span className="relative inline-block h-[3.4cqw] w-[7cqw] rounded-[0.6cqw] border-[0.4cqw] border-white">
            <span className="absolute inset-[0.4cqw] right-[2.2cqw] rounded-[0.2cqw] bg-white" />
            <span className="absolute -right-[1.1cqw] top-1/2 h-[1.6cqw] w-[0.7cqw] -translate-y-1/2 rounded-r-sm bg-white" />
          </span>
        </span>
      </div>
      {date && (
        <span className="absolute bottom-[3cqw] right-[3.5cqw] text-[5cqw] leading-none tracking-wider text-stamp [text-shadow:0_0_6px_rgba(255,138,61,.75)]">
          {date}
        </span>
      )}
      {footer && <div className="absolute bottom-[3cqw] left-[3.5cqw] text-[3.6cqw] leading-none [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">{footer}</div>}
    </div>
  )
}
