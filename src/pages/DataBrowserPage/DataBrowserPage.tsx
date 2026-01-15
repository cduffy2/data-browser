import { useState, useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
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

  useEffect(() => {
    document.title = 'Pathways | Data browser';
  }, []);

  return (
    <div className="data-browser-page">
      <PrimaryNavBar />
      <div className="data-browser-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="data-browser-page__content">
          <PageHeader activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="data-browser-page__panels">
            <DataCategoryPanel
              activeTab={activeTab}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
            />
            <ChartViewerPanel dataItemId={selectedItem} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
