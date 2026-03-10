import {
  Document,
  Page,
  View,
  Text,
  Font,
  StyleSheet,
  pdf,
  Image,
  Svg,
  Path,
} from '@react-pdf/renderer';
import kenyaGeoJson from '../../../assets/kenya.json';
import {
  PDF_DATA_MAP,
  HEALTH_SECTION_LABEL,
  VULNERABILITY_SECTION_LABEL,
  type PdfDataItem,
  type BinaryChartData,
  type CategoricalChartData,
} from './pdfData';
// ── Font registration ──
// Use absolute URLs from /public/fonts so react-pdf can fetch them via XHR.
// Falls back to Helvetica (built-in) if the fetch fails.

Font.register({
  family: 'Inter',
  fonts: [
    { src: `${window.location.origin}/fonts/Inter-Regular.ttf`,  fontWeight: 400 },
    { src: `${window.location.origin}/fonts/Inter-SemiBold.ttf`, fontWeight: 600 },
    { src: `${window.location.origin}/fonts/Inter-Bold.ttf`,     fontWeight: 700 },
  ],
});

// NotoSerif not used — intro body falls back to Inter

// Ensure all styles fall back to Helvetica if custom fonts fail to load
Font.registerHyphenationCallback(word => [word]);

// ── A4 at 72dpi (points) — react-pdf uses pt units ──
// A4 = 595.28 × 841.89 pt
const MARGIN = 40;

// ── Design tokens ──
const BORDER_COLOR = '#E5E5DC';
const BG_LEVEL3 = '#f3f3e6';
const TEXT_PRIMARY = '#171a1c';
const TEXT_SECONDARY = '#32383e';
const TEXT_TERTIARY = '#666666';
const NEUTRAL_200 = '#E5E5DC';
const NEUTRAL_900 = '#0b0d0e';

// ── Styles ──
const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
    paddingBottom: 48,
  },

  // ── Page 1 header ──
  p1Header: {
    backgroundColor: BG_LEVEL3,
    paddingHorizontal: MARGIN,
    paddingVertical: 28,
  },
  p1HeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  p1SegmentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  p1TitleText: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 26,
    color: TEXT_PRIMARY,
  },
  p1NumberBadge: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#ffffff',
  },
  p1NumberBadgeText: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  p1PopText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  p1PopSub: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 12,
    color: TEXT_SECONDARY,
    opacity: 0.75,
  },
  p1Divider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 10,
  },
  p1StatsRow: {
    flexDirection: 'row',
    gap: 32,
  },
  p1StatBlock: {
    flexDirection: 'column',
    gap: 1,
  },
  p1StatLabel: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 9,
    color: TEXT_TERTIARY,
  },
  p1StatValue: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 12,
    color: TEXT_PRIMARY,
  },
  p1StatSub: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 10,
    color: TEXT_TERTIARY,
  },

  // ── Intro section ──
  // ~25% of A4 height = ~210pt; add padding top/bottom = content ~166pt
  introSection: {
    flexDirection: 'row',
    paddingHorizontal: MARGIN,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    height: 210,
  },
  introLeft: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    paddingRight: 20,
  },
  introVerticalDivider: {
    width: 1,
    backgroundColor: BORDER_COLOR,
    alignSelf: 'stretch',
  },
  introRight: {
    width: 160,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniline: {
    width: 20,
    height: 2.5,
    backgroundColor: NEUTRAL_900,
    marginBottom: 4,
  },
  introTitle: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  introBody: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 9,
    color: TEXT_TERTIARY,
    lineHeight: 1.55,
  },

  // ── Section heading ──
  sectionBlock: {
    paddingHorizontal: MARGIN,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },

  // ── Data grid ──
  dataGrid: {
    marginHorizontal: MARGIN,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  gridSectionHeader: {
    backgroundColor: NEUTRAL_200,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  gridSectionHeaderText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 8,
    color: TEXT_TERTIARY,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'column',
    gap: 6,
  },
  gridCellFirst: {
    borderLeftWidth: 0,
  },
  cellLabel: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 7.5,
    color: TEXT_TERTIARY,
  },

  // ── Binary bar ──
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 14,
  },
  barTrack: {
    flex: 1,
    height: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  barValue: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 9,
    color: TEXT_PRIMARY,
    width: 28,
    textAlign: 'right',
  },

  // ── Categorical bar ──
  catBarTrack: {
    flex: 1,
    height: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  catLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  catLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  catLegendSwatch: {
    width: 7,
    height: 7,
  },
  catLegendText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 6.5,
    color: TEXT_TERTIARY,
  },

  // ── Page 2+ mini header ──
  miniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: MARGIN,
    paddingTop: 24,
    paddingBottom: 8,
  },
  miniHeaderTitle: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  miniHeaderPage: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 8,
    color: TEXT_TERTIARY,
  },
});

