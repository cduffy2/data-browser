import html2canvas from 'html2canvas';
import JSZip from 'jszip';

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'xlsx';

// ── helpers ──────────────────────────────────────────────────────────────────

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitise(text: string) {
  return text.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

function getLabel(el: HTMLElement): string {
  return el.querySelector('.all-data-points__card-label')?.textContent?.trim() ?? 'data-card';
}

// ── per-card capture ──────────────────────────────────────────────────────────

async function captureCardCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  el.classList.add('all-data-points__card--exporting');
  const canvas = await html2canvas(el, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });
  el.classList.remove('all-data-points__card--exporting');
  return canvas;
}

async function captureCardAsPng(el: HTMLElement): Promise<{ blob: Blob; filename: string }> {
  const canvas = await captureCardCanvas(el);
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/png')
  );
  return { blob, filename: `${sanitise(getLabel(el))}.png` };
}

async function captureCardAsSvg(el: HTMLElement): Promise<{ blob: Blob; filename: string }> {
  const canvas = await captureCardCanvas(el);
  const dataUrl = canvas.toDataURL('image/png');
  const { width, height } = canvas;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
    ` width="${width / 2}" height="${height / 2}" viewBox="0 0 ${width / 2} ${height / 2}">`,
    `<image width="${width / 2}" height="${height / 2}" xlink:href="${dataUrl}"/>`,
    `</svg>`,
  ].join('');
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return { blob, filename: `${sanitise(getLabel(el))}.svg` };
}

// ── XLSX ─────────────────────────────────────────────────────────────────────

interface CardData {
  label: string;
  segment_value: string;
  median_value: string;
}

function extractCardData(el: HTMLElement): CardData {
  const label = getLabel(el);

  // Percentage-based card
  const percentageEl = el.querySelector('.all-data-points__card-percentage');
  if (percentageEl) {
    // Strip the standard error span if present (e.g. " ±0.5%")
    const seSpan = percentageEl.querySelector('.all-data-points__card-se');
    const seText = seSpan?.textContent ?? '';
    const rawText = percentageEl.textContent ?? '';
    const segmentValue = rawText.replace(seText, '').trim();

    const medianMarker = el.querySelector<HTMLElement>('.all-data-points__card-bar-median');
    const medianPct = medianMarker ? medianMarker.style.left : '';
    const medianValue = medianPct ? medianPct.replace('%', '') + '%' : '';

    return { label, segment_value: segmentValue, median_value: medianValue };
  }

  // Value-based card (e.g. age)
  const valueEl = el.querySelector('.all-data-points__card-value');
  if (valueEl) {
    return { label, segment_value: valueEl.textContent?.trim() ?? '', median_value: '' };
  }

  return { label, segment_value: '', median_value: '' };
}

async function buildXlsx(
  ids: string[],
  segmentName: string
): Promise<Blob> {
  const { utils, write } = await import('xlsx');

  const rows: CardData[] = [];
  for (const id of ids) {
    const el = document.querySelector<HTMLElement>(`[data-card-id="${id}"]`);
    if (!el) continue;
    rows.push(extractCardData(el));
  }

  const ws = utils.json_to_sheet(rows, {
    header: ['label', 'segment_value', 'median_value'],
  });

  // Friendlier column headers
  ws['A1'] = { v: 'Data point', t: 's' };
  ws['B1'] = { v: `${segmentName} value`, t: 's' };
  ws['C1'] = { v: 'Median value', t: 's' };

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data points');

  const buf: ArrayBuffer = write(wb, { type: 'array', bookType: 'xlsx' });
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// ── PDF ───────────────────────────────────────────────────────────────────────

async function buildPdf(ids: string[], segmentName: string): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  // Collect all canvases first
  const canvases: { canvas: HTMLCanvasElement; label: string }[] = [];
  for (const id of ids) {
    const el = document.querySelector<HTMLElement>(`[data-card-id="${id}"]`);
    if (!el) continue;
    const canvas = await captureCardCanvas(el);
    canvases.push({ canvas, label: getLabel(el) });
  }
  if (canvases.length === 0) return new Blob();

  // A4 landscape in mm
  const PAGE_W = 297;
  const PAGE_H = 210;
  const MARGIN = 10;
  const COLS = 3;
  const cellW = (PAGE_W - MARGIN * (COLS + 1)) / COLS;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(segmentName + ' — Data points', MARGIN, MARGIN + 5);

  let x = MARGIN;
  let y = MARGIN + 14;
  let col = 0;

  for (const { canvas } of canvases) {
    const aspect = canvas.height / canvas.width;
    const cellH = cellW * aspect;

    if (y + cellH > PAGE_H - MARGIN) {
      pdf.addPage();
      x = MARGIN;
      y = MARGIN;
      col = 0;
    }

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      x,
      y,
      cellW,
      cellH
    );

    col++;
    if (col >= COLS) {
      col = 0;
      x = MARGIN;
      y += cellH + MARGIN;
    } else {
      x += cellW + MARGIN;
    }
  }

  return pdf.output('blob');
}

