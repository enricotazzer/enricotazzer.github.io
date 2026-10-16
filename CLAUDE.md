# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"BrainNotBraining" is a personal blog built with Jekyll and served by GitHub Pages. There is no CI, test suite or linter: pushing to `main` makes GitHub Pages rebuild the site with the `github-pages` gem (Jekyll 3.10, Ruby 3.3).

The site is in three languages. **Italian** is the source language and lives at `/`. **English** and **Dutch** translations live under `/en/` and `/nl/`, and a switcher in the header (IT / EN / NL) moves between them. The articles, the About page, the project texts and the site chrome (nav, footer, buttons, dates) are all translated. See "Languages" below.

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

**Layouts.** `default` holds the page shell. It renders the `head.html`, `site-header.html` and `site-footer.html` includes, plus the reading-progress bar on posts and the back-to-top button. Every other layout extends `default` directly.

- `home`, `posts-index`, `projects-index`: the bodies of the home page, `/posts/` and `/projects/`. `index.html`, `posts.html` and `projects.html` (and their copies under `en/` and `nl/`) are front matter only and pick one of these.

- `page`: the About and 404 pages. Front matter: `heading` (falls back to `title`) and `subheading`.
- `post`: renders breadcrumb, kicker (the tags), title, `subtitle` as an italic dek, a date in the page's language, read time (words / 200 + 1), and `image` as a cover figure. Also supports optional `image_alt` and `image_caption`, and a "Fonte" box when `source_url` / `source_label` are set. A translation also gets a "Translated from Italian · Read the original" line. It ends with tag links and previous/next links, which stay within the article's language.
- `github-readme-page`: a project page whose body is the repo's README, **fetched in the browser at runtime** from `raw.githubusercontent.com` and rendered with `marked` + `DOMPurify`. If the file isn't found it also tries the `main`/`master` branches and `README.md`/`readme.md`. Front matter: `github_repo`, `github_branch`, `github_readme_path`, `permalink`, `ref`, and `project_id`, which pulls the header (status chip, period, phase meter, stack) from `_data/projects.yml`.

**Projects come from data.** `_data/projects.yml` is the single source for:

- the home page's "Progetti in corso" (entries with `status: in_corso`)
- `/projects/`, grouped into in_corso, completato and archivio
- the header of each project page

The file's top comment documents every field.

The `key_result` is always a figure copied from the project's own README or docs, with its source. When the real number doesn't exist yet, it says so ("n.d."). It is never a demo or synthetic value, and negative results are stated as negative.

Each entry can have `en:` and `nl:` blocks that override its Italian text fields (`title`, `short`, `summary`, `stack`, `phase_label`, `phase_detail`, `key_value`, `key_text`, `key_source`). Anything left out falls back to Italian. Numbers are copied, never changed; only their format follows the language (0,510 in Italian and Dutch, 0.510 in English). `since`/`until` are `"YYYY-MM"` strings, so the month is printed in the page's language.

To add a project:

1. Add an entry to `_data/projects.yml`, with its `en:` and `nl:` blocks.
2. If the repo is public, copy `github-readme-template.html` to `projects/<id>.html` and remove `published: false`. Make the same page under `en/projects/` and `nl/projects/`, with the `/en/` or `/nl/` permalink, a translated `description` and the same `ref`.

**Shared includes.**

- `post-entry.html`: one article in a list. Used by the home page (ISO dates, tag links) and `/posts/` (short dates).
- `lang-posts.html`: sets `lang_posts`, the articles listed in the page's language (see "Languages").
- `project-entry.html` and `project-compact.html`: a project on `/projects/` and on the home page. Built from `meter.html`, `status-chip.html` and `project-links.html`.
- `date.html` and `month-year.html`: dates in the page's language, from the month names in `_data/i18n.yml`. Jekyll's `date` filter only knows English month names.
- `tag-label.html`: a tag's display name in the page's language.
- `translations.html` and `lang-switch.html`: the other-language versions of the current page, and the IT / EN / NL switcher.

