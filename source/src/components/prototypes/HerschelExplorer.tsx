import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const COLOURS: Record<string, { name: string; hex: string }> = {
  navy: { name: 'midnight', hex: '#0b2a63' },
  forest: { name: 'forest', hex: '#2f5a3b' },
  blush: { name: 'dusty rose', hex: '#b9677f' },
  sky: { name: 'sky', hex: '#2f78c4' },
  cocoa: { name: 'espresso', hex: '#4a3328' },
}

type Hotspot = { x: number; y: number; title: string; body: string }
const PACK_SPOTS: Hotspot[] = [
  { x: 62, y: 20, title: 'hooks for personalization', body: 'Clip on custom keychains and charms: the pack becomes yours.' },
  { x: 84, y: 58, title: 'water holder', body: 'A side sleeve that keeps a bottle upright on the move.' },
  { x: 38, y: 34, title: 'recycled polyester', body: 'Durable, environmentally conscious fabric.' },
  { x: 30, y: 64, title: 'lots of pockets', body: 'Organized storage for all your essentials, including a laptop sleeve.' },
]

const PRODUCTS = [
  { id: 'wander', name: 'Wander Backpack', img: 'screens/prod-1.webp', colours: ['navy', 'forest', 'blush', 'sky'], blurb: 'The everyday base: city in the morning, trail by the afternoon.', spots: PACK_SPOTS },
  { id: 'roam', name: 'Wander Backpack Roam', img: 'screens/prod-2.webp', colours: ['navy', 'forest', 'blush', 'sky'], blurb: 'Adds a roll-out bottom compartment for spontaneous overnights.', spots: [...PACK_SPOTS.slice(0, 2), { x: 46, y: 84, title: '“ascend” modification', body: 'An expandable base compartment for extra gear.' }] },
  { id: 'ascend', name: 'Wander Backpack Ascend', img: 'screens/prod-3.webp', colours: ['navy', 'forest', 'blush', 'sky'], blurb: 'A front stash pocket and back support for longer days out.', spots: [...PACK_SPOTS.slice(0, 2), { x: 52, y: 74, title: 'front stash pocket', body: 'Quick access for maps, snacks and tickets.' }] },
  { id: 'keychain', name: 'Wander Keychain', img: 'screens/prod-4.webp', colours: ['blush', 'forest', 'cocoa', 'sky'], blurb: 'A carabiner charm made to hang off the personalization hooks.', spots: [] },
  { id: 'bottle', name: 'Wander Water Bottle Bag', img: 'screens/prod-5.webp', colours: ['blush', 'forest', 'sky'], blurb: 'A netted carrier that clips onto any strap.', spots: [] },
  { id: 'enamel', name: 'Wander Enamel Keychain', img: 'screens/prod-6.webp', colours: ['sky'], blurb: '“The Herschel Supply Co.” in a little enamel mountain.', spots: [] },
]

export function HerschelExplorer() {
  const [pid, setPid] = useState('wander')
  const product = PRODUCTS.find((p) => p.id === pid)!
  const [colour, setColour] = useState('navy')
  const [spot, setSpot] = useState<number | null>(0)
  const c = product.colours.includes(colour) ? colour : product.colours[0]

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[#0b1a3d] font-sans text-white shadow-[0_30px_60px_-36px_rgba(10,20,60,.7)]">
      <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* big product */}
        <div>
          <div className="relative mx-auto aspect-[600/756] w-full max-w-[420px] overflow-hidden rounded-[16px] transition-colors duration-500" style={{ background: COLOURS[c].hex }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={product.id}
                src={product.img}
                alt={`${product.name} sketch`}
                className="absolute inset-0 h-full w-full object-cover mix-blend-screen [filter:grayscale(1)_contrast(1.5)_brightness(.85)]"
                initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.45 }}
                draggable={false}
              />
            </AnimatePresence>
            {product.spots.map((s, i) => (
              <button
                key={product.id + i}
                type="button"
                onClick={() => setSpot(spot === i ? null : i)}
                aria-label={s.title}
                aria-expanded={spot === i}
                className="absolute z-10 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                <span className="absolute h-7 w-7 animate-ping rounded-full bg-white/40" />
                <span className={`relative h-3.5 w-3.5 rounded-full border-2 border-white ${spot === i ? 'bg-white' : 'bg-[#f2c46d]'}`} />
              </button>
            ))}
            <AnimatePresence>
              {spot !== null && product.spots[spot] && (
                <motion.div
                  key={product.id + spot}
                  className="absolute inset-x-3 bottom-3 z-20 rounded-[12px] bg-white/95 p-3 text-[#0b1a3d] shadow-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  <p className="font-serif text-[1.15rem] italic leading-none">{product.spots[spot].title}</p>
                  <p className="mt-1 text-[0.8rem] leading-snug text-[#3b4a6b]">{product.spots[spot].body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            {product.colours.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setColour(k)}
                aria-label={`${COLOURS[k].name} colourway`}
                aria-pressed={c === k}
                className={`h-7 w-7 rounded-full border-2 transition ${c === k ? 'scale-110 border-white' : 'border-white/30 hover:border-white/70'}`}
                style={{ background: COLOURS[k].hex }}
              />
            ))}
            <span className="ml-1 font-mono text-[0.72rem] text-white/70">{COLOURS[c].name}</span>
          </div>
        </div>

        {/* product line */}
        <div className="min-w-0">
          <p className="font-serif text-[2.2rem] italic leading-none">Wander</p>
          <p className="text-[0.85rem] text-white/70">by Herschel · the new product line</p>
          <AnimatePresence mode="wait">
            <motion.p key={product.id} className="mt-4 min-h-[3em] text-[0.95rem] leading-relaxed text-white/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {product.blurb}
            </motion.p>
          </AnimatePresence>
          <ul className="mt-5 grid grid-cols-3 gap-2.5">
            {PRODUCTS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setPid(p.id)
                    setSpot(p.spots.length ? 0 : null)
                  }}
                  aria-pressed={pid === p.id}
                  className={`group block w-full overflow-hidden rounded-[10px] border text-left transition ${
                    pid === p.id ? 'border-white' : 'border-white/15 hover:border-white/50'
                  }`}
                >
                  <span className="block aspect-[600/756] overflow-hidden">
                    <img src={p.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </span>
                  <span className="block px-2 py-1.5 text-[0.62rem] leading-tight text-white/85">{p.name.replace('Wander ', '')}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-[0.68rem] leading-relaxed text-white/55">tap the glowing dots on the backpacks · switch colourways below the sketch</p>
        </div>
      </div>
    </div>
  )
}
