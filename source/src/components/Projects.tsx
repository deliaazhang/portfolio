import { useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { projects, type Project } from '../data/projects'
import { usePreviewPlaying } from './DevicePreview'
import { VideoPreview } from './VideoPreview'

export function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <p className="mono-label flex items-center gap-3 text-ink-soft">
      <span className="text-ink-faint">{index}</span>
      <span className="h-px w-8 bg-ink-faint/50" />
      {children}
    </p>
  )
}

function ProjectCard({ project, i, onOpen }: { project: Project; i: number; onOpen: (slug: string) => void }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hover, setHover] = useState(false)
  const { ref: previewRef, playing, bind } = usePreviewPlaying()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 400, damping: 32 })
  const sy = useSpring(my, { stiffness: 400, damping: 32 })

  const move = (e: PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <a
        ref={ref}
        href={`#case-${project.slug}`}
        onClick={(e) => {
          e.preventDefault()
          onOpen(project.slug)
        }}
        onPointerEnter={(e) => {
          setHover(true)
          bind.onPointerEnter(e)
        }}
        onPointerLeave={(e) => {
          setHover(false)
          bind.onPointerLeave(e)
        }}
        onFocus={bind.onFocus}
        onBlur={bind.onBlur}
        onPointerMove={move}
        className="group block"
        aria-label={`${project.title} — ${project.category}, ${project.year}. View project`}
      >
        <div
          ref={(el) => {
            previewRef.current = el
          }}
          className="relative aspect-[16/11] overflow-hidden rounded-[18px] shadow-[0_1px_0_rgba(255,255,255,.8)_inset,0_20px_40px_-28px_rgba(43,42,39,.4)]"
          style={{ background: project.tint }}
        >
          <VideoPreview project={project} playing={playing} />
          {/* cursor-following label (desktop) */}
          <motion.span
            className="pointer-events-none absolute left-0 top-0 hidden [@media(pointer:fine)]:block"
            style={{ x: sx, y: sy }}
          >
            <motion.span
              className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-paper"
              animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
              transition={{ duration: 0.2 }}
            >
              view project <span aria-hidden>↗</span>
            </motion.span>
          </motion.span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: project.accent }}>
              {project.category} <span className="text-ink-faint">· {project.event}</span>
            </p>
            <h3 className="mt-2 text-[1.55rem] font-normal leading-tight tracking-[-0.02em] text-ink sm:text-[1.8rem]">
              <span className="link-draw">{project.title}</span>
              <span
                className="ml-2 inline-block text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-ink"
                aria-hidden
              >
                →
              </span>
            </h3>
            <p className="mt-2 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">{project.description}</p>
          </div>
          <span className="shrink-0 pt-0.5 font-mono text-[0.75rem] text-ink-faint">{project.year}</span>
        </div>
      </a>
    </motion.article>
  )
}

export function Projects({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section id="work" className="relative mx-auto max-w-[1440px] scroll-mt-16 px-5 py-24 sm:px-10 md:py-36">
      <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="01">selected work</SectionLabel>
          <motion.h2
            className="display mt-6 text-[clamp(2.8rem,6.5vw,6rem)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Projects <span className="serif-i">&amp; patterns</span>
          </motion.h2>
        </div>
        <p className="max-w-xs font-mono text-[0.78rem] leading-relaxed text-ink-soft">
          a collection of my work and projects, from creative ideas to meaningful experiences!
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-16">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} i={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
