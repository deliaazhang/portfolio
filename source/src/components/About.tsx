import { useState } from 'react'
import { motion } from 'motion/react'
import { SectionLabel } from './Projects'
import { Doodle, type DoodleName } from './Doodles'
import { experience, education, skills } from '../data/resume'

/** ✎ Edit your interests + "currently" notes here. */
const interests: { title: string; serif: string; note: string; doodle: DoodleName }[] = [
  { title: 'Photography', serif: '& travelling', note: 'always carrying a camera, just in case', doodle: 'postcard' },
  { title: 'Design', serif: '& creativity', note: 'making things feel just right', doodle: 'bezier' },
  { title: 'Data', serif: '& patterns', note: 'the story hiding in the numbers', doodle: 'chart' },
  { title: 'Cafés', serif: '& new foods', note: 'will cross the city for good matcha', doodle: 'cup' },
  { title: 'Learning', serif: '& perspectives', note: 'curious how everyone sees the world', doodle: 'heart' },
]

const currently = [
  ['studying', 'Cognitive Systems + Data Science @ UBC'],
  ['leading', 'logistics @ UBC UX Hub, VP Internal @ WiDS'],
  ['drinking', 'iced matcha latte, obviously'],
]

const snapshots = [
  { src: 'photos/delia.webp', alt: 'Delia in a white dress', note: 'hi, it’s me!', cls: 'left-0 top-3 -rotate-6' },
  { src: 'photos/sketch-1.webp', alt: 'Delia’s pencil portrait of an older man with a beard', note: 'recent sketch', cls: 'left-[32%] top-0 rotate-[4deg]' },
  { src: 'photos/sketch-2.webp', alt: 'Delia’s pencil portrait of a young man', note: 'and another', cls: 'left-[63%] top-5 -rotate-2' },
]

const ease = [0.2, 0.7, 0.2, 1] as const

function Row({ item, i }: { item: (typeof interests)[number]; i: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.li
      className="group relative flex items-center gap-4 border-t border-line py-5 sm:gap-8 sm:py-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, delay: i * 0.07, ease }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <span className="w-8 shrink-0 font-mono text-[0.72rem] text-ink-faint">0{i + 1}</span>
      <p className="flex-1 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-none tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2">
        {item.title} <span className="serif-i text-ink-soft">{item.serif}</span>
      </p>
      <p className="hidden max-w-[14rem] text-right font-mono text-[0.8rem] leading-snug text-ink-soft sm:block">{item.note}</p>
      <span className="h-12 w-12 shrink-0 text-sage-deep">
        {hover ? <Doodle name={item.doodle} size={48} /> : <Doodle name={item.doodle} size={48} draw={false} className="opacity-40" />}
      </span>
    </motion.li>
  )
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-24 sm:px-10 md:pb-20 md:pt-32">
      <SectionLabel index="01">about</SectionLabel>

      <div className="mt-10 grid gap-14 md:grid-cols-12 md:gap-10">
        <motion.h2
          className="display text-[clamp(2.3rem,5.2vw,5rem)] leading-[1] md:col-span-7"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease }}
        >
          I’m a designer who loves <span className="serif-i">data</span>, and a data person who can’t stop{' '}
          <span className="serif-i">designing.</span>
        </motion.h2>

        <div className="relative md:col-span-5 md:pt-3">
          <p className="text-[1.08rem] leading-relaxed text-ink-soft">
            I’m a UX/UI designer studying Cognitive Systems with a minor in Data Science at UBC. I love making digital
            products that feel simple and accessible, and I’m most interested in where data and design meet: how we can use
            both to build better experiences.
          </p>
          <p className="mt-4 text-[1.08rem] leading-relaxed text-ink-soft">
            Most of my best ideas start by paying attention to the small stuff. Outside of class you’ll find me running
            events with UBC UX Hub and Women in Data Science, sketching portraits, or hunting down the next great matcha.
          </p>

          {/* taped polaroids */}
          <div className="relative mt-10 h-[230px] sm:h-[260px]">
            {snapshots.map(({ src, alt, note, cls }, i) => (
              <motion.figure
                key={src}
                className={`absolute w-[36%] max-w-[180px] bg-white p-2 pb-8 shadow-[0_14px_30px_-16px_rgba(43,42,39,.45)] ${cls}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease }}
                whileHover={{ y: -6, rotate: 0, scale: 1.04, zIndex: 5 }}
              >
                <span className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-sage-tint/80" />
                <div className="aspect-[4/5] overflow-hidden bg-paper-2">
                  <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" draggable={false} />
                </div>
                <figcaption className="absolute bottom-1.5 left-3 font-mono text-[0.7rem] text-ink-soft">{note}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-8">
          <p className="mono-label mb-4 text-ink-faint">things i love</p>
          <ul className="border-b border-line">
            {interests.map((it, i) => (
              <Row key={it.title} item={it} i={i} />
            ))}
          </ul>
        </div>
        <motion.aside
          className="self-end rounded-[18px] border border-line bg-paper/80 p-6 md:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="mono-label text-ink-faint">right now</p>
          <dl className="mt-4 space-y-3">
            {currently.map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <dt className="w-28 shrink-0 font-mono text-[0.75rem] text-ink-faint">{k}</dt>
                <dd className="text-[0.95rem] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.aside>
      </div>

      {/* experience, education, skills */}
      <div className="mt-24 grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-8">
          <p className="mono-label mb-4 text-ink-faint">experience</p>
          <ul className="border-b border-line">
            {experience.map((x, i) => (
              <motion.li
                key={x.org + x.role}
                className="grid gap-1 border-t border-line py-5 sm:grid-cols-[1fr_auto] sm:gap-x-8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease }}
              >
                <div className="min-w-0">
                  <p className="text-[1.25rem] leading-snug tracking-[-0.02em] text-ink">
                    {x.role} <span className="serif-i text-ink-soft">at {x.org}</span>
                  </p>
                  <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">{x.summary}</p>
                </div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint sm:pt-1.5 sm:text-right">{x.when}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="space-y-12 md:col-span-4">
          <div>
            <p className="mono-label mb-4 text-ink-faint">education</p>
            <ul className="space-y-5">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="text-[1.1rem] leading-snug text-ink">{e.school}</p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{e.detail}</p>
                  <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint">{e.when}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono-label mb-4 text-ink-faint">skills</p>
            <div className="space-y-5">
              {skills.map((g) => (
                <div key={g.group}>
                  <p className="serif-i text-[1.25rem] text-ink">{g.group}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[0.7rem] text-ink-soft">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <a
            href="resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="mono-label group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-paper transition hover:bg-ink-soft"
          >
            full resume <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
