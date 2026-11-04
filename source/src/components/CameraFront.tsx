import { forwardRef, useId } from 'react'
import { motion } from 'motion/react'

type Props = {
  hovered?: boolean
  pressed?: boolean
  focusing?: boolean
  className?: string
}

/**
 * A compact early-2000s point-and-shoot, seen from the front.
 * The ref points at the lens glass so the entrance transition can dive through it.
 */
export const CameraFront = forwardRef<SVGCircleElement, Props>(function CameraFront(
  { hovered = false, pressed = false, focusing = false, className },
  lensRef,
) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n: string) => `${uid}-${n}`
  const url = (n: string) => `url(#${id(n)})`

  return (
    <svg viewBox="0 0 380 260" className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={id('body')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f6fa" />
          <stop offset=".12" stopColor="#dde5ee" />
          <stop offset=".5" stopColor="#c3cfdd" />
          <stop offset=".82" stopColor="#d3dce7" />
          <stop offset="1" stopColor="#a8b6c7" />
        </linearGradient>
        <linearGradient id={id('brush')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".0" />
          <stop offset=".25" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".4" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".7" stopColor="#fff" stopOpacity=".25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('chrome')} cx=".38" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#d9dee5" />
          <stop offset=".8" stopColor="#9aa5b2" />
          <stop offset="1" stopColor="#7d8896" />
        </radialGradient>
        <linearGradient id={id('barrel')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a505b" />
          <stop offset="1" stopColor="#16191e" />
        </linearGradient>
        <radialGradient id={id('glass')} cx=".4" cy=".36" r=".75">
          <stop offset="0" stopColor="#4b5a86" />
          <stop offset=".35" stopColor="#1e2640" />
          <stop offset=".75" stopColor="#0b0e19" />
          <stop offset="1" stopColor="#05060a" />
        </radialGradient>
        <linearGradient id={id('coat')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b48cff" stopOpacity=".55" />
          <stop offset=".5" stopColor="#6fd3b0" stopOpacity=".25" />
          <stop offset="1" stopColor="#ffd38a" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id={id('glint')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id('glassclip')}>
          <circle cx="205" cy="146" r="43" />
        </clipPath>
        <filter id={id('blur')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <path id={id('ring')} d="M205 146 m-55 0 a55 55 0 1 1 110 0 a55 55 0 1 1 -110 0" />
      </defs>

      {/* contact shadow */}
      <ellipse cx="190" cy="242" rx="158" ry="11" fill="#2b2a27" opacity=".22" filter={url('blur')} />

      {/* top buttons (behind body) */}
      <motion.g animate={{ y: pressed ? 4 : 0 }} transition={{ type: 'spring', stiffness: 700, damping: 18 }}>
        <rect x="262" y="40" width="56" height="20" rx="8" fill={url('chrome')} stroke="#8793a1" strokeWidth="1" />
        <rect x="268" y="42" width="44" height="4" rx="2" fill="#fff" opacity=".7" />
      </motion.g>
      <rect x="220" y="48" width="26" height="10" rx="4" fill="#8f9aa7" />
      <circle cx="233" cy="51" r="1.6" fill="#7fd27f" />

      {/* body */}
      <rect x="22" y="54" width="336" height="182" rx="30" fill={url('body')} stroke="#97a5b6" strokeWidth="1.2" />
      <rect x="22" y="54" width="336" height="182" rx="30" fill={url('brush')} />
      <path d="M52 56 H328" stroke="#fff" strokeWidth="2" opacity=".9" strokeLinecap="round" />
      <path d="M50 234 H330" stroke="#7f8ea1" strokeWidth="1.2" opacity=".6" strokeLinecap="round" />
      {/* subtle seam */}
      <path d="M22 196 H358" stroke="#9fadbf" strokeWidth=".8" opacity=".55" />

      {/* grip */}
      <rect x="34" y="112" width="24" height="96" rx="11" fill="#b4c1d1" opacity=".7" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx="46" cy={124 + i * 14} r="1.6" fill="#8291a5" />
      ))}

      {/* flash */}
      <rect x="44" y="70" width="70" height="28" rx="6" fill="#f2f5f8" stroke="#a7b3c1" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${52 + i * 9} 73 V95`} stroke="#d5dde6" strokeWidth="1.2" />
      ))}
      <rect x="44" y="70" width="70" height="10" rx="5" fill="#fff" opacity=".55" />

      {/* viewfinder + AF lamp */}
      <rect x="124" y="72" width="30" height="20" rx="4" fill="#1b2030" stroke="#7d8896" />
      <path d="M128 76 L138 76" stroke="#8aa0d0" strokeWidth="2" opacity=".6" strokeLinecap="round" />
      <circle cx="300" cy="84" r="6" fill="#ffb36b" stroke="#c98d55" />
      <circle cx="298" cy="82" r="2" fill="#fff" opacity=".8" />

      {/* brand-ish wordmark (personal, not a real brand) */}
      <text x="296" y="222" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" letterSpacing="1.5" fill="#5f6b7c">
        3.2 MP
      </text>

      {/* lens */}
      <motion.g
        animate={{ scale: focusing ? 1.14 : hovered ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        <circle cx="205" cy="150" r="80" fill="#2b2a27" opacity=".18" filter={url('blur')} />
        <circle cx="205" cy="146" r="76" fill={url('chrome')} stroke="#7a8594" strokeWidth="1" />
        <circle cx="205" cy="146" r="68" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
        <circle cx="205" cy="146" r="64" fill={url('barrel')} />
        <text fontFamily="IBM Plex Mono, monospace" fontSize="6.2" letterSpacing="1.6" fill="#c7ccd4">
          <textPath href={`#${id('ring')}`}>ZOOM LENS 3× · 5.8–17.4mm 1:2.8–4.9 · LITTLE THINGS OPTICS ·</textPath>
        </text>
        <circle cx="205" cy="146" r="49" fill="#0d1016" stroke="#3b414c" strokeWidth="2" />
        <circle ref={lensRef} cx="205" cy="146" r="43" fill={url('glass')} />
        <g clipPath={url('glassclip')}>
          <circle cx="205" cy="146" r="33" fill="none" stroke={url('coat')} strokeWidth="5" />
          <circle cx="205" cy="146" r="20" fill="none" stroke="#6b78a8" strokeOpacity=".35" strokeWidth="2" />
          <circle cx="205" cy="146" r="9" fill="#05060a" />
          <motion.rect
            y="96"
            width="34"
            height="100"
            fill={url('glint')}
            transform="rotate(25 205 146)"
            initial={{ x: 120 }}
            animate={{ x: hovered || focusing ? 270 : 120 }}
            transition={{ duration: hovered || focusing ? 0.8 : 0, ease: 'easeInOut' }}
          />
        </g>
        <ellipse cx="189" cy="128" rx="13" ry="7" fill="#fff" opacity=".75" transform="rotate(-32 189 128)" />
        <circle cx="222" cy="165" r="3" fill="#fff" opacity=".35" />
        {/* focus flash inside the lens */}
        <motion.circle
          cx="205"
          cy="146"
          r="43"
          fill="#fff"
          initial={{ opacity: 0 }}
          animate={{ opacity: focusing ? [0, 0.5, 0] : 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.g>

      {/* strap lug + wrist strap */}
      <rect x="352" y="88" width="12" height="16" rx="4" fill={url('chrome')} stroke="#7d8896" />
      <path d="M362 96 C 402 104 408 178 384 220 C 374 240 352 246 340 238" fill="none" stroke="#7f9472" strokeWidth="8" strokeLinecap="round" />
      <path d="M362 96 C 402 104 408 178 384 220 C 374 240 352 246 340 238" fill="none" stroke="#a7b99a" strokeWidth="3" strokeDasharray="3 5" strokeLinecap="round" />
      <rect x="388" y="150" width="14" height="22" rx="4" fill="#5f7356" transform="rotate(8 395 161)" />
    </svg>
  )
})
