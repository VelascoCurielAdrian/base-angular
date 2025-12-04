import type { LucideIconData } from 'lucide-angular';

export interface Permission {
  id: number;
  key: string;
  name: string;
}

/**
 * @deprecated Use NavigationItem from @config/navigation instead
 * Esta interfaz se mantiene solo para compatibilidad con código legacy
 */
export interface NavigationItem {
  id: string | number;
  label: string;
  name?: string; // Alias para label (compatibilidad)
  icon?: LucideIconData | string; // Soporta tanto Lucide como string por compatibilidad
  route?: string;
  key?: string;
  isActive?: boolean;
  isExpanded?: boolean;
  permissions?: Permission[];
}
