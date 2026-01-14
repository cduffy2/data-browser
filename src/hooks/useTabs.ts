import { useState } from 'react';

export function useTabs(defaultTab: string) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return { activeTab, setActiveTab: handleTabChange };
}
