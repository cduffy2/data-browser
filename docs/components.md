# Components

The prototype's components, when to use them, and their production equivalent in [Storybook](https://storybook.withpathways.org/).

**Before building anything new:**
1. Check Storybook. If production has it, match its look and behaviour.
2. Check this list. If the prototype already has it, reuse or extend it.
3. Only then create a new component, and add it to this doc.

Components are plain React + CSS: one folder each (`Name/Name.tsx` + `Name.css`) with BEM class names. They aren't a published library, so copying a pattern from a page is fine when there's no shared component yet.

## Layout

| Component | Use | Storybook |
|---|---|---|
| `layout/PrimaryNavBar` | Top nav on every page. Props: `currentPage`, `onNavigate`. Holds the Segmentations dropdown, global search trigger, and the mobile menu (search field, drill-in panels for Segmentations and Resources). | [UI/Top navigation](https://storybook.withpathways.org/?path=/docs/ui-top-navigation--docs) |
| `layout/LeftSidebar` | Segmentation sidebar on tool pages: geography, tools (Comparison tool, Data browser, Prevalence map, Typing tools & more) and segment profile links with level badges. | [Sidebar/SidebarItem](https://storybook.withpathways.org/?path=/docs/components-sidebar-sidebaritem--docs) |
| `layout/Footer` | Footer on every page. No props. | prototype-only (matches live) |
| `layout/GlobalSearch` | ⌘K search dialog, opened from the nav. | prototype-only |

## Common

| Component | Use | Storybook |
|---|---|---|
| `common/Checkbox` | Controlled checkbox: `checked`, `onChange(checked)`. Stops click propagation, so it can sit inside a clickable row. | [Checkbox](https://storybook.withpathways.org/?path=/story/components-checkbox--unchecked) |
| `common/MobileNotice` | "Limited mobile experience" notice for desktop-only tools. Place it straight after `PrimaryNavBar`. See [layout.md](layout.md#desktop-only-pages). | prototype-only (matches live) |
| `common/AboutThisContent` | "About this content" disclosure on overview and profile pages (sources, technical notes). | [Banners](https://storybook.withpathways.org/?path=/story/components-banners--new-here) (closest) |

### Buttons (CSS patterns, not a shared component yet)

| Style | Look | Example class |
|---|---|---|
| Primary dark | `--neutral-700` fill, white text, 6px radius, 44–52px tall | `.welcome-newsletter__btn`, `.data-browser-page__dark-btn` |
| Neutral / outlined | White fill, `--neutral-200` border, dark text | `.news-page__filters-btn`, `.page-header__actions-trigger` |
| Soft | `--neutral-200` fill, dark text, arrow icon | `.resources-page__explainer-btn` |
| Link | `--text-link`, 600 weight, arrow icon | `.news-page__read-more` |

Storybook: [Button](https://storybook.withpathways.org/?path=/story/components-buttons-button--default), [NeutralButton](https://storybook.withpathways.org/?path=/story/components-buttons-neutralbutton--default), [LinkButton](https://storybook.withpathways.org/?path=/story/components-buttons-linkbutton--default), [IconButton](https://storybook.withpathways.org/?path=/story/components-buttons-iconbutton--default), [HealthAreaButton](https://storybook.withpathways.org/?path=/story/components-buttons-healthareabutton--default).

## Data browser

| Component | Use | Storybook |
|---|---|---|
| `data-browser/PageHeader` | Tool header: title, description, Download/Compare actions, standard-error toggle, health area chips. Below 900px it shows the geography and an **Actions ⋮** menu. | [Segmentation page header](https://storybook.withpathways.org/?path=/story/ui-segmentation-page-header--default), [HealthAreaButton](https://storybook.withpathways.org/?path=/story/components-buttons-healthareabutton--default), [Toggle](https://storybook.withpathways.org/?path=/story/components-toggle-switch--off) |
| `data-browser/DataCategoryPanel` | Searchable, collapsible indicator list grouped by category → subcategory, with checkboxes to select indicators for comparison. | [CheckboxMenuItem](https://storybook.withpathways.org/?path=/docs/components-data-point-selection-checkboxmenuitem--docs) |
| `data-browser/ChartViewerPanel` | Renders one indicator: bar (with benchmark line) or stacked bar, denominator, description, optional standard error. Props: `dataItemId`, `showStandardError`. | [BarChart](https://storybook.withpathways.org/?path=/docs/components-charts-barchart--docs), [StackedBarChart](https://storybook.withpathways.org/?path=/docs/components-charts-stackedbarchart--docs) |
| `data-browser/PopulationSegments`, `PopulationSegmentsAlt` | Segment overview on the Kenya overview page (size, level, urban/rural). `Alt` is the current version with view modes. | [Segment card](https://storybook.withpathways.org/?path=/docs/components-cards-segment-card--docs), [Population segments percentage header](https://storybook.withpathways.org/?path=/docs/components-population-segments-percentage-header--docs) |
| `data-browser/*Modal` | Data source, source data, technical notes and urban/rural definition modals. | [Modals](https://storybook.withpathways.org/?path=/docs/components-modals--docs) |

## Segment profile

| Component | Use | Storybook |
|---|---|---|
| `segment-profile/SegmentHeader` | Profile header: segment name, level chip, size. | [Level chip](https://storybook.withpathways.org/?path=/story/components-level-chip--most), [Flag title](https://storybook.withpathways.org/?path=/story/components-flag-title--default) |
| `segment-profile/AnchorNav` | In-page section nav on long profiles. | prototype-only |
| `segment-profile/KeyDataPoints`, `AllDataPoints` | Data point bars for one segment against the sample average. | [Data points](https://storybook.withpathways.org/?path=/docs/components-data-points--docs) |
| `segment-profile/DetailedDemographics` | Demographic breakdown table and bars. | [Columns box](https://storybook.withpathways.org/?path=/story/components-columns-box--dive-deeper) (closest) |
| `segment-profile/PrevalenceMap` | Choropleth of where a segment is most prevalent. | [Maps/HeatMap](https://storybook.withpathways.org/?path=/story/components-maps-heatmap--with-level-selector) |
| `segment-profile/WalkInHerShoes` | Narrative persona section. | [Walk in her shoes footer card](https://storybook.withpathways.org/?path=/story/components-cards-walk-in-her-shoes-footer-card--most) |
| `segment-profile/Export*Modal`, `ExportFlowModal` | Export a profile or charts as PNG, PDF or XLSX (`src/utils/exportCards.ts`). | [Modals](https://storybook.withpathways.org/?path=/docs/components-modals--docs) |

## Comparison tool

| Component | Use | Storybook |
|---|---|---|
| `compare-segments/AddDataModal` | Pick indicators to add to the comparison. | [Modals](https://storybook.withpathways.org/?path=/docs/components-modals--docs), [CheckboxMenuItem](https://storybook.withpathways.org/?path=/docs/components-data-point-selection-checkboxmenuitem--docs) |

## In Storybook but not in the prototype yet

[Explainer card](https://storybook.withpathways.org/?path=/story/components-cards-explainer-card--default), [Generic card](https://storybook.withpathways.org/?path=/docs/components-cards-generic-card--docs), [Geography card](https://storybook.withpathways.org/?path=/story/components-cards-geography-card--default), [PieChart](https://storybook.withpathways.org/?path=/docs/components-charts-piechart--docs), [PlotChart (box plot)](https://storybook.withpathways.org/?path=/docs/components-charts-plotchart--docs), [Legend](https://storybook.withpathways.org/?path=/story/components-legend--vulnerability-levels), [GenericDropdown](https://storybook.withpathways.org/?path=/story/components-genericdropdown--uncontrolled), [GenericTooltip](https://storybook.withpathways.org/?path=/story/components-generictooltip--default), [Tooltip term](https://storybook.withpathways.org/?path=/story/components-tooltip-term--default), [Section title](https://storybook.withpathways.org/?path=/story/components-section-title--title-only), [ButtonGroupTabs](https://storybook.withpathways.org/?path=/story/components-buttongrouptabs--default).

Before building any of these, open the story and match it.

## Other patterns that live inside pages

| Pattern | Where | Notes |
|---|---|---|
| Hero band + wave | `NewsPage`, `ResourcesPage` | See [layout.md](layout.md) |
| Newsletter CTA | `.welcome-newsletter` in `WelcomePage.css` (used on Welcome, Blog, Blog post) | Illustration hides on phone |
| Article card, highlights, filters menu, pagination | `NewsPage.tsx` (`NewsCard`, `FiltersMenu`, `Pagination`) | Candidates to extract into `common/` if reused |
| Tag pill | `.news-page__tag` | `--neutral-200` fill, 24px radius |
