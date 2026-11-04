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
    id: 'film-matcha',
    src: 'photos/film-matcha.webp',
    alt: 'Film photo of Delia in a white top, smiling and holding an iced matcha',
    caption: 'hi, it’s me! iced matcha in hand, as always 🍵',
    location: 'the usual spot',
    scene: 'matcha',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'braids',
    src: 'photos/delia-braids.webp',
    alt: 'Delia with two braids and a brown top, sitting on a step on a quiet street',
    caption: 'braid day ♡',
    location: 'little side street',
    scene: 'city',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'matcha-cafe',
    src: 'photos/delia-matcha.webp',
    alt: 'Delia sitting by a café window holding an iced matcha',
    caption: 'window seat, good light, another matcha. zero regrets',
    location: 'café hopping',
    scene: 'cafe',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'boats',
    src: 'photos/film-boats.webp',
    alt: 'Round green basket boats on a river lined with palm trees',
    caption: 'basket boats + palm trees = the best morning',
    location: 'out on the water',
    scene: 'sunset',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'friend',
    src: 'photos/film-friend.webp',
    alt: 'Delia and a friend posing under palm trees beside green fields',
    caption: 'sunny day, good company ☀️',
    location: 'somewhere green',
    scene: 'flower',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'fog',
    src: 'photos/film-fog.webp',
    alt: 'Delia and four friends on a misty lookout wall, surrounded by fog',
    caption: 'we climbed all the way up for… fog. still worth it',
    location: 'up in the clouds',
    scene: 'snow',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'mountains',
    src: 'photos/film-mountains.webp',
    alt: 'Delia and friends grouped by a stone wall above a green mountain valley',
    caption: 'my travel crew. couldn’t have asked for better people ♡',
    location: 'the mountains',
    scene: 'snow',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
]
