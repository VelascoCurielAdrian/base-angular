import type { LucideIconData } from 'lucide-angular';

export interface Permission {
  id: number;
  key: string;
  name: string;
}

export interface NavigationItem {
  id: string | number;
  key?: string;
  name?: string;
  label: string;
  icon: LucideIconData;
  route?: string;
  permissions?: Permission[];
  children?: NavigationItem[];
  isActive?: boolean;
  isExpanded?: boolean;
}

export interface NavigationConfig {
  items: NavigationItem[];
}
