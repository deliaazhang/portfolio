import { motion, type MotionValue } from 'motion/react'
import { site } from '../data/site'

/** Acrylic name charm that hangs off the camera's strap lug. */
export function Keychain({ swing, className = '' }: { swing?: MotionValue<number>; className?: string }) {
  const chars = site.chineseName.split('')
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      style={{
        left: '96.5%',
        top: '13%',
        width: '17%',
        x: '-25%',
        rotate: swing,
        transformOrigin: '25% 2%',
      }}
      aria-hidden
    >
      <div className="anim-sway" style={{ transformOrigin: '25% 2%' }}>
        <svg viewBox="0 0 80 200" className="w-full overflow-visible drop-shadow-[0_6px_8px_rgba(43,42,39,0.18)]">
          <defs>
            <linearGradient id="kc-acrylic" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c9d7c0" stopOpacity=".95" />
              <stop offset=".5" stopColor="#9fb393" stopOpacity=".85" />
              <stop offset="1" stopColor="#7f9472" stopOpacity=".9" />
            </linearGradient>
          </defs>
          {/* split ring */}
          <circle cx="20" cy="17" r="12" fill="none" stroke="#a9b2bd" strokeWidth="3" />
          <circle cx="20" cy="17" r="12" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="10 40" opacity=".9" />
          {/* ball chain */}
          {Array.from({ length: 11 }).map((_, i) => (
            <circle key={i} cx={24 + i * 1.5} cy={30 + i * 3.6} r="1.7" fill="#b8c0ca" stroke="#8a94a0" strokeWidth=".5" />
          ))}
          {/* acrylic tag */}
          <rect x="20" y="70" width="42" height="118" rx="14" fill="url(#kc-acrylic)" stroke="#6d8262" strokeOpacity=".6" />
          <rect x="24" y="74" width="8" height="100" rx="4" fill="#fff" opacity=".35" />
          <circle cx="41" cy="80" r="3.5" fill="#f7f5ef" stroke="#6d8262" strokeOpacity=".6" />
          {chars.map((ch, i) => (
            <text
              key={i}
              x="41"
              y={110 + i * 24}
              textAnchor="middle"
              fontFamily="Noto Serif SC, Songti SC, serif"
              fontSize="19"
              fontWeight="500"
              fill="#2f3a2a"
            >
              {ch}
            </text>
          ))}
          <text x="41" y="182" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6" letterSpacing="1.5" fill="#f7f5ef">
            DELIA
          </text>
        </svg>
      </div>
    </motion.div>
  )
}
