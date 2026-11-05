# CLAUDE.md

React 18 + Vite 5 SPA + Cloudflare Worker for "Resilient Architecture by Studio 7" (RMUTT), migrated from Google Sites.
Live: https://rmuttstudio7-web.peetzaz.workers.dev — Worker `rmuttstudio7-web` (`wrangler.jsonc`). Workers Builds runs `npm run build` then `npx wrangler deploy` on push to `main`.

## Architecture
- **Routing**: real paths (`/`, `/about-us`, `/projects/2025`, `/thesis/tinn`, `/admin`). `src/routes.js` (pure, shared with the Worker) parses paths; `src/router.js` intercepts same-origin `<a href="/...">` clicks (pushState). Old `#thesis-x` hash links are redirected client-side.
- **Content**: defaults in `src/data/*.js`, combined in `src/data/index.js` (`DEFAULT_CONTENT`, top-level keys like `EVENTS`, `THESIS`, `PROJECTS`). Overrides saved from the dashboard live in KV key `content` (only keys that differ from defaults); `mergeContent` overlays per top-level key. Pages read via `useContent()` (`src/content.jsx`) — never import data modules directly in pages.
- **Worker** (`worker/index.js`): `run_worker_first` for all paths except `/assets/*` and `/img/*`. HTML requests → serves `index.html` via `env.ASSETS` with HTMLRewriter-injected `<title>`/OG meta (`src/meta.js`) and `<script id="site-content">` (KV JSON). Also `/api/*` (login/logout/me/content/history/restore/upload), `/media/<id>` (uploaded images stored in KV `media:<id>`), `/sitemap.xml`. Unknown paths → 404 status.
- **Auth**: single password secret `ADMIN_PASSWORD`; HMAC-signed HttpOnly cookie `s7_admin` (7 days) + readable hint cookie `s7_admin_ui` (UI only, not trusted). Mutating API calls check Origin.
- **Admin preview**: `src/admin/PreviewPane.jsx` loads the real page in an iframe with `?preview=1`; `src/preview.js` (in the site) receives draft content/path/highlight via `postMessage` (same origin only) and outlines the element matching `[data-edit~="<key>"]`. When adding a page section, give it a `data-edit` attribute listing the content keys (or THESIS/PROJECTS field names) it renders.
- **Admin UI** (`src/admin/`, lazy chunk): schema-driven generic editor (`Editor.jsx`) — field type inferred from key names/values in `schema.js` (images, image lists, dates, colors, long text, links, pair lists, object lists). Add Thai labels in `LABELS` when adding new fields. Draft edits live in the content context, so "ดูหน้าเว็บ" previews unsaved changes.
- **Images**: `public/img/<name>.webp` + `<name>-sm.webp`; dashboard uploads are resized in the browser (`src/admin/upload.js`: 1600px + 640px WebP, HEIC → clear error) and stored as `/media/<id>.webp` + `/media/<id>-sm.webp` (Worker falls back to full if no thumb; SVG not accepted); data keeps legacy `name.jpg` names, mapped by `imgUrl`/`thumbUrl` in `src/media.js`. Use `thumbUrl` in grids, `imgUrl` for lightbox/hero.
- **Features**: `ThesisMap` = draggable auto-rotating orthographic globe (d3-geo + world-atlas, lazy; pins from `THESIS[*].location`; paper/ink hatch style), `Countdown` + `calendar.js` (Google Calendar/.ics, Asia/Bangkok UTC+7), `WaterGauge` (scroll progress as water level).
- **Loader**: `index.html` contains an inline `#boot` intro in drafting style (construction lines → ink outline → hatch → poché fill, scale bar) shown only on the first visit / after 30 days (`localStorage['s7-intro']`, decided by an inline `<head>` script that sets `html.no-intro` or `html.boot-lock`). `src/boot.js` removes it and adds `html.booted`. `RouteLoader` shows only if above-the-fold images take >600ms.
- **Motion**: add `data-reveal` (+ optional `style={{'--d': n}}` stagger) to reveal on scroll (`hooks/useReveal.js`); `.hero-in` and `SplitTitle` animate on mount after `html.booted`. All motion is disabled under `prefers-reduced-motion`.
- Styling: `src/styles.css` (site) and `src/admin/admin.css`; color tokens on `:root` with dark-mode overrides. Each page sets an accent via `.accent-<color>` → `--accent` (used for lines/fills, never text on white). Fonts: Archivo (display), IBM Plex Sans Thai (body), IBM Plex Mono (labels). Don't name classes `split` (layout grid) for anything else.

## Local dev
`cp .dev.vars.example .dev.vars` then `npm run dev:worker` (wrangler dev on :8787 with local KV).

## Content notes carried over from the original site
- Projects 2027 on Google Sites was a copy of 2024; only the intro was migrated.
- `p4-2026` text on Google Sites was a copy of p1-2024; only images were migrated.
- Alumni Generation 4 (2027) lists the same names as Generation 3 on the original.
- Several thesis map locations are approximate (`location.approx: true`).

## Status (handoff, 2026-11-05)
- Live on `main` (868ba99): migrated site, path URLs + WebP, admin dashboard (KV + `ADMIN_PASSWORD` set as a **Runtime** Secret, not a Build variable), drafting-style redesign, first-visit intro, globe, upload thumbnails, light dashboard with page-register overview and live preview pane.
- Workflow agreed with the owner: work on a branch, show screenshots/video, **ask before merging to `main`** (every push to `main` deploys).
- Local test password lives in `.dev.vars` (gitignored). Reset local KV with `rm -rf .wrangler/state`. `wrangler dev` crashes if `dist/` is rebuilt while it runs — restart it after `npm run build`.
- Cloud sessions so far could not reach the live `*.workers.dev` URL; verify locally with `wrangler dev` + Playwright.
- Open content questions for the owner: 19.01.27 labelled WED (is Tuesday) and 21.07.25 labelled TUE (is Monday) on the original site; footer email shown as info@rastudio7.co.th but the original mailto was info@ras7.co.th; two 2026 thesis cards have no title; 4 participants in 2025 have no photo; Projects 2027 and Alumni Gen 4 are placeholders.
- Offered but not built: TH/EN language toggle, site search, flip-book portfolio viewer, custom domain.
