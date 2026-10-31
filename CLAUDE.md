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

Homepage markup lives in `src/pages/index.astro`; behavior lives in `public/assets/js/main.js` (loaded with `defer` at the end of `<body>`). `src/articles.json` supplies both the homepage list and statically generated article pages in `src/pages/articles/[slug].astro`:

- **Tailwind CSS** loaded via CDN (`cdn.tailwindcss.com`) — config inline in `<script>` block at top of `<head>`
- **Design**: dark-first developer-tool look (inspired by omp.sh) — near-black background with CSS film grain (`body::after`), Geist headings (medium, tight), three-tone display headlines (ink / mute / magenta accent), JetBrains Mono wide-tracked uppercase labels (`.label`, teal `accent2` eyebrow), hairline dividers, lists/tables instead of cards. Hero has a terminal-style contact box (`.term-tab` tabs + COPY) and a static pixel-dithered planet drawn on `#planet` canvas (dark mode only). Desktop (`xl`) has a fixed numbered section rail (`.rail-item`). No scroll effects
- **Color tokens** are CSS variables (`--paper`, `--ink`, `--mute`, `--line`, `--accent`, `--accent-2`, `--panel`) defined in `site.css` on `:root` and overridden on `.dark`, exposed to Tailwind as `bg-paper`, `text-ink`, `text-mute`, `border-line`, `text-accent`, `text-accent2`, `bg-panel` — so no `dark:` prefixes are needed for colors
- **Shared CSS** in `public/assets/css/site.css`: color tokens, grain, `.label`, `.u` (hairline underline link), `.term-tab`, `.rail-item`, keyboard focus, skip link, contact email sizing, article spacing, and reduced motion.
- **Page CSS** in `<style>` tag: `.portrait` (grayscale photo), `.fade` (single load-in, disabled under `prefers-reduced-motion`), mobile price-table stacking
- **Content data** (projects, services, process steps, nav and rail links) lives as arrays in the `index.astro` frontmatter; edit those, not the markup
- **Sections** (in order, each a `md:grid-cols-[200px_1fr]` row with a numbered label): Navbar → Hero (`<header>`, full-viewport, terminal contact box) → stats bar and client strip → About (`#about`, portrait) → Experience (`#experience`, CV buttons) → Projects (`#portfolio`) → Skills (`#skills`) → Services & pricing (`#services`, IDR table) → Process (`#process`) → Contact (`#contact`) → Footer (name, location, copyright)
- **JS** in `assets/js/main.js`: `toggleDarkMode()` (called via inline `onclick`), mobile menu toggle, `mailtoHref()` prefilling a project-request email template on every `a[data-mailto]` (`data-plan` sets the service name), copy-email button, terminal tabs/copy, `drawPlanet()` (redraws on resize and when switching to dark), `toggleProjects()` for the hidden `[data-extra]` items in `#project-list`, CV preview modal (`openCvModal()`/`closeCvModal()` — iframe src set lazily on first open, Escape closes), footer year
- **Dark mode** via Tailwind `darkMode: 'class'` — dark is the default; light only when `localStorage.theme === 'light'`, applied by an inline script in `<head>` before first paint; toggle button icons are dual SVGs swapped purely via `dark:` classes, no JS icon state
- **Extra projects**: entries in `extraProjects` render as `<li data-extra class="hidden">` in the same list
- **Fonts**: Geist (body, headings, prices), JetBrains Mono (`.label`, `font-mono` stack/estimates/terminal) — loaded from Google Fonts

## Assets

- `assets/img/wahyu.jpg` — profile photo (also used in OG/Twitter meta tags)
- `assets/img/favicon.svg` — "W" monogram favicon; `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` are rasterized from it with `rsvg-convert`
- `assets/img/sana.jpg` — unused legacy image
- `assets/pdf/cv.pdf` — resume; linked with cache-bust query (`?v=YYYY-MM`) and `download="Wahyu_Akbar_Wibowo_CV.pdf"`. When replacing the PDF, bump the `?v=` in the `cv` const in `index.astro` frontmatter and `CV_URL` in `main.js`, plus the "Terakhir diperbarui" label

## Deployment

Push to `main` to build and deploy via `.github/workflows/deploy.yml`. Set **Pages → Build and deployment → Source** to **GitHub Actions** in repository settings.
