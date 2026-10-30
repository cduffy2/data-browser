# Layout

Page templates, breakpoints, and how pages behave on small screens.

## Breakpoints

These match the live site (MUI Joy defaults):

| Name | Width | Query |
|---|---|---|
| Phone | < 600px | `@media (max-width: 599.98px)` |
| Tablet | 600–899px | `@media (max-width: 899.98px)` |
| Desktop | ≥ 900px | default styles |
| Wide | ≥ 1200px | `@media (min-width: 1200px)` |

- Write desktop styles first, then override in the 899.98 and 599.98 blocks at the bottom of the component's CSS file.
- Exception: the top nav switches to the hamburger at **1007px** (`PrimaryNavBar.css`). Live switches at 900px, but its full nav overflows at that width.
- Always check pages at **390, 768 and 1280px**.

## Page templates

### 1. Site page (no sidebar)

Welcome, Blog, Blog post, Resources, Contact, guides and explainers.

```
PrimaryNavBar
Hero band (light beige #F3F3E6, centred title + subtitle)
Wave divider (src/assets/Wave.svg)
Sections (max-width 1200–1360px, centred)
Newsletter CTA (welcome-newsletter, with waves)
Footer
```

- Content width: `max-width: 1200px` (lists, grids) or 768px (article body), centred, with 40–64px gutters on desktop and 20–24px on tablet and phone.
- Grids: 3 columns on desktop → 2 on tablet → 1 on phone.
- Reference: `src/pages/NewsPage/` (hero, highlights, filters, pagination), `src/pages/NewsDetailPage/` (article).

### 2. Tool page (segmentation sidebar)

Kenya overview, Data browser, Comparison tool, Prevalence map, Typing tools, Segment profiles.

```
PrimaryNavBar
┌ LeftSidebar ┬ Page header (title, description, actions, health area chips) ┐
│ (geography, │ Panels (e.g. indicator list | chart)                         │
│  tools,     │                                                             │
│  segments)  │                                                             │
└─────────────┴─────────────────────────────────────────────────────────────┘
```

- On desktop the page fills the viewport (`height: 100vh; overflow: hidden`) and the panels scroll internally.
- Below 900px, either:
  - **make it responsive**: hide the sidebar, show the geography above the title, let the page scroll and turn side panels into full-screen sheets (reference: `src/pages/DataBrowserPage/`); or
  - **mark it desktop-only** (below).

## Desktop-only pages

Some tools don't work on small screens. List them in `DESKTOP_ONLY_PAGES` in `src/App.tsx`. That sets `body.desktop-only` (`min-width: 1200px`), so the page keeps its desktop layout and scrolls sideways instead of breaking.

To match live, render the notice straight after the nav:

```tsx
<PrimaryNavBar … />
<MobileNotice />
<div className="my-tool__main">…</div>
```

Below 900px, `MobileNotice` (`src/components/common/MobileNotice/`) shows "Limited mobile experience" with **Continue to desktop version** and **Back to previous page**. It hides everything after it until the user continues.

| Page | Status |
|---|---|
| Comparison tool, Prevalence map | Desktop-only + `MobileNotice` |
| Segment profile, Walk in her shoes, Assistant, Domain detail | Desktop-only, no notice yet |
| Data browser, Welcome, Blog, Blog post, Resources, Contact, Typing tools | Responsive |
| Kenya overview, Segmentations, explainers, guides | Not yet responsive (overflow on phones) |

## Recurring patterns

- **Wave dividers** between sections: an SVG path with `preserveAspectRatio="none"`, filled with the colour of the next section. See `.welcome-newsletter__wave` in `WelcomePage.css`.
- **Sticky nav** hides on scroll down and shows on scroll up (`PrimaryNavBar`). `--nav-height` is 56px on desktop and 64px below 1007px. Offset sticky elements and `scroll-margin-top` with `var(--nav-height)`.
- **Mobile menu**: full-screen panel with a search field, rows of 48px, and drill-in sub-panels with Back (Segmentations, Resources).
- **Sheets on mobile**: full-screen, slide up, with a title and ✕ at the top and a primary "Close this window" button at the bottom (data browser "Change data point").
