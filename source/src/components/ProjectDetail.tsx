import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { projects, type PrototypeKey, type Project } from '../data/projects'
import { stories } from '../data/caseStudies'
import { ProjectPreview } from './DevicePreview'
import { ProcessBoard } from './ProcessBoard'
import { ArcTrailMatch } from './prototypes/ArcTrailMatch'
import { RoominateAlerts } from './prototypes/RoominateAlerts'
import { SkintellectFlow } from './prototypes/SkintellectFlow'
import { HerschelExplorer } from './prototypes/HerschelExplorer'

const ease = [0.2, 0.7, 0.2, 1] as const

const PROTOTYPES: Record<PrototypeKey, () => ReactNode> = {
  arctrail: () => <ArcTrailMatch />,
  roominate: () => <RoominateAlerts />,
  skintellect: () => <SkintellectFlow />,
  herschel: () => <HerschelExplorer />,
}

const SECTIONS = [
  { id: 'tldr', label: 'tl;dr' },
  { id: 'origin', label: 'where it started' },
  { id: 'questions', label: 'questions' },
  { id: 'process', label: 'process' },
  { id: 'decisions', label: 'decisions' },
  { id: 'prototype', label: 'prototype' },
  { id: 'final', label: 'final product' },
  { id: 'reflections', label: 'reflections' },
] as const
const SECTION_IDS = SECTIONS.map((s) => s.id)

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function Section({ id, label, accent, children }: { id: string; label: string; accent: string; children: ReactNode }) {
  return (
    <section id={`s-${id}`} className="scroll-mt-40 pt-16 first:pt-12">
      <p className="mb-5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em]" style={{ color: accent }}>
        {label}
      </p>
      {children}
    </section>
  )
}

function HeroReel({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className="relative aspect-[16/10] overflow-hidden rounded-[22px] shadow-[0_40px_80px_-50px_rgba(30,40,60,.6)]"
      style={{ background: project.tint }}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.1, ease }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.7),transparent_62%)]" />
      <ProjectPreview project={project} playing={inView && !reduce} size="hero" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper/80 to-transparent" />
    </motion.div>
  )
}

/** highlights the section currently in view */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const on = () => {
      let cur = ids[0]
      for (const id of ids) {
        const el = document.getElementById(`s-${id}`)
        if (el && el.getBoundingClientRect().top <= 200) cur = id
      }
      setActive(cur)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [ids])
  return active
}

