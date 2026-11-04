/**
 * ✎ "Other things I've made" — graphics and posters on the home page.
 * Put images in /public/designs/ and add an entry. Several images = a carousel.
 */
export type Design = {
  id: string
  title: string
  org: 'WiDS@UBC' | 'Arts Undergraduate Society' | string
  kind: string
  images: string[]
  alt: string
}

export const designs: Design[] = [
  {
    id: 'wids-hiring',
    title: 'We’re Hiring!',
    org: 'WiDS@UBC',
    kind: 'recruitment carousel',
    images: ['designs/wids-hiring-1.webp', 'designs/wids-hiring-2.webp'],
    alt: 'WiDS@UBC recruitment post on a denim and star background, with team photos on a film strip and a list of open roles',
  },
  {
    id: 'aus-brushes',
    title: 'Brushes & Brownies',
    org: 'Arts Undergraduate Society',
    kind: 'event poster',
    images: ['designs/aus-brushes-brownies.webp'],
    alt: 'Purple illustrated poster of an easel, brownies and a painted tote bag for the Brushes & Brownies event',
  },
  {
    id: 'wids-workshops',
    title: 'DataFest Workshops',
    org: 'WiDS@UBC',
    kind: 'event poster',
    images: ['designs/wids-datafest-workshops.webp'],
    alt: 'Collage poster with torn paper, a calculator and earphones announcing Intro to Data Analysis and Intro to Machine Learning workshops',
  },
  {
    id: 'wids-bag',
    title: 'What’s in my Bag!',
    org: 'WiDS@UBC',
    kind: 'event poster',
    images: ['designs/wids-datafest-bag.webp'],
    alt: 'DataFest 2026 poster of a wire basket holding a laptop, headphones, a watch and a poppi can',
  },
  {
    id: 'aus-arts-week',
    title: 'Arts Week Giveaway',
    org: 'Arts Undergraduate Society',
    kind: 'giveaway post',
    images: ['designs/aus-arts-week-giveaway.webp'],
    alt: 'Lilac Arts Week 2026 × After Hours giveaway post with a prize basket, ribbons for 1st to 4th place and paper planes',
  },
  {
    id: 'wids-meet-teams',
    title: 'Meet the Teams',
    org: 'WiDS@UBC',
    kind: 'social post',
    images: ['designs/wids-meet-the-teams.webp'],
    alt: 'Blue scrapbook-style clipboard collage with denim stars, keys and a travel licence introducing the WiDS@UBC 2025/26 teams',
  },
  {
    id: 'aus-student-at-large',
    title: 'Run for Student-At-Large',
    org: 'Arts Undergraduate Society',
    kind: 'election poster',
    images: ['designs/aus-student-at-large.webp'],
    alt: 'Purple collage poster with lockers, a binder clip and megaphones encouraging students to run for AUS Council Student-At-Large',
  },
  {
    id: 'aus-vision-board',
    title: 'Vision Board Night',
    org: 'Arts Undergraduate Society',
    kind: 'event poster',
    images: ['designs/aus-vision-board-night.webp'],
    alt: 'Illustrated corkboard poster with money, a passport, scissors and a rainbow for a financial-future vision board night',
  },
  {
    id: 'aus-program-rep',
    title: 'Be a Program Rep!',
    org: 'Arts Undergraduate Society',
    kind: 'recruitment post',
    images: ['designs/aus-program-rep.webp'],
    alt: 'Grid-paper notebook collage with a podium and torn paper banner inviting students to be an AUS program representative',
  },
]
