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
- **Design**: editorial, typography-led — warm paper background, hairline dividers, lists instead of cards, one accent color, no gradients/blobs/scroll effects. Keep it that way; the brief was "terlihat asli, bukan buatan AI"
- **Color tokens** are CSS variables (`--paper`, `--ink`, `--mute`, `--line`, `--accent`) defined on `:root` and overridden on `.dark`, exposed to Tailwind as `bg-paper`, `text-ink`, `text-mute`, `border-line`, `text-accent` — so no `dark:` prefixes are needed for colors
- **Custom CSS** in `<style>` tag: `.serif`, `.u` (hairline underline link), `.portrait` (grayscale photo, color on hover), `.fade` (single load-in, disabled under `prefers-reduced-motion`)
- **Sections** (in order, each a `md:grid-cols-[180px_1fr]` row with a numbered label): Navbar → Hero (`<header>`) → About (`#about`) → Experience (`#experience`, CV buttons) → Projects (`#portfolio`) → Skills (`#skills`) → Services & pricing (`#services`, IDR table) → Process (`#process`) → Contact (`#contact`) → Footer (rotating quote)
- **JS** in `assets/js/main.js`: `toggleDarkMode()` (called via inline `onclick`), mobile menu toggle, `mailtoHref()` prefilling a project-request email template on every `a[data-mailto]` (`data-plan` sets the service name), copy-email button, `toggleProjects()` for the hidden `#extra-projects` list, CV preview modal (`openCvModal()`/`closeCvModal()` — iframe src set lazily on first open, Escape closes), rotating footer `QUOTES` (8s, includes hadith), footer year
- **Dark mode** via Tailwind `darkMode: 'class'` — initial theme (localStorage + `prefers-color-scheme` fallback) is applied by an inline script in `<head>` before first paint; toggle button icons are dual SVGs swapped purely via `dark:` classes, no JS icon state
- **Extra projects** hidden by default in `<div id="extra-projects" class="hidden contents">` — `contents` makes its `<li>` children participate in the parent list when shown
- **Fonts**: Inter (body), Instrument Serif (headings, prices, `.serif`) — loaded from Google Fonts

## Assets

- `assets/img/wahyu.jpg` — profile photo (also used in OG/Twitter meta tags)
- `assets/img/favicon.svg` — "W" monogram favicon; `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` are rasterized from it with `rsvg-convert`
- `assets/img/sana.jpg` — unused legacy image
- `assets/pdf/cv.pdf` — resume; linked with cache-bust query (`?v=YYYY-MM`) and `download="Wahyu_Akbar_Wibowo_CV.pdf"`. When replacing the PDF, bump the `?v=` in all four links (hero button, experience section button, modal header ×2) and `CV_URL` in `main.js`, plus the "Terakhir diperbarui" label

## Deployment

Push to `main` to build and deploy via `.github/workflows/deploy.yml`. Set **Pages → Build and deployment → Source** to **GitHub Actions** in repository settings.
