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
  onNavigate: (page: Page) => void;
}

export function DataBrowserPage({ currentPage, onNavigate }: DataBrowserPageProps) {
  const [activeTab, setActiveTab] = useState('all-data');
  const [selectedItem, setSelectedItem] = useState('any-child-no-fever-cough-care'); // First item in Child health (A-Z)
  const [compareItems, setCompareItems] = useState<Set<string>>(new Set());
  const [showStandardError, setShowStandardError] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    document.title = 'Pathways | Data browser';
  }, []);

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
    const categories = activeTab === 'all-data'
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
  const allSelected = allVisibleIds.length > 0 && visibleSelectedCount === allVisibleIds.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setCompareItems(new Set());
    } else {
      setCompareItems(new Set(allVisibleIds));
    }
  };

  const handleCompare = () => {
    const itemsParam = Array.from(compareItems).join(',');
    sessionStorage.setItem('compareItems', itemsParam);
    onNavigate('compare-segments');
  };

  const handleExportApply = async () => {
    setIsExporting(true);
    try {
      const { exportCharts } = await import('../../utils/exportCards');
      const ids = compareItems.size > 0 ? Array.from(compareItems) : [selectedItem];
      await exportCharts(ids, exportFormat);
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

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
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            onCompare={handleCompare}
            onExport={() => setShowExportModal(true)}
            showStandardError={showStandardError}
            onToggleStandardError={() => setShowStandardError(prev => !prev)}
          />
          <div className="data-browser-page__panels">
            <DataCategoryPanel
              activeTab={activeTab}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              compareItems={compareItems}
              onToggleCompare={handleToggleCompare}
            />
            <ChartViewerPanel dataItemId={selectedItem} showStandardError={showStandardError} />
          </div>
        </div>
      </div>
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
