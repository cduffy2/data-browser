# Pathways prototype

A clickable React prototype of the Pathways digital platform (withpathways.org). It is used to explore and test new features before they are built in production. It is not production code, and its data is illustrative.

## Read the right doc first

| If you are… | Read |
|---|---|
| Adding or changing a page, route or layout | [docs/layout.md](docs/layout.md), [docs/information-architecture.md](docs/information-architecture.md) |
| Building or reusing UI | [docs/components.md](docs/components.md), [docs/design-system.md](docs/design-system.md) |
| Adding a chart or changing how data is shown | [docs/dataviz.md](docs/dataviz.md) |
| Adding indicators, segments, geographies or real data | [docs/data-model.md](docs/data-model.md) |
| Writing any user-facing text | [docs/tone-of-voice.md](docs/tone-of-voice.md) |

External sources of truth (check these before inventing anything):
- Production components: Storybook, https://storybook.withpathways.org/
- Brand, data visualisation and messaging: Zeroheight "Pathways Toolkit", https://pathways.zeroheight.com/styleguide/s/102143
- Live product: https://withpathways.org/en

## Rules

1. **Match production.** If the live site or Storybook already has a pattern, copy it rather than designing a new one.
2. **Use tokens.** Colours, spacing, radius and shadows come from `src/styles/tokens.css`. Never add a raw hex value when a token exists.
3. **Breakpoints are 600px and 900px** (plus 1200px for wide layouts). Write them as `@media (max-width: 899.98px)` and `@media (max-width: 599.98px)`. Every new site page must work at 390, 768 and 1280px wide.
4. **Data tools are desktop-first.** A tool page that can't work on small screens goes in `DESKTOP_ONLY_PAGES` (`src/App.tsx`) and renders `<MobileNotice />`. See [docs/layout.md](docs/layout.md).
5. **Segments always appear in the same order** and keep their vulnerability colour. See [docs/dataviz.md](docs/dataviz.md).
6. **Never show missing data as zero.** Missing data is N/A, with a dashed outline.
7. **Sentence case everywhere.** No ALL CAPS, and no uppercase "eyebrow" labels (`text-transform: uppercase` + letter-spacing).
8. **UK English** and the preferred terms in [docs/tone-of-voice.md](docs/tone-of-voice.md) ("digital platform", "Pathways approach", "findings").
9. **Prototype data is illustrative.** Don't present it as real findings, and keep the data shapes in `src/types/` when you add data.
10. **No new UI libraries.** Build with React + plain CSS. Charts use Recharts.

## Code conventions

- React 19 + TypeScript + Vite. Function components only.
- One folder per component: `ComponentName/ComponentName.tsx` + `ComponentName.css`. Pages live in `src/pages/PageName/`.
- CSS class names use BEM: `block__element--modifier`, with the block named after the component (`news-page__card--compact`).
- Import SVG icons as React components with `?react` (`import Icon from '../../assets/icons/Foo.svg?react'`).
- Routing is hash-based (`#data-browser`). Adding a page touches five places; follow the checklist in [README.md](README.md#add-a-page).
- Shared data lives in `src/data/`, and its types live in `src/types/`.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npx tsc -b         # typecheck
npm run lint
npm run build
```

## Definition of done

- `npx tsc -b` passes, and you haven't added new lint errors.
- You checked the change at 390, 768 and 1280px (or the page is desktop-only with `MobileNotice`).
- Copy follows [docs/tone-of-voice.md](docs/tone-of-voice.md).
- If you add a reusable component, add it to [docs/components.md](docs/components.md).
