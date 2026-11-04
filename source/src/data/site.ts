/**
 * ✎ Edit your personal links here.
 * Everything in the nav + footer reads from this file.
 */
export const site = {
  name: 'Delia Zhang',
  chineseName: '张蕊舒',
  email: 'liazhang17@gmail.com',
  linkedin: 'https://www.linkedin.com/in/delia-zhang',
  github: 'https://github.com/deliaazhang', // ← guessed from deliaazhang.github.io — double-check
  resume: 'resume.pdf', // /public/resume.pdf
  /** Photo shown on the hero camera's screen. Leave undefined to show your hand-drawn portrait. */
  heroPhoto: undefined as string | undefined, // e.g. '/images/me.jpg'
  portrait: 'images/portrait.png',
  lastUpdated: '11/26',
  /** ✎ The scrolling "currently" strip under the intro. Keep each one short. */
  ticker: [
    { label: 'currently', text: 'Logistics Director @ UBC UX Hub' },
    { label: 'also', text: 'VP Internal @ WiDS@UBC' },
    { label: 'studying', text: 'Cognitive Systems + Data Science @ UBC' },
    { label: 'recently', text: 'studied abroad in Barcelona' },
    { label: 'proud of', text: 'Best Beginner Team @ youCode 2025' },
    { label: 'sketching', text: 'pencil portraits' },
    { label: 'iced matcha count', text: '∞' },
  ],
}
