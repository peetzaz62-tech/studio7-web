# CLAUDE.md

Static React 18 + Vite 5 site for "Resilient Architecture by Studio 7" (RMUTT), migrated from Google Sites.
Deployed as a Cloudflare Worker with static assets (`wrangler.jsonc`, worker name `studio7-web`): Workers Builds runs `npm run build` then `npx wrangler deploy` on every push to `main`.

## Architecture
- No router library. `src/router.js` routes on a plain `location.hash` (`#events`, `#projects-2025`, `#thesis-tinn`).
  Route names must be ASCII letters/digits/hyphens only (claude.ai artifact constraint) — no `#/path`, no underscores.
- `src/App.jsx` maps a route to a page in `src/pages/`. Thesis routes are `thesis-<key>` where `<key>` is a key of `THESIS` in `src/data/thesis.js`.
- All content lives in `src/data/*.js`; pages are presentational. Prefer editing data over JSX.
- Images are in `public/img/` and referenced as `./img/<file>` (Vite `base: './'`).
- `import.meta.env.VITE_ARTIFACT` is set only by `npm run build:artifact` (claude.ai preview): it swaps YouTube iframes for link cards and drops `mailto:`. The real site (`npm run build`) embeds videos.
- Styling: one file, `src/styles.css`. Color tokens on `:root` with dark-mode overrides (prefers-color-scheme + `[data-theme]`). Neon marker tags (`.tag-green/cyan/yellow/blue/orange/red/pink`) mirror the original site; each year/page has an accent.

## Content notes carried over from the original site
- Projects 2027 on Google Sites was a copy of 2024; only the intro was migrated.
- `thesis.js` → `p4-2026` text on Google Sites was a copy of p1-2024; only images were migrated.
- Alumni Generation 4 (2027) lists the same names as Generation 3 on the original.
