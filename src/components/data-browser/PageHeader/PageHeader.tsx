import { useEffect, useRef, useState } from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'all-data', label: 'All data' },
  { id: 'health-outcomes', label: 'Health outcomes and behaviours' },
  { id: 'vulnerability-factors', label: 'Vulnerability factors' }
];

export function PageHeader({ activeTab, onTabChange }: PageHeaderProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  useEffect(() => {
    // Measure tabs with semibold font to get maximum width
    const widths = tabsRef.current.map(button => {
      if (!button) return 0;
      const originalWeight = button.style.fontWeight;
      button.style.fontWeight = '600';
      const width = button.offsetWidth;
      button.style.fontWeight = originalWeight;
      return width;
    });
    setTabWidths(widths);
  }, []);

  return (
    <div className="page-header">
      <div className="page-header__content">
        <h1 className="page-header__title">Data browser</h1>
        <p className="page-header__description">
          The Pathways Data Browser helps to understand each data point clearly and
          consistently, relationships to other data, its origin, usage and format
        </p>
      </div>
      <div className="page-header__tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => { tabsRef.current[index] = el; }}
            className={`page-header__tab ${activeTab === tab.id ? 'page-header__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={tabWidths[index] ? { minWidth: `${tabWidths[index]}px` } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
