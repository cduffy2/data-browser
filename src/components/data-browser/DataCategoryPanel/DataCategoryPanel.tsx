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
  compareItems?: Set<string>;
  onToggleCompare?: (itemId: string) => void;
}

export function DataCategoryPanel({
  activeTab,
  selectedItem,
  onSelectItem,
  compareItems = new Set(),
  onToggleCompare
}: DataCategoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isExpanded, toggle, expandMultiple, setExpanded } = useAccordion(['child-health']);
  const prevTabRef = useRef(activeTab);

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
    if (activeTab !== 'all-data') {
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

  // Clear search handler
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Highlight search term in text
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;

    try {
      const query = searchQuery.trim();
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
    <div className="data-category-panel">
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
                    className="data-category-panel__accordion-header"
                    onClick={() => toggle(sub.id)}
                  >
                    <span className="data-category-panel__accordion-label">{sub.label}</span>
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
                            onClick={() => onSelectItem(item.id)}
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