// ── Asset URLs (served from /public/pdf-assets/) ──
const SCENE_URL = `${window.location.origin}/pdf-assets/scene-rural-4.png`;
const BADGE_URL = `${window.location.origin}/pdf-assets/badge-3.2.png`;

// Badge height in pt; width derived from natural image aspect ratio.
// Decimal segment IDs (e.g. 3.2, 1.1) use a 64×48px image (4:3 ratio → oblong pill).
// Integer/letter segment IDs (e.g. 3, 3a, 4) use 48×48px (1:1 → circle).
// 3.2 badge is 64×48 → at BADGE_H height the width = BADGE_H * (64/48)
const BADGE_H = 30;
const BADGE_W = BADGE_H * (64 / 48); // ≈ 40pt — oblong pill for "3.2"

// ── Prevalence map SVG built from kenya.json ──
// Kenya bounds: lng 33.91–41.93, lat -4.72–5.06
const MAP_SVG_W = 130;
const MAP_SVG_H = 163;

const prevalenceData: Record<string, number> = {
  'Nairobi': 2, 'Mombasa': 4, 'Kisumu': 3, 'Nakuru': 5,
  'Uasin Gishu': 4, 'Kiambu': 2, 'Machakos': 6, 'Kajiado': 8,
  'Kilifi': 12, 'Kwale': 10, 'Tana River': 35, 'Garissa': 78,
  'Wajir': 82, 'Mandera': 45, 'Marsabit': 38, 'Isiolo': 28,
  'Turkana': 32, 'West Pokot': 18, 'Samburu': 22, 'Baringo': 12,
  'Laikipia': 8, 'Nyandarua': 4, 'Nyeri': 3, 'Kirinyaga': 3,
  'Muranga': 4, 'Embu': 6, 'Kitui': 15, 'Makueni': 10,
  'Taita Taveta': 8, 'Lamu': 18, 'Meru': 7, 'Tharaka-Nithi': 9,
  'Bungoma': 6, 'Busia': 5, 'Kakamega': 5, 'Vihiga': 4,
  'Trans Nzoia': 6, 'Nandi': 5, 'Elgeyo-Marakwet': 8, 'Kericho': 4,
  'Bomet': 6, 'Narok': 14, 'Siaya': 5, 'Homa Bay': 6,
  'Migori': 7, 'Kisii': 4, 'Nyamira': 4,
};

function getPrevalenceColor(pct: number): string {
  const t = Math.min(pct / 100, 1);
  const r = Math.round(223 + (141 - 223) * t);
  const g = Math.round(226 + (160 - 226) * t);
  const b = Math.round(234 + (203 - 234) * t);
  return `rgb(${r},${g},${b})`;
}

