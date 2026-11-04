import { useId } from 'react'

/** Iced matcha latte in a clear cup — gently sloshing liquid + bobbing ice. */
export function Matcha({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n: string) => `${uid}-${n}`
  const url = (n: string) => `url(#${id(n)})`
  const cup = 'M22 66 L36 252 Q37 262 48 262 L112 262 Q123 262 124 252 L138 66 Z'

  // one wave period = 120 units, drawn wide enough to loop
  const wave = (y: number, amp: number) => {
    let d = `M-120 ${y}`
    for (let x = -120; x < 280; x += 60) d += ` q15 ${-amp} 30 0 t30 0`
    return `${d} V280 H-120 Z`
  }

  return (
    <svg viewBox="0 0 160 300" className={className} aria-hidden overflow="visible">
      <defs>
        <clipPath id={id('cup')}>
          <path d="M24.5 68 L38 250 Q39 259 48 259 L112 259 Q121 259 122 250 L135.5 68 Z" />
        </clipPath>
        <linearGradient id={id('matcha')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9c97d" />
          <stop offset=".5" stopColor="#97ad5a" />
          <stop offset="1" stopColor="#869e4c" />
        </linearGradient>
        <linearGradient id={id('milk')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8d39a" stopOpacity=".9" />
          <stop offset=".35" stopColor="#efeedd" />
          <stop offset="1" stopColor="#f8f6ec" />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".08" />
          <stop offset=".75" stopColor="#fff" stopOpacity=".02" />
          <stop offset=".92" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity=".1" />
        </linearGradient>
        <filter id={id('blur')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* shadow with a hint of green caustic */}
      <ellipse cx="82" cy="266" rx="62" ry="9" fill="#2b2a27" opacity=".2" filter={url('blur')} />
      <ellipse cx="96" cy="268" rx="34" ry="5" fill="#a9bb6c" opacity=".35" filter={url('blur')} />

      {/* straw — part above the cup */}
      <path d="M98 74 L114 6" stroke="#8ea7c6" strokeWidth="10" strokeLinecap="round" />
      <path d="M96 74 L112 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".55" />

      {/* liquid */}
      <g clipPath={url('cup')}>
        <rect x="0" y="60" width="160" height="220" fill="#f3f3ea" opacity=".35" />
        <g className="anim-wave" style={{ animationDuration: '4.2s' }}>
          <path d={wave(98, 4)} fill={url('matcha')} />
        </g>
        <g className="anim-wave" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <path d={wave(176, 6)} fill={url('milk')} />
        </g>
        {/* matcha swirl into milk */}
        <path d="M44 186 q20 -10 34 2 t38 -2" stroke="#a9bb6c" strokeWidth="6" fill="none" opacity=".35" strokeLinecap="round" />
        {/* straw through liquid (refracted, offset) */}
        <path d="M96 78 L80 250" stroke="#8ea7c6" strokeWidth="10" strokeLinecap="round" opacity=".6" />
        {/* ice */}
        <g className="anim-ice">
          <rect x="44" y="82" width="30" height="28" rx="6" fill="#fff" fillOpacity=".38" stroke="#fff" strokeOpacity=".8" transform="rotate(-12 59 96)" />
        </g>
        <g className="anim-ice" style={{ animationDelay: '-1.2s' }}>
          <rect x="84" y="94" width="28" height="26" rx="6" fill="#fff" fillOpacity=".32" stroke="#fff" strokeOpacity=".75" transform="rotate(14 98 107)" />
        </g>
        <g className="anim-ice" style={{ animationDelay: '-2s' }}>
          <rect x="58" y="120" width="26" height="24" rx="6" fill="#fff" fillOpacity=".28" stroke="#fff" strokeOpacity=".7" transform="rotate(6 71 132)" />
        </g>
      </g>

      {/* glass */}
      <path d={cup} fill={url('glass')} stroke="#9aa59a" strokeOpacity=".55" strokeWidth="1.4" />
      <ellipse cx="80" cy="66" rx="58" ry="6.5" fill="#fff" fillOpacity=".25" stroke="#9aa59a" strokeOpacity=".6" strokeWidth="1.4" />
      <path d="M34 82 L45 236" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".6" />
      <path d="M126 90 L120 170" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".45" />
      {/* condensation */}
      {[
        [52, 150, 1.6],
        [60, 200, 1.2],
        [114, 140, 1.4],
        [108, 214, 1.8],
        [70, 230, 1],
        [100, 182, 1.1],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity=".7" />
      ))}

    </svg>
  )
}
