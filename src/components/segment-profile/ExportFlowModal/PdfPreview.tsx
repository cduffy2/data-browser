// Lazy-loaded — keeps @react-pdf/renderer and pdfjs-dist out of the main bundle.
import { useState, useEffect, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import * as pdfjsLib from 'pdfjs-dist';
import { SegmentProfileDocument, generateAndDownloadPdf } from './SegmentProfilePdf';

// Point pdfjs at its worker (bundled by Vite via the package's own worker entry)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Canvas page renderer ──
// Renders a single PDF page into a <canvas> at a fixed display size.
const PREVIEW_W = 339;
const PREVIEW_H = 479;

function PdfPageCanvas({ pdfDoc, pageNum }: { pdfDoc: pdfjsLib.PDFDocumentProxy; pageNum: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const page = await pdfDoc.getPage(pageNum);
      if (cancelled) return;

      const devicePixelRatio = window.devicePixelRatio || 1;
      // Scale to fit PREVIEW_W × PREVIEW_H at device resolution
      const viewport = page.getViewport({ scale: 1 });
      const scaleX = PREVIEW_W / viewport.width;
      const scaleY = PREVIEW_H / viewport.height;
      const scale = Math.min(scaleX, scaleY) * devicePixelRatio;
      const scaledViewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      canvas.style.width = `${scaledViewport.width / devicePixelRatio}px`;
      canvas.style.height = `${scaledViewport.height / devicePixelRatio}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await page.render({ canvasContext: ctx, canvas, viewport: scaledViewport }).promise;
    }
    render();
    return () => { cancelled = true; };
  }, [pdfDoc, pageNum]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}

interface PdfPreviewProps {
  selectedIds: string[];
  segmentLabel: string;
  onBack: () => void;
  onClose: () => void;
}

export default function PdfPreview({ selectedIds, segmentLabel, onBack, onClose }: PdfPreviewProps) {
  const [exporting, setExporting] = useState(false);
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [previewError, setPreviewError] = useState(false);

  // Generate blob once on mount, load into pdfjs
  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const blob = await pdf(
          <SegmentProfileDocument selectedIds={selectedIds} />
        ).toBlob();
        if (cancelled) return;
        const arrayBuffer = await blob.arrayBuffer();
        if (cancelled) return;
        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      } catch (e) {
        console.error('[PDF preview error]', e);
        setPreviewError(true);
      }
    }
    generate();
    return () => { cancelled = true; };
  }, [selectedIds]);

  async function handleExport() {
    setExporting(true);
    try {
      await generateAndDownloadPdf(selectedIds);
      onClose();
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      {/* Left column */}
      <div className="export-flow-modal__left">
        <div className="export-flow-modal__title-row">
          <span className="export-flow-modal__step">Step 3 of 3</span>
          <h2 className="export-flow-modal__title" id="export-flow-title-3">Download segment profile</h2>
        </div>

        <p className="export-flow-modal__description-plain">
          Browse the {totalPages ? <strong>{totalPages}-page</strong> : 'multi-page'} preview on the right. Go back and adjust your data selection at any time. When you're happy, click Download PDF.
        </p>

        <div className="export-flow-modal__scope">
          <span className="export-flow-modal__scope-label">Scope of export</span>
          <div className="export-flow-modal__scope-switcher">
            <button
              className={`export-flow-modal__scope-btn${exportScope === 'current' ? ' export-flow-modal__scope-btn--active' : ''}`}
              onClick={() => setExportScope('current')}
            >
              Current segment ({segmentLabel})
            </button>
            <button
              className={`export-flow-modal__scope-btn${exportScope === 'all' ? ' export-flow-modal__scope-btn--active' : ''}`}
              onClick={() => setExportScope('all')}
            >
              All segments
            </button>
          </div>
          {exportScope === 'all' && (
            <p className="export-flow-modal__scope-hint">PDFs for each segment will be exported together in a single ZIP folder.</p>
          )}
        </div>

        <div className="export-flow-modal__actions">
          <button className="export-flow-modal__cancel" onClick={onBack}>
            <ArrowLeftIcon />
            Back
          </button>
          <button className="export-flow-modal__next" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Generating…' : exportScope === 'all' ? 'Download ZIP' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Right column — canvas preview */}
      <div className="export-flow-modal__right export-flow-modal__right--step3">
        <div className="export-flow-modal__pdf-preview-area">
          {previewError ? (
            <div className="export-flow-modal__preview-loading">Preview unavailable</div>
          ) : !pdfDoc ? (
            <div className="export-flow-modal__preview-loading">Generating preview…</div>
          ) : (
            <div className="export-flow-modal__pdf-page-frame">
              <PdfPageCanvas pdfDoc={pdfDoc} pageNum={page} />
            </div>
          )}
        </div>
        {totalPages && totalPages > 1 && (
          <div className="export-flow-modal__page-nav">
            <button
              className="export-flow-modal__page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </button>
            <span className="export-flow-modal__page-label">Page {page} of {totalPages}</span>
            <button
              className="export-flow-modal__page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