// ── public API ────────────────────────────────────────────────────────────────

export async function exportCards(
  selectedIds: string[],
  segmentName: string,
  format: ExportFormat
): Promise<void> {
  if (selectedIds.length === 0) return;

  const zipName = `${sanitise(segmentName)}-data-cards`;

  if (format === 'xlsx') {
    const blob = await buildXlsx(selectedIds, segmentName);
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${zipName}.xlsx`);
    return;
  }

  if (format === 'pdf') {
    const blob = await buildPdf(selectedIds, segmentName);
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${zipName}.pdf`);
    return;
  }

  // PNG or SVG — capture each card then zip if multiple
  const capture = format === 'svg' ? captureCardAsSvg : captureCardAsPng;
  const ext = format === 'svg' ? 'svg' : 'png';

  const results: { blob: Blob; filename: string }[] = [];
  for (const id of selectedIds) {
    const el = document.querySelector<HTMLElement>(`[data-card-id="${id}"]`);
    if (!el) continue;
    results.push(await capture(el));
  }

  if (results.length === 0) return;

  if (results.length === 1) {
    const url = URL.createObjectURL(results[0].blob);
    triggerDownload(url, results[0].filename);
    return;
  }

  const zip = new JSZip();
  for (const { blob, filename } of results) {
    zip.file(filename, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(URL.createObjectURL(zipBlob), `${zipName}.${ext}.zip`);
}

// Keep the old name working for any other callers
export async function exportCardsAsZip(
  selectedIds: string[],
  segmentName: string
): Promise<void> {
  return exportCards(selectedIds, segmentName, 'png');
}

// ── Chart export (data browser) ───────────────────────────────────────────────

async function captureChartCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(el, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });
  return canvas;
}

function getChartTitle(el: HTMLElement): string {
  return el.querySelector('.chart-viewer-panel__title')?.textContent?.trim() ?? 'chart';
}

export async function exportCharts(
  chartIds: string[],
  format: ExportFormat
): Promise<void> {
  if (chartIds.length === 0) return;

  const zipName = 'data-browser-charts';

  if (format === 'xlsx') {
    // For charts, XLSX exports the underlying data values from the chart title + x-axis labels
    const { utils, write } = await import('xlsx');
    const rows: { chart: string }[] = [];
    for (const id of chartIds) {
      const el = document.querySelector<HTMLElement>(`[data-chart-id="${id}"]`);
      if (!el) continue;
      rows.push({ chart: getChartTitle(el) });
    }
    const ws = utils.json_to_sheet(rows);
    ws['A1'] = { v: 'Chart', t: 's' };
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Charts');
    const buf: ArrayBuffer = write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    triggerDownload(URL.createObjectURL(blob), `${zipName}.xlsx`);
    return;
  }

  if (format === 'pdf') {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const PAGE_W = 297;
    const MARGIN = 16;

    for (let i = 0; i < chartIds.length; i++) {
      const el = document.querySelector<HTMLElement>(`[data-chart-id="${chartIds[i]}"]`);
      if (!el) continue;
      const canvas = await captureChartCanvas(el);
      const aspect = canvas.height / canvas.width;
      const imgW = PAGE_W - MARGIN * 2;
      const imgH = imgW * aspect;
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', MARGIN, MARGIN, imgW, imgH);
    }
    triggerDownload(URL.createObjectURL(pdf.output('blob')), `${zipName}.pdf`);
    return;
  }

  // PNG or SVG
  const results: { blob: Blob; filename: string }[] = [];
  for (const id of chartIds) {
    const el = document.querySelector<HTMLElement>(`[data-chart-id="${id}"]`);
    if (!el) continue;
    const canvas = await captureChartCanvas(el);
    const title = sanitise(getChartTitle(el));

    if (format === 'svg') {
      const dataUrl = canvas.toDataURL('image/png');
      const { width, height } = canvas;
      const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
        ` width="${width / 2}" height="${height / 2}" viewBox="0 0 ${width / 2} ${height / 2}">`,
        `<image width="${width / 2}" height="${height / 2}" xlink:href="${dataUrl}"/>`,
        `</svg>`,
      ].join('');
      results.push({ blob: new Blob([svg], { type: 'image/svg+xml' }), filename: `${title}.svg` });
    } else {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      );
      results.push({ blob, filename: `${title}.png` });
    }
  }

  if (results.length === 0) return;

  if (results.length === 1) {
    triggerDownload(URL.createObjectURL(results[0].blob), results[0].filename);
    return;
  }

  const zip = new JSZip();
  for (const { blob, filename } of results) zip.file(filename, blob);
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const ext = format === 'svg' ? 'svg' : 'png';
  triggerDownload(URL.createObjectURL(zipBlob), `${zipName}.${ext}.zip`);
}

