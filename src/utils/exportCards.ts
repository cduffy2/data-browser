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
