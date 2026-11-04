# El Moi — Official Artist Site

One-page artist site for **El Moi** — dancer, artist, tech founder. Built with React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion.

Brand spine: burgundy / gold / bone, cobalt accent for Chapter One, the red flower as a visual motif (never mentioned in copy).

## Sections

- Hero — cinematic welcome, drifting petals, kinetic out-now marquee
- Listen — SBK Vol. 1. tracklist, cover art, Spotify embed, platform links, credits
- Visual — parallax gallery frames ready for new imagery
- Story — bio + chapter ledger
- Dance — nododance.com cross-link
- Contact — socials hub
- Footer — signposts for nododance and DESTERRADO (coming soon)

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # local preview of the build
```

## Deploy to Vercel

Option A — CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Option B — GitHub:

1. Push this folder to a GitHub repository
2. Import it at vercel.com/new — Vite is auto-detected (build: `npm run build`, output: `dist`)
3. After buying elmoi.xyz, add it as a custom domain in the Vercel dashboard and point DNS per its instructions

## Adding imagery

Drop your images into `public/images/` and set the `src` values in `FRAMES` at the top of `src/components/Visual.tsx`. The hero artwork placeholder in `src/components/Hero.tsx` can be swapped the same way.

## Updating content

All external links, release info, and track data live in `src/data/links.ts`.
