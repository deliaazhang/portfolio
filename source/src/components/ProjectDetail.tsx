import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { projects, type PrototypeKey } from '../data/projects'
import { ProjectPreview } from './DevicePreview'
import { ProcessBoard } from './ProcessBoard'

const ease = [0.2, 0.7, 0.2, 1] as const
import { ArcTrailMatch } from './prototypes/ArcTrailMatch'
import { RoominateAlerts } from './prototypes/RoominateAlerts'
import { SkintellectFlow } from './prototypes/SkintellectFlow'
import { HerschelExplorer } from './prototypes/HerschelExplorer'

const PROTOTYPES: Record<PrototypeKey, () => ReactNode> = {
  arctrail: () => <ArcTrailMatch />,
  roominate: () => <RoominateAlerts />,
  skintellect: () => <SkintellectFlow />,
  herschel: () => <HerschelExplorer />,
}

function HeroReel({ project }: { project: (typeof projects)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className="relative mt-12 aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-50px_rgba(30,40,60,.6)] sm:aspect-[16/10]"
      style={{ background: project.tint }}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.15, ease }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.7),transparent_62%)]" />
      <ProjectPreview project={project} playing={inView && !reduce} size="hero" />
      <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-soft backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e0554f]" /> live preview · real screens
      </span>
    </motion.div>
  )
}


function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function Label({ n, children }: { n: string; children: string }) {
  return (
    <p className="mono-label flex items-center gap-3 text-ink-soft">
      <span className="text-ink-faint">{n}</span>
      <span className="h-px w-8 bg-ink-faint/50" />
      {children}
    </p>
  )
}

export function ProjectDetail({ slug, onBack, onOpen }: { slug: string; onBack: () => void; onOpen: (slug: string) => void }) {
  const idx = projects.findIndex((p) => p.slug === slug)
  const project = projects[idx]
  const next = projects[(idx + 1) % projects.length]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (project) document.title = `${project.title} — Delia Zhang`
    return () => {
      document.title = 'Delia Zhang — 张蕊舒'
    }
  }, [project])

  if (!project) {
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

  return (
    <motion.main
      key={slug}
      className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 sm:px-10 md:pt-36"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mono-label group mb-12 inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> all work
      </button>

      {/* title */}
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.18em]" style={{ color: p.accent }}>
        {p.category} <span className="text-ink-faint">· {p.event}</span>
      </p>
      <h1 className="display mt-5 text-[clamp(3rem,8vw,7.5rem)]">{p.title}</h1>
      <p className="mt-6 max-w-2xl text-[1.15rem] leading-relaxed text-ink-soft">{p.overview}</p>

      <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 sm:grid-cols-3 lg:grid-cols-6">
        {p.facts.map((f) => (
          <div key={f.label} className="min-w-0">
            <dt className="mono-label text-[0.62rem] text-ink-faint">{f.label}</dt>
            <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>

      <HeroReel project={p} />

      {/* challenge */}
      <section className="mt-20 grid items-center gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <img src={p.hero} alt={`${p.title} — main screen`} className="w-full rounded-[20px] bg-[#dde1e8]" loading="lazy" />
        </Reveal>
        <Reveal className="md:col-span-7" delay={0.1}>
          <Label n="01">the challenge</Label>
          <h2 className="mt-5 text-balance text-[clamp(1.7rem,3.2vw,2.7rem)] leading-[1.12] tracking-[-0.03em] text-ink">{p.challenge}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              ['specific goals', p.goals],
              ['how we achieved it', p.achieved],
            ].map(([h, list]) => (
              <div key={h as string}>
                <p className="serif-i text-[1.5rem] text-ink">{h as string}</p>
                <ul className="mt-3 space-y-3">
                  {(list as string[]).map((g) => (
                    <li key={g} className="flex gap-3 text-[0.98rem] leading-relaxed text-ink-soft">
                      <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* hands-on prototype */}
      <section className="mt-28">
        <Reveal>
          <Label n="02">try the prototype</Label>
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="display text-[clamp(2.2rem,5vw,4rem)]">
              <span className="serif-i">{p.prototype.title}</span>
            </h2>
            <p className="max-w-sm font-mono text-[0.75rem] leading-relaxed text-ink-soft">{p.prototype.hint}</p>
          </div>
        </Reveal>
        <Reveal className="mt-8">{PROTOTYPES[p.prototype.key]()}</Reveal>
        <p className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.7rem] text-ink-faint">
          <span>rebuilt in code from my Figma designs · demo data</span>
          {p.links[0] && (
            <a href={p.links[0].href} target="_blank" rel="noreferrer" className="link-draw text-ink-soft hover:text-ink">
              open the original Figma prototype ↗
            </a>
          )}
        </p>
      </section>

      {/* process */}
      <section className="mt-28">
        <Reveal>
          <Label n="03">design process</Label>
          <h2 className="display mt-5 text-[clamp(2.2rem,5vw,4rem)]">
            from <span className="serif-i">post-its</span> to prototype
          </h2>
        </Reveal>
        <div className="mt-12">
          <ProcessBoard project={p} />
        </div>
      </section>

      {/* key feature */}
      <section className="mt-28 grid items-center gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <img src={p.feature.image} alt={`${p.feature.name} feature screens`} className="w-full rounded-[20px] bg-[#dde1e8]" loading="lazy" />
        </Reveal>
        <Reveal className="md:col-span-5" delay={0.1}>
          <Label n="04">key feature</Label>
          <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.2rem)]">
            <span className="serif-i">{p.feature.name}</span>
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft">{p.feature.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
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
                {i === 0 && <span aria-hidden>▷</span>}
                {l.label}
                <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
                  ↗
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* screens */}
      <section className="mt-28">
        <Reveal>
          <Label n="05">a closer look</Label>
        </Reveal>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {p.gallery.map((g, i) => (
            <Reveal key={g.image} delay={i * 0.08}>
              <figure className="group">
                <div className={`overflow-hidden rounded-[18px] transition-shadow duration-500 group-hover:shadow-[0_24px_40px_-24px_rgba(30,40,60,.5)] ${g.tall ? 'px-[14%] py-7' : 'px-4 py-6'}`} style={{ background: p.tint }}>
                  <img src={g.image} alt={g.caption} className="mx-auto w-full drop-shadow-[0_16px_18px_rgba(30,40,60,.25)] transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-[1.03]" loading="lazy" />
                </div>
                <figcaption className="mt-3 text-center font-mono text-[0.78rem] text-ink-soft">{g.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <a
        href={`#case-${next.slug}`}
        onClick={(e) => {
          e.preventDefault()
          onOpen(next.slug)
        }}
        className="group mt-28 block border-t border-line pt-10"
      >
        <p className="mono-label text-ink-faint">next project</p>
        <p className="display mt-4 text-[clamp(2.2rem,5vw,4.5rem)] transition-colors group-hover:text-ink-soft">
          {next.title} <span className="serif-i inline-block transition-transform group-hover:translate-x-2">→</span>
        </p>
      </a>
    </motion.main>
  )
}
