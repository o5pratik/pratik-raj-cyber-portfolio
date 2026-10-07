# Pratik Raj — Cyber Portfolio

Source code for Pratik Raj's game-inspired personal portfolio. The site presents a profile, skills, project summaries, a timeline, and contact links. Its visual design uses motion and a 3D scene.

## Stack

Next.js, React, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, and GSAP.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To create a production build, run `npm run build`.

## Where to update content

- `data/portfolio.ts` contains project summaries, links, skills, achievements, and timeline entries.
- `app/page.tsx` contains the page sections and contact links.
- `public/images/` and `public/videos/` contain the visual assets.

Project cards show a GitHub or demo button only when a destination is provided. Add a link only after the destination exists and accurately represents the project.