// ── Compare grid export ───────────────────────────────────────────────────────

export async function exportCompareGrid(format: ExportFormat): Promise<void> {
  const el = document.querySelector<HTMLElement>('[data-compare-grid]');
  if (!el) return;

  const filename = 'comparison-tool';

  if (format === 'xlsx') {
    const { utils, write } = await import('xlsx');
    // Extract data: each column title + values from the DOM
    const columns = el.querySelectorAll<HTMLElement>('.compare-segments-page__data-column');
    const rows: { data_point: string; values: string }[] = [];
    columns.forEach(col => {
      const title = col.querySelector('.compare-segments-page__data-column-title')?.childNodes[0]?.textContent?.trim() ?? '';
      const values = Array.from(col.querySelectorAll('.compare-segments-page__bar-value'))
        .map(v => v.textContent?.trim() ?? '')
        .join(', ');
      rows.push({ data_point: title, values });
    });
    const ws = utils.json_to_sheet(rows, { header: ['data_point', 'values'] });
    ws['A1'] = { v: 'Data point', t: 's' };
    ws['B1'] = { v: 'Segment values', t: 's' };
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Comparison');
    const buf: ArrayBuffer = write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    triggerDownload(URL.createObjectURL(blob), `${filename}.xlsx`);
    return;
  }

  // Temporarily expand overflow so html2canvas captures the full grid width
  const prevOverflow = el.style.overflow;
  const prevWidth = el.style.width;
  el.style.overflow = 'visible';
  el.style.width = el.scrollWidth + 'px';

  const canvas = await html2canvas(el, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
    width: el.scrollWidth,
    height: el.scrollHeight,
    windowWidth: el.scrollWidth,
  });

  el.style.overflow = prevOverflow;
  el.style.width = prevWidth;

  if (format === 'pdf') {
    const { jsPDF } = await import('jspdf');
    const aspect = canvas.height / canvas.width;
    const pdf = new jsPDF({ orientation: aspect > 1 ? 'portrait' : 'landscape', unit: 'mm', format: 'a4' });
    const PAGE_W = aspect > 1 ? 210 : 297;
    const MARGIN = 16;
    const imgW = PAGE_W - MARGIN * 2;
    const imgH = imgW * aspect;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', MARGIN, MARGIN, imgW, imgH);
    triggerDownload(URL.createObjectURL(pdf.output('blob')), `${filename}.pdf`);
    return;
  }

  if (format === 'svg') {
    const dataUrl = canvas.toDataURL('image/png');
    const { width, height } = canvas;
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
      ` width="${width / 2}" height="${height / 2}" viewBox="0 0 ${width / 2} ${height / 2}">`,
      `<image width="${width / 2}" height="${height / 2}" xlink:href="${dataUrl}"/>`,
      `</svg>`,
    ].join('');
    triggerDownload(URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), `${filename}.svg`);
    return;
  }

  // PNG
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/png')
  );
  triggerDownload(URL.createObjectURL(blob), `${filename}.png`);
}
