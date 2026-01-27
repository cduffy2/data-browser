import { useState, useEffect, useMemo } from 'react';
import { dataCategories } from '../../../data/categories';
import { useAccordion } from '../../../hooks/useAccordion';
import SearchIcon from '../../../assets/icons/Search.svg?react';
import CancelFilledIcon from '../../../assets/icons/CancelFilled.svg?react';
import ChevronUpIcon from '../../../assets/icons/Chevron-Up.svg?react';
import './DataCategoryPanel.css';

interface DataCategoryPanelProps {
  activeTab: string;
  selectedItem: string;
  onSelectItem: (itemId: string) => void;
}

export function DataCategoryPanel({
  activeTab,
  selectedItem,
  onSelectItem
}: DataCategoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isExpanded, toggle, expandMultiple } = useAccordion(['child-health']);

  // Filter and search logic - memoized to avoid recalculation
  const filteredCategories = useMemo(() => {
    let categories = dataCategories;

    // If searching, search across all data regardless of active tab
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      // When searching, show traditional vulnerability domains
      const traditionalVulnerabilityDomains = [
        'woman-experiences',
        'health-mental',
        'household-relationships',
        'household-economics',
        'social-support',
        'human-natural'
      ];

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
      // Show health area-specific subcategories for both health outcomes and vulnerability factors
      categories = dataCategories.map(category => ({
        ...category,
        subcategories: category.subcategories.filter(sub => sub.id === activeTab)
      })).filter(cat => cat.subcategories.length > 0);
    } else {
      // When "all-data" is selected, show traditional vulnerability domains
      const traditionalVulnerabilityDomains = [
        'woman-experiences',
        'health-mental',
        'household-relationships',
        'household-economics',
        'social-support',
        'human-natural'
      ];

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

  // Auto-expand accordions when health area is selected or search has results
  useEffect(() => {
    if (activeTab !== 'all-data') {
      // Expand all accordions when a specific health area is selected
      const allSubIds = filteredCategories.flatMap(cat =>
        cat.subcategories.map(sub => sub.id)
      );
      if (allSubIds.length > 0) {
        expandMultiple(allSubIds);
      }
    } else if (searchQuery.trim()) {
      // Expand matching accordions when searching
      const matchingSubIds = filteredCategories.flatMap(cat =>
        cat.subcategories.map(sub => sub.id)
      );
      if (matchingSubIds.length > 0) {
        expandMultiple(matchingSubIds);
      }
    }
  }, [activeTab, searchQuery, filteredCategories, expandMultiple]);

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
                      {sub.items.map(item => (
                        <button
                          key={item.id}
                          className={`data-category-panel__item ${selectedItem === item.id ? 'data-category-panel__item--active' : ''}`}
                          onClick={() => onSelectItem(item.id)}
                        >
                          <span>{highlightText(item.label)}</span>
                        </button>
                      ))}
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
