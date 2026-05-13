import { useState, useEffect, useMemo, useRef } from 'react';
import { dataCategories } from '../../../data/categories';
import { useAccordion } from '../../../hooks/useAccordion';
import { Checkbox } from '../../common/Checkbox';
import SearchIcon from '../../../assets/icons/Search.svg?react';
import CancelFilledIcon from '../../../assets/icons/CancelFilled.svg?react';
import ChevronUpIcon from '../../../assets/icons/Chevron-Up.svg?react';
import './DataCategoryPanel.css';

interface DataCategoryPanelProps {
  activeTab: string;
  selectedItem: string;
  onSelectItem: (itemId: string) => void;
  selectedCategory?: string | null;
  onSelectCategory?: (categoryId: string) => void;
  compareItems?: Set<string>;
  onToggleCompare?: (itemId: string) => void;
  onTabChange?: (tabId: string) => void;
  initialSearchQuery?: string;
  initialExpandedIds?: string[];
}

export function DataCategoryPanel({
  activeTab,
  selectedItem,
  onSelectItem,
  selectedCategory = null,
  onSelectCategory,
  compareItems = new Set(),
  onToggleCompare,
  onTabChange,
  initialSearchQuery = '',
  initialExpandedIds,
}: DataCategoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [highlightTerm, setHighlightTerm] = useState(initialSearchQuery);
  const panelRef = useRef<HTMLDivElement>(null);
  const { isExpanded, toggle, expandMultiple, setExpanded } = useAccordion(initialExpandedIds ?? ['child-health']);
  const prevTabRef = useRef(activeTab);
  const savedTabBeforeSearchRef = useRef<string | null>(null);

  // Traditional vulnerability domains (not health-area specific)
  const traditionalVulnerabilityDomains = [
    'woman-experiences',
    'health-mental',
    'household-relationships',
    'household-economics',
    'social-support',
    'human-natural'
  ];

  // Filter and search logic - memoized to avoid recalculation
  const filteredCategories = useMemo(() => {
    let categories = dataCategories;

    // If searching, search across all data regardless of active tab
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      categories = dataCategories.map(category => {
        if (category.id === 'vulnerability-factors') {
          return {
            ...category,
            subcategories: category.subcategories
              .filter(sub => traditionalVulnerabilityDomains.includes(sub.id))
              .map(sub => ({
                ...sub,
                items: sub.items.filter(item =>
                  item.label.toLowerCase().includes(query)
                )
              }))
              .filter(sub => sub.items.length > 0)
          };
        }
        return {
          ...category,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            items: sub.items.filter(item =>
              item.label.toLowerCase().includes(query)
            )
          })).filter(sub => sub.items.length > 0)
        };
      }).filter(cat => cat.subcategories.length > 0);

      return categories;
    }

    // No search query - filter by health area
    if (activeTab !== 'all-data' && activeTab !== '') {
      categories = dataCategories.map(category => {
        if (category.id === 'health-outcomes') {
          // For health outcomes, filter subcategories by the selected health area
          return {
            ...category,
            subcategories: category.subcategories.filter(sub => sub.id === activeTab)
          };
        } else if (category.id === 'vulnerability-factors') {
          // For vulnerability factors, keep traditional domains but filter items by health area
          return {
            ...category,
            subcategories: category.subcategories
              .filter(sub => traditionalVulnerabilityDomains.includes(sub.id))
              .map(sub => ({
                ...sub,
                items: sub.items.filter(item =>
                  item.healthAreas?.includes(activeTab)
                )
              }))
              .filter(sub => sub.items.length > 0)
          };
        }
        return category;
      }).filter(cat => cat.subcategories.length > 0);
    } else {
      // When "all-data" is selected, show all health outcomes and traditional vulnerability domains
      categories = dataCategories.map(category => {
        if (category.id === 'vulnerability-factors') {
          return {
            ...category,
            subcategories: category.subcategories.filter(sub =>
              traditionalVulnerabilityDomains.includes(sub.id)
            )
          };
        }
        return category;
      });
    }

    return categories;
  }, [activeTab, searchQuery]);

  // Handle tab changes: select first item in new tab and expand only its accordion
  useEffect(() => {
    if (activeTab !== prevTabRef.current) {
      prevTabRef.current = activeTab;
      if (activeTab === '') return;

      // Find the first item in the filtered categories
      const firstItem = filteredCategories[0]?.subcategories[0]?.items[0];
      if (firstItem) {
        onSelectItem(firstItem.id);
        // Only expand the accordion containing the first item
        const subId = filteredCategories[0]?.subcategories[0]?.id;
        if (subId) {
          setExpanded([subId]);
        }
      }
    }
  }, [activeTab, filteredCategories, onSelectItem, setExpanded]);

  // When searching, expand matching accordions
  useEffect(() => {
    if (searchQuery.trim()) {
      const matchingSubIds = filteredCategories.flatMap(cat =>
        cat.subcategories.map(sub => sub.id)
      );
      if (matchingSubIds.length > 0) {
        expandMultiple(matchingSubIds);
      }
    }
  }, [searchQuery, filteredCategories, expandMultiple]);

  // When search starts from a non-all-data tab, suppress the active tab highlight.
  // When search is cleared, restore it.
  const prevSearchRef = useRef('');
  useEffect(() => {
    const wasSearching = prevSearchRef.current.trim().length > 0;
    const isSearching = searchQuery.trim().length > 0;
    prevSearchRef.current = searchQuery;

    if (!wasSearching && isSearching) {
      // Search just started
      if (activeTab !== 'all-data' && activeTab !== '') {
        savedTabBeforeSearchRef.current = activeTab;
        onTabChange?.('');
      }
    } else if (wasSearching && !isSearching) {
      // Search just cleared — restore saved tab
      if (savedTabBeforeSearchRef.current !== null) {
        onTabChange?.(savedTabBeforeSearchRef.current);
        savedTabBeforeSearchRef.current = null;
      }
    }
  }, [searchQuery]);

  // Clear yellow highlight when user clicks outside the panel (keeps search/filter intact)
  useEffect(() => {
    if (!highlightTerm) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setHighlightTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [highlightTerm]);

  // Clear search handler
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Highlight search term in text
  const highlightText = (text: string) => {
    if (!highlightTerm.trim()) return text;

    try {
      const query = highlightTerm.trim();
      // Escape special regex characters
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      const parts = text.split(regex);

      return (
        <>
          {parts.map((part, index) => {
            if (!part) return null;
            // Use a new regex for each test to avoid stateful lastIndex issues
            const testRegex = new RegExp(`^${escapedQuery}$`, 'i');
            return testRegex.test(part) ? (
              <mark key={index} className="data-category-panel__highlight">{part}</mark>
            ) : (
              <span key={index}>{part}</span>
            );
          })}
        </>
      );
    } catch (error) {
      console.error('Error highlighting text:', error);
      return text;
    }
  };

  return (
    <div className="data-category-panel" ref={panelRef}>
      <div className="data-category-panel__search">
        <div className="data-category-panel__search-wrapper">
          <input
            type="text"
            placeholder="Search this list"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="data-category-panel__search-input"
          />
          {searchQuery ? (
            <button
              className="data-category-panel__clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <CancelFilledIcon className="data-category-panel__clear-icon" />
            </button>
          ) : (
            <SearchIcon className="data-category-panel__search-icon" />
          )}
        </div>
      </div>

      <div className="data-category-panel__list">
        {filteredCategories.length === 0 ? (
          <div className="data-category-panel__no-results">
            No results found for "{searchQuery}"
          </div>
        ) : (
          filteredCategories.map(category => (
            <div key={category.id} className="data-category-panel__category">
              <div className="data-category-panel__category-header">
                {category.label}
              </div>
              {category.subcategories.map(sub => (
                <div key={sub.id} className={`data-category-panel__subcategory data-category-panel__subcategory--${category.id}`}>
                  <button
                    className={`data-category-panel__accordion-header${selectedCategory === sub.id ? ' data-category-panel__accordion-header--active' : ''}`}
                    onClick={() => { toggle(sub.id); onSelectCategory?.(sub.id); }}
                  >
                    <span className="data-category-panel__accordion-label">{sub.label}</span>
                    <span className="data-category-panel__count-chip">{sub.items.length}</span>
                    <ChevronUpIcon
                      className="data-category-panel__chevron"
                      style={{ transform: isExpanded(sub.id) ? 'rotate(0deg)' : 'rotate(180deg)' }}
                    />
                  </button>
                  {isExpanded(sub.id) && sub.items.length > 0 && (
                    <div className={`data-category-panel__items data-category-panel__items--${category.id}`}>
                      {sub.items.map(item => {
                        const isCompareSelected = compareItems.has(item.id);
                        const hasAnyCompareSelections = compareItems.size > 0;
                        return (
                          <div
                            key={item.id}
                            className={`data-category-panel__item ${selectedItem === item.id ? 'data-category-panel__item--active' : ''} ${isCompareSelected ? 'data-category-panel__item--compare-selected' : ''} ${hasAnyCompareSelections ? 'data-category-panel__item--has-selections' : ''}`}
                            onClick={() => { onSelectItem(item.id); setHighlightTerm(''); }}
                          >
                            <span className="data-category-panel__item-label">{highlightText(item.label)}</span>
                            <div className="data-category-panel__item-checkbox">
                              <Checkbox
                                checked={isCompareSelected}
                                onChange={() => onToggleCompare?.(item.id)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
