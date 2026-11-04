/**
 * ✎ Camera roll — edit freely.
 *
 * To use a real photo: put the file in /public/photos/ and set `src: 'photos/my-photo.jpg'`.
 * While `src` is empty, a little illustrated placeholder (`scene` + `colors`) is drawn instead.
 */
export type Scene = 'cafe' | 'matcha' | 'sunset' | 'city' | 'flower' | 'snow' | 'desk' | 'dinner' | 'friends' | 'newyork'

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
    id: 'valley',
    src: 'photos/film-valley.webp',
    alt: 'Film photo of green mountains and trees under a cloudy sky',
    caption: 'no filter needed. the greenest mountains i’ve ever seen 🌿',
    location: 'the mountains',
    scene: 'snow',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'night-hat',
    src: 'photos/film-night-hat.webp',
    alt: 'Film photo of Delia at night in a white dress and conical hat under string lights and pink flowers',
    caption: 'string lights, pink flowers, conical hat ♡',
    location: 'night walk',
    scene: 'flower',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
  {
    id: 'boats',
    src: 'photos/film-boats.webp',
    alt: 'Round green basket boats on a river lined with palm trees',
    caption: 'basket boat ride in hoi an. palm trees everywhere 🌴',
    location: 'hoi an',
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
    caption: 'ha giang loop with the best travel crew ♡',
    location: 'ha giang',
    scene: 'snow',
    colors: ['#e9dcc6', '#c79f78', '#7b5a43'],
  },
]
