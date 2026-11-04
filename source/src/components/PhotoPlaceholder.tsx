import type { Pic, Scene } from '../data/photos'

/** Renders a real photo when `src` is set, otherwise a soft illustrated stand-in. */
export function PhotoView({ photo, className = '', showTag = true }: { photo: Pic; className?: string; showTag?: boolean }) {
  if (photo.src) {
    return (
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} role="img" aria-label={photo.alt}>
      <SceneArt scene={photo.scene} colors={photo.colors} />
      {showTag && (
        <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-white/60 px-1 py-px font-mono text-[8px] uppercase tracking-widest text-ink/60">
          placeholder
        </span>
      )}
    </div>
  )
}

export function SceneArt({ scene, colors }: { scene: Scene; colors: [string, string, string] }) {
  const [a, b, c] = colors
  const common = { viewBox: '0 0 320 220', preserveAspectRatio: 'xMidYMid slice', className: 'h-full w-full' }
  switch (scene) {
    case 'newyork':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ny-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9d8ee" />
              <stop offset=".6" stopColor="#f6dfe4" />
              <stop offset="1" stopColor="#fbe9d6" />
            </linearGradient>
          </defs>
          <rect width="320" height="220" fill="url(#ny-sky)" />
          <circle cx="254" cy="58" r="22" fill="#fff6e4" opacity=".9" />
          <path d="M30 40 q10 -8 20 0 q8 -6 16 2 M200 30 q8 -6 16 0 q6 -4 12 2" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".9" />
          {/* back skyline */}
          {[[8,120,26],[36,98,22],[60,132,30],[96,104,20],[214,110,26],[242,92,22],[266,126,28],[296,106,24]].map(([x,h,w],i)=>(
            <rect key={i} x={x} y={190-h} width={w} height={h} fill="#b9c7e2" opacity=".85" />
          ))}
          {/* empire state building */}
          <g fill="#8ea7c6">
            <rect x="136" y="70" width="48" height="120" />
            <rect x="144" y="52" width="32" height="20" />
            <rect x="151" y="38" width="18" height="16" />
            <rect x="157" y="22" width="6" height="18" />
            <rect x="159" y="8" width="2" height="16" />
          </g>
          {Array.from({ length: 8 }).map((_, r) => (
            <g key={r}>{[142,152,162,172].map((x)=>(<rect key={x} x={x} y={80 + r * 13} width="5" height="7" fill="#fff6e4" opacity=".75" />))}</g>
          ))}
          {/* statue of liberty */}
          <g fill="#9fc7b8">
            <path d="M92 190 L96 150 L104 150 L108 190Z" />
            <rect x="94" y="138" width="12" height="14" rx="3" />
            <circle cx="100" cy="132" r="6" />
            <path d="M94 128 L100 120 L106 128Z" />
            <rect x="104" y="112" width="3" height="20" />
            <path d="M102 112 q3 -8 7 0Z" fill="#f2c46d" />
          </g>
          {/* water + front buildings */}
          <rect x="0" y="186" width="320" height="34" fill="#a9c0dc" />
          <path d="M0 196 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" strokeWidth="2" fill="none" opacity=".6" />
          {[[196,58,22],[222,44,20],[248,66,24],[20,50,24],[48,40,18]].map(([x,h,w],i)=>(
            <rect key={'f'+i} x={x} y={190-h} width={w} height={h} fill="#e8b8ad" opacity=".9" />
          ))}
          <path d="M0 210 L320 210" stroke="#fff" strokeWidth="1.5" opacity=".5" />
          <text x="300" y="214" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#4f6d94" opacity=".7">♡ NYC</text>
        </svg>
      )
    case 'friends':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <circle cx="250" cy="46" r="26" fill="#fff" opacity=".45" />
          {[
            [92, 104, b, 0],
            [160, 92, c, 1],
            [228, 106, b, 2],
          ].map(([x, y, col, i]) => (
            <g key={i as number}>
              <path d={`M${(x as number) - 46} 220 Q${(x as number) - 44} ${(y as number) + 34} ${x} ${(y as number) + 32} Q${(x as number) + 44} ${(y as number) + 34} ${(x as number) + 46} 220Z`} fill={col as string} />
              <circle cx={x as number} cy={y as number} r="26" fill="#f3d9c4" />
              <path d={`M${(x as number) - 27} ${(y as number) + 2} Q${(x as number) - 26} ${(y as number) - 32} ${x} ${(y as number) - 30} Q${(x as number) + 28} ${(y as number) - 32} ${(x as number) + 27} ${(y as number) + 4} Q${(x as number) + 20} ${(y as number) - 14} ${x} ${(y as number) - 16} Q${(x as number) - 18} ${(y as number) - 14} ${(x as number) - 27} ${(y as number) + 2}Z`} fill="#3a302b" />
              <path d={`M${(x as number) - 8} ${(y as number) + 10} Q${x} ${(y as number) + 16} ${(x as number) + 8} ${(y as number) + 10}`} stroke="#8f5b45" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      )
    case 'sunset':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="s-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c} />
              <stop offset=".55" stopColor={b} />
              <stop offset="1" stopColor={a} />
            </linearGradient>
          </defs>
          <rect width="320" height="220" fill="url(#s-sky)" />
          <circle cx="210" cy="128" r="34" fill="#fff4d6" opacity=".9" />
          <path d="M0 150 Q80 110 160 140 T320 130 V220 H0Z" fill={c} opacity=".55" />
          <path d="M0 175 Q90 140 190 170 T320 160 V220 H0Z" fill="#5d4a63" opacity=".7" />
          <path d="M0 200 Q120 180 320 196 V220 H0Z" fill="#3d3245" opacity=".8" />
        </svg>
      )
    case 'city':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <circle cx="250" cy="50" r="18" fill="#fff" opacity=".7" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const h = [90, 130, 70, 150, 110, 80, 140, 95][i]
            const x = i * 42 - 6
            return (
              <g key={i}>
                <rect x={x} y={220 - h} width="38" height={h} fill={i % 2 ? b : c} opacity={i % 2 ? 0.85 : 0.75} />
                {Array.from({ length: Math.floor(h / 22) }).map((_, j) => (
                  <rect key={j} x={x + 8} y={220 - h + 10 + j * 22} width="6" height="8" fill="#fff" opacity=".45" />
                ))}
              </g>
            )
          })}
        </svg>
      )
    case 'cafe':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <rect x="30" y="18" width="150" height="110" rx="4" fill="#fff" opacity=".55" />
          <path d="M105 18 V128 M30 73 H180" stroke={b} strokeWidth="5" opacity=".6" />
          <rect x="0" y="150" width="320" height="70" fill={b} />
          <rect x="0" y="150" width="320" height="6" fill={c} opacity=".5" />
          <ellipse cx="225" cy="150" rx="40" ry="8" fill="#fff" opacity=".9" />
          <path d="M200 110 h50 l-5 38 q-2 6 -8 6 h-24 q-6 0 -8 -6z" fill="#fff" />
          <path d="M250 118 q16 0 14 12 q-2 10 -16 8" stroke="#fff" strokeWidth="5" fill="none" />
          <path d="M215 100 q-6 -10 2 -18 M232 100 q-6 -10 2 -18" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" strokeLinecap="round" />
        </svg>
      )
    case 'matcha':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <circle cx="160" cy="210" r="140" fill={b} opacity=".18" />
          <path d="M124 40 L134 196 q1 10 12 10 h28 q11 0 12 -10 L196 40z" fill="#fff" opacity=".6" />
          <path d="M127 80 L134 196 q1 10 12 10 h28 q11 0 12 -10 L193 80z" fill={b} />
          <path d="M131 150 L134 196 q1 10 12 10 h28 q11 0 12 -10 L189 150 q-30 -14 -58 0z" fill="#f6f3e8" opacity=".85" />
          <rect x="140" y="86" width="20" height="20" rx="4" fill="#fff" opacity=".5" transform="rotate(12 150 96)" />
          <rect x="164" y="100" width="18" height="18" rx="4" fill="#fff" opacity=".4" transform="rotate(-8 173 109)" />
          <path d="M172 50 L186 4" stroke={c} strokeWidth="8" strokeLinecap="round" />
        </svg>
      )
    case 'flower':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <path d="M0 160 H320 M0 190 H320 M90 160 V220 M220 160 V220 M150 0 V160" stroke="#d8d0c0" strokeWidth="2" />
          <path d="M160 168 Q150 130 162 100" stroke={c} strokeWidth="4" fill="none" />
          <path d="M156 140 q-18 -6 -22 -18 q16 0 22 18z" fill={c} />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="162" cy="86" rx="9" ry="16" fill={b} transform={`rotate(${r} 162 100)`} />
          ))}
          <circle cx="162" cy="100" r="7" fill="#f2c46d" />
        </svg>
      )
    case 'snow':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <path d="M-10 170 L80 60 L130 120 L190 40 L330 170 V220 H-10Z" fill={b} />
          <path d="M80 60 L100 84 L88 80 L76 92 L64 80Z M190 40 L214 70 L198 64 L186 78 L170 64Z" fill="#fff" />
          <path d="M-10 190 Q160 150 330 186 V220 H-10Z" fill="#fff" />
          <path d="M60 200 L150 176" stroke={c} strokeWidth="3" strokeLinecap="round" />
          {[30, 90, 140, 230, 280, 50, 250].map((x, i) => (
            <circle key={i} cx={x} cy={20 + ((i * 37) % 100)} r="2.5" fill="#fff" />
          ))}
        </svg>
      )
    case 'desk':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <path d="M60 0 L40 70 L120 70 Z" fill={b} opacity=".25" />
          <path d="M70 70 L-20 220 H230 L110 70Z" fill={b} opacity=".14" />
          <rect x="0" y="160" width="320" height="60" fill="#3b4156" />
          <rect x="90" y="138" width="110" height="26" rx="2" fill="#f4efe3" transform="rotate(-4 145 150)" />
          <path d="M100 148 q20 -8 40 0 t40 0" stroke="#2b2a27" strokeWidth="1.5" fill="none" transform="rotate(-4 145 150)" />
          <rect x="225" y="122" width="22" height="40" rx="3" fill={c} opacity=".85" />
          <path d="M40 160 L60 40 L74 40" stroke={b} strokeWidth="4" fill="none" />
          <circle cx="290" cy="30" r="10" fill={b} opacity=".8" />
        </svg>
      )
    case 'dinner':
      return (
        <svg {...common}>
          <rect width="320" height="220" fill={a} />
          <ellipse cx="160" cy="140" rx="170" ry="80" fill="#fffaf2" />
          {[
            [90, 110, b],
            [170, 95, c],
            [240, 125, b],
            [150, 160, c],
            [70, 165, b],
          ].map(([x, y, col], i) => (
            <g key={i}>
              <circle cx={x as number} cy={y as number} r="30" fill="#fff" stroke="#e8dccb" strokeWidth="3" />
              <circle cx={x as number} cy={y as number} r="18" fill={col as string} opacity=".8" />
            </g>
          ))}
          <path d="M260 170 L300 140 M266 176 L306 146" stroke="#8f5b45" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
  }
}
