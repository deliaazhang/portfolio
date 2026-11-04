# Delia Zhang — portfolio

Live site: https://deliaazhang.github.io/portfolio/

The files at the root of this repo are the **built** site that GitHub Pages serves.
The code lives in [`source/`](source/) (React + TypeScript + Tailwind + Motion, built with Vite).

## Editing

```bash
cd source
npm install
npm run dev       # local preview; add ?skip to the URL to skip the intro
npm run deploy    # build and copy the site to the repo root
```

Then commit and push. Pages updates a minute or two later.

| What | File |
| --- | --- |
| Links (email, LinkedIn, GitHub, resume) | `source/src/data/site.ts` |
| Projects and case studies | `source/src/data/projects.ts` |
| Camera-roll photos and captions | `source/src/data/photos.ts` |
| Pegboard items | `source/src/data/pegboard.ts` |
| Experience, education, skills | `source/src/data/resume.ts` |
| Images | `source/public/` |
