# Information architecture

What's in the prototype, the objects users work with (OOUX), and how they connect. Use this to scope features and to name things consistently.

## Objects

Pathways is built around a small set of objects. Every screen shows one or more of them, so new features should attach to an existing object before inventing a new one.

```
Geography ──has──▶ Segmentation ──has──▶ Population segment ──measured by──▶ Data point
                                              │                                  │
                                       has a level (1–4)              belongs to a Domain or a
                                       and a type (urban/rural)       health outcome area, and is
                                                                       tagged with Health areas
Resource (guide, explainer, typing tool)      Blog post (article, case study, newsletter, event)
```

| Object | What it is | Key attributes | Main CTAs | Where it appears |
|---|---|---|---|---|
| **Geography** | A country or region with a segmentation (Kenya, Ethiopia, Northern Nigeria, Senegal, Bihar…). | Name, flag, data source (e.g. Kenya 2022 DHS) | View overview, open a tool | Segmentations page, nav dropdown, sidebar header |
| **Segmentation** | The set of segments for one geography and data source. | Source survey, year, number of segments, urban/rural split | Explore segments, compare | Kenya overview |
| **Population segment** | A group of households sharing similar vulnerabilities. | Type (Rural/Urban), vulnerability level 1–4, sub-level (3.1, 3.2), share of population, name | View profile, compare, walk in her shoes | Sidebar, overview, every chart axis |
| **Vulnerability level** | 1 = least to 4 = most vulnerable. | Colour (green/blue/purple/red), label | — | Badges, chart fills, legends |
| **Data point** (indicator) | One measured variable. Either a **health outcome or behaviour**, or a **vulnerability factor**. | Label, denominator, description, values per segment, sample benchmark, standard error | View chart, select for comparison, download | Data browser, comparison tool, profiles |
| **Domain** | One of six groups of vulnerability factors: the woman and her past experiences, household relationships, household economics and living conditions, social support, health mental models, human and natural systems. | Name, description, factors | Explore domain | Data browser list, domain detail, methodology explainer |
| **Health area** | A filter across data points: Child health, Immunisation, Maternal health, Nutrition, Sexual and reproductive health. | Name, icon | Filter | Data browser chips |
| **Resource** | Guidance content: guides, interactive explainers, typing tools. | Title, group, summary | Read | Resources page, mobile Resources menu |
| **Blog post** | News content. | Tag (Article, Case study, Newsletter, Community event), date, image, excerpt | Read more, filter by tag | Blog, Welcome, Blog post |

Data shapes for these objects are in [data-model.md](data-model.md).

## Naming

| Thing | Display | Short code | Code id |
|---|---|---|---|
| Segment | "Rural 4", "Urban 2.1" | `R4`, `U2.1` (chart axes) | `rural-4`, `urban-2a` |
| Level | "Most vulnerable" … "Least vulnerable" | `4` … `1` | — |
| Data point | Sentence case, as on live ("No ANC visit") | — | kebab-case (`no-anc-visit`) |

- Sub-levels are written with a dot ("3.1"), never a letter, in anything users see.
- Use the terms in [tone-of-voice.md](tone-of-voice.md) (e.g. "population segment", "digital platform").

## Navigation

- **Top nav** (`PrimaryNavBar`): Welcome · Segmentations ▾ (All geographies + each geography) · Resources · Blog · Contact · Search (⌘K).
- **Segmentation sidebar** (`LeftSidebar`, tool pages only): geography overview · Comparison tool · Data browser · Prevalence map · Typing tools & more · segment profiles.
- **Mobile menu** (below 1007px): search field, then the top-nav items. Segmentations and Resources open drill-in panels with Back.

## Page inventory

Hash routes are defined in `src/App.tsx`. Responsiveness is described in [layout.md](layout.md).

| Route (`#…`) | Page | Template | Small screens |
|---|---|---|---|
| `welcome` | Home: value proposition, tools, case studies, news | Site | Responsive |
| `segmentations` | All geographies (the default route) | Site | Not yet |
| `kenya-overview` | Geography overview: segments, sizes, urban/rural | Tool | Not yet |
| `data-browser` | Explore one data point across all segments | Tool | Responsive |
| `compare-segments` | Compare several data points across segments | Tool | Desktop-only + notice |
| `prevalence-map` | Where each segment is most prevalent | Tool | Desktop-only + notice |
| `kenya-typing-tools` | Typing tools for this geography | Tool | Responsive |
| `rural-4` | Segment profile | Tool | Desktop-only |
| `walk-in-her-shoes` (`rural-4/walk-in-her-shoes`) | Persona narrative for a segment | Tool | Desktop-only |
| `domain-detail` | One vulnerability domain and its factors | Tool | Desktop-only |
| `assistant` | AI assistant over Pathways data | Full-screen app | Desktop-only |
| `resources` | Resources hub (explainers, documentation) | Site | Responsive |
| `resources-filtered` | Resources filtered by tag | Site | Not yet |
| `guide-article` | Guide with section nav | Site | Not yet |
| `methodology-explainer` (`understanding-pathways-data`) | Interactive explainer | Site | Not yet |
| `how-pathways-data` | How Pathways data is organised | Site | Not yet |
| `typing-tools` | Typing tools explainer | Site | Responsive |
| `news` | Blog: highlights, latest updates, filters, pagination | Site | Responsive |
| `news-detail` | Blog post | Site | Responsive |
| `article-detail` | Older article template | Site | Not yet |
| `contact` | Contact form | Site | Responsive |
| `not-found` | 404 | Site | — |
| `loading` | Loading state demo | — | — |

Only Kenya and one segment profile (`rural-4`) are built out. Other geographies in the nav and sidebar route to the Kenya pages.
