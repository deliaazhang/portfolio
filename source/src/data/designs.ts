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
]
