# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-file static portfolio site — `index.html` is the entire app. No build step, no package manager, no framework.

Live at: https://wahyuakbarwibowo.github.io

## Viewing Changes

Open `index.html` directly in browser. No server needed. For quick local serving:

```bash
python3 -m http.server 8080
```

## Architecture

Everything lives in `index.html` (~640 lines):

- **Tailwind CSS** loaded via CDN (`cdn.tailwindcss.com`) — config inline in `<script>` block at top of `<head>`
- **Custom CSS** in `<style>` tag: `.glass`, `.gradient-text`, `.hero-gradient`, `.card-hover`
- **Sections** (in order): Navbar → Hero → About (`#about`) → CV (`#cv`) → Portfolio (`#portfolio`) → Contact (`#contact`)
- **JS** inline at bottom: `toggleDarkMode()`, mobile menu toggle, smooth scroll behavior
- **Dark mode** via Tailwind `darkMode: 'class'` — toggled by adding/removing `dark` class on `<html>`
- **Brand colors** defined in Tailwind config: `brand-500` = `#255ff3` (blue)
- **Fonts**: Inter (body), Outfit (display headings) — loaded from Google Fonts

## Assets

- `assets/img/wahyu.jpg` — profile photo
- `assets/img/sana.jpg` / `sana.ico` — favicon/secondary image
- `assets/pdf/` — CV/resume files

## Deployment

Push to `main` — GitHub Pages auto-deploys from root of `main` branch.
