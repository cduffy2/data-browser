# Pathways prototype

A clickable React prototype of the [Pathways digital platform](https://withpathways.org/en). Teams use it to explore and test features before they are built in production. It mirrors the live site's pages, components and data tools, using illustrative data.

> Working with an AI agent? Start with [CLAUDE.md](CLAUDE.md). It lists the rules and which doc to read for each task.

## Quick start

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npx tsc -b` | Typecheck |
| `npm run lint` | ESLint |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve the production build locally |

### Optional: AI assistant backend

The Assistant page (`#assistant`) talks to a small FastAPI service in `backend/`. Users enter their own model API key in the app; the backend holds no keys.

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # Vite proxies /api → localhost:8000 in dev
```

For deployed builds, set `VITE_BACKEND_URL` in `.env.production` (it ships with a placeholder). If it's unset, `src/pages/AssistantPage/ConversationContext.tsx` falls back to the original team's backend, so change that fallback too. `backend/railway.json` deploys it to Railway. Set `ALLOWED_ORIGINS` there to your frontend URL.

### Deploy

The frontend is a static Vite build. It is set up for Vercel: `vercel.json` rewrites every route to `index.html`.

## Documentation

| Doc | Covers |
|---|---|
| [docs/design-system.md](docs/design-system.md) | Colour, type, spacing tokens and how to use them |
| [docs/layout.md](docs/layout.md) | Page templates, breakpoints, desktop-only tools |
| [docs/components.md](docs/components.md) | Prototype components and their Storybook equivalents |
| [docs/information-architecture.md](docs/information-architecture.md) | Pages, objects (OOUX) and navigation |
| [docs/dataviz.md](docs/dataviz.md) | Chart types and presentation rules |
| [docs/data-model.md](docs/data-model.md) | Data shapes, adding indicators, swapping in real data |
| [docs/tone-of-voice.md](docs/tone-of-voice.md) | Writing style, terms, labels and caveats |

Sources of truth outside this repo:
- **Storybook** (production components): https://storybook.withpathways.org/
- **Zeroheight "Pathways Toolkit"** (brand, data visualisation, messaging): https://pathways.zeroheight.com/styleguide/s/102143
- **Live site**: https://withpathways.org/en

## Project structure

```
src/
  App.tsx              Router (hash-based) + page switch + desktop-only page list
  main.tsx             Entry point
  pages/<PageName>/    One folder per page: PageName.tsx + PageName.css
  components/
    layout/            PrimaryNavBar, LeftSidebar, Footer, GlobalSearch
    common/            Shared building blocks (Checkbox, MobileNotice, AboutThisContent…)
    data-browser/      Data browser panels, chart viewer, modals
    segment-profile/   Segment profile sections, export flows
    compare-segments/  Comparison tool modals
  data/                Illustrative data (segments, indicators, charts, articles)
  types/               TypeScript shapes for that data
  styles/              tokens.css (design tokens), global.css, reset.css
  assets/              Images, icons (SVG), fonts
backend/               Optional FastAPI service for the AI assistant
design-tokens.json     Figma token export that tokens.css is based on
```

## How routing works

There's no router library. `App.tsx` keeps `currentPage` in state and mirrors it into `window.location.hash` (e.g. `#data-browser`). Pages navigate by calling the `onNavigate(page)` prop they receive. Deep links work because the hash is read on load and on `hashchange`.

<a id="add-a-page"></a>
### Add a page

1. Create `src/pages/MyPage/MyPage.tsx` and `MyPage.css`. Copy the closest existing page as a starting template (see [docs/layout.md](docs/layout.md)).
2. Add `'my-page'` to **both** `Page` unions: in `src/App.tsx` and in `src/components/layout/LeftSidebar/LeftSidebar.tsx`.
3. In `src/App.tsx`, handle the hash in the initial `useState<Page>(() => …)` parser **and** in the `hashchange` handler.
4. Add a `case 'my-page':` to the render `switch` in `App.tsx`.
5. If it's a data tool that can't work on small screens, add it to `DESKTOP_ONLY_PAGES` and render `<MobileNotice />` after the nav.
6. Link to it from the nav (`PrimaryNavBar`) or sidebar (`LeftSidebar`) if it needs an entry point.
7. Add it to the page inventory in [docs/information-architecture.md](docs/information-architecture.md).

## Forking checklist

- [ ] Update the title and description in `index.html` and `public/og-image.png`.
- [ ] Set `VITE_BACKEND_URL` (or remove the Assistant page if you don't need it).
- [ ] Replace illustrative data in `src/data/` if you're testing with real data. See [docs/data-model.md](docs/data-model.md).
- [ ] Read [CLAUDE.md](CLAUDE.md) and keep it current as your team adds conventions.
