import { useState, useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { PageHeader } from '../../components/data-browser/PageHeader/PageHeader';
import { DataCategoryPanel } from '../../components/data-browser/DataCategoryPanel/DataCategoryPanel';
import { ChartViewerPanel } from '../../components/data-browser/ChartViewerPanel/ChartViewerPanel';
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

  const handleClearCompare = () => {
    setCompareItems(new Set());
  };

  const handleCompare = () => {
    const itemsParam = Array.from(compareItems).join(',');
    sessionStorage.setItem('compareItems', itemsParam);
    onNavigate('compare-segments');
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
            compareCount={compareItems.size}
            onClearCompare={handleClearCompare}
            onCompare={handleCompare}
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
    </div>
  );
}
