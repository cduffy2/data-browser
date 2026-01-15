import { useState, useCallback } from 'react';

export function useAccordion(defaultExpanded: string[] = []) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggle = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandMultiple = useCallback((ids: string[]) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const isExpanded = useCallback((id: string) => expandedItems.has(id), [expandedItems]);

  return { expandedItems, toggle, isExpanded, expandMultiple };
}
