# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`enricotazzer.github.io` — a personal blog + portfolio ("BrainNotBraining") hosted on GitHub Pages, written mostly in Italian, focused on AI/computer science. It is served directly from the repo root; there is no build step for the content itself.

## Architecture

- **Static HTML, no templating engine in practice.** Jekyll (`_config.yml`) is only used for the `jekyll-feed` plugin, which auto-generates `/feed.xml` via GitHub Pages' built-in Jekyll processing. There are no `_layouts`, `_includes`, or Liquid tags — every page is a fully self-contained HTML file with the same `<head>`, nav (`.site-nav`), and footer (`.site-footer#contact`) markup copy-pasted across files. Changes to shared chrome must be applied consistently to all 12 root HTML files.
- **Theme:** custom dark portfolio design (2026 redesign). All styling lives in [css/site.css](css/site.css) — design tokens in `:root` (near-black bg `#0A0A0B`, teal accent `#2DD4BF`, Space Grotesk headings + Inter body via Google Fonts), plus components: glass sticky nav, `.hero`/`.page-header` with `.hero-glow` gradient, `.card`/`.card-grid` project cards, `.tech-tag`, `.status-badge--progress/--completed`, `.now-panel`, `.post-list`, `.prose` article styles, `.reveal` scroll animations. Dark-only, mobile-first (card grid 1/2/3 cols at base/768/1024px).
- **Legacy:** `css/styles.css` (old Bootstrap "Clean Blog" theme) and `css/portfolio.css` still exist on disk but are **no longer linked by any page** — do not link or extend them. Bootstrap JS is gone too.
- **JS:** [js/scripts.js](js/scripts.js) — vanilla, no dependencies: mobile nav toggle (`.nav-open` on `.site-nav`, aria-expanded sync), `.nav-scrolled` state, IntersectionObserver `.reveal` scroll-fade (respects `prefers-reduced-motion`).
- **Pages** (all at repo root):
  - `index.html` — long landing: hero → "Currently Working On" `.now-panel` → Featured Projects `.card-grid` → Latest Articles `.post-list` → about teaser → footer.
  - `posts.html` — full article index; `projects.html` — portfolio grid + now-panel; `about.html` — bio (Italian, preserved verbatim) + social buttons.
  - Article pages (`introductionCognitiveAI.html`, `introductionToAiMedicine.html`, `AIBrainImaging1.html`, `risks.html`, plus empty stubs `introductiontoQuantumComputing.html`, `moraleAI.html`, `history.html`) — `.page-header` (title/subtitle/meta) + `.prose` body.
  - `blankarticle.html` — the empty template new articles are copied from.

## Adding a new article

1. Copy `blankarticle.html` to a new camelCase-named file at the repo root.
2. Fill in `.page-title`, `.page-sub`, the `.article-meta` date, and the `.prose` body.
3. Add a matching `.post-item` row (title/subtitle/meta) to **both** `posts.html` and the "Latest Articles" `.post-list` in `index.html`, most-recent-first.
4. Reference images from `assets/img/`.

There is no automation — new pages and list entries are wired up by hand across the affected files.

## Placeholders awaiting real content

- The "Currently Working On" `.now-panel` on `index.html` and `projects.html` has `<!-- TODO -->`-marked placeholder title/description.
- Project card `.tech-tag` stacks are best-guess, not owner-confirmed.
- `AIBrainImaging1.html` references `assets/img/interazione-delle-cellule-gliali-con-i-neuroni.png`, which does not exist on disk (pre-existing broken image).

## Working with this repo

- No package manager, build tool, linter, or test suite. Verify changes by serving locally (`python3 -m http.server`) and checking in a browser at 375/768/1024/1440px widths.
- Numerous stray `._*` AppleDouble files and `.DS_Store` appear in `git status` (macOS Finder artifacts) — not part of the site, don't commit them.
