import type { NavItem, SidebarNavItem } from '../types/navigation';

export const primaryNavItems: NavItem[] = [
  { id: 'welcome', label: 'Welcome', href: '/' },
  { id: 'segmentations', label: 'Segmentations', href: '/segmentations' },
  { id: 'news', label: 'News', href: '/news' },
  { id: 'contact', label: 'Contact', href: '/contact' }
];

export const sidebarNavItems: SidebarNavItem[] = [
  {
    id: 'senegal-overview',
    label: 'Senegal overview',
    icon: 'Location',
    href: '/senegal-overview'
  },
  {
    id: 'compare-segments',
    label: 'Compare segments',
    icon: 'Compare',
    href: '/compare-segments'
  },
  {
    id: 'data-browser',
    label: 'Data browser',
    icon: 'Folder',
    href: '/data-browser',
    active: true
  },
  {
    id: 'prevalence-map',
    label: 'Prevalence map',
    icon: 'Location',
    href: '/prevalence-map'
  },
  {
    id: 'typing-tools',
    label: 'Typing tools',
    icon: 'Leaf',
    href: '/typing-tools'
  }
];
