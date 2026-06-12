# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio site — `index.html` plus one JS file. No build step, no package manager, no framework. Site copy is in Indonesian (`lang="id"`).

Live at: https://wahyuakbarwibowo.github.io

## Viewing Changes

Open `index.html` directly in browser. No server needed. For quick local serving:

```bash
python3 -m http.server 8080
```

## Architecture

Markup and styling live in `index.html` (~580 lines); behavior lives in `assets/js/main.js` (loaded with `defer` at the end of `<body>`):

- **Tailwind CSS** loaded via CDN (`cdn.tailwindcss.com`) — config inline in `<script>` block at top of `<head>`
- **Custom CSS** in `<style>` tag: `.glass`, `.gradient-text`, `.hero-gradient`, `.card-hover`
- **Sections** (in order): Navbar → Hero → About (`#about`) → CV (`#cv`) → Portfolio (`#portfolio`) → Contact (`#contact`) → Footer
- **JS** in `assets/js/main.js`: `toggleDarkMode()` (called via inline `onclick`), navbar shrink on scroll, mobile menu toggle, `toggleProjects()` for the hidden `#extra-projects` grid ("Lihat Semua Proyek" button), CV preview modal (`openCvModal()`/`closeCvModal()` — iframe src set lazily on first open, Escape closes), footer year
- **Dark mode** via Tailwind `darkMode: 'class'` — initial theme (localStorage + `prefers-color-scheme` fallback) is applied by an inline script in `<head>` before first paint; toggle button icons are dual SVGs swapped purely via `dark:` classes, no JS icon state
- **Extra projects** hidden by default in `<div id="extra-projects" class="hidden contents">` — `contents` makes its children participate in the parent grid when shown
- **Brand colors** defined in Tailwind config: `brand-500` = `#255ff3` (blue)
- **Fonts**: Inter (body), Outfit (display headings) — loaded from Google Fonts

## Assets

- `assets/img/wahyu.jpg` — profile photo (also used in OG/Twitter meta tags)
- `assets/img/sana.jpg` / `sana.ico` — favicon/secondary image
- `assets/pdf/cv.pdf` — resume; linked with cache-bust query (`?v=YYYY-MM`) and `download="Wahyu_Akbar_Wibowo_CV.pdf"`. When replacing the PDF, bump the `?v=` in all three links (CV section button, modal header ×2) and `CV_URL` in `main.js`, plus the "Terakhir diperbarui" label

## Deployment

Push to `main` — GitHub Pages auto-deploys from root of `main` branch.
