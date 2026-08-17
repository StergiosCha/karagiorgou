# Prunak — Panagiota Karagiorgou, photographs

Static portfolio site (React 18 + Vite + TypeScript, plain CSS, bilingual ΕΛ/EN).
Live at **https://stergioscha.github.io/karagiorgou/** (repo name ≠ site name — that's intentional).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173/karagiorgou/
npm run build      # check assets → sitemap/robots → tsc → vite → dist hygiene check
npm run preview
```

`npm run build` **fails on purpose** if any photo referenced by the manifest is missing a
1600/800/400 derivative, or if `dist/` contains anything from `raw/`, `curated/`, `metadata/`
or any jpg/png original.

## Assets — the only rule that matters

The site reads exactly two things from the `toumpano-assets/` pipeline output:

| pipeline output          | goes to                     |
| ------------------------ | --------------------------- |
| `web/{1600,800,400}/*.webp` | `public/assets/web/…`     |
| `manifest.json`          | `src/data/manifest.json`    |

**`raw/`, `curated/`, `metadata/` NEVER enter this repo.** They are gitignored defensively
and the post-build check refuses to ship them. Full-resolution originals must not be published.

### Refresh after a new pipeline run (e.g. the 10 × 10 regroup)

```bash
rm -rf public/assets/web
cp -R /path/to/toumpano-assets/web public/assets/web
cp /path/to/toumpano-assets/manifest.json src/data/manifest.json
npm run build      # will tell you if anything is missing
git add -A && git commit -m "assets: refresh" && git push
```

Series, titles, descriptions, heroes, photo order and the site-wide hero all come from the
manifest — nothing is hard-coded in the site. Types live in `src/data/manifest.ts`.

### Change the hero

- Site-wide hero: `manifest.json → "hero": "<photo id>"`.
- Series hero: `manifest.json → series[i].hero`.
- Fallback if the manifest has no `hero`: `FALLBACK_HERO` in `src/data/manifest.ts`.
- The hero is darkened by the site chrome (`src/components/Hero.css → .hero__shade`);
  pick a photo that survives ~35 % darkening.

## Content placeholders to replace

- **About** (`src/i18n/strings.ts → about.body`, both languages) — marked PLACEHOLDER on the page.
  Portrait: `src/pages/About.tsx` currently shows one of her own photos; drop a real portrait into
  `public/assets/portrait/` and point the `<img>` at it.
- **Contact email**: `src/pages/Contact.tsx → EMAIL_PLACEHOLDER`.
- Instagram / Flickr links come from `manifest.json → photographer`.

## Journal entries (markdown)

Create `src/journal/YYYY-MM-DD-slug.md`:

```markdown
---
title_el: Ο τίτλος
title_en: The title
date: 2026-09-01
---
Ελληνικό κείμενο σε markdown…

---en---

English text…
```

The `---en---` separator is optional (same body in both languages without it). The URL is
`/journal/YYYY-MM-DD-slug`. No code changes needed — files are picked up by `import.meta.glob`.
With zero files the index shows the designed empty state («Τίποτα ακόμη» / "Nothing yet").

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on every push to `main` and deploys
`dist/` with `actions/deploy-pages`.

One-time manual steps in the repo settings:
1. **Settings → Pages → Source: GitHub Actions**.
2. The repo must be **public** (or on a paid plan) — Pages doesn't serve private repos on Free.

Deep links work on Pages via `public/404.html` → `index.html` redirect (spa-github-pages pattern).

### Moving to a custom domain later

1. `vite.config.ts` → `base: '/'`
2. `public/404.html` → `pathSegmentsToKeep = 0`
3. `src/components/Seo.tsx` → `SITE_ORIGIN`, and build with `SITE_URL=https://your.domain npm run build`
   (or change the default in `scripts/gen-seo.mjs`)
4. `index.html` → the static `og:url` / `og:image` URLs
5. Add `public/CNAME` with the domain, and set the custom domain in Settings → Pages.

## Design notes

Near-black `#0e0d0b`, bone `#d6d2c8`, one ochre accent for rules/focus only. GFS Didot (display,
Greek + Latin) + IBM Plex Sans (captions; Plex Mono has no Greek). Film grain sits *under* the
content, so it never touches the photographs. Photographs are shown as-is — never filtered.
Motion is 600–900 ms opacity only and honours `prefers-reduced-motion`.
