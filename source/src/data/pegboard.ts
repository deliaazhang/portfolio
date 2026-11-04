/**
 * ✎ The pegboard on the About page — edit freely.
 *
 * Every item has:
 *   d / m  → position on desktop / mobile, as % of the board: x, y = where it's attached, w = width
 *            (set `m: null` to hide an item on phones)
 *   mount  → how it's attached: 'hang' (on a peg) · 'clip' (pegged to the string) · 'pin' · 'tape'
 *            · 'stand' (sits on the shelf) · 'rest' (lies across two pegs)
 *   title + note → shown in the little card when someone clicks it
 *
 * For real photos: put them in /public/photos/ and set `src: 'photos/your-photo.jpg'`.
 */
import type { Pic } from './photos'

export type Mount = 'hang' | 'clip' | 'pin' | 'tape' | 'stand' | 'rest'
export type Pos = { x: number; y: number; w: number }
export type KeychainVariant = 'matcha' | 'camera' | 'bear' | 'nametag'

type Base = {
  id: string
  mount: Mount
  d: Pos
  m: Pos | null
  rotate?: number
  title: string
  note: string
}

export type PegItem = Base &
  (
    | { kind: 'polaroid'; photo: Pic; caption: string }
    | { kind: 'photocard'; member: string; colors: [string, string] }
    | { kind: 'lightstick' }
    | { kind: 'ticket'; event: string; detail: string; seat: string }
    | { kind: 'keychain'; variant: KeychainVariant }
    | { kind: 'postcard'; photo: Pic; from: string }
    | { kind: 'note'; heading: string; lines: string[] }
    | { kind: 'album'; name: string; artist: string; colors: [string, string] }
    | { kind: 'plush' }
    | { kind: 'frame'; photo: Pic }
    | { kind: 'matcha' }
  )