**Permalinks.** `_config.yml` sets `permalink: /posts/:title/`, so a post's URL comes from its **filename** slug, case included: `2026-03-23-MRI-Recon.md` is served at `/posts/MRI-Recon/`.

`posts.html` and `projects.html` set explicit permalinks (`/posts/`, `/projects/`). Project pages live at `/projects/<id>/`. The translations sit at the same paths under `/en/` and `/nl/`; translated posts get `/en/posts/:title/` and `/nl/posts/:title/` from the defaults in `_config.yml`, with their own translated filename slug.

Old URLs redirect through `jekyll-redirect-from` (`redirect_from` in front matter), so links to them keep working:

- `/oracle/` goes to `/projects/oracle/`.
- The August 2026 static site's pages still redirect: `risks.html`, `AIBrainImaging1.html` and the other article pages go to their posts. `posts.html`, `projects.html` and `about.html` go to the clean URLs.
- Keep these redirects when renaming or moving a post.

**Posts.** Files in `_posts/` must be named `YYYY-MM-DD-slug.md`; without the `.md` extension Jekyll silently skips the file. Front matter: `layout: post`, `title`, `subtitle`, `date`, `image` (under `/assets/img/`), `tags` (a list).

Tags feed the filter on `/posts/`. A link to `/posts/#<tag in lowercase>` opens the page already filtered. Tags are the same English keys in every language (`Medicine`, `Ethics`…). Their display names per language are under `tags:` in `_data/i18n.yml`, so the filter links work the same in all three languages.

An article with three or more `##` headings gets a table of contents and numbered sections. Both are added by JS from kramdown's auto-generated heading ids.

**Plugins** (all on the GitHub Pages whitelist): `jekyll-seo-tag` (the `{% seo %}` tag in `head.html` makes the title, description, Open Graph and JSON-LD), `jekyll-sitemap` and `jekyll-redirect-from`.

**Feeds.** There is one Atom feed per language: `feed.xml`, `en/feed.xml` and `nl/feed.xml`, all rendered by `_includes/atom.xml`. `jekyll-feed` was dropped because its `/feed.xml` would mix all three languages. The entry ids match the ones it used, so existing subscribers of `/feed.xml` see no duplicates.

### Languages

- **Where the language comes from.** `page.lang` is set by the `defaults` in `_config.yml`: `it` everywhere, `en` for files under `en/`, `nl` under `nl/`. `site.languages` lists the three in switcher order.
- **Interface strings** are in `_data/i18n.yml`, one block per language. Layouts and includes read them as `t = site.data.i18n[page.lang]`. Each block also has `prefix` (`""`, `/en`, `/nl`), which goes in front of every internal link.
- **Strings in JavaScript** come in through data attributes: the filter words on `#filter-status`, the README messages on `#readme-config`.
- **Linking translations.** Versions of the same page or post share a `ref` value in their front matter. For posts it is the Italian slug, for example `ref: rischi-ai-sanitario`. The switcher and the `hreflang` links in `head.html` find the other versions through it. Without a translation, the switcher goes to that language's home page.
- **Untranslated articles.** An Italian article with no English or Dutch version still appears in that language's lists, labelled "In Italian" / "In het Italiaans". So a new article can be published in Italian alone and translated later.
- **Adding a translation of an article.** Copy the post to `en/_posts/` or `nl/_posts/`, giving it a translated filename slug but keeping the date. Set `ref` to the Italian slug and keep the same `image` and `tags`. Translate the title, subtitle and body. Point internal links at the same language's posts. Leave quotes in their original language, with `lang="en"` on the blockquote when the page is Dutch. Don't copy `redirect_from`.

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

One file loaded with `defer` on every page, in every language. Each part checks that its elements exist first. It handles:

- the theme toggle, kept in sync with the class the head script set
- the reading-progress bar (posts only)
- the back-to-top button
- the table of contents and current-section highlight
- the tag filter on the article index, which keeps the filter in the URL hash

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
- Translations are reviewed by hand. When you change an Italian article or project text, update the `en/` and `nl/` versions in the same change, or say clearly that they are now out of date.
