/**
 * ✎ Camera roll — edit freely.
 *
 * To use a real photo: put the file in /public/photos/ and set `src: 'photos/my-photo.jpg'`.
 * While `src` is empty, a little illustrated placeholder (`scene` + `colors`) is drawn instead.
 */
export type Scene = 'cafe' | 'matcha' | 'sunset' | 'city' | 'flower' | 'snow' | 'desk' | 'dinner' | 'friends'

/** Anything that can be shown as a photo: a real image (`src`) or an illustrated placeholder. */
export type Pic = { src?: string; alt: string; scene: Scene; colors: [string, string, string] }

export type Photo = {
  id: string
  src?: string
  alt: string
  /** the little note that pops up like a message */
  caption: string
  /** shown as an orange date stamp, old-camera style */
  date?: string
  location?: string
  scene: Scene
  colors: [string, string, string]
}

export const photos: Photo[] = [
  {
    id: 'me',
    src: 'photos/delia-matcha.webp',
    alt: 'Delia in a white top sitting by a café window, holding an iced matcha',
    caption: 'hi, it’s me! iced matcha in hand, as always 🍵',
    scene: 'city',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'cafe',
    alt: 'Placeholder — a cosy café window seat',
    caption: 'found my new favourite café. window seat, good light, zero regrets ☕',
    date: "'25 03 14",
    location: 'somewhere cosy',
    scene: 'cafe',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'matcha',
    alt: 'Placeholder — an iced matcha latte',
    caption: 'iced matcha count this month: i stopped counting 🍵',
    date: "'25 04 02",
    location: 'the usual spot',
    scene: 'matcha',
    colors: ['#eef0e2', '#a9bb6c', '#6f8547'],
  },
  {
    id: 'sunset',
    alt: 'Placeholder — golden hour over the hills',
    caption: 'golden hour on the walk home. had to stop and take this one.',
    date: "'24 08 21",
    location: 'walk home',
    scene: 'sunset',
    colors: ['#f6c89a', '#e58e73', '#8b6d8f'],
  },
  {
    id: 'city',
    alt: 'Placeholder — streets of a new city',
    caption: 'first day in a new city — got lost on purpose (best way to explore)',
    date: "'24 06 30",
    location: 'travelling',
    scene: 'city',
    colors: ['#d7e2ee', '#8ea7c6', '#4f6d94'],
  },
  {
    id: 'flower',
    alt: 'Placeholder — a tiny flower in the sidewalk',
    caption: 'a tiny flower growing out of the sidewalk. the little things ♡',
    date: "'24 05 09",
    location: 'on the way to class',
    scene: 'flower',
    colors: ['#f3ecdf', '#e8b8ad', '#8fa284'],
  },
  {
    id: 'snow',
    alt: 'Placeholder — snowy mountains on a ski day',
    caption: 'mountain air + questionable ski form = perfect day 🎿',
    date: "'25 01 18",
    location: 'up the mountain',
    scene: 'snow',
    colors: ['#eef3f8', '#b9c9dc', '#6e86a6'],
  },
  {
    id: 'desk',
    alt: 'Placeholder — late night desk with a sketchbook',
    caption: 'late night setup: sketchbook, k-pop playlist, cold matcha',
    date: "'25 02 27",
    location: 'my desk',
    scene: 'desk',
    colors: ['#2f3446', '#f2d49b', '#8fa284'],
  },
  {
    id: 'dinner',
    alt: 'Placeholder — family dinner table',
    caption: 'family dinner — everyone talking at once, as usual ♡',
    date: "'24 12 24",
    location: 'home',
    scene: 'dinner',
    colors: ['#f4e6d4', '#d98c6a', '#8f5b45'],
  },
]
