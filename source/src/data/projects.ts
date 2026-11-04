/**
 * ✎ Projects — the grid on the home page and each case-study page read from here.
 * Images live in /public/projects/.
 */
export type Step = { title: string; points: string[] }

export type PrototypeKey = 'arctrail' | 'roominate' | 'skintellect' | 'herschel' | 'wehappy' | 'vcl'

export type Project = {
  slug: string
  /** soft brand-tinted background for previews */
  tint: string
  /** the moving preview on hover + case-study hero */
  preview: { device: 'laptop' | 'phones' | 'viz'; screens: string[]; extras?: string[] }
  /** the hands-on prototype shown on the case study */
  prototype: { key: PrototypeKey; title: string; hint: string }
  title: string
  category: string
  year: string
  event: string
  /** one line for the project card */
  description: string
  /** a short paragraph at the top of the case study */
  overview: string
  thumb: string
  /** image beside "where it started" (optional) */
  hero?: string
  accent: string
  facts: { label: string; value: string }[]
  challenge: string
  goals: string[]
  achieved: string[]
  process: { image: string; steps: Step[] }
  feature: { name: string; body: string; image?: string; chart?: 'jnd' }
  gallery: { image: string; caption: string; tall?: boolean }[]
  links: { label: string; href: string }[]
}

const img = (slug: string, part: string) => `projects/${slug}-${part}.webp`