function coordsToD(rings: number[][][]): string {
  return rings.map(ring =>
    ring.map((coord, i) => {
      const x = ((coord[0] - 33.91) / 8.02) * MAP_SVG_W;
      const y = ((5.06 - coord[1]) / 9.78) * MAP_SVG_H;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ') + 'Z'
  ).join(' ');
}

function PdfPrevalenceMap() {
  const paths: { d: string; fill: string }[] = [];
  (kenyaGeoJson as any).features.forEach((feature: any) => {
    const name = feature.properties.NAME_1 as string;
    const pct = prevalenceData[name] || 0;
    const fill = getPrevalenceColor(pct);
    const polys: number[][][][] =
      feature.geometry.type === 'MultiPolygon'
        ? feature.geometry.coordinates
        : [feature.geometry.coordinates];
    polys.forEach((poly: number[][][]) => {
      paths.push({ d: coordsToD(poly), fill });
    });
  });

  return (
    <Svg viewBox={`0 0 ${MAP_SVG_W} ${MAP_SVG_H}`} width={MAP_SVG_W} height={MAP_SVG_H}>
      {paths.map((p, i) => (
        <Path key={i} d={p.d} fill={p.fill} stroke="#ffffff" strokeWidth={0.5} />
      ))}
    </Svg>
  );
}

// ── Helpers ──

const COLS = 3;

function BinaryBar({ data }: { data: BinaryChartData }) {
  const fillW = `${data.value}%`;
  const medianX = `${data.median}%`;
  return (
    <View style={s.barRow}>
      <View style={s.barTrack}>
        {/* fill */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: fillW,
            backgroundColor: data.color,
          }}
        />
        {/* median marker */}
        <View
          style={{
            position: 'absolute',
            left: medianX,
            top: 0,
            bottom: 0,
            width: 1.5,
            backgroundColor: '#383631',
          }}
        />
      </View>
      <Text style={s.barValue}>{data.value}%</Text>
    </View>
  );
}

function CategoricalBar({ data }: { data: CategoricalChartData }) {
  const total = data.segments.reduce((acc, s) => acc + s.value, 0);
  return (
    <View>
      <View style={s.catBarTrack}>
        {data.segments.map((seg, i) => (
          <View
            key={i}
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: seg.color,
              borderRightWidth: i < data.segments.length - 1 ? 1 : 0,
              borderRightColor: '#ffffff',
            }}
          />
        ))}
      </View>
      <View style={s.catLegend}>
        {data.segments.map((seg, i) => (
          <View key={i} style={s.catLegendItem}>
            <View style={[s.catLegendSwatch, { backgroundColor: seg.color }]} />
            <Text style={s.catLegendText}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DataCell({ item, isFirst }: { item: PdfDataItem; isFirst: boolean }) {
  return (
    <View style={isFirst ? [s.gridCell, s.gridCellFirst] : s.gridCell}>
      <Text style={s.cellLabel}>{item.label}</Text>
      {item.data.chartType === 'binary' ? (
        <BinaryBar data={item.data as BinaryChartData} />
      ) : (
        <CategoricalBar data={item.data as CategoricalChartData} />
      )}
    </View>
  );
}

// Pad a row to always have COLS cells (empty fillers for incomplete rows)
function DataRow({ items }: { items: PdfDataItem[] }) {
  const padded = [...items];
  while (padded.length < COLS) padded.push(null as unknown as PdfDataItem);
  return (
    <View style={s.gridRow}>
      {padded.map((item, i) =>
        item ? (
          <DataCell key={item.id} item={item} isFirst={i === 0} />
        ) : (
          <View
            key={`empty-${i}`}
            style={i === 0 ? [s.gridCell, s.gridCellFirst] : s.gridCell}
          />
        )
      )}
    </View>
  );
}

// Chunk items into rows of COLS
function chunkRows(items: PdfDataItem[]) {
  const rows: PdfDataItem[][] = [];
  for (let i = 0; i < items.length; i += COLS) {
    rows.push(items.slice(i, i + COLS));
  }
  return rows;
}

// ── Estimate rows that fit on a page ──
// A4 content height: ~841 - 48(paddingBottom) = 793pt
// Page 1 consumes: ~140pt (header) + ~90pt (intro) + ~36pt (section heading)
// Page 2+ consumes: ~56pt (mini header) + section heading if new section
// Each binary row ≈ 42pt, categorical row ≈ 58pt (with legend)
// We split at fixed row counts for simplicity; react-pdf wraps pages automatically.

// ── Section group ──
interface SectionGroup {
  label: string;
  items: PdfDataItem[];
  continued?: boolean;
}

// ── Page 1: header + intro + first batch of data ──
function Page1({
  healthItems,
  vulnItems,
  totalPages,
}: {
  healthItems: PdfDataItem[];
  vulnItems: PdfDataItem[];
  totalPages: number;
}) {
  const healthRows = chunkRows(healthItems);
  const vulnRows = chunkRows(vulnItems);

  return (
    <Page size="A4" style={s.page}>
      {/* Header — position:relative so the scene can overflow via absolute */}
      <View style={[s.p1Header, { position: 'relative' }]}>
        {/* Left: segment info — leave room on the right for the scene */}
        <View style={{ marginRight: 160 }}>
          {/* Title row */}
          <View style={s.p1HeaderTop}>
            <View style={s.p1SegmentTitle}>
              <Text style={s.p1TitleText}>Rural</Text>
              {/* Vulnerability level badge icon — natural aspect ratio */}
              <Image src={BADGE_URL} style={{ width: BADGE_W, height: BADGE_H }} />
              <Text style={s.p1TitleText}>more vulnerable</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
            <Text style={s.p1PopText}>12.2%</Text>
            <Text style={s.p1PopSub}>of population</Text>
          </View>

          {/* Divider */}
          <View style={s.p1Divider} />

          {/* Stats row */}
          <View style={s.p1StatsRow}>
            {[
              { label: 'Age (median)', value: '31', sub: '· 21 ~ 41' },
              { label: 'Partner age (median)', value: '34', sub: '· 27 ~ 49' },
              { label: 'Household size (median)', value: '5', sub: '' },
              { label: 'U5MR', value: '61', sub: '/1000' },
            ].map((stat) => (
              <View key={stat.label} style={s.p1StatBlock}>
                <Text style={s.p1StatLabel}>{stat.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                  <Text style={s.p1StatValue}>{stat.value}</Text>
                  {stat.sub ? <Text style={s.p1StatSub}>{stat.sub}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Scene illustration — absolutely positioned on the right, overflowing the header bottom */}
        <Image
          src={SCENE_URL}
          style={{
            position: 'absolute',
            right: MARGIN,
            bottom: -20,
            width: 148,
            height: 148,
            objectFit: 'contain',
            objectPositionX: 'right',
            objectPositionY: 'bottom',
          }}
        />
      </View>

      {/* Introduction */}
      <View style={s.introSection}>
        {/* Left: intro text */}
        <View style={s.introLeft}>
          <View style={s.miniline} />
          <Text style={s.introTitle}>Introduction</Text>
          <Text style={s.introBody}>
            Segment R4 is a highly vulnerable rural group concentrated in Northern Kenya,
            characterized by extreme physical distance from facilities, very low educational
            attainment, and high parity. Compared to the rural average, this segment reports
            the highest rates of zero-dose children and home deliveries without skilled
            assistance, marking it as the most health-deprived group in the country.
          </Text>
        </View>

        {/* Vertical divider */}
        <View style={s.introVerticalDivider} />

        {/* Right: prevalence map */}
        <View style={s.introRight}>
          <PdfPrevalenceMap />
        </View>
      </View>

      {/* Data grid */}
      {healthItems.length > 0 && (
        <View style={s.sectionBlock}>
          <Text style={s.sectionTitle}>{HEALTH_SECTION_LABEL}</Text>
        </View>
      )}
      {healthItems.length > 0 && (
        <View style={s.dataGrid}>
          <View style={s.gridSectionHeader}>
            <Text style={s.gridSectionHeaderText}>
              {HEALTH_SECTION_LABEL} ({healthItems.length})
            </Text>
          </View>
          {healthRows.map((row, i) => (
            <DataRow key={i} items={row} />
          ))}
        </View>
      )}

      {vulnItems.length > 0 && (
        <>
          <View style={s.sectionBlock}>
            <Text style={s.sectionTitle}>{VULNERABILITY_SECTION_LABEL}</Text>
          </View>
          <View style={s.dataGrid}>
            <View style={s.gridSectionHeader}>
              <Text style={s.gridSectionHeaderText}>
                {VULNERABILITY_SECTION_LABEL} ({vulnItems.length})
              </Text>
            </View>
            {vulnRows.map((row, i) => (
              <DataRow key={i} items={row} />
            ))}
          </View>
        </>
      )}

      <PageFooter pageNum={1} totalPages={totalPages} />
    </Page>
  );
}

// ── Continuation pages ──
function DataPage({
  groups,
  pageNum,
  totalPages,
}: {
  groups: SectionGroup[];
  pageNum: number;
  totalPages: number;
}) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.miniHeader}>
        <Text style={s.miniHeaderTitle}>
          {groups[0].label}{groups[0].continued ? ' (continued)' : ''}
        </Text>
        <Text style={s.miniHeaderPage}>Page {pageNum} of {totalPages}</Text>
      </View>

      {groups.map((group, gi) => {
        const rows = chunkRows(group.items);
        return (
          <View key={gi}>
            {gi > 0 && (
              <View style={s.sectionBlock}>
                <Text style={s.sectionTitle}>{group.label}</Text>
              </View>
            )}
            <View style={s.dataGrid}>
              <View style={s.gridSectionHeader}>
                <Text style={s.gridSectionHeaderText}>
                  {group.label}{group.continued ? ' (continued)' : ''} ({group.items.length})
                </Text>
              </View>
              {rows.map((row, i) => (
                <DataRow key={i} items={row} />
              ))}
            </View>
          </View>
        );
      })}

      <PageFooter pageNum={pageNum} totalPages={totalPages} />
    </Page>
  );
}

function PageFooter({ pageNum, totalPages }: { pageNum: number; totalPages: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 16,
        left: MARGIN,
        right: MARGIN,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 7, color: TEXT_TERTIARY }}>
        Rural 4 — Most Vulnerable · Segment Profile Export
      </Text>
      <Text style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 7, color: TEXT_TERTIARY }}>
        Page {pageNum} of {totalPages}
      </Text>
    </View>
  );
}

// ── Rows per page estimate ──
// Page 1: after header+intro ≈ 310pt used, leaving ~483pt for grid rows
// Each row ≈ 46pt (binary) or 62pt (categorical), avg ~50pt; grid header ≈ 24pt
// Continuation pages: after mini header ≈ 56pt, grid header 24pt, leaving ~713pt
// We'll use a conservative fixed count: 6 rows on page 1, 12 rows per continuation page.
const ROWS_PAGE1 = 6;
const ROWS_PER_CONT_PAGE = 12;

interface PageGroup {
  groups: SectionGroup[];
}

function buildPages(selectedItems: PdfDataItem[]): { page1Health: PdfDataItem[]; page1Vuln: PdfDataItem[]; contPages: PageGroup[] } {
  const health = selectedItems.filter(i => i.type === 'health');
  const vuln = selectedItems.filter(i => i.type === 'vulnerability');

  // Page 1: up to ROWS_PAGE1 rows total across both sections
  // We fill health rows first, then vuln
  const page1Health: PdfDataItem[] = [];
  const page1Vuln: PdfDataItem[] = [];
  let rowsUsed = 0;

  for (let i = 0; i < health.length && rowsUsed < ROWS_PAGE1; i += COLS) {
    const batch = health.slice(i, i + COLS);
    page1Health.push(...batch);
    rowsUsed++;
  }

  for (let i = 0; i < vuln.length && rowsUsed < ROWS_PAGE1; i += COLS) {
    const batch = vuln.slice(i, i + COLS);
    page1Vuln.push(...batch);
    rowsUsed++;
  }

  // Remaining items
  const remainHealth = health.slice(page1Health.length);
  const remainVuln = vuln.slice(page1Vuln.length);

  // Build continuation pages
  const contPages: PageGroup[] = [];
  const remaining: { items: PdfDataItem[]; label: string }[] = [];
  if (remainHealth.length) remaining.push({ items: remainHealth, label: HEALTH_SECTION_LABEL });
  if (remainVuln.length) remaining.push({ items: remainVuln, label: VULNERABILITY_SECTION_LABEL });

  for (const section of remaining) {
    let sectionStart = 0;
    let continued = false;
    while (sectionStart < section.items.length) {
      const batch = section.items.slice(sectionStart, sectionStart + ROWS_PER_CONT_PAGE * COLS);
      contPages.push({
        groups: [{
          label: section.label,
          items: batch,
          continued,
        }],
      });
      sectionStart += ROWS_PER_CONT_PAGE * COLS;
      continued = true;
    }
  }

  return { page1Health, page1Vuln, contPages };
}

// ── Main document ──
export function SegmentProfileDocument({ selectedIds }: { selectedIds: string[] }) {
  const selectedItems = selectedIds
    .map(id => PDF_DATA_MAP.get(id))
    .filter((item): item is PdfDataItem => item !== undefined);

  const { page1Health, page1Vuln, contPages } = buildPages(selectedItems);
  const totalPages = 1 + contPages.length;

  return (
    <Document title="Rural 4 — Segment Profile" author="Pathways">
      <Page1
        healthItems={page1Health}
        vulnItems={page1Vuln}
        totalPages={totalPages}
      />
      {contPages.map((pg, i) => (
        <DataPage
          key={i}
          groups={pg.groups}
          pageNum={i + 2}
          totalPages={totalPages}
        />
      ))}
    </Document>
  );
}

// ── Export trigger ──
export async function generateAndDownloadPdf(selectedIds: string[]) {
  const blob = await pdf(
    <SegmentProfileDocument selectedIds={selectedIds} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Rural-4-Segment-Profile.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
