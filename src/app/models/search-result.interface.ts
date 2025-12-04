import type { LucideIconData } from 'lucide-angular';

/**
 * Representa un resultado de búsqueda en el sistema de navegación
 */
export interface SearchResult {
  id: string | number;
  label: string;
  route?: string;
  icon: LucideIconData;
  breadcrumb: string; // Ruta jerárquica del item (ej: "Usuarios > Gestión de Usuarios")
  description?: string;
}
