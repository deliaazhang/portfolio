import { motion } from 'motion/react'
import { site } from '../data/site'
import { MatchaRun } from './MatchaRun'

const links = [
  { label: 'Email', href: `mailto:${site.email}` },
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'GitHub', href: site.github },
  { label: 'Resume', href: site.resume },
]

export function Footer() {
  return (
    <footer className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-24 sm:px-10 md:pt-36">
      <div className="border-t border-line pt-16">
        <motion.h2
          className="display text-[clamp(2.8rem,8.5vw,8.6rem)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          thanks for <span className="serif-i">stopping by!</span>
        </motion.h2>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="font-mono text-[1.05rem] text-ink-soft sm:text-[1.2rem]">let’s connect!</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="mono-label link-draw group inline-flex items-center gap-1.5 py-1 text-ink"
                  {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {l.label}
                  <span className="text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <MatchaRun />

        <div className="mt-20 flex flex-col gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <span className="font-cn normal-case tracking-[0.3em]">{site.chineseName}</span>
            <span>© {new Date().getFullYear()}</span>
            <span>last updated {site.lastUpdated}</span>
          </p>
          <a href="#top" className="link-draw self-start text-ink-soft sm:self-auto">
            back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
