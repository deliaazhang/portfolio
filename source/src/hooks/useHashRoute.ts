import { useEffect, useState } from 'react'

export type Route = { name: 'home' } | { name: 'about' } | { name: 'project'; slug: string }

function parse(): Route {
  const h = window.location.hash
  if (h === '#about') return { name: 'about' }
  const m = h.match(/^#case-([\w-]+)/)
  return m ? { name: 'project', slug: m[1] } : { name: 'home' }
}

/** Tiny hash router: `#about` is the about page, `#case-<slug>` opens a case study, anything else is home. */
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
