import type { Project } from '../data/projects'

/** Project cover image (cropped from the portfolio deck). */
export function ProjectThumb({ project }: { project: Project }) {
  return (
    <img
      src={project.thumb}
      alt={`${project.title} — ${project.category}`}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-full w-full bg-[#dde1e8] object-cover"
    />
  )
}
