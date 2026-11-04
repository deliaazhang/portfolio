import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../data/site'

type Props = { onSection: (id: string) => void; current?: 'home' | 'about' | 'project' }

const external = [
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'Email', href: `mailto:${site.email}` },
  { label: 'Resume', href: site.resume },
]

export function Nav({ onSection, current = 'home' }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    onSection(id)
  }

  const item = 'mono-label link-draw py-1 text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:bg-[length:100%_1px]'

  const links = (
    <>
      <a href="#work" onClick={go('work')} className={item} aria-current={current !== 'about' ? 'page' : undefined}>Work</a>
      <a href="#about" onClick={go('about')} className={item} aria-current={current === 'about' ? 'page' : undefined}>About</a>
      {external.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className={item}
          {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {l.label}
        </a>
      ))}
    </>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open ? 'bg-paper/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10 sm:py-6" aria-label="Main">
        <a href="#top" onClick={go('top')} className="group flex items-baseline gap-2" aria-label="Delia Zhang — back to top">
          <span className="mono-label text-[0.8rem] font-medium tracking-[0.22em] text-ink">Delia Zhang</span>
          <span className="text-ink-faint">/</span>
          <span className="font-cn text-[0.95rem] tracking-[0.2em] text-ink-soft transition-colors group-hover:text-sage-deep">
            {site.chineseName}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">{links}</div>

        <button
          type="button"
          className="mono-label rounded-full border border-line bg-paper/70 px-3 py-1.5 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'close' : 'menu'}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-3 px-5 pb-6">{links}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
