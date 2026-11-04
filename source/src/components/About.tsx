import { motion, useReducedMotion } from 'motion/react'
import { site } from '../data/site'

const ease = [0.2, 0.7, 0.2, 1] as const

/** ✎ The hello letter at the top of the About page. Keep it short and casual. */
const letter = [
  'hi! i’m delia — a ux/ui designer studying cognitive systems and data science at ubc.',
  'i’m happiest somewhere between design and data: figuring out why people do what they do, then making things that feel a little simpler and kinder to use.',
  'when i’m not designing, you’ll probably find me hunting down the next great matcha, sketching portraits, playing chess, or planning the next trip.',
  'thanks for stopping by. have a look around my corner ↓',
]

/** A short, signed note on lined paper, with a taped polaroid. */
export function About() {
  const reduce = useReducedMotion()
  return (
    <section id="about" className="relative mx-auto max-w-[1440px] px-5 pb-6 pt-16 sm:px-10 md:pt-20">

      <div className="relative mx-auto mt-6 grid max-w-[1080px] items-center gap-12 md:mt-4 md:grid-cols-[minmax(0,1fr)_auto] md:gap-0">
        {/* the letter */}
        <motion.article
          className="relative z-10 rotate-[-0.8deg] bg-[#fffdf6] px-7 pb-10 pt-12 shadow-[0_30px_50px_-30px_rgba(43,42,39,.45),0_2px_4px_rgba(43,42,39,.08)] sm:px-12 sm:pb-12 md:mr-[-40px]"
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          {/* margin line + tape */}
          <span className="absolute inset-y-0 left-5 w-px bg-blush/80 sm:left-8" aria-hidden />
          <span className="absolute -top-3 left-10 h-6 w-24 rotate-[-4deg] bg-sage-tint/90" aria-hidden />
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-faint">a little hello</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,5vw,4rem)]">
            nice to <span className="serif-i">meet you.</span>
          </h2>
          <div
            className="mt-6 max-w-[34rem] space-y-[34px] text-[1.06rem] leading-[34px] text-ink-soft"
            style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 32px, rgba(142,167,198,.42) 32px 33px, transparent 33px 34px)' }}
          >
            {letter.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <p className="serif-i mt-6 text-right text-[1.9rem] leading-none text-ink">
            — delia <span className="text-blush">♡</span>
          </p>
          <p className="mt-1 text-right font-cn text-[0.9rem] tracking-[0.3em] text-ink-faint">{site.chineseName}</p>
        </motion.article>

        {/* taped polaroid */}
        <motion.figure
          className="relative z-20 mx-auto w-[min(72%,280px)] rotate-[5deg] bg-white p-3 pb-12 shadow-[0_24px_40px_-20px_rgba(43,42,39,.5)] md:mx-0 md:w-[300px]"
          initial={reduce ? false : { opacity: 0, y: 40, rotate: 12 }}
          whileInView={{ opacity: 1, y: 0, rotate: 5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.25 }}
          whileHover={reduce ? undefined : { rotate: 1, y: -6, scale: 1.02 }}
        >
          <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 bg-blush/60" aria-hidden />
          <div className="aspect-[4/5] overflow-hidden bg-paper-2">
            <img src="photos/delia-about.webp" alt="Delia in a white halter dress, striking a playful pose outside a café with red flowers at night" className="h-full w-full object-cover" loading="lazy" draggable={false} />
          </div>
          <figcaption className="absolute inset-x-0 bottom-3 text-center font-mono text-[0.78rem] text-ink-soft">that’s me!</figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
