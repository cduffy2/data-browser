# Data visualisation

How Pathways shows data. The source of truth is Zeroheight → Data visualisations ([Foundations](https://pathways.zeroheight.com/styleguide/s/102143/p/794ae7), [Chart types](https://pathways.zeroheight.com/styleguide/s/102143/p/12a009), [Data states](https://pathways.zeroheight.com/styleguide/s/102143/p/85d168)), with production components in Storybook → Charts and Maps. This doc summarises the rules and maps them to the prototype. For the data itself, see [data-model.md](data-model.md).

## Choosing a chart

Each chart shows **one data point**. Pick the chart by the question it answers:

| Chart | Answers | Prototype | Storybook |
|---|---|---|---|
| Bar | How do segments compare on one data point? | `ChartViewerPanel` (`chartType: 'bar'`) | [BarChart](https://storybook.withpathways.org/?path=/docs/components-charts-barchart--docs) |
| Stacked bar | How does each segment split across the categories of one data point? | `ChartViewerPanel` (`chartType: 'stacked'`) | [StackedBarChart](https://storybook.withpathways.org/?path=/docs/components-charts-stackedbarchart--docs) |
| Data point bars | How does one segment do on one data point? (profiles) | `KeyDataPoints`, `AllDataPoints` | [Data points](https://storybook.withpathways.org/?path=/docs/components-data-points--docs) |
| Box plot | How spread out are values within each segment? | not built | [PlotChart](https://storybook.withpathways.org/?path=/docs/components-charts-plotchart--docs) |
| Segment bar | Which segments make up each admin area's population? | Kenya overview (partial) | — |
| Pie | Same as segment bar, one admin area at a time | not built | [PieChart](https://storybook.withpathways.org/?path=/docs/components-charts-piechart--docs) |
| Prevalence map | Where is a segment most prevalent? | `PrevalenceMap` | [HeatMap](https://storybook.withpathways.org/?path=/story/components-maps-heatmap--with-level-selector) |

Charts use **Recharts** (`recharts`). Don't add another chart library.

## Shared rules

1. **Segments always appear in the same order on every chart.** Live uses R1, R3.1, R3.2, R4, U1, U2.1, U2.2, U4 (by type, then level). Keep a segment's slot even when it has no data.
2. **Every chart has a title and a plain-language description**, so it still makes sense once downloaded.
3. **Show the denominator** (who was asked) under the chart: "Denominator: Women age 15-49 with a live birth in the last 3 years".
4. **Never show missing data as zero.** No data → the slot stays, with a dashed outline, neutral fill and the label "N/A". Zero → empty slot labelled "0%".
5. **Benchmarks:**
   - Bar charts and data point bars → **sample average**, a dashed line, with its value in a dark chip.
   - Stacked bars → an **Average** bar, set apart by a dashed divider.
   - Box plots → **sample median**, as a sample comparison box.
6. **Value labels on every bar**, so users don't need an axis.
7. **Standard error** only appears when the user turns on the "Standard error" toggle.

## Colour

| Use | Colour | Token |
|---|---|---|
| Single-series bar (no meaning in colour) | Categorical 1 (blue) | `--data-categorical-1` |
| Health outcomes and behaviours | Categorical 1 | `--data-categorical-1` |
| Vulnerability factors | Categorical 6 (slate blue) | `--data-categorical-6` |
| Rural / Urban | Categorical 7 / 10 | `--segment-rural`, `--segment-urban` |
| Categories in a stacked bar | Categorical 1, 2, 3… **in order**; don't pick by preference | `--data-categorical-*` |
| Segment fills (segment bar, pie, map) | Vulnerability level, never categorical | `--vulnerability-*` |

- Each categorical colour has main, darkened (outlines and text on colour) and light (backgrounds and hover) tones. See Foundations in Zeroheight.
- When two neighbouring segments share a level (and so a colour), give the second one a texture, in this order: none, diagonal, grid, horizontal, vertical. Use a texture only in that case.

## Chart typography

Chart titles use `--text-primary`; all other chart text uses `--text-tertiary`, so the data stays the focus.

| Role | Zeroheight style | Prototype today |
|---|---|---|
| Chart title | `desktop/title-lg` | 18px, 600 |
| Legend label | `desktop/body-sm` | 14px |
| Helper hint ("Select a category to isolate it") | `desktop/body-xs` | not built |
| Axis label (segment codes) | `typography/xs/500` | 12px, 500 |
| Sample note / denominator | `desktop/title-sm` | 14px |
| Description | `desktop/body-md` | 16px |

## Interaction

- **Stacked bar legend is interactive**: selecting a category shows it on its own as a bar chart, so segments can be compared from the same baseline.
- **Help for unfamiliar charts**: box plots get a "Help me understand this chart" link.
- **Source data warning**: segmentations built on a Pathways Survey (nationally representative only) show a dismissible warning on sub-national charts. DHS-based segmentations don't.
- **Download**: every chart can be exported (PNG/PDF/XLSX via `src/utils/exportCards.ts`).

## Known gaps in the prototype

- The bar chart is labelled **"Sample median"** in `src/data/chartData.ts`. Zeroheight specifies **sample average** for bar charts, so change the label when you touch it.
- Segment order in `chartData.ts` (U1, U2.2, U2.1, U4, R2…) doesn't match live order. Reorder when replacing data.
- Standard errors are generated from a hash of the segment name (`getBarStandardError` in `ChartViewerPanel.tsx`). They are fake.
- N/A slots and textures aren't implemented in the prototype charts yet.
