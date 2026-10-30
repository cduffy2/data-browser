import { useState, useEffect, useMemo } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { PageHeader } from '../../components/data-browser/PageHeader/PageHeader';
import { DataCategoryPanel } from '../../components/data-browser/DataCategoryPanel/DataCategoryPanel';
import { ChartViewerPanel } from '../../components/data-browser/ChartViewerPanel/ChartViewerPanel';
import { ExportModal } from '../../components/segment-profile/ExportModal/ExportModal';
import type { ExportFormat } from '../../utils/exportCards';
import { dataCategories } from '../../data/categories';
import './DataBrowserPage.css';

interface DataBrowserPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
  searchTerm?: string;
}

export function DataBrowserPage({ currentPage, onNavigate, searchTerm = '' }: DataBrowserPageProps) {
  const [activeTab, setActiveTab] = useState('all-data');
  const [selectedItem, setSelectedItem] = useState('any-child-no-fever-cough-care'); // First item in Child health (A-Z)
  const [compareItems, setCompareItems] = useState<Set<string>>(new Set());
  const [showStandardError, setShowStandardError] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  // Below 900px the indicator list opens as a full-screen panel
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    document.title = 'Pathways | Data browser';
  }, []);

  // When arriving with a search term, auto-select the first exact-label match
  const exactMatchResult = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const q = searchTerm.toLowerCase();
    for (const cat of dataCategories) {
      for (const sub of cat.subcategories) {
        const match = sub.items.find(i => i.label.toLowerCase() === q);
        if (match) return { itemId: match.id, subId: sub.id };
      }
    }
    return null;
  }, [searchTerm]);

  useEffect(() => {
    if (exactMatchResult) setSelectedItem(exactMatchResult.itemId);
  }, [exactMatchResult]);

  const handleToggleCompare = (itemId: string) => {
    setCompareItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };


  // Derive all visible item IDs for the current tab (mirrors DataCategoryPanel logic)
  const traditionalVulnerabilityDomains = [
    'woman-experiences', 'health-mental', 'household-relationships',
    'household-economics', 'social-support', 'human-natural'
  ];

  const allVisibleIds = useMemo(() => {
    const categories = (activeTab === 'all-data' || activeTab === '')
      ? dataCategories.map(cat =>
          cat.id === 'vulnerability-factors'
            ? { ...cat, subcategories: cat.subcategories.filter(s => traditionalVulnerabilityDomains.includes(s.id)) }
            : cat
        )
      : dataCategories.map(cat => {
          if (cat.id === 'health-outcomes') {
            return { ...cat, subcategories: cat.subcategories.filter(s => s.id === activeTab) };
          }
          if (cat.id === 'vulnerability-factors') {
            return {
              ...cat,
              subcategories: cat.subcategories
                .filter(s => traditionalVulnerabilityDomains.includes(s.id))
                .map(s => ({ ...s, items: s.items.filter(i => i.healthAreas?.includes(activeTab)) }))
                .filter(s => s.items.length > 0)
            };
          }
          return cat;
        }).filter(cat => cat.subcategories.length > 0);

    return categories.flatMap(cat => cat.subcategories.flatMap(sub => sub.items.map(i => i.id)));
  }, [activeTab]);

  const visibleSelectedCount = allVisibleIds.filter(id => compareItems.has(id)).length;
  const handleCompare = () => {
    const itemsParam = Array.from(compareItems).join(',');
    sessionStorage.setItem('compareItems', itemsParam);
    onNavigate('compare-segments');
  };

  const handleExportApply = async () => {
    const ids = compareItems.size > 0 ? Array.from(compareItems) : [selectedItem];
    setIsExporting(true);
    try {
      const { exportCharts } = await import('../../utils/exportCards');
      await exportCharts(ids, exportFormat);
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  const exportIds = compareItems.size > 0 ? Array.from(compareItems) : [selectedItem];

  return (
    <div className="data-browser-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="data-browser-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="data-browser-page__content">
          <PageHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            compareCount={visibleSelectedCount}
            hasSelections={visibleSelectedCount > 0}
            onClearSelection={() => setCompareItems(new Set())}
            onCompare={handleCompare}
            onExport={() => setShowExportModal(true)}
            showStandardError={showStandardError}
            onToggleStandardError={() => setShowStandardError(prev => !prev)}
          />
          <div className="data-browser-page__panels">
            <div
              className={`data-browser-page__list ${listOpen ? 'data-browser-page__list--open' : ''}`}
              role={listOpen ? 'dialog' : undefined}
              aria-label={listOpen ? 'Change data point' : undefined}
            >
              <div className="data-browser-page__list-header">
                <h2 className="data-browser-page__list-title">Change data point</h2>
                <button type="button" className="data-browser-page__list-close" aria-label="Close" onClick={() => setListOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" /></svg>
                </button>
              </div>
              <DataCategoryPanel
                activeTab={activeTab}
                selectedItem={selectedItem}
                onSelectItem={id => { setSelectedItem(id); setListOpen(false); }}
                compareItems={compareItems}
                onToggleCompare={handleToggleCompare}
                onTabChange={setActiveTab}
                initialSearchQuery={exactMatchResult ? '' : searchTerm}
                initialExpandedIds={exactMatchResult ? [exactMatchResult.subId] : undefined}
              />
              <div className="data-browser-page__list-footer">
                <button type="button" className="data-browser-page__dark-btn" onClick={() => setListOpen(false)}>Close this window</button>
              </div>
            </div>
            <ChartViewerPanel dataItemId={selectedItem} showStandardError={showStandardError} />
          </div>
          <div className="data-browser-page__change-bar">
            <button type="button" className="data-browser-page__dark-btn" onClick={() => setListOpen(true)}>Change data point</button>
          </div>
        </div>
      </div>
      {/* Hidden charts rendered off-screen so html2canvas can capture all selected charts */}
      {showExportModal && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
          {exportIds.map(id => (
            <div key={id} style={{ width: 900, height: 600 }} data-chart-id={id}>
              <ChartViewerPanel dataItemId={id} showStandardError={showStandardError} />
            </div>
          ))}
        </div>
      )}
      <ExportModal
        isOpen={showExportModal}
        selectedFormat={exportFormat}
        onFormatChange={setExportFormat}
        onClose={() => setShowExportModal(false)}
        onApply={handleExportApply}
        isExporting={isExporting}
      />
    </div>
  );
}
