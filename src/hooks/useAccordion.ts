import { useState } from 'react';

export function useAccordion(defaultExpanded: string[] = []) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggle = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandMultiple = (ids: string[]) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  };

  const isExpanded = (id: string) => expandedItems.has(id);

  return { expandedItems, toggle, isExpanded, expandMultiple };
}
