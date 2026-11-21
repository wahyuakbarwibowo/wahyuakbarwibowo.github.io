# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro static portfolio site deployed to GitHub Pages. Site copy is in Indonesian (`lang="id"`).

Live at: https://wahyuakbarwibowo.github.io

## Viewing Changes

Run the Astro dev server:

```bash
npm install
npm run dev
```

## Architecture

Homepage markup lives in `src/pages/index.astro`; behavior lives in `public/assets/js/main.js` (loaded with `defer` at the end of `<body>`, after `mailto.js`). `src/articles.json` supplies both the homepage list and statically generated article pages in `src/pages/articles/[slug].astro`. Subpages (articles, `src/pages/layanan.astro`) share `src/layouts/Page.astro` (head + OG tags, slim nav with theme toggle, footer; `width` prop sets the column):

- **Tailwind CSS v4** compiled at build time via `@tailwindcss/vite` (see `astro.config.mjs`). Entry is `src/styles/global.css`: imports Tailwind, imports `site.css` into the `components` layer (so utilities always override it), defines the `dark` class variant and maps color/font tokens in `@theme inline`. Pages import it in their frontmatter — no CDN
- **Design**: calm, typography-first professional profile, light and dark — plain paper background, Geist headings (medium, tight), two-tone headlines (ink / mute), small muted labels (`.label`), hairline dividers, lists/tables instead of cards, orange accent only for hover/focus/selection. Hero is a two-column header: headline, intro, `.btn-primary` "Hubungi saya" + `.btn` "Unduh CV", GitHub/LinkedIn links, and the photo (shown first and small on mobile). No decorative backgrounds, grain, or scroll effects — keep it that way
- **Color tokens** are CSS variables (`--paper`, `--ink`, `--mute`, `--line`, `--accent`) defined in `src/styles/site.css` on `:root` and overridden on `.dark`, exposed to Tailwind as `bg-paper`, `text-ink`, `text-mute`, `border-line`, `text-accent` — so no `dark:` prefixes are needed for colors
- **Shared CSS** in `src/styles/site.css`: color tokens, `.label`, `.u` (hairline underline link), `.btn` / `.btn-primary` (44px CTA buttons), keyboard focus, skip link, contact email sizing, article spacing, and reduced motion.
- **Page CSS** in scoped `<style>` tags: `.fade` (single load-in, disabled under `prefers-reduced-motion`) on the homepage; mobile price-table stacking on `/layanan`
- **Content data** lives as arrays in frontmatter — projects and nav links in `index.astro`; services and process steps in `layanan.astro`; edit those, not the markup
- **Sections** (in order, each a `md:grid-cols-[200px_1fr]` row with a plain `h2` in the left column): Navbar → Hero (`<header>`, headline + CTA buttons + photo) → stats bar and client strip → About (`#about`) → Experience (`#experience`, CV buttons) → Projects (`#portfolio`) → Skills (`#skills`) → Services teaser (`#services`, links to `/layanan`, no prices) → Articles (`#articles`) → Contact (`#contact`) → Footer (name, location, copyright). Pricing (IDR table) and process steps live only on `/layanan`, so the homepage reads for both recruiters and business clients
- **JS** in `assets/js/mailto.js` (homepage + `/layanan`): `mailtoHref()` prefilling a project-request email template on every `a[data-mailto]` (`data-plan` sets the service name). In `assets/js/main.js` (homepage only): `toggleDarkMode()` (called via inline `onclick`), mobile menu toggle, copy-email button, `toggleProjects()` for the hidden `[data-extra]` items in `#project-list`, CV preview modal (`openCvModal()`/`closeCvModal()` — iframe src set lazily on first open, Escape closes), footer year
- **Dark mode** via the class-based `dark` variant in `global.css` — initial theme (localStorage + `prefers-color-scheme` fallback) is applied by an inline script in `<head>` before first paint; toggle button icons are dual SVGs swapped purely via `dark:` classes, no JS icon state
- **Extra projects**: entries in `extraProjects` render as `<li data-extra class="hidden">` in the same list
- **Fonts**: Geist (body, headings, prices), JetBrains Mono (`font-mono` tech stacks and time estimates) — loaded from Google Fonts

## Assets

- `assets/img/wahyu.jpg` — original profile photo (red studio backdrop), used in JSON-LD
- `assets/img/wahyu-neutral.jpg` — same photo with the red backdrop keyed to light gray; used in the hero and the share image
- `assets/img/og.png` — 1200×630 share image (name, role, headline, neutral photo on paper background) used by OG/Twitter tags on every page
- `assets/img/favicon.svg` — "W" monogram favicon; `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` are rasterized from it with `rsvg-convert`
- `assets/pdf/cv.pdf` — resume; linked with cache-bust query (`?v=YYYY-MM`) and `download="Wahyu_Akbar_Wibowo_CV.pdf"`. When replacing the PDF, bump the `?v=` in the `cv` const in `index.astro` frontmatter and `CV_URL` in `main.js`, plus the "Terakhir diperbarui" label

## Deployment

Push to `main` to build and deploy via `.github/workflows/deploy.yml`. Set **Pages → Build and deployment → Source** to **GitHub Actions** in repository settings.
