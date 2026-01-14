export interface NavItem {
  id: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface SidebarNavItem extends NavItem {
  icon: string;
}
