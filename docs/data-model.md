# Data model

How data is shaped in the prototype, and how to add or replace it. Presentation rules are in [dataviz.md](dataviz.md); the objects themselves are described in [information-architecture.md](information-architecture.md).

> **All data in `src/data/` is illustrative.** Values, standard errors and benchmarks are made up to look plausible. Never quote them as Pathways findings.

## Files

| File | Type (in `src/types/`) | Holds | Used by |
|---|---|---|---|
| `src/data/segments.ts` | `PopulationSegment` | The 8 Kenya segments shown in the sidebar | `LeftSidebar` |
| `src/data/categories.ts` | `DataCategory` → `Subcategory` → `DataItem` | The indicator tree: 2 categories, their subcategories, 48 indicators | `DataCategoryPanel`, `GlobalSearch`, `DataBrowserPage` |
| `src/data/chartData.ts` | `ChartDataSet` \| `StackedChartDataSet` | One chart per indicator, keyed by indicator `id` | `ChartViewerPanel` |
| `src/data/articles.ts` | `Article` | Resource and article listings | `ResourcesFilteredPage`, `GlobalSearch` |

Some pages keep their own local data at the top of the file (e.g. `HIGHLIGHTS` and `UPDATES` in `NewsPage.tsx`, segment profile content in `SegmentProfilePage.tsx`).

## Shapes

### Indicator tree (`categories.ts`)

```ts
DataCategory   { id, label, subcategories: Subcategory[] }
Subcategory    { id, label, items: DataItem[] }
DataItem       { id, label, healthAreas?: string[] }
```

- Top-level categories: `health-outcomes` (subcategories = health areas) and `vulnerability-factors` (subcategories = the six domains).
- `healthAreas` tags a vulnerability factor as relevant to one or more health areas: `child-health`, `immunisation`, `maternal-health`, `nutrition`, `sexual-reproductive-health`. The data browser's health area chips filter on this.
- An `id` may carry a health-area suffix (`-ch`, `-im`, `-mh`, `-nu`, `-sr`) to make a factor unique per area. `ChartViewerPanel` strips the suffix to find its chart.

### Chart data (`chartData.ts`)

```ts
// Single value per segment → bar chart
ChartDataSet {
  title: string;          // data point name, as shown above the chart
  subtitle: string;       // benchmark key, e.g. "Sample average"
  denominator: string;    // who was asked
  description: string;    // plain-language definition
  data: { segment: string; value: number; label: string }[];  // segment = short code "R4"
  medianLine?: number;    // benchmark value, drawn as a dashed line
  chartType?: 'bar';
}

// Split per segment → stacked bar
StackedChartDataSet {
  title, subtitle, denominator, description;
  chartType: 'stacked';
  categories: { key: string; label: string; color: string }[];   // colours in categorical order
  data: { segment: string; [categoryKey: string]: number | string }[];  // each row sums to 100
}
```

### Segments (`segments.ts`)

```ts
PopulationSegment { id: 'rural-4', type: 'rural' | 'urban', label: 'Rural', badge: '4', icon: 'Leaf' | 'City', color }
```

`badge` is the level as shown ("3.1"). On charts the same segment is referred to by its short code (`R3.1`). Keep both in sync.

## Recipes

### Add an indicator

1. Add a `DataItem` to the right subcategory in `categories.ts` (kebab-case `id`, sentence-case `label` as on live, `healthAreas` for vulnerability factors).
2. Add a matching entry in `chartDataSets` in `chartData.ts`, using the same `id` as the key.
3. Include every segment in the standard order, even if a value is missing (see N/A below).
4. Fill in `denominator` and `description`. Charts without them don't meet the [dataviz rules](dataviz.md#shared-rules).

### Add a geography

The prototype only models Kenya: every geography in the nav routes to the Kenya pages. To prototype another one, add its segments and indicators alongside Kenya's (e.g. `segments.ethiopia.ts`), then pass the geography through the pages that read these files. Agree the approach first: it touches the sidebar, the data browser and the overview page.

### Replace mock data with a real export

Convert your export (CSV, parquet, warehouse query) into the shapes above. Generate a `.ts` or `.json` file; don't hand-edit hundreds of values.

Suggested long format to convert from:

| indicator_id | segment_code | value | se | n | category_key |
|---|---|---|---|---|---|
| no-anc-visit | R4 | 8.0 | 1.2 | 412 | |
| age-at-first-birth | R4 | 58 | | 380 | under20 |

Then group by `indicator_id` → `data[]` rows (pivot on `category_key` for stacked charts). Compute the benchmark from the full sample, not from the segment values.

### Validation checklist

- [ ] Every indicator id in `categories.ts` has a chart entry (or a deliberate empty state).
- [ ] Segment codes match the sidebar segments, and rows are in the standard order.
- [ ] Bar values are 0–100 for percentages, and `label` matches `value` (`"8%"`).
- [ ] Stacked rows sum to 100 (±1 for rounding).
- [ ] Missing values are N/A, not `0`. The current types have no N/A field, so add `value: null` support before shipping real gaps (see [dataviz.md](dataviz.md#known-gaps-in-the-prototype)).
- [ ] Benchmark (`medianLine`) matches the definition: sample average for bars, Average bar for stacked.
- [ ] `denominator` and `description` are filled and written per [tone-of-voice.md](tone-of-voice.md).
- [ ] `npx tsc -b` passes.

## Not real yet

- **Standard errors** are generated from a hash of the segment name (`getBarStandardError` in `ChartViewerPanel.tsx`). Add an `se` field to `ChartDataSet` when real values are available.
- **Prevalence map** values and **segment sizes** on the overview are hard-coded in their components.
- The **AI assistant** (`#assistant`) is the only part that reaches real Pathways data, via the backend's MCP connection (`backend/main.py`).
