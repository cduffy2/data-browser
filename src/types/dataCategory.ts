export interface DataItem {
  id: string;
  label: string;
  healthAreas?: string[];
}

export interface Subcategory {
  id: string;
  label: string;
  items: DataItem[];
}

export interface DataCategory {
  id: string;
  label: string;
  subcategories: Subcategory[];
}
