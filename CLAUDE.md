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
- **Design**: developer-tool landing look, light and dark (inspired by omp.sh) — near-black background with CSS film grain (`body::after`), Geist headings (medium, tight), three-tone display headlines (ink / mute / sun-orange accent), JetBrains Mono wide-tracked uppercase labels (`.label`, golden `accent2` eyebrow), hairline dividers, lists/tables instead of cards. Hero has a terminal-style contact box (`.term-tab` tabs + COPY) and a static pixel-dithered rising sun with corona drawn on `#sun` canvas (colors adapt to theme). Desktop (`xl`) has a fixed numbered section rail (`.rail-item`). No scroll effects
- **Color tokens** are CSS variables (`--paper`, `--ink`, `--mute`, `--line`, `--accent`, `--accent-2`, `--panel`) defined in `src/styles/site.css` on `:root` and overridden on `.dark`, exposed to Tailwind as `bg-paper`, `text-ink`, `text-mute`, `border-line`, `text-accent`, `text-accent2`, `bg-panel` — so no `dark:` prefixes are needed for colors
- **Shared CSS** in `src/styles/site.css`: color tokens, grain, `.label`, `.u` (hairline underline link), `.term-tab`, `.rail-item`, keyboard focus, skip link, contact email sizing, article spacing, and reduced motion.
- **Page CSS** in scoped `<style>` tags: `.portrait` (grayscale photo) and `.fade` (single load-in, disabled under `prefers-reduced-motion`) on the homepage; mobile price-table stacking on `/layanan`
- **Content data** lives as arrays in frontmatter — projects, nav and rail links in `index.astro`; services and process steps in `layanan.astro`; edit those, not the markup
- **Sections** (in order, each a `md:grid-cols-[200px_1fr]` row with a numbered label): Navbar → Hero (`<header>`, full-viewport, terminal contact box) → stats bar and client strip → About (`#about`, portrait) → Experience (`#experience`, CV buttons) → Projects (`#portfolio`) → Skills (`#skills`) → Services teaser (`#services`, links to `/layanan`, no prices) → Articles (`#articles`) → Contact (`#contact`) → Footer (name, location, copyright). Pricing (IDR table) and process steps live only on `/layanan`, so the homepage reads for both recruiters and business clients
- **JS** in `assets/js/mailto.js` (homepage + `/layanan`): `mailtoHref()` prefilling a project-request email template on every `a[data-mailto]` (`data-plan` sets the service name). In `assets/js/main.js` (homepage only): `toggleDarkMode()` (called via inline `onclick`), mobile menu toggle, copy-email button, terminal tabs/copy (verb `mail`/`open` hidden below `sm` so the full address fits), `drawSun()` (redraws on theme toggle and on resize only when the canvas size actually changed), `toggleProjects()` for the hidden `[data-extra]` items in `#project-list`, CV preview modal (`openCvModal()`/`closeCvModal()` — iframe src set lazily on first open, Escape closes), footer year
- **Dark mode** via the class-based `dark` variant in `global.css` — initial theme (localStorage + `prefers-color-scheme` fallback) is applied by an inline script in `<head>` before first paint; toggle button icons are dual SVGs swapped purely via `dark:` classes, no JS icon state
- **Extra projects**: entries in `extraProjects` render as `<li data-extra class="hidden">` in the same list
- **Fonts**: Geist (body, headings, prices), JetBrains Mono (`.label`, `font-mono` stack/estimates/terminal) — loaded from Google Fonts

## Assets

- `assets/img/wahyu.jpg` — profile photo
- `assets/img/og.png` — 1200×630 share image (hero headline + dithered sun) used by OG/Twitter tags on every page
- `assets/img/favicon.svg` — "W" monogram favicon; `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` are rasterized from it with `rsvg-convert`
- `assets/pdf/cv.pdf` — resume; linked with cache-bust query (`?v=YYYY-MM`) and `download="Wahyu_Akbar_Wibowo_CV.pdf"`. When replacing the PDF, bump the `?v=` in the `cv` const in `index.astro` frontmatter and `CV_URL` in `main.js`, plus the "Terakhir diperbarui" label

## Deployment

Push to `main` to build and deploy via `.github/workflows/deploy.yml`. Set **Pages → Build and deployment → Source** to **GitHub Actions** in repository settings.
