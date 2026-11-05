/**
 * ✎ The story behind each project, shown on its case-study page.
 *
 * These are DRAFTS written from the process notes in your portfolio slides.
 * Rewrite them in your own words, especially the decisions and reflections,
 * since only you know the real reasons behind each choice.
 */
export type Decision = {
  /** the question you had to answer */
  question: string
  /** what you chose */
  choice: string
  /** why */
  why: string
}

export type Story = {
  tags: string[]
  /** a short summary shown at the top */
  tldr: string[]
  /** where the problem started */
  origin: string[]
  /** questions that guided the work */
  questions: string[]
  decisions: Decision[]
  reflections: string[]
}

export const stories: Record<string, Story> = {
  wehappy: {
    tags: ['product design', 'internship', 'community', 'web design'],
    tldr: [
      'WeHappy is a bilingual social and lifestyle app for Chinese communities around the world. During my internship at HappyVV I worked on four separate projects: an app redesign, a website redesign for Western audiences, a Discord analysis that shaped WeHappy’s community feature, and a 打卡 city check-in app.',
      'I analyzed how Discord organizes communities so the team could design WeHappy’s own version. That feature is now in the live app.',
    ],
    origin: [
      'WeHappy already had messaging, group chats and a feed, but a single group chat can only hold so much. Interest-based communities needed more structure: separate spaces, roles and events.',
      'Discord does this well, so before designing anything we needed to understand exactly how it works, from long-press menus to member roles and search.',
    ],
    questions: [
      'How does Discord keep large communities organized?',
      'Which of those patterns actually suit WeHappy’s users?',
      'How do we explain WeHappy to someone who has never heard of it?',
    ],
    decisions: [
      {
        question: 'Design straight away, or study Discord first?',
        choice: 'Map every Discord flow first, in one Figma board.',
        why: 'Messages, images, links, PDFs, apps, member profiles, events and search each behave differently. A shared map gave designers and engineers the same reference before anyone built anything.',
      },
      {
        question: 'Copy Discord, or adapt it?',
        choice: 'Adapt the patterns that fit WeHappy’s communities.',
        why: 'WeHappy’s users and content are different, so the goal was to borrow structure, not to clone another product.',
      },
      {
        question: 'What should the Western website lead with?',
        choice: 'What the app does, in plain English, styled like chat bubbles.',
        why: 'New visitors need to understand the product in seconds. Echoing the app’s own messages shows the experience instead of just describing it.',
      },
      {
        question: 'How do we get people exploring their city?',
        choice: 'A 打卡 site with check-in progress for each city.',
        why: 'Seeing “3/10 checked in” turns exploring into a small goal and gives people a reason to come back.',
      },
    ],
    reflections: [
      'Seeing analysis I did turn into a feature in a real app, used by real people, was the highlight of my internship.',
      'Designing for two languages and two audiences taught me to check every assumption about what is “obvious”.',
    ],
  },

  correlation: {
    tags: ['research', 'data visualization', 'HCI'],
    tldr: [
      'At UBC’s Visual Cognition Lab I worked on the Correlation Project, which studies how people perceive correlation in scatterplots.',
      'I worked on a condition about point opacity: whether making dots more or less transparent changes how precisely people judge correlation. I helped run participant sessions and organize the results.',
    ],
    origin: [
      'Scatterplots are one of the most common charts, and we often assume people read them accurately. Research shows our sense of correlation is predictable but not perfect.',
      'Designers change how points look all the time, for example making them transparent so overlapping dots stay visible. The question is whether that design choice quietly changes what people see.',
    ],
    questions: [
      'Do more transparent dots make correlation harder to see?',
      'Is the effect the same at low and high correlations?',
      'How do we stop the order of conditions from biasing the results?',
    ],
    decisions: [
      {
        question: 'Why study opacity?',
        choice: 'Test a design choice people make every day.',
        why: 'Transparency is a common fix for overlapping points, so it matters whether it changes how people read the chart.',
      },
      {
        question: 'How do we measure “seeing correlation”?',
        choice: 'Two tasks: estimation and discrimination (JND).',
        why: 'Estimation shows how accurate people are; discrimination shows how small a difference they can notice. Together they separate accuracy from precision.',
      },
      {
        question: 'How do we avoid order effects?',
        choice: 'Counterbalance by rotating which condition each participant starts with.',
        why: 'People tend to do worst on their first condition and best on their last. Rotating the order stops any one condition from always getting the worst data.',
      },
    ],
    reflections: [
      'Small design choices like point opacity can be tested rigorously instead of guessed at.',
      'Research rewards patience and care: most of the work is making sure the data can be trusted.',
    ],
  },

  arctrail: {
    tags: ['UX/UI design', 'community', 'web app', 'branding'],
    tldr: [
      'Arc’teryx’s community is full of ambassadors, partners and grant recipients doing great work outdoors, but they rarely find each other. Arc’Trail matches them by what they bring and what they need, so meaningful collaboration doesn’t depend on luck or social media.',
      'Over a 24-hour hackathon I designed the UX/UI and the nature-inspired visual brand. The prototype won Best Beginner Team at youCode 2025.',
    ],
    origin: [
      'The challenge came from Arc’teryx: help community members connect, share resources and collaborate, without leaning on traditional social media.',
      'When we looked at Arc’teryx’s values and at how existing social platforms work, the gap was clear. Feeds are good at showing who is popular, and bad at showing who could actually help you. Connection stays on the surface.',
    ],
    questions: [
      'What makes two community groups a good match, beyond follower counts?',
      'How can a profile show what someone offers and what they need at a glance?',
      'What would make someone comfortable reaching out to a group they’ve never met?',
    ],
    decisions: [
      {
        question: 'Should people be matched on popularity or on fit?',
        choice: 'Every profile shows strengths and needs side by side.',
        why: 'The problem we found with social platforms was surface-level connection. Pairing what one group can offer with what another needs makes the reason to connect obvious.',
      },
      {
        question: 'An open feed, or suggestions?',
        choice: 'Personalized collaboration suggestions, matched on shared values and goals.',
        why: 'Our goal was peer-to-peer support, not another social feed. Suggestions keep the focus on finding the right people rather than scrolling.',
      },
      {
        question: 'How should it feel to use?',
        choice: 'Misty mountains, a muted palette and generous space, true to Arc’teryx.',
        why: 'We wanted it to feel like part of the Arc’teryx world, so the brand guided the visual direction from the first sketches.',
      },
    ],
    reflections: [
      'Designing on a 24-hour clock meant making decisions quickly and keeping the team aligned on why.',
      'It was my first time working with Supabase and JavaScript alongside a design file.',
    ],
  },

  roominate: {
    tags: ['product design', 'UX research', 'mobile', 'Swift'],
    tldr: [
      'Sharing a home means constant small conversations about noise, guests, dishes and money, and those are often the hardest to start. roominate gives roommates low-stress ways to communicate: anonymous alerts, shared schedules and a simple expense tracker.',
      'At nwHacks 2025 I worked on UX research and UX/UI design, and helped bring the app to life in Swift.',
    ],
    origin: [
      'We started by looking into student housing pain points and roommate frustrations.',
      'The pattern that kept coming up was that the chores themselves weren’t the stressful part. Bringing them up was. Communication and shared responsibilities caused more tension than the tasks did.',
    ],
    questions: [
      'How do you ask a roommate for something without starting an argument?',
      'What needs a real conversation, and what could be a gentle nudge?',
      'How can splitting costs feel fair and transparent?',
    ],
    decisions: [
      {
        question: 'Should alerts show who sent them?',
        choice: 'Alerts can be sent anonymously.',
        why: 'Taking the sender out of the message keeps it about the situation, not the person, which lowers the pressure on both sides.',
      },
      {
        question: 'Free text, or ready-made alerts?',
        choice: 'A few one-tap alerts like “quiet down”, “no guests” and “clean dishes”.',
        why: 'Our goal was clarity and low conflict. Preset alerts are quick to send and come with respectful wording built in. We kept the interactions minimal on purpose.',
      },
      {
        question: 'One app, or just a messaging tool?',
        choice: 'Alerts, a shared calendar and an expense tracker in one place.',
        why: 'The friction came from many small things at once, so it made sense to keep schedules and costs visible to everyone in the same app.',
      },
    ],
    reflections: [
      'It was my first time building with Swift and Xcode.',
      'Small details, like how an alert is worded, can change how a whole interaction feels.',
    ],
  },

  skintellect: {
    tags: ['UX research', 'UI design', 'AI', 'mobile'],
    tldr: [
      'Skincare advice online is everywhere, but it is often contradictory, sponsored or one-size-fits-all. skintellect is an AI skincare app prototype that gives personalized, honest advice and budget-friendly routines that grow with you.',
      'At UXathon 2025 I worked on UX research and UX/UI design, from onboarding to the face scan and routine screens.',
    ],
    origin: [
      'We began by researching people’s skincare habits and how they decide which advice to trust.',
      'The recurring theme was trust. Existing apps left a knowledge gap: people didn’t know which recommendations actually applied to their skin, or whether they were just being sold to.',
    ],
    questions: [
      'How can AI advice feel honest instead of salesy?',
      'How much do we need to know about someone’s skin before recommending anything?',
      'How do we keep a routine simple enough to actually stick with?',
    ],
    decisions: [
      {
        question: 'How should we learn about someone’s skin?',
        choice: 'A short survey of concerns, followed by a facial scan.',
        why: 'Personalization was the core need. Combining what people tell us with what the scan sees gives the advice a real basis.',
      },
      {
        question: 'How many steps should a routine have?',
        choice: 'Clear, minimal-step routines.',
        why: 'Simplicity was the other key need. A routine people can follow every day is better than a perfect one they abandon.',
      },
      {
        question: 'What about price?',
        choice: 'Budget-friendly recommendations built into every routine.',
        why: 'Honest advice should fit people’s real lives, and that includes what they can afford.',
      },
    ],
    reflections: [
      'This was my first time doing structured user research.',
      'Designing for trust is as much about tone and transparency as it is about features.',
    ],
  },

  'herschel-wander': {
    tags: ['brand strategy', 'web redesign', 'UX research', 'product'],
    tldr: [
      'Herschel was seen by many Gen Z shoppers as the backpack they had in high school. Herschel Wander repositions the brand as travel lifestyle, with a new product line and a refreshed website that blends style and adventure.',
      'For the UBC Imprint Case Competition I worked on UX research and UX/UI design for the redesign.',
    ],
    origin: [
      'The brief was to make Herschel resonate with Gen Z.',
      'Researching Gen Z values, travel habits and how they saw Herschel, one thing stood out: the brand was linked with school backpacks. Reliable, but not exciting, and not where Gen Z’s interest in travel and self-expression was heading.',
    ],
    questions: [
      'What does Gen Z actually want from a travel brand?',
      'Can a backpack brand feel like a lifestyle?',
      'How do we make browsing the site feel like exploring?',
    ],
    decisions: [
      {
        question: 'Fix the website, or the positioning?',
        choice: 'Reframe Herschel from “school backpacks” to “travel life essentials”.',
        why: 'A nicer site alone wouldn’t change how people saw the brand. The reframe gave every other decision a direction.',
      },
      {
        question: 'Redesign existing products, or introduce new ones?',
        choice: 'A new Wander line with personalization hooks, water holders and recycled materials.',
        why: 'Gen Z values style and self-expression. Hooks for keychains and charms make each bag personal, and the materials reflect environmental awareness.',
      },
      {
        question: 'What should the homepage prioritize?',
        choice: 'Seamless, image-led browsing with a travel feel.',
        why: 'We wanted the site to feel authentic and easy to explore, so the experience itself carries the travel story.',
      },
    ],
    reflections: [
      'User research shaped the strategy itself, not just the screens.',
      'Working on a brand case taught me to connect design choices back to business goals.',
    ],
  },
}
