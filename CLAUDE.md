# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"BrainNotBraining" is a personal blog built with Jekyll and served by GitHub Pages. There is no CI, test suite or linter: pushing to `main` makes GitHub Pages rebuild the site with the `github-pages` gem (Jekyll 3.10, Ruby 3.3). Everything is in **Italian**, both the articles and the site chrome (nav, footer, buttons, dates).

The look is a "research journal": paper background, serif reading text, monospace for dates and data, one teal accent.

## Local development

```sh
export PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH   # Homebrew Ruby 3.3, matching GitHub Pages
bundle install                                      # gems go to vendor/bundle (see .bundle/config)
bundle exec jekyll serve --livereload               # http://localhost:4000
bundle exec jekyll build --strict_front_matter      # the only compile check there is
```

Use Ruby 3.3. Ruby 4 makes bundler fall back to an old `github-pages` with Jekyll 3.9, which fails to load `csv`.

## Architecture

**Layouts.** `default` holds the page shell. It renders the `head.html`, `site-header.html` and `site-footer.html` includes, plus the reading-progress bar on posts and the back-to-top button. `page`, `post` and `github-readme-page` all extend `default` directly.

- `page`: the About and 404 pages. Front matter: `heading` (falls back to `title`) and `subheading`.
- `post`: renders breadcrumb, kicker (the tags), title, `subtitle` as an italic dek, an Italian date, read time (words / 200 + 1), and `image` as a cover figure. Also supports optional `image_alt` and `image_caption`, and a "Fonte" box when `source_url` / `source_label` are set. It ends with tag links and previous/next links.
- `github-readme-page`: a project page whose body is the repo's README, **fetched in the browser at runtime** from `raw.githubusercontent.com` and rendered with `marked` + `DOMPurify`. If the file isn't found it also tries the `main`/`master` branches and `README.md`/`readme.md`. Front matter: `github_repo`, `github_branch`, `github_readme_path`, `permalink`, and `project_id`, which pulls the header (status chip, period, phase meter, stack) from `_data/projects.yml`.

**Projects come from data.** `_data/projects.yml` is the single source for:

- the home page's "Progetti in corso" (entries with `status: in_corso`)
- `/projects/`, grouped into in_corso, completato and archivio
- the header of each project page

The file's top comment documents every field.

The `key_result` is always a figure copied from the project's own README or docs, with its source. When the real number doesn't exist yet, it says so ("n.d."). It is never a demo or synthetic value, and negative results are stated as negative.

To add a project:

1. Add an entry to `_data/projects.yml`.
2. If the repo is public, copy `github-readme-template.html` to `projects/<id>.html` and remove `published: false`.

**Shared includes.**

- `post-entry.html`: one article in a list. Used by the home page (ISO dates, tag links) and `/posts/` (short dates).
- `project-entry.html` and `project-compact.html`: a project on `/projects/` and on the home page. Built from `meter.html`, `status-chip.html` and `project-links.html`.
- `date.html`: Italian dates. Jekyll's `date` filter only knows English month names.

**Permalinks.** `_config.yml` sets `permalink: /posts/:title/`, so a post's URL comes from its **filename** slug, case included: `2026-03-23-MRI-Recon.md` is served at `/posts/MRI-Recon/`.

`posts.html` and `projects.html` set explicit permalinks (`/posts/`, `/projects/`). Project pages live at `/projects/<id>/`.

Old URLs redirect through `jekyll-redirect-from` (`redirect_from` in front matter), so links to them keep working:

- `/oracle/` goes to `/projects/oracle/`.
- The August 2026 static site's pages still redirect: `risks.html`, `AIBrainImaging1.html` and the other article pages go to their posts. `posts.html`, `projects.html` and `about.html` go to the clean URLs.
- Keep these redirects when renaming or moving a post.

**Posts.** Files in `_posts/` must be named `YYYY-MM-DD-slug.md`; without the `.md` extension Jekyll silently skips the file. Front matter: `layout: post`, `title`, `subtitle`, `date`, `image` (under `/assets/img/`), `tags` (a list).

Tags feed the filter on `/posts/`. A link to `/posts/#<tag in lowercase>` opens the page already filtered.

An article with three or more `##` headings gets a table of contents and numbered sections. Both are added by JS from kramdown's auto-generated heading ids.

**Plugins** (all on the GitHub Pages whitelist): `jekyll-feed`, `jekyll-seo-tag` (the `{% seo %}` tag in `head.html` makes the title, description, Open Graph and JSON-LD), `jekyll-sitemap` and `jekyll-redirect-from`.

### Styling (`css/journal.css`)

- One stylesheet. There is no Bootstrap or Font Awesome any more, so Bootstrap classes do nothing. Icons are inline SVG.
- **Colors** are tokens on `:root`. Dark mode is the `html.dark-mode` class, which redefines the same tokens. An inline script in `_includes/head.html` sets the class before first paint, from `localStorage.darkMode` (`'on'`/`'off'`) or else the OS setting.
- **Adding a component:** use the tokens, never raw hex, and it works in both themes. The contrast ratios are in the file's header comment.
- **Rules:**
  - Don't use `!important`.
  - Write every transition against `--dur`. `prefers-reduced-motion` sets `--dur` to 0.
  - Keep `:focus-visible` rings intact.
- **Old posts** still use `<blockquote class="blockquote">` with a `<p>` attribution, and `<span class="caption">`. Both are styled under `.prose`.

### JavaScript (`js/scripts.js`)

One file loaded with `defer` on every page. Each part checks that its elements exist first. It handles:

- the theme toggle, kept in sync with the class the head script set
- the reading-progress bar (posts only)
- the back-to-top button
- the table of contents and current-section highlight
- the tag filter on `/posts/`, which keeps the filter in the URL hash

There is no scroll-reveal and no page-exit fade any more. Links behave natively, so cmd/ctrl-click works.

## History

The Jekyll site was archived in August 2026 as the `jekyll-archive-march2026` branch. For a while, `main` served a hand-written static dark portfolio instead. The October 2026 journal redesign merged that version back into `main`.

The static version's content was carried over:

- the CV at `assets/CV_Tazzer.pdf`, linked from the footer, About and Projects
- its extra projects, now in `_data/projects.yml`

Its pages and `css/site.css` were removed. They remain in git history (commit `4e88588`).

Before planning changes, run `git fetch` and compare with `origin/main`.

## Repo hygiene

- `.gitignore` covers `_site/`, `.jekyll-cache/`, `.bundle/`, `vendor/` and `.DS_Store`.
- `github-readme-template.html` has `published: false`. It is a template to copy, not a page.
