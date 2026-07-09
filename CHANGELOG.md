# Changelog

## 2026-07-08 — Version 3 theme and org-wide search

- Migrated the v3 rebuild (`thewhitestonefoundation-v3`) into this repo: Eleventy 4 alpha,
  `src/` input, redesigned theme, Pagefind Component UI search, JSON/RSS/Atom feeds,
  panelists/publications/videos sections.
- Retargeted the build output to `_site/` so the existing Netlify pipeline
  (`npm run build` → `_site`) works unchanged; dropped the xmit deploy path.
- Wired Sequoia staging (`sequoia:stage`) into `npm run build`; the staging script now
  reads `src/content/posts/`.
- Added Categories, Tags, and Authors archive + index pages in the v3 design system.
- Added per-post BlogPosting JSON-LD alongside the site-wide schema graph.
- Removed the semantic-vector search and cross-site metasearch/allsites pipeline
  (including `ingest-allsites.yml`); replaced by Pagefind multisite search.
- New org-wide search at `/metadata/search/`: merges the Pagefind indexes of
  jcrt.org, thenewpolis.com, journal.thenewpolis.com, and esthesis.org with this
  site's own index, browser-side via `mergeIndex` (each site now serves CORS headers
  on `/pagefind/*`).

---

The sections below summarize the original site build.

## Major Setup and Structure
- Built a new Eleventy site scaffold under `thewhitestonefoundation-content` with:
  - `eleventy.config.js`
  - `package.json` and `package-lock.json`
  - `_data/metadata.js`
  - `_includes/base.njk` and `_includes/post.njk`
  - `content/pages/` and `content/posts/`
  - `public/` for static assets
  - `content/redirects.njk` for redirects
- Added Luxon date filter usage for dynamic year in the footer.

## Content Import and Conversion
- Imported WordPress HTML content from `thewhitestonefoundation.org` into Eleventy content.
- Converted all posts and pages to Markdown-It compliant Markdown (no raw HTML in body content).
- Normalized front matter and layout defaults (pages.11tydata.cjs and posts.11tydata.cjs).

## Navigation and Layout
- Added site logo and site title to the header.
- Built horizontal navigation with dropdowns:
  - Events dropdown with: Higher Ed, Videos, Panelists
  - Search dropdown with: Site Search and Metadata Search
- Added a strong horizontal rule under navigation and aligned nav items.
- Ensured page titles display on all pages.

## Styling
- Applied CSS from the Esthesis project to `public/css/style.css` and wired it into the layout.
- Updated styles for nav dropdown alignment, logo grid, and contact form.
- Centered the logo grid on the homepage and set all logos to 150x150.

## Search and Metadata Search
- Enabled Pagefind for local site search at `/search/`.
- Added metadata search at `/metadata/search/` using a configurable `_data/metasearch.json`.
- Unified metadata search to use only `metadata-search.njk` and removed `metasearch.njk`.
- Ensured metadata search uses the local origin for pagefind when `local: true` is set.
- Built JSON metadata index at `/metadata/search.json` with:
  - title, description, author, URL
  - 200-word excerpt for low-priority content
  - categories and tags
- Filtered metadata index to only include `.md` pages and posts.
- Removed HTML-escaped `&quot;` in JSON output to keep data clean.

## Feeds, Sitemap, Robots, Humans
- Added feed templates: `feed.xml`, `feed.rss`, `feed.json`, and `twtxt`.
- Added `sitemap.xml`, `robots.txt`, and `humans.txt` templates.

## Pages and Content Updates
- Added/updated pages:
  - `/news/` (list of posts with title, date, author, italic description + ellipsis)
  - `/higher-ed/` (list of posts tagged as higher ed)
  - `/contact/` (form layout via `_includes/form.njk`)
  - `/events/`, `/videos/`, `/panelists/`, `/people/`, `/mission/`
- Ensured `/pages/` content uses page layout and does not show author/date.
- Updated titles and replaced HTML ellipsis (`&#8230;`) with unicode ellipsis.

## Media and Assets
- Copied WordPress uploads into `public/images/wp-content/uploads`.
- Added site logo and favicon: `/images/whitestone-logo.png`.
- Fixed broken video embeds by converting to YouTube iframes.

## Redirects
- Added redirects for category and archive changes:
  - `/uncategorized/announcing-whitestone-thought-leader-symposia/` → `/academia/announcing-whitestone-thought-leader-symposia/`
  - `/2025/` → `/archive/`
  - `/2025/08/` → `/archive/`

## Category and Permalink Normalization
- Replaced `uncategorized` category with `academia` and updated permalinks accordingly.

## Pagefind Indexing
- Ran Pagefind to generate the index in `_site/pagefind/`.
- Added local override for Pagefind in metadata search.

## Git Hygiene
- Added `.gitignore` for macOS + Eleventy projects.
- Removed `_site/` and `node_modules/` from git tracking.

## Known Follow-Ups
- If search results are stale, re-run `npm run build` to regenerate the Pagefind index.
- Ensure Pagefind runs on deploy (if hosting doesn’t allow npx, use the bundled binary or build-step script).

