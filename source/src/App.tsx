import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig, useReducedMotion } from 'motion/react'
import { Entrance } from './components/Entrance'
import { Iris } from './components/Iris'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { About } from './components/About'
import { Pegboard } from './components/Pegboard'
import { Ticker } from './components/Ticker'
import { OtherWork } from './components/OtherWork'
import { Footer } from './components/Footer'
import { CameraGallery } from './components/CameraGallery'
import { ProjectDetail } from './components/ProjectDetail'
import { Cursor } from './components/Cursor'
import { useHashRoute } from './hooks/useHashRoute'
import { GalleryContext, type GalleryApi, type GalleryOrigin } from './lib/gallery'

type Stage = 'entrance' | 'iris' | 'site'

export default function App() {
  const route = useHashRoute()
  const reduce = useReducedMotion()
  const skipIntro = route.name !== 'home' || new URLSearchParams(window.location.search).has('skip')
  const [stage, setStage] = useState<Stage>(skipIntro ? 'site' : 'entrance')
  const [exitMode, setExitMode] = useState<'camera' | 'skip'>('camera')
  const [gallery, setGallery] = useState<{ origin: GalleryOrigin; index: number } | null>(null)
  const savedScroll = useRef(0)
  const pendingSection = useRef<string | null>(null)
  const heroDelay = useRef(skipIntro ? 0.15 : 0.55)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // lock scroll during the intro
  useEffect(() => {
    if (stage === 'site') return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [stage])

  const enter = (mode: 'camera' | 'skip') => {
    setExitMode(mode)
    if (mode === 'skip' || reduce) {
      heroDelay.current = 0.35
      setStage('site')
    } else {
      setStage('iris')
    }
  }

  const galleryApi = useMemo<GalleryApi>(() => ({ open: (origin, index = 0) => setGallery({ origin, index }) }), [])
  const closeGallery = useCallback(() => setGallery(null), [])

  const openProject = (slug: string) => {
    if (route.name === 'home') {
      savedScroll.current = window.scrollY
    }
    window.location.hash = `case-${slug}`
  }

  const goHome = (section?: string) => {
    pendingSection.current = section ?? null
    if (route.name === 'about') savedScroll.current = 0
    window.location.hash = ''
  }

  // restore scroll / jump to a section when returning home
  useLayoutEffect(() => {
    if (route.name !== 'home') return
    const id = pendingSection.current
    pendingSection.current = null
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }))
    } else if (savedScroll.current) {
      window.scrollTo({ top: savedScroll.current, behavior: 'instant' })
    }
  }, [route])

  const openAbout = () => {
    if (route.name === 'home') savedScroll.current = window.scrollY
    if (route.name === 'about') window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    else window.location.hash = 'about'
  }

  const onSection = (id: string) => {
    if (id === 'about') return openAbout()
    if (route.name !== 'home') return goHome(id)
    if (id === 'top') window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <MotionConfig reducedMotion="user">
      <GalleryContext.Provider value={galleryApi}>
        <LayoutGroup>
          {stage !== 'entrance' && (
            <div className="graph-paper paper-grain min-h-screen">
              <Nav onSection={onSection} current={route.name} />
              {route.name === 'home' ? (
                <main>
                  <Hero delay={heroDelay.current} cameraAway={gallery?.origin === 'hero'} />
                  <Ticker />
                  <Projects onOpen={openProject} />
                  <OtherWork />
                </main>
              ) : route.name === 'about' ? (
                <AboutPage />
              ) : (
                <ProjectDetail slug={route.slug} onBack={() => goHome()} onOpen={openProject} />
              )}
              <Footer />
            </div>
          )}

          <AnimatePresence>
            {gallery && <CameraGallery key="gallery" origin={gallery.origin} startIndex={gallery.index} onClose={closeGallery} />}
          </AnimatePresence>
        </LayoutGroup>

        <AnimatePresence custom={exitMode}>
          {stage === 'entrance' && <Entrance key="entrance" onEnter={() => enter('camera')} onSkip={() => enter('skip')} />}
        </AnimatePresence>
        {stage === 'iris' && <Iris onDone={() => setStage('site')} />}
        <Cursor />
      </GalleryContext.Provider>
    </MotionConfig>
  )
}

function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = 'About — Delia Zhang'
    return () => {
      document.title = 'Delia Zhang — 张蕊舒'
    }
  }, [])
  return (
    <main className="pt-10 md:pt-12">
      <About />
      <Pegboard />
    </main>
  )
}
