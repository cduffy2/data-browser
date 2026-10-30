# Design system

How to use colour, type, spacing and other tokens in the prototype.

- **Values** live in [`src/styles/tokens.css`](../src/styles/tokens.css). It was generated from the Figma export [`design-tokens.json`](../design-tokens.json). This doc doesn't repeat hex values, so read the token file.
- **Brand guidance** lives in Zeroheight: [Brand Colors](https://pathways.zeroheight.com/styleguide/s/102143/p/971a7c), [Typography](https://pathways.zeroheight.com/styleguide/s/102143/p/963586), [Iconography](https://pathways.zeroheight.com/styleguide/s/102143/p/327e56), [Illustrations](https://pathways.zeroheight.com/styleguide/s/102143/p/28276a), [Photography](https://pathways.zeroheight.com/styleguide/s/102143/p/761d50).
- **Production components** are in [Storybook](https://storybook.withpathways.org/).

## Rules

1. Use a `var(--token)` whenever a token exists. Don't add new raw hex values.
2. Use one colour family per view. Neutrals do most of the work; colour is for meaning (vulnerability, data, links, status).
3. Vulnerability colours are reserved for vulnerability levels. Don't use red, purple, blue or green decoratively.
4. Text must meet contrast standards against its background. Use `--text-primary` or `--text-secondary` for body copy on light backgrounds.
5. Use sentence case. Never use `text-transform: uppercase` for labels or eyebrows.

## Colour

| Group | Tokens | Use for |
|---|---|---|
| Neutrals | `--neutral-050` … `--neutral-900` | Backgrounds, borders, text, line art. The warm "beige" look of Pathways comes from here. |
| Backgrounds | `--background-body` (white), `--background-page` (off-white), `--background-level1/2/3` | Page vs card vs raised surfaces. Hero bands use light beige `#F3F3E6` (Zeroheight "light beige"). |
| Text | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-link`, `--text-link-hover` | Headings and body / secondary copy / helper text and captions / links |
| Interactive neutrals | `--neutral-plain-hoverbg`, `--neutral-plain-activebg`, `--neutral-outlined-border`, `--neutral-soft-bg` | Hover and selected states for nav items, chips, list rows, outlined buttons |
| Primary (blue) | `--primary-050` … `--primary-900` | Links (`--primary-600`), focus rings (`--focus-visible`), selected controls |
| Status | `--success-*`, `--warning-*`, `--danger-*` | Validation, banners, errors only |
| Vulnerability | `--vulnerability-{least,less,more,most}-{050,light,dark…}` | Segment badges, segment cards, segment fills in charts. **Least = green, Less = blue, More = purple, Most = red.** |
| Data | `--data-categorical-1` … `-10`, `--segment-rural`, `--segment-urban` | Charts only. Order and meaning are in [dataviz.md](dataviz.md). |

Common UI values that are used as literals today and should map to tokens:

| Literal | Token |
|---|---|
| `#E5E5DC` (borders, chips, hover) | `--neutral-200` / `--neutral-outlined-border` |
| `#DCDACD` (selected) | `--neutral-300` / `--neutral-plain-activebg` |
| `#383633` (dark buttons) | `--neutral-700` |
| `#1F1E1C` (dark button hover, primary text) | `--text-primary` |
| `#026ACC` (links) | `--text-link` |

The tokens file has a "Legacy / mixed mode" section (`--color-gray-*`, `--color-badge-*`, `--color-beige*`…). Don't use these in new work. Prefer the Pathways 2025 tokens above.

## Typography

- **Inter** for 90% of text: UI, headings, body. Both fonts load from Google Fonts in `index.html`; `public/fonts/` holds Inter files for PDF export.
- **Noto Serif** for the other 10%: long-form body copy in articles and explainers, card descriptions, quotes and highlighted numbers.
- `--font-family-base` in tokens.css is a system stack. Components set `font-family: 'Inter', sans-serif` explicitly; do the same.

Scale used on the site (desktop → phone):

| Role | Desktop | Phone (<600px) | Weight |
|---|---|---|---|
| Page hero title | 36–48px | 28px | 700 |
| Section title | 30–36px | 24–28px | 700 |
| Card title | 24px | 20px | 600 |
| Body (Inter) | 16–18px | 16–17px | 400 |
| Body (Noto Serif) | 18px | 17px | 400 |
| Small / meta / captions | 14px | 14px | 400–600 |

Line height is 1.33 for headings and 1.5–1.55 for body. Keep paragraphs to about 10–12 words per line and under 5 lines.

## Spacing, radius, elevation

- Spacing: `--space-1` (4px) to `--space-12` (48px). Section padding on site pages is 80–112px on desktop, 48px on tablet and phone. Page gutters are 40–64px on desktop, 20–24px on tablet and phone.
- Radius: buttons and inputs 6px, cards 0–12px (match the closest production component), pills 24px, avatars and flags 50%.
- Note: `tokens.css` sets `--border-radius-sm` to 4px, but the Figma export uses 6px (`radius-sm`). Buttons in production use 6px.
- Shadows: `--shadow-sm/md/lg`. Dropdowns and menus use `0 4px 16px rgba(21,21,21,.12)`.
- Motion: `--transition-fast` (150ms) for hover, 300ms ease for panels and drawers.

## Iconography and imagery

- Icons are SVG in `src/assets/icons/`, imported as components (`Icon.svg?react`) so they inherit `currentColor`. 16–24px, matching the nearest production use.
- Illustrations (line art on warm beige) live in `src/assets/` and `src/assets/new-images/`. Follow Zeroheight [Illustrations](https://pathways.zeroheight.com/styleguide/s/102143/p/28276a).
- Photos need a credit and consent. See [tone-of-voice.md](tone-of-voice.md#credits).
