import { useId, type ReactNode } from 'react'

type Controls = {
  onPrev: () => void
  onNext: () => void
  onOk?: () => void
  disabled?: boolean
}

/**
 * The same little camera, seen from the back — screen + buttons.
 * `screen` is HTML rendered inside the LCD; `controls` makes the d-pad real buttons.
 * Aspect ratio is fixed at 400:260 so it scales cleanly in shared-layout animations.
 */
export function CameraBack({
  screen,
  controls,
  className = '',
  pressedSide,
}: {
  screen: ReactNode
  controls?: Controls
  className?: string
  pressedSide?: 'left' | 'right' | null
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n: string) => `${uid}-${n}`
  const url = (n: string) => `url(#${id(n)})`

  return (
    <div className={`relative aspect-[400/260] w-full ${className}`}>
      <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={id('body')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f6fa" />
            <stop offset=".1" stopColor="#dbe3ec" />
            <stop offset=".55" stopColor="#c2cedc" />
            <stop offset=".85" stopColor="#d2dbe6" />
            <stop offset="1" stopColor="#a6b4c5" />
          </linearGradient>
          <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2=".4">
            <stop offset="0" stopColor="#fff" stopOpacity=".45" />
            <stop offset=".35" stopColor="#fff" stopOpacity="0" />
            <stop offset=".7" stopColor="#fff" stopOpacity=".18" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={id('chrome')} cx=".38" cy=".3" r=".85">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".5" stopColor="#d6dce4" />
            <stop offset="1" stopColor="#8994a3" />
          </radialGradient>
          <linearGradient id={id('bezel')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2e36" />
            <stop offset="1" stopColor="#14161a" />
          </linearGradient>
          <filter id={id('blur')} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <ellipse cx="200" cy="252" rx="170" ry="10" fill="#2b2a27" opacity=".22" filter={url('blur')} />

        {/* shutter + power on top edge */}
        <rect x="292" y="12" width="56" height="16" rx="7" fill={url('chrome')} stroke="#8793a1" />
        <rect x="250" y="17" width="24" height="9" rx="4" fill="#8f9aa7" />

        {/* strap lug (keychain attaches here) */}
        <rect x="380" y="34" width="14" height="20" rx="5" fill={url('chrome')} stroke="#7d8896" />

        <rect x="10" y="22" width="380" height="224" rx="32" fill={url('body')} stroke="#97a5b6" strokeWidth="1.2" />
        <rect x="10" y="22" width="380" height="224" rx="32" fill={url('sheen')} />
        <path d="M44 24 H356" stroke="#fff" strokeWidth="2" opacity=".9" strokeLinecap="round" />

        {/* screen */}
        <rect x="26" y="38" width="258" height="184" rx="14" fill={url('bezel')} />
        <rect x="27.5" y="39.5" width="255" height="181" rx="13" fill="none" stroke="#fff" strokeOpacity=".12" />
        <rect x="40" y="52" width="230" height="156" rx="4" fill="#0b0d10" />
        <text x="40" y="236" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" letterSpacing="1.8" fill="#5f6b7c">
          2.0" LCD · DZ-01
        </text>

        {/* zoom rocker */}
        <rect x="302" y="44" width="68" height="20" rx="10" fill={url('chrome')} stroke="#8793a1" />
        <text x="312" y="57" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#4b5566">W</text>
        <text x="354" y="57" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#4b5566">T</text>
        <path d="M325 54 H347" stroke="#8793a1" strokeWidth="1" />

        {/* play + menu */}
        <circle cx="314" cy="90" r="9" fill={url('chrome')} stroke="#8793a1" />
        <path d="M311 86 L318 90 L311 94Z" fill="#4f6d94" />
        <circle cx="358" cy="90" r="9" fill={url('chrome')} stroke="#8793a1" />
        <path d="M353 87 H363 M353 90 H363 M353 93 H363" stroke="#4b5566" strokeWidth="1.2" />
        <text x="304" y="111" fontFamily="IBM Plex Mono, monospace" fontSize="5.5" letterSpacing="1" fill="#5f6b7c">PLAY</text>
        <text x="348" y="111" fontFamily="IBM Plex Mono, monospace" fontSize="5.5" letterSpacing="1" fill="#5f6b7c">MENU</text>

        {/* d-pad */}
        <circle cx="336" cy="156" r="40" fill="#b3c0cf" opacity=".6" />
        <circle cx="336" cy="156" r="36" fill={url('chrome')} stroke="#7f8a99" />
        <circle cx="336" cy="156" r="31" fill="none" stroke="#fff" strokeOpacity=".6" />
        <path
          d="M306 156 L313 151 L313 161Z"
          fill={pressedSide === 'left' ? '#4f6d94' : '#4b5566'}
        />
        <path
          d="M366 156 L359 151 L359 161Z"
          fill={pressedSide === 'right' ? '#4f6d94' : '#4b5566'}
        />
        <path d="M336 126 L331 133 L341 133Z M336 186 L331 179 L341 179Z" fill="#4b5566" opacity=".7" />
        <circle cx="336" cy="156" r="14" fill="#e9edf2" stroke="#8793a1" />
        <text x="329" y="159" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#4b5566">OK</text>

        {/* bottom buttons */}
        <rect x="304" y="206" width="28" height="11" rx="5.5" fill={url('chrome')} stroke="#8793a1" />
        <rect x="342" y="206" width="28" height="11" rx="5.5" fill={url('chrome')} stroke="#8793a1" />
        <text x="309" y="229" fontFamily="IBM Plex Mono, monospace" fontSize="5.5" letterSpacing="1" fill="#5f6b7c">DISP</text>
        <text x="348" y="229" fontFamily="IBM Plex Mono, monospace" fontSize="5.5" letterSpacing="1" fill="#5f6b7c">FUNC</text>
        <circle cx="296" cy="44" r="2.2" fill="#7fd27f" />
      </svg>

      {/* LCD contents */}
      <div
        className="absolute overflow-hidden rounded-[2px] bg-[#0b0d10]"
        style={{ left: '10%', top: '20%', width: '57.5%', height: '60%' }}
      >
        {screen}
        {/* glass reflection */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,.16)_0%,rgba(255,255,255,0)_38%,rgba(255,255,255,0)_70%,rgba(255,255,255,.06)_100%)]" />
      </div>

      {controls && (
        <>
          <button
            type="button"
            onClick={controls.onPrev}
            disabled={controls.disabled}
            aria-label="Previous photo"
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition active:scale-90"
            style={{ left: '77%', top: '60%', width: '8%', height: '12%' }}
          />
          <button
            type="button"
            onClick={controls.onNext}
            disabled={controls.disabled}
            aria-label="Next photo"
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition active:scale-90"
            style={{ left: '91%', top: '60%', width: '8%', height: '12%' }}
          />
          {controls.onOk && (
            <button
              type="button"
              onClick={controls.onOk}
              aria-label="Toggle photo note"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition active:scale-90"
              style={{ left: '84%', top: '60%', width: '7%', height: '11%' }}
            />
          )}
        </>
      )}
    </div>
  )
}