export function ProjectDetail({ slug, onBack, onOpen }: { slug: string; onBack: () => void; onOpen: (slug: string) => void }) {
  const idx = projects.findIndex((p) => p.slug === slug)
  const project = projects[idx]
  const story = project ? stories[project.slug] : undefined
  const next = projects[(idx + 1) % projects.length]
  const reduce = useReducedMotion()
  const active = useActiveSection(SECTION_IDS)
  const titleRef = useRef<HTMLUListElement>(null)
  const [showBar, setShowBar] = useState(false)
  useEffect(() => {
    const on = () => {
      const el = titleRef.current
      setShowBar(!!el && el.getBoundingClientRect().bottom < 90)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [slug])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (project) document.title = `${project.title} — Delia Zhang`
    return () => {
      document.title = 'Delia Zhang — 张蕊舒'
    }
  }, [project])

  if (!project || !story) {
    return (
      <main className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-start justify-center px-5 pt-28">
        <p className="mono-label text-ink-soft">404 — couldn’t find that one</p>
        <button type="button" onClick={onBack} className="display mt-6 text-5xl">
          ← back <span className="serif-i">home</span>
        </button>
      </main>
    )
  }

  const p = project
  const s = story
  const jump = (id: string) => document.getElementById(`s-${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  const fact = (label: string) => p.facts.find((f) => f.label === label)?.value

  return (
    <motion.main
      key={slug}
      className="mx-auto max-w-[1280px] px-5 pb-24 pt-24 sm:px-10 md:pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-[900px]">
        <button
          type="button"
          onClick={onBack}
          className="mono-label group mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-ink-soft transition hover:border-ink hover:text-ink"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">‹</span> all work
        </button>

        {/* section bar: slides in once the title has scrolled away */}
        <motion.nav
          className="fixed inset-x-0 top-[60px] z-20 px-0 sm:top-[76px] sm:px-10"
          aria-label="Sections"
          aria-hidden={!showBar}
          initial={false}
          animate={{ y: showBar ? 0 : -16, opacity: showBar ? 1 : 0, pointerEvents: showBar ? 'auto' : 'none' }}
          transition={{ duration: 0.25, ease }}
        >
          <div className="mx-auto max-w-[900px] border-y border-line bg-paper/95 px-5 backdrop-blur-md sm:rounded-full sm:border sm:px-2">
            <ul className="no-scrollbar flex gap-1 overflow-x-auto py-2">
              {SECTIONS.map((sec) => (
                <li key={sec.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => jump(sec.id)}
                    tabIndex={showBar ? undefined : -1}
                    aria-current={active === sec.id ? 'true' : undefined}
                    className="whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
                    style={active === sec.id ? { color: '#fff', background: p.accent } : undefined}
                  >
                    {sec.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>

        {/* content, on a solid sheet so the grid doesn't fight the text */}
        <article className="min-w-0 rounded-[24px] border border-line bg-paper px-5 pb-12 pt-5 shadow-[0_30px_60px_-40px_rgba(43,42,39,.35)] sm:px-10 sm:pt-8 md:px-14">
          <div className="flex items-center gap-2.5 text-[0.98rem] text-ink">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} aria-hidden />
            {p.event}
          </div>
          <h1 className="serif-i mt-3 text-[clamp(3rem,7vw,5.6rem)] leading-[0.95] text-ink">{p.title}</h1>
          <ul ref={titleRef} className="mb-8 mt-5 flex flex-wrap gap-2">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f2b84b]" aria-hidden /> {p.year}
            </li>
            {s.tags.map((t) => (
              <li key={t} className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft">
                {t}
              </li>
            ))}
          </ul>
          <HeroReel project={p} />


          {/* TL;DR */}
          <Section id="tldr" label="tl;dr" accent={p.accent}>
            <div className="max-w-[46rem] space-y-4 text-[1.08rem] leading-relaxed text-ink-soft">
              {s.tldr.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <dl className="mt-8 grid gap-x-8 gap-y-6 rounded-[16px] bg-paper-2/80 p-6 sm:grid-cols-2 sm:p-7">
              {[
                ['my role', fact('worked as')],
                ['timeline', fact('when')],
                ['built at', fact('built at')],
                ['tools', fact('tools')],
                ['learned', fact('learned')],
                ['recognition', fact('award')],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-faint">{k}</dt>
                    <dd className="mt-1.5 text-[1rem] leading-snug text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
          </Section>

          {/* where it started */}
          <Section id="origin" label="where it started" accent={p.accent}>
            <Reveal>
              <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_260px] md:items-start">
                <div className="space-y-4 text-[1.08rem] leading-relaxed text-ink-soft">
                  {s.origin.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
                <img src={p.hero} alt={`${p.title} main screen`} className="hidden w-full rounded-[16px] md:block" loading="lazy" />
              </div>
              <blockquote className="relative mt-10 border-l-2 pl-6" style={{ borderColor: p.accent }}>
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-faint">so we asked</p>
                <p className="serif-i mt-2 text-balance text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] text-ink">{p.challenge}</p>
              </blockquote>
            </Reveal>
          </Section>

          {/* questions */}
          <Section id="questions" label="questions that guided us" accent={p.accent}>
            <ol className="grid gap-4 sm:grid-cols-3">
              {s.questions.map((q, i) => (
                <Reveal key={q} delay={i * 0.06}>
                  <li className="relative h-full rounded-[16px] border border-line bg-paper p-5">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full font-serif text-[1.1rem] italic text-white"
                      style={{ background: p.accent }}
                      aria-hidden
                    >
                      ?
                    </span>
                    <p className="mt-4 text-[1rem] leading-snug text-ink">{q}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="serif-i text-[1.35rem] text-ink">what we set out to do</p>
                <ul className="mt-2 space-y-2">
                  {p.goals.map((g) => (
                    <li key={g} className="flex gap-3 text-[0.96rem] leading-relaxed text-ink-soft">
                      <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* process */}
          <Section id="process" label="process" accent={p.accent}>
            <ProcessBoard project={p} />
          </Section>

          {/* decisions */}
          <Section id="decisions" label="key decisions" accent={p.accent}>
            <ol className="divide-y divide-line border-y border-line">
              {s.decisions.map((d, i) => (
                <Reveal key={d.question}>
                  <li className="grid gap-4 py-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10">
                    <div className="flex gap-4">
                      <span className="font-mono text-[0.72rem] text-ink-faint">0{i + 1}</span>
                      <p className="serif-i text-[1.45rem] leading-[1.2] text-ink">{d.question}</p>
                    </div>
                    <div>
                      <p className="flex items-start gap-2 text-[1.02rem] font-medium leading-snug text-ink">
                        <span className="mt-[2px] text-[0.9rem]" style={{ color: p.accent }} aria-hidden>
                          →
                        </span>
                        {d.choice}
                      </p>
                      <p className="mt-2 text-[0.96rem] leading-relaxed text-ink-soft">{d.why}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Section>

          {/* prototype */}
          <Section id="prototype" label="try the prototype" accent={p.accent}>
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="serif-i text-[clamp(1.9rem,3.6vw,2.8rem)] leading-none text-ink">{p.prototype.title}</h2>
              <p className="max-w-xs font-mono text-[0.72rem] leading-relaxed text-ink-soft">{p.prototype.hint}</p>
            </div>
            <Reveal>{PROTOTYPES[p.prototype.key]()}</Reveal>
            <p className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.68rem] text-ink-faint">
              <span>rebuilt in code from my Figma designs · demo data</span>
              {p.links[0] && (
                <a href={p.links[0].href} target="_blank" rel="noreferrer" className="link-draw text-ink-soft hover:text-ink">
                  open the original Figma prototype ↗
                </a>
              )}
            </p>
          </Section>

          {/* final product */}
          <Section id="final" label="final product" accent={p.accent}>
            <Reveal>
              <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <img src={p.feature.image} alt={`${p.feature.name} feature screens`} className="w-full rounded-[18px] bg-paper-2" loading="lazy" />
                <div>
                  <h3 className="serif-i text-[2.2rem] leading-none text-ink">{p.feature.name}</h3>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{p.feature.body}</p>
                  <ul className="mt-5 space-y-2">
                    {p.achieved.map((a) => (
                      <li key={a} className="flex gap-3 text-[0.94rem] leading-relaxed text-ink-soft">
                        <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {p.links.map((l, i) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`mono-label group inline-flex items-center gap-2 rounded-full px-5 py-3 transition ${
                          i === 0 ? 'bg-ink text-paper hover:bg-ink-soft' : 'border border-line bg-paper text-ink hover:border-ink'
                        }`}
                      >
                        {l.label}
                        <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {p.gallery.map((g, i) => (
                <Reveal key={g.image} delay={i * 0.06}>
                  <figure className="group">
                    <div className={`overflow-hidden rounded-[16px] ${g.tall ? 'px-[14%] py-6' : 'px-4 py-5'}`} style={{ background: p.tint }}>
                      <img
                        src={g.image}
                        alt={g.caption}
                        className="mx-auto w-full drop-shadow-[0_14px_16px_rgba(30,40,60,.25)] transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="mt-2.5 text-center font-mono text-[0.72rem] text-ink-soft">{g.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* reflections */}
          <Section id="reflections" label="reflections" accent={p.accent}>
            <ul className="space-y-4">
              {s.reflections.map((r) => (
                <li key={r} className="flex gap-4 text-[1.08rem] leading-relaxed text-ink-soft">
                  <span className="serif-i text-[1.5rem] leading-none" style={{ color: p.accent }} aria-hidden>
                    ✦
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <a
            href={`#case-${next.slug}`}
            onClick={(e) => {
              e.preventDefault()
              onOpen(next.slug)
            }}
            className="group mt-24 block border-t border-line pt-10"
          >
            <p className="mono-label text-ink-faint">next project</p>
            <p className="serif-i mt-3 text-[clamp(2.2rem,5vw,4rem)] leading-none text-ink transition-colors group-hover:text-ink-soft">
              {next.title} <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
            </p>
          </a>
        </article>
      </div>
    </motion.main>
  )
}