export const pegItems: PegItem[] = [
  // ── polaroids on the string ─────────────────────
  {
    id: 'pola-1', kind: 'polaroid', mount: 'clip', rotate: -6,
    d: { x: 11, y: 10.5, w: 10.5 }, m: { x: 14, y: 4.5, w: 22 },
    photo: { src: 'pegboard/sunset-girls.webp', alt: 'Delia and four friends smiling at a sunset patio by the water', scene: 'friends', colors: ['#f6e3d3', '#e8b8ad', '#8fa284'] },
    caption: 'my girls ♡',
    title: 'my girls', note: 'Sunset, good company and everyone talking at once. My favourite kind of evening.',
  },
  {
    id: 'pola-2', kind: 'polaroid', mount: 'clip', rotate: 4,
    d: { x: 23.5, y: 13, w: 10.5 }, m: { x: 38, y: 5.5, w: 22 },
    photo: { src: 'pegboard/nagocha-matcha.webp', alt: 'Iced matcha in a ceramic bowl on a wooden tray at Nagocha', scene: 'matcha', colors: ['#e9dcc6', '#c79f78', '#7b5a43'] },
    caption: 'matcha hunting',
    title: 'matcha hunting', note: 'Iced matcha in a bowl at Nagocha. Always on the search for the next good matcha spot.',
  },
  {
    id: 'pola-3', kind: 'polaroid', mount: 'clip', rotate: -3,
    d: { x: 36, y: 13.5, w: 10.5 }, m: { x: 62, y: 5.5, w: 22 },
    photo: { src: 'pegboard/hoi-an-boat.webp', alt: 'Delia and a friend in conical hats in a basket boat in Hoi An', scene: 'friends', colors: ['#2f3446', '#c4a7e0', '#8ea7c6'] },
    caption: 'hoi an',
    title: 'hoi an', note: 'Basket boat ride in Hoi An, conical hats and all.',
  },
  {
    id: 'pola-4', kind: 'polaroid', mount: 'clip', rotate: 5,
    d: { x: 48.5, y: 11.5, w: 10.5 }, m: { x: 86, y: 4.5, w: 22 },
    photo: { src: 'pegboard/ha-giang-road.webp', alt: 'A motorbike on a winding road through green mountains in Ha Giang', scene: 'sunset', colors: ['#f6c89a', '#e58e73', '#8b6d8f'] },
    caption: 'ha giang loop',
    title: 'ha giang loop', note: 'Mountains on every side and the road winding through them.',
  },

  // ── k-pop corner ────────────────────────────────
  {
    id: 'pc-1', kind: 'photocard', mount: 'hang', rotate: -3,
    d: { x: 67, y: 7, w: 8 }, m: { x: 15, y: 19.5, w: 17 },
    member: 'ZEROBASEONE', colors: ['#cfe0f5', '#b9a6e3'],
    title: 'ZEROBASEONE', note: '',
  },
  {
    id: 'pc-2', kind: 'photocard', mount: 'hang', rotate: 2,
    d: { x: 77, y: 7, w: 8 }, m: { x: 37, y: 19.5, w: 17 },
    member: 'BOYNEXTDOOR', colors: ['#c7dcf0', '#e6eef9'],
    title: 'BOYNEXTDOOR', note: '',
  },
  {
    id: 'pc-3', kind: 'photocard', mount: 'hang', rotate: -1.5,
    d: { x: 87, y: 7, w: 8 }, m: { x: 59, y: 19.5, w: 17 },
    member: 'AND2BLE', colors: ['#f3c9d6', '#cfe0f5'],
    title: 'AND2BLE', note: '',
  },
  {
    id: 'lightstick', kind: 'lightstick', mount: 'rest', rotate: -9,
    d: { x: 15, y: 47, w: 21 }, m: { x: 44, y: 39.5, w: 62 },
    title: 'my lightstick', note: '[Edit me] Fully charged and ready for the next concert. Click it on the board to turn it on.',
  },
  {
    id: 'ticket', kind: 'ticket', mount: 'pin', rotate: 3,
    d: { x: 70, y: 44, w: 16 }, m: { x: 56, y: 46.5, w: 58 },
    event: 'BTS', detail: 'WORLD TOUR · TORONTO', seat: 'SEC A · ROW 12 · SEAT 7',
    title: 'bts world tour', note: 'BTS world tour in Toronto. Lightstick fully charged, voice fully gone.',
  },
  {
    id: 'album', kind: 'album', mount: 'stand', rotate: -4,
    d: { x: 60, y: 91.5, w: 11 }, m: { x: 72, y: 96.8, w: 24 },
    name: 'GUTS', artist: 'olivia rodrigo', colors: ['#d9c8f0', '#b79be0'],
    title: 'GUTS — olivia rodrigo', note: 'Olivia Rodrigo’s GUTS, on repeat.',
  },

  // ── keychains ──────────────────────────────────
  {
    id: 'kc-matcha', kind: 'keychain', variant: 'matcha', mount: 'hang', rotate: -4,
    d: { x: 33, y: 41, w: 5 }, m: { x: 13, y: 58, w: 12 },
    title: 'matcha keychain', note: '[Edit me] Obviously. It goes everywhere with me.',
  },
  {
    id: 'kc-camera', kind: 'keychain', variant: 'camera', mount: 'hang', rotate: 3,
    d: { x: 40, y: 41, w: 5.6 }, m: { x: 32, y: 58, w: 13 },
    title: 'mini camera', note: '[Edit me] A tiny version of my real camera.',
  },
  {
    id: 'kc-bear', kind: 'keychain', variant: 'bear', mount: 'hang', rotate: -2,
    d: { x: 47, y: 41, w: 5.4 }, m: { x: 51, y: 58, w: 13 },
    title: 'plush bear charm', note: '[Edit me] Won this from a claw machine on the 11th try.',
  },
  {
    id: 'kc-name', kind: 'keychain', variant: 'nametag', mount: 'hang', rotate: 4,
    d: { x: 54, y: 41, w: 4.6 }, m: { x: 70, y: 58, w: 11 },
    title: '张蕊舒', note: '[Edit me] My Chinese name on a little acrylic tag.',
  },

  // ── everything else ────────────────────────────
  {
    id: 'postcard', kind: 'postcard', mount: 'pin', rotate: 5,
    d: { x: 88.5, y: 46, w: 13 }, m: { x: 83, y: 27, w: 28 },
    photo: { alt: 'Illustrated pastel postcard of the New York skyline with the Empire State Building and the Statue of Liberty', scene: 'newyork', colors: ['#f6dfe4', '#c9d8ee', '#8ea7c6'] },
    from: 'new york',
    title: 'greetings from new york', note: 'A little postcard from New York ♡',
  },
  {
    id: 'pola-5', kind: 'polaroid', mount: 'tape', rotate: -5,
    d: { x: 10, y: 78, w: 10 }, m: { x: 16, y: 78, w: 22 },
    photo: { src: 'pegboard/sunset-lookout.webp', alt: 'Delia looking back over her shoulder at a hilltop sunset above the city', scene: 'sunset', colors: ['#e2e9f2', '#8ea7c6', '#e8b8ad'] },
    caption: 'sunset chaser',
    title: 'sunset chaser', note: 'Climbed up for the view and stayed until the sun went down.',
  },
  {
    id: 'pola-6', kind: 'polaroid', mount: 'tape', rotate: 4,
    d: { x: 22, y: 80, w: 10 }, m: null,
    photo: { src: 'pegboard/paragliding.webp', alt: 'Tandem paragliding high above a town, a river and snowy mountains', scene: 'snow', colors: ['#f4e6d4', '#d98c6a', '#8fa284'] },
    caption: 'paragliding!!',
    title: 'paragliding!!', note: 'Flying over the mountains. Terrifying for about ten seconds, then the best view of my life.',
  },
  {
    id: 'note', kind: 'note', mount: 'pin', rotate: -2,
    d: { x: 37.5, y: 76, w: 16.5 }, m: { x: 43, y: 79, w: 26 },
    heading: 'currently obsessed with',
    lines: ['Never Let Go - LNGSHOT', 'Where the Mask Ends', 'Molly Tea!!'],
    title: 'currently obsessed with', note: 'On repeat: Never Let Go by LNGSHOT. Watching: Where the Mask Ends. Drinking: Molly Tea!!',
  },
  {
    id: 'plush', kind: 'plush', mount: 'stand',
    d: { x: 71, y: 91.5, w: 7 }, m: { x: 91, y: 96.8, w: 13 },
    title: 'shelf buddy', note: '[Edit me] Name, origin story, and how long it has watched over my desk.',
  },
  {
    id: 'matcha', kind: 'matcha', mount: 'stand',
    d: { x: 79.5, y: 91.5, w: 4.6 }, m: null,
    title: 'iced matcha', note: 'Iced, oat milk, less sweet. Always within arm’s reach.',
  },
  {
    id: 'frame', kind: 'frame', mount: 'stand', rotate: 3,
    d: { x: 89, y: 91.5, w: 9 }, m: null,
    photo: { src: 'pegboard/paris-eiffel.webp', alt: 'Delia in front of the Eiffel Tower lit up gold at night', scene: 'city', colors: ['#eef0e2', '#a9bb6c', '#c79f78'] },
    title: 'paris at night', note: 'The Eiffel Tower all lit up. Had to give this one a real frame.',
  },
]
