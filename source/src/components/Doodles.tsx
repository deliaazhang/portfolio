import { motion } from 'motion/react'

/** Little pencil doodles. Each is a list of path `d` strings in an 80×80 box. */
const DOODLES = {
  matcha: [
    'M22 26 L28 70 Q29 74 33 74 L47 74 Q51 74 52 70 L58 26',
    'M20 26 Q40 21 60 26',
    'M25 40 Q33 37 40 40 Q47 43 55 40',
    'M44 26 L52 6',
    'M30 50 l6 -2 l1 6 l-6 2 z',
    'M42 56 l5 -1 l1 5 l-5 1 z',
  ],
  pencil: [
    'M16 64 L56 18 L64 26 L24 72 Z',
    'M16 64 L12 76 L24 72',
    'M50 24 L58 32',
    'M30 74 Q40 66 52 72 Q60 76 70 70',
  ],
  postcard: [
    'M8 20 L72 20 L72 62 L8 62 Z',
    'M44 26 L44 56',
    'M52 30 L66 30 M52 38 L66 38 M52 46 L62 46',
    'M58 24 l8 0 l0 8',
    'M14 50 Q22 36 30 46 Q34 40 40 48',
    'M20 34 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
  ],
  chart: [
    'M10 68 L70 68',
    'M10 68 L10 10',
    'M18 66 L18 46 M30 66 L30 34 M42 66 L42 40 M54 66 L54 22',
    'M14 50 Q26 30 36 38 Q48 46 60 16',
    'M58 14 l4 2 l-1 4',
  ],
  bezier: [
    'M12 60 C 24 12, 56 12, 68 60',
    'M12 60 L26 22 M68 60 L54 22',
    'M24 20 l4 0 l0 4 l-4 0 z M52 20 l4 0 l0 4 l-4 0 z',
    'M10 58 l4 0 l0 4 l-4 0 z M66 58 l4 0 l0 4 l-4 0 z',
  ],
  knight: [
    'M24 70 L56 70',
    'M28 70 Q26 58 34 52 Q24 48 22 38 Q22 22 40 14 L44 10 L46 16 Q60 24 58 46 Q57 58 52 70',
    'M34 28 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0',
    'M22 38 Q28 40 34 36',
  ],
  mountain: [
    'M6 66 L30 26 L42 44 L52 32 L74 66 Z',
    'M24 36 L30 26 L36 36 Q33 33 30 37 Q27 33 24 36',
    'M58 16 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',
    'M18 72 L40 64 M44 74 L66 66',
  ],
  cup: [
    'M16 34 L20 66 Q21 70 26 70 L46 70 Q51 70 52 66 L56 34 Z',
    'M56 40 Q68 40 66 50 Q64 58 54 56',
    'M28 26 Q24 20 30 16 Q34 12 30 6 M40 26 Q36 20 42 16 Q46 12 42 6',
    'M10 74 L64 74',
  ],
  note: [
    'M28 60 m-8 0 a8 6 -20 1 0 16 0 a8 6 -20 1 0 -16 0',
    'M36 58 L36 14 L62 8 L62 50',
    'M62 50 m-8 0 a8 6 -20 1 0 16 0 a8 6 -20 1 0 -16 0',
    'M36 24 L62 18',
  ],
  film: [
    'M10 22 L70 22 L70 58 L10 58 Z',
    'M10 30 L70 30 M10 50 L70 50',
    'M16 24 l0 4 M24 24 l0 4 M32 24 l0 4 M40 24 l0 4 M48 24 l0 4 M56 24 l0 4 M64 24 l0 4',
    'M16 52 l0 4 M24 52 l0 4 M32 52 l0 4 M40 52 l0 4 M48 52 l0 4 M56 52 l0 4 M64 52 l0 4',
    'M34 34 L48 40 L34 46 Z',
  ],
  bowl: [
    'M10 40 Q40 44 70 40 Q66 66 40 68 Q14 66 10 40',
    'M30 70 L50 70',
    'M48 14 L30 38 M58 16 L36 39',
    'M24 38 Q28 30 34 36 Q38 28 44 36 Q50 30 54 38',
  ],
  hanger: [
    'M40 22 Q40 14 46 14 Q52 14 52 20 Q52 26 44 30',
    'M44 30 L40 32 L8 54 Q6 58 10 58 L70 58 Q74 58 72 54 L40 32',
  ],
  dog: [
    'M20 30 Q16 14 26 18 Q30 10 40 12 Q50 10 54 18 Q64 14 60 30',
    'M20 30 Q18 48 30 54 Q40 60 50 54 Q62 48 60 30',
    'M32 34 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M48 34 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0',
    'M37 42 Q40 45 43 42 M40 44 L40 48 Q36 51 34 48 M40 48 Q44 51 46 48',
    'M20 30 Q12 34 14 46 Q22 44 24 36 M60 30 Q68 34 66 46 Q58 44 56 36',
    'M34 56 Q34 66 30 72 M46 56 Q46 66 50 72',
  ],
  bulb: [
    'M40 10 Q22 10 20 28 Q19 40 30 48 L30 58 L50 58 L50 48 Q61 40 60 28 Q58 10 40 10',
    'M31 64 L49 64 M33 70 L47 70',
    'M36 46 L40 32 L44 46',
    'M10 22 L4 18 M70 22 L76 18 M40 4 L40 -2',
  ],
  brain: [
    'M40 16 Q30 8 22 16 Q12 16 14 28 Q6 34 12 44 Q8 56 22 58 Q28 68 40 62',
    'M40 16 Q50 8 58 16 Q68 16 66 28 Q74 34 68 44 Q72 56 58 58 Q52 68 40 62',
    'M40 16 L40 62',
    'M24 30 Q30 34 28 42 M56 30 Q50 34 52 42',
  ],
  gear: [
    'M40 22 a18 18 0 1 0 0.1 0',
    'M40 33 a7 7 0 1 0 0.1 0',
    'M40 8 L40 18 M40 62 L40 72 M8 40 L18 40 M62 40 L72 40 M17 17 L24 24 M56 56 L63 63 M17 63 L24 56 M56 24 L63 17',
  ],
  heart: [
    'M40 66 Q12 46 14 28 Q18 14 32 18 Q38 20 40 28 Q42 20 48 18 Q62 14 66 28 Q68 46 40 66',
  ],
} as const

export type DoodleName = keyof typeof DOODLES

export function Doodle({
  name,
  size = 64,
  color = 'currentColor',
  draw = true,
  delay = 0,
  className,
}: {
  name: DoodleName
  size?: number
  color?: string
  draw?: boolean
  delay?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {DOODLES[name].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={draw ? { pathLength: 0, opacity: 0.2 } : false}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.55, delay: delay + i * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}