export const projects: Project[] = [
  {
    slug: 'wehappy',
    tint: 'linear-gradient(160deg,#fde4e7 0%,#f8c3cb 55%,#f29aa8 100%)',
    preview: { device: 'phones', screens: ['screens/wh-3.webp', 'screens/wh-5.webp', 'screens/wh-4.webp', 'screens/wh-6.webp', 'screens/wh-1.webp', 'screens/wh-2.webp'] },
    prototype: { key: 'wehappy', title: 'go on a 打卡 trip', hint: 'pick a city and check in at a few spots, like the city check-in site i designed' },
    title: 'WeHappy',
    category: 'Product Design · Internship',
    year: '2025',
    event: 'HappyVV · Product & Community Intern',
    description: 'Community features, a city check-in site and a Western-facing website for a global social app.',
    overview:
      'WeHappy is a bilingual social and lifestyle app for Chinese communities around the world. As a product and community intern I analyzed Discord to shape WeHappy’s own community feature (now in the live app), designed a city check-in (打卡) website, and redesigned the website for Western audiences.',
    thumb: 'screens/wh-3.webp',
    hero: 'screens/wh-4.webp',
    accent: '#e8344e',
    facts: [
      { label: 'built at', value: 'HappyVV (WeHappy)' },
      { label: 'worked as', value: 'Product & Community Intern' },
      { label: 'tools', value: 'Figma' },
      { label: 'learned', value: 'Shipping with an engineering team, bilingual design' },
      { label: 'when', value: 'June 2025 – June 2026' },
      { label: 'award', value: 'Community feature shipped in the live app' },
    ],
    challenge: 'How might we help WeHappy users build real communities, and help people outside the Chinese diaspora understand what WeHappy is?',
    goals: [
      'Give interest-based communities more structure than a single group chat',
      'Introduce WeHappy clearly to Western audiences',
      'Encourage people to explore their city through the app',
    ],
    achieved: [
      'Mapped Discord’s flows end to end so the team could design WeHappy’s own version, which shipped in the app',
      'Redesigned the website around what the app does, in plain English',
      'Designed a city check-in (打卡) website with progress for each city',
    ],
    process: {
      image: '',
      steps: [
        { title: 'research', points: ['Analyzed how Discord organizes communities', 'Documented flows for messages, images, links, files, members, events and search'] },
        { title: 'define', points: ['Chose which patterns fit WeHappy’s users', 'Identified what Western visitors need to know first'] },
        { title: 'ideate', points: ['Sketched channel, member and event flows', 'Explored a city check-in concept'] },
        { title: 'prototype', points: ['Designed the screens and websites in Figma', 'Handed off to engineering for the live app'] },
      ],
    },
    feature: {
      name: 'Community analysis',
      body: 'A full map of how Discord handles messages, images, links, PDFs, apps, member profiles, events and search. It became the reference for WeHappy’s own community feature, which is now in the live app.',
      image: 'projects/wehappy-discord-map.webp',
    },
    gallery: [
      { image: 'screens/ws-1.webp', caption: 'website for Western audiences' },
      { image: 'screens/ck-1.webp', caption: '打卡 · choose a city' },
      { image: 'screens/ck-3.webp', caption: '打卡 · spot details' },
    ],
    links: [],
  },
  {
    slug: 'correlation',
    tint: 'linear-gradient(160deg,#e9eef8 0%,#d3def0 55%,#b9cbe6 100%)',
    preview: { device: 'viz', screens: [] },
    prototype: { key: 'vcl', title: 'try the task yourself', hint: 'pick the plot that looks more correlated. it gets harder as you get better' },
    title: 'Seeing Correlation',
    category: 'Data Visualization Research',
    year: '2025',
    event: 'UBC Visual Cognition Lab · Co-Pilot',
    description: 'How precisely can people see correlation in a scatterplot, and does the look of the dots change that?',
    overview:
      'At UBC’s Visual Cognition Lab I worked on the Correlation Project, which studies how people perceive correlation in scatterplots. My condition looked at point opacity: whether making the dots more or less transparent changes how precisely people can judge correlation.',
    accent: '#2a78d6',
    thumb: '',
    facts: [
      { label: 'built at', value: 'UBC Visual Cognition Lab' },
      { label: 'worked as', value: 'Research Co-Pilot' },
      { label: 'tools', value: 'VCL Web Framework, Git, Python' },
      { label: 'learned', value: 'Experiment design, psychophysics' },
      { label: 'when', value: 'April 2025 – September 2025' },
    ],
    challenge: 'Does the opacity of the points in a scatterplot change how precisely people perceive correlation?',
    goals: [
      'Measure precision (JND) and accuracy (estimation) for each opacity level',
      'Keep results free of order effects and practice effects',
    ],
    achieved: [
      'Ran the experiment with counterbalanced condition orders',
      'Summarized each session into midpoint estimates and JNDs per base correlation',
    ],
    process: {
      image: '',
      steps: [
        { title: 'research', points: ['Read the core papers on correlation perception', 'Learned the Stevens and JND tasks, Weber’s and Fechner’s laws'] },
        { title: 'define', points: ['Opacity conditions: 25%, 50%, 75%, 100% and a mix', 'Five sub-conditions per participant, counterbalanced'] },
        { title: 'pilot', points: ['Ran the full experiment on myself first', 'Then on a friend, with the project lead observing'] },
        { title: 'run + analyze', points: ['Ran participants through the Human Subject Pool', 'Summarized JND and midpoint estimates per condition'] },
      ],
    },
    feature: {
      name: 'One session’s results',
      body: 'Each line is one opacity condition. A lower JND means people could tell smaller differences in correlation apart. Across conditions, discrimination gets sharper as correlation rises. That is the Weber’s-law-like pattern earlier studies found.',
      chart: 'jnd',
    },
    gallery: [],
    links: [],
  },
  {
    slug: 'arctrail',
    tint: 'linear-gradient(160deg,#e4ecee 0%,#cfdcdf 55%,#b9ccd0 100%)',
    preview: { device: 'laptop', screens: ['screens/arc-1.webp', 'screens/arc-2.webp', 'screens/arc-3.webp', 'screens/arc-4.webp', 'screens/arc-5.webp', 'screens/arc-6.webp'] },
    prototype: { key: 'arctrail', title: 'find your collaborators', hint: 'pick what you bring and what you need, then get matched' },
    title: 'Arc’Trail',
    category: 'UX/UI Design',
    year: '2025',
    event: 'youCode 2025 · Best Beginner Team',
    description: 'A purpose-driven platform that helps Arc’teryx partners connect through shared strengths and needs.',
    overview:
      'Arc’Trail is a purpose-driven platform that helps Arc’teryx partners connect through shared strengths and needs. Our prototype won Best Beginner Team at youCode 2025 for its thoughtful UX and nature-inspired visual brand.',
    thumb: img('arctrail', 'thumb'),
    hero: img('arctrail', 'hero'),
    accent: '#4f6d7a',
    facts: [
      { label: 'built at', value: 'youCode 2025 (24-hour hackathon)' },
      { label: 'award', value: 'Best Beginner Team' },
      { label: 'worked as', value: 'UX/UI Designer' },
      { label: 'tools', value: 'Figma, Canva, React' },
      { label: 'learned', value: 'Supabase, JavaScript' },
      { label: 'when', value: 'April 2025' },
    ],
    challenge:
      'How might we create a way for Arc’teryx community members to connect, share resources, and collaborate without relying on traditional social media?',
    goals: [
      'Encourage meaningful peer-to-peer support, not just social media',
      'Highlight each user’s strengths and needs in an intuitive, accessible way',
    ],
    achieved: [
      'Designed collaboration suggestions and value-based matching to support deeper connections',
      'Built profile cards that clearly show each user’s strengths and needs',
    ],
    process: {
      image: img('arctrail', 'process'),
      steps: [
        { title: 'research', points: ['Reviewed Arc’teryx’s brand values and pain points', 'Explored how existing social platforms fail to connect people past surface level'] },
        { title: 'define', points: ['Mapped user needs (e.g. belonging)', 'Created user personas: ambassadors, partners, grant recipients'] },
        { title: 'ideate', points: ['Sketched flows to explore layouts', 'Focused on Arc’teryx branding'] },
        { title: 'prototype', points: ['Built the prototype in Figma', 'Profile building and matching'] },
      ],
    },
    feature: {
      name: 'Collaborations',
      body: 'Matches users with aligned partners based on shared values and goals, making it easier to find meaningful connections.',
      image: img('arctrail', 'feature'),
    },
    gallery: [
      { image: img('arctrail', 'g1'), caption: 'personalized matching' },
      { image: img('arctrail', 'g2'), caption: 'learn about communities' },
      { image: img('arctrail', 'g3'), caption: 'post your projects' },
    ],
    links: [
      { label: 'Figma prototype', href: 'https://www.figma.com/design/i1HM4MD6qwIovhOnpk3RmK/Arc-Trail--youCode-2025-?node-id=1-3&t=1DvlTFoJv0H6Oapq-1' },
      { label: 'Slide deck', href: 'https://www.canva.com/design/DAGj01xTpPQ/lOxkb267oW6ijowhzmLvlg/view' },
    ],
  },
  {
    slug: 'roominate',
    tint: 'linear-gradient(160deg,#f1f3c6 0%,#c9e6b4 50%,#9fd9c9 100%)',
    preview: { device: 'phones', screens: ['screens/room-4.webp','screens/room-3.webp','screens/room-5.webp','screens/room-6.webp','screens/room-7.webp','screens/room-2.webp','screens/room-1.webp'] },
    prototype: { key: 'roominate', title: 'send an anonymous alert', hint: 'tap an alert and watch it land on your roommate’s phone' },
    title: 'roominate',
    category: 'Product Design',
    year: '2025',
    event: 'nwHacks 2025',
    description: 'A roommate app that makes shared living easier and less awkward.',
    overview:
      'A roommate management app designed to make shared living easier and less awkward. From anonymous alerts to shared schedules and expense tracking, it helps roommates communicate better and stay organized.',
    thumb: img('roominate', 'thumb'),
    hero: img('roominate', 'hero'),
    accent: '#3f8f5e',
    facts: [
      { label: 'built at', value: 'nwHacks 2025' },
      { label: 'worked as', value: 'UX/UI Designer, UX Researcher' },
      { label: 'tools', value: 'Figma, Canva, Swift' },
      { label: 'learned', value: 'Swift, Xcode' },
      { label: 'when', value: 'January 2025' },
    ],
    challenge:
      'How might we make communication between roommates easier and less stressful, especially when it comes to sensitive topics or shared responsibilities?',
    goals: [
      'Create a low-stress way for roommates to communicate needs or concerns',
      'Make shared expense tracking intuitive and transparent',
    ],
    achieved: [
      'Added anonymous alerts to help roommates communicate sensitive topics without conflict',
      'Designed a simple expense tracker to make splitting costs transparent and stress-free',
    ],
    process: {
      image: img('roominate', 'process'),
      steps: [
        { title: 'research', points: ['Searched student housing pain points and roommate frustrations', 'Identified key stressors around communication and responsibilities'] },
        { title: 'define', points: ['Outlined user goals (clarity, low conflict)', 'Created user profiles'] },
        { title: 'ideate', points: ['Sketched out flows for alerts and schedules', 'Kept UI interactions minimal'] },
        { title: 'prototype', points: ['Designed the prototype in Figma', 'Implemented a basic app in Swift'] },
      ],
    },
    feature: {
      name: 'Alerts',
      body: 'Lets users send anonymous, respectful alerts straight to their roommate’s phone, making it easier to bring up sensitive topics without conflict or awkwardness.',
      image: img('roominate', 'feature'),
    },
    gallery: [
      { image: img('roominate', 'g1'), caption: 'calendar', tall: true },
      { image: img('roominate', 'g2'), caption: 'expense tracker', tall: true },
      { image: img('roominate', 'g3'), caption: 'profile', tall: true },
    ],
    links: [
      { label: 'Figma prototype', href: 'https://www.figma.com/design/LvHFGQ31KxkDf7PxGKpd7K/roominate-Alerts?node-id=63-166&t=dyudBE1rxdPkBboN-1' },
      { label: 'Slide deck', href: 'https://www.canva.com/design/DAGclnzooiU/HHqDtq9VHL-T1NcGUTY0hQ/view' },
    ],
  },
  {
    slug: 'skintellect',
    tint: 'linear-gradient(160deg,#eef0e6 0%,#d7e0cc 55%,#b9c9ad 100%)',
    preview: { device: 'phones', screens: ['screens/skin-1.webp','screens/skin-2.webp','screens/skin-4.webp','screens/skin-5.webp','screens/skin-6.webp','screens/skin-3.webp'] },
    prototype: { key: 'skintellect', title: 'build your routine', hint: 'choose your concerns, scan, and get a routine that fits your budget' },
    title: 'skintellect',
    category: 'UX Research + UI',
    year: '2025',
    event: 'UXathon 2025',
    description: 'A personalized AI skincare app that makes routines simpler and smarter.',
    overview:
      'A personalized skincare app prototype that makes routines simpler and smarter. Skintellect uses AI to offer tailored advice, product picks, and budget-friendly routines that grow with you.',
    thumb: img('skintellect', 'thumb'),
    hero: img('skintellect', 'hero'),
    accent: '#5f7f56',
    facts: [
      { label: 'built at', value: 'UXathon 2025' },
      { label: 'worked as', value: 'UX/UI Designer, UX Researcher' },
      { label: 'tools', value: 'Figma, Canva' },
      { label: 'learned', value: 'Figma, User Research' },
      { label: 'when', value: 'January 2025' },
    ],
    challenge:
      'How might we design a personalized AI skincare platform that evolves with users and builds trust through human-centered advice?',
    goals: [
      'Use AI to deliver personalized, honest skincare recommendations that adapt to each user',
      'Simplify routines with clear, minimal-step guidance tailored to individual needs',
    ],
    achieved: [
      'Built a prototype using surveys and facial analysis to generate personalized skincare advice',
      'Designed an interface with budget-friendly recommendations tailored to user needs',
    ],
    process: {
      image: img('skintellect', 'process'),
      steps: [
        { title: 'research', points: ['Researched skincare habits and trust issues with online advice', 'Looked for the knowledge gap in existing skincare apps'] },
        { title: 'define', points: ['Identified key needs (personalization, simplicity)', 'Created user profiles'] },
        { title: 'ideate', points: ['Mapped user flows for onboarding and skin analysis', 'Focused on a clean UI'] },
        { title: 'prototype', points: ['Built the prototype in Figma', 'Facial scan UI, survey, product routine'] },
      ],
    },
    feature: {
      name: 'Personalization',
      body: 'Delivers personalized skincare insights based on each user’s unique skin profile, making it easy to get tailored, effective advice.',
      image: img('skintellect', 'feature'),
    },
    gallery: [
      { image: img('skintellect', 'g1'), caption: 'face scanning', tall: true },
      { image: img('skintellect', 'g2'), caption: 'personalized routine', tall: true },
      { image: img('skintellect', 'g3'), caption: 'AI chat assistant', tall: true },
    ],
    links: [
      { label: 'Figma prototype', href: 'https://www.figma.com/design/a64RYN8wTkXrhB8orQPK1x/Prototype?node-id=480-462&t=zTPK59qYNL5SGAtj-1' },
      { label: 'Slide deck', href: 'https://docs.google.com/presentation/d/1QtXAbQC13V9FXYXSYs3Oowekj6FWZcqQkLWJQhCabnA/edit?usp=sharing' },
    ],
  },
  {
    slug: 'herschel-wander',
    tint: 'linear-gradient(160deg,#e3e8f3 0%,#c3cde4 55%,#9fb0d6 100%)',
    preview: { device: 'laptop', screens: ['screens/her-1.webp', 'screens/her-2.webp', 'screens/her-3.webp', 'screens/her-4.webp'], extras: ['screens/prod-1.webp', 'screens/prod-6.webp'] },
    prototype: { key: 'herschel', title: 'explore the wander line', hint: 'switch products and colourways, then tap the hotspots' },
    title: 'Herschel Wander',
    category: 'Brand + Web Redesign',
    year: '2025',
    event: 'UBC Imprint Case Competition 2025',
    description: 'A travel lifestyle website redesign that brings Herschel into Gen Z’s world.',
    overview:
      'A travel lifestyle website redesign that brings Herschel into Gen Z’s world. Herschel Wander adds modern products and a refreshed digital experience that blends style and adventure for everyday explorers.',
    thumb: img('herschel', 'thumb'),
    hero: img('herschel', 'hero'),
    accent: '#25407a',
    facts: [
      { label: 'built at', value: 'UBC Imprint Case Competition' },
      { label: 'worked as', value: 'UX/UI Designer, UX Researcher' },
      { label: 'tools', value: 'Figma, Canva' },
      { label: 'learned', value: 'User Research' },
      { label: 'when', value: 'February 2025' },
    ],
    challenge:
      'How might we reposition Herschel as a travel lifestyle brand that resonates with Gen Z by blending authenticity and functionality?',
    goals: [
      'Reframe Herschel from “school backpacks” to “travel life essentials”',
      'Create a browsing experience that feels authentic, stylish and easy to explore',
    ],
    achieved: [
      'Redesigned the website with a modern, travel-inspired interface',
      'Introduced a new product line tailored to Gen Z values of style and self-expression',
    ],
    process: {
      image: img('herschel', 'process'),
      steps: [
        { title: 'research', points: ['Analyzed Gen Z values, travel habits and perceptions of Herschel', 'Researched other lifestyle brands targeting young adults'] },
        { title: 'define', points: ['Reframed the brand challenge from “school backpacks” to “travel life essentials”', 'Identified user profiles'] },
        { title: 'ideate', points: ['Sketched new products and the homepage', 'Prioritized seamless browsing'] },
        { title: 'prototype', points: ['Designed the prototype in Figma', 'Included a whole new product line'] },
      ],
    },
    feature: {
      name: 'Redesign',
      body: 'A new product line designed with Gen Z in mind: sleek, durable, and versatile pieces that transition from city life to spontaneous travel.',
      image: img('herschel', 'feature'),
    },
    gallery: [
      { image: img('herschel', 'g1'), caption: 'user research' },
      { image: img('herschel', 'g2'), caption: 'user profiles' },
      { image: img('herschel', 'g3'), caption: 'backpack features' },
    ],
    links: [
      { label: 'Figma prototype', href: 'https://www.figma.com/design/fNsWq7VVbIDX5bQEjgSqBs/HERschel?node-id=0-1&t=gBPr2cRxOPDEfnch-1' },
      { label: 'Slide deck', href: 'https://www.canva.com/design/DAGcyrOkzFY/3TbjAv8sd1Z24AiO1nmJIQ/view' },
    ],
  },
]
